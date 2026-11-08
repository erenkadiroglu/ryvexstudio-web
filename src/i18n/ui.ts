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
    "nav.menu": "Menü",
    "nav.close": "Menüyü kapat",
    "theme.toDark": "Karanlık temaya geç",
    "theme.toLight": "Aydınlık temaya geç",
    "footer.products": "Ürünler",
    "footer.studio": "Stüdyo",
    "footer.legal": "Yasal",
    "footer.press": "Basın kiti",
    "footer.privacy": "Gizlilik",
    "footer.rights": "Tüm hakları saklıdır.",
    "skip.content": "İçeriğe geç",
  },
  en: {
    "nav.products": "Products",
    "nav.studio": "Studio",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close menu",
    "theme.toDark": "Switch to dark theme",
    "theme.toLight": "Switch to light theme",
    "footer.products": "Products",
    "footer.studio": "Studio",
    "footer.legal": "Legal",
    "footer.press": "Press kit",
    "footer.privacy": "Privacy",
    "footer.rights": "All rights reserved.",
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

/** Turkish routes are unprefixed; English routes live under /en. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}
