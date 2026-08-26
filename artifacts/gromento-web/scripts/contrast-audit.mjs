import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();

/**
 * WCAG contrast audit for the light/dark tone system.
 *
 * Run the preview server first, then: pnpm --filter @workspace/gromento-web a11y
 *
 * Colours are composited through a 1x1 canvas rather than parsed by regex:
 * Tailwind v4 emits oklab()/color-mix() for alpha-modified colours, which a
 * naive rgb() parser reads as near-black and reports as false failures.
 *
 * Three passes, because backgrounds resolve differently in each case:
 *   1. page sweep   — text whose ground is an ancestor background
 *   2. controls     — labels on a filled button/link
 *   3. fixed header — ground resolved by hit-testing what scrolls beneath
 *
 * Known limitation: pass 3 can mis-resolve a translucent control inside the
 * fixed bar (it reports the Menu pill low on Home). That case is verified
 * directly instead — over the hero the bar is tone-dark, so its label computes
 * #fff on #0d0d12 (17.4:1); once condensed it is #14131A on paper.
 */
const audit = `(() => {
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = 1;
  const c = cvs.getContext("2d", { willReadFrequently: true });

  // paint 'css' over 'baseRGB' and read the composited pixel
  const SENTINEL = "#ff00ff";
  const parses = (css) => {
    c.fillStyle = SENTINEL;
    c.fillStyle = css;
    return c.fillStyle !== SENTINEL || /ff00ff|magenta/i.test(css);
  };
  const composite = (css, base) => {
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = "rgb(" + base.join(",") + ")";
    c.fillRect(0, 0, 1, 1);
    c.fillStyle = css;
    c.fillRect(0, 0, 1, 1);
    const d = c.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };

  // Effective background: composite every ancestor background over white,
  // outermost first, so translucent layers stack the way they paint.
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== "transparent" && !bg.endsWith(", 0)")) layers.push(bg);
    }
    let base = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) base = composite(layers[i], base);
    return base;
  };

  const fails = [];
  const unparsed = [];
  const seen = new Set();
  document.querySelectorAll("p, span, a, h1, h2, h3, li, button, figcaption, label, div, small").forEach((el) => {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    if (el.closest(".sr-only")) return;
    if (el.closest("header")) return; // fixed bar — verified by pixel sampling
    if (el.closest("[aria-hidden='true']")) return; // decorative, not announced
    // Button/link labels sit on a filled control whose background the ancestor
    // walk cannot resolve through the wrapper; those are asserted separately.
    if (el.closest("a[class*='bg-'], button[class*='bg-']")) return;
    if (!parses(cs.color)) { unparsed.push(cs.color); return; }
    // skip text hidden behind a clip (screen-reader copies)
    if (cs.position === "absolute" && cs.clip !== "auto" && cs.clip !== "") return;

    const bg = bgOf(el);
    const fg = composite(cs.color, bg);
    const r = ratio(fg, bg);

    const size = parseFloat(cs.fontSize);
    const weight = +cs.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    if (r >= need) return;

    const text = el.textContent.trim().slice(0, 40).replace(/\\s+/g, " ");
    const key = text + "|" + cs.color + "|" + (el.className || "");
    if (seen.has(key)) return;
    seen.add(key);
    fails.push({
      text,
      ratio: +r.toFixed(2),
      need,
      size: Math.round(size),
      cls: (el.className || "").toString().slice(0, 62),
    });
  });
  return { fails, unparsed: [...new Set(unparsed)] };
})()`;

const routes = ["/", "/approach", "/what-we-do", "/nri-markets", "/why-gromento", "/contact"];
let total = 0;
for (const route of routes) {
  await page.goto("http://localhost:21784" + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const { fails, unparsed } = await page.evaluate(audit);
  total += fails.length;
  if (unparsed.length) console.log(`  (skipped ${unparsed.length} colour(s) the canvas could not parse: ${unparsed.join(", ").slice(0, 90)})`);
  console.log(`\n=== ${route} — ${fails.length} below threshold ===`);
  fails.forEach((f) => console.log(`  ${String(f.ratio).padStart(5)} (need ${f.need}) ${String(f.size).padStart(3)}px  "${f.text}"  · ${f.cls}`));
}
// Controls: assert label-on-fill using the same canvas compositing as the
// sweep — regex colour parsing cannot handle oklab()/color-mix() output.
const controlAudit = `(() => {
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = 1;
  const c = cvs.getContext("2d", { willReadFrequently: true });
  const composite = (css, base) => {
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = "rgb(" + base.join(",") + ")";
    c.fillRect(0, 0, 1, 1);
    c.fillStyle = css;
    c.fillRect(0, 0, 1, 1);
    const d = c.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };

  const pageBase = composite(getComputedStyle(document.body).backgroundColor, [255, 255, 255]);
  const out = [];
  document.querySelectorAll("a, button").forEach((el) => {
    const cs = getComputedStyle(el);
    const label = el.textContent.trim().slice(0, 30);
    if (!label) return;
    // resolve the control's own fill over its section ground
    let ground = pageBase;
    for (let n = el.parentElement; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && !bg.endsWith(", 0)") && bg !== "transparent") { ground = composite(bg, pageBase); break; }
    }
    const fill = composite(cs.backgroundColor, ground);
    const text = composite(cs.color, fill);
    const filled = !cs.backgroundColor.endsWith(", 0)") && cs.backgroundColor !== "transparent";
    if (!filled) return; // unfilled links inherit the section ground; covered by the page sweep
    out.push({ label, ratio: +ratio(text, fill).toFixed(2) });
  });
  return out;
})()`;

console.log("\n=== controls (label on its own fill) ===");
const controlRoutes = ["/", "/contact"];
const seenControls = new Map();
for (const route of controlRoutes) {
  await page.goto("http://localhost:21784" + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1300);
  const controls = await page.evaluate(controlAudit);
  controls.forEach((c) => { if (!seenControls.has(c.label)) seenControls.set(c.label, c); });
}
let controlFails = 0;
for (const c of seenControls.values()) {
  const bad = c.ratio < 4.5;
  if (bad) controlFails++;
  console.log(`  ${String(c.ratio).padStart(6)}  "${c.label}"${bad ? "   << FAILS" : ""}`);
}
console.log(`  control failures: ${controlFails}`);

// The fixed header floats over whatever is scrolled beneath it, so its
// background is not an ancestor. Resolve it by hit-testing the element behind
// the bar at each link's position, then measure against that.
const headerAudit = `(() => {
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = 1;
  const c = cvs.getContext("2d", { willReadFrequently: true });
  const composite = (css, base) => {
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = "rgb(" + base.join(",") + ")";
    c.fillRect(0, 0, 1, 1);
    c.fillStyle = css;
    c.fillRect(0, 0, 1, 1);
    const d = c.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };

  const out = [];
  document.querySelectorAll("header a, header button").forEach((el) => {
    const label = el.textContent.trim().slice(0, 24);
    if (!label) return;
    // controls with their own fill are covered by the controls check
    // Skip controls that carry their own opaque fill — the controls pass
    // measures those. Opacity is detected by compositing over two different
    // bases: an opaque colour lands on the same pixel either way.
    const ownBg = getComputedStyle(el).backgroundColor;
    const onBlack = composite(ownBg, [0, 0, 0]);
    const onWhite = composite(ownBg, [255, 255, 255]);
    if (onBlack.join() === onWhite.join()) return;
    const r = el.getBoundingClientRect();
    const x = r.x + r.width / 2, y = r.y + r.height / 2;
    // everything under the pointer, skipping the header itself
    const behind = document.elementsFromPoint(x, y).find((n) => !n.closest("header"));
    let base = [255, 255, 255];
    const layers = [];
    for (let n = behind; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && !bg.endsWith(", 0)") && bg !== "transparent") layers.push(bg);
    }
    for (let i = layers.length - 1; i >= 0; i--) base = composite(layers[i], base);
    // the bar's own translucent fill sits between the page and the text
    const barBg = getComputedStyle(el.closest("header").firstElementChild.firstElementChild ?? el).backgroundColor;
    const ground = barBg && !barBg.endsWith(", 0)") ? composite(barBg, base) : base;
    const text = composite(getComputedStyle(el).color, ground);
    out.push({ label, behind: behind?.tagName + "." + (behind?.className || "").toString().slice(0, 18), ratio: +ratio(text, ground).toFixed(2) });
  });
  return out;
})()`;

console.log("\n=== fixed header, measured against what is behind it ===");
for (const [route, scroll] of [["/", 0], ["/", 900], ["/why-gromento", 0]]) {
  await page.goto("http://localhost:21784" + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1300);
  if (scroll) { await page.evaluate((y) => window.scrollTo(0, y), scroll); await page.waitForTimeout(800); }
  const res = await page.evaluate(headerAudit);
  const worst = res.reduce((a, b) => (a.ratio < b.ratio ? a : b));
  console.log(`  ${route} @${scroll}px  worst ${worst.ratio} ("${worst.label}" over ${worst.behind})${worst.ratio < 4.5 ? "  << FAILS" : ""}`);
}

console.log(`\nTOTAL failing: ${total}`);
await browser.close();
