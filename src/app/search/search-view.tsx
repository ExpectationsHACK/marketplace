"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { categories, formatPrice, getUserById, users } from "@/lib/mock-data";
import { getAllMergedListings, getAllMergedStorefronts, isLive, useSellerData } from "@/lib/seller-store";
import { matchListing, matchShop, matchUser, pickTopResult, tokenize, type TopResult } from "@/lib/search";
import { Cover, ShopArt } from "@/components/ui/cover";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles, chipStyles, iconButtonStyles } from "@/components/ui/button";
import { BrowseTile } from "@/components/browse-tile";
import { ListingCard } from "@/components/listing-card";
import { ShopCard } from "@/components/shop-card";
import { Shelf, pagePad } from "@/components/shelf";
import { FollowButton, SaveButton } from "@/components/library-actions";
import type { User } from "@/lib/types";

export type SearchType = "all" | "listings" | "shops" | "sellers";

const TYPE_LABEL: Record<SearchType, string> = { all: "All", listings: "Listings", shops: "Shops", sellers: "Sellers" };

function hrefFor(q: string, type: SearchType) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type !== "all") params.set("type", type);
  const s = params.toString();
  return s ? `/search?${s}` : "/search";
}

export function SearchView({ q, type }: { q: string; type: SearchType }) {
  const local = useSellerData();
  const tokens = tokenize(q);
  const allListings = getAllMergedListings(local).filter(isLive);
  const allShops = getAllMergedStorefronts(local);
  const sellerIds = new Set(allListings.map((l) => l.sellerId));
  const allSellers = users.filter((u) => sellerIds.has(u.id) || allShops.some((s) => s.ownerId === u.id));

  const listings = tokens.length ? allListings.filter((l) => matchListing(l, tokens)) : allListings;
  const shops = tokens.length ? allShops.filter((s) => matchShop(s, tokens)) : allShops;
  const sellers = tokens.length ? allSellers.filter((u) => matchUser(u, tokens)) : allSellers;
  const browsing = !q && type === "all";
  const nothing = q && listings.length + shops.length + sellers.length === 0;

  return (
    <div className={`${pagePad} pb-6 pt-4 sm:pt-6`}>
      <MobileSearchField q={q} type={type} />

      {browsing ? (
        <section aria-labelledby="browse-all">
          <h1 id="browse-all" className="mb-4 text-2xl font-bold tracking-[-0.02em]">
            Browse all
          </h1>
          <div className="grid grid-cols-2 gap-4 @3xl/main:grid-cols-3 @6xl/main:grid-cols-4">
            {categories.map((cat) => (
              <BrowseTile key={cat} category={cat} count={allListings.filter((l) => l.category === cat).length} />
            ))}
          </div>
          <div className="mt-10">
            <Shelf title="Shops" href="/search?type=shops" kind="shops">
              {allShops.map((s) => (
                <ShopCard key={s.id} storefront={s} />
              ))}
            </Shelf>
          </div>
        </section>
      ) : (
        <>
          <h1 className="sr-only">{q ? `Search results for ${q}` : `All ${TYPE_LABEL[type].toLowerCase()}`}</h1>
          <nav aria-label="Result type" className="mb-6 flex gap-2 overflow-x-auto [scrollbar-width:none]">
            {(Object.keys(TYPE_LABEL) as SearchType[]).map((t) => (
              <Link
                key={t}
                href={hrefFor(q, t)}
                replace
                scroll={false}
                aria-current={t === type ? "page" : undefined}
                className={chipStyles(t === type)}
              >
                {TYPE_LABEL[t]}
              </Link>
            ))}
          </nav>

          {nothing ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-2xl font-bold">No results found for “{q}”</p>
              <p className="mt-3 max-w-md text-subdued">
                Check the spelling, or try fewer or different words. Can&apos;t find it? Post a wanted ad and let sellers come to
                you.
              </p>
              <Link href="/post?mode=classified" className={buttonStyles("primary", "md", "mt-8")}>
                Post a wanted ad
              </Link>
            </div>
          ) : type === "all" ? (
            <AllResults q={q} listings={listings} shops={shops} sellers={sellers} />
          ) : (
            <section>
              {type === "listings" &&
                (listings.length ? (
                  <div className="shelf-row shelf-wrap">
                    {listings.map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                ) : (
                  <EmptyType label="listings" q={q} />
                ))}
              {type === "shops" &&
                (shops.length ? (
                  <div className="shelf-row shelf-wrap">
                    {shops.map((s) => (
                      <ShopCard key={s.id} storefront={s} />
                    ))}
                  </div>
                ) : (
                  <EmptyType label="shops" q={q} />
                ))}
              {type === "sellers" &&
                (sellers.length ? (
                  <div className="shelf-row shelf-wrap">
                    {sellers.map((u) => (
                      <PersonCard key={u.id} user={u} />
                    ))}
                  </div>
                ) : (
                  <EmptyType label="sellers" q={q} />
                ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function EmptyType({ label, q }: { label: string; q: string }) {
  return <p className="py-10 text-subdued">No {label} match “{q}”. Try All to see other results.</p>;
}

function AllResults({
  q,
  listings,
  shops,
  sellers,
}: {
  q: string;
  listings: ReturnType<typeof getAllMergedListings>;
  shops: ReturnType<typeof getAllMergedStorefronts>;
  sellers: User[];
}) {
  const top = pickTopResult(q, listings, shops, sellers);
  return (
    <>
      <div className="mb-10 grid grid-cols-1 gap-6 @4xl/main:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {top && (
          <section aria-labelledby="top-result">
            <h2 id="top-result" className="mb-3 text-2xl font-bold tracking-[-0.02em]">
              Top result
            </h2>
            <TopResultCard result={top} />
          </section>
        )}
        {listings.length > 0 && (
          <section aria-labelledby="listing-results" className="min-w-0">
            <h2 id="listing-results" className="mb-3 text-2xl font-bold tracking-[-0.02em]">
              <Link href={hrefFor(q, "listings")} className="hover:underline">
                Listings
              </Link>
            </h2>
            <ul>
              {listings.slice(0, 4).map((l) => {
                const seller = getUserById(l.sellerId);
                return (
                  <li key={l.id}>
                    <Link
                      href={`/listing/${l.id}`}
                      className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[4px] p-2 transition-colors hover:bg-tint"
                    >
                      <Cover seed={l.id} image={l.images[0]} title={l.title} category={l.category} className="size-10" decorative />
                      <span className="min-w-0">
                        <span className="block truncate text-fg">{l.title}</span>
                        <span className="flex items-center gap-1 truncate text-sm text-subdued">
                          {seller?.verified && <VerifiedBadge size={13} label="Verified seller" />}
                          {seller?.name ?? "Seller"} · {l.location.city}
                        </span>
                      </span>
                      <span className="tabular text-sm text-subdued">{formatPrice(l.price, l.currency)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {shops.length > 0 && (
        <Shelf title="Shops" href={hrefFor(q, "shops")}>
          {shops.map((s) => (
            <ShopCard key={s.id} storefront={s} />
          ))}
        </Shelf>
      )}
      {sellers.length > 0 && (
        <Shelf title="Sellers" href={hrefFor(q, "sellers")}>
          {sellers.map((u) => (
            <PersonCard key={u.id} user={u} />
          ))}
        </Shelf>
      )}
      {listings.length > 4 && (
        <Shelf title="More listings" href={hrefFor(q, "listings")}>
          {listings.slice(4).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </Shelf>
      )}
    </>
  );
}

function TopResultCard({ result }: { result: TopResult }) {
  const base = "group relative block rounded-lg bg-surface p-5 transition-colors duration-200 hover:bg-surface-hi";
  const pill = "mt-2 inline-flex rounded-full bg-canvas px-3 py-1 text-sm font-bold text-fg";
  const stretched =
    "after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-fg";

  if (result.kind === "listing") {
    const { listing } = result;
    const seller = getUserById(listing.sellerId);
    return (
      <article className={base}>
        <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-24 shadow-[0_8px_24px_rgb(0_0_0/0.5)]" decorative />
        <h3 className="mt-5 line-clamp-2 text-[2rem] font-bold leading-tight tracking-[-0.03em]">
          <Link href={`/listing/${listing.id}`} className={stretched}>
            {listing.title}
          </Link>
        </h3>
        <p className="tabular mt-1 text-subdued">
          {formatPrice(listing.price, listing.currency)} · {seller?.name}
        </p>
        <span className={pill}>Listing</span>
        <div className="absolute bottom-5 right-5">
          <SaveButton listingId={listing.id} title={listing.title} variant="corner" />
        </div>
      </article>
    );
  }
  if (result.kind === "shop") {
    const { shop } = result;
    return (
      <article className={base}>
        <div className="size-24">
          <ShopArt seed={shop.id} name={shop.name} square className="shadow-[0_8px_24px_rgb(0_0_0/0.5)]" />
        </div>
        <h3 className="mt-5 flex items-center gap-2 text-[2rem] font-bold leading-tight tracking-[-0.03em]">
          <Link href={`/s/${shop.slug}`} className={`line-clamp-2 ${stretched}`}>
            {shop.name}
          </Link>
          {shop.isVerified && <VerifiedBadge size={24} label="Verified shop" />}
        </h3>
        <p className="mt-1 text-subdued">{shop.city}</p>
        <span className={pill}>Shop</span>
        <div className="absolute bottom-5 right-5">
          <FollowButton storefrontId={shop.id} name={shop.name} />
        </div>
      </article>
    );
  }
  const { user } = result;
  return (
    <article className={base}>
      <div className="size-24">
        <ShopArt seed={user.id} name={user.name} className="shadow-[0_8px_24px_rgb(0_0_0/0.5)]" />
      </div>
      <h3 className="mt-5 flex items-center gap-2 text-[2rem] font-bold leading-tight tracking-[-0.03em]">
        <Link href={`/profile/${user.id}`} className={stretched}>
          {user.name}
        </Link>
        {user.verified && <VerifiedBadge size={24} label="ID verified" />}
      </h3>
      <p className="mt-1 text-subdued">Trust score {user.trustScore}</p>
      <span className={pill}>Seller</span>
    </article>
  );
}

function PersonCard({ user }: { user: User }) {
  return (
    <article className="group relative rounded-card p-3 transition-colors duration-200 hover:bg-tint">
      <ShopArt seed={user.id} name={user.name} className="mb-3 shadow-[0_8px_24px_rgb(0_0_0/0.5)]" />
      <h3 className="flex items-center gap-1.5 font-semibold">
        <Link
          href={`/profile/${user.id}`}
          className="truncate after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-fg"
        >
          {user.name}
        </Link>
        {user.verified && <VerifiedBadge size={16} label="ID verified" />}
      </h3>
      <p className="mt-1 text-sm text-subdued">Seller · Trust {user.trustScore}</p>
    </article>
  );
}

/** The top-bar search is desktop-only; on phones the search page carries its own field. */
function MobileSearchField({ q, type }: { q: string; type: SearchType }) {
  const router = useRouter();
  const [value, setValue] = useState(q);
  const [synced, setSynced] = useState(q);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  if (q !== synced) {
    setSynced(q);
    setValue(q);
  }
  function go(next: string, immediate = false) {
    clearTimeout(timer.current);
    const nav = () => router.replace(hrefFor(next.trim(), type), { scroll: false });
    if (immediate) nav();
    else timer.current = setTimeout(nav, 250);
  }
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(value, true);
      }}
      className="relative mb-6 lg:hidden"
    >
      <p aria-hidden className="mb-4 text-2xl font-bold">
        Search
      </p>
      <label htmlFor="mobile-search" className="sr-only">
        Search listings, shops and sellers
      </label>
      <Search className="pointer-events-none absolute bottom-3 left-3 size-6 text-black" aria-hidden />
      <input
        id="mobile-search"
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          go(e.target.value);
        }}
        placeholder="Search phones, rentals, jobs, services…"
        className="h-12 w-full rounded-[4px] bg-fg pl-12 pr-12 text-base font-semibold text-black placeholder:font-normal placeholder:text-[#555] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            go("", true);
          }}
          className={iconButtonStyles("md", "absolute bottom-0 right-0 text-black hover:text-black")}
        >
          <X className="size-5" aria-hidden />
        </button>
      )}
    </form>
  );
}
