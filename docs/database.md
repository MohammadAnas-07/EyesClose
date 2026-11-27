# Database

Last updated 2026-11-27.

## The rule

**No personal case data is ever stored.** That means no form answers, no names of the person who died, no
relation, no bank or SIM details, no letters, no death certificates, no Aadhaar or PAN, no account numbers.
The database never sees any of it, because the browser never sends it.

## What may be stored

Only these, and only after they are built:

| Table (planned) | Fields | Why | Personal data? |
| --- | --- | --- | --- |
| `waitlist` | email, consent given at, consent text version, created at | Measure interest in the full pack. | Yes (email). Consent, minimal, deletable. |
| `feedback` | message, consent given at, created at | Learn what to fix. | Possibly, if someone types it. Tell users not to. Deletable. |
| `event_counts` | event name, day, count | Counts like `letter_generated`. | No. No user id, IP or cookie. |

Deletion: a person can ask for their waitlist email or feedback to be deleted. We delete the row, not hide it.

## Where it runs

- Local: Postgres 17 in Docker (`docker compose up -d db`).
- Production (recommended, not decided): Supabase in Mumbai (ap-south-1), used only as plain Postgres.

## Migrations

- Tool: node-pg-migrate, plain SQL files in `server/migrations/`.
- Run: `npm run db:migrate` (needs `DATABASE_URL`, see `.env.example`).
- There are no tables yet. Tables are added in the chunk that builds each feature.
- Every migration PR must say what is stored and why, and confirm it is not case data.
