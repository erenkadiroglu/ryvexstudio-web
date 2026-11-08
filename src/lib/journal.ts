import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "@/i18n/ui";

export type Post = CollectionEntry<"journal">;

/** Posts in one language, newest first. The URL slug is the file name. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection("journal", ({ data }) => data.lang === lang && !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postSlug(post: Post): string {
  return post.id.split("/").pop() ?? post.id;
}

export function readingMinutes(post: Post): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
