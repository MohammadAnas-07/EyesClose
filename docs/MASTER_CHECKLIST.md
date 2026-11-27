# MASTER PROMPT FOR CLAUDE CODE
Make this project secure, fast, legal, accessible and polished. Skip nothing.

---

## 0. HOW TO WORK (read this first)

You are my senior engineer and security reviewer. Do the following in order.

1. **Understand the project first.** Read the whole codebase. Find the stack (frontend, backend, database, auth, payments, hosting, AI features, file uploads). Write a short summary of what you found.
2. **Create `COVERAGE.md` in the project root before you change any code.**
   - Put EVERY item below in it, using its ID (A1, B7, C12 and so on).
   - Each item must end with one status:
     - `DONE` (with the file names you changed and how you tested it)
     - `NOT APPLICABLE` (with a clear reason, for example "no GraphQL in this project")
     - `NEEDS MY DECISION` (with the exact question)
   - You may NOT silently skip an item. If a feature does not exist (SAML, GraphQL, AI chat), say so in `COVERAGE.md`. If it is easy to add a safe guard for the future, add it.
3. **Work in phases.** Commit after each phase with a clear message. Run build, lint and tests after each phase. Do not break existing features.
   - Phase 1: Code structure and config (Section K)
   - Phase 2: Security (Sections A, B, C)
   - Phase 3: Speed and performance (Section E)
   - Phase 4: UI, UX, states, loaders, animation, password screen (Sections F to J, L, M)
   - Phase 5: Legal, privacy and trust (Section D)
   - Phase 6: Final verification (Section N)
4. **Test attacks only on my local or staging copy.** Never attack production. Never attack any third-party site or service. Never run load tests on production.
5. **Never put real secrets in code, chat, logs or commits.** Use fake values in `.env.example`.
6. **Be honest.** Do not say something is fixed unless you tested it. If something cannot be fixed by code (for example, hosting-level backups), build what you can (scripts, config, docs) and tell me exactly what I must do by hand.
7. **If you must pick between two options, pick the safer one** and tell me why in `COVERAGE.md`.
8. **If an item is unclear, make the most reasonable reading, write down which reading you took, and continue.** Only stop to ask me for decisions that cannot be undone.

---

## A. 14 ATTACKS A STRANGER WILL TRY (block every one)

For each one: write a test that tries the attack. The test must fail before your fix and pass after.

- **A1. Typing `/admin` in the URL.** Every admin page AND every admin API must check the user's role on the server. Hiding a link is not security. Non-admins get 403 or 404.
- **A2. Changing the ID in the URL (IDOR).** Every read, update and delete must check that the logged-in user owns that record (or has permission). Use unguessable IDs (UUID) as an extra layer, not as the only protection.
- **A3. API key in the browser.** Search the source, the built bundle, localStorage, cookies and network responses for secret keys. Only public/publishable keys may reach the browser. Move all secret-key calls to the server.
- **A4. Editing the price.** Never trust price, total, discount or currency sent from the client. Look up the price in the database on the server and calculate the total there.
- **A5. Ordering -1 items.** Validate every number on the server: whole number, minimum 1, sensible maximum. Reject negative, zero, decimals, huge values, NaN and strings. The final total can never be negative or zero by trick.
- **A6. Faking a payment.** A "success" page, redirect or client flag must never mark an order as paid. Only a verified webhook (or a server-side check with the payment provider) can do it. Make it safe to receive the same webhook twice (idempotent).
- **A7. Redeeming a coupon/credit/gift code/referral 100 times.** Enforce limits in the database (unique constraint or atomic transaction). It must hold even if someone sends 100 requests at the same moment (race condition). Test with parallel requests.
- **A8. Making yourself admin at signup (mass assignment).** Never accept `role`, `isAdmin`, `plan`, `credits`, `verified` or similar fields from signup or profile-update requests. Use an allow-list of fields. New users always get the lowest role.
- **A9. Guessing the login code.** For OTP, magic links, reset codes and invite codes: long random value from a secure random source, short expiry, single use, limited attempts, rate limit, lockout, and the same generic error message every time.
- **A10. Prompt-injecting your AI.** If the app has any AI feature: treat all user text, uploaded files and fetched web pages as untrusted. Keep system instructions separate. Give the AI the minimum tools and permissions. Never put secrets in prompts. Do not let the AI act as another user. Require confirmation before sensitive actions. Escape or validate AI output before showing or executing it. Add cost and rate limits. If there is no AI feature, mark NOT APPLICABLE.
- **A11. Script in the username (XSS).** Escape all output. Limit length and allowed characters on all text fields. Add a strict Content-Security-Policy.
- **A12. Uploading a non-photo.** Check the real file type by its content (magic bytes), not by the extension or the browser's MIME type. Limit file size. Re-encode images. Rename files randomly. Store them outside the web root or in a private bucket. Never run uploaded files. Be careful with SVG and PDF.
- **A13. `.env` committed to git.** Add `.env*` to `.gitignore`. Create `.env.example` with fake values. Scan the full git history for secrets (gitleaks or trufflehog). If anything is found, tell me which keys to rotate. Add a pre-commit hook that blocks secrets.
- **A14. Querying your database from outside.** The database must not be open to the public internet. Use only parameterised queries. Turn on row-level security where the database supports it. Check for debug routes, open admin panels, GraphQL introspection and endpoints that dump whole tables. Database credentials live only on the server.

---

## B. SECURITY CHECKLIST (29 items)

- **B1. SQL injection.** Find every query. Use parameterised queries or a safe ORM. No string-built SQL.
- **B2. Cross-site scripting (XSS).** Escape output, avoid `dangerouslySetInnerHTML` / `innerHTML` unless sanitised, add CSP.
- **B3. CSRF protection.** CSRF tokens or SameSite cookies plus Origin checks on every state-changing request.
- **B4. File upload validation.** Same rules as A12, applied to every upload route.
- **B5. Broken object-level authorisation.** Same idea as A2, checked on EVERY endpoint. List all endpoints in `COVERAGE.md` with the check used.
- **B6. Rate limiting.** Add limits on all endpoints, with stricter limits on login, signup, reset, OTP, search, AI and payment routes.
- **B7. Secure the JWT secret.** Long random secret from environment variables, never in code. Short token life, refresh flow, ability to revoke.
- **B8. Keep API secrets server-side.** Same as A3.
- **B9. Hash passwords securely.** Use Argon2id (or bcrypt/scrypt with strong settings). Never store plain text. Never use fast hashes (MD5, SHA-1, plain SHA-256).
- **B10. Multi-factor authentication.** Add MFA (authenticator app first, with backup codes). Required for admins.
- **B11. Tighten CORS.** Allow only the exact origins I use. No `*` with credentials.
- **B12. Remove auth tokens from browser storage.** Move tokens out of localStorage/sessionStorage. Use HttpOnly, Secure, SameSite cookies.
- **B13. Enforce permissions server-side.** The frontend only hides things. The server decides.
- **B14. Row-level security.** Turn it on for every table with user data and write policies. Test as a normal user, as a different user, and as anonymous.
- **B15. Verify webhook signatures.** Reject any webhook with a bad signature or an old timestamp.
- **B16. SSRF checks.** Any feature that fetches a URL (link preview, image import, webhook, AI browse) must block internal IPs, localhost, cloud metadata addresses and redirects to them. Use an allow-list where possible.
- **B17. Remove exposed source maps.** Do not ship source maps to production, or restrict them.
- **B18. Change default credentials.** Find and remove default admin accounts, sample passwords and demo keys.
- **B18b. Keep sensitive data out of logs.** No passwords, tokens, full card data, secrets or personal data in logs. Add a log-scrubbing step.
- **B19. Update vulnerable dependencies.** Run `npm audit` / `pip audit` (or the equivalent). Update or replace risky packages. Report anything you cannot fix.
- **B20. Server-side validation.** Validate type, length, range and format of every input on the server with a schema library (for example Zod). Client validation is only for user comfort.
- **B21. Limit the login rate.** Per account AND per IP: slow down and lock after repeated failures. Do not reveal whether an email exists.
- **B22. Passwords: hash, do NOT encrypt.** Encryption can be reversed; hashing cannot. Use B9 only. If the project currently "encrypts" passwords, migrate to hashing.
- **B23. Generic errors.** Users see simple messages. Stack traces, SQL errors and file paths go only to private logs.
- **B24. Do not expose API keys.** Final scan of the repo, build output and responses.
- **B25. Test for XSS, injection and other vulnerabilities.** Write automated security tests. Run a scanner (for example Semgrep, OWASP ZAP against local) and fix what it finds.
- **B26. Test with 1,000 and 10,000 users at the same time.** Write a load test (k6, Artillery or Locust) for the main flows: homepage, login, main action, checkout. Run it against local or staging only. Report response time (p50, p95, p99), error rate and the first bottleneck. Fix the bottlenecks. Tell me honestly what the current limit is.
- **B27. Data backups.** Automatic daily backups, encrypted, stored in a different place or region. Define how long we keep them. **Test a restore** and write the steps.
- **B28. Error monitoring.** Add error tracking (for example Sentry) with alerts. No personal data in error reports.
- **B29. Disaster recovery.** Write a recovery plan: what breaks, who does what, target time to recover (RTO), how much data we can afford to lose (RPO), how to restore from backup, how to roll back a bad deploy, and how to rebuild the environment from code.

---

## C. 20 PEN-TEST LEVEL ATTACKS (implement the defence in my project)

Apply each defence in the project. Where the feature does not exist, mark NOT APPLICABLE with the reason.

- **C1. HTTP/2 Rapid Reset.** Keep web server, proxy and CDN patched (CVE-2023-44487). Limit concurrent streams and stream resets. Put a CDN or WAF in front.
- **C2. 52-character username (column truncation).** Enforce maximum lengths on username, email, name and password on the server. Make them match the database column size. Reject too-long input instead of letting the database cut it, because a cut value can collide with an existing account (for example `admin` + spaces + junk). Trim whitespace. Add a unique constraint on the cleaned value.
- **C3. SAML bypass.** If SAML/SSO exists: use a well-maintained library, verify the signature on the correct element, reject unsigned assertions, check audience, recipient, expiry and replay, and guard against XML signature wrapping.
- **C4. nOAuth email spoof.** With OAuth/OIDC login, never identify or merge accounts by an unverified email claim. Use the provider's stable user ID plus a verified email.
- **C5. GraphQL aliases.** If GraphQL exists: limit query depth, complexity, alias count and batch size. Disable introspection in production. Make sure aliases cannot be used to brute-force login or OTP.
- **C6. 2FA code replay.** A code works once only. Store the last used time-step. Short expiry, attempt limits, and bind the code to the session.
- **C7. ReDoS.** Review every regex for catastrophic backtracking. Cap input length. Use a safe regex engine or timeouts for risky patterns.
- **C8. JWT algorithm confusion.** Fix the allowed algorithm on the server. Reject `alg: none`. Never let the token choose its own algorithm. Check `iss`, `aud` and `exp`.
- **C9. Request smuggling.** Make proxy and app server agree on request parsing. Reject requests with both Content-Length and Transfer-Encoding. Keep servers patched.
- **C10. Cache poisoning.** Cache keys must include everything that changes the response. Do not reflect unkeyed headers (Host, X-Forwarded-*). Never publicly cache logged-in or personal responses (`Cache-Control: private, no-store`). Set `Vary` correctly.
- **C11. Spoofed IP header.** Do not trust `X-Forwarded-For` or `X-Real-IP` from the client. Trust only the proxy hop I control. Rate limits must use the real client IP.
- **C12. Views bypass RLS.** Database views and `SECURITY DEFINER` functions can skip row-level security. Use `security_invoker = true` on views (or protect underlying tables) and test every view and function as a normal user.
- **C13. `Math.random` tokens.** Replace with a cryptographically secure random source (`crypto.randomBytes`, `crypto.getRandomValues`, `secrets`). Applies to tokens, reset links, session IDs, OTPs and invite codes.
- **C14. Timing attacks.** Use constant-time comparison for tokens, signatures and secrets. Login must take about the same time for a known and an unknown user.
- **C15. Padding oracle.** Do not write custom crypto. Use authenticated encryption (AES-GCM or libsodium). Return one generic error for any decryption failure.
- **C16. Prototype pollution.** Block `__proto__`, `constructor` and `prototype` keys in merged or parsed user data. Validate with a schema. Update risky libraries.
- **C17. Template injection.** Never build templates from user input. Use auto-escaping. No `eval`. Check email templates and PDF generators too.
- **C18. XXE file read.** Turn off external entities and DTDs in every XML parser (also in SVG, DOCX and XLSX handling). Prefer JSON.
- **C19. WebSocket hijack.** Check the `Origin` header, authenticate the connection, authorise every channel and message, limit message size and rate, use `wss://` only.
- **C20. Unicode account takeover (the "Spotify" trick).** Normalise usernames and emails (Unicode NFKC, lowercase/casefold, strip invisible characters). Reject look-alike mixed-script names. Use a unique constraint on the normalised value. Apply the same normalisation on signup, login, reset and every lookup.

---

## D. LEGAL, PRIVACY AND TRUST (11 items)

Draft these from the real facts of the project. **Do not invent facts.** Where you do not know something (company name, address, registration number, contact email), put a clear `[PLACEHOLDER]` and list all placeholders at the end. I must have a lawyer review all legal text. Assume my users may be in India (DPDP Act 2023), the EU (GDPR) and the US (CCPA) unless I say otherwise, and ask me which countries apply.

- **D1. Privacy policy** page, linked in footer and on signup.
- **D2. Terms and conditions** page.
- **D3. Cookie policy** page.
- **D4. Refund / cancellation policy** page (needed if anything is sold).
- **D5. Cookie and form consent.** Cookie banner with "Reject" as easy as "Accept". No non-essential cookies or trackers before consent. Unticked consent checkboxes on forms. Link to the policies. Store a record of consent.
- **D6. What user data we collect.** Build a table: each data field, why we collect it, where it is stored, how long we keep it, who can access it. Remove any field we do not need. Add a way to export and delete user data.
- **D7. Third-party data.** List every third party that receives user data (analytics, payments, email, ads pixels, fonts, CDNs, AI APIs, maps, chat widgets): what they get and why. Mention them in the privacy policy.
- **D8. ALT text and colour contrast.** Every meaningful image gets useful alt text; decorative images get empty alt. Text contrast at least 4.5:1 (3:1 for large text). Check with an automated tool (axe or Lighthouse) and fix.
- **D9. Keyboard-friendly forms and clear buttons.** Every input has a visible label. Tab order is logical. Focus is always visible. Enter submits forms. Buttons say what they do ("Create account", not "Submit"). Errors are linked to their fields (`aria-describedby`) and announced to screen readers.
- **D10. Fake reviews, unsupported claims and business details.** Remove invented testimonials, ratings, user counts, "as seen on" logos and any claim we cannot prove ("#1", "100% secure", "guaranteed"). Show real business details in the footer: legal name, address, contact email/phone, tax or registration number (placeholders if unknown).
- **D11. Copyrighted images and local laws.** Check the licence of every image, icon, font, video and music file. Make a list: file, source, licence. Replace anything with unknown or unsuitable licences. List the laws that apply for each country my users are in.

---

## E. SPEED AND PERFORMANCE

### E1. Implement all of these (20 items)
1. Cache API responses
2. Load balancer (make the app stateless so it can run on several instances; tell me honestly if a load balancer is overkill for my current traffic)
3. Add database indexes (check slow queries and add indexes for real filters, joins and sorts)
4. Compress images (modern formats like WebP/AVIF, correct sizes, responsive `srcset`)
5. Loading skeletons
6. Cache expensive queries
7. Fix N+1 database queries
8. Debounce input handlers
9. Split code into chunks (route-level and heavy-component splitting)
10. Put static assets behind a CDN
11. Server-side caching
12. Paginate large lists (or cursor-based pagination)
13. Run a Lighthouse audit; fix issues; show before/after scores
14. Compress API payloads (gzip or brotli, and send only the fields needed)
15. Remove unnecessary re-renders (memoisation, stable props, state placed close to where it is used)
16. Minify JS and CSS
17. Lazy-load images, routes and heavy components
18. Defer non-critical scripts
19. Remove unused dependencies and unused code
20. Database connection pooling

### E2. Five speed checks (find and fix)
- **E2.1 Optimistic UI.** Update the screen at once for likely-to-succeed actions (like, add, toggle, rename) and roll back with a clear message if the server fails.
- **E2.2 Uncompressed JSON.** Find large responses with no compression and fix them.
- **E2.3 Database one row at a time.** Find loops that insert, update or read one row per iteration. Replace with batch or bulk operations.
- **E2.4 Single dependency bottleneck.** Find any single dependency (database, third-party API, queue, file store) that the whole app waits on. Keep any single dependency under about 90% of its capacity at peak. Add timeouts, retries with backoff, a circuit breaker and a fallback so one slow service cannot take the app down.
- **E2.5 Server rebuilding HTML for every visitor.** Use caching, static generation or incremental regeneration for pages that are the same for everyone.

---

## F. LOADERS: put the right loader in the right place (8 types)

Rules: show nothing if the wait is under about 200 ms (avoids flicker). Never use a spinner everywhere. Add `aria-busy` and a visible or hidden status text for screen readers.

- **F1. Spinner:** short waits of unknown length in a small area.
- **F2. Skeleton loader:** pages, lists, cards and tables where the layout is known. Match the real layout so nothing jumps.
- **F3. Progress bar:** uploads, imports, multi-step flows, and the top-of-page route progress bar.
- **F4. Pulsing loader:** live or pending items (for example "processing", "typing", "waiting for payment").
- **F5. Button loader:** show a spinner inside the button, keep its width, disable it, and block double submit.
- **F6. Full-screen loader:** only for first app boot or auth check. Avoid otherwise.
- **F7. Pull-to-refresh loader:** mobile lists that refresh.
- **F8. Infinite-scroll loader:** at the bottom of the list, with an "end of list" message and a retry on error.

Make a table in `COVERAGE.md`: screen → loader type used.

---

## G. SAAS FEATURES AND PATTERNS (20 items)

Add each one where it fits this app. If one truly does not fit, mark NOT APPLICABLE with a reason.

1. Optimistic UI updates
2. Skeleton loaders
3. Command palette (Ctrl/Cmd+K)
4. Persistent sidebar navigation
5. Loading and empty states (see Section L)
6. Autosave (with a visible "Saved" / "Saving..." indicator)
7. Debouncing
8. Throttling (scroll, resize, rapid clicks)
9. Smart form validation (see Section J and H12)
10. Bulk actions on lists (select many, then act)
11. Reusable data table (sorting, selection, pagination, column control)
12. Advanced data filtering (multiple filters, saved filters, clear all)
13. Keyboard shortcuts (with a shortcuts help dialog)
14. Tier-based UI indicators (plan badges, locked features, usage meters)
15. Onboarding data capture (short steps, skippable where possible, collect only what we need)
16. Referral and affiliate pages (with fraud protection; see A7)
17. Custom 404 page
18. Mobile-optimised SaaS layouts
19. Destructive action protection (confirm, type-to-confirm for big deletes, undo)
20. Graceful error recovery (clear message, retry button, no lost user input)

---

## H. UI DETAILS (13 items)

1. **Empty states:** helpful message plus a clear next action.
2. **Skeleton loading:** as in F2.
3. **Focus management:** move focus into dialogs, return it after closing, trap it inside modals, visible focus ring everywhere.
4. **Destructive-action protection:** red/clear styling, explicit wording.
5. **Confirmation:** confirm dangerous actions; name what will be deleted.
6. **Undo patterns:** prefer "Undo" toasts over confirm dialogs where the action can be reversed.
7. **Error recovery:** retry, keep form data, explain what happened in plain words.
8. **Sticky navigation:** header or sidebar stays reachable without covering content.
9. **Responsive typography:** fluid sizes (`clamp()`), comfortable line length and line height.
10. **Visual hierarchy:** one clear primary action per screen; size, weight and spacing show importance.
11. **Information scent:** links and buttons say where they lead; labels are specific.
12. **Form validation:** inline, at the right time, with helpful messages (see Section J).
13. **Reduced-motion support:** honour `prefers-reduced-motion` everywhere (see Section I).

---

## I. ANIMATION

### I1. Ten niche animation tricks
1. **Scale from 0.97**, not from 0, for things that appear (with a quick fade).
2. **Press feedback:** buttons shrink slightly (about 0.97) while pressed.
3. **Shake an error:** a short horizontal shake (about 300 ms) on an invalid field or form.
4. **Directional slides:** slide in the direction that matches the action (forward from the right, back from the left, menus from their origin).
5. **Smooth `height: auto`:** animate with the `grid-template-rows: 0fr → 1fr` trick, a measured height, or layout animation.
6. **Use `transform` and `opacity`, not `left/top/width/height`,** so the browser does not re-layout.
7. **Instant theme switch:** temporarily turn off transitions when toggling light/dark so colours do not flash or lag.
8. **Tooltip skip delay:** first tooltip waits a short time; once one is open, neighbouring tooltips open instantly.
9. **Velocity springs:** on drag release, carry the gesture's speed into a spring so it feels physical.
10. **Rubber banding:** add resistance when dragging past the edge, then ease back.

### I2. Ten motion principles
1. **Stagger list rows** (about 30 to 50 ms apart, with a cap so long lists do not feel slow).
2. **Dropdowns animate in about 250 ms or less.**
3. **Make exits shorter** than entrances.
4. **Start popovers at 0.95**, not 0.
5. **Squash and stretch:** very subtle, only for playful elements.
6. **Anticipation:** a tiny wind-up before a big action.
7. **Follow-through:** a small settle after movement, only for playful moments.
8. **Move in arcs** when an element travels between two points, where it looks natural.
9. **Ease-in-out for moves** (ease-out for entering, ease-in for leaving).
10. **No bounce on everyday UI** (buttons, menus, forms). Items 5 and 7 never apply to everyday UI.

Always: respect `prefers-reduced-motion` (replace motion with a simple fade or nothing).

---

## J. PASSWORD SCREEN (build all 8)

1. **Cut the red rules.** No red error text while the user is still typing. The "confirm password" field must not show a mismatch error until the user leaves it or stops typing. (Consider removing the confirm field and offering a show-password toggle instead.)
2. **Strict rules, no common passwords.** Minimum length 12, allow very long passwords (at least 64). No forced "must have a symbol" rules. Block common and breached passwords (use a local top-passwords list or the Have I Been Pwned range API with k-anonymity). Block passwords that contain the username or email. Enforce all of this on the server too.
3. **Be honest and secure.** Real strength feedback (a library like zxcvbn), no fake "Strong!" labels, no "unhackable" claims. Say plainly what is wrong. Never log or send the password anywhere unneeded. Do not reveal whether an account exists.
4. **Recommend a secure password.** A "Suggest a password" button using a secure random generator. Show it in small chunks (for example `xxxx-xxxx-xxxx-xxxx`). Add a copy button. Support password managers (`autocomplete="new-password"`).
5. **The outline is the meter.** The input's outline fills as the password gets stronger and closes into one full shape when strong. No "weak/strong" label needed visually (keep hidden text for screen readers). Use a monospace font so each dot morphs smoothly into its letter when shown.
6. **Sprinkle sound effects.** Small, soft sounds for key moments (strength milestone, success, error). Every sound must match something visible on screen. Off if the user prefers reduced motion, with a mute toggle, low volume, and never on page load.
7. **Privacy glass and a character that looks away.** A frosted "privacy glass" texture over the password field when hidden. A small friendly character (original, not copied from any brand) that looks away when the user shows their password.
8. **Apply these 8 design ideas:**
   - **Reward early, punish late:** show progress the second the user types; show errors only when they are done.
   - **Inline validation:** check as they type, so a common password like `Password1!` is caught immediately.
   - **Chunking:** suggested passwords come in small groups so they are easy to read.
   - **Closure:** the outline closes into one full shape when the password is strong.
   - **Continuity:** monospace characters so each dot morphs into its letter.
   - **Redundancy gain:** every sound matches something on screen.
   - **Materiality:** privacy glass over the field, because a texture should have a reason.
   - **Anthropomorphism:** the little character looks away when the password is shown.

---

## K. CODE QUALITY AND STRUCTURE (do this first, in Phase 1)

1. Organise the project into a clean folder structure (features/modules, shared, config, tests).
2. Separate business logic from UI components (logic in services/hooks/utilities, components only display).
3. Remove duplicate code and dead code.
4. Use one consistent naming convention (files, functions, components, variables, database fields).
5. Add proper error handling everywhere (no empty `catch`, no unhandled promise rejections, user-friendly messages, details to logs).
6. Separate environment config from code (`.env`, typed config loader, validated at startup, fail fast if something is missing).
7. Make reusable components modular (buttons, inputs, dialogs, tables, toasts).
8. Add proper state management (clear split between server state, global state and local state).
9. Document the codebase: a README (setup, scripts, architecture), comments for non-obvious logic, and an `ARCHITECTURE.md`.
10. Set up a scalable AI structure: one place for prompts, one wrapper for the model API, model/provider chosen by config, retries, timeouts, cost and rate limits, logging without personal data, and tests with fake responses. (If the project has no AI feature, build only the clean structure and mark the rest NOT APPLICABLE.)

---

## L. UI STATES CATALOG (every screen must handle the ones that apply)

**Loading and progress**
- Initial state (first time the screen opens)
- Loading state (skeleton or spinner)
- Progress state (for example upload 60%)
- Skeleton state (grey boxes where content will be)
- Pull to refresh
- Infinite-scroll loading

**Empty states**
- Empty state (for example 0 projects: explain and give a next action)
- First use / onboarding (what to show a new user)
- No search results (suggest changing the search)
- No internet / offline
- No notifications ("all clear")

**Error and warning**
- Error state (something went wrong, try again)
- Form validation error (wrong password, empty field)
- 404 not found
- Server error / 500
- Timeout state (request too slow)
- Warning state (alert before deleting)

**Success and confirmation**
- Success state (done, tick mark)
- Confirmation state ("Are you sure you want to delete?")
- Toast / snackbar (small "Saved" message)
- Undo state (undo after delete)

**Permission and access**
- Permission request (camera, location, notifications)
- Permission denied (user said no, explain how to change it)
- Login required (cannot view without login)
- Logged-out state
- Account suspended / blocked
- Paywall / upgrade (free limit reached)

**Interaction and input**
- Hover state
- Active / pressed state
- Focused state (visible focus ring)
- Disabled state (and say why it is disabled)
- Selected state
- Editing state
- Read-only state

**Data and system**
- Partial data (some data loaded, some failed)
- Stale data (old data shown, offer refresh)
- Syncing state
- Rate-limit state ("too many tries, wait a bit", with a countdown)

In `COVERAGE.md`, make a table: screen → states handled.

---

## M. 20 DESIGN LAWS (apply and note where each one is used)

1. Aesthetic-usability effect
2. Law of proximity
3. Von Restorff effect (the different item gets remembered: use for the main call to action)
4. Zeigarnik effect (unfinished tasks stay in mind: progress bars, checklists)
5. Tesler's law (complexity cannot be removed, only moved: take it off the user)
6. Law of Prägnanz (simple shapes are easier to understand)
7. Serial position effect (first and last items are remembered best)
8. Progressive disclosure
9. Law of common region
10. **Fitts's law** (big, near targets are easier to hit; good touch-target sizes). *My list had no number 10, so this was added. Replace it if you want a different law.*
11. Law of similarity
12. Recognition over recall
13. Pareto principle (80/20: make the few most-used actions easiest)
14. Occam's razor (simplest solution wins)
15. Parkinson's law (tasks fill the time: keep flows short, set sensible limits)
16. Uniform connectedness
17. Paradox of the active user (people do not read manuals: make things obvious)
18. Cognitive load
19. Default effect (choose safe, good defaults)
20. **Hick's law** (more choices means slower decisions: limit options). *My list had no number 20, so this was added. Replace it if you want a different law.*

---

## N. FINAL VERIFICATION AND REPORT (Phase 6)

Do not say "done" until you have run all of these and shown me the results:

1. Build, lint, type-check and the full test suite pass.
2. Security: dependency audit, secret scan (current files and full git history), static scan (for example Semgrep), and the attack tests from Section A and C.
3. Performance: Lighthouse before/after scores, and the load test results from B26.
4. Accessibility: axe or Lighthouse accessibility result, plus a manual keyboard-only walk-through of signup, login and the main flow.
5. Re-open `COVERAGE.md` and check that EVERY ID in Sections A to M has a status. List any `NEEDS MY DECISION` items at the top.
6. Final report (short, plain English, bullet points):
   - What you changed, grouped by section.
   - What you could not do and why.
   - **My manual to-do list** (examples: rotate leaked keys, turn on MFA for hosting/GitHub/payment accounts, set up host-level backups, get a lawyer to review the legal pages, fill in `[PLACEHOLDER]` business details, confirm which countries my users are in).
   - Known risks that remain.

Begin with step 1 of Section 0 now. Do not start changing code until `COVERAGE.md` exists.
