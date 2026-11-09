import fs from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import integrations from "../src/config/integrations.json" with { type: "json" };

// The site's own Content-Security-Policy from the built _headers, applied to every response, so the
// search (a WebAssembly module and a worker) is checked under the policy it will meet in production.
const sitePolicy =
  fs.readFileSync("dist/_headers", "utf8").match(/^\s+Content-Security-Policy: (.+)$/m)?.[1] ?? "";

async function withSitePolicy(page: Page) {
  expect(sitePolicy).toContain("wasm-unsafe-eval");
  // The policy is set by documents and by worker scripts, which get their own.
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() !== "document" && !request.url().includes("pagefind-worker"))
      return route.continue();
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), "content-security-policy": sitePolicy },
    });
  });
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => ["error", "warning"].includes(m.type()) && errors.push(m.text()));
  return errors;
}

test("Ctrl+K finds page text under the site policy and opens the result", async ({ page }) => {
  await withSitePolicy(page);
  const errors = collectErrors(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox", { name: "Sitede ara" });
  await expect(input).toBeFocused();
  await input.fill("gizlilik politikası");
  // A full-text result from the index, not only a shortcut.
  const result = page.getByRole("option", { name: /Gizlilik politikası: FileConvert/ });
  await expect(result).toBeVisible();
  while ((await result.getAttribute("aria-selected")) !== "true") await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/urunler\/fileconvert\/gizlilik$/);
  await expect(page.locator(".search-palette")).not.toHaveAttribute("open");
  expect(errors).toEqual([]);
});

test("the palette searches the English index on English pages", async ({ page }) => {
  await withSitePolicy(page);
  await page.goto("/en", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("combobox", { name: "Search the site" }).fill("privacy policy");
  await expect(page.getByRole("option", { name: /Privacy policy: PathWords/ })).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`open palette meets WCAG 2.2 AA (${theme})`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("rv-theme", t), theme);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Control+k");
    await page.getByRole("combobox").fill("pdf");
    await expect(page.getByRole("option").first()).toBeVisible();
    const results = await new AxeBuilder({ page })
      .include(".search-palette")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}

test("actions run from the palette: theme switch", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("tema");
  await page.getByRole("option", { name: /Karanlık temaya geç/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("a page pointed at is not fetched again when opened", async ({ page }) => {
  const fetched: string[] = [];
  page.on(
    "request",
    (r) => new URL(r.url()).pathname === "/studyo" && fetched.push(r.resourceType()),
  );
  await page.goto("/", { waitUntil: "networkidle" });
  const link = page.locator('header a[href="/studyo"]').first();
  await link.hover();
  await expect.poll(() => fetched.length).toBe(1);
  await link.click();
  await expect(page).toHaveURL(/\/studyo$/);
  await expect(page.locator("h1")).toBeVisible();
  expect(fetched).toHaveLength(1);
});

test("the launch form follows the newsletter switch", async ({ page }) => {
  await page.goto("/urunler/fileconvert");
  await expect(page.locator("form.launch-notify")).toHaveCount(integrations.newsletterUser ? 1 : 0);
});
