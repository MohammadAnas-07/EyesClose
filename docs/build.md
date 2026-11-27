# Build and run

## Needs

- Node.js 22 or later (CI uses 22; developed on 24).
- npm 10 or later.
- Docker, only for work on the waitlist or feedback database.

## First time

```sh
npm ci
cp .env.example .env   # only needed for database or email work
```

## Everyday commands (from the repo root)

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the web app at http://localhost:5173 |
| `npm run lint` | ESLint over the whole repo |
| `npm run typecheck` | TypeScript in every workspace |
| `npm run test` | Unit tests in every workspace |
| `npm run build` | Builds the web app (`web/dist`) and the server (`server/dist`) |
| `npm run check` | All four above, in order. Run this before every PR. |
| `npm run db:up` / `npm run db:down` | Start or stop local Postgres |
| `npm run db:migrate` | Apply migrations to `DATABASE_URL` |

## CI

`.github/workflows/ci.yml` runs on every push and pull request:
`npm ci`, then lint, type check, tests and build on Node 22. It needs no secrets.

## Deploy

Vercel builds with `npm run build -w web` and serves `web/dist`. Security headers come from `vercel.json`.
Deployment setup is not part of chunk 0.
