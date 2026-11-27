# EyesClose: product requirements

Version 2. Last updated 2026-11-27.

## Tagline

"When someone is gone, make everything easier for the people they leave behind." (Working tagline. It may change.)

## The problem

When someone dies in India, their family spends about six months closing SIM cards, UPI, bank accounts,
WhatsApp, EPFO, pension and subscriptions. Every place has its own rules. Each one wants its own letter and a
copy of the death certificate. Most people do not know what to close, or where to start.

## Who it is for

A son, daughter, wife or husband, aged 25 to 50, who is handling everything. They usually come to us in the
first 1 to 7 days after the death, when they are tired and sad and cannot think clearly. They may live anywhere
in India. Many are not fluent in English.

## What it is

A shutdown kit, not a will app. The user answers about 10 questions. They get a personal checklist and
ready letters.

## The main promise: we hold no personal data

- The form runs in the browser. Answers and PDFs stay on the user's device. They are never sent to our server
  and never stored in our database.
- We do not ask for Aadhaar or PAN numbers, and we do not need account numbers. Letters leave blank lines for
  details the user writes by hand after printing. Letters say which photocopies to attach.
- No user accounts. No login.
- Nothing is saved on the device by default. If "save on this device" is added later, it is opt-in and has a
  clear "delete everything" button.
- We never receive the death certificate. Banks and telecom companies check the certificate themselves.

## MVP: only these four things

1. **Smart form.** About 10 questions: relation to the person who died, which banks, SIM company, UPI apps,
   EPFO or pension, insurance, and which subscriptions they had. The answers decide which letters and
   checklist items appear.
2. **Letter generator.** Letters for banks, telecom companies (Jio, Airtel, Vi, BSNL) and other places that
   accept a letter. English, printable PDF, made in the browser. Some places (EPFO, insurance, some UPI apps)
   use official forms or support emails, not letters. For those we give the exact official steps and link,
   not a made-up letter.
3. **Priority checklist.** What to do in days 1 to 7, weeks 2 to 4, and later, with who to contact.
   SIM, UPI and bank come first. Netflix, Amazon and the like come later.
4. **Share the checklist.** Send the checklist (with no personal details in it) to the family WhatsApp group
   in one tap.

### Not in the MVP

Document vault, user accounts, any server-side storage of personal data, direct bank connections,
automatic account closure (we only make letters and guidance), payment gateway.

## Guidance pages for hard cases

These are content pages, not features. Each one says it is general information, not legal advice.

1. The death certificate is not made yet. What can start now, and what must wait.
2. The phone of the person who died is locked, so OTPs cannot be received. What to do, and what not to try.
3. A joint account, a different nominee, and a will that says something else. How the usual process works.
   It depends on the case. Suggest a lawyer. No legal conclusions.
4. Two siblings both claiming. The usual route (legal heir or succession documents) and when to get help.
5. Aadhaar or PAN cannot be found. What other documents people use.
6. Users who are not fluent in English. Plain words, short sentences, and a short glossary (for example
   "nominee" and "legal heir"). Still English only.
7. A death in a village with poor internet and no printer. The app works offline after the first visit, stays
   light, and the PDFs print easily at a local print shop.
8. Crypto or other online money. Do not log in to their accounts. List what to look for. See a professional.
   No advice on tax or ownership.

## Language

English only, everywhere. Plain, simple words and short sentences. See rules.md.

## Name fields accept Latin letters only

Letters are made with pdf-lib and its built-in Helvetica font, which cannot draw Devanagari or other scripts.
So any name field (for example the name of the person who died, or the user's own name) accepts only:

- the letters A to Z and a to z,
- spaces, full stops (.), hyphens (-) and apostrophes (').

The check runs as the user types and again before the PDF is made. When something else is typed, the field
shows this message, calmly, under the field (not in red capitals, and the typed text is kept so they can fix it):

> Please type the name using English letters (A to Z) only. For example: Sunita Sharma.

Other free-text fields that go into a letter follow the same rule, with digits also allowed where they make
sense (for example a date). The user can always leave a field blank and write the detail by hand after printing.

## Money

- Free: the checklist and 2 letters.
- Full pack, Rs. 499: all letters and priority support.
- Later: commission from CA and lawyer referrals.
- For now we do not build payments. A paywall in the browser is easy to get around. We show the free product
  and an "I want the full pack" waitlist button that collects only an email, with consent.

## How we measure success

Success means people use it, and a meaningful number say they would pay. "10 out of 100 pay" is not the pass
mark; that is a very high conversion rate. We watch: checklist downloads, letters generated, waitlist sign-ups,
and feedback.

## Risks and how we design for them

- **Legal accuracy.** Every letter and checklist step records its official source, the date it was last
  checked, and who verified it. Nothing is shown as verified until a CA or lawyer has filled that in.
- **Tone.** The user is grieving. Gentle, plain wording. No urgency tricks. No upsell on the first screens.
  One short line of condolence, not repeated.
- **Trust.** "Nothing leaves your phone" must be true and checkable: strict Content-Security-Policy, no
  third-party scripts that can see form data, no session recording, no analytics that can see answers.
  We say this on screen in plain words.
- **Privacy of what we do collect.** Waitlist emails and feedback are personal data. Collected only with
  consent, stored minimally, and deletable on request.

## Open questions and decisions

Items marked "Decided" were settled by the project owner. The others are still open, with a recommendation.

1. **Which institutions get a free-form letter, and which need an official form or support email?**
   Recommendation: start from this draft list and confirm each one against its official page before writing
   content. Draft as of 2026-11-27, nothing here is verified yet:
   - Banks: a letter is usually accepted, plus the bank's own claim form for the money. Source: each bank's
     "deceased claim" page. To be checked per bank.
   - Telecom (Jio, Airtel, Vi, BSNL): a letter or a store visit to close or transfer a SIM. Source: each
     operator's help pages. To be checked.
   - EPFO: prescribed forms, not a letter. Form 20 (PF), Form 5(IF) (EDLI insurance), Form 10D (pension),
     or the composite death claim form that EPFO introduced to replace them. Sources found 2026-11-27, to be
     re-checked for the form currently required:
     https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/Form5IF_Instructions_Eng.pdf and
     https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/Manual_SOP_ClaimSettlement.pdf
   - Life insurance: the insurer's own death claim form. Source: each insurer. To be checked.
   - UPI apps: in-app support or support email, per app. To be checked.
   - Subscriptions (Netflix, Amazon and so on): usually online cancellation or a support email.
2. **Who reviews content for legal accuracy, and how do we show "not yet verified"?**
   Recommendation: one CA or lawyer reviews every item before launch. Until `verifiedBy` is filled, each item
   shows a small, calm label: "Not yet checked by a professional." Reason: honest, and easy to remove per item.
3. **Should answers ever be saved on the device?** **Decided 2026-11-27: no save-on-device by default.**
   Answers live in memory only. An opt-in "save on this device" with a "delete everything" button may come
   later, as its own decision. Reason: family phones are often shared; this is the safest default.
4. **Which PDF library?** Recommendation: pdf-lib, loaded only when the user taps "Download", using the
   built-in Helvetica font so no font file is downloaded. Fallback: a print stylesheet and the phone's own
   "Print / Save as PDF". Reason: no server needed, small, and plain text letters do not need a layout engine.
   Test on a real low-end Android phone and on A4 paper before deciding for good.
5. **What analytics is safe?** **Decided 2026-11-27: a first-party counter with an allow-list of event names,
   and no IPs.** No third-party analytics script. The endpoint accepts only event names from a fixed list in
   the code (for example `checklist_downloaded`, `letter_generated`, `waitlist_joined`) and rejects anything
   else. It stores no IP address, no user id, no cookie and no answers. Reason: keeps the CSP strict and the
   promise checkable.
6. **Does waitlist and feedback data need DPDP Act 2023 consent and deletion flows from day one?**
   **Decided 2026-11-27: yes, from day one.** A clear consent checkbox (not pre-ticked), a short privacy
   notice, a way to ask for deletion, and as few fields as possible. Ask the lawyer to confirm the wording.
7. **Is a backend needed for the MVP, and which database and region?** **Decided 2026-11-27: Supabase in
   Mumbai (ap-south-1), with Row Level Security on, and insert-only for the waitlist.** A very small backend
   (Vercel serverless functions in Node and TypeScript) handles only the waitlist, feedback and counters.
   RLS is enabled on every table. The public role may only insert into the waitlist; it cannot read, update
   or delete rows. Reading and deleting (for deletion requests) happen only with the server-side key, never
   from the browser. Docker Postgres for local work. (Neon had no India region on 2026-11-27.)
8. **Should the app work fully offline after the first visit (PWA)?** **Decided 2026-11-27: yes.** A service
   worker caches the app, the content and the PDF library. The waitlist and feedback forms say
   "You are offline. Please try again later."
