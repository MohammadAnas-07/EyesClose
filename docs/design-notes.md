# Design notes

design.md is the design source (measured from ankestern.com). It is used as it is and is not edited.
The tokens live in one place, the `@theme` block in `web/src/index.css`, named after their role.
This file lists where EyesClose departs from design.md, and why.

## Tokens

| Token | Value | design.md source |
| --- | --- | --- |
| `paper` | #ecebe7 | `--bg`, page background |
| `surface` | #f8f8f8 | `--box`, cards, inputs, text on dark |
| `ink` | #1d1d1b | `--black`, text and filled buttons |
| `ink-soft` | #4a4944 | `--mud`, secondary text |
| `paper-dark` | #4a4944 | `--mud`, footer |
| `ink-on-dark-soft` | #f8f8f8 at 80% | secondary text on the footer |
| `line-dark` | #f8f8f8 at 28% | border on dark |
| `accent` | #ff8500 | `--orange` |
| `accent-ink` | #9a4a00 | orange for text on light (see 1) |
| `line`, `line-strong`, `line-control` | #1d1d1b at 8%, 18%, 55% | added (see 4) |
| `tint`, `selected` | #1d1d1b at 5%, 8% | added: hover and chosen states |
| `error`, `error-tint`, `note`, `note-ink`, `note-line` | see index.css | added: design.md has no status colours |

Type: `text-display` (hero, up to 72px, weight 300), `text-section` (section headings, up to 60px, weight 300),
`text-title` (page and screen headings, up to 40px, weight 300), `text-heading` (question headings, up to 32px,
weight 400). Other headings are weight 500 (design.md subheading). Tracking on headings is -0.01em.
Radii: `card` and `control` are 0 (square corners); round marks use 50%. No shadows.
Motion: 200ms and 300ms with `cubic-bezier(0.16, 1, 0.3, 1)`.

## Deviations

1. **Orange fails contrast as text on light.** #ff8500 on #ecebe7 is 2.1:1. Orange is used only for fills and
   marks: list ticks, the done box in the hero preview, the open FAQ icon, the left rule of the quick facts,
   the footer button hover and text selection. Ink on orange is 6.9:1. For orange text on light, `accent-ink`
   #9a4a00 (5.3:1 on paper) is the closest passing colour.
2. **Zoom Pro is not used.** design.md names Zoom Pro Wide, Normal and Compact. They are paid fonts with no
   licence for self-hosting here. We use Host Grotesk, the next font in design.md's own stack, under the SIL Open
   Font License, self-hosted (see docs/tech-stack.md). It has no ₹ sign; the browser draws it with a system font.
3. **Body text is 16px to 20px at weight 400.** design.md body is 28px at weight 300. That is display styling.
   For long reading on small phones, and for people who are not fluent in English, it is too large and too thin.
   Buttons are 16px to 18px at weight 500 (design.md: 20px).
4. **Borders on controls.** design.md cards and buttons have no border. Inputs, checkboxes and radio buttons
   need a visible edge (WCAG 1.4.11), so they use `line-control` (3:1 or more on paper and surface). Cards keep
   a light `line-strong` border so they read as groups on a plain background.
5. **Heading sizes are capped.** design.md's heading is 104px. The hero heading is a full sentence, so it stops
   at 72px. All heading sizes shrink on phones with `clamp()`.
6. **Calm motion.** design.md also uses 0.7s and 1.1s reveals and a marquee. EyesClose is for people in grief:
   only short fades and colour changes (200ms to 300ms), no marquee, no page slides, and everything turns off
   under prefers-reduced-motion.
7. **Status colours added.** design.md has no error or warning colour. Error text #b3261e is 5.5:1 on paper;
   calm notes use #fbf3e2 with #7a4b00 (6.7:1).
8. **Printed letters** keep their own plain style: black on white, normal tracking, A4, 20mm margins.
9. **The browser theme colour** in each page's `<meta name="theme-color">` is #ecebe7 written out, because a
   meta tag cannot read a CSS token.

## Spacing scale

One scale on every page (`.gutter` and `.section` in `web/src/pages.css`):

- Side gutter: 20px on phones, 32px from 640px, 40px from 1024px (design.md `--pad`).
- Section padding: 64px top and bottom on phones, 96px from 1024px (design.md uses 96px at the top).
- The gap between a section's heading block and its content is 32px, 40px from 1024px. Inside a heading
  block, the heading and its intro are 12px apart (`.section-intro`).
- Content sits in a 1200px container. The header and footer use the same gutter, so their edges line up.
- Home sections alternate between `paper` and `surface`. The footer is `paper-dark`: 64px top and 40px bottom
  on phones, 96px and 64px from 1024px.

## Checked

axe in a real browser at 360px and 1440px, colour contrast on: no violations on /, /start, a question, the
checklist, /help, a help page, /data and the 404 page, with an FAQ row open and the footer in view.
