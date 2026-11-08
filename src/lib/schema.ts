import { site } from "@/config/site";
import { route, type Lang } from "@/i18n/ui";
import { productTagline, type Product } from "@/lib/products";

const organizationId = `${site.url}/#organization`;

export function organizationSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    url: site.url,
    logo: `${site.url}/press/ryvex-studio-symbol.png`,
    description: site.description[lang],
    founder: { "@type": "Person", name: site.founder },
    email: site.contactEmail,
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
  const installUrls = [data.links.appStore, data.links.googlePlay, data.links.web].filter(Boolean);

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
