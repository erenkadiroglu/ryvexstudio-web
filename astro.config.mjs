// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import integrationsConfig from "./src/config/integrations.json" with { type: "json" };

/**
 * Widens the Content-Security-Policy in dist/_headers only for integrations that are switched on
 * (src/config/integrations.json), so nothing outside the site is allowed until it is used.
 */
/**
 * Builds the site search index with Pagefind (MIT) after every build. Only <main> of pages marked
 * data-pagefind-body is indexed, one index per language; decorative copies (aria-hidden) are left out.
 */
/** @type {import("astro").AstroIntegration} */
const searchIndex = {
  name: "ryvex-search-index",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const pagefind = await import("pagefind");
      const { index, errors } = await pagefind.createIndex({
        excludeSelectors: ['[aria-hidden="true"]', "form"],
      });
      if (!index) throw new Error(`Search index: ${errors.join(", ")}`);
      const added = await index.addDirectory({ path: fileURLToPath(dir) });
      if (added.errors.length) throw new Error(`Search index: ${added.errors.join(", ")}`);
      const written = await index.writeFiles({
        outputPath: fileURLToPath(new URL("pagefind/", dir)),
      });
      if (written.errors.length) throw new Error(`Search index: ${written.errors.join(", ")}`);
      await pagefind.close();
      logger.info(`Search index: ${added.page_count} pages`);
    },
  },
};

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
  // Pages are fetched ahead by src/scripts/instant.ts, which the router then reuses.
  prefetch: false,
  i18n: {
    defaultLocale: "tr",
    locales: ["tr", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    searchIndex,
    securityHeaders,
    react(),
    sitemap({
      // The content panel is not a page for visitors.
      filter: (page) => !page.includes("/panel"),
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
