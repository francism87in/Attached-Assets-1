# PropAgent OS

A full-stack SaaS tool for real estate developers in India to manage project listings with AI-powered scorecards and public API endpoints.

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

- **Frontend**: React 19, Vite, TailwindCSS v4, shadcn/ui, Wouter, React Query, react-hook-form + zod
- **Backend**: Express 5, Drizzle ORM, PostgreSQL, Pino logging
- **AI**: OpenAI via Replit AI Integrations (`AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`)
- **Auth**: None (MVP scope)

## Features

- **Dashboard** (`/`) — Portfolio stats (total projects, active, API calls, avg score), recent projects, system activity log
- **Projects List** (`/projects`) — Searchable table with scores, API call counts, status badges, dropdown actions
- **New Project** (`/projects/new`) — Full form: basic info, pricing, carpet area, possession, unit types, amenities, location/trust score sliders
- **Edit Project** (`/projects/:id/edit`) — Same form pre-filled from DB
- **Project Detail** (`/projects/:id`) — Overview cards, unit types, amenities, AI scorecard with progress bars, AI summary (generate/regenerate), API access shortcut
- **API Explorer** (`/projects/:id/api`) — Public endpoint URL, live Test API button, sample JSON response, cURL/JS/Python integration snippets

## Score Logic

- **Value Score**: Calculated from price per sq ft (server-side brackets)
- **Location Score**: Manual slider (0–100), stored in DB
- **Trust Score**: Manual slider (0–100), stored in DB
- **Overall Score**: `value×0.4 + location×0.35 + trust×0.25`

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/projects` | List all projects (with optional `?search=`) |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project detail |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/generate-summary` | Generate AI summary (OpenAI) |
| GET | `/api/projects/:id/scorecard` | Get full scorecard breakdown |
| POST | `/api/projects/:id/recalculate-scores` | Recalculate all scores |
| GET | `/api/projects/:id/api-endpoint` | Get public endpoint info + call count |
| GET | `/api/public/projects/:id` | Public AI-ready listing endpoint |
| GET | `/api/dashboard/stats` | Portfolio stats |
| GET | `/api/dashboard/recent-activity` | Recent activity log |

## DB Schema

- `projects` table: all project fields, scores, AI summary fields, `apiCallCount`, `hasSummary`
- `activityLog` table: project activity feed

## Codegen

```bash
pnpm --filter @workspace/api-spec run codegen
```

Regenerates `lib/api-client-react/src/generated/api.ts` and `lib/api-zod/src/generated/api.ts`.

## CSS Notes

- Google Fonts loaded via `<link>` in `index.html` (NOT `@import url()` in CSS — PostCSS will error)
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (mono/code)
- Wouter `<Link>` renders as `<a>` — do NOT wrap in another `<a>` tag

## Seeded Data

3 example projects seeded in the database:
- Prestige Lakeside Habitat (Bengaluru) — has AI summary
- Godrej Meridien (Gurugram)
- Tata Serein (Thane)
