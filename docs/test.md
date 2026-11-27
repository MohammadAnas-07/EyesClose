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
