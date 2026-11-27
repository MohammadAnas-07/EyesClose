# PR review checklist

Short on purpose. Tick what applies.

## Basics

- [ ] Branch is not main. Commits are small and say what and why.
- [ ] `npm run check` passes locally and CI is green.
- [ ] New code has tests.

## Privacy

- [ ] No form answer, letter text or case detail is sent over the network, logged, or stored.
- [ ] No new third-party script, font, image or API origin. If the CSP changed, the PR says why.
- [ ] Nothing new is saved in localStorage, sessionStorage, IndexedDB or cookies.
- [ ] No request for Aadhaar, PAN or account numbers.
- [ ] Waitlist or feedback changes keep consent, minimal fields and deletion.
- [ ] No secrets in code or commits.

## Content accuracy

- [ ] Every new or changed letter or checklist item has `source`, `lastChecked` and `version` (raised).
- [ ] `verifiedBy` is only filled by a real reviewer. Unverified items show the "Not yet checked" label.
- [ ] Places that need an official form get the official steps and link, not a made-up letter.
- [ ] Guidance pages say "general information, not legal advice". No legal conclusions, no tax advice.

## Tone of user-facing text

- [ ] English only. Plain words, short sentences, no jargon.
- [ ] Gentle and calm. No urgency tricks, no upsell on the first screens.
- [ ] Condolence appears once, not on every screen.

## Light and accessible

- [ ] Works on a small, cheap Android screen. No big new dependency in the first load.
- [ ] Motion is calm and turns off under prefers-reduced-motion.
- [ ] Text contrast passes, body text at least 16px, no negative tracking on body text.
