# Roomify

Web app for turning **2D floor plans** into **photorealistic top-down renders** with AI. Upload a plan on the home page, open the visualizer, and compare the original with the generated result side by side.

Built with [React Router](https://reactrouter.com/) 7 (SSR-capable full-stack framework), Vite, React 19, TypeScript, and Tailwind CSS 4.

## What it does

- **Home (`/`)** — Hero, floor-plan upload, and a **Projects** grid loaded from your worker. Upload requires **Puter sign-in** (`components/Upload.tsx`). The UI advertises a **50 MB** max; drag-and-drop accepts **JPEG/PNG**, while the file input also lists **WebP**.
- **Visualizer (`/visualizer/:id`)** — Loads a project, runs AI generation if there is no render yet, shows the result, **before/after compare** (drag slider), and PNG export.

**AI pipeline:** `lib/ai.action.ts` calls Puter’s `ai.txt2img` with Gemini (`gemini-2.5-flash-image-preview`), using the floor-plan image plus the prompt in `lib/constants.ts` (`ROOMIFY_RENDER_PROMPT`) to enforce geometry, no text on the output, and a top-down architectural look.

**Storage & auth:** [Puter.js](https://puter.com/) (`@heyputer/puter.js`) handles sign-in and worker calls. Project metadata and hosted image URLs are persisted via a **Puter worker** you deploy; the app expects its base URL in env (see below).

## Requirements

- [Bun](https://bun.sh/) 1.3+ (see `package.json` → `packageManager`). CI uses `bun install --frozen-lockfile`.
- A **Puter** app with AI enabled and a **worker** that implements the project API used by `lib/puter.action.ts`:
  - `POST /api/projects/save`
  - `GET /api/projects/list`
  - `GET /api/projects/get?id=...`

If `VITE_PUTER_WORKER_URL` is missing, listing and saving projects are skipped (with console warnings); AI generation may still use Puter from the client depending on your Puter setup.

## Environment

Create a `.env` (or `.env.local`) in the repo root:

```bash
# Base URL of your Puter worker (no trailing slash required)
VITE_PUTER_WORKER_URL=https://your-worker.example.com
```

`lib/constants.ts` also defines storage path prefixes for Puter hosting (`roomify/sources`, `roomify/renders`).

## Scripts

| Command                                   | Description                                                       |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `bun install`                             | Install dependencies                                              |
| `bun run dev`                             | Dev server (default Vite port, typically `http://localhost:5173`) |
| `bun run build`                           | Production build (`build/client`, `build/server`)                 |
| `bun run start`                           | Serve production build (`react-router-serve`)                     |
| `bun run typecheck`                       | React Router typegen + `tsc`                                      |
| `bun run lint` / `bun run lint:fix`       | Oxlint                                                            |
| `bun run format:check` / `bun run format` | Oxfmt                                                             |
| `bun run test`                            | Vitest                                                            |
| `bun run check`                           | Format, lint, typecheck, test, and build                          |

## CI

GitHub Actions (`.github/workflows/build.yml`) runs on pushes to `main` and on pull requests: format check, lint, typecheck, tests, and production build.

## Docker

A multi-stage `Dockerfile` is included; it currently assumes an npm lockfile in the image build steps. If you only maintain `bun.lock`, align the Dockerfile with your install tool or generate a compatible lockfile before relying on it.

## Project layout (high level)

- `app/routes/home.tsx` — Landing, upload, project list.
- `app/routes/visualizer.$id.tsx` — Editor, generation, compare slider, export.
- `app/root.tsx` — Puter auth state via outlet context.
- `lib/ai.action.ts` — Image generation via Puter AI.
- `lib/puter.action.ts` — Auth helpers and worker API for projects.
- `lib/puter.hosting.ts` — Image upload paths for Puter hosting (referenced from `puter.action`).

## License / upstream

Application code is project-specific. React Router and tooling follow their respective licenses; this repo began from the React Router template but the product behavior and integrations are Roomify-specific.
