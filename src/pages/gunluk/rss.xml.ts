import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { site } from "@/config/site";
import { getPosts, postSlug } from "@/lib/journal";

export async function GET(context: APIContext) {
  const posts = await getPosts("tr");
  return rss({
    title: `${site.name} Günlük`,
    description: site.description.tr,
    site: context.site ?? site.url,
    trailingSlash: false,
    customData: "<language>tr-TR</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/gunluk/${postSlug(post)}`,
    })),
  });
}
