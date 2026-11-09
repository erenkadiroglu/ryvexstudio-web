import type { APIContext } from "astro";
import { site } from "@/config/site";
import { releasesFeed } from "@/lib/releases";

export async function GET(context: APIContext) {
  return releasesFeed("tr", context.site ?? site.url);
}
