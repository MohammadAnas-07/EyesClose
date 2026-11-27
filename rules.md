# EyesClose: working rules

These are the real rules for the project. CLAUDE.md is ignored by git and only points here.

## How we work

- The project is split into chunks. Work on one chunk at a time.
- The project owner gives each chunk. Do not plan, invent, start or reorder chunks.
  When a chunk is done, report and wait.
- For every task, say the steps first, then do them. End each chunk with a short report.
- Keep token use low. Read only the files and line ranges you need. Do not paste big files or long logs.
  Do not re-read a file you just wrote. Summarise command output.
- Chat replies are short. Docs in the repo are plain, readable English.
- docs/MASTER_CHECKLIST.md is a reference library. Use only the sections a chunk points to. Many items do not
  apply, because EyesClose has no accounts and stores no personal data.
- design.md is the design source. Do not rewrite, regenerate or "improve" it. Put problems in
  docs/design-notes.md and in the chunk report.

## Language

- English only, everywhere: the app, PDFs, letters, docs, tagline and test data.
  No Hindi, no Hinglish, no Devanagari.
- Plain, simple English. Short sentences. No jargon. Many users are not fluent in English.
- When a hard term is needed (for example "nominee", "legal heir", "succession certificate"),
  explain it in plain words or link to the glossary.

## Voice and tone for grieving users

- Calm, gentle and kind. Never rude, cold or pushy.
- One short, gentle line of condolence at the start. Do not repeat it on every screen.
- No urgency tricks: no countdowns, no "act now", no red alarm wording, no fake scarcity.
- No upsell on the first screens. The waitlist button appears only after the user has their free checklist.
- Everyday words, not formal ones. Say "the person who died" or "your family member", not "the deceased",
  on screen. ("Deceased" is fine inside letters to banks, where it is the expected word.)
- Tell people what they can do now, and reassure them that it is fine to go slowly.
- Motion is calm and minimal. Honour prefers-reduced-motion.

## Privacy rules

- Form answers and generated letters never leave the device. They are never sent to our server and never stored.
- Do not ask for Aadhaar, PAN or account numbers. Letters leave blank lines for these.
- No user accounts. No login.
- Nothing is saved on the device by default. Any future saving is opt-in, with a "delete everything" button.
- No third-party scripts that can see form data. No session recording. No analytics that can capture answers.
- Keep the Content-Security-Policy strict. Any change to it needs a reason in the PR.
- Waitlist emails and feedback are personal data: consent first, store the minimum, allow deletion.
- Never log request bodies on the server.
- Code in the form and letter folders must not make network calls (enforced by ESLint).

## Content accuracy (letters and checklist)

Every letter template and every checklist step is a versioned file in `content/` with:

- `source`: the official page or form of the institution.
- `lastChecked`: the date the source was last checked (`YYYY-MM-DD`).
- `verifiedBy`: name and role of the CA or lawyer who reviewed it, or `null`.
- `version`: raised on every change.

Nothing is shown as verified until `verifiedBy` is filled by a real reviewer. Until then the app shows
"Not yet checked by a professional." Where an institution uses an official form or support email, give the
official steps and link. Do not make up a letter. Guidance pages say they are general information, not legal advice.

## Git

- One branch per piece of work, named like `chunk-0-setup` or `feat/short-name`. Never commit straight to main.
- Small commits that say what changed and why. No "update", "fix stuff" or "wip".
- Run lint, type check, unit tests and build before opening a PR (`npm run check`). If something fails, fix it
  or explain why in the PR.
- Open a PR for every branch. Write the title and description like a person: what changed, why, and how it
  was tested. No AI attribution lines of any kind in the PR title or description.
- Never commit secrets. `.env*` is ignored; only `.env.example` with fake values is committed.
- CLAUDE.md is in .gitignore. Never keep an important rule only in CLAUDE.md.

## CI

- CI runs lint, type check, tests and build on every push and PR. It must be green before merge.
