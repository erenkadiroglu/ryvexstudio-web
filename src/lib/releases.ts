import rss from "@astrojs/rss";
import { site } from "@/config/site";
import { route, type Lang } from "@/i18n/ui";
import { getProducts } from "@/lib/products";

/** One feed of every product's release notes, newest first, in the given language. */
export async function releasesFeed(lang: Lang, siteUrl: URL | string) {
  const products = await getProducts();
  const items = products
    .flatMap((product) =>
      product.data.releases.map((release) => ({
        title: `${product.data.name} ${release.version}`,
        description: release.notes[lang].join(" "),
        pubDate: release.date,
        link: `${route("products", lang)}/${product.id}`,
      })),
    )
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({
    title: lang === "tr" ? `${site.name} sürüm notları` : `${site.name} release notes`,
    description:
      lang === "tr"
        ? "Ryvex Studio ürünlerinin yeni sürümleri ve yenilikleri."
        : "New versions and what changed in Ryvex Studio products.",
    site: siteUrl,
    trailingSlash: false,
    customData: `<language>${lang === "tr" ? "tr-TR" : "en-US"}</language>`,
    items,
  });
}
