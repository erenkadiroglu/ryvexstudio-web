import fs from "node:fs";
import path from "node:path";

/** Every HTML page in the production build, as a URL path. */
export function builtPages(dir = "dist", base = ""): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...builtPages(full, `${base}/${entry.name}`));
    else if (entry.name === "index.html") out.push(base || "/");
  }
  return out.sort();
}
