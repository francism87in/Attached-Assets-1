/**
 * Builds the prototype as one self-contained HTML fragment.
 *
 * Everything is inlined — CSS, JS and the two webfaces as data URIs — so the
 * page runs from any static host or sandboxed frame with no network access.
 * Routing switches to hash mode (VITE_HASH_ROUTER=1) because pushState paths
 * cannot be relied on in those environments.
 *
 * Outputs:
 *   dist/spark-prototype.html     fragment, for hosts that supply their own
 *                                 <html>/<head>/<body> skeleton
 *   dist/standalone/index.html    the same page as a complete document — open
 *                                 it directly, or ship it as the APK's asset
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const pkgRoot = path.resolve(import.meta.dirname, "..");
const buildDir = path.join(pkgRoot, "dist", "single");
const outFile = path.join(pkgRoot, "dist", "spark-prototype.html");

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=Inter:wght@300..800&display=swap";
// Google serves different font formats per user agent; ask as a modern browser.
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const fetchUrl = (url, binary = false) =>
  execFileSync("curl", ["-sSfL", "-A", UA, url], {
    maxBuffer: 64 * 1024 * 1024,
    encoding: binary ? "buffer" : "utf8",
  });

console.log("building bundle…");
execFileSync("npx", ["vite", "build", "--config", "vite.config.ts", "--outDir", buildDir], {
  cwd: pkgRoot,
  env: { ...process.env, VITE_HASH_ROUTER: "1" },
  stdio: "inherit",
});

// Inlined faces don't change between builds, so keep them out of the hot path.
const fontCache = path.join(pkgRoot, "dist", ".fonts.css");
let fontCss = existsSync(fontCache) ? readFileSync(fontCache, "utf8") : "";

if (!fontCss) {
  console.log("inlining fonts…");
  // The stylesheet is one @font-face per unicode subset; we only ship latin.
  const latinBlocks = fetchUrl(FONT_CSS_URL)
    .split("/*")
    .filter((block) => /^\s*latin\s*\*\//.test(block));

  for (const block of latinBlocks) {
    const face = `@font-face${block.split("@font-face")[1]}`;
    const url = face.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
    if (!url) continue;
    const woff2 = fetchUrl(url, true).toString("base64");
    fontCss += `${face.replace(url, `data:font/woff2;base64,${woff2}`)}\n`;
  }
  if (!fontCss) throw new Error("No latin @font-face rules found — the CSS API response changed");
  mkdirSync(path.dirname(fontCache), { recursive: true });
  writeFileSync(fontCache, fontCss);
}

const assets = readdirSync(path.join(buildDir, "assets"));
const readAsset = (ext) => {
  const name = assets.find((f) => f.endsWith(ext));
  if (!name) throw new Error(`No ${ext} asset in the build output`);
  return readFileSync(path.join(buildDir, "assets", name), "utf8");
};

const head = `<title>SPARK — House help in 10 minutes</title>
<style>
${fontCss}
${readAsset(".css")}
</style>`;

const body = `<div id="root"></div>
<script type="module">
${readAsset(".js").replaceAll("</script", "<\\/script")}
</script>`;

const write = (file, contents) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, contents);
  console.log(`wrote ${file} — ${(contents.length / 1024 / 1024).toFixed(2)} MB`);
};

write(outFile, `${head}\n${body}\n`);

write(
  path.join(pkgRoot, "dist", "standalone", "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#150b2e" />
${head}
  </head>
  <body>
${body}
  </body>
</html>
`,
);
