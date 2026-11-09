import { expect, test } from "@playwright/test";

/**
 * Speed budget: what a first visit downloads before the visitor scrolls (uncompressed bytes, so the
 * numbers do not depend on the host's compression). A change that goes over a limit fails here;
 * raise a limit only on purpose, in the same change that needs it.
 */
const KB = 1024;
const budgets: { path: string; total: number; script: number; image?: number }[] = [
  { path: "/", total: 520 * KB, script: 80 * KB, image: 220 * KB },
  { path: "/urunler", total: 640 * KB, script: 320 * KB, image: 120 * KB },
  { path: "/urunler/fileconvert", total: 380 * KB, script: 80 * KB, image: 120 * KB },
  { path: "/studyo", total: 320 * KB, script: 80 * KB },
  { path: "/gunluk/2026-11-ryvex-studio", total: 300 * KB, script: 80 * KB },
  { path: "/destek", total: 320 * KB, script: 80 * KB },
];
const shared = { stylesheet: 110 * KB, font: 90 * KB };

for (const budget of budgets) {
  test(`${budget.path} stays within its download budget`, async ({ page }) => {
    const bytes: Record<string, number> = {};
    page.on("response", async (response) => {
      try {
        const body = await response.body();
        const kind = response.request().resourceType();
        bytes[kind] = (bytes[kind] ?? 0) + body.length;
      } catch {
        /* redirects and aborted requests have no body */
      }
    });
    await page.goto(budget.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const total = Object.values(bytes).reduce((a, b) => a + b, 0);
    const report = Object.entries(bytes)
      .map(([k, v]) => `${k} ${Math.round(v / KB)}KB`)
      .join(", ");
    expect(total, `total (${report})`).toBeLessThanOrEqual(budget.total);
    expect(bytes.script ?? 0, `scripts (${report})`).toBeLessThanOrEqual(budget.script);
    expect(bytes.stylesheet ?? 0, `styles (${report})`).toBeLessThanOrEqual(shared.stylesheet);
    expect(bytes.font ?? 0, `fonts (${report})`).toBeLessThanOrEqual(shared.font);
    if (budget.image)
      expect(bytes.image ?? 0, `images (${report})`).toBeLessThanOrEqual(budget.image);
  });
}
