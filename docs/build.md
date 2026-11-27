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

## Migrations and DATABASE_URL

`npm run db:migrate` runs `server/scripts/migrate.mjs`. It finds `DATABASE_URL` in this order:

1. An exported environment variable, for example `DATABASE_URL=postgres://... npm run db:migrate`.
2. The `.env` file in the repo root (copy it from `.env.example`).

It uses Node's built-in env parser, so no dotenv package is needed. If neither is set, it stops with:
"DATABASE_URL is not set. Copy .env.example to .env in the repo root, or export DATABASE_URL, then try again."
Other arguments pass through to node-pg-migrate, for example `npm run db:migrate -- down`.
A unit test (`server/scripts/migrate.test.ts`) covers both sources and the missing case.

Local steps:

```sh
cp .env.example .env
npm run db:up        # needs Docker Desktop running
npm run db:migrate
```

## CI

`.github/workflows/ci.yml` runs on every push and pull request:
`npm ci`, then lint, type check, tests and build on Node 22. It needs no secrets.

## Deploy

Vercel builds with `npm run build -w web` and serves `web/dist`. Security headers come from `vercel.json`.
Deployment setup is not part of chunk 0.
