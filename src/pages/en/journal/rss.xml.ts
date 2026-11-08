import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { site } from "@/config/site";
import { getPosts, postSlug } from "@/lib/journal";

export async function GET(context: APIContext) {
  const posts = await getPosts("en");
  return rss({
    title: `${site.name} Journal`,
    description: site.description.en,
    site: context.site ?? site.url,
    trailingSlash: false,
    customData: "<language>en-US</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/en/journal/${postSlug(post)}`,
    })),
  });
}
