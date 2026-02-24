import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST_DIR = path.join(ROOT, "dist");

const IGNORE = new Set(["api", "storage", "airline-logos"]);

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(DIST_DIR))) {
    console.error("dist/ not found. Run build first.");
    process.exit(2);
  }

  const entries = await readdir(PUBLIC_DIR, { withFileTypes: true });
  let copied = 0;

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (IGNORE.has(ent.name)) continue;

    const srcDir = path.join(PUBLIC_DIR, ent.name);
    const srcIndex = path.join(srcDir, "index.html");
    if (!(await exists(srcIndex))) continue;

    const destDir = path.join(DIST_DIR, ent.name);
    await mkdir(destDir, { recursive: true });
    await cp(srcDir, destDir, { recursive: true });
    copied++;
  }

  console.log(`Copied ${copied} landing page directories from public/ -> dist/`);
}

main();
