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
      /** "coming-soon" hides store links and shows a "Coming soon" label. */
      status: z.enum(["released", "coming-soon"]).default("released"),
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
      /** Real screenshots from a phone or emulator, in the order they are shown. */
      screenshots: z
        .array(z.object({ src: image(), alt: z.object({ tr: z.string(), en: z.string() }) }))
        .default([]),
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
          /** Optional wording for the children's privacy section, replacing the default text. */
          childrenNote: z.object({ tr: z.string(), en: z.string() }).optional(),
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
      /**
       * English version of the product description. The Markdown body is Turkish;
       * paragraphs here are separated by a blank line.
       */
      aboutEn: z.string().optional(),
      /** Short feature highlights shown on the product page. */
      features: z
        .array(
          z.object({
            title: z.object({ tr: z.string(), en: z.string() }),
            text: z.object({ tr: z.string(), en: z.string() }),
            /** Index of the screenshot that shows this feature, for the feature story. */
            shot: z.number().int().min(0).optional(),
          }),
        )
        .default([]),
      /** Release history, newest first. */
      releases: z
        .array(
          z.object({
            version: z.string(),
            date: z.coerce.date(),
            notes: z.object({ tr: z.array(z.string()), en: z.array(z.string()) }),
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

const journal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/journal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(["tr", "en"]),
    /** Shared key that links the Turkish and English versions of a post. */
    translationKey: z.string(),
    tags: z.array(z.string()).default([]),
    /** Products the post is about, by id; their icons and colours make the post's cover. */
    products: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products, journal };
