import type { APIRoute, GetStaticPaths } from "astro";
import { site } from "@/config/site";
import { getProducts, productTagline } from "@/lib/products";
import { productIconDataUri, renderOgImage, type OgOptions } from "@/lib/og";
import { getPosts, postSlug } from "@/lib/journal";

export const getStaticPaths = (async () => {
  const products = await getProducts();
  const paths: { params: { slug: string }; props: OgOptions }[] = [
    { params: { slug: "site-tr" }, props: { title: site.tagline.tr, subtitle: site.description.tr } },
    { params: { slug: "site-en" }, props: { title: site.tagline.en, subtitle: site.description.en } },
  ];
  for (const product of products) {
    for (const lang of ["tr", "en"] as const) {
      paths.push({
        params: { slug: `products/${product.id}-${lang}` },
        props: {
          title: product.data.name,
          subtitle: productTagline(product, lang),
          icon: await productIconDataUri(product.id),
        },
      });
    }
  }
  for (const lang of ["tr", "en"] as const) {
    for (const post of await getPosts(lang)) {
      paths.push({
        params: { slug: `journal/${lang}-${postSlug(post)}` },
        props: { title: post.data.title, subtitle: post.data.description },
      });
    }
  }
  return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as OgOptions);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
