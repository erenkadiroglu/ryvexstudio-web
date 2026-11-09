import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

async function openDemo(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.locator(".demo-section").scrollIntoViewIfNeeded();
}

async function axe(page: Page, selector: string) {
  const results = await new AxeBuilder({ page }).include(selector).withTags(tags).analyze();
  return results.violations.map((v) => `${v.id}: ${v.help}`);
}

test("PathWords demo: the first level is solved by tapping letters, from either end", async ({
  page,
}) => {
  await openDemo(page, "/urunler/pathwords");
  const tile = (r: number, c: number) => page.locator(`.pw-tile[data-r="${r}"][data-c="${c}"]`);
  await expect(tile(0, 1)).toBeVisible();
  for (const [r, c] of [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
  ])
    await tile(r, c).click(); // FISH
  for (const [r, c] of [
    [2, 0],
    [2, 1],
    [1, 1],
    [1, 0],
  ])
    await tile(r, c).click(); // RAEB = BEAR backwards
  await expect(page.locator(".pw-word.is-done")).toHaveCount(2);
  for (const [r, c] of [
    [3, 1],
    [3, 2],
    [2, 2],
    [2, 3],
  ])
    await tile(r, c).click(); // LION
  await expect(page.locator(".pw-end")).toBeVisible();
  await expect(page.getByText("✓ Aslan")).toBeVisible();
  expect(await axe(page, ".demo-section")).toEqual([]);
});

test("PathWords demo can be played with the keyboard", async ({ page }) => {
  await openDemo(page, "/en/products/pathwords");
  const first = page.locator('.pw-tile[data-r="1"][data-c="0"]');
  await expect(first).toBeVisible();
  await first.focus();
  // B → E → A → R: Enter on each letter, arrows to move.
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Enter");
  await expect(page.locator(".pw-word.is-done")).toHaveCount(1);
});

test("PerSayar demo works out the hand from the rack", async ({ page }) => {
  await openDemo(page, "/urunler/persayar");
  await page.getByRole("button", { name: "Seri Diz" }).click();
  await expect(page.locator(".ps-result")).toContainText("Seri: 103 puan");
  await expect(page.locator(".ps-result")).toContainText("El açabilir");
  await page.getByRole("button", { name: "Çift Diz" }).click();
  await expect(page.locator(".ps-result")).toContainText("Çift: 1");
  await expect(page.locator(".ps-result")).toContainText("Henüz açamaz");
  expect(await axe(page, ".demo-section")).toEqual([]);
});

test("FileConvert demo: turn, delete, reorder and save", async ({ page }) => {
  await openDemo(page, "/urunler/fileconvert");
  await page.getByRole("button", { name: "Döndür: Sayfa 3" }).click();
  await page.getByRole("button", { name: "Sil: Sayfa 5" }).click();
  await page.getByRole("button", { name: "Sola taşı: Sayfa 6" }).click();
  await page.getByRole("button", { name: "Kaydet" }).click();
  await expect(page.locator(".fc-status")).toContainText(
    "5 sayfalık yeni PDF (sıra: 1, 2, 3, 6, 4)",
  );
  expect(await axe(page, ".demo-section")).toEqual([]);
});

for (const theme of ["light", "dark"] as const) {
  test(`demos meet WCAG 2.2 AA in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("rv-theme", t), theme);
    for (const path of ["/urunler/pathwords", "/urunler/persayar", "/urunler/fileconvert"]) {
      await openDemo(page, path);
      await expect(page.locator(".demo-stage > *").first()).toBeVisible();
      expect(await axe(page, ".demo-section"), path).toEqual([]);
    }
  });
}

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
