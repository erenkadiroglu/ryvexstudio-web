/**
 * Interaction and scroll motion for the site.
 * Everything here is skipped for visitors who prefer reduced motion.
 */

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

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

  const activate = (index: number) => {
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    screens.forEach((screen, i) => screen.classList.toggle("is-active", i === index));
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

/* ---------- Hero: the phones follow the pointer and part as you scroll ---------- */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function runHero() {
  const phones = [...document.querySelectorAll<HTMLElement>(".hero-phone")];
  // Hidden on small screens, and still for visitors who prefer reduced motion.
  if (!phones.length || reducedMotion.matches || phones[0].offsetParent === null) return;

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let frame = 0;

  const render = () => {
    frame = 0;
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    // Over the first screen of scrolling the side phones drift apart and up; the front one rises less.
    const progress = clamp(window.scrollY / window.innerHeight);
    phones.forEach((phone, i) => {
      const depth = Number(phone.dataset.depth ?? 0.5);
      const side = i === 0 ? 0 : i === 1 ? -1 : 1;
      const x = pointer.x * 24 * depth + side * 40 * progress;
      const y = pointer.y * 16 * depth - 90 * progress * (1.2 - depth);
      phone.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
    if (Math.abs(pointer.tx - pointer.x) > 0.001 || Math.abs(pointer.ty - pointer.y) > 0.001) schedule();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const { signal } = pageListeners;
  window.addEventListener("scroll", schedule, { passive: true, signal });
  if (finePointer.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.tx = event.clientX / window.innerWidth - 0.5;
        pointer.ty = event.clientY / window.innerHeight - 0.5;
        schedule();
      },
      { passive: true, signal },
    );
  }
  render();
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
  setTint(undefined);
  setBandTint(undefined);
  runHero();
  revealWalls();
  runShowcase();
  runManifesto();
});

document.addEventListener("astro:before-swap", () => {
  releaseMagnet();
  observers.forEach((o) => o.disconnect());
  observers = [];
  pageListeners.abort();
  pageListeners = new AbortController();
});
