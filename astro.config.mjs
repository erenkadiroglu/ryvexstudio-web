// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ryvexstudio.com",
  trailingSlash: "never",
  i18n: {
    defaultLocale: "tr",
    locales: ["tr", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "tr",
        locales: { tr: "tr-TR", en: "en-US" },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
