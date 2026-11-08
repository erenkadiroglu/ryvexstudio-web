export const site = {
  name: "Ryvex Studio",
  url: "https://ryvexstudio.com",
  tagline: {
    tr: "Her ekranda aynı özen.",
    en: "The same care, on every screen.",
  },
  /** The tagline broken into the lines used by the home page headline. */
  taglineLines: {
    tr: ["Her ekranda", "aynı özen."],
    en: ["The same care,", "on every screen."],
  },
  description: {
    tr: "Ryvex Studio, mobil uygulamalar, oyunlar ve web projeleri üreten bağımsız bir stüdyodur.",
    en: "Ryvex Studio is an independent studio making mobile apps, games and web products.",
  },
  founder: "Eren KADİROĞLU",
  contactEmail: "hello@ryvexstudio.com",
  /** Official studio accounts. All use the handle @ryvexstudio. */
  social: [
    { name: "Instagram", url: "https://www.instagram.com/ryvexstudio" },
    { name: "TikTok", url: "https://www.tiktok.com/@ryvexstudio" },
    { name: "YouTube", url: "https://www.youtube.com/@ryvexstudio" },
  ],
  supportEmail: "destek@ryvexstudio.com",
} as const;
