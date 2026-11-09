import roadmapData from "@/config/roadmap.json";
import timelineData from "@/config/timeline.json";
import type { Lang } from "@/i18n/ui";

/** Both are edited in the panel (Ayarlar › Yol haritası, Stüdyonun hikâyesi). */
type Text = { tr: string; en?: string };

export type RoadmapStatus = "now" | "next" | "done";
export const roadmap = roadmapData as {
  updated: string;
  items: { product: string; status: RoadmapStatus; title: Text }[];
};

export const timeline = timelineData as { items: { date?: string; title: Text }[] };

export const text = (t: Text, lang: Lang) => (lang === "en" ? (t.en ?? t.tr) : t.tr);

/** "2026-10" → "Ekim 2026" / "October 2026". */
export function monthLabel(value: string, lang: Lang) {
  const [y, m] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}
