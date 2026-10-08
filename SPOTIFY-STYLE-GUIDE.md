# Spotify (open.spotify.com) — Extracted Visual Design System

Extracted by live inspection of the unauthenticated open.spotify.com web player (computed
styles, real hex/rgb values pulled via DevTools-style JS, not guessed). This documents the
**visual system only** — no Spotify content, code, copy, or brand assets are reproduced.
Applied to the Sokoni project on 2026-09-08 (see "Applied to Sokoni" at the end).

---

## 1. Color Palette

| Token | Value | Verified usage |
|---|---|---|
| Canvas (page background) | `#121212` | `<html>` background, confirmed via computed style |
| Elevated surface (cards, panels) | `#1F1F1F` | Most common non-transparent background found (12 occurrences in a single scan) |
| Chrome (nav bar, player bar) | `#000000` | Top/bottom bars sit at pure black, distinct from the `#121212` canvas |
| Secondary elevated surface | `#333333` | Hover/active state on some panels |
| Icon-button background | `#1F1F1F` (rest) → `#292929` (hover) | Circular icon buttons (back/forward/search) |
| Primary text | `#FFFFFF` | Headings, track titles |
| Secondary/muted text | `#B3B3B3` | Body copy, artist names, metadata — this is Spotify's signature muted gray |
| Tertiary/disabled text | `#777777` | Least-emphasized UI text |
| **Brand green (primary action)** | `#1DB954` (classic) / `#1ED760` (current brighter refresh) | Confirmed directly: a live CTA button computed to `rgb(29,185,84)` |
| Danger/error | Not directly observed on this page — Spotify's known error red is in the `#E91429`–`#F04438` range | Use a bright red with **white text avoided** unless darkened (see contrast note below) |

**Buttons, verified directly:**
- White pill ("Log in"): `background: #FFFFFF`, `color: #000000`, `border-radius: 9999px`, `padding: 8px 32px`, `font-weight: 700`
- Green pill (CTA, e.g. cookie-consent "Confirm"): `background: #1DB954`, `color: #FFFFFF` in that one instance, `border-radius: 2px` (that particular button is a legacy/consent-widget style, not the main app's pill convention)
- Circular icon buttons: `background: #1F1F1F`, `border-radius: 50%`, `padding: 12px`

**Important accessibility note found during extraction:** white text directly on `#1DB954`-class green computes to only **~4.3:1 contrast** — right at the edge of WCAG AA (4.5:1) for normal-weight text under 24px. Spotify's own primary CTAs typically pair the green with **black** text/icons for this reason. Replicate that pairing (black text/icon on the green fill) rather than defaulting to white-on-green.

**Gradients/overlays:** No large decorative gradients were found on this page — Spotify's own surface relies on flat elevated grays, not gradient washes. Album art tiles used for "Featured Charts" etc. carry their own artwork-driven color extraction (dynamic per-item), not a fixed brand gradient — don't replicate this as a static token.

---

## 2. Typography

- **Font family (confirmed via computed style):** `SpotifyMixUI` (Spotify's current proprietary family, an evolution of `CircularSp`/Circular), falling back through `CircularSp-*` regional variants to `"Helvetica Neue", helvetica, arial`.
- **This is a proprietary, non-licensable font.** For replication, use a free geometric/humanist sans with similar character: **Poppins**, **DM Sans**, **Sora**, or **Manrope** are the commonly-cited closest free stand-ins. Sokoni now uses **Poppins**.
- **One family throughout** — Spotify does not swap fonts between headings and body; both use the same `SpotifyMixUI` stack (a title-specific variant, `SpotifyMixUITitle`, is used for section headers but is visually the same family).
- **Weights observed:** `400` (body/regular), `700` (headings, buttons, nav labels). No light (300) weights found on this page — Spotify's UI leans on regular/bold only, not a light-weight display style.
- **Sizes observed:**
  - Section headers ("Trending songs"): `24px / 700`
  - Body/UI text: `16px / 400`
  - Small UI labels (e.g. "Sign up"): `14px / 700`
- **Line height:** `normal` (browser default) throughout — no custom tight/loose line-height was set on the elements inspected.
- **Letter spacing:** `normal` (0) throughout — no tracking applied to headings or body.

---

## 3. Layout & Structure

- **App shell grid (not a marketing-site grid):** the web player itself is a 3-column app shell — `280px` sidebar, fluid main content, collapsible right rail — not a classic centered marketing container. If replicating the *marketing* site (spotify.com, not open.spotify.com) expect a more conventional centered max-width container instead; this extraction covers the **app/product UI**, which is what was requested.
- **Content width:** main content column measured `936px` at a `1280px` viewport in this session (i.e., roughly viewport-minus-sidebar, not a fixed marketing max-width).
- **Card rows:** content (songs, artists, albums) is arranged in **horizontal scrolling rows** grouped under a bold section header + "Show all" link — not a fixed CSS grid of cards. This is a deliberate structural choice worth replicating for a content-discovery UI: label → horizontal row → "Show all," repeated per section.
- **Header/nav:** persistent top bar, not transparent (solid black), with back/forward icon buttons, a search field, and account actions (Premium/Support/Download/Install App/Sign up/Log in) right-aligned. Sticky/pinned to the top confirmed via `position: sticky` computed style.
- **Sidebar:** persistent left rail ("Your Library") with quick-action cards ("Create your first playlist," "Let's find some podcasts to follow") and a legal/locale link cluster at the bottom.
- **Footer (unauthenticated landing state):** a plain multi-column link list (Company / Useful links / Spotify Plans) on the same dark canvas — no separate "footer band" color treatment.

---

## 4. UI Components

- **Buttons:** two dominant shapes —
  1. **Full pill** (`border-radius: 9999px`) for primary text-labeled actions (Log in, Sign up, Confirm)
  2. **Perfect circle** (`border-radius: 50%`) for icon-only actions (nav back/forward, play)
  - No box-shadow on any button observed (`box-shadow: none` everywhere checked) — depth comes from color contrast, not elevation shadows.
  - Transition: fast, `0.15s–0.2s`, `cubic-bezier(0.3, 0, 0, 1)` (a snappy ease-out) on `background-color`/`color`/`transform`.
- **Cards (album/track tiles):** `border-radius: 6px`, `padding: 12px`, **no border, no box-shadow** — a flat, borderless surface distinguished purely by its `#1F1F1F`-on-`#121212` contrast against the page.
- **Images (album art):** square (1:1), `6px` radius, no shadow, no filter/overlay treatment observed.
- **Form fields:** not prominently featured on this page (the player mostly uses a single search input); Spotify's search field is a rounded, flat, dark-elevated input — consistent with the card treatment rather than a distinct bordered form style.
- **Navigation menu style:** persistent top bar + persistent left sidebar (no hamburger observed at desktop width) — this is an authenticated-app navigation pattern, not a marketing-site dropdown menu.

---

## 5. Icons & Imagery

- **Icon style:** simple filled/line glyphs at small sizes inside circular buttons — Spotify uses its own proprietary icon set (not a public library like Feather or Font Awesome). For replication, any clean single-weight line-icon set (Lucide, Heroicons) reads close enough.
- **Image treatment:** album art is square with a small 6px radius and no shadow/filter; artist photos are circular (`border-radius: 50%`) with no border or ring observed.
- **Illustration style:** none used on this page — Spotify's browse UI is entirely photography/artwork-driven (album covers, artist photos), not custom illustration.

---

## 6. Motion & Interaction

- **Hover/transition:** short, snappy transitions (`0.15s–0.2s`, `cubic-bezier(0.3, 0, 0, 1)`) on background-color, color, and transform — confirms Spotify favors quick, low-travel feedback over slow/eased animation.
- **No parallax or scroll-triggered fade-ins were present** on this page — it's a functional app UI, not a scroll-narrative marketing page, so motion is confined to direct-interaction feedback (hover/press), not ambient scroll effects.

---

## Applied to Sokoni

> **Superseded on 2026-10-04.** The first pass (2026-09-08) only swapped token values onto the old classifieds layout (Poppins, green WhatsApp buttons, top-nav marketing hero). Sokoni has since been rebuilt in Spotify's full web-player grammar: app shell with a Your Library sidebar, live search, shelves, color-matched entity pages, mobile tab bar, Figtree, and WhatsApp moved to white/outlined pills so it can never be confused with escrow.
>
> **`DESIGN.md` is now the authoritative design system.** Sections 1–6 above remain useful as the raw Spotify reference they were extracted from.
