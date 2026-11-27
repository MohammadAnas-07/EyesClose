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

Layers 2 and 3 are added in the chunk that builds the form.

## CSP check (planned)

A test reads `vercel.json` and fails if the CSP loses `default-src 'self'`, adds `'unsafe-inline'` or
`'unsafe-eval'` to `script-src`, or adds any third-party origin to `connect-src` without the PR saying why.
