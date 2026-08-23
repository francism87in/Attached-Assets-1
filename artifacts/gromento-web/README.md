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

- **Scroll-linked**: hero parallax + dim, aurora drift, the demand-chain in
  *The Gromento Difference* that fills as you read it, the read-progress rail.
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
