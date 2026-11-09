export const languages = {
  tr: "Türkçe",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "tr";

export const ui = {
  tr: {
    "nav.products": "Ürünler",
    "nav.studio": "Stüdyo",
    "nav.contact": "İletişim",
    "nav.journal": "Günlük",
    "nav.menu": "Menü",
    "nav.close": "Menüyü kapat",
    "theme.toDark": "Karanlık temaya geç",
    "theme.toLight": "Aydınlık temaya geç",
    "footer.products": "Ürünler",
    "footer.studio": "Stüdyo",
    "footer.legal": "Yasal",
    "footer.press": "Basın kiti",
    "footer.allProducts": "Tüm ürünler",
    "footer.privacy": "Gizlilik",
    "footer.terms": "Kullanım Koşulları",
    "footer.kvkk": "KVKK Aydınlatma Metni",
    "footer.cookies": "Çerez Politikası",
    "footer.accessibility": "Erişilebilirlik",
    "footer.rights": "Tüm hakları saklıdır.",
    "footer.follow": "Takip edin",
    "skip.content": "İçeriğe geç",
  },
  en: {
    "nav.products": "Products",
    "nav.studio": "Studio",
    "nav.contact": "Contact",
    "nav.journal": "Journal",
    "nav.menu": "Menu",
    "nav.close": "Close menu",
    "theme.toDark": "Switch to dark theme",
    "theme.toLight": "Switch to light theme",
    "footer.products": "Products",
    "footer.studio": "Studio",
    "footer.legal": "Legal",
    "footer.press": "Press kit",
    "footer.allProducts": "All products",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms of Use",
    "footer.kvkk": "Personal Data Notice",
    "footer.cookies": "Cookie Policy",
    "footer.accessibility": "Accessibility",
    "footer.rights": "All rights reserved.",
    "footer.follow": "Follow us",
    "skip.content": "Skip to content",
  },
} as const;

export type UiKey = keyof (typeof ui)["tr"];

export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split("/");
  return segment in languages ? (segment as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Localized paths for every top-level page. Turkish is unprefixed. */
export const routes = {
  home: { tr: "/", en: "/en" },
  products: { tr: "/urunler", en: "/en/products" },
  studio: { tr: "/studyo", en: "/en/studio" },
  contact: { tr: "/iletisim", en: "/en/contact" },
  press: { tr: "/basin", en: "/en/press" },
  privacy: { tr: "/gizlilik", en: "/en/privacy" },
  journal: { tr: "/gunluk", en: "/en/journal" },
  terms: { tr: "/kullanim-kosullari", en: "/en/terms" },
  kvkk: { tr: "/kvkk", en: "/en/personal-data" },
  cookies: { tr: "/cerez-politikasi", en: "/en/cookies" },
  accessibility: { tr: "/erisilebilirlik", en: "/en/accessibility" },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteName = keyof typeof routes;

export function route(name: RouteName, lang: Lang): string {
  return routes[name][lang];
}

/** Localized sub-page segments, e.g. /urunler/notora/gizlilik <-> /en/products/notora/privacy */
const subpageSegments: Record<string, Record<Lang, string>> = {
  gizlilik: { tr: "gizlilik", en: "privacy" },
  privacy: { tr: "gizlilik", en: "privacy" },
  destek: { tr: "destek", en: "support" },
  support: { tr: "destek", en: "support" },
};

/**
 * Path of the same page in the other language. Product detail pages share
 * their slug across languages; anything unknown falls back to the home page.
 */
export function alternatePath(url: URL, target: Lang): string {
  const path = url.pathname.replace(/\/$/, "") || "/";
  for (const paths of Object.values(routes)) {
    for (const p of Object.values(paths)) {
      if (path === p) return paths[target];
      if (path.startsWith(`${p}/`) && p !== "/" && p !== "/en") {
        const rest = path
          .slice(p.length)
          .split("/")
          .map((segment) => subpageSegments[segment]?.[target] ?? segment)
          .join("/");
        return `${paths[target]}${rest}`;
      }
    }
  }
  return routes.home[target];
}

/** Turkish routes are unprefixed; English routes live under /en. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}
