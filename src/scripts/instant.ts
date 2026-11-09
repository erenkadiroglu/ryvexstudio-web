/**
 * Instant pages: a page is fetched while the visitor is about to open it (pointer over or focus on
 * a link, the press itself, or, on touch screens, the main links coming into view) and the router
 * then builds the next page from that copy instead of asking the server again.
 *
 * Astro's own prefetch is switched off (astro.config.mjs): its <link rel="prefetch"> copy is not
 * reused by the router's fetch when HTML is served with "max-age=0, must-revalidate", as Cloudflare
 * Pages does, so every click still waited for the network.
 */

/** How long a fetched copy may be used. Content changes rarely; a deploy is picked up after this. */
const FRESH_FOR = 90_000;
/** Pause before a pointer resting on a link counts as intent. */
const HOVER_DELAY = 70;
const MAX_ENTRIES = 16;

type Entry = { at: number; html: Promise<string | null> };
const pages = new Map<string, Entry>();

function keyOf(url: URL) {
  return url.pathname.replace(/\/$/, "") + url.search;
}

function eligible(anchor: HTMLAnchorElement | null): anchor is HTMLAnchorElement {
  if (!anchor || !anchor.href || anchor.target === "_blank" || anchor.hasAttribute("download"))
    return false;
  if (anchor.dataset.astroReload !== undefined || anchor.dataset.astroPrefetch === "false")
    return false;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return false;
  // Not the page we are on, and not files such as feeds, images or the panel.
  if (keyOf(url) === keyOf(new URL(location.href))) return false;
  return !/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.startsWith("/panel");
}

function saving() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  return Boolean(connection?.saveData || /2g/.test(connection?.effectiveType ?? ""));
}

function fresh(entry: Entry | undefined) {
  return entry !== undefined && Date.now() - entry.at < FRESH_FOR;
}

/** Fetches a page once and keeps it for a short while. */
export function warm(href: string) {
  const url = new URL(href, location.href);
  const key = keyOf(url);
  if (fresh(pages.get(key)) || !navigator.onLine) return;
  const html = fetch(url.pathname + url.search, { credentials: "same-origin" })
    .then((res) => {
      const type = res.headers.get("content-type") ?? "";
      // Redirects and anything that is not a page are left to the router.
      return res.ok && !res.redirected && type.startsWith("text/html") ? res.text() : null;
    })
    .catch(() => null);
  pages.set(key, { at: Date.now(), html });
  if (pages.size > MAX_ENTRIES) pages.delete(pages.keys().next().value as string);
}

/* ---------- Intent ---------- */

let hoverTimer = 0;
const linkFrom = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;

document.addEventListener(
  "pointerover",
  (event) => {
    if (event.pointerType !== "mouse" || saving()) return;
    const anchor = linkFrom(event.target);
    if (!eligible(anchor)) return;
    clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => warm(anchor.href), HOVER_DELAY);
  },
  { passive: true },
);
document.addEventListener(
  "pointerout",
  (event) => {
    if (linkFrom(event.target) && !linkFrom(event.relatedTarget)) clearTimeout(hoverTimer);
  },
  { passive: true },
);
// The press itself: the page is on its way before the click (and before the colour flood) begins.
document.addEventListener(
  "pointerdown",
  (event) => {
    const anchor = linkFrom(event.target);
    if (eligible(anchor)) warm(anchor.href);
  },
  { passive: true },
);
document.addEventListener("focusin", (event) => {
  const anchor = linkFrom(event.target);
  if (eligible(anchor) && !saving()) warm(anchor.href);
});

// Touch screens have no hover, so the main links (navigation, marked data-instant, and the product
// links that open with the colour flood) are fetched as they come into view.
const touch = window.matchMedia("(hover: none)");
let viewport: IntersectionObserver | null = null;
document.addEventListener("astro:page-load", () => {
  viewport?.disconnect();
  viewport = null;
  if (!touch.matches || saving()) return;
  viewport = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const anchor = entry.target as HTMLAnchorElement;
        if (eligible(anchor)) warm(anchor.href);
      }
    },
    { rootMargin: "120px" },
  );
  document
    .querySelectorAll("a[data-instant], a[data-flood]")
    .forEach((anchor) => viewport?.observe(anchor));
});

/* ---------- The router uses the copy ---------- */

async function preloadStyles(next: Document) {
  const loaded = new Set(
    [...document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]")].map((l) => l.href),
  );
  const waits: Promise<unknown>[] = [];
  for (const link of next.querySelectorAll<HTMLLinkElement>("head link[rel=stylesheet]")) {
    const href = new URL(link.getAttribute("href") ?? "", location.href).href;
    if (loaded.has(href)) continue;
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "style";
    preload.href = href;
    waits.push(
      new Promise((done) => {
        preload.onload = preload.onerror = done;
      }),
    );
    document.head.append(preload);
  }
  await Promise.all(waits);
}

document.addEventListener("astro:before-preparation", (event) => {
  if (event.formData) return;
  const key = keyOf(event.to);
  const entry = pages.get(key);
  if (!fresh(entry)) return;
  const fallback = event.loader;
  event.loader = async () => {
    const html = await entry!.html;
    // A copy is used once; the next visit to the same page fetches it again.
    pages.delete(key);
    if (html === null || event.signal.aborted) return fallback();
    const next = new DOMParser().parseFromString(html, "text/html");
    next.querySelectorAll("noscript").forEach((el) => el.remove());
    if (!next.querySelector('[name="astro-view-transitions-enabled"]')) return fallback();
    event.newDocument = next;
    await preloadStyles(next);
  };
});
