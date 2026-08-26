# @workspace/gromento-web

Marketing site for **Gromento** — the real estate marketing partner built for NRI demand.

```bash
pnpm --filter @workspace/gromento-web dev        # http://localhost:21784
pnpm --filter @workspace/gromento-web build      # → dist/public
pnpm --filter @workspace/gromento-web serve      # preview the build
pnpm --filter @workspace/gromento-web typecheck
```

`PORT` and `BASE_PATH` are honoured when the platform sets them; they default to
`21784` and `/` so the package also runs standalone.

## Pages

Six routes, defined once in [`src/routes.ts`](src/routes.ts) — the menu, the
header nav, the footer and each page's title card all read from that list.

| Route | Page | Sections |
|---|---|---|
| `/` | Home | Hero · USP · Positioning · Difference · Core message |
| `/approach` | Approach | Difference · Content engine · Philosophy |
| `/what-we-do` | What We Do | Services · Content engine |
| `/nri-markets` | NRI Markets | Markets · For developers |
| `/why-gromento` | Why Gromento | USP · Six reasons · Positioning · Core message |
| `/contact` | Contact | Brief form · direct contact |

Unmatched paths render a 404 page. Sections shared between a page and its title
card take a `headless` prop so the heading isn't printed twice.

**Routing mode** is chosen at startup in `src/main.tsx`: path routing
(`/approach`) when served normally, hash routing (`#/approach`) when the page is
opened from a file or embedded in a sandboxed iframe, where `pushState` would
throw or escape the frame. `public/_redirects` gives Cloudflare Pages the SPA
fallback that path routing needs.

## Navigation

The header carries the logo, inline links from `xl` up, the contact CTA and a
labelled **Menu** pill that opens a full-screen overlay at every breakpoint.

The overlay replaced an earlier icon-only dropdown pinned to the top-right
corner. A full-bleed layer can't be covered by anything painted over that corner
(browser or host UI), the trigger is a large labelled target instead of a 40px
icon, and the menu became the site's main navigation moment: curtain drop,
staggered routes, hover-dims-the-rest. It locks background scroll and closes on
Escape, on route change and via the Close button.

## Where the content comes from

Every string lives in [`src/data/site.ts`](src/data/site.ts), transcribed from
`Gromento_Website_Content.docx`. Sections map 1:1 to the document:

| Doc section | Component |
|---|---|
| Hero / tagline / CTAs | `sections/Hero.tsx` |
| Our USP | `sections/Usp.tsx` |
| Our Positioning | `sections/Positioning.tsx` |
| The Gromento Difference | `sections/Difference.tsx` |
| Content Is Our Growth Engine | `sections/ContentEngine.tsx` |
| What We Do | `sections/Services.tsx` |
| Built Around the NRI Buyer Journey | `sections/Markets.tsx` |
| For Developers | `sections/Developers.tsx` |
| Our Philosophy | `sections/Philosophy.tsx` |
| Why Gromento | `sections/Why.tsx` |
| The Core Message | `sections/CoreMessage.tsx` |
| Closing Section | `sections/Closing.tsx` |

Connective microcopy that the document does not specify (nav labels, the
`Why Gromento` section title, form labels and helper text) is written to match
the document's voice and is equally editable from `site.ts` or the component.

## Theme

The site is **light-led**: paper is the default ground and a few blocks opt into
charcoal — the hero, the philosophy quote plate, the CTA band that closes each
page, the footer's tagline marquee and the contact brief panel. Measured across
the six pages that lands at **~77% light**.

Tone is a token swap, not a second stylesheet. `:root` holds the light values
for `--color-surface`, `--color-fg`, `--color-accent` and friends;
`[data-tone="dark"]` redeclares the same properties, and because a utility's
`var(--color-…)` resolves in the element's own context, everything inside a dark
block picks up the charcoal set automatically. Components never hard-code a
surface or text colour — `bg-surface`, `text-fg`, `text-fg-muted`,
`border-hairline`, `text-accent` — so the same component reads correctly on
either ground.

Two rules worth keeping:

- **Never indirect a token through another custom property.** A `var()` written
  inside a custom-property declaration is substituted at the declaration site
  (`:root`), not at the point of use, which silently freezes every section on
  the light palette.
- **Lime is not a text colour on paper** (`#D4FF00` on white fails contrast
  badly). The accent token resolves to deep violet `#4B0FA6` on light and lime
  on dark; lime stays a fill — CTA buttons, rules, the hero's live dot.

The header follows the same rule dynamically: it stamps the dark tone only while
it sits over Home's hero, and reverts to paper once it condenses on scroll.

## Accessibility check

```bash
pnpm --filter @workspace/gromento-web serve     # preview on :21784
pnpm --filter @workspace/gromento-web a11y      # contrast audit
```

`scripts/contrast-audit.mjs` walks every text element on all six routes and
reports anything under WCAG AA (4.5:1 body, 3:1 large), composited through a
canvas so Tailwind's `oklab()`/`color-mix()` output resolves correctly. It runs
three passes because backgrounds resolve differently for ordinary text, for
labels on filled controls, and for the fixed header over scrolling content.

Current state: **0 failures** across the six routes, controls at 16.7–18.0:1.

## Imagery

Original SVG artwork in [`public/media`](public/media) — no stock photography:

| File | Where | What it shows |
|---|---|---|
| `skyline.svg` | Hero base plate | Towers and a crane — the market being built |
| `routes-map.svg` | NRI Markets | Demand routes from five markets into one project |
| `engine.svg` | What We Do | The content engine ringed by the formats it produces |

`components/Figure.tsx` wraps them with a light scroll parallax and a caption.
Vector keeps them a few KB each, lossless at any size, and on brand — recolour
by editing the fills rather than re-exporting.

## Brand system

Tokens are declared once in [`src/index.css`](src/index.css) under `@theme`, so
Tailwind v4 generates the utilities (`bg-ink`, `text-lime`, `border-purple`, …):

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0D0D12` | Page ground (charcoal) |
| `purple` | `#7B2FFF` | Electric purple — depth, glows, gradients |
| `lime` | `#D4FF00` | Neon lime — primary CTA, accents, one highlight per headline |
| `violet` | `#4B0FA6` | Deep violet — aurora depth |
| `gray-cool` | `#A6A8B3` | Body copy |

Type: **Poppins** for display, **Inter** for body (loaded in `index.html`).
The logo mark keeps the arrow inside the `g` only, per the brand kit.

## Motion

Built on [Motion for React](https://motion.dev) (`motion/react`). The shared
language lives in [`src/lib/motion.ts`](src/lib/motion.ts) and the wrappers in
`src/components/Reveal.tsx`:

- **Cinematic route change**: violet and charcoal curtains sweep the viewport
  while the mark and the incoming page name hold the gap; scroll resets behind
  the cover so the jump is never seen. Headline legible ~0.9s after navigation.
- **Scroll-linked**: hero parallax + dim, aurora drift, page title cards that
  recede as you scroll, the demand-chain in *The Gromento Difference* that fills
  as you read it, the read-progress rail.
- **Atmosphere**: a fixed film-grain tile and vignette over the whole site
  (`components/Grain.tsx`) — one static SVG, no per-frame cost.
- **In-view**: one `whileInView` reveal per block with `once: true`, staggered
  children, word-by-word headline reveals.
- **Pointer**: magnetic CTAs, glass cards with a pointer-tracked light source.
- **Layout/presence**: `AnimatePresence` for the market panel, mobile nav and the
  contact form's success state; `layoutId` for the active market indicator.

Accessibility rules the motion follows: `useReducedMotion()` at every call site
renders the final state with no movement, the marquee is CSS-driven and pauses
on hover, animations are transform/opacity only, and a global
`prefers-reduced-motion` block in `index.css` is the backstop.

## Contact form

`sections/Closing.tsx` has no backend yet — it composes the brief into a
`mailto:` to `brand.email`. Field names already match a CRM intake payload;
swap the handler for the endpoint when one exists.

## Deploying to Cloudflare Pages

Three routes, fastest first.

**A. Drag and drop (no CLI, no repo access) — ~60 seconds**

1. Build: `pnpm --filter @workspace/gromento-web build` (output: `artifacts/gromento-web/dist/public`).
   Or use the prebuilt `gromento-cloudflare.zip` handed over with this change.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Upload assets**.
3. Project name `gromento`, drop the folder (or the zip's contents), **Deploy**.
4. Live at `https://gromento.pages.dev`.

**B. Wrangler CLI**

```bash
npx wrangler login                                   # once
pnpm --filter @workspace/gromento-web build
pnpm --filter @workspace/gromento-web deploy         # → wrangler pages deploy
```

`wrangler.toml` already pins the project name and `pages_build_output_dir`.

**C. Git-connected (auto-deploy on push)**

Cloudflare Pages → **Connect to Git** → this repo, then:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `pnpm install && pnpm --filter @workspace/gromento-web build` |
| Build output directory | `artifacts/gromento-web/dist/public` |
| Root directory | *(repo root)* |
| Env var | `NODE_VERSION` = `22` |

Every push to the production branch then redeploys; other branches get preview URLs.

**Custom domain**: Pages project → *Custom domains* → add `gromento.com`; Cloudflare
issues the certificate. `public/_headers` already sets cache and security headers —
hashed assets get a one-year immutable cache, HTML stays revalidated.
