import { expect, test } from "@playwright/test";

test("help centre narrows questions as you type and by topic", async ({ page }) => {
  await page.goto("/destek");
  const visible = page.locator(".help-item:visible");
  const all = await visible.count();
  expect(all).toBeGreaterThan(5);
  await page.getByLabel("Sorunuzu yazın").fill("internet");
  await expect(visible.first()).toBeVisible();
  expect(await visible.count()).toBeLessThan(all);
  await expect(page.locator(".help-item[open]:visible").first()).toBeVisible();
  await page.getByLabel("Sorunuzu yazın").fill("");
  await page.getByRole("button", { name: "Stüdyo", exact: true }).click();
  await expect(page.locator("[data-help-group]:visible")).toHaveCount(1);
  await page.getByLabel("Sorunuzu yazın").fill("zzzz");
  await expect(page.locator(".help-empty")).toBeVisible();
});

test("roadmap lists every column and links to products", async ({ page }) => {
  await page.goto("/yol-haritasi");
  await expect(page.locator(".roadmap-column")).toHaveCount(3);
  await expect(page.locator(".roadmap-card").first()).toHaveAttribute("href", /\/urunler\//);
});

test("the studio timeline fills as it is read", async ({ page }) => {
  await page.goto("/studyo", { waitUntil: "networkidle" });
  const list = page.locator("[data-timeline]");
  await list.scrollIntoViewIfNeeded();
  await expect(page.locator(".timeline-stop.is-reached").first()).toBeVisible();
});

test("without a saved choice the theme follows the device", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await context.close();
});

test("pages describe their place in the site for search engines", async ({ page }) => {
  await page.goto("/urunler/fileconvert/gizlilik");
  const data = await page.$$eval('script[type="application/ld+json"]', (s) =>
    s.map((x) => JSON.parse(x.textContent ?? "{}")),
  );
  const crumbs = data.find((d) => d["@type"] === "BreadcrumbList");
  expect(crumbs.itemListElement.map((i: { name: string }) => i.name)).toEqual([
    "Ryvex Studio",
    "Ürünler",
    "FileConvert",
    "Gizlilik politikası: FileConvert",
  ]);
});

test("journal posts carry contents, a reading line and sharing", async ({ page }) => {
  await page.goto("/gunluk/2026-11-ryvex-studio", { waitUntil: "networkidle" });
  await expect(page.locator(".journal-toc-link")).not.toHaveCount(0);
  await expect(page.getByRole("button", { name: "Paylaş" })).toBeVisible();
  await page.mouse.wheel(0, 900);
  await expect
    .poll(() =>
      page.locator(".journal-progress span").evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe("matrix(0, 0, 0, 1, 0, 0)");
});

test("screen gallery opens large, moves with the keyboard and closes", async ({ page }) => {
  await page.goto("/urunler/fileconvert", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^Ekranlar/ }).click();
  const gallery = page.getByRole("dialog", { name: "FileConvert ekranları" });
  await expect(gallery).toBeVisible();
  await expect(gallery.locator(".sg-count")).toHaveText(/^1 \//);
  await page.keyboard.press("ArrowRight");
  await expect(gallery.locator(".sg-count")).toHaveText(/^2 \//);
  await expect(gallery.locator(".sg-image")).toHaveAttribute("alt", /FileConvert: /);
  await page.keyboard.press("Escape");
  await expect(gallery).toBeHidden();
});

test("keyboard shortcuts: ? lists them, G then P goes to products", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("?");
  await expect(page.getByRole("dialog", { name: "Klavye kısayolları" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("g");
  await page.keyboard.press("p");
  await expect(page).toHaveURL(/\/urunler$/);
});

test("security.txt names a contact and a future expiry", async ({ request }) => {
  const text = await (await request.get("/.well-known/security.txt")).text();
  expect(text).toMatch(/^Contact: mailto:\S+@\S+$/m);
  const expires = new Date(text.match(/^Expires: (.+)$/m)?.[1] ?? "");
  expect(expires.getTime()).toBeGreaterThan(Date.now());
});

test("the footer says the site uses no cookies and links to the policy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Bu site çerez kullanmaz" })).toHaveAttribute(
    "href",
    "/cerez-politikasi",
  );
});
