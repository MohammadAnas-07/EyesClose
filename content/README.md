# Content

Letter templates and checklist steps live here as versioned JSON files, one file per item.
Every change goes through a pull request, so each change is reviewable.

Every item must have these fields:

- `id`: stable id, for example `bank-sbi-closure`.
- `version`: a number, raised on every content change.
- `source`: the official page or form URL of the institution.
- `lastChecked`: the date someone last checked the source, as `YYYY-MM-DD`.
- `verifiedBy`: name and role of the CA or lawyer who reviewed it, or `null`.

While `verifiedBy` is `null`, the app must show "Not yet checked by a professional" on that item.
Nothing may be shown as verified until a real reviewer fills that field.

## Checklist items (`checklist/`)

Each checklist file also has:

- `title`: plain English shown on screen.
- `official`: only what the source page says, in plain words. Shown as "From the official page".
  Must be `null` when there is no source.
- `suggestion`: our own advice, or `null`. Shown as "Our suggestion". Never put advice in `official`.
- `group`: `first-7-days`, `weeks-2-4` or `later`.
- `category`: decides the order inside a group (SIM, UPI and bank first, subscriptions last).
  The full order is `CATEGORY_ORDER` in `web/src/features/form/checklist.ts`.
- `contact`: who to contact, or `null` if not known.
- `when`: the answers that make the item appear. The item shows when any one condition matches,
  for example `{ "question": "banks", "anyOf": ["sbi"] }`.

- `confirms`: one line saying what the full source page itself says, written when the page was read
  in full on the `lastChecked` date. Item text must not claim more than the page says.

`source: null` means no official page was found yet. The app then shows "Source needed", and
`lastChecked` and `confirms` must also be `null`. Never invent a rule, deadline, form name or phone number.

The schema lives in `web/src/features/form/checklist.ts`. A unit test parses every file, so a broken or
incomplete item fails CI.

## Harder situations pages (`help/`)

One file per page at `/help/<slug>`. Each file has `slug`, `version`, `order`, `title`, `description` (one line,
used in lists and share tags), `opening` (one calm sentence), and:

- `official`: a list of claims. Each one has `text` (what the source says, in plain words), `source` (an https
  URL), `confirms` (the source's own words, for the review packet), `lastChecked` and `verifiedBy`.
- `suggestions`: our own advice, shown as "Our suggestion, not from an official page". Keep them few.
- `lawyer`: concrete cases for "When to talk to a lawyer". No legal conclusions.
- `sourceNeeded`: what we could not confirm and so left out. Listed in the review packet only.

On-screen text must be plain English in Latin letters. Do not say who inherits what. No deadline, fee or section
number unless the source page states it. The schema is `web/src/features/help/schema.ts`. Each page also needs a
shell file at `web/help/<slug>/index.html` and a rewrite in `vercel.json`; tests check both.

After any content change, run `npm run review-packet`.

## Letters (`letters/`)

Each letter file has `sources` (URL plus a one-line `confirms`), `lastChecked`, `verifiedBy`, `appliesTo` (the
checklist items that offer it), `takeWith` (the institution's own form) and `letter`, a list of blocks:
`text`, `field` (a blank line written by hand), `ticks`, `list`, `gap` and `signature`.

- Text may use only these placeholders: `{{deceasedName}}`, `{{writerName}}`, `{{date}}`, `{{institution}}`.
  Any other token fails the schema check.
- The enclosure list names only papers an official page names.
- Never type account numbers, Aadhaar, PAN, phone numbers or addresses into a letter. Use a `field`.
- A letter goes with the institution's own form. Do not say it is a legal requirement.
