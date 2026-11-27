# EyesClose: backlog

This is a backlog, not an order of work. Chunks and their order are decided by the project owner.

## MVP features

- [ ] **Smart form.** About 10 questions. Answers held in memory only. Answers decide which letters and
      checklist items appear.
- [ ] **Letter generator.** Content-driven letters as A4 PDFs made in the browser. Official steps and links
      (not letters) for EPFO, insurance and UPI apps that need forms or support emails.
- [ ] **Priority checklist.** Days 1 to 7, weeks 2 to 4, later. Who to contact for each step.
- [ ] **Share the checklist.** One tap to WhatsApp, with no personal details in the message.

## Supporting work

- [ ] Content schema check in CI (source, lastChecked, verifiedBy required).
- [ ] "Not yet checked by a professional" label for unverified items.
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

- [ ] **impeccable design hook.** Installed without its edit hook. Turn it on and run `/impeccable init` once
      real screens exist.
- [ ] **design-taste-frontend, transitions-dev, emil-design-eng, review-animations, animation-performance,
      unslop, hallmark.** Use when building and reviewing screens. Keep motion calm (see docs/design-notes.md).
- [ ] **agent-browser.** Use for the end-to-end network test and for checking screens on a small viewport.
- [ ] **gstack (design-review, cso).** Not installed. It installs about 60 skills, needs Bun, checks for updates
      on every session start, and has a telemetry sync component. Decide whether to install it when screens
      exist. If yes: install Bun from bun.sh, then follow the gstack README, and turn telemetry off.
- [ ] **Sentry.** The official plugin (`sentry@claude-plugins-official`) exists. Not installed yet. Set it up
      only when an error monitoring chunk comes, with no capture of form values, inputs or session replays.
- [ ] **Security reviews.** Run the built-in `/security-review` and the `security-audit` skill on every PR that
      touches the server, CSP or the form. Trail of Bits `insecure-defaults` and `supply-chain-risk-auditor`
      for config and dependency changes.
