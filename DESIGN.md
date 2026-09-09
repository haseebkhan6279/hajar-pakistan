# HAJAR Design System

A Pakistani couture label. The logo is gold on near-black; the site inverts that to a
**white ground with gold accents**, so the clothing photography carries the page and
the ink-and-gold pairing stays as the brand signature.

**Naming:** `HAJAR/[Page]/[Breakpoint]` — e.g. `HAJAR/Home/Desktop`,
`HAJAR/PDP/Mobile`, `HAJAR/Admin/Products/Desktop`.

---

## Brand

| Token | Value | Role |
|-------|-------|------|
| Wordmark | HAJAR | Serif, tracked +0.3em, paired with the هجر roundel |
| Ground | White `#FFFFFF` | Primary canvas |
| Accent | Gold `#C8992F` | The single accent — never a second one |
| Ink | `#0A0A0A` | Type, and the inverted panels lifted from the logo |
| Asset | `web/public/brand/hajar-logo.jpg` | Square tile: mandala frame, gold roundel, wordmark |

## Colour tokens

Defined identically in `web/src/app/globals.css` and `dashboard/src/index.css`.

```
--hj-canvas:        #FFFFFF   page ground (storefront)
--hj-cream:         #FCF9F3   alternating section ground, admin ground
--hj-sand:          #F5EFE3   image placeholders, skeletons
--hj-sand-2:        #EBE1CD   pressed / filled states
--hj-border:        #E7DFD0   hairlines
--hj-border-strong: #D3C5AA   hover hairlines, dashed dropzones

--hj-ink:           #0A0A0A   primary type, inverted panels (the logo's black)
--hj-ink-soft:      #38342C   body copy
--hj-muted:         #7A7263   labels, meta, captions

--hj-gold:          #C8992F   accent, focus ring, active rules
--hj-gold-soft:     #EDD68F   type on ink panels (the wordmark gold)
--hj-gold-deep:     #8B5E2B   links and accent type on white — 5.6:1, AA
--hj-gold-wash:     #FDF8EA   selected rows, subtle highlight

--hj-danger:        #A83A32   sale prices, destructive actions
--hj-success:       #4E7A46   published state
```

**Rule:** gold on white is always `--hj-gold-deep`; gold on ink is always
`--hj-gold-soft`. `--hj-gold` itself is for rules, borders and fills — not type.

## Typography

| Role | Family | Usage |
|------|--------|-------|
| Display | Cormorant Garamond | Wordmark, headlines, product names, prices at size |
| Body | Jost | UI, body copy, forms, nav |
| Mono | JetBrains Mono / system | SKUs, slugs, order numbers |

**Scale:** 10 / 11 / 13 / 15 / 16 / 20 / 24 / 32 / 48 / 72 / 88
**Tracking:** wordmark +0.3em · eyebrows +0.22em uppercase · buttons +0.18em uppercase ·
body normal.

The `.eyebrow` class is the standard small-caps label: 10px, +0.22em, muted.

## Spacing

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128

Page gutter: 16px mobile, 32px from `md`. Max content width 1400px.

## Motion

| Name | Spec | Where |
|------|------|-------|
| Hero rise | opacity + 14px, 900ms `cubic-bezier(.16,1,.3,1)`; delays 0.12 / 0.26 / 0.4s | `HAJAR/Home/*` |
| Card lift | image `scale(1.045)`, 700ms; second image cross-fades 500ms | ProductCard |
| Sticky header | transparent border → hairline + soft shadow, 300ms | SiteHeader |
| Marquee | 34s linear infinite, duplicated track | SiteFooter |

All of it is disabled under `prefers-reduced-motion: reduce`.

## Composition rules

The storefront follows the couture-house convention (ÉLAN, Sana Safinaz, Élan Vital):
a centred lockup, edge-to-edge imagery, and captions that sit quietly under the photo.

1. **Header is two centred rows.** Row one is the wordmark alone, centred. Row two is
   the nav, centred, 12px uppercase +0.14em. Utilities (PKR · account · search · bag)
   pin to the right of row one; the burger pins left below `lg`. Active nav item goes
   `--hj-gold-deep` — never underlined, never bold.
2. **Hero is a full-bleed slider.** No gutters, `78vh` mobile / `100vh − header` on
   desktop, on a 4s hold with a 1.1s crossfade. Each slide: collection eyebrow in gold, the
   piece name in large tracked uppercase, a +0.34em kicker, two CTAs. Right-aligned
   on desktop, centred on mobile. A slow `scale(1.05)` ken-burns runs on the active
   slide; hover, touch-swipe and reduced-motion all pause it. Progress shows as
   hairline bars, not dots. No stat rows or cards over the hero.
3. **Section headings are centred**, uppercase, +0.16em, with a single muted line
   under them. No eyebrow and no gold rule in these — the rule belongs to the
   left-aligned editorial sections only.
4. **Product captions are centred and single-line**: `NAME (SKU) PRICE`, 13px,
   +0.08em uppercase, reference in muted, a struck compare-at price after. The card
   has no border and no background — the image is the boundary.
5. **Quick-add sits on the image**, bottom-right, 44px ink square, fading in on hover
   and always visible on touch. It is a *sibling* of the product link, never nested
   inside it.
6. **Collection cards** carry a white caption panel over the base of the image, not
   a gradient scrim.
7. **The campaign film** is one full-bleed band at `2.35:1` from `md` up,
   capped at `80vh`. The MP4 is a 1920×1080 file, but the picture inside it is
   a ~2.16:1 crop with black bars baked into every frame — so the band is
   matched to the *picture*, not the container, and the centred crop swallows
   the bars. Matching the container's 16:9 puts a black band across the
   section. Phones keep a `70vh` band, since 2.35:1 there is too short to hold
   the copy. It is muted and looping, with
   the scrim weighted left where the type sits. It is never the hero — video that
   heavy must not be the largest contentful paint. It loads only on scroll, pauses
   off-screen, holds still under `prefers-reduced-motion`, and always carries a
   visible pause control because it starts on its own.
7. **Cards are for interaction containers only** — product tiles, cart lines, admin
   tables and panels. Editorial sections use hairlines and whitespace, not boxes.
8. **The storefront has no dark sections.** It is a white-ground house: ink type,
   gold accents, photography carrying the colour. A full `--hj-ink` band reads as a
   different site, so image-less sections are separated by warmth instead —
   `--hj-cream` for the journal band and the footer masthead, the deeper
   `--hj-sand` for the appointment band between them. Ink stays where it belongs:
   type, buttons, hover fills, and scrims over photography. (Dark panels remain
   correct in the dashboard, which is a different surface.) All four `Button`
   variants are drawn for a light ground; `cn` does no class merging, so recolour
   a button by adding a variant, never through `className`.
9. **The gold hairline** (`.rule-gold`) opens left-aligned editorial sections under
   their heading. 20px wide in headings, 12–14px in cards.
10. **Footer runs marquee → masthead → four columns → legal bar.** The masthead is
    one cream band: lockup, house line and appointment link on the left, newsletter
    on the right, stacked on mobile. The lockup is `LogoMark` + wordmark, the same
    mark the header opens on — never the square logo file, which carries its own
    black ground and mandala frame and reads as a sticker on a white page.
    Below it the four columns are even and carry lists only — collections →
    information → customer care → contact. No column holds a panel or card: one
    boxed column makes the whole row read lopsided. Column headings are 10px caps
    +0.22em over an 8px gold rule — never the body-size headings used in page
    content. Collection children hang off a left hairline under their house. The
    legal bar carries 96px of bottom padding so the last line clears the floats.
11. **WhatsApp float** is fixed bottom-right at 56px; back-to-top takes bottom-left so
    the two never collide.

## Grid

Product grids are **2 columns on mobile, 4 on desktop** (`lg:grid-cols-4`), gap 16px
rising to 20px, row gap 40px rising to 56px. Collection rows are 3-up with a 12–16px
gap and near-full-bleed 12px page padding — the images should almost touch.

## Data visualisation

Admin charts only. Palette validated against a white surface for lightness band,
chroma floor, CVD separation and contrast (`dashboard/src/lib/charts.ts`).

| Job | Colour |
|-----|--------|
| Single series over time | `#B5820F` (brand gold, area + 2px line) |
| Categorical, ≤ 3 collections | `#B5820F` · `#1D6FD0` · `#A83262` — fixed order, never cycled |
| Magnitude across labelled categories | single hue, `#B5820F` |

Rules: no dual axes, 4px rounded bar ends anchored to the baseline, recessive dashed
grid, no data label on every point, tooltips on by default, and a "view as table"
escape hatch on the revenue chart.

## Stack mapping

| App | Port | Role |
|-----|------|------|
| `web/` Next.js 15 | 3001 | Storefront |
| `dashboard/` Vite | 5173 | Admin operations |
| `api/` NestJS 11 | 3000 | REST + JWT + Cloudinary |
