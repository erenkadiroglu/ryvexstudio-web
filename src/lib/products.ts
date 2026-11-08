import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "@/i18n/ui";

export type Product = CollectionEntry<"products">;
export type ProductType = Product["data"]["type"];
export type Platform = Product["data"]["platforms"][number];

/** Turkish URL values for the product type filter, e.g. /urunler?tur=oyun */
export const typeSlugs: Record<ProductType, string> = {
  app: "uygulama",
  game: "oyun",
  web: "web",
};

export const typeLabels: Record<Lang, Record<ProductType, string>> = {
  tr: { app: "Uygulama", game: "Oyun", web: "Web" },
  en: { app: "App", game: "Game", web: "Web" },
};

export const typePluralLabels: Record<Lang, Record<ProductType, string>> = {
  tr: { app: "Uygulamalar", game: "Oyunlar", web: "Web" },
  en: { app: "Apps", game: "Games", web: "Web" },
};

export const platformLabels: Record<Lang, Record<Platform, string>> = {
  tr: { ios: "iOS", android: "Android", web: "Tarayıcı" },
  en: { ios: "iOS", android: "Android", web: "Browser" },
};

export async function getProducts(): Promise<Product[]> {
  const entries = await getCollection("products", ({ data }) => !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export function productTagline(product: Product, lang: Lang): string {
  return product.data.tagline[lang] ?? product.data.tagline.tr;
}

/** "Oyun, iOS ve Android" style caption used under each product on the wall. */
export function productCaption(product: Product, lang: Lang): string {
  const type = typeLabels[lang][product.data.type];
  const platforms = product.data.platforms.map((p) => platformLabels[lang][p]);
  const joiner = lang === "tr" ? " ve " : " and ";
  const list =
    platforms.length > 1
      ? `${platforms.slice(0, -1).join(", ")}${joiner}${platforms.at(-1)}`
      : platforms[0];
  return `${type}, ${list}`;
}

/** Plain, serializable shape passed to React islands. */
export interface WallItem {
  id: string;
  name: string;
  type: ProductType;
  caption: string;
  href: string;
  iconSrc: string;
  color: string;
  /** Short status label, e.g. "Yakında", for products not yet in stores. */
  status?: string;
}

export const comingSoonLabel: Record<Lang, string> = { tr: "Yakında", en: "Coming soon" };

export function toWallItem(product: Product, lang: Lang): WallItem {
  const base = lang === "tr" ? "/urunler" : "/en/products";
  return {
    id: product.id,
    name: product.data.name,
    type: product.data.type,
    caption: productCaption(product, lang),
    href: `${base}/${product.id}`,
    iconSrc: product.data.icon.src,
    color: product.data.color,
    status: product.data.status === "coming-soon" ? comingSoonLabel[lang] : undefined,
  };
}
