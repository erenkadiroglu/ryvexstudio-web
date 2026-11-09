import { site } from "@/config/site";
import { route, routes, type Lang, type RouteName } from "@/i18n/ui";
import { getProducts, productTagline, type Product } from "@/lib/products";

const organizationId = `${site.url}/#organization`;

export function organizationSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/ryvex-studio-symbol.png`,
    description: site.description[lang],
    founder: { "@type": "Person", name: site.founder },
    email: site.contactEmail,
    sameAs: site.social.map((s) => s.url),
  };
}

export function websiteSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: `${site.url}${lang === "tr" ? "" : route("home", lang)}`,
    inLanguage: lang === "tr" ? "tr-TR" : "en-US",
    publisher: { "@id": organizationId },
  };
}

const operatingSystems = { ios: "iOS", android: "Android", web: "Web browser" } as const;

export function productSchema(product: Product, lang: Lang) {
  const { data } = product;
  const type =
    data.type === "game" ? "VideoGame" : data.type === "web" ? "WebApplication" : "MobileApplication";
  const installUrls =
    data.status === "coming-soon"
      ? []
      : [data.links.appStore, data.links.googlePlay, data.links.web].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: data.name,
    description: productTagline(product, lang),
    url: `${site.url}${route("products", lang)}/${product.id}`,
    image: `${site.url}/og/products/${product.id}-${lang}.png`,
    operatingSystem: data.platforms.map((p) => operatingSystems[p]).join(", "),
    ...(data.type === "game" && { applicationCategory: "GameApplication" }),
    ...(data.version && { softwareVersion: data.version }),
    ...(data.releaseDate && { datePublished: data.releaseDate.toISOString().slice(0, 10) }),
    ...(installUrls.length > 0 && { installUrl: installUrls }),
    publisher: { "@id": organizationId, "@type": "Organization", name: site.name },
    inLanguage: lang === "tr" ? "tr-TR" : "en-US",
  };
}

export function articleSchema(
  post: { title: string; description: string; date: Date },
  url: string,
  lang: Lang,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString().slice(0, 10),
    url: `${site.url}${url}`,
    inLanguage: lang === "tr" ? "tr-TR" : "en-US",
    author: { "@type": "Person", name: site.founder },
    publisher: { "@id": organizationId },
  };
}

const crumbLabels: Record<Lang, Partial<Record<string, string>>> = {
  tr: { products: "Ürünler", studio: "Stüdyo", journal: "Günlük", contact: "İletişim", press: "Basın kiti" },
  en: { products: "Products", studio: "Studio", journal: "Journal", contact: "Contact", press: "Press kit" },
};

/**
 * The page's place in the site for search results ("Ryvex Studio › Ürünler › FileConvert"),
 * read from its address. The home page has none.
 */
export async function breadcrumbSchema(url: URL, title: string | undefined, lang: Lang) {
  const home = route("home", lang);
  const path = url.pathname.replace(/\/$/, "") || "/";
  if (path === home || path === "/") return undefined;
  const products = await getProducts();
  const parts = path.split("/").filter(Boolean);
  const items: { name: string; path: string }[] = [{ name: site.name, path: home }];
  for (let i = lang === "tr" ? 1 : 2; i <= parts.length; i++) {
    const current = `/${parts.slice(0, i).join("/")}`;
    const last = i === parts.length;
    const named = (Object.keys(routes) as RouteName[]).find((r) => routes[r][lang] === current);
    const product = current.startsWith(`${route("products", lang)}/`) && i === (lang === "tr" ? 2 : 3)
      ? products.find((p) => p.id === parts[i - 1])
      : undefined;
    const name = last ? (title ?? product?.data.name) : (product?.data.name ?? (named && crumbLabels[lang][named]));
    if (name) items.push({ name, path: current });
  }
  if (items.length < 2) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}
