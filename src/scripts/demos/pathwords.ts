/**
 * PathWords, level 1, exactly as in the game: a 4 × 4 board with four blocked corners and three
 * animals. Letters are joined along rows and columns, by dragging or by tapping them in order; a
 * word may be traced from either end. Colours and translations are the game's own.
 */

type Cell = { r: number; c: number };
type Word = { word: string; tr: string; color: string; light: string };

const GRID: (string | null)[][] = [
  [null, "F", "I", null],
  ["B", "E", "S", "H"],
  ["R", "A", "O", "N"],
  [null, "L", "I", null],
];
const WORDS: Word[] = [
  { word: "FISH", tr: "Balık", color: "#0EA5E9", light: "#E0F2FE" },
  { word: "BEAR", tr: "Ayı", color: "#EAB308", light: "#FEF9C3" },
  { word: "LION", tr: "Aslan", color: "#10B981", light: "#D1FAE5" },
];
const TRACE = "#6366F1";

const text = {
  tr: {
    board: "PathWords oyun tahtası",
    tile: (l: string, r: number, c: number) => `${l}, satır ${r + 1}, sütun ${c + 1}`,
    found: (w: string, t: string) => `${w} bulundu: ${t}.`,
    words: "Bulunacak kelimeler",
    done: "Bölüm tamam! Uygulamada sonsuz bölüm, günlük bulmaca ve kelime defteri sizi bekliyor.",
    again: "Yeniden oyna",
    hint: "İpucu",
    hintSaid: (l: string) => `İpucu: ${l} harfiyle başlayan kelimeyi arayın.`,
  },
  en: {
    board: "PathWords board",
    tile: (l: string, r: number, c: number) => `${l}, row ${r + 1}, column ${c + 1}`,
    found: (w: string, t: string) => `${w} found: ${t} in Turkish.`,
    words: "Words to find",
    done: "Level complete! Endless levels, a daily puzzle and a word notebook wait in the app.",
    again: "Play again",
    hint: "Hint",
    hintSaid: (l: string) => `Hint: look for the word that starts with ${l}.`,
  },
};

const same = (a: Cell, b: Cell) => a.r === b.r && a.c === b.c;
const adjacent = (a: Cell, b: Cell) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;

export function mount(stage: HTMLElement, lang: "tr" | "en") {
  const t = text[lang];
  stage.classList.add("pw-demo");
  stage.innerHTML = "";

  let path: Cell[] = [];
  let found: { word: Word; cells: Cell[] }[] = [];
  let pressing = false;
  let dragged = false;
  let pressStart: Cell | null = null;

  const board = document.createElement("div");
  board.className = "pw-board";
  board.setAttribute("role", "group");
  board.setAttribute("aria-label", t.board);
  const ribbons = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ribbons.setAttribute("class", "pw-ribbons");
  ribbons.setAttribute("viewBox", "0 0 400 400");
  ribbons.setAttribute("aria-hidden", "true");
  board.append(ribbons);

  const tiles: HTMLElement[][] = GRID.map((row, r) =>
    row.map((letter, c) => {
      const tile = document.createElement(letter ? "button" : "div");
      tile.className = letter ? "pw-tile" : "pw-tile pw-blocked";
      tile.style.gridColumn = String(c + 1);
      tile.style.gridRow = String(r + 1);
      tile.dataset.r = String(r);
      tile.dataset.c = String(c);
      if (letter) {
        (tile as HTMLButtonElement).type = "button";
        tile.textContent = letter;
        tile.setAttribute("aria-label", t.tile(letter, r, c));
        tile.tabIndex = r === 1 && c === 0 ? 0 : -1;
      } else {
        tile.setAttribute("aria-hidden", "true");
      }
      board.append(tile);
      return tile;
    }),
  );

  const list = document.createElement("ul");
  list.className = "pw-words";
  list.setAttribute("aria-label", t.words);
  const status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("role", "status");
  const end = document.createElement("div");
  end.className = "pw-end";
  end.hidden = true;
  const tools = document.createElement("div");
  tools.className = "pw-tools";
  const hint = document.createElement("button");
  hint.type = "button";
  hint.className = "pw-hint";
  hint.textContent = t.hint;
  tools.append(hint);

  stage.append(board, list, tools, end, status);

  const letterAt = (cell: Cell) => GRID[cell.r][cell.c];
  const usedBy = (cell: Cell) => found.find((f) => f.cells.some((x) => same(x, cell)));
  const centre = (cell: Cell) => ({ x: cell.c * 100 + 50, y: cell.r * 100 + 50 });

  function drawRibbon(cells: Cell[], color: string, cls: string) {
    if (!cells.length) return;
    const pts = cells.map(centre);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", pts.map((p) => `${p.x},${p.y}`).join(" "));
    line.setAttribute("class", cls);
    line.setAttribute("stroke", color);
    ribbons.append(line);
    // Direction chevrons between letters, as in the game.
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "path");
      g.setAttribute("d", "M-7 -9 L5 0 L-7 9");
      g.setAttribute("class", "pw-chevron");
      g.setAttribute(
        "transform",
        `translate(${(a.x + b.x) / 2} ${(a.y + b.y) / 2}) rotate(${angle})`,
      );
      ribbons.append(g);
    }
  }

  // The light tile behind a found word, as in the game; drawn in the same layer as the ribbons.
  function drawTiles(cells: Cell[], light: string, edge: string) {
    for (const cell of cells) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(cell.c * 100 + 3));
      rect.setAttribute("y", String(cell.r * 100 + 3));
      rect.setAttribute("width", "94");
      rect.setAttribute("height", "94");
      rect.setAttribute("rx", "16");
      rect.setAttribute("fill", light);
      rect.setAttribute("stroke", edge);
      rect.setAttribute("stroke-width", "3");
      ribbons.append(rect);
    }
  }

  function render() {
    ribbons.replaceChildren();
    for (const f of found) drawTiles(f.cells, f.word.light, f.word.color);
    drawTiles(path, "#E0E7FF", TRACE);
    for (const f of found) drawRibbon(f.cells, f.word.color, "pw-ribbon");
    drawRibbon(path, TRACE, "pw-ribbon pw-trace");
    tiles.forEach((row, r) =>
      row.forEach((tile, c) => {
        const cell = { r, c };
        const owner = usedBy(cell);
        tile.classList.toggle("is-found", Boolean(owner));
        tile.classList.toggle(
          "is-path",
          path.some((p) => same(p, cell)),
        );
        tile.style.setProperty("--pw-light", owner?.word.light ?? "");
        tile.style.setProperty("--pw-color", owner?.word.color ?? TRACE);
        if (owner) tile.setAttribute("aria-disabled", "true");
      }),
    );
    list.replaceChildren(
      ...WORDS.map((w) => {
        const li = document.createElement("li");
        const done = found.some((f) => f.word === w);
        li.className = done ? "pw-word is-done" : "pw-word";
        li.style.setProperty("--pw-color", w.color);
        li.style.setProperty("--pw-light", w.light);
        const slots = document.createElement("span");
        slots.className = "pw-slots";
        slots.setAttribute("aria-hidden", "true");
        for (const ch of w.word) {
          const s = document.createElement("span");
          s.textContent = done ? ch : "";
          slots.append(s);
        }
        const label = document.createElement("span");
        label.className = "pw-meaning";
        label.textContent = done ? `✓ ${w.tr}` : "";
        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = done
          ? `${w.word}: ${w.tr}`
          : `${w.word.length} ${lang === "tr" ? "harf" : "letters"}`;
        li.append(slots, label, sr);
        return li;
      }),
    );
    const complete = found.length === WORDS.length;
    end.hidden = !complete;
    tools.hidden = complete;
  }

  function check() {
    const spelled = path.map(letterAt).join("");
    const word = WORDS.find(
      (w) =>
        !found.some((f) => f.word === w) &&
        (w.word === spelled || w.word === [...spelled].reverse().join("")),
    );
    if (!word) return false;
    const cells = word.word === spelled ? path : [...path].reverse();
    found.push({ word, cells });
    path = [];
    status.textContent = t.found(word.word, word.tr);
    if (found.length === WORDS.length) {
      end.replaceChildren();
      const msg = document.createElement("p");
      msg.textContent = t.done;
      const again = document.createElement("button");
      again.type = "button";
      again.className = "pw-again";
      again.textContent = t.again;
      again.addEventListener("click", () => {
        found = [];
        path = [];
        tiles.forEach((row) => row.forEach((tile) => tile.removeAttribute("aria-disabled")));
        render();
        tiles[1][0].focus();
      });
      end.append(msg, again);
      status.textContent = `${t.found(word.word, word.tr)} ${t.done}`;
    }
    return true;
  }

  /** Adds a cell to the path, steps back when returning to the previous one, or starts over. */
  function extend(cell: Cell) {
    if (!letterAt(cell) || usedBy(cell)) return;
    const last = path.at(-1);
    if (last && same(last, cell)) return;
    if (path.length > 1 && same(path[path.length - 2], cell)) path.pop();
    else if (path.some((p) => same(p, cell)))
      path = path.slice(0, path.findIndex((p) => same(p, cell)) + 1);
    else if (last && adjacent(last, cell)) path.push(cell);
    else path = [cell];
    check();
    render();
  }

  const cellOf = (el: Element | null): Cell | null => {
    const tile = el?.closest<HTMLElement>(".pw-tile");
    return tile && tile.dataset.r ? { r: Number(tile.dataset.r), c: Number(tile.dataset.c) } : null;
  };

  board.addEventListener("pointerdown", (event) => {
    const cell = cellOf(event.target as Element);
    if (!cell || !letterAt(cell) || usedBy(cell)) return;
    event.preventDefault();
    pressing = true;
    dragged = false;
    pressStart = cell;
    board.setPointerCapture(event.pointerId);
    // A press next to the end of an open path continues it (tapping in order).
    const last = path.at(-1);
    if (!last || !(adjacent(last, cell) || same(last, cell) || path.some((p) => same(p, cell))))
      path = [];
    extend(cell);
  });
  board.addEventListener("pointermove", (event) => {
    if (!pressing) return;
    const cell = cellOf(document.elementFromPoint(event.clientX, event.clientY));
    if (!cell || (pressStart && same(cell, pressStart) && !dragged)) return;
    dragged = true;
    extend(cell);
  });
  const release = () => {
    if (!pressing) return;
    pressing = false;
    // A drag that spelled nothing is dropped; taps keep building the path.
    if (dragged && path.length) {
      path = [];
      render();
    }
  };
  board.addEventListener("pointerup", release);
  board.addEventListener("pointercancel", release);

  // Keyboard: arrow keys move between letters, Enter or Space adds the letter.
  board.addEventListener("keydown", (event) => {
    const cell = cellOf(event.target as Element);
    if (!cell) return;
    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      let r = cell.r + move[0];
      let c = cell.c + move[1];
      while (r >= 0 && r < 4 && c >= 0 && c < 4 && !GRID[r][c]) {
        r += move[0];
        c += move[1];
      }
      const next = tiles[r]?.[c];
      if (next && GRID[r][c]) {
        tiles.flat().forEach((tile) => (tile.tabIndex = -1));
        next.tabIndex = 0;
        next.focus();
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      extend(cell);
    } else if (event.key === "Escape") {
      path = [];
      render();
    }
  });

  hint.addEventListener("click", () => {
    const next = WORDS.find((w) => !found.some((f) => f.word === w));
    if (!next) return;
    status.textContent = t.hintSaid(next.word[0]);
    const tile = tiles
      .flat()
      .find((el) => el.textContent === next.word[0] && !el.classList.contains("is-found"));
    tile?.classList.add("is-hinted");
    window.setTimeout(() => tile?.classList.remove("is-hinted"), 1600);
  });

  render();
}
