/**
 * Builds the prototype as one self-contained HTML fragment.
 *
 * Everything is inlined — CSS, JS and the two webfaces as data URIs — so the
 * page runs from any static host or sandboxed frame with no network access.
 * Routing switches to hash mode (VITE_HASH_ROUTER=1) because pushState paths
 * cannot be relied on in those environments.
 *
 * Output: dist/spark-prototype.html
 *
 * The fragment carries no <html>/<head>/<body> wrapper — hosts that expect a
 * full document should wrap it; standalone use needs only a doctype and a
 * viewport meta around it.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

console.log("inlining fonts…");
// The stylesheet is one @font-face per unicode subset; we only ship latin.
const latinBlocks = fetchUrl(FONT_CSS_URL)
  .split("/*")
  .filter((block) => /^\s*latin\s*\*\//.test(block));

let fontCss = "";
for (const block of latinBlocks) {
  const face = `@font-face${block.split("@font-face")[1]}`;
  const url = face.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
  if (!url) continue;
  const woff2 = fetchUrl(url, true).toString("base64");
  fontCss += `${face.replace(url, `data:font/woff2;base64,${woff2}`)}\n`;
}
if (!fontCss) throw new Error("No latin @font-face rules found — the CSS API response changed");

const assets = readdirSync(path.join(buildDir, "assets"));
const readAsset = (ext) => {
  const name = assets.find((f) => f.endsWith(ext));
  if (!name) throw new Error(`No ${ext} asset in the build output`);
  return readFileSync(path.join(buildDir, "assets", name), "utf8");
};

const page = `<title>SPARK — House help in 10 minutes</title>
<style>
${fontCss}
${readAsset(".css")}
</style>
<div id="root"></div>
<script type="module">
${readAsset(".js").replaceAll("</script", "<\\/script")}
</script>
`;

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, page);
console.log(`wrote ${outFile} — ${(page.length / 1024 / 1024).toFixed(2)} MB`);
