@AGENTS.md

# Sokoni — working guide

Sokoni is a marketplace for African sellers that unifies **one-off classifieds** and an **always-on WhatsApp storefront** under one seller identity, with a **trust score and ID verification** attached to the person. Buyers deal with sellers on WhatsApp or in-app chat; there is no escrow or in-app payment. Read `PRODUCT.md` for product truth (users, positioning, principles) and `DESIGN.md` for every visual decision. This file is how to work in the code without breaking either.

## Commands

```bash
npm run dev      # Next dev server (Turbopack). In the Claude desktop app use the "sokoni-dev" preview config in .claude/launch.json
npm run build    # Production build; must stay green (42 routes today)
npm run lint     # ESLint (flat config)
npx tsc --noEmit # Typecheck
```

Next 16 runs `dev` and `build` concurrently (separate `.next/dev` output), so you can build while the dev server is up.

## Stack and Next 16 rules

- Next.js 16.3 App Router, React 19.2, Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, no `tailwind.config`), TypeScript strict, `lucide-react` icons, Figtree via `next/font/google`.
- **This is not the Next.js in your training data.** Before using an unfamiliar API, read the bundled docs in `node_modules/next/dist/docs/` (see AGENTS.md).
- `params` and `searchParams` are **Promises**. Type pages with the global helpers: `PageProps<"/listing/[id]">`, `LayoutProps<"/dashboard">`. Repeated query params arrive as arrays; take the first (see `src/app/search/page.tsx`).
- `useSearchParams` in a statically rendered route needs a `<Suspense>` boundary or the build fails (see `SearchBox` in `components/shell/top-bar.tsx`). Prefer reading `searchParams` in the server page and passing props down.
- Server components cannot pass functions to client components. A `Menu` with `onSelect` handlers must live inside a client component.

## Architecture

```
src/
  app/                      routes (App Router)
    layout.tsx              the Spotify desktop shell: TopBar, LibrarySidebar, <main id="main">, ChatPanel, ChatBar, MobileNav, Toaster
    home-feed.tsx           home (client: merges local posts, library state, hover-tinted header)
    listing/[id]  s/[slug]  profile/[id]  listings/[category]  search  saved  library
    messages  dashboard/*  post  onboarding  verify
  components/
    shell/                  top-bar, history-buttons, library-sidebar (+ useLibraryRows), chat-bar (bottom bar: the chat
                            you're negotiating + phone bar), chat-panel (right view: item, messages, seller), mobile-nav, logo
    ui/                     button (class builders), cover (Cover/Avatar/ShopArt/SavedArt), menu, toaster,
                            trust-ring, verified-badge
    entity.tsx              EntityPage: color-matched header + sticky bar + action bar (album/artist/profile grammar)
    shelf.tsx  listing-card.tsx  shop-card.tsx  browse-tile.tsx  library-actions.tsx  ...
  lib/
    types.ts                domain types mirroring the planned Prisma schema
    mock-data.ts            read-only seed data + formatters (formatPrice, timeAgo, trustLabel)
    seller-store.ts         client data layer: local overlay over the seed (listings, products, shops, messages)
    library-store.ts        Saved & following: saved listings, followed shops, recently viewed
    toast-store.ts          one-at-a-time confirmation toasts
    chat-store.ts           chats about items + which one the bar/panel shows, panel open state
    image.ts                client-side photo downscale for uploads (stored as data URLs)
    search.ts               word-based matching + top-result logic
    placeholder.ts          deterministic cover color + glyph per record
```

### The data layer contract (important)

There is **no backend yet**. Prisma and Supabase are planned but not connected.

- `mock-data.ts` is the always-present seed. Never mutate its arrays.
- `seller-store.ts` and `library-store.ts` are `useSyncExternalStore` stores persisted to `localStorage`. Every mutation is an `async` function returning domain types, so swapping internals for `fetch()` later doesn't touch components.
- Editing a seed record **forks** it into the local overlay under the same id. Read merged data only through the `getMerged*` / `getAllMerged*` helpers, and filter public feeds with `isLive()`.
- The server snapshot is the empty overlay (seller store) or the seeded default (library store), so SSR output equals seed-only output and nothing flashes. Use `isHydrated(local)` before syncing form state or declaring a 404.
- Pages for entities that may exist only locally (`/listing/[id]`, `/s/[slug]`) render a client "lookup" component that resolves against the merged data.
- `currentUser` (Amara, `u1`) is the signed-in demo user. There is no auth.

## Design rules you must not break

Full system in `DESIGN.md`. The rules people get wrong:

1. **Tokens only.** Colors are role-named in `@theme` (`bg-canvas`, `bg-surface`, `text-subdued`, `bg-accent`, `bg-tint` …). Never hardcode a hex in a component. The base pane color is `canvas`, not `base` (`text-base` is a font size).
2. **Green means Sokoni.** `bg-accent` (#1ED760, black text) is for Sokoni platform actions (post, save, reply, continue) and live state only.
3. **White means WhatsApp.** A white pill, or an outline pill, carrying the WhatsApp glyph is the *only* WhatsApp treatment (`components/whatsapp-button.tsx`). Never style WhatsApp green, and never use a plain white pill for anything else.
4. **Buttons are pills** built with `buttonStyles(variant, size)`; icon buttons use `iconButtonStyles`; filters use `chipStyles` (selected = white). No square buttons, no shadows on buttons.
5. **Cards are borderless**: transparent at rest, `hover:bg-tint`. One stretched link per card (`after:absolute after:inset-0`); secondary controls sit above it with `relative z-10`. Never nest interactive elements inside a link.
6. **Entity pages use `EntityPage`** with the record's `seedColor(id)` as the header color. Don't hand-roll headers.
7. **Trust is visible wherever a buyer decides**: trust ring and verified rosette on cards, the seller card and "Buying safely" tips on listings, the trust panel on profiles.
8. **Icons come from lucide-react.** No Unicode glyphs (★ ✓ →) as icons.
9. **Prices use `.tabular`** (tabular numerals), formatted with `formatPrice`.
10. **No eyebrows/kickers** above headings. Category and verification go in the entity meta line.
13. **Say what it is.** Marketplace words, not music words: "Post an ad", "Sell", "Saved items", "Shops", "Chat". Cards are products (4:3, price first, bookmark save), shops are storefronts (square logo), never round "artist" portraits or play-style buttons.
11. **Layouts inside `<main>` use container queries** (`@3xl/main:`, `@4xl/main:` …), never `md:`/`lg:`/`xl:`. The chat panel narrows the pane, so the viewport is the wrong ruler. Viewport breakpoints are only for shell visibility (`lg:hidden`, mobile nav).
12. Base element styles live in `@layer base` and custom classes in `@layer components` in `globals.css`, so utilities can always override them. Don't add unlayered element rules.

## Content and honesty rules

- All people, shops, listings, reviews and chats are **fictional seed data**; the footer says so. Keep it that way.
- **Never invent commercial or factual claims**: no user counts, conversion stats, "3x more sales", plan prices or limits the product hasn't decided. Use a clearly marked placeholder and tell the user.
- Cover art is procedural (`Cover`) because there is no photo library. When real uploads arrive, render the image and keep `Cover` as the fallback.
- Sokoni takes no payments. Don't add checkout, card fields or payment claims unless the product decides to.

## Verifying UI changes

1. Run the dev server (desktop app: `preview_start` with `sokoni-dev`).
2. Check both shells: desktop (≥1024px, library sidebar, main pane scrolls internally) and phone (≤640px, window scroll, bottom tab bar). Horizontal overflow at 375px must be zero (`document.documentElement.scrollWidth === 375`).
3. Exercise the state you touched: saved/followed, local post appearing in Fresh listings and its category, mark-as-sold removing it from feeds, messages and the chat bar.
4. A hidden browser tab doesn't run IntersectionObserver, so the sticky entity bar can only be verified in a visible or headless browser.
5. `npx tsc --noEmit && npm run lint && npm run build` before calling anything done.

## Roadmap hooks (not built yet)

Real auth, Prisma + Postgres, server-side photo storage (photos are local data URLs today), DNS/SSL verification for custom domains (UI exists, capped at `PENDING`), plan billing, and server-side search. Each one should replace a store's internals, not its call sites.
