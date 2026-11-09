import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";
import { panelConfig } from "../src/panel/config";

type Field = { name: string; fields?: Field[]; field?: Field };
type Collection = { name: string; folder?: string; fields?: Field[]; files?: { file: string; fields: Field[] }[] };

/** Every key path a panel field list can write, e.g. "privacy.dataCollected.purpose.tr". */
function fieldPaths(fields: Field[], prefix = ""): Set<string> {
  const out = new Set<string>();
  for (const f of fields) {
    const key = prefix ? `${prefix}.${f.name}` : f.name;
    out.add(key);
    if (f.fields) for (const p of fieldPaths(f.fields, key)) out.add(p);
    // A list of plain values (field) stores bare values under the list's own key.
  }
  return out;
}

/** Every key path present in a data object; list items share their list's path. */
function dataPaths(value: unknown, prefix = "", out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((v) => dataPaths(v, prefix, out));
  else if (value && typeof value === "object" && !(value instanceof Date)) {
    for (const [k, v] of Object.entries(value)) {
      const key = prefix ? `${prefix}.${k}` : k;
      out.add(key);
      dataPaths(v, key, out);
    }
  }
  return out;
}

function frontmatter(file: string): unknown {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? parse(match[1]) : {};
}

const collections = (panelConfig as unknown as { collections: Collection[] }).collections;

// The panel rewrites whole files: a key it does not know about could be lost on save.
test("the panel knows every field used in the content", () => {
  for (const c of collections) {
    if (c.folder) {
      const known = fieldPaths(c.fields ?? []);
      for (const file of fs.readdirSync(c.folder).filter((f) => f.endsWith(".md"))) {
        const used = dataPaths(frontmatter(path.join(c.folder, file)));
        const missing = [...used].filter((k) => !known.has(k));
        expect(missing, `${c.folder}/${file}`).toEqual([]);
      }
    }
    for (const f of c.files ?? []) {
      const known = fieldPaths(f.fields);
      const used = dataPaths(JSON.parse(fs.readFileSync(f.file, "utf8")));
      const missing = [...used].filter((k) => !known.has(k));
      expect(missing, f.file).toEqual([]);
    }
  }
});

test("the panel opens without configuration errors", async ({ browser }) => {
  const context = await browser.newContext({ locale: "tr-TR" });
  const page = await context.newPage();
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(e.message));
  page.on("console", (m) => {
    // Network failures to GitHub's status page are expected offline; configuration errors are not.
    if (m.type() === "error" && /configuration|yapılandırma/i.test(m.text())) problems.push(m.text());
  });
  await page.goto("/panel", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Yerel Repo ile Çalış" })).toBeVisible();
  await expect(page.getByText(/yapılandırmasında bir hata/)).toHaveCount(0);
  expect(problems).toEqual([]);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", "noindex, nofollow");
  await context.close();
});
