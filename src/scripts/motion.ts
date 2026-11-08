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

/* ---------- Per page: reveal the wall and run the showcase ---------- */

let observers: IntersectionObserver[] = [];

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

document.addEventListener("astro:page-load", () => {
  setTint(undefined);
  setBandTint(undefined);
  revealWalls();
  runShowcase();
});

document.addEventListener("astro:before-swap", () => {
  observers.forEach((o) => o.disconnect());
  observers = [];
});
