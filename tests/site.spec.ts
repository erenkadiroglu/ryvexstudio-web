import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { builtPages } from "./pages";

const pages = builtPages();

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("rv-theme", t), theme);
    });

    for (const url of pages) {
      test(`${url} loads cleanly and meets WCAG 2.2 AA`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

        const response = await page.goto(url, { waitUntil: "networkidle" });
        expect(response?.status(), "status").toBe(200);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}

test("internal links point to existing pages", async ({ page }) => {
  const known = new Set(pages);
  const broken: string[] = [];
  for (const url of pages) {
    await page.goto(url);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const clean = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
      if (!known.has(clean) && !/\.(xml|svg|png|jpg|webmanifest)$/.test(clean))
        broken.push(`${url} -> ${href}`);
    }
  }
  expect(broken).toEqual([]);
});
