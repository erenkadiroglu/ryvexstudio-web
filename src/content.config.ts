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
      tagline: z.string(),
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
      order: z.number().int().default(100),
      draft: z.boolean().default(false),
    }),
});

export const collections = { products };
