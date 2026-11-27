# Design notes

design.md is the design source (measured from nixtio.com). It is used as it is and is not edited.
This file lists problems found in it for EyesClose, and how web/src/index.css handles each one.

1. **Body text is tight and heavy.** design.md body is 22px, weight 600, tracking -0.88px.
   That is display styling. For long reading, and for people who are not fluent in English, it is hard to read.
   We use normal tracking, weight 400, line height 1.6 for body text. Negative tracking is used only on headings.
2. **Printed letters.** Letters use normal tracking and plain black on white, A4, 20mm margins.
3. **Small sizes.** Small text is 12px and buttons are 13.3px. On cheap phones that is too small.
   We plan a 16px minimum for body and buttons, and 14px for small print.
4. **Lively motion.** The reference uses a marquee, slide-up page transitions and durations up to 0.8s.
   EyesClose is for people in grief. We use only short fades (150ms to 300ms), no marquee, no page slides,
   and everything turns off under prefers-reduced-motion.
5. **Green fails contrast as text.** #40a53c on white is about 3.1:1, below the 4.5:1 needed for body text.
   Use it only for icons or fills, never for words.
6. **No status colours.** There is no error or warning colour, and no focus style. We added a visible
   focus outline. Error and warning colours need to be chosen later (and must pass contrast).
   **Chosen 2026-11-27 (chunk 1):** error text `#b3261e` (9.5:1 on the page background) on `#fbeceb`;
   calm notes use `#fbf3e2` with `#7a4b00` for icons and labels (6.7:1). Cards use `#fbfbfa`, not pure white.
   Checked with axe in a real browser at 360px (colour contrast on): no violations.
7. **Desktop-only capture.** It was measured at 1536px wide. Sizes like 190px section padding and the
   52px section heading need smaller mobile values.
8. **Stark black and white.** The palette is pure black, white and grey. It works, but may feel cold for
   grieving users. A softer neutral could be considered. This is a product decision, not changed here.
