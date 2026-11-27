# EyesClose: backlog

This is a backlog, not an order of work. Chunks and their order are decided by the project owner.

## MVP features

- [x] **Smart form.** About 10 questions. Answers held in memory only. Answers decide which letters and
      checklist items appear.
- [ ] **Letter generator.** Content-driven letters as A4 PDFs made in the browser. Official steps and links
      (not letters) for EPFO, insurance and UPI apps that need forms or support emails.
      The name of the person who died is optional in the form for now. It becomes required where a letter is
      generated (same English-letters rule, checked again before the PDF is made).
      Chunk 2 built the engine and two letters: a covering letter for any bank, and a request letter for Vi.
      Chunk 4 added a general letter for places with no official process page (networks other than Vi,
      payment apps, insurers, cards and loans). It only tells them about the death and asks what they need.
      A "Your letters" section at the top of the checklist lists every letter that applies.
      Not given a letter: EPFO, pension and subscriptions, which have their own official forms or processes,
      and online accounts (Google, Facebook, others) and crypto.
      More than one bank: each bank item on the checklist has its own "Make this letter" button, so the user
      makes one letter per bank, each with that bank's name filled in. The names and date typed once are kept
      for the next letter. "Another bank" gives one letter with a blank line for the bank name, to print once
      per bank. To decide later: a single "make all bank letters" button, or one PDF with all of them.
- [x] **Priority checklist.** Days 1 to 7, weeks 2 to 4, later. Who to contact for each step.
- [ ] **Share the checklist.** One tap to WhatsApp, with no personal details in the message.

## Supporting work

- [x] Content schema check in CI (source, lastChecked, verifiedBy required).
- [x] "Not yet checked by a professional" label for unverified items.
- [ ] Waitlist button ("I want the full pack"): email and consent only, Resend confirmation, deletion on request.
- [ ] Feedback form with consent.
- [ ] First-party event counter (event names only).
- [ ] Network test that proves form data is never sent (see docs/test.md).
- [ ] Offline support (service worker).
- [ ] Privacy notice page.

## Guidance pages

- [ ] Death certificate not made yet.
- [ ] Phone is locked and OTPs cannot be received.
- [ ] Joint account, a different nominee, and a will that says something else.
- [ ] Two siblings both claiming.
- [ ] Aadhaar or PAN cannot be found.
- [ ] Help for people not fluent in English, with a glossary.
- [ ] Village with poor internet and no printer.
- [ ] Crypto and other online money.

## Pending tool setup

These tools are installed (or chosen) but their setup waits until the app has real screens or code.

- [x] **impeccable design hook.** Turned on in chunk 1. `/impeccable init` (PRODUCT.md) not run yet; run it once
      real screens exist.
- [ ] **emil-design-eng, review-animations, animation-performance.** Active. Use when building and reviewing
      screens. Keep motion calm (see docs/design-notes.md).
- [ ] **Turned off on 2026-11-27 to save context. Turn back on as below:**
  - `design-taste-frontend`, `unslop`, `hallmark`: when the first real screen (the form or the checklist page)
    is being designed, and for its design review.
  - `design-taste-frontend` was turned on for chunk 1 and turned off again on 2026-11-27 in the chunk 1 review.
    It targets marketing sites, not app screens, and was not used.
  - `transitions-dev`: when a chunk adds motion or transitions to a screen.
  - `mattpocock-skills`: when the form state and letter-building logic (real TypeScript code) is written.
  - How: `claude plugin enable mattpocock-skills@claude-plugins-official --scope local`,
    `claude plugin enable unslop@heydamir --scope local`,
    `mv .claude/skills-disabled/<name> .claude/skills/` for design-taste-frontend and transitions-dev, and
    `mv ~/.claude/skills-disabled/hallmark ~/.claude/skills/` for hallmark.
- [ ] **agent-browser.** Use for the end-to-end network test and for checking screens on a small viewport.
- **gstack (design-review, cso): decided not to install** (2026-11-27). It installs about 60 skills, needs Bun,
  checks for updates on every session start, and has a telemetry sync component.
- **caveman CLI: decided to stay skipped** (2026-11-27). Only the caveman Claude Code plugin is used.
- [ ] **Sentry.** The official plugin (`sentry@claude-plugins-official`) exists. Not installed yet. Set it up
      only when an error monitoring chunk comes, with no capture of form values, inputs or session replays.
- [ ] **Security reviews.** Run the built-in `/security-review` and the `security-audit` skill on every PR that
      touches the server, CSP or the form. Trail of Bits `insecure-defaults` and `supply-chain-risk-auditor`
      for config and dependency changes.
