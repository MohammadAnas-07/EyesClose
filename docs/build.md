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

## Deploy (Vercel preview deployments)

The site URL used in canonical links, share tags, `robots.txt` and `sitemap.xml` comes from `SITE_URL` if set,
otherwise from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` (available at build time when **Automatically expose
System Environment Variables** is on, which is the default). Set `SITE_URL` in Vercel once a custom domain
exists, for example `https://eyesclose.in`.

Vercel builds with `npm run build -w web` and serves `web/dist`. Both are set in `vercel.json`, so the
dashboard settings below only need to not fight it. No keys or environment variables are needed yet:
the app is static and makes no server calls.

### One-time setup (in the Vercel dashboard)

1. Sign in at vercel.com with the GitHub account that owns this repo.
2. **Add New... > Project > Import Git Repository.** If the repo is not listed, choose
   **Adjust GitHub App Permissions** and give the Vercel app access to this one repository only.
3. On the **Configure Project** screen:
   - **Project Name:** `eyesclose` (any name works).
   - **Framework Preset:** `Other`. (`Vite` also works; `vercel.json` overrides the build settings either way.)
   - **Root Directory:** leave it as `./` (the repo root). `vercel.json`, `package.json` and `package-lock.json`
     live there, and the build uses npm workspaces. Do not point it at `web/`.
   - **Build and Output Settings:** leave the overrides off. `vercel.json` sets
     `buildCommand: npm run build -w web` and `outputDirectory: web/dist`. The install step runs `npm install`
     from the root, which installs both workspaces.
   - **Environment Variables:** leave empty for now.
4. Click **Deploy**. The first deploy is a production deploy of `main`.
5. **Settings > Build and Deployment > Node.js Version:** choose `22.x` to match CI.
6. **Settings > Git:** check that **Production Branch** is `main`.
7. **Settings > Deployment Protection:** keep **Vercel Authentication** on for preview deployments, so only
   signed-in team members can open previews.

### Preview deployments

- Every push to a branch other than `main`, and every pull request, gets its own preview URL. The Vercel bot
  posts the link on the pull request.
- Merging into `main` makes a production deployment.
- Nothing here changes CI. GitHub Actions still runs lint, type check, tests and build.

### How the security headers are applied

- The `headers` block in `vercel.json` (source `/(.*)`) is applied by Vercel to every response, on preview and
  production. That is where the Content-Security-Policy and the other security headers come from.
  No code or middleware is involved.
- To check a deployment: open the preview URL, open the browser's developer tools, go to **Network**, reload,
  click the first (document) request, and read the **Response Headers**. `Content-Security-Policy` must match
  `vercel.json` exactly. (With Vercel Authentication on, `curl` sees Vercel's login page instead of the app,
  so check in the browser after signing in.)
- Locally, `npm run build && npm run preview -w web` sends the same headers, because `web/vite.config.ts`
  reads them from `vercel.json`.

### Later: keys for the waitlist and email

When the waitlist chunk adds server functions, add these in **Settings > Environment Variables**, scoped to
**Preview** and **Production** separately. They go only in the Vercel dashboard, never in `vercel.json` or
the repo. The names match `.env.example`:

- `DATABASE_URL`: the Supabase (Mumbai) Postgres connection string.
- `RESEND_API_KEY`: the Resend API key, for the waitlist confirmation email only.
- `WAITLIST_FROM_EMAIL`: the verified sender address in Resend.

Use separate values for Preview and Production, so test sign-ups never reach the real list.
