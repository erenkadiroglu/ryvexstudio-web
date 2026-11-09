/**
 * FileConvert, "Sayfaları Düzenle": a six-page scan with a page lying sideways and an empty page,
 * the two things the tool is most often used for. Pages are dragged into order (or moved with
 * their arrow buttons), turned and removed; saving reports what the new file would hold.
 */

type Page = { id: number; label: string; rot: number; blank?: boolean; title?: string };

const START: Page[] = [
  { id: 1, label: "1", rot: 0, title: "cover" },
  { id: 2, label: "2", rot: 0 },
  { id: 3, label: "3", rot: 270 },
  { id: 4, label: "4", rot: 0 },
  { id: 5, label: "5", rot: 0, blank: true },
  { id: 6, label: "6", rot: 0 },
];

const text = {
  tr: {
    file: "Tarama.pdf",
    pages: "Sayfalar",
    page: (l: string) => `Sayfa ${l}`,
    blank: "Boş",
    left: "Sola taşı",
    right: "Sağa taşı",
    rotate: "Döndür",
    remove: "Sil",
    reset: "Baştan al",
    save: "Kaydet",
    count: (n: number) => `${n} sayfa`,
    saved: (n: number, order: string) =>
      `Hazır: ${n} sayfalık yeni PDF (sıra: ${order}). Uygulamada bu, telefonunuzda yapılır; dosya hiçbir yere yüklenmez.`,
    moved: (l: string, i: number) => `Sayfa ${l}, ${i}. sıraya taşındı.`,
    rotated: (l: string) => `Sayfa ${l} döndürüldü.`,
    removed: (l: string) => `Sayfa ${l} silindi.`,
    hint: "İpucu: 3. sayfa yan duruyor, 5. sayfa boş.",
  },
  en: {
    file: "Scan.pdf",
    pages: "Pages",
    page: (l: string) => `Page ${l}`,
    blank: "Blank",
    left: "Move left",
    right: "Move right",
    rotate: "Rotate",
    remove: "Delete",
    reset: "Start over",
    save: "Save",
    count: (n: number) => `${n} pages`,
    saved: (n: number, order: string) =>
      `Done: a new ${n}-page PDF (order: ${order}). In the app this happens on your phone; the file is never uploaded.`,
    moved: (l: string, i: number) => `Page ${l} moved to position ${i}.`,
    rotated: (l: string) => `Page ${l} rotated.`,
    removed: (l: string) => `Page ${l} deleted.`,
    hint: "Tip: page 3 is lying sideways and page 5 is blank.",
  },
};

const icons = {
  left: "M14 6l-6 6 6 6",
  right: "M10 6l6 6-6 6",
  rotate: "M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4",
  remove: "M7 7l10 10M17 7 7 17",
};

export function mount(stage: HTMLElement, lang: "tr" | "en") {
  const t = text[lang];
  stage.classList.add("fc-demo");
  stage.innerHTML = "";
  let pages: Page[] = START.map((p) => ({ ...p }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bar = document.createElement("div");
  bar.className = "fc-bar";
  const name = document.createElement("span");
  name.className = "fc-file";
  name.innerHTML = `<span class="fc-badge" aria-hidden="true">PDF</span>`;
  name.append(t.file);
  const count = document.createElement("span");
  count.className = "fc-count";
  bar.append(name, count);

  const grid = document.createElement("ol");
  grid.className = "fc-grid";
  grid.setAttribute("aria-label", t.pages);

  const hint = document.createElement("p");
  hint.className = "fc-hint";
  hint.textContent = t.hint;

  const actions = document.createElement("div");
  actions.className = "fc-actions";
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "fc-btn fc-ghost";
  reset.textContent = t.reset;
  const save = document.createElement("button");
  save.type = "button";
  save.className = "fc-btn fc-primary";
  save.textContent = t.save;
  actions.append(reset, save);

  const status = document.createElement("p");
  status.className = "fc-status";
  status.setAttribute("role", "status");

  stage.append(bar, grid, hint, actions, status);

  const button = (kind: keyof typeof icons, label: string, page: Page) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `fc-tool fc-${kind}`;
    b.dataset.action = kind;
    b.dataset.id = String(page.id);
    b.setAttribute("aria-label", `${label}: ${t.page(page.label)}`);
    b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[kind]}"/></svg>`;
    return b;
  };

  function render(animateFrom?: Map<number, DOMRect>) {
    grid.replaceChildren(
      ...pages.map((page, index) => {
        const li = document.createElement("li");
        li.className = "fc-page";
        li.dataset.id = String(page.id);
        const sheet = document.createElement("div");
        sheet.className = `fc-sheet${page.blank ? " is-blank" : ""}${page.title ? " is-cover" : ""}`;
        sheet.style.setProperty("--rot", `${page.rot}deg`);
        sheet.setAttribute("aria-hidden", "true");
        // The page stays upright; what is printed on it turns.
        sheet.innerHTML = page.blank
          ? `<span class="fc-content"><span>${t.blank}</span></span>`
          : `<span class="fc-content"><i></i><i></i><i></i><i></i><i></i></span>`;
        const label = document.createElement("span");
        label.className = "fc-label";
        label.textContent = t.page(page.label);
        const tools = document.createElement("div");
        tools.className = "fc-tools";
        const left = button("left", t.left, page);
        const right = button("right", t.right, page);
        left.disabled = index === 0;
        right.disabled = index === pages.length - 1;
        tools.append(
          left,
          button("rotate", t.rotate, page),
          button("remove", t.remove, page),
          right,
        );
        li.append(sheet, label, tools);
        return li;
      }),
    );
    count.textContent = t.count(pages.length);
    save.disabled = pages.length === 0;
    if (animateFrom && !reduce) {
      grid.querySelectorAll<HTMLElement>(".fc-page").forEach((el) => {
        const before = animateFrom.get(Number(el.dataset.id));
        if (!before) return;
        const after = el.getBoundingClientRect();
        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (dx || dy)
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
            duration: 380,
            easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
          });
      });
    }
  }

  const positions = () =>
    new Map(
      [...grid.querySelectorAll<HTMLElement>(".fc-page")].map((el) => [
        Number(el.dataset.id),
        el.getBoundingClientRect(),
      ]),
    );

  function move(id: number, to: number, focusAction?: string) {
    const from = pages.findIndex((p) => p.id === id);
    if (from < 0 || to < 0 || to >= pages.length || from === to) return;
    const before = positions();
    const [page] = pages.splice(from, 1);
    pages.splice(to, 0, page);
    render(before);
    status.textContent = t.moved(page.label, to + 1);
    if (focusAction)
      grid.querySelector<HTMLElement>(`[data-id="${id}"][data-action="${focusAction}"]`)?.focus();
  }

  grid.addEventListener("click", (event) => {
    const b = (event.target as Element).closest<HTMLButtonElement>("button[data-action]");
    if (!b) return;
    const id = Number(b.dataset.id);
    const index = pages.findIndex((p) => p.id === id);
    const page = pages[index];
    if (!page) return;
    if (b.dataset.action === "left") move(id, index - 1, "left");
    else if (b.dataset.action === "right") move(id, index + 1, "right");
    else if (b.dataset.action === "rotate") {
      // The angle keeps counting up so every turn goes the same way; the page's rotation is rot % 360.
      page.rot += 90;
      b.closest(".fc-page")
        ?.querySelector<HTMLElement>(".fc-sheet")
        ?.style.setProperty("--rot", `${page.rot}deg`);
      status.textContent = t.rotated(page.label);
    } else if (b.dataset.action === "remove") {
      const before = positions();
      pages.splice(index, 1);
      render(before);
      status.textContent = t.removed(page.label);
      const next = grid.querySelectorAll<HTMLElement>("button[data-action='remove']")[
        Math.min(index, pages.length - 1)
      ];
      (next ?? save).focus();
    }
  });

  // Dragging: the page follows the pointer; the others make room where it would land.
  let drag: {
    id: number;
    el: HTMLElement;
    startX: number;
    startY: number;
    slots: DOMRect[];
    to: number;
    moved: boolean;
  } | null = null;
  grid.addEventListener("pointerdown", (event) => {
    if ((event.target as Element).closest("button")) return;
    const el = (event.target as Element).closest<HTMLElement>(".fc-page");
    if (!el) return;
    event.preventDefault();
    const slots = [...grid.querySelectorAll<HTMLElement>(".fc-page")].map((p) =>
      p.getBoundingClientRect(),
    );
    const id = Number(el.dataset.id);
    drag = {
      id,
      el,
      startX: event.clientX,
      startY: event.clientY,
      slots,
      to: pages.findIndex((p) => p.id === id),
      moved: false,
    };
    grid.setPointerCapture(event.pointerId);
  });
  grid.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    drag.el.classList.add("is-dragging");
    drag.el.style.transform = `translate(${dx}px, ${dy}px)`;
    let best = drag.to;
    let distance = Infinity;
    drag.slots.forEach((r, i) => {
      const d = Math.hypot(
        event.clientX - (r.left + r.width / 2),
        event.clientY - (r.top + r.height / 2),
      );
      if (d < distance) {
        distance = d;
        best = i;
      }
    });
    drag.to = best;
    grid
      .querySelectorAll(".fc-page")
      .forEach((p, i) => p.classList.toggle("is-target", i === best && p !== drag?.el));
  });
  const drop = () => {
    if (!drag) return;
    const { id, el, to, moved } = drag;
    drag = null;
    el.classList.remove("is-dragging");
    grid.querySelectorAll(".is-target").forEach((p) => p.classList.remove("is-target"));
    if (!moved) return;
    const before = positions();
    el.style.transform = "";
    const from = pages.findIndex((p) => p.id === id);
    if (from === to) {
      render(before);
      return;
    }
    const [page] = pages.splice(from, 1);
    pages.splice(to, 0, page);
    render(before);
    status.textContent = t.moved(page.label, to + 1);
  };
  grid.addEventListener("pointerup", drop);
  grid.addEventListener("pointercancel", drop);

  reset.addEventListener("click", () => {
    const before = positions();
    pages = START.map((p) => ({ ...p }));
    render(before);
    status.textContent = "";
  });
  save.addEventListener("click", () => {
    status.textContent = t.saved(pages.length, pages.map((p) => p.label).join(", "));
  });

  render();
}
