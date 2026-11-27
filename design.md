# Design reference

Source: https://nixtio.com/
Page: Premium Digital Agency for Startups, SaaS & Brands — Nixtio

Measured from 335 rendered elements at 1536 x 730px. This is a sample of the current document and state, not the original design source.

## Color palette

Only observed CSS colors are listed. Usage labels describe where a color was found. Hex is an sRGB preview; retain the original CSS value for its color space and transparency.

Usage | Original CSS value | sRGB hex | Observed root properties | Occurrences
--- | --- | --- | --- | ---
Text | rgb(255, 255, 255) | #FFFFFF | --color-white, --color-secondary | 31
Text | rgba(10, 10, 10, 0.6) | #0A0A0A99 | --color-text-secondary | 24
Text | rgb(10, 10, 10) | #0A0A0A | --color-text, --color-background-secondary | 20
Text | rgb(0, 0, 0) | #000000 | --color-primary, --color-black | 17
Text | rgba(255, 255, 255, 0.6) | #FFFFFF99 | --color-white-transparent, --color-text-tertiary | 3
Surface | rgb(255, 255, 255) | #FFFFFF | --color-white, --color-secondary | 14
Surface | rgb(0, 0, 0) | #000000 | --color-primary, --color-black | 5
Surface | rgb(245, 245, 245) | #F5F5F5 | --color-background | 2
Surface | rgb(10, 10, 10) | #0A0A0A | --color-text, --color-background-secondary | 2
Surface | rgba(255, 255, 255, 0.08) | #FFFFFF14 |  | 1
Border | rgb(255, 255, 255) | #FFFFFF | --color-white, --color-secondary | 7
Border | rgb(49, 49, 49) | #313131 |  | 4
Border | rgba(10, 10, 10, 0.05) | #0A0A0A0D |  | 1
Icon | rgb(10, 10, 10) | #0A0A0A | --color-text, --color-background-secondary | 21
Icon | rgb(0, 0, 0) | #000000 | --color-primary, --color-black | 8
Icon | rgb(255, 255, 255) | #FFFFFF | --color-white, --color-secondary | 7
Icon | rgb(251, 152, 38) | #FB9826 |  | 5
Icon | rgb(224, 224, 224) | #E0E0E0 |  | 5
Icon | rgb(247, 147, 30) | #F7931E |  | 5
Icon | rgb(255, 255, 254) | #FFFFFE |  | 1
Icon | rgb(78, 165, 47) | #4EA52F |  | 1
Icon | rgb(237, 246, 234) | #EDF6EA |  | 1
Icon | rgb(0, 126, 187) | #007EBB |  | 1
Icon | rgb(230, 36, 21) | #E62415 |  | 1

## Typography

Role | Family | Size | Weight | Line height | Tracking | Text transform
--- | --- | --- | --- | --- | --- | ---
Heading | Inter, "Inter Fallback" | 22px | 500 | 26.4px | -0.88px | none
Section heading | Inter, "Inter Fallback" | 52px | 600 | 57.2px | -2.6px | none
Subheading | Inter, "Inter Fallback" | 18px | 600 | 18px | -0.8992px | none
Body | Inter, "Inter Fallback" | 22px | 600 | 26.4px | -0.88px | none
Small text | Inter, "Inter Fallback" | 12px | 500 | 15.6px | -0.48px | none
Button | Inter, "Inter Fallback" | 13.3333px | 600 | normal | -0.36px | none

## Spacing

Value | Occurrences
--- | ---
4px | 1
6.08px | 4
12px | 6
15.04px | 1
18px | 4
20px | 2
24px | 1
30.08px | 18
32px | 2
36px | 1
40px | 1
173px | 1
190px | 3
381.875px | 2

## Layout gaps

Value | Occurrences
--- | ---
1.92px | 6
4px | 4
8px | 24
9.92px | 6
12px | 6
16px | 8
20px | 6
40px | 2

## Corner radii

Value | Occurrences
--- | ---
18px | 40
25px | 16
30px | 4
50% | 48
100px | 28

## Shadows

Value | Occurrences
--- | ---
rgba(255, 255, 255, 0.5) 0px 0px 2px 0px inset | 4
rgba(0, 0, 0, 0.15) 0px 0px 1px 0px inset | 2

## Motion durations

Value | Occurrences
--- | ---
0.3s | 30
0.15s | 14
0.2s | 14
0.6s | 6
0.4s | 4
0.8s | 2

## Motion easing

Value | Occurrences
--- | ---
ease-in-out | 25
ease | 22
cubic-bezier(0.4, 0, 0.2, 1) | 19
ease-in | 4

### Accessible keyframe names

- all-inclusive-section-module-scss-module__7X_6Ca__marquee
- cookieBanner-module-scss-module__ZFUAZW__slideIn
- cookieBanner-module-scss-module__ZFUAZW__slideOut
- cookieModal-module-scss-module__9NiS5a__fadeIn
- cookieModal-module-scss-module__9NiS5a__slideUp
- pageTransition-module-scss-module__1RvWxG__slide-up
- splide-loading
- contact-section-module-scss-module__2UzQtG__tooltipFadeUp

## Component recipes

Computed styles for the captured state. Selectors identify sampled elements; text and placeholders come from the page. Form values are excluded. These style specimens do not reconstruct child markup or uncaptured interaction states.

### Button 1

Observed text or placeholder: Start a Project Start a Project

```css
a.button-module-scss-module__Z2k9va__button.button-module-scss-module__Z2k9va__primary {
  align-items: center;
  backdrop-filter: none;
  background-color: rgb(0, 0, 0);
  background-image: none;
  border-bottom-color: rgb(255, 255, 255);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgb(255, 255, 255);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 100px;
  border-right-color: rgb(255, 255, 255);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(255, 255, 255);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 2px 0px inset;
  color: rgb(255, 255, 255);
  display: flex;
  font-family: Inter, "Inter Fallback";
  font-size: 14px;
  font-weight: 600;
  gap: 8px;
  justify-content: center;
  letter-spacing: -0.32px;
  line-height: 16px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(245, 245, 245) | none | 1

### Button 2

Observed text or placeholder: See All Projects See All Projects

```css
a.button-module-scss-module__Z2k9va__button.button-module-scss-module__Z2k9va__primary {
  align-items: center;
  backdrop-filter: none;
  background-color: rgb(0, 0, 0);
  background-image: none;
  border-bottom-color: rgb(255, 255, 255);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgb(255, 255, 255);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 100px;
  border-right-color: rgb(255, 255, 255);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(255, 255, 255);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 2px 0px inset;
  color: rgb(255, 255, 255);
  display: flex;
  font-family: Inter, "Inter Fallback";
  font-size: 12px;
  font-weight: 600;
  gap: 9.92px;
  justify-content: space-between;
  letter-spacing: -0.24px;
  line-height: 12px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(245, 245, 245) | none | 1

### Button 3

Observed text or placeholder: Get started Get started

```css
a.button-module-scss-module__Z2k9va__button.button-module-scss-module__Z2k9va__secondary {
  align-items: center;
  backdrop-filter: none;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-bottom-color: rgb(0, 0, 0);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgb(0, 0, 0);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 100px;
  border-right-color: rgb(0, 0, 0);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(0, 0, 0);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 1px 0px inset;
  color: rgb(0, 0, 0);
  display: flex;
  font-family: Inter, "Inter Fallback";
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
  justify-content: center;
  letter-spacing: -0.36px;
  line-height: 18px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 30.08px;
  padding-right: 30.08px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(245, 245, 245) | none | 1
2 | rgb(10, 10, 10) | none | 1

### Card 1

Observed text or placeholder: We've delivered 600+ projects that helped companies streamline operations, boost engagement, and grow revenue 25+ Clutch

```css
div.testimonials-section-module-scss-module__kVJRzG__cards {
  align-items: normal;
  backdrop-filter: none;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-bottom-color: rgba(10, 10, 10, 0.6);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgba(10, 10, 10, 0.6);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 0px;
  border-right-color: rgba(10, 10, 10, 0.6);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgba(10, 10, 10, 0.6);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgba(10, 10, 10, 0.6);
  display: grid;
  font-family: Inter, "Inter Fallback";
  font-size: 16px;
  font-weight: 500;
  gap: 4px;
  justify-content: normal;
  letter-spacing: -0.64px;
  line-height: 22.4px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(245, 245, 245) | none | 1

### Card 2

Observed text or placeholder: We've delivered 600+ projects that helped companies streamline operations, boost engagement, and grow revenue 25+ Clutch

```css
div.clutch-module-scss-module__SK1fAW__card.aos-init {
  align-items: flow-start;
  backdrop-filter: none;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-bottom-color: rgba(10, 10, 10, 0.6);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgba(10, 10, 10, 0.6);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 25px;
  border-right-color: rgba(10, 10, 10, 0.6);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgba(10, 10, 10, 0.6);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgba(10, 10, 10, 0.6);
  display: flex;
  font-family: Inter, "Inter Fallback";
  font-size: 16px;
  font-weight: 500;
  gap: 16px;
  justify-content: space-between;
  letter-spacing: -0.64px;
  line-height: 22.4px;
  opacity: 1;
  padding-bottom: 30.08px;
  padding-left: 30.08px;
  padding-right: 30.08px;
  padding-top: 30.08px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(245, 245, 245) | none | 1

### Card 3

Observed text or placeholder: Torstein Gustavsen CEO at Tixio.io I like working with Bogdan. Always delivers on time, and they come up with great solu

```css
div.testimonial-card-module-scss-module__D6tVeW__card {
  align-items: flow-start;
  backdrop-filter: none;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-bottom-color: rgba(10, 10, 10, 0.6);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgba(10, 10, 10, 0.6);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 25px;
  border-right-color: rgba(10, 10, 10, 0.6);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgba(10, 10, 10, 0.6);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgba(10, 10, 10, 0.6);
  display: flex;
  font-family: Inter, "Inter Fallback";
  font-size: 16px;
  font-weight: 500;
  gap: 20px;
  justify-content: space-between;
  letter-spacing: -0.64px;
  line-height: 22.4px;
  opacity: 1;
  padding-bottom: 30.08px;
  padding-left: 30.08px;
  padding-right: 30.08px;
  padding-top: 30.08px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(245, 245, 245) | none | 1

## Layout measurements

Element | Width | Display | Columns | Gap | Padding (T R B L)
--- | --- | --- | --- | --- | ---
main | 1521px | block | none | normal | 0px 0px 0px 0px
header | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | flex | none | normal | 6.08px 6.08px 6.08px 6.08px
section | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | block | none | normal | 190px 0px 190px 0px
section | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | block | none | normal | 0px 0px 0px 0px

## Responsive conditions

- `(max-width: 1024px)`
- `(max-width: 768px)`
- `(prefers-reduced-motion: reduce)`
- `(min-width: 1500px)`
- `(hover: hover)`
- `(max-width: 480px)`
- `(min-width: 768px)`
- `(max-width: 1024px) or (max-height: 700px)`
- `screen and (hover: hover)`
- `(hover: hover) and (pointer: fine)`
- `screen and (min-width: 768px)`
- `(max-width: 768px) and (max-width: 480px)`
- `screen and (-ms-high-contrast:none)`
- `(max-width: 1200px)`
- `(max-width: 768px), (hover: none)`

## CSS custom properties

Names and values read from the root element; no new token names or ramps were generated.

Property | Value
--- | ---
--color-white | #fff
--padding-xl | 11.875rem
--z-index-tooltip | 1070
--font-size-xl | 1.25rem
--font-size-sm | .875rem
--font-size-base | 1rem
--transition-base | .3s ease-in-out
--font-size-3xl | 2rem
--z-index-dropdown | 1000
--color-text | #0a0a0a
--color-white-transparent | #fff9
--color-background | #f5f5f5
--z-index-modal | 1050
--font-size-lg | 1.125rem
--color-gray-ultra-light | #0a0a0a0a
--color-primary | #000
--font-size-2xl | 1.5rem
--color-black | #000
--font-family | "Inter", "Inter Fallback"
--color-green | #40a53c
--color-gray-border | #ffffff29
--padding-sm | 2.25rem
--transition-fast | .15s ease-in-out
--font-inter | "Inter", "Inter Fallback"
--color-text-secondary | rgba(10,10,10,.6)
--color-text-tertiary | rgba(255,255,255,.6)
--z-index-sticky | 1020
--font-size-xs | .75rem
--color-secondary | #fff
--color-background-secondary | #0a0a0a
--padding-md | 7.5rem
--padding-lg | 10rem
--z-index-fixed | 1030
--transition-slow | .5s ease-in-out
--z-index-popover | 1060
--z-index-modal-backdrop | 1040

## Capture coverage

- 0 stylesheet(s) could not be inspected. Computed styles are still measured.
- Sampling excludes hidden elements and Sitepeel tools. Offscreen rendered elements may be included. Counts refer to the sample, not the entire website.
- Colors are CSS values, not a screenshot pixel palette. Images, compositing and gradients can affect their visible appearance.
- Hover, focus, active states, other viewport sizes, iframe documents and shadow trees need separate captures.
- No inferred brand personality, invented colors, placeholder copy or unobserved code is presented as a page measurement.
- 6 canvas element(s) detected. CSS extraction does not expose canvas drawing, WebGL shaders or JavaScript animation internals.