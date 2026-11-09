/**
 * Interaction and scroll motion for the site.
 * Everything here is skipped for visitors who prefer reduced motion.
 */

import Lenis from "lenis";
import { navigate } from "astro:transitions/client";
import "lenis/dist/lenis.css";

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* ---------- Smooth scrolling ---------- */

// A light, inertial scroll on top of the native one; sticky, anchors and keyboard keep working.
// Rebuilt after every client-side navigation, because the swap replaces <html>'s classes.
let lenis: Lenis | null = null;

function startSmoothScroll() {
  lenis?.destroy();
  lenis = null;
  if (reducedMotion.matches) return;
  lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
}

/* ---------- Colour flood: a product's colour spreads from the click, its page opens out of it ---------- */

const FLOOD_IN = 560;
const FLOOD_OUT = 520;

document.addEventListener("click", (event) => {
  if (reducedMotion.matches || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-flood]");
  if (!link || link.target === "_blank" || link.origin !== location.origin) return;
  event.preventDefault();
  const flood = document.createElement("div");
  flood.className = "flood";
  flood.style.backgroundColor = link.dataset.flood ?? "";
  // Appended to <html>, not <body>, so it stays in place while the page underneath is swapped.
  root.append(flood);
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;
  flood
    .animate(
      { clipPath: [`circle(0px at ${x} ${y})`, `circle(150vmax at ${x} ${y})`] },
      { duration: FLOOD_IN, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
    )
    .finished.then(() => navigate(link.href));
  // Capture phase, so this runs before the router's own link handler.
}, true);

function clearFlood() {
  for (const flood of document.querySelectorAll<HTMLElement>(".flood")) {
    flood
      .animate({ opacity: [1, 0] }, { duration: FLOOD_OUT, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "forwards" })
      .finished.then(() => flood.remove());
  }
}

/* ---------- Page tint ---------- */

/** Tints the page ground (used by the product wall). */
function setTint(color: string | undefined) {
  if (color) root.style.setProperty("--rv-tint", color);
  else root.style.removeProperty("--rv-tint");
}

/** Tints only the dark showcase band, never the page or header. */
function setBandTint(color: string | undefined) {
  if (color) root.style.setProperty("--rv-band-tint", color);
  else root.style.removeProperty("--rv-band-tint");
}

/* ---------- Product wall: lift, tilt and tint (event delegation, bound once) ---------- */

const MAX_TILT = 8;

document.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const link = (event.target as Element | null)?.closest<HTMLElement>(".wall-link");
  if (!link) return;
  const icon = link.querySelector<HTMLElement>(".wall-icon");
  if (!icon) return;
  const rect = icon.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  link.classList.add("is-tilting");
  icon.style.setProperty("--ry", `${(x * MAX_TILT * 2).toFixed(2)}deg`);
  icon.style.setProperty("--rx", `${(-y * MAX_TILT * 2).toFixed(2)}deg`);
});

document.addEventListener("pointerover", (event) => {
  if (reducedMotion.matches) return;
  const link = (event.target as Element | null)?.closest<HTMLElement>(".wall-link");
  if (link) setTint(link.dataset.color);
});

document.addEventListener("pointerout", (event) => {
  const link = (event.target as Element | null)?.closest<HTMLElement>(".wall-link");
  if (!link || link.contains(event.relatedTarget as Node | null)) return;
  link.classList.remove("is-tilting");
  const icon = link.querySelector<HTMLElement>(".wall-icon");
  icon?.style.removeProperty("--rx");
  icon?.style.removeProperty("--ry");
  setTint(undefined);
});

/* ---------- Magnetic buttons: primary calls to action lean toward the pointer ---------- */

const MAGNET_RANGE = 40;
const MAGNET_PULL = 0.25;
const MAGNET_MAX = 8;
let magnet: HTMLElement | null = null;

const releaseMagnet = () => {
  if (magnet) magnet.style.transform = "";
  magnet = null;
};

document.addEventListener(
  "pointermove",
  (event) => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const candidates = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    let found: HTMLElement | null = null;
    let fx = 0;
    let fy = 0;
    for (const el of candidates) {
      const r = el.getBoundingClientRect();
      if (
        event.clientX < r.left - MAGNET_RANGE || event.clientX > r.right + MAGNET_RANGE ||
        event.clientY < r.top - MAGNET_RANGE || event.clientY > r.bottom + MAGNET_RANGE
      ) continue;
      found = el;
      const clampPx = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
      fx = clampPx((event.clientX - (r.left + r.width / 2)) * MAGNET_PULL);
      fy = clampPx((event.clientY - (r.top + r.height / 2)) * MAGNET_PULL);
      break;
    }
    if (found !== magnet) releaseMagnet();
    if (found) {
      magnet = found;
      found.style.transition = "transform 250ms cubic-bezier(0.2, 0.7, 0.2, 1)";
      found.style.transform = `translate(${fx.toFixed(1)}px, ${fy.toFixed(1)}px)`;
    }
  },
  { passive: true },
);

/* ---------- Per page: reveal the wall and run the showcase ---------- */

let observers: IntersectionObserver[] = [];
// Listeners added per page are removed through this controller before the next swap.
let pageListeners = new AbortController();

function revealWalls() {
  const walls = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reducedMotion.matches) {
    walls.forEach((wall) => wall.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  walls.forEach((wall) => observer.observe(wall));
  observers.push(observer);
}

function runShowcase() {
  const showcase = document.querySelector<HTMLElement>(".showcase");
  if (!showcase) return;
  const steps = [...showcase.querySelectorAll<HTMLElement>(".showcase-step")];
  const screens = [...showcase.querySelectorAll<HTMLElement>(".showcase-screen")];
  const device = showcase.querySelector<HTMLElement>(".showcase-device");

  const rail = [...showcase.querySelectorAll<HTMLButtonElement>("[data-rail]")];
  rail.forEach((button, i) =>
    button.addEventListener(
      "click",
      () => {
        const step = steps[i];
        if (!step) return;
        const y = step.getBoundingClientRect().top + window.scrollY - (window.innerHeight - step.offsetHeight) / 2;
        if (lenis) lenis.scrollTo(y);
        else window.scrollTo({ top: y });
      },
      { signal: pageListeners.signal },
    ),
  );

  const activate = (index: number) => {
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    screens.forEach((screen, i) => screen.classList.toggle("is-active", i === index));
    rail.forEach((button, i) => {
      button.classList.toggle("is-active", i === index);
      if (i === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    const step = steps[index];
    if (device && step) device.dataset.kind = step.dataset.kind ?? "phone";
    if (!reducedMotion.matches) setBandTint(step?.dataset.color);
  };

  const stepObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(steps.indexOf(entry.target as HTMLElement));
      }
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  steps.forEach((step) => stepObserver.observe(step));

  const sectionObserver = new IntersectionObserver(
    ([entry]) => {
      showcase.classList.toggle("is-in-view", entry.isIntersecting);
    },
    { rootMargin: "-30% 0px -30% 0px" },
  );
  sectionObserver.observe(showcase);

  activate(0);
  observers.push(stepObserver, sectionObserver);
}

/* ---------- Reveal on view: closing band and footer name, once each ---------- */

function revealOnView() {
  root.classList.toggle("motion-ok", !reducedMotion.matches);
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal-on-view]");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -20% 0px" },
  );
  targets.forEach((t) => observer.observe(t));
  observers.push(observer);
}

/* ---------- Product page opening: as you scroll, the phone turns and steps back ---------- */

function runProductHero() {
  const hero = document.querySelector<HTMLElement>("[data-pd-hero]");
  const phone = hero?.querySelector<HTMLElement>(".pd-phone > *");
  if (!hero || !phone || reducedMotion.matches || phone.offsetParent === null) return;
  let frame = 0;
  const render = () => {
    frame = 0;
    const progress = clamp(window.scrollY / Math.max(1, hero.offsetHeight));
    phone.style.transform =
      `translate3d(${(-progress * 40).toFixed(1)}px, ${(progress * 60).toFixed(1)}px, 0) ` +
      `rotateY(${(-progress * 18).toFixed(2)}deg) rotateX(${(progress * 6).toFixed(2)}deg) scale(${(1 - progress * 0.08).toFixed(3)})`;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  window.addEventListener("scroll", schedule, { passive: true, signal: pageListeners.signal });
  render();
}

/* ---------- Results: each figure counts up once, from zero to its real value ---------- */

function runCounts() {
  const counters = [...document.querySelectorAll<HTMLElement>("[data-count]")];
  if (!counters.length || reducedMotion.matches) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        const target = Number(el.dataset.count);
        const start = performance.now();
        const step = (now: number) => {
          const t = clamp((now - start) / 1600);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 4))));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { rootMargin: "0px 0px -20% 0px" },
  );
  counters.forEach((el) => {
    // Start from zero only when the figure is still below the fold.
    if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = "0";
    observer.observe(el);
  });
  observers.push(observer);
}

/* ---------- Feature story: the step in the middle of the screen sets the phone's screen ---------- */

function runStory() {
  const story = document.querySelector<HTMLElement>("[data-story]");
  if (!story) return;
  const steps = [...story.querySelectorAll<HTMLElement>(".story-step")];
  const screens = [...story.querySelectorAll<HTMLElement>(".story-screen")];
  if (!steps.length || !screens.length) return;
  const activate = (step: HTMLElement) => {
    steps.forEach((s) => s.classList.toggle("is-active", s === step));
    screens.forEach((img) => img.classList.toggle("is-active", img.dataset.shot === step.dataset.shot));
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) activate(entry.target as HTMLElement);
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  steps.forEach((s) => observer.observe(s));
  observers.push(observer);
}

/* ---------- Hero: depth parallax, then the icons land on the wall ---------- */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function runHero() {
  const icons = [...document.querySelectorAll<HTMLElement>(".hero-depth")];
  const wall = document.querySelector<HTMLElement>("[data-reveal]");
  // Hero icons are hidden on small screens; the wall then uses its normal reveal.
  if (!icons.length || !wall || reducedMotion.matches || icons[0].offsetParent === null) return false;

  wall.classList.add("is-landing");
  const items = [...wall.querySelectorAll<HTMLElement>("[data-product]")];
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let flights: { el: HTMLElement; float: HTMLElement; depth: number; dx: number; dy: number; scale: number }[] = [];
  let landAt = 1;
  let frame = 0;

  const measure = () => {
    icons.forEach((el) => (el.style.transform = "none"));
    const sy = window.scrollY;
    flights = icons.flatMap((el) => {
      const target = items.find((li) => li.dataset.product === el.dataset.product)?.querySelector(".wall-icon");
      const float = el.firstElementChild as HTMLElement | null;
      if (!target || !float) return [];
      const a = el.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      return [{
        el,
        float,
        depth: Number(el.dataset.depth ?? 0.5),
        dx: b.left - a.left,
        dy: b.top + sy - (a.top + sy),
        scale: b.width / a.width,
      }];
    });
    const wallTop = wall.getBoundingClientRect().top + sy;
    landAt = Math.max(120, wallTop - window.innerHeight * 0.45);
  };

  const render = () => {
    frame = 0;
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    const e = easeInOut(clamp(window.scrollY / landAt));
    const landed = e >= 0.999;

    for (const f of flights) {
      const px = pointer.x * 28 * f.depth * (1 - e);
      const py = pointer.y * 20 * f.depth * (1 - e);
      const s = 1 + (f.scale - 1) * e;
      f.el.style.transform = `translate3d(${f.dx * e + px}px, ${f.dy * e + py}px, 0) scale(${s})`;
      f.el.style.transformOrigin = "0 0";
      f.el.style.opacity = landed ? "0" : "1";
      // Calm the drift to zero as the icon approaches its place, so it lands straight.
      f.float.style.setProperty("--k", (1 - clamp(e * 2.5)).toFixed(3));
    }

    for (const li of items) {
      const hasFlight = flights.some((f) => f.el.dataset.product === li.dataset.product);
      const img = li.querySelector<HTMLElement>(".wall-icon");
      const text = [...li.querySelectorAll<HTMLElement>("a > span")];
      if (img) img.style.opacity = hasFlight ? (landed ? "1" : "0") : String(clamp((e - 0.6) / 0.4));
      text.forEach((t) => (t.style.opacity = String(clamp((e - 0.7) / 0.3))));
    }

    if (Math.abs(pointer.tx - pointer.x) > 0.001 || Math.abs(pointer.ty - pointer.y) > 0.001) schedule();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const { signal } = pageListeners;
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", () => { measure(); schedule(); }, { signal });
  const spot = document.querySelector<HTMLElement>(".hero-spot");
  if (finePointer.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.tx = event.clientX / window.innerWidth - 0.5;
        pointer.ty = event.clientY / window.innerHeight - 0.5;
        // The light under the pointer, in the hero's own coordinates.
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${event.clientX - r.left}px`);
          spot.style.setProperty("--my", `${event.clientY - r.top}px`);
        }
        schedule();
      },
      { passive: true, signal },
    );
  }

  // Measure once images have their final size.
  const ready = icons.map((el) => el.querySelector("img")).filter(Boolean) as HTMLImageElement[];
  Promise.all(ready.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {})))).then(() => {
    measure();
    render();
  });
  return true;
}

/* ---------- Manifesto: words fill with ink as you read ---------- */

function runManifesto() {
  const section = document.querySelector<HTMLElement>(".manifesto");
  if (!section) return;
  const words = [...section.querySelectorAll<HTMLElement>(".manifesto-word")];
  if (reducedMotion.matches) {
    words.forEach((w) => w.classList.add("is-lit"));
    return;
  }
  let frame = 0;
  const update = () => {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = clamp((vh * 0.8 - rect.top) / (rect.height * 0.9));
    const lit = Math.round(progress * words.length);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true, signal: pageListeners.signal },
  );
  update();
}

document.addEventListener("astro:page-load", () => {
  startSmoothScroll();
  clearFlood();
  setTint(undefined);
  setBandTint(undefined);
  runHero();
  revealWalls();
  runShowcase();
  runStory();
  runProductHero();
  runCounts();
  revealOnView();
  runManifesto();
});

document.addEventListener("astro:before-swap", () => {
  releaseMagnet();
  observers.forEach((o) => o.disconnect());
  observers = [];
  pageListeners.abort();
  pageListeners = new AbortController();
});
