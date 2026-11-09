import { expect, test } from "@playwright/test";

/**
 * Visual comparison: key screens are compared with reference images, so an unintended change to
 * the design is caught before it is merged. Fonts render slightly differently on every machine, so
 * the references are made by CI itself and the comparison runs only there (see README, "Görsel
 * karşılaştırma").
 */
test.skip(!process.env.CI, "Reference images are made on CI; the comparison runs there.");

const screens = [
  { name: "home", path: "/", theme: "light" },
  { name: "home-dark", path: "/", theme: "dark" },
  { name: "products", path: "/urunler", theme: "light" },
  { name: "product", path: "/urunler/fileconvert", theme: "light" },
  { name: "product-dark", path: "/urunler/pathwords", theme: "dark" },
  { name: "studio", path: "/studyo", theme: "light" },
  { name: "help", path: "/destek", theme: "light" },
  { name: "roadmap", path: "/yol-haritasi", theme: "light" },
  { name: "journal-post", path: "/gunluk/2026-11-ryvex-studio", theme: "light" },
  { name: "contact-en", path: "/en/contact", theme: "light" },
] as const;

for (const screen of screens) {
  for (const size of [
    { label: "desktop", width: 1440, height: 900 },
    { label: "phone", width: 390, height: 844 },
  ]) {
    test(`${screen.name} looks as designed (${size.label})`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.addInitScript((t) => {
        localStorage.setItem("rv-theme", t);
        sessionStorage.setItem("rv-intro", "1");
      }, screen.theme);
      await page.goto(screen.path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${screen.name}-${size.label}.png`, {
        animations: "disabled",
        caret: "hide",
        maxDiffPixelRatio: 0.01,
      });
    });
  }
}
