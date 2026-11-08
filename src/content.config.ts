import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Renk #RRGGBB biçiminde olmalı");

const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      type: z.enum(["app", "game", "web"]),
      tagline: z.object({
        tr: z.string(),
        en: z.string().optional(),
      }),
      color: hexColor,
      icon: image(),
      platforms: z.array(z.enum(["ios", "android", "web"])).min(1),
      links: z
        .object({
          appStore: z.url().optional(),
          googlePlay: z.url().optional(),
          web: z.url().optional(),
        })
        .default({}),
      screenshots: z.array(image()).default([]),
      version: z.string().optional(),
      releaseDate: z.coerce.date().optional(),
      supportEmail: z.email().optional(),
      privacyUpdated: z.coerce.date().optional(),
      /** Facts the privacy policy is generated from. Keep them accurate for each product. */
      privacy: z
        .object({
          accountRequired: z.boolean().default(false),
          tracking: z.boolean().default(false),
          childDirected: z.boolean().default(false),
          dataCollected: z
            .array(
              z.object({
                data: z.object({ tr: z.string(), en: z.string() }),
                purpose: z.object({ tr: z.string(), en: z.string() }),
                storage: z.enum(["device", "server"]),
              }),
            )
            .default([]),
          thirdParties: z
            .array(
              z.object({
                name: z.string(),
                purpose: z.object({ tr: z.string(), en: z.string() }),
                policyUrl: z.url(),
              }),
            )
            .default([]),
        })
        .default({
          accountRequired: false,
          tracking: false,
          childDirected: false,
          dataCollected: [],
          thirdParties: [],
        }),
      faq: z
        .array(
          z.object({
            q: z.object({ tr: z.string(), en: z.string() }),
            a: z.object({ tr: z.string(), en: z.string() }),
          }),
        )
        .default([]),
      /** Shown in the scrolling showcase on the home page. */
      featured: z.boolean().default(false),
      order: z.number().int().default(100),
      draft: z.boolean().default(false),
      /** Placeholder entries used until real products are added. Remove before launch. */
      sample: z.boolean().default(false),
    }),
});

export const collections = { products };
