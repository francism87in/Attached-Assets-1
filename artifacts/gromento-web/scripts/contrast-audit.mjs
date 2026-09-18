import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

// playwright-core ships no browser of its own. Use whatever Chromium this
// machine already has (PLAYWRIGHT_BROWSERS_PATH, a system install), and fall
// back to playwright's own lookup so a normal `npx playwright install` works.
const chromiumPath = () => {
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers"].filter(Boolean);
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const dir of readdirSync(root).filter((d) => d.startsWith("chromium")).sort().reverse()) {
      for (const rel of ["chrome-linux/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
        const exe = join(root, dir, rel);
        if (existsSync(exe)) return exe;
      }
    }
  }
  for (const exe of ["/usr/bin/chromium", "/usr/bin/google-chrome"]) if (existsSync(exe)) return exe;
  return undefined; // let playwright resolve its own download
};

const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--no-sandbox"] });
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
 *   3. fixed header — sampled from the painted pixels, because the bar's
 *                     ground is whatever scrolled under it, not an ancestor
 *
 * Exits non-zero if any pass reports a failure.
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
    // The fixed bar has no ancestor ground to resolve — pass 3 measures its
    // controls from the painted pixels instead.
    if (el.closest("header")) return;
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

// The fixed header floats over whatever is scrolled beneath it, so its ground
// is not an ancestor and cannot be resolved by walking the DOM: the layer under
// the bar is the grain overlay, whose own chain leads back to the light body,
// not to the dark plate the bar actually sits on.
//
// So read the ground off the screen instead. Each control is screenshotted with
// its glyphs made transparent, and the dominant colour of that shot is the true
// painted ground — translucency, backdrop blur and scrolled-under content
// included. The foreground is then the computed colour composited over it,
// which is exact: sampling glyph pixels directly cannot separate the ink from
// its anti-aliased fringe at 14px, and reports near-1:1 for text that is fine.
const HIDE = `[data-audit-hide], [data-audit-hide] * {
  color: transparent !important;
  text-shadow: none !important;
}`;

const sampleHeader = async (page) => {
  await page.evaluate((css) => {
    if (document.getElementById("audit-hide")) return;
    const tag = document.createElement("style");
    tag.id = "audit-hide";
    tag.textContent = css;
    document.head.append(tag);
  }, HIDE);

  const count = await page.evaluate(`(() => {
    window.__auditEls = [...document.querySelectorAll("header a, header button")].filter((el) => {
      const r = el.getBoundingClientRect();
      return el.textContent.trim() && r.width >= 4 && r.height >= 4 &&
        r.y >= 0 && r.x >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
    });
    return window.__auditEls.length;
  })()`);

  const results = [];
  for (let i = 0; i < count; i++) {
    const meta = await page.evaluate((i) => {
      const el = window.__auditEls[i];
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      // getComputedStyle is live, so snapshot every value BEFORE hiding the
      // glyphs — reading afterwards yields the transparent override instead.
      const meta = {
        label: el.textContent.trim().slice(0, 24),
        color: cs.color,
        size: parseFloat(cs.fontSize),
        weight: +cs.fontWeight || 400,
        clip: { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) },
      };
      el.setAttribute("data-audit-hide", "");
      return meta;
    }, i);

    const png = await page.screenshot({ clip: meta.clip });
    await page.evaluate((i) => window.__auditEls[i].removeAttribute("data-audit-hide"), i);

    const measured = await page.evaluate(
      async ({ b64, color }) => {
        const img = new Image();
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:image/png;base64," + b64; });
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;

        // dominant colour of the text-free shot = the ground actually painted
        const hist = new Map();
        for (let i = 0; i < d.length; i += 4) {
          const k = d[i] + "," + d[i + 1] + "," + d[i + 2];
          hist.set(k, (hist.get(k) || 0) + 1);
        }
        const ground = [...hist.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);

        // foreground = the computed colour (alpha and oklab included) over it
        const s = document.createElement("canvas");
        s.width = s.height = 1;
        const sc = s.getContext("2d", { willReadFrequently: true });
        sc.fillStyle = "rgb(" + ground.join(",") + ")";
        sc.fillRect(0, 0, 1, 1);
        sc.fillStyle = color;
        sc.fillRect(0, 0, 1, 1);
        const p = sc.getImageData(0, 0, 1, 1).data;
        const text = [p[0], p[1], p[2]];

        const lum = ([r, gg, b]) => {
          const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
        };
        const [hi, lo] = lum(ground) > lum(text) ? [lum(ground), lum(text)] : [lum(text), lum(ground)];
        return { ratio: +(((hi + 0.05) / (lo + 0.05))).toFixed(2), ground, text };
      },
      { b64: png.toString("base64"), color: meta.color },
    );

    const large = meta.size >= 24 || (meta.size >= 18.66 && meta.weight >= 700);
    results.push({ label: meta.label, need: large ? 3 : 4.5, ...measured });
  }
  return results;
};

console.log("\n=== fixed header, ground read off the screen ===");
let headerFails = 0;
for (const [route, scroll] of [["/", 0], ["/", 900], ["/why-gromento", 0]]) {
  await page.goto("http://localhost:21784" + route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1300);
  if (scroll) { await page.evaluate((y) => window.scrollTo(0, y), scroll); await page.waitForTimeout(800); }
  const res = await sampleHeader(page);
  const bad = res.filter((r) => r.ratio < r.need);
  headerFails += bad.length;
  const worst = res.reduce((a, b) => (a.ratio - a.need < b.ratio - b.need ? a : b));
  console.log(
    `  ${route} @${scroll}px  worst ${worst.ratio} (need ${worst.need}) "${worst.label}"` +
      ` rgb(${worst.text}) on rgb(${worst.ground})`,
  );
  bad.forEach((r) => console.log(`      << FAILS ${r.ratio} (need ${r.need}) "${r.label}"`));
}

const grand = total + controlFails + headerFails;
console.log(`\nTOTAL failing: ${grand}  (page ${total} \u00b7 controls ${controlFails} \u00b7 header ${headerFails})`);
await browser.close();
process.exit(grand === 0 ? 0 : 1);
