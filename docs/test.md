# Tests

Run everything with `npm run check` from the repo root.

## Kinds of tests

| Kind | Tool | Where | Run |
| --- | --- | --- | --- |
| Unit | Vitest | `web/src/**/*.test.ts(x)`, `server/src/**/*.test.ts` | `npm run test` |
| Component | Vitest + Testing Library (jsdom) | `web/src/**/*.test.tsx` | `npm run test` |
| Content | Vitest (planned) | checks every file in `content/` has `source`, `lastChecked`, `verifiedBy`, `version` | `npm run test` |
| End to end (planned) | agent-browser or Playwright | `e2e/` | to be added |
| Lint rules | ESLint | no network calls in form and letter code | `npm run lint` |

## Test data

English only. Use obviously fake values, for example `TEST-NAME-7731`, `Bank of Testing`.
Never use real names, numbers or documents.

## The "nothing leaves your phone" test

This is the most important test. It has three layers.

1. **Lint layer (cheap, every commit).** ESLint bans `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`,
   `WebSocket` and `EventSource` in `web/src/features/form/**` and `web/src/features/letters/**`.
2. **Unit layer.** A test renders the form, fills it, and builds a letter with `globalThis.fetch`,
   `XMLHttpRequest` and `navigator.sendBeacon` replaced by spies. It fails if any spy is called.
3. **End-to-end layer.** In a real browser:
   - fill every question with unique marker strings (for example `MARKER-RELATION-1`);
   - generate a checklist and every letter as PDF;
   - record every network request (URL, headers, body);
   - fail if any request goes to an origin other than our own, or if any URL, header or body contains a
     marker string;
   - also fail if the page has any third-party script, or if localStorage, sessionStorage, IndexedDB or
     cookies contain a marker string.

Layer 2 is in `web/src/features/form/ui/FormFlow.test.tsx` (it also stubs `WebSocket` and `EventSource`).
Test files may spy on these APIs, so they are left out of the ESLint rule; form source code is not.
Layer 3 is still to come; it needs the letters and PDFs.

## CSP check

`web/src/csp.test.ts` reads `vercel.json` and fails if the CSP loses `default-src 'none'`, gains any `unsafe-`
keyword, a wildcard or a third-party origin, or drops Trusted Types, `form-action 'none'` or `frame-ancestors 'none'`.
Any change to the CSP needs a reason in the PR.

## Manual phone test (before each release)

Use a preview deployment and fake test data (for example `Test Name Markerone`). Tick each line and note the
phone model and browser version in the PR.

**Android, Chrome**
- [ ] The start screen fits at the phone's width with no sideways scrolling. Text is readable without zoom.
- [ ] All 10 questions work by touch. Back keeps answers. "Not sure" works on each one.
- [ ] A name in another script (for example Devanagari) shows the calm English-letters message.
- [ ] Checklist: notes open and close, ticks work, "Official page" opens in a new tab.
- [ ] "Make this letter" on a bank item: the name is filled in, the date is today, the preview updates.
- [ ] "Download PDF" shows "Making your PDF", then saves `eyesclose-bank-letter.pdf`. It opens in the phone's
      PDF viewer with two pages, and the file name has no personal details.
- [ ] Airplane mode after the checklist has loaded: Download PDF still works, or shows the calm message and
      Print instead works.
- [ ] Refresh the page: the answers are gone, as the start screen says.

**iPhone, Safari**
- [ ] The same steps as Android.
- [ ] Download PDF opens the PDF or offers to save it in Files. Note which one happens.
- [ ] The date field opens the iOS date picker and the chosen date shows in the preview.
- [ ] With Settings > Accessibility > Motion > Reduce Motion on, no screen fades or spinner movement.

**Opened from inside WhatsApp**
- [ ] Send the preview link in a WhatsApp chat and tap it, on Android and on iPhone.
- [ ] Note whether it opens in WhatsApp's in-app browser or the phone's browser.
- [ ] The whole form and checklist work there.
- [ ] Download PDF either saves the file or shows the calm message. If downloads are blocked in the in-app
      browser, note it, then check that "Open in browser" and Print instead both work.

**A4 printout**
- [ ] Print the bank letter and the Vi letter on A4 paper (a home printer and, if possible, a print shop).
- [ ] Page 1 is "Before you print" and page 2 is the letter. Nothing is cut off at the edges.
- [ ] Text is black, clear and readable. Blank lines are long enough to write on by hand.
- [ ] Tick boxes are visible and large enough to tick with a pen.
- [ ] The letter page footer says only "Prepared with EyesClose".
- [ ] Print instead (the browser's print view) gives the same two pages.
