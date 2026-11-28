# Design reference

Source: https://ankestern.com/
Page: ankestern interior · Interior design Vienna

Measured from 91 rendered elements at 1536 x 730px. This is a sample of the current document and state, not the original design source.

## Color palette

Only observed CSS colors are listed. Usage labels describe where a color was found. Hex is an sRGB preview; retain the original CSS value for its color space and transparency.

Usage | Original CSS value | sRGB hex | Observed root properties | Occurrences
--- | --- | --- | --- | ---
Text | rgb(255, 133, 0) | #FF8500 | --orange | 1
Surface | rgb(74, 73, 68) | #4A4944 | --mud | 3
Surface | rgb(236, 235, 231) | #ECEBE7 | --pp, --hdr-bg, --bg | 2
Border | rgba(248, 248, 248, 0.28) | #F8F8F847 |  | 9
Border | rgb(255, 133, 0) | #FF8500 | --orange | 1
Border | rgb(29, 29, 27) | #1D1D1B | --black | 1
Border | rgb(74, 73, 68) | #4A4944 | --mud | 1
Gradient | rgba(29, 29, 27, 0.45) | #1D1D1B73 |  | 1
Icon | rgb(29, 29, 27) | #1D1D1B | --black | 19

## Typography

Role | Family | Size | Weight | Line height | Tracking | Text transform
--- | --- | --- | --- | --- | --- | ---
Heading | "Zoom Pro Wide", "Host Grotesk", Arial, sans-serif | 104px | 300 | 114.4px | -1.04px | none
Section heading | "Zoom Pro Wide", "Host Grotesk", Arial, sans-serif | 60px | 300 | 66px | normal | none
Subheading | "Zoom Pro Normal", "Host Grotesk", "Helvetica Neue", Arial, sans-serif | 40px | 500 | 42px | -0.4px | none
Body | "Zoom Pro Compact", "Host Grotesk", "Helvetica Neue", Arial, sans-serif | 28px | 300 | 36.4px | normal | none
Button | "Zoom Pro Normal", "Host Grotesk", "Helvetica Neue", Arial, sans-serif | 20px | 500 | 28px | normal | none

## Spacing

Value | Occurrences
--- | ---
4px | 1
7px | 18
12px | 1
16px | 4
24px | 7
28px | 2
32px | 1
40px | 12
66px | 1
80px | 3
96px | 1
120px | 1

## Layout gaps

Value | Occurrences
--- | ---
6px | 4
8px | 8
20px | 2
24px | 2
28px | 2

## Corner radii

Value | Occurrences
--- | ---
50% | 8

## Shadows

No values observed in this sample.

## Motion durations

Value | Occurrences
--- | ---
1.1s | 8
0.7s | 7
0.2s | 4
0.3s | 2

## Motion easing

Value | Occurrences
--- | ---
ease | 13
cubic-bezier(0.16, 1, 0.3, 1) | 8

### Accessible keyframe names

- marquee
- gl-core
- gl-a
- gl-b
- gl-c
- gl-d

## Component recipes

Computed styles for the captured state. Selectors identify sampled elements; text and placeholders come from the page. Form values are excluded. These style specimens do not reconstruct child markup or uncaptured interaction states.

### Button 1

Observed text or placeholder: menu

```css
button.menu-btn {
  align-items: normal;
  backdrop-filter: none;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-bottom-color: rgb(29, 29, 27);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgb(29, 29, 27);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 0px;
  border-right-color: rgb(29, 29, 27);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(29, 29, 27);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(29, 29, 27);
  display: block;
  font-family: "Zoom Pro Normal", "Host Grotesk", "Helvetica Neue", Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28px;
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
1 | rgb(236, 235, 231) | none | 1
2 | rgb(236, 235, 231) | none | 1

### Card 1

Observed text or placeholder: Fig. 01 / 04 Apartment near the Prater Exclusive living at the Prater PROJECT Apartment near the Prater Private LOCATION

```css
article.triad.live {
  align-items: normal;
  backdrop-filter: none;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-bottom-color: rgb(29, 29, 27);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgb(29, 29, 27);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 0px;
  border-right-color: rgb(29, 29, 27);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgb(29, 29, 27);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(29, 29, 27);
  display: grid;
  font-family: "Zoom Pro Compact", "Host Grotesk", "Helvetica Neue", Arial, sans-serif;
  font-size: 20px;
  font-weight: 300;
  gap: 8px;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28px;
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
1 | rgb(236, 235, 231) | none | 1

## Layout measurements

Element | Width | Display | Columns | Gap | Padding (T R B L)
--- | --- | --- | --- | --- | ---
header | 1521px | grid | 687.4px 66px 687.4px | normal | 0px 40px 0px 40px
main | 1521px | block | none | normal | 66px 0px 0px 0px
section | 1521px | block | none | normal | 0px 0px 0px 0px
section | 1521px | grid | 1440.8px | 28px | 96px 40px 120px 40px
section | 1521px | block | none | normal | 0px 40px 80px 40px
article | 1441px | grid | 474.925px 474.938px 474.938px | 8px | 0px 0px 0px 0px
article | 1441px | grid | 474.925px 474.938px 474.938px | 8px | 0px 0px 0px 0px
article | 1441px | grid | 474.925px 474.938px 474.938px | 8px | 0px 0px 0px 0px
article | 1441px | grid | 474.925px 474.938px 474.938px | 8px | 0px 0px 0px 0px
section | 1521px | block | none | normal | 0px 40px 80px 40px

## Responsive conditions

- `(pointer: fine)`
- `(prefers-reduced-motion: reduce)`
- `(max-width: 900px)`

## CSS custom properties

Names and values read from the root element; no new token names or ramps were generated.

Property | Value
--- | ---
--pp | #ECEBE7
--downpipe | #567480
--e-out | cubic-bezier(.16,1,.3,1)
--copy | "Zoom Pro Compact", "Host Grotesk", "Helvetica Neue", Arial, sans-serif
--box | #F8F8F8
--hdr-bg | #ECEBE7
--wide | "Zoom Pro Wide", "Host Grotesk", Arial, sans-serif
--pad | 40px
--mud | #4A4944
--black | #1D1D1B
--brown | #9F7056
--t-fast | .35s
--head | "Zoom Pro Normal", "Host Grotesk", "Helvetica Neue", Arial, sans-serif
--bar | 76px
--sans | "Host Grotesk", "Helvetica Neue", Arial, sans-serif
--white | #F8F8F8
--t-slow | 1.1s
--stagger | 70ms
--hdr | 66px
--mono | "Geist Mono", ui-monospace, "SFMono-Regular", Menlo, monospace
--e-inout | cubic-bezier(.7,0,.2,1)
--t-mid | .7s
--bg | #ECEBE7
--orange | #FF8500
--ease | cubic-bezier(.7,0,.2,1)

## Capture coverage

- 1 stylesheet(s) could not be inspected. Computed styles are still measured.
- Sampling excludes hidden elements and Sitepeel tools. Offscreen rendered elements may be included. Counts refer to the sample, not the entire website.
- Colors are CSS values, not a screenshot pixel palette. Images, compositing and gradients can affect their visible appearance.
- Hover, focus, active states, other viewport sizes, iframe documents and shadow trees need separate captures.
- No inferred brand personality, invented colors, placeholder copy or unobserved code is presented as a page measurement.
- 1 canvas element(s) detected. CSS extraction does not expose canvas drawing, WebGL shaders or JavaScript animation internals.
