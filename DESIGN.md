---
name: Sokoni
description: A marketplace you live in — classifieds and WhatsApp shops on Spotify's web-player chassis, with trust drawn beside every buying decision.
colors:
  frame: "#000000"
  canvas: "#121212"
  surface: "#1f1f1f"
  surface-hi: "#2a2a2a"
  menu: "#282828"
  menu-hi: "#3e3e3e"
  tint: "rgb(255 255 255 / 0.07)"
  tint-hi: "rgb(255 255 255 / 0.1)"
  fg: "#ffffff"
  subdued: "#b3b3b3"
  hint: "#929292"
  faint: "#7c7c7c"
  line: "#2a2a2a"
  accent: "#1ed760"
  accent-hi: "#3be477"
  accent-press: "#1abc54"
  on-accent: "#000000"
  whatsapp: "#25d366"
  verified: "#4cb3ff"
  verified-fill: "#3d91f4"
  negative: "#f3727f"
  warning: "#ffa42b"
  toast: "#2d6bc4"
typography:
  display:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4cqi, 6rem)"
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.375
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"ss01\""
  meta:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.45
  price:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    fontFeature: "\"tnum\""
rounded:
  tile: "4px"
  card: "6px"
  pane: "8px"
  pill: "9999px"
spacing:
  shelf-gap: "4px"
  tile-gap: "8px"
  card-pad: "12px"
  page-pad: "16px"
  page-pad-wide: "24px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hi}"
  button-primary-active:
    backgroundColor: "{colors.accent-press}"
  button-whatsapp:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.frame}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "56px"
  button-whatsapp-outline:
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "32px"
  button-outline:
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "56px"
  button-tinted:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "32px"
  chip:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  chip-selected:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.frame}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    rounded: "{rounded.tile}"
    padding: "0 16px"
    height: "48px"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    height: "48px"
  card:
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  card-hover:
    backgroundColor: "{colors.tint}"
  category-tile:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    height: "64px"
  menu:
    backgroundColor: "{colors.menu}"
    textColor: "{colors.fg}"
    rounded: "{rounded.tile}"
    padding: "4px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.pane}"
    padding: "20px"
  message-mine:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  message-theirs:
    backgroundColor: "{colors.surface-hi}"
    textColor: "{colors.fg}"
  toast:
    backgroundColor: "{colors.toast}"
    textColor: "{colors.fg}"
    rounded: "{rounded.pane}"
    padding: "10px 16px"
---

# Design System: Sokoni

## Overview

**Creative North Star: "The Marketplace You Live In"**

Sokoni is built as an app, not a page. Its chassis is the Spotify desktop player: a pure black frame holding rounded near-black panes, with a "Saved & following" rail on the left, the main view in the center, a chat-details view docked on the right on wide screens, and a persistent bottom bar. What fills that chassis is a marketplace, not a music app. The bottom bar holds the chat you're negotiating. Cards read as items for sale, with price first, location and seller trust. Home opens by saying plainly what Sokoni is, then offers categories with live counts and shelves of deals and shops.

Color lives in the content, not the chrome. Every cover carries a seeded color (or a real photo), and that color washes the top of its entity page, the home header behind a hovered category tile, a shop card's shopfront band, and the phone chat bar. The chrome itself stays black, gray and white, with one green for Sokoni's own actions and live state (post, save, reply, continue). Buying happens on WhatsApp: a white pill carrying the WhatsApp glyph is the primary action on every listing, and in-app messaging sits beside it as an outline pill. Trust is drawn rather than written: a score ring, a blue rosette and safety tips sit beside every buying decision.

Density is app density: 14–16px UI type, tight 4–12px gaps inside shelves, generous 32px between sections, and 900-weight type only for the page's one name (an entity title, or the home statement).

**Key Characteristics:**
- Black frame (#000) holding 8px-radius #121212 panes with 8px gutters between them.
- Figtree only: 900 for entity titles and the home statement, 400–700 for everything else.
- Borderless cards that lift to white/7% on hover; no strokes at rest.
- Pills for every button and chip; circles for icon buttons and people; rounded squares for items and businesses.
- Green for Sokoni actions and live state. A white or outlined pill with the WhatsApp glyph is reserved for WhatsApp.
- Each record's seeded cover color paints its own entity header.

## Colors

The chrome is neutral black and gray. On top of it sit one platform green, a white reserved for WhatsApp, a verification blue, and a sixteen-color seeded content palette that supplies all the saturation.

### Primary
- **Sokoni Green** (accent): Sokoni's own platform actions (Post an ad, Open a shop, Reply, Send, Continue in wizards) and live state (Live listing dot, saved bookmark, active rail row title, pinned glyph, unread dot, your sent message bubble, in-stock toggle, wizard progress, trust tick on Home). Always carries black text (on-accent). Lighter on hover (accent-hi), darker on press (accent-press).

### Secondary
- **WhatsApp White** (fg as a fill): the WhatsApp pill. A white pill always carries the WhatsApp glyph and is the primary buy action on listing and product pages.
- **WhatsApp Green** (whatsapp): only inside the WhatsApp glyph's bubble. Never a fill, never text, never a button.
- **Rosette Blue** (verified-fill, with verified as the lighter tone): the verified rosette only. It marks identity verification and is never used as decoration.

### Tertiary
- **Seeded Cover Palette** (in `src/lib/placeholder.ts`: #e13300, #1e3264, #e8115b, #148a08, #0d73ec, #8400e7, #27856a, #ba5d07, #477d95, #dc148c, #006450, #608108, #b06239, #2d46b9, #c27c0e, #5e7d8c): saturated, and deep enough for white glyphs and large white text. `seedColor(id)` picks one per record. It fills procedural covers, monogram avatars, shop logos and shopfront bands, browse tiles, the "About the seller" band, and the entity header behind a real photo.

### Neutral
- **Frame Black** (frame): the html/body background and the gutters between panes.
- **Pane Black** (canvas): the rail, main view and chat panel; also the input fill.
- **Raised Charcoal** (surface) and **Hover Charcoal** (surface-hi): in-pane panels (Buying safely, Sold by, message panel, empty states), the search pill, icon-button wells, and other people's message bubbles. Surface-hi is also their hover.
- **Menu Gray** (menu, menu-hi): context menus and their row highlight.
- **White Tint** (tint 7%, tint-hi 10%): card hover, category tiles, unselected chips, tinted buttons, the active rail row, tip icon wells, and the "Chat details" toggle when on.
- **White** (fg): primary text, selected chips, the WhatsApp pill, focus rings.
- **Subdued Gray** (subdued): secondary text, meta lines, and icon buttons at rest.
- **Hint Gray** (hint): placeholders.
- **Faint Gray** (faint): outline-pill and input hairlines, the low trust-ring tone, and text at 24px or larger only.
- **Line** (line): dividers and spec-list rules inside panels.
- **Status tones**: negative (invalid fields, danger menu items), warning (the ring while trust is building), toast blue (every toast, white text).

### Named Rules
**The WhatsApp Is White Rule.** WhatsApp is always a white pill (primary placements) or an outlined pill (secondary placements), and it always carries the real WhatsApp glyph. Green is never WhatsApp. A plain white pill without the glyph does not exist. The rule keeps the moment a buyer leaves Sokoni for WhatsApp unmistakable.

**The Content Carries Color Rule.** Chrome is black, gray and white. Saturation enters only through a record's seeded color or photo, and that color follows the record: its cover, its entity header, its shopfront band, its home-header wash and its phone chat bar.

**The Live Green Rule.** Green means a Sokoni action or something live right now. Selected filter chips are white with black text, not green.

## Typography

**Display Font:** Figtree (with ui-sans-serif, system-ui)
**Body Font:** Figtree (with ui-sans-serif, system-ui)

**Character:** One geometric, friendly sans, standing in for Spotify Circular / Spotify Mix. Figtree's real 900 weight gives the page's one name its poster weight, and everything else sits at 400–700. Stylistic set ss01 is on globally.

### Hierarchy
- **Display** (900, 1.04, -0.04em, balanced wrap): entity titles, which step by length from clamp(1.75rem, 4cqi, 2.75rem) for long names up to clamp(2.75rem, 9cqi, 6rem) for 12 characters or fewer. The home statement uses the same weight at clamp(2rem, 5cqi, 3.5rem), -0.035em.
- **Headline** (700, 1.5rem, -0.02em): shelf titles and section heads ("Shop by category", "About this listing"). The chat panel's price uses the same size.
- **Title** (600–700, 1rem): category-tile labels, panel headings, shop-card names, and button labels (700).
- **Body** (400, 1rem, 1.5): running text, held to 65ch in descriptions. Card titles are 400 with a two-line clamp.
- **Meta** (400, 0.875rem): subdued meta lines (city with a map pin, "Fabric · Lagos"), chips, small buttons, tile counts.
- **Label** (400, 0.6875rem–0.75rem): chat-bar secondary lines, mobile tab labels, message timestamps.
- **Price** (700, 1.125rem on cards, tabular numerals): every price leads its card. Scores, counts and "Chat 1 of N" are also tabular.

### Named Rules
**The One Loud Line Rule.** 900 weight belongs only to the page's one name: an entity title, or the home statement. Nothing sits above it. Category and verification go in the meta line beneath, and the verified rosette sits inline after an entity title at half its cap size.

**The Price First Rule.** On item cards the price comes before the title, in bold tabular numerals.

## Layout

**Shell (viewport-based).** From 1024px the app is a grid with three rows (a 4rem top bar, a flexible main row and a 4.5rem chat bar), 8px gutters and 8px side padding on black. The columns are the rail (300px; 264px between 1024 and 1279px; 72px collapsed) and the main pane. From 1280px the chat panel (320px, 360px from 1536px) can dock as a third column. It opens by default at 1440px and up, and its state persists. Below 1024px the shell becomes a mobile header and a bottom tab bar (Home / Search / Saved / Sell). A compact chat bar floats above the tabs when you have a chat about an item.

**Pages (container-based).** Everything inside `<main>` responds to the `main` container, never to the viewport, because the chat panel narrows the pane. Home category tiles go from 2 columns to 3 at the 2xl container size (six categories, never 4 columns). Listing pages split into content plus a 20rem seller column at 4xl (24rem at 5xl).

**Rhythm.** Page padding is 16px, rising to 24px from 640px. Shelves are 32px apart, and a shelf title sits 8px above its row. Shelf cards are 172px-minimum auto-fill columns with a 4px gap, and only the first row shows, so a shelf always shows whole cards. Below 640px the row becomes a horizontal snap scroller of 152px cards. Cards carry 12px padding, offset by -12px on the row so their content aligns with the page edge.

**Washes.** Entity headers are painted in the record's color with a black/50% bottom fade. The first 232px of the body continue that color, fading from black/60% into the canvas. Home carries a 332px wash that rests on a deep market green and follows the hovered or focused category tile over 700ms.

## Elevation & Depth

Depth comes from tone first: black frame, #121212 panes, #1f1f1f panels, white tints for hover. Nothing casts a shadow at rest except a few floating layers and the large entity art.

### Shadow Vocabulary
- **Art lift** (`box-shadow: 0 8px 24px rgb(0 0 0 / 0.5)`): standalone art outside cards (shop art in search results, the post and onboarding previews), the phone chat bar, toasts.
- **Entity art** (`box-shadow: 0 4px 60px rgb(0 0 0 / 0.5)`): the large cover beside an entity title.
- **Logo tile** (`box-shadow: 0 4px 12px rgb(0 0 0 / 0.35)`): the square logo on a shop card's shopfront band, and a browse tile's tucked cover.
- **Menu** (`box-shadow: 0 16px 24px rgb(0 0 0 / 0.3), 0 6px 8px rgb(0 0 0 / 0.2)`): context menus.

### Named Rules
**The Chrome Stays Flat Rule.** Buttons, chips, cards, card covers and panels never take a shadow. Hover is a tint or a scale, never a lift. Shadows belong to floating layers (menus, toasts, the phone chat bar) and to hero art.

## Shapes

Four radii, each with one job:
- **4px:** inputs, menus and small cover thumbs.
- **6px:** cards, card covers and category tiles.
- **8px:** panes, in-pane panels, browse tiles, toasts and shop logo tiles.
- **Fully round:** every button, chip, search field, icon button, the reply field, and people's avatars.

Form follows the thing being shown. People are circles. Businesses are rounded squares (a square logo tile, never a round portrait). Items are 4:3 rounded rectangles on cards and squares in entity headers. Strokes are inset box-shadow hairlines (1px faint at rest, white on hover, 2px white on focus), never borders that shift layout. Procedural covers tilt a large lucide glyph -14° into the bottom-right corner over a light in the top-left. Browse tiles tuck a whole cover, rotated 25°, into their corner.

## Components

### Buttons
Full pills with bold labels, a 1.04 scale on hover, a snap back on press, and no shadows.
- **Shape:** fully round (9999px). Sizes: 32px tall with 16px padding (small, 14px text), 48px with 32px padding (default), 56px with 32px padding (large; listing actions).
- **Primary (green):** Sokoni platform actions (Post an ad, Open a shop, Reply, Continue). Green fill, black text; lighter on hover, darker on press.
- **WhatsApp (white):** white fill, black text, WhatsApp glyph at 20px (16px small), opening wa.me in a new tab. It is the primary action on listing pages ("Chat on WhatsApp", full-width on phones) and in the sticky entity bar. The outlined WhatsApp variant ("Continue on WhatsApp") sits beside Reply in the chat bar and panel.
- **Outline:** secondary actions (Message seller, Follow/Following, Your shop, View profile): transparent with a 1px inset faint hairline that turns white on hover.
- **Tinted:** low-emphasis utilities on dark (the rail's Sell menu): white/7% fill, 10% on hover.
- **Ghost:** subdued text that turns white on hover.
- **Icon buttons:** circles at 32/48/56px, with a subdued icon that turns white at the same 1.04 scale.
- **Disabled:** 40% opacity, no pointer events.
- **Motion:** 100ms on `cubic-bezier(0.3, 0, 0, 1)`.

### Chips
- **Style:** 32px pills, 12px padding, 14px text; white/7% fill, white text.
- **State:** selected chips go solid white with black semibold text. When a filter is active, the row collapses to that chip plus a round clear (×) chip. Used in the rail (Saved items / Shops / My ads) and on search and category filters.

### Cards / Containers
- **Listing card:** transparent at rest, 6px radius, 12px padding, lifting to white/7% on hover over 200ms. A 4:3 cover with a black/70% blurred status pill top-left (Featured, Sold) and a 36px bookmark circle top-right that is always visible. The bookmark is black/60% blurred at rest and turns green and filled once the item is saved. Below the cover: bold tabular price, then the title (two-line clamp), then a map pin and city, then the seller's 14px trust ring, name and verified rosette. The whole card is one stretched link.
- **Shop card:** the same frame. A 4:3 shopfront band runs a diagonal gradient from the shop's seeded color to 55% of it mixed with black. On the band sit a "Shop" pill badge with a store glyph (top-left) and a 56px square monogram logo tile (bottom-left, 8px radius, white/25% ring). Below: semibold name with rosette, "Category · City", and an outline Follow pill.
- **Category tile:** 64px tall, white/7%, 6px radius, with a 64px seeded cover flush left, a bold label and a tabular listing count. It brightens to 10% on hover and repaints the home wash.
- **Panels:** #1f1f1f, 8px radius, 20–24px padding, no border or shadow; dividers in line gray. "Buying safely" is a panel of four tips, each with a 40px white/10% icon circle, a bold title and a subdued line.

### Inputs / Fields
- **Style:** 48px tall, 4px radius, pane-black fill, 16px padding, 1px inset faint hairline; placeholders in hint gray. Labels are 14px bold white, 8px above the field.
- **Focus:** the hairline turns white on hover and 2px white on keyboard focus.
- **Error:** a negative-pink hairline when invalid.
- **Search:** a 48px charcoal pill with a 24px search glyph and a 2px inset white focus ring; placeholder "Search phones, rentals, jobs, services…". Typing navigates to live results; Ctrl/⌘+K focuses it.
- **Reply field:** a 40px charcoal pill beside a 40px green send circle.

### Navigation
- **Top bar:** logo and history arrows over the rail; in the center, the home circle beside the search pill; on the right, "Post an ad" (small green pill with +), the messages icon and the account avatar menu.
- **Rail ("Saved & following"):** a bookmark-icon header that collapses the rail, a tinted Sell menu, filter chips, then rows with 48px art (rounded squares for items, circles for shops and people) that highlight to white/7%. The current row turns white/10% with a green title. Pinned rows carry a green pin. The rail collapses to a 72px column of art only.
- **Mobile:** a sticky header, a white search pill on Home, and a bottom tab bar with 11px labels.
- **Menus:** #282828, 4px radius, 4px inset padding, 40px rows highlighting to #3e3e3e, 140ms fade-in.

### Chat Bar (signature)
The persistent bottom bar holds the chat you're negotiating. Left: a 56px item cover, the title, a "Chat with [name]" link and a bookmark. Center: the latest message in one subdued line ("You: …" or "[Name]: …" · age), then a green Reply pill and an outlined "Continue on WhatsApp" pill. Right: a "Chat 1 of N" switcher with chevron icon buttons, a "Chat details" toggle pill (white/10% when on) and an "All messages" link. With no chats it shows an empty prompt instead. On phones it becomes a compact bar above the tabs, tinted with 42% of the item's seeded color over pane black, showing the item, the latest message and a Reply affordance.

### Chat Panel (signature)
The docked right view for the chat in focus:
- A 4:3 item cover, a 1.5rem bold tabular price, the title and city, and a bookmark.
- A Messages panel showing the last four bubbles (yours green with black text, theirs charcoal; 16px radius with a tucked corner), the reply pill, and an outlined WhatsApp pill.
- "About the seller": an 80px band in the seller's seeded color, then avatar, name, rosette, a 40px trust ring with label, and response time.
- "Your other chats" as selectable rows.

### Entity Header (signature)
The header is painted in `seedColor(id)` with a bottom fade. It holds the cover art (circular for people) beside a 900-weight title sized to its length, the inline verified rosette, and a white meta line: category · seller with rosette · trust ring and label · place · age · price. The action row below sits in the continuing color wash: on listings, the WhatsApp white pill, then Message seller (outline), then save, share and the more menu. A compact sticky bar takes over once the action row scrolls away and keeps the small WhatsApp pill.

### Trust Ring and Verified Rosette (signature)
The trust ring draws a 0–100 score as a round-capped arc on a white/12% track. It is green when trust is high, amber while it is building and faint gray when the seller is new, and shows the number in the center from 28px up. The rosette is a 16-point blue star with a white check, sized to its line. Both appear beside every buying decision: cards, entity meta lines, the Sold by panel, the chat panel and search.

### Covers
A cover shows the real photo (`images[0]`) when there is one, laid over the seeded color. Otherwise it is procedural:
- A seeded color field.
- A soft white radial light in the top-left and a black fade in the bottom-right.
- A large lucide glyph (chosen by title keywords, then category) at 76% size, 1.35 stroke and white/90%, tilted -14° into the corner.

Shops and people get extra-bold monogram initials on their seeded color, on a rounded square for shops and a circle for people.

## Do's and Don'ts

### Do:
- **Do** keep the frame #000 and every pane #121212 at 8px radius with 8px gutters.
- **Do** use green (#1ed760, black text) for Sokoni platform actions and live state only.
- **Do** make WhatsApp the white pill with the real glyph as the primary buy action, with "Message seller" as an outline pill beside it.
- **Do** paint entity headers with `seedColor(id)` and let the wash fade into the canvas.
- **Do** use the record's photo when it exists, and the procedural seeded cover when it doesn't.
- **Do** frame items 4:3 on cards with the price first.
- **Do** give businesses square logo tiles and people round avatars.
- **Do** lay out page content with container queries on the main pane, and keep shell visibility on viewport breakpoints.
- **Do** show the trust ring and verified rosette beside every buying decision.
- **Do** use tabular numerals for every price, score and count.
- **Do** make every button and chip a pill, and every icon button a circle.

### Don't:
- **Don't** render a WhatsApp action in green, or a white pill without the WhatsApp glyph.
- **Don't** put an eyebrow, kicker or entity-type line above a title; category and verification go in the meta line.
- **Don't** add borders or shadows to cards, card covers, chips, buttons or panels at rest.
- **Don't** add grain, noise or texture overlays.
- **Don't** use green for selected filter chips; selected chips are white with black text.
- **Don't** introduce a second typeface; Figtree carries every role.
- **Don't** use 900 weight anywhere but the page's one name.
- **Don't** hide the save control behind hover; the bookmark stays visible on every card.
- **Don't** drive in-pane layouts from viewport breakpoints.
- **Don't** use faint gray (#7c7c7c) for text under 24px.
