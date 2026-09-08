# SPARK — app prototype

A clickable prototype for **SPARK**, an on-demand home-services product in the mould of
[Snabbit](https://www.snabbit.com/): trained, background-verified experts at your door in about
ten minutes, billed by the hour from ₹99.

It is a front-end prototype — there is no server, no payment gateway and no real experts.
Bookings are created in the browser and persisted to `localStorage`.

## Run it

```bash
pnpm --filter @workspace/spark run dev           # http://localhost:5000 (override with PORT)
pnpm --filter @workspace/spark run build
pnpm --filter @workspace/spark run build:single  # one self-contained HTML file
pnpm --filter @workspace/spark run build:apk     # installable Android APK
pnpm --filter @workspace/spark run typecheck
```

`PORT` and `BASE_PATH` are read from the environment when present (Replit sets both); locally
they default to `5000` and `/`.

### Single-file build

`build:single` writes `dist/spark-prototype.html` — the whole prototype in one file, with CSS,
JS and both webfaces inlined as data URIs, so it runs from any static host or sandboxed frame
with no network access. That build sets `VITE_HASH_ROUTER=1`, which switches wouter to hash
routing (`#/book`, `#/track/:id`) since pushState paths can't be relied on there. The output is
an HTML fragment with no `<html>`/`<body>` wrapper; add a doctype and a viewport meta around it
to open it directly.

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
Home, Bookings and Account share a bottom tab bar; `/book` and `/track/:id` are flow
screens without one.

| Route | Screen |
|---|---|
| `/app` | App home — location header, instant-booking card or live booking, service grid, rebook, nearby experts. This is what the installed app opens on |
| `/book` | Four-step booking flow: location → service → when (instant or scheduled slot) → review & pay |
| `/track/:id` | Live tracking: map mock, ETA countdown, expert card, OTP hand-off, progress timeline, cancel, post-service rating |
| `/bookings` | Booking history with live status chips |
| `/account` | Profile, favourite experts, saved payment/address rows, and a control to reset prototype data |

A sticky "expert on the way" pill appears across the marketing site whenever a booking is open.

### Booking lifecycle

`assigned → on_the_way → arrived → in_progress → completed` (or `cancelled`). Instant bookings
start at `on_the_way` with a real ten-minute countdown and flip to `arrived` on their own;
entering the OTP shown on screen starts the work, and ending the booking opens the rating card.

## Android APK

`build:apk` produces `dist/spark.apk` — the prototype as an installable Android app. The
whole bundle ships in `assets/www/index.html`, so the WebView never touches the network and
the app works offline; it opens on `#/app`.

| | |
|---|---|
| Package | `com.spark.prototype` |
| Min / target SDK | 24 (Android 7.0) / 35 |
| Signing | APK Signature Scheme v2, debug key generated on first build |
| Size | ~0.23 MB |

There is no Gradle, Android Studio or `sdkmanager` in the loop — `android/build-apk.mjs`
drives four tools it fetches into `android/.tools/` (gitignored):

| Tool | Source | Why not the usual one |
|---|---|---|
| `aapt2` | extracted from `org.apktool:apktool-lib` | aapt2 has no distribution outside the SDK |
| `android.jar` (API 35) | `Sable/android-platforms` | the SDK platform download is on `dl.google.com` |
| `dx` | `com.jakewharton.android.repackaged:dalvik-dx` | `d8`/`r8` are only on Google's Maven |
| `apksig` | `com.android.tools.build:apksig:2.3.0` | the only apksig on Maven Central |

That indirection exists because `dl.google.com` — where the Android SDK, AGP and Google's own
Maven artifacts live — was unreachable from the machine this was built on. Everything above
comes from Maven Central or GitHub instead. If you have a normal SDK installed, a conventional
Gradle project over the same `android/` sources will produce the same app.

Two consequences of the constrained toolchain worth knowing:

- **v2-only signature.** apksig 2.3.0's v1 (JAR) signer calls a JDK-internal PKCS7 method that
  no longer exists on modern JDKs, so v1 is disabled. v2 is verified from Android 7.0, which
  sets the minSdk.
- **Debug signing key.** The keystore is generated locally on first build and lives in
  `android/.tools/`. It is not a release key — rebuild with your own before distributing.

Install with `adb install dist/spark.apk`, or copy it to a phone and open it (Android will ask
you to allow installs from that source).

## Layout

```
src/
  components/    UI primitives, site nav/footer, phone frame, app shell, bottom nav
  data/          services, cities, FAQ, testimonials, copy
  pages/         one file per route
  store/         bookings + prefs contexts (localStorage-backed)
scripts/         single-file bundler
android/         manifest, resources, WebView activity, APK build script
```

## Stack

React 19, Vite 7, Tailwind CSS v4 (tokens in `src/index.css`), wouter, framer-motion,
lucide-react. No component library — the primitives in `src/components/ui.tsx` are small enough
to read end to end.
