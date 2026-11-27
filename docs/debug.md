# Debugging common problems

## Install and environment

- **`npm ci` fails with a lockfile error.** Someone changed `package.json` without the lockfile. Run
  `npm install`, commit `package-lock.json`.
- **Wrong Node version.** Use Node 22 or later (`node -v`).
- **A value from `.env` is missing.** Copy `.env.example` to `.env`. Only database and email work need it.
  Never commit `.env`.
- **Windows line ending warnings.** `.gitattributes` keeps files as LF. Run `git add --renormalize .` if needed.

## Docker and Postgres

- **Port 5432 already in use.** Another Postgres is running. Stop it, or change the host port in
  `docker-compose.yml` and in `DATABASE_URL`.
- **Database not ready.** Run `docker compose ps` and wait for `healthy`. Logs: `docker compose logs db`.
- **Start fresh.** `docker compose down -v` deletes the local data volume. Local data only.

## CI

- **Passes locally, fails in CI.** CI uses Node 22 and a clean `npm ci`. Run `npm ci && npm run check`
  locally to match.
- **Lint errors in files you did not write.** Check the ESLint `ignores` list. Tool folders like `.claude/`
  are ignored on purpose.

## Content Security Policy

- **Something is blocked in production but works locally.** The dev server does not send the CSP; Vercel
  does. Open the browser console and look for "Refused to load". Fix the code (for example, move an inline
  script into a file). Do not loosen the CSP without a reason in the PR.

## PDFs

- **PDF is blank or text is missing.** Standard fonts cover English only. Check for characters outside basic
  Latin, such as curly quotes or the rupee sign; replace them or draw "Rs." instead.
- **Prints at the wrong size.** Make sure the page is A4 (595 x 842 points) and the print dialog is not set to
  "fit to page" on Letter paper.
- **Download does nothing on Android.** Some browsers block downloads not started by a tap. Start the PDF
  build from the button's click handler. Offer the print page as a fallback.
- **Slow on a cheap phone.** Check that pdf-lib is lazy loaded and not in the first bundle (`npm run build`
  shows chunk sizes).
