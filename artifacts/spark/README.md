# SPARK — app prototype

A clickable prototype for **SPARK**, an on-demand home-services product in the mould of
[Snabbit](https://www.snabbit.com/): trained, background-verified experts at your door in about
ten minutes, billed by the hour from ₹99.

It is a front-end prototype — there is no server, no payment gateway and no real experts.
Bookings are created in the browser and persisted to `localStorage`.

## Run it

```bash
pnpm --filter @workspace/spark run dev     # http://localhost:5000 (override with PORT)
pnpm --filter @workspace/spark run build
pnpm --filter @workspace/spark run typecheck
```

`PORT` and `BASE_PATH` are read from the environment when present (Replit sets both); locally
they default to `5000` and `/`.

## What's in it

### Marketing site

| Route | Screen |
|---|---|
| `/` | Landing page — hero with an auto-playing app demo, services, how it works, trust promises, stats, testimonials, cities, expert-hiring block, FAQ, closing CTA |
| `/services/:slug` | Per-service page — what's included and excluded, pricing, coverage, related services |
| `/city/:slug` | Per-city page — clusters covered, services, local testimonials (live and "coming soon" variants) |
| `/experts` | Recruitment page for experts, with a mock application form |

### App surfaces

These render full-bleed on phones and inside a device bezel on desktop (`AppScreen`).

| Route | Screen |
|---|---|
| `/book` | Four-step booking flow: location → service → when (instant or scheduled slot) → review & pay |
| `/track/:id` | Live tracking: map mock, ETA countdown, expert card, OTP hand-off, progress timeline, cancel, post-service rating |
| `/bookings` | Booking history with live status chips |
| `/account` | Profile, favourite experts, saved payment/address rows, and a control to reset prototype data |

A sticky "expert on the way" pill appears across the marketing site whenever a booking is open.

### Booking lifecycle

`assigned → on_the_way → arrived → in_progress → completed` (or `cancelled`). Instant bookings
start at `on_the_way` with a real ten-minute countdown and flip to `arrived` on their own;
entering the OTP shown on screen starts the work, and ending the booking opens the rating card.

## Layout

```
src/
  components/    UI primitives, site nav/footer, phone frame, app shell
  data/          services, cities, FAQ, testimonials, copy
  pages/         one file per route
  store/         bookings + prefs contexts (localStorage-backed)
```

## Stack

React 19, Vite 7, Tailwind CSS v4 (tokens in `src/index.css`), wouter, framer-motion,
lucide-react. No component library — the primitives in `src/components/ui.tsx` are small enough
to read end to end.
