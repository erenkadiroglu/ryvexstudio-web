import contact from "./contact.json";
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
  /** Addresses and official accounts, edited in the panel (src/config/contact.json). */
  contactEmail: contact.contactEmail,
  social: contact.social as { name: string; url: string }[],
  supportEmail: contact.supportEmail,
  /** Privacy, KVKK and data deletion requests; the address shown in every privacy notice. */
  privacyEmail: contact.privacyEmail,
  /**
   * Integrations that stay switched off until their value is filled in (src/config/integrations.json):
   * - analyticsToken: Cloudflare Web Analytics site token (cookieless visit counts).
   * - newsletterUser: Buttondown username for the "tell me about new products" form.
   * - admobPublisherId: AdMob publisher ID (pub-…); with it the build writes /app-ads.txt, which
   *   AdMob reads to confirm the apps' ads are sold by this studio.
   * - androidApps: Play app-signing SHA-256 fingerprints per package, for Android App Links.
   * - appleTeamId and iosApps: Apple Developer Team ID and each product's iOS bundle ID, for
   *   Universal Links (a product link opens the installed iPhone app).
   * The security headers and the privacy and cookie texts follow these values at build time.
   */
  integrations: integrations as {
    analyticsToken: string;
    newsletterUser: string;
    admobPublisherId: string;
    androidApps: { package: string; fingerprints: string[] }[];
    appleTeamId: string;
    iosApps: { product: string; bundleId: string }[];
  },
} as const;
