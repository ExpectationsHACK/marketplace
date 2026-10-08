"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Plus, Search, ShieldCheck, Store } from "lucide-react";
import { categories, categoryMeta, currentUser, getUserById } from "@/lib/mock-data";
import {
  getAllMergedListings,
  getAllMergedStorefronts,
  getMergedStorefrontByOwnerId,
  isLive,
  useSellerData,
} from "@/lib/seller-store";
import { useLibrary } from "@/lib/library-store";
import { Cover } from "@/components/ui/cover";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { WhatsAppGlyph } from "@/components/whatsapp-button";
import { buttonStyles } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { ShopCard } from "@/components/shop-card";
import { Shelf } from "@/components/shelf";

interface Tile {
  key: string;
  href: string;
  title: string;
  subtitle: string;
  color: string;
  art: ReactNode;
}

// Deep green wash: reads as "market", and sits behind every category color.
const DEFAULT_TINT = "#0f5132";

export function HomeFeed() {
  const local = useSellerData();
  const library = useLibrary();
  const [hoverTint, setHoverTint] = useState<string | null>(null);

  const listings = getAllMergedListings(local).filter(isLive);
  const shops = getAllMergedStorefronts(local);
  const myShop = getMergedStorefrontByOwnerId(currentUser.id, local);
  const homeCity = (myShop?.city ?? "Lagos").split(",")[0];

  // --- Category tiles: the fastest way in, with live counts -------------------
  const countFor = (cat: string) => listings.filter((l) => l.category === cat).length;
  const tiles: Tile[] = categories.map((cat) => {
    const meta = categoryMeta[cat];
    return {
      key: cat,
      href: `/listings/${cat}`,
      title: meta.label,
      subtitle: `${countFor(cat)} ${countFor(cat) === 1 ? "listing" : "listings"}`,
      color: meta.color,
      art: <Cover seed={cat} title={meta.label} category={cat} color={meta.color} className="size-full" rounded="" decorative />,
    };
  });
  const tint = hoverTint ?? DEFAULT_TINT;

  // --- Shelves --------------------------------------------------------------
  // Featured picks first, then the rest by seller trust — matches the shelf's promise.
  const trustOf = (sellerId: string) => getUserById(sellerId)?.trustScore ?? 0;
  const featured = [...listings]
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || trustOf(b.sellerId) - trustOf(a.sellerId))
    .slice(0, 8);
  const fresh = [...listings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const nearby = listings.filter((l) => l.location.city === homeCity);
  const hire = listings.filter((l) => l.category === "SERVICES" || l.category === "GIGS");
  const recentlyViewed = library.recent
    .map((entry) =>
      entry.kind === "listing"
        ? { kind: "listing" as const, listing: getAllMergedListings(local).find((l) => l.id === entry.id) }
        : { kind: "shop" as const, shop: shops.find((s) => s.id === entry.id) },
    )
    .filter((e) => (e.kind === "listing" ? e.listing : e.shop));
  const followed = library.following.map((f) => shops.find((s) => s.id === f.id)).filter((s) => s !== undefined);
  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[20.75rem] transition-[background-color] duration-700 ease-out-expo"
        style={{ backgroundColor: tint }}
      >
        <div className="h-full bg-gradient-to-b from-black/55 to-canvas" />
      </div>

      <div className="px-4 pt-6 sm:px-6 sm:pt-10">
        <h1 className="max-w-3xl text-[clamp(2rem,5cqi,3.5rem)] font-black leading-[1.05] tracking-[-0.035em] text-fg [text-wrap:balance]">
          Buy and sell with people you can trust.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-fg/80 sm:text-lg">
          Classified ads and WhatsApp shops across Nigeria, Ghana and Kenya. Find it, check the seller&apos;s trust score, and
          chat on WhatsApp or right here.
        </p>

        <Link
          href="/search"
          className="mt-5 flex h-12 items-center gap-3 rounded-full bg-fg px-4 text-[#555] lg:hidden"
        >
          <Search className="size-5 text-black" aria-hidden />
          Search phones, rentals, jobs, services…
        </Link>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-fg">
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" aria-hidden />
            A trust score on every seller
          </li>
          <li className="flex items-center gap-2">
            <VerifiedBadge size={18} label={null} />
            ID-verified sellers
          </li>
          <li className="flex items-center gap-2">
            <WhatsAppGlyph className="size-5" />
            Order straight on WhatsApp
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/post" className={buttonStyles("primary", "md")}>
            <Plus className="-ml-1 size-5" strokeWidth={2.5} aria-hidden />
            Post an ad
          </Link>
          <Link href={myShop ? `/s/${myShop.slug}` : "/onboarding"} className={buttonStyles("outline", "md")}>
            <Store className="-ml-1 size-5" aria-hidden />
            {myShop ? "Your shop" : "Open a shop"}
          </Link>
        </div>

        <h2 className="mt-10 text-2xl font-bold tracking-[-0.02em]">Shop by category</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 @2xl/main:grid-cols-3" onMouseLeave={() => setHoverTint(null)}>
          {tiles.map((tile) => (
            <li key={tile.key}>
              <Link
                href={tile.href}
                onMouseEnter={() => setHoverTint(tile.color)}
                onFocus={() => setHoverTint(tile.color)}
                className="group flex h-16 items-center gap-3 overflow-hidden rounded-md bg-tint pr-3 transition-colors duration-200 hover:bg-tint-hi"
              >
                <span className="size-16 shrink-0 overflow-hidden">{tile.art}</span>
                <span className="min-w-0">
                  <span className="block truncate font-bold leading-tight text-fg">{tile.title}</span>
                  <span className="tabular block text-sm text-subdued">{tile.subtitle}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-9">
          {recentlyViewed.length > 0 && (
            <div data-kind="mixed">
              <Shelf title="Recently viewed">
                {recentlyViewed.map((entry) =>
                  entry.kind === "listing" ? (
                    <ListingCard key={`l-${entry.listing!.id}`} listing={entry.listing!} />
                  ) : (
                    <ShopCard key={`s-${entry.shop!.id}`} storefront={entry.shop!} />
                  ),
                )}
              </Shelf>
            </div>
          )}

          {featured.length > 0 && (
            <Shelf title="Featured deals" subtitle="Picked from sellers with the highest trust scores" kind="listings">
              {featured.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </Shelf>
          )}

          <Shelf title="Shops on Sokoni" href="/search?type=shops" kind="shops">
            {shops.map((s) => (
              <ShopCard key={s.id} storefront={s} />
            ))}
          </Shelf>

          <Shelf title="Just listed" kind="listings">
            {fresh.slice(0, 10).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </Shelf>

          {nearby.length > 0 && (
            <Shelf title={`Near you in ${homeCity}`} href={`/search?q=${encodeURIComponent(homeCity)}`} kind="listings">
              {nearby.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </Shelf>
          )}

          {followed.length > 0 && (
            <Shelf title="Shops you follow" kind="shops">
              {followed.map((s) => (
                <ShopCard key={s.id} storefront={s} />
              ))}
            </Shelf>
          )}

          {hire.length > 0 && (
            <Shelf title="Services & gigs" href="/listings/SERVICES" kind="listings">
              {hire.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </Shelf>
          )}

          {!myShop && (
            <section className="mb-8 flex flex-col items-start gap-5 rounded-lg bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Store className="size-10 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                <div>
                  <h2 className="text-xl font-bold text-fg">Selling often? Get a permanent shop.</h2>
                  <p className="mt-1 max-w-prose text-subdued">
                    Your own link, a product catalog, and orders on WhatsApp — using the identity and trust score you already
                    have.
                  </p>
                </div>
              </div>
              <Link href="/onboarding" className={buttonStyles("primary", "md")}>
                Open a shop
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
