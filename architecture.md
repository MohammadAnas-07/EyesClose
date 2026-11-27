# EyesClose: architecture

Last updated 2026-11-27.

## The one rule

Form answers and generated letters never leave the user's device. Everything below follows from that.

## The pieces

```
Browser (the whole product)                     Server (tiny, optional pieces only)
----------------------------                    -----------------------------------
React app (web/)                                Vercel functions (server/)
  - smart form (state in memory only)             - POST waitlist   (email + consent)
  - checklist built from content/ data            - POST feedback   (free text + consent)
  - letters built from content/ data              - POST count      (event name only)
  - PDF made in the browser (pdf-lib)           Postgres (Supabase, Mumbai)
  - WhatsApp share (wa.me link, no personal data)  - waitlist, feedback, counters
  - service worker for offline use              Resend
                                                  - waitlist confirmation email only
```

### What runs in the browser

Everything the user sees and does: the form, the checklist, the letters, the PDFs and the share link.
Form state lives in React memory. It is not written to localStorage, IndexedDB or cookies. Closing the tab
clears it. (An opt-in "save on this device" may come later; see prd.md open question 3.)

### What runs on a server

Only three small endpoints, and none of them touch case data:

- **Waitlist:** an email address and a consent flag.
- **Feedback:** a short message and a consent flag. The form tells people not to type personal details.
- **Counter:** an event name such as `checklist_downloaded`. No answers, no user id, no cookie, no IP stored.

The server package (`server/`) is plain TypeScript functions, so they can be unit tested and then wrapped as
Vercel functions. If the waitlist turns out not to need a database (for example a mailing list provider), the
database can be dropped.

## How PDFs are made

- Library: **pdf-lib** (recommended, see prd.md open question 4). It runs in the browser, needs no server and
  no canvas, and the standard Helvetica font is built in, so no font file is downloaded. English text only,
  which the standard font covers.
- The library is loaded with a dynamic `import()` only when the user taps "Download", so the first page stays light.
- Page size A4, margins 20mm, black text on white, normal letter spacing, 11 to 12pt body text.
- Letters include blank lines (for example `Account number: ________________`) for details the user writes by hand.
- **Latin letters only in name fields.** Helvetica (WinAnsi encoding) cannot draw Devanagari or other scripts,
  and pdf-lib throws an error on characters it cannot encode. So name fields allow only `A-Z`, `a-z`, space,
  `.`, `-` and `'` (pattern `^[A-Za-z .'-]+$`). Validation runs on input and again right before the PDF is built,
  so the PDF step never sees an unsupported character. The friendly message is:
  "Please type the name using English letters (A to Z) only. For example: Sunita Sharma." (See prd.md.)
- Fallback: every letter is also a print-friendly HTML page (`@media print`), so a phone's own
  "Print / Save as PDF" works if pdf-lib fails.

## How letter and checklist content is stored

- Content lives in `content/` as JSON files, one item per file, reviewed through pull requests.
- Each item has `id`, `version`, `source` (official URL), `lastChecked` (date), and `verifiedBy`
  (reviewer, or `null`). See content/README.md.
- A schema check runs in CI so no item can be merged without a source and date.
- The app shows "Not yet checked by a professional" on any item where `verifiedBy` is `null`.
- Content is bundled into the app at build time, so it works offline and no request reveals which
  institutions a user picked.

## How we prove "nothing leaves your phone"

1. **Strict Content-Security-Policy** (set in `vercel.json`): `default-src 'self'`, `script-src 'self'`,
   `connect-src 'self'`, no inline scripts, no third-party origins, `frame-ancestors 'none'`.
   A third-party script cannot load, and the page cannot send data to any other site.
2. **No third-party scripts at all.** No tag managers, session recording, chat widgets or ad pixels.
   Fonts are self-hosted.
3. **No analytics that can see answers.** Only the first-party counter, which takes an event name from a fixed list.
4. **Code rule:** code in the form and letter folders may not call `fetch`, `XMLHttpRequest`,
   `navigator.sendBeacon` or `WebSocket`. An ESLint rule enforces this.
5. **Network test:** an end-to-end test fills the form with marker values, generates a PDF, and checks every
   network request. It fails if any request carries a marker value or goes to another origin. See docs/test.md.
6. **Plain words on screen:** "Your answers stay on your phone. Nothing is sent to us." Anyone can check with
   the browser's network tab.
7. **Error monitoring (later):** if Sentry is ever added, it must not capture form values, breadcrumbs of
   inputs, or session replays. That setup waits for its own chunk.

## Offline

Recommended (prd.md open question 8): a service worker caches the app shell, content and the PDF library
after the first visit. Then the form, checklist and letters work with no network.

## Local development

- `npm run dev` starts the web app.
- `docker compose up -d db` starts local Postgres (only needed for waitlist and feedback work).
- See docs/build.md.
