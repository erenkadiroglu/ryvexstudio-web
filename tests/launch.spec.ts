import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";
import { appStoreId, freshProducts, launchDateNote, newUntil } from "../src/lib/launch";
import type { Product } from "../src/lib/products";
import integrations from "../src/config/integrations.json" with { type: "json" };

type Front = { status?: string; links?: Record<string, string> };

/** Product ids with their front matter, as the build reads them. */
const products = fs
  .readdirSync("src/content/products")
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const text = fs.readFileSync(path.join("src/content/products", f), "utf8");
    return {
      id: f.replace(/\.md$/, ""),
      data: parse(text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "") as Front,
    };
  });

const fake = (id: string, status: string, releaseDate?: string) =>
  ({
    id,
    data: { status, releaseDate: releaseDate ? new Date(releaseDate) : undefined },
  }) as unknown as Product;

test("new products: 30 days after release, newest first, never before release", () => {
  const now = new Date("2026-11-20T00:00:00Z");
  const list = [
    fake("a", "released", "2026-11-01"),
    fake("b", "released", "2026-11-10"),
    fake("c", "released", "2026-10-01"),
    fake("d", "coming-soon", "2026-11-15"),
    fake("e", "released"),
  ];
  expect(freshProducts(list, now).map((f) => f.product.id)).toEqual(["b", "a"]);
  expect(newUntil(list[0])?.toISOString()).toBe("2026-12-01T00:00:00.000Z");
});

test("launch date notes read naturally in both languages", () => {
  expect(launchDateNote(new Date("2026-12-12"), "Google Play", "tr")).toBe(
    "12 Aralık'ta Google Play üzerinden çıkıyor.",
  );
  expect(launchDateNote(new Date("2027-04-03"), "", "tr")).toBe("3 Nisan'da çıkıyor.");
  expect(launchDateNote(new Date("2027-09-09"), "App Store ve Google Play", "tr")).toBe(
    "9 Eylül'de App Store ve Google Play üzerinden çıkıyor.",
  );
  expect(launchDateNote(new Date("2026-12-12"), "Google Play", "en")).toBe(
    "Out December 12 on Google Play.",
  );
});

test("the App Store id is read from a store link", () => {
  expect(appStoreId("https://apps.apple.com/tr/app/pathwords/id1234567890")).toBe("1234567890");
  expect(appStoreId("https://play.google.com/store/apps/details?id=x")).toBeUndefined();
});

// The phone download bar and the desktop QR code belong to released products with a store link.
for (const product of products) {
  test(`${product.id}: download bar and QR follow its status`, async ({ page }) => {
    const live =
      product.data.status === "released" &&
      Boolean(product.data.links?.appStore || product.data.links?.googlePlay);
    await page.goto(`/urunler/${product.id}`);
    await expect(page.locator("[data-download-bar]")).toHaveCount(live ? 1 : 0);
    await expect(page.locator(".pd-qr")).toHaveCount(live ? 1 : 0);
    await expect(page.locator('meta[name="apple-itunes-app"]')).toHaveCount(
      live && product.data.links?.appStore ? 1 : 0,
    );
  });
}

test("share copies the product link where there is no share sheet", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() => Object.defineProperty(navigator, "share", { value: undefined }));
  await page.goto("/urunler/fileconvert");
  await page.getByRole("button", { name: "Paylaş" }).click();
  await expect(page.getByRole("button", { name: "Bağlantı kopyalandı" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "https://ryvexstudio.com/urunler/fileconvert",
  );
});

test("the visitor's platform is known before the page is drawn", async ({ browser }) => {
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-platform", "android");
  await context.close();
});

test("iOS Universal Links file lists only configured apps", async ({ request }) => {
  const response = await request.get("/.well-known/apple-app-site-association");
  expect(response.ok()).toBe(true);
  const body = await response.json();
  const configured = integrations.appleTeamId
    ? integrations.iosApps.filter((a) => a.bundleId).length
    : 0;
  expect(body.applinks.details).toHaveLength(configured);
});
