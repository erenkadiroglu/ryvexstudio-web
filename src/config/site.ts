import integrations from "./integrations.json";

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
  /**
   * Integrations that stay switched off until their value is filled in (src/config/integrations.json):
   * - analyticsToken: Cloudflare Web Analytics site token (cookieless visit counts).
   * - newsletterUser: Buttondown username for the "tell me about new products" form.
   * - androidApps: Play app-signing SHA-256 fingerprints per package, for Android App Links.
   * The security headers and the privacy and cookie texts follow these values at build time.
   */
  integrations: integrations as {
    analyticsToken: string;
    newsletterUser: string;
    androidApps: { package: string; fingerprints: string[] }[];
  },
} as const;
