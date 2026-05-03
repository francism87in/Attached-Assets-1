# PropAgent OS

A full-stack SaaS tool for real estate developers in India to manage project listings with AI-powered scorecards and public API endpoints. Each user sees only their own projects (per-user data isolation).

## Architecture

**Monorepo** managed by pnpm workspaces.

| Package | Path | Purpose |
|---|---|---|
| `@workspace/propgent-os` | `artifacts/propgent-os` | React + Vite frontend (port 21783, previewPath `/`) |
| `@workspace/api-server` | `artifacts/api-server` | Express 5 API server (port 8080, path `/api`) |
| `@workspace/db` | `lib/db` | Drizzle ORM schema + migrations |
| `@workspace/api-spec` | `lib/api-spec` | OpenAPI spec (contract-first) |
| `@workspace/api-client-react` | `lib/api-client-react` | Generated React Query hooks (Orval) |
| `@workspace/api-zod` | `lib/api-zod` | Generated Zod schemas (Orval) |

## Stack

- **Frontend**: React 19, Vite, TailwindCSS v4, shadcn/ui, Wouter, React Query, react-hook-form + zod, Framer Motion, Recharts
- **Backend**: Express 5, Drizzle ORM, PostgreSQL, Pino logging
- **Auth**: Session-based auth with `express-session` + `connect-pg-simple` (PostgreSQL-backed sessions, persisted across restarts), bcryptjs password hashing
- **AI**: OpenAI via Replit AI Integrations (`AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`)

## Features

- **Landing Page** (`/`) — Public marketing page, no auth required
- **Register** (`/register`) — Create account with name, email, password, company
- **Login** (`/login`) — Session-based login
- **Dashboard** (`/dashboard`) — Portfolio stats, recent projects, activity log, real user greeting
- **Projects List** (`/projects`) — Searchable table, scores, status badges, delete with confirmation
- **New Project** (`/projects/new`) — Full form: basic info, pricing, carpet area, possession, unit types, amenities, location/trust score sliders
- **Edit Project** (`/projects/:id/edit`) — Same form pre-filled from DB
- **Project Detail** (`/projects/:id`) — 4 tabs: Overview, Scores (RadarChart + progress bars), AI Summary, API tab
- **API Explorer** (`/projects/:id/api`) — Public endpoint URL, live Test API button, cURL/JS/Python snippets
- **AI Reports** (`/ai-reports`) — AI readiness status across all user projects
- **Global API Console** (`/api-console`) — Live API console, request log, multi-endpoint testing

## Score Logic

- **Value Score**: Calculated from price per sq ft (server-side brackets)
- **Location Score**: Manual slider (0–100), stored in DB
- **Trust Score**: Manual slider (0–100), stored in DB
- **Overall Score**: `value×0.4 + location×0.35 + trust×0.25`
- **Lifestyle Score** (frontend only): `min(100, amenities.length × 7.5 + 10)`
- **Investment Score** (frontend only): `valueScore×0.35 + locationScore×0.45 + trustScore×0.2`

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Auth | Logout |
| GET | `/api/auth/me` | Auth | Current user info |
| GET | `/api/projects` | Auth | List user's projects |
| POST | `/api/projects` | Auth | Create project (assigned to user) |
| GET | `/api/projects/:id` | Auth (owner) | Get project |
| PUT | `/api/projects/:id` | Auth (owner) | Update project |
| DELETE | `/api/projects/:id` | Auth (owner) | Delete project |
| POST | `/api/projects/:id/generate-summary` | Auth (owner) | Generate AI summary |
| GET | `/api/projects/:id/scorecard` | Auth (owner) | Full scorecard breakdown |
| POST | `/api/projects/:id/recalculate-scores` | Auth (owner) | Recalculate scores |
| GET | `/api/projects/:id/api-endpoint` | Auth (owner) | Public endpoint info |
| GET | `/api/public/projects/:id` | **Public** | AI-ready listing (no auth, increments call count) |
| GET | `/api/dashboard/stats` | Auth | Portfolio stats |
| GET | `/api/dashboard/recent-activity` | Auth | Activity log |

## DB Schema

- `users` table: `id`, `name`, `email`, `password_hash`, `role`, `company`, `created_at`, `updated_at`
- `projects` table: all project fields + `user_id` (FK → users), scores, AI summary fields, `api_call_count`
- `activityLog` table: project activity feed
- `session` table: auto-created by `connect-pg-simple` for persistent sessions

## Auth Notes

- Sessions stored in PostgreSQL (`session` table) via `connect-pg-simple` — survive server restarts
- Session secret from `SESSION_SECRET` env var (set in Replit secrets)
- All `/api/projects/*` routes require auth and enforce ownership via `userId` check
- Public endpoint `/api/public/projects/:id` is intentionally open (no auth)

## Codegen

```bash
pnpm --filter @workspace/api-spec run codegen
```

Regenerates `lib/api-client-react/src/generated/api.ts` and `lib/api-zod/src/generated/api.ts`.

## CSS Notes

- Google Fonts loaded via `<link>` in `index.html` (NOT `@import url()` in CSS — PostCSS will error)
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (mono/code)
- Wouter `<Link>` renders as `<a>` — do NOT wrap in another `<a>` tag
- `zod/v4` import works in lib packages but NOT in api-server (esbuild) — always use `import { z } from "zod"` in server code

## Pending / Future

- PDF export for AI Reports (button visible, marked "Coming Soon")
- User profile / settings page
