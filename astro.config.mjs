// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readFile, writeFile } from "node:fs/promises";
import integrationsConfig from "./src/config/integrations.json" with { type: "json" };

/**
 * Widens the Content-Security-Policy in dist/_headers only for integrations that are switched on
 * (src/config/integrations.json), so nothing outside the site is allowed until it is used.
 */
/** @type {import("astro").AstroIntegration} */
const securityHeaders = {
  name: "ryvex-security-headers",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const file = new URL("_headers", dir);
      let headers = await readFile(file, "utf8");
      /** @param {string} directive @param {string} host */
      const add = (directive, host) => {
        headers = headers.replace(new RegExp(`(${directive} [^;]*)`), `$1 ${host}`);
      };
      if (integrationsConfig.analyticsToken) {
        add("script-src", "https://static.cloudflareinsights.com");
        add("connect-src", "https://cloudflareinsights.com");
      }
      if (integrationsConfig.newsletterUser) add("form-action", "https://buttondown.com");
      await writeFile(file, headers);
    },
  },
};

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
    securityHeaders,
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
