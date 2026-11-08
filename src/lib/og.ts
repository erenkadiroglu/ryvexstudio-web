import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 72;
const ICON = 280;

const INK = "#1C1418";
const SECONDARY = "#5E5459";
const BRAND = "#8E1B3B";

const fontDir = path.join(process.cwd(), "node_modules/@fontsource/geist/files");

let fontsPromise: Promise<Parameters<typeof satori>[1]["fonts"]> | undefined;

function loadFonts() {
  fontsPromise ??= Promise.all(
    (
      [
        ["latin", 500],
        ["latin-ext", 500],
        ["latin", 600],
        ["latin-ext", 600],
      ] as const
    ).map(async ([subset, weight]) => ({
      // Each subset gets its own family name so the renderer falls back to latin-ext for ğ, ş, ı, İ.
      name: subset === "latin" ? "Geist" : "Geist Ext",
      weight,
      style: "normal" as const,
      data: await fs.readFile(path.join(fontDir, `geist-${subset}-${weight}-normal.woff`)),
    })),
  );
  return fontsPromise;
}

// The approved symbol (see public/brand/ryvex-studio-symbol.svg).
const symbolDataUri = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><clipPath id="c"><rect width="64" height="64" rx="14.4"/></clipPath><rect width="64" height="64" rx="14.4" fill="${BRAND}"/><g clip-path="url(#c)" fill="none" stroke="#FFFFFF" stroke-width="8"><path d="M24 16V48"/><path d="M20 20H33A7 7 0 0 1 33 34H24" stroke-linejoin="round"/><path d="M31 34L64 67"/></g></svg>`,
).toString("base64")}`;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export type OgOptions = {
  title: string;
  subtitle: string;
  /** Data URI of a product icon shown on the right. */
  icon?: string;
};

export async function renderOgImage({ title, subtitle, icon }: OgOptions): Promise<Buffer> {
  const textColumn = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: icon ? WIDTH - PADDING * 2 - ICON - 48 : WIDTH - PADDING * 2,
      height: HEIGHT - PADDING * 2,
    },
    [
      h("div", { display: "flex", alignItems: "center", gap: 16 }, [
        h("img", { width: 48, height: 48 }, undefined, { src: symbolDataUri, width: 48, height: 48 }),
        h("div", { fontSize: 30, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }, "Ryvex Studio"),
      ]),
      h("div", { display: "flex", flexDirection: "column", gap: 20 }, [
        h(
          "div",
          {
            fontSize: icon ? 84 : 96,
            fontWeight: 600,
            color: INK,
            lineHeight: 1,
            letterSpacing: "-0.045em",
          },
          title,
        ),
        h("div", { fontSize: 32, fontWeight: 500, color: SECONDARY, lineHeight: 1.35 }, subtitle),
      ]),
    ],
  );

  const children: Node[] = [textColumn];
  if (icon) {
    children.push(
      h("div", { display: "flex", alignItems: "center", marginLeft: 48, height: HEIGHT - PADDING * 2 }, [
        h("img", { width: ICON, height: ICON, borderRadius: ICON * 0.225 }, undefined, {
          src: icon,
          width: ICON,
          height: ICON,
        }),
      ]),
    );
  }

  const svg = await satori(
    h("div", {
      display: "flex",
      width: WIDTH,
      height: HEIGHT,
      padding: PADDING,
      backgroundColor: "#FFFFFF",
      fontFamily: "Geist, Geist Ext",
    }, children) as never,
    { width: WIDTH, height: HEIGHT, fonts: await loadFonts() },
  );

  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}

/** Reads a product icon from src/assets/products and returns it as a data URI. */
export async function productIconDataUri(id: string): Promise<string | undefined> {
  const dir = path.join(process.cwd(), "src/assets/products");
  const files = await fs.readdir(dir);
  const file = files.find((f) => path.parse(f).name === id);
  if (!file) return undefined;
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === "svg" ? "image/svg+xml" : ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const data = await fs.readFile(path.join(dir, file));
  return `data:${mime};base64,${data.toString("base64")}`;
}
