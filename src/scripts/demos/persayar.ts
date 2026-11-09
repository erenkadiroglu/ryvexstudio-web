/**
 * PerSayar: a real hand from the app's own screen (okey: red 5; run threshold 101, pair threshold
 * 5). "Seri Diz" and "Çift Diz" arrange the rack the way the app does, and the score is worked out
 * from the rack as it stands: runs and sets of three or more, and identical pairs.
 */

type Color = "red" | "blue" | "yellow" | "black";
type Tile = { id: number; n: number; color: Color };

const HAND: [number, Color][] = [
  [10, "blue"],
  [11, "blue"],
  [12, "blue"],
  [13, "blue"],
  [9, "red"],
  [9, "blue"],
  [9, "yellow"],
  [7, "black"],
  [8, "black"],
  [9, "black"],
  [1, "red"],
  [2, "red"],
  [3, "red"],
  [12, "red"],
  [2, "blue"],
  [4, "yellow"],
  [6, "yellow"],
  [13, "yellow"],
  [13, "yellow"],
  [1, "black"],
  [12, "black"],
];
const tiles: Tile[] = HAND.map(([n, color], id) => ({ id, n, color }));
const RUN_THRESHOLD = 101;
const PAIR_THRESHOLD = 5;
const COLS = 13;

// Rack layouts (26 slots, two rows of 13): tile ids in order, null for a gap.
const _ = null;
const RUNS = [
  0,
  1,
  2,
  3,
  _,
  4,
  5,
  6,
  _,
  7,
  8,
  9,
  _,
  10,
  11,
  12,
  _,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  _,
];
const PAIRS = [
  17,
  18,
  _,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  19,
  20,
  _,
  _,
  _,
  _,
];
const MIXED = [
  15,
  3,
  19,
  _,
  8,
  12,
  0,
  17,
  5,
  _,
  20,
  10,
  6,
  13,
  1,
  _,
  18,
  7,
  14,
  2,
  9,
  _,
  4,
  16,
  11,
  _,
];

const text = {
  tr: {
    rack: "Istaka",
    okey: "Okey: Kırmızı 5",
    runs: "Seri Diz",
    pairs: "Çift Diz",
    shuffle: "Karıştır",
    runScore: (p: number) => `Seri: ${p} puan`,
    pairScore: (p: number) => `Çift: ${p}`,
    runThreshold: `Seri barajı ${RUN_THRESHOLD}`,
    pairThreshold: `Çift barajı ${PAIR_THRESHOLD}`,
    can: "El açabilir",
    cannot: "Henüz açamaz",
    unsorted: "Taşları dizin; PerSayar sayısını hesaplasın.",
    tile: (t: Tile) =>
      `${{ red: "Kırmızı", blue: "Mavi", yellow: "Sarı", black: "Siyah" }[t.color]} ${t.n}`,
    count: (n: number) => `${n} taş`,
  },
  en: {
    rack: "Rack",
    okey: "Okey: red 5",
    runs: "Arrange runs",
    pairs: "Arrange pairs",
    shuffle: "Shuffle",
    runScore: (p: number) => `Runs: ${p} points`,
    pairScore: (p: number) => `Pairs: ${p}`,
    runThreshold: `Run threshold ${RUN_THRESHOLD}`,
    pairThreshold: `Pair threshold ${PAIR_THRESHOLD}`,
    can: "Can open",
    cannot: "Can't open yet",
    unsorted: "Arrange the tiles and PerSayar works out the score.",
    tile: (t: Tile) => `${t.color} ${t.n}`,
    count: (n: number) => `${n} tiles`,
  },
};

/** Groups of tiles standing side by side on one row of the rack. */
function segments(layout: (number | null)[]) {
  const out: Tile[][] = [];
  for (let row = 0; row < 2; row++) {
    let current: Tile[] = [];
    for (let col = 0; col < COLS; col++) {
      const id = layout[row * COLS + col];
      if (id === null || id === undefined) {
        if (current.length) out.push(current);
        current = [];
      } else current.push(tiles[id]);
    }
    if (current.length) out.push(current);
  }
  return out;
}

const isRun = (g: Tile[]) =>
  g.length >= 3 && g.every((t, i) => t.color === g[0].color && (i === 0 || t.n === g[i - 1].n + 1));
const isSet = (g: Tile[]) =>
  g.length >= 3 &&
  g.length <= 4 &&
  g.every((t) => t.n === g[0].n) &&
  new Set(g.map((t) => t.color)).size === g.length;

function runPoints(layout: (number | null)[]) {
  return segments(layout)
    .filter((g) => isRun(g) || isSet(g))
    .reduce((sum, g) => sum + g.reduce((s, t) => s + t.n, 0), 0);
}

function pairCount(layout: (number | null)[]) {
  let pairs = 0;
  for (const g of segments(layout)) {
    for (let i = 0; i + 1 < g.length; i += 2) {
      if (g[i].n === g[i + 1].n && g[i].color === g[i + 1].color) pairs++;
      else break; // pairs are read from the start of a group, two by two
    }
  }
  return pairs;
}

export function mount(stage: HTMLElement, lang: "tr" | "en") {
  const t = text[lang];
  stage.classList.add("ps-demo");
  stage.innerHTML = "";

  const head = document.createElement("div");
  head.className = "ps-head";
  const okey = document.createElement("span");
  okey.className = "ps-okey";
  okey.innerHTML = `<span class="ps-mini" aria-hidden="true">5</span>`;
  okey.append(t.okey);
  const count = document.createElement("span");
  count.className = "ps-count";
  count.textContent = t.count(tiles.length);
  head.append(okey, count);

  const rack = document.createElement("div");
  rack.className = "ps-rack";
  rack.setAttribute("role", "img");
  const slots = document.createElement("div");
  slots.className = "ps-slots";
  rack.append(slots);
  const tileEls = tiles.map((tile) => {
    const el = document.createElement("span");
    el.className = `ps-tile ps-${tile.color}`;
    el.innerHTML = `<b>${tile.n}</b><i></i>`;
    slots.append(el);
    return el;
  });

  const result = document.createElement("div");
  result.className = "ps-result";
  result.setAttribute("role", "status");

  const actions = document.createElement("div");
  actions.className = "ps-actions";
  const make = (
    label: string,
    cls: string,
    layout: (number | null)[],
    mode: "runs" | "pairs" | "none",
  ) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", () => place(layout, mode));
    return b;
  };
  actions.append(
    make(t.runs, "ps-btn ps-primary", RUNS, "runs"),
    make(t.pairs, "ps-btn", PAIRS, "pairs"),
    make(t.shuffle, "ps-btn ps-ghost", MIXED, "none"),
  );

  stage.append(head, rack, result, actions);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function place(layout: (number | null)[], mode: "runs" | "pairs" | "none") {
    // FLIP: remember where each tile was, move it, then let it glide from there.
    const before = tileEls.map((el) => el.getBoundingClientRect());
    layout.forEach((id, slot) => {
      if (id === null) return;
      const el = tileEls[id];
      el.style.gridColumn = String((slot % COLS) + 1);
      el.style.gridRow = String(Math.floor(slot / COLS) + 1);
    });
    if (!reduce) {
      tileEls.forEach((el, i) => {
        const after = el.getBoundingClientRect();
        const dx = before[i].left - after.left;
        const dy = before[i].top - after.top;
        if (dx || dy) {
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
            duration: 520 + (i % 7) * 30,
            easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
          });
        }
      });
    }
    rack.setAttribute(
      "aria-label",
      `${t.rack}: ${layout
        .map((id) => (id === null ? "|" : t.tile(tiles[id])))
        .join(", ")
        .replace(/(, \|)+/g, " |")}`,
    );
    const runs = runPoints(layout);
    const pairs = pairCount(layout);
    result.replaceChildren();
    if (mode === "none") {
      result.className = "ps-result";
      result.textContent = t.unsorted;
      return;
    }
    const ok = mode === "runs" ? runs >= RUN_THRESHOLD : pairs >= PAIR_THRESHOLD;
    result.className = `ps-result ${ok ? "is-ok" : "is-short"}`;
    const score = document.createElement("strong");
    score.textContent = mode === "runs" ? t.runScore(runs) : t.pairScore(pairs);
    const threshold = document.createElement("span");
    threshold.textContent = mode === "runs" ? t.runThreshold : t.pairThreshold;
    const verdict = document.createElement("span");
    verdict.className = "ps-verdict";
    verdict.textContent = ok ? `✓ ${t.can}` : t.cannot;
    result.append(score, threshold, verdict);
  }

  place(MIXED, "none");
}
