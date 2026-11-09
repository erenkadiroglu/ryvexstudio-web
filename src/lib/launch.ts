import type { Lang } from "@/i18n/ui";
import type { Product } from "@/lib/products";

/** How long a product counts as new after its release date. */
export const NEW_FOR_DAYS = 30;

/** The moment a released product stops being "new", or nothing if it has no release date. */
export function newUntil(product: Product): Date | undefined {
  const { status, releaseDate } = product.data;
  if (status !== "released" || !releaseDate) return undefined;
  return new Date(releaseDate.getTime() + NEW_FOR_DAYS * 86_400_000);
}

/**
 * Products still new at build time, newest first. The page checks the end date again in the
 * browser, so a "new" mark disappears on time even if the site is not rebuilt.
 */
export function freshProducts(products: Product[], now = new Date()) {
  return products
    .map((product) => ({ product, until: newUntil(product) }))
    .filter((f): f is { product: Product; until: Date } => f.until !== undefined && f.until > now)
    .sort((a, b) => b.until.getTime() - a.until.getTime());
}

export const newLabel: Record<Lang, string> = { tr: "Yeni", en: "New" };

/** The numeric App Store id in an App Store link (…/id1234567890), used by Safari's app banner. */
export function appStoreId(url: string | undefined): string | undefined {
  return url?.match(/\/id(\d+)/)?.[1];
}

/** Store links of a released product, in the order shown when the visitor's device is unknown. */
export function storeLinks(product: Product) {
  if (product.data.status !== "released") return [];
  const { appStore, googlePlay } = product.data.links;
  return [
    appStore && { store: "app-store" as const, href: appStore },
    googlePlay && { store: "google-play" as const, href: googlePlay },
  ].filter(Boolean) as { store: "app-store" | "google-play"; href: string }[];
}

// Turkish adds the locative to the month: 12 Aralık'ta, 3 Nisan'da, 9 Eylül'de.
const trMonthLocative = [
  "Ocak'ta",
  "Şubat'ta",
  "Mart'ta",
  "Nisan'da",
  "Mayıs'ta",
  "Haziran'da",
  "Temmuz'da",
  "Ağustos'ta",
  "Eylül'de",
  "Ekim'de",
  "Kasım'da",
  "Aralık'ta",
];

/** "12 Aralık'ta Google Play üzerinden çıkıyor." / "Out December 12 on Google Play." */
export function launchDateNote(date: Date, stores: string, lang: Lang): string {
  if (lang === "tr") {
    const when = `${date.getUTCDate()} ${trMonthLocative[date.getUTCMonth()]}`;
    return stores ? `${when} ${stores} üzerinden çıkıyor.` : `${when} çıkıyor.`;
  }
  const when = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
  return stores ? `Out ${when} on ${stores}.` : `Out ${when}.`;
}
