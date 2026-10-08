# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: small business sellers running an always-on storefront (e.g. a fabric shop, a sneaker resale business, a skincare brand) who need a branded catalog page and use WhatsApp as their actual sales channel. Their job: get discovered, show a professional catalog, and convert chats into paid, trusted sales without needing a developer or a WhatsApp Business API integration.

Secondary: casual one-off sellers and buyers using Craigslist-style classifieds (for sale, housing, jobs, services, gigs, community). A casual seller who posts repeatedly is the intended upgrade path into a storefront owner — this is the product's core growth loop, so the two personas share one identity/account, not two separate products.

## Product Purpose

Sokoni (working name) unifies two things African sellers currently do on separate, worse tools: posting one-off classifieds (currently Craigslist/Jiji-style, low trust, no accountability) and running a branded shop via WhatsApp (currently ad hoc, no discoverability layer). It exists so a seller has one identity that covers both a permanent storefront and occasional listings, and so buyers get a trust layer (verification + trust score + reviews) neither existing tool provides.

Success = sellers convert repeat classifieds activity into a storefront (retention/upgrade loop), and buyers find sellers they can trust and close the deal over chat.

## Positioning

Existing classifieds apps (Craigslist, Jiji, OfferUp) have no persistent seller identity, no trust signal, and no protected payment — buyers negotiate blind and sellers churn after one sale. Existing storefront tools (Soko-style WhatsApp shop builders) have no discovery layer beyond the seller's own following and no way to also post one-off items.

Sokoni's mechanism a competitor can't casually copy: one seller identity carries both a always-on storefront (Soko layer) and one-off classifieds (Craigslist layer), with a shared trust score and verification attached to the person, not the listing. WhatsApp remains the actual conversation/checkout channel (deep-link `wa.me`, not the paid WhatsApp Business API) to keep it free and instant to adopt.

## Operating Context

- Sellers manage their storefront and listings from a seller dashboard (storefront editor, catalog, classifieds, orders, messages).
- Buyers discover sellers via a mixed home feed, category browse, or search across both listings and storefronts.
- Deals close in conversation: a WhatsApp chat (deep link) or Sokoni's in-app messages. **Escrow was removed on 2026-10-05 at the user's request**; Sokoni takes no payments.
- New sellers onboard a storefront through a short wizard (business info → WhatsApp number → bio/branding) with no coding and no WhatsApp Business API setup.
- Verification is a separate, optional flow (phone → ID → selfie) that raises trust score and unlocks a verified badge.

## Capabilities and Constraints

- Confirmed functionality: classifieds CRUD across 6 categories, storefront + product catalog CRUD, WhatsApp deep-link checkout, reviews, trust score + verification badge, in-app messaging, search across listings and storefronts.
- Added in the 2026-10-04 redesign (all client-side, same swappable store contract): **Your Library** (save listings, follow shops, recently viewed, a "Saved" collection page, collapsible library sidebar); listing lifecycle in the seller hub (mark sold, renew, take down, relist); product price and stock editing; working in-app messaging with deep links from listings and orders; category sort (newest, price, most trusted seller) plus city and verified-seller filters; word-based search across listings, shops and sellers with a top result; currency choice when posting (NGN, GHS, KES, UGX); a "Needs your attention" task list in the seller hub; share/copy-link and report actions.
- Current technical state: frontend-only (Next.js 16 / React 19 / Tailwind v4), backed by a typed mock-data layer shaped to match a planned Prisma schema (User, Storefront, Product, Listing, Transaction, Review, Conversation/Message). No live database or auth connected yet — Prisma/Supabase are pending the user's own authorization outside this session.
- **Merchant flow is now real, not a mockup** (2026-09-08): onboarding actually creates a storefront, the dashboard editor actually saves edits, `/post` actually creates listings/products — all persisted client-side via `src/lib/seller-store.ts` (localStorage, `useSyncExternalStore`), designed so its async CRUD functions can be swapped for real `fetch()` calls against a real backend later without touching calling components. Public pages (`/s/[slug]`, `/listing/[id]`) resolve against this local overlay so a seller's own edits/additions show on their live page, with the seed data as a zero-flash fallback before hydration. Custom domains are designed for (a `customDomain`/`domainStatus` field, dashboard UI) but intentionally capped at `PENDING` — real DNS/SSL verification needs the backend the user said they'd scaffold a folder for later. Known limitation: locally-created content only exists in the browser that created it (no server, nothing shared across devices/users). Since the 2026-10-04 redesign it does surface everywhere in that browser: home shelves, category pages, search, Your Library, and the seller hub.
- WhatsApp integration is `wa.me` deep-linking only, not the paid WhatsApp Business API — this is a deliberate cost/scalability decision, not a gap.
- No specific device/bandwidth constraint confirmed — designed as a standard modern web app assuming decent connectivity, not optimized for low-end/offline conditions.

## Brand Commitments

"Sokoni" (name) is still an explicitly **placeholder** identity — open to changing later.

The visual system is a committed **Spotify web-player** interpretation (user-chosen 2026-10-04, replacing the 2026-09-08 token swap): a black frame holding rounded #121212 panes, a persistent "Your Library" sidebar, a top bar with live search, card shelves, entity pages whose headers take the record's own color, and a mobile bottom tab bar. Spotify green (#1ED760) marks Sokoni platform actions and live state. **WhatsApp is always a white or outlined pill with the WhatsApp glyph**, never Sokoni green. Since 2026-10-05 the surface speaks marketplace, not music: "Post an ad", "Sell", "Saved items", product cards (4:3, price first, bookmark save), storefront cards with square logos, and the bottom bar / right panel show the chat you're negotiating. Typeface: Figtree (closest free relative of Spotify's Circular / Spotify Mix). Signature elements kept: the Trust Ring (now also the logo mark) and the blue verified rosette. Full system in DESIGN.md.

## Evidence on Hand

- No real product photography, logos, or brand assets exist. All storefront/listing imagery in the current build is procedurally generated placeholder art (deterministic gradient + icon per item), not real photos — future design work should not assume real imagery is available unless the user supplies it.
- No real user testimonials, reviews, or case studies exist; all users, storefronts, listings, reviews, and transactions currently in the app are seeded example data for demonstration, not real records.
- Reference architecture (Prisma schema, module breakdown, monorepo layout) was supplied by the user in the original brief and should be treated as authoritative intent for future backend work.

## Product Principles

1. One identity, two seller modes — never design the storefront and classifieds experiences as if they belong to different products; the upgrade path between them is the growth loop.
2. Trust is the differentiator, not a feature — verification and trust score should be visually present wherever a buyer is deciding whether to act (listing cards, storefronts, listing pages), not buried in a profile page.
3. WhatsApp is the checkout, not an afterthought — every purchasable surface (listing, product) offers a direct WhatsApp path, with in-app chat beside it.
4. Low-friction seller onboarding — no seller-facing step should require code, an API key, or a WhatsApp Business API application.
5. Mock data today, real backend tomorrow — until Prisma/Supabase are authorized, all data work should stay isolated behind the typed mock-data layer so real integration is additive, not a rewrite.
