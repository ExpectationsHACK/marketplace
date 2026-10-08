"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownWideNarrow, Check } from "lucide-react";
import type { Category, Listing } from "@/lib/types";
import { categories, categoryMeta, getUserById } from "@/lib/mock-data";
import { getAllMergedListings, isLive, useSellerData } from "@/lib/seller-store";
import { buttonStyles, chipStyles } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ListingCard } from "@/components/listing-card";
import { pagePad } from "@/components/shelf";

type Sort = "newest" | "price-asc" | "price-desc" | "trust";

const SORTS: { id: Sort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "trust", label: "Most trusted seller" },
];

// Unpriced listings ("contact for price") sink to the end of price sorts.
function compare(sort: Sort) {
  return (a: Listing, b: Listing) => {
    if (sort === "newest") return a.createdAt < b.createdAt ? 1 : -1;
    if (sort === "trust") return (getUserById(b.sellerId)?.trustScore ?? 0) - (getUserById(a.sellerId)?.trustScore ?? 0);
    const pa = a.price ?? (sort === "price-asc" ? Infinity : -Infinity);
    const pb = b.price ?? (sort === "price-asc" ? Infinity : -Infinity);
    return sort === "price-asc" ? pa - pb : pb - pa;
  };
}

export function CategoryView({ category }: { category: Category }) {
  const meta = categoryMeta[category];
  const local = useSellerData();
  const [sort, setSort] = useState<Sort>("newest");
  const [city, setCity] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const inCategory = getAllMergedListings(local).filter((l) => isLive(l) && l.category === category);
  const cities = [...new Set(inCategory.map((l) => l.location.city))].sort();
  const items = inCategory
    .filter((l) => !city || l.location.city === city)
    .filter((l) => !verifiedOnly || getUserById(l.sellerId)?.verified)
    .sort(compare(sort));
  const filtered = city !== null || verifiedOnly;

  return (
    <div className="relative isolate">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[22rem]" style={{ backgroundColor: meta.color }}>
        <div className="h-full bg-gradient-to-b from-black/10 via-black/45 to-canvas" />
      </div>

      <header className={`${pagePad} pb-8 pt-16 lg:pt-24`}>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-none tracking-[-0.04em] text-fg">{meta.label}</h1>
        <p className="mt-4 text-fg/90">
          {meta.blurb} · <span className="tabular">{inCategory.length}</span> live {inCategory.length === 1 ? "listing" : "listings"}
        </p>
      </header>

      <div className={pagePad}>
        <nav aria-label="Other categories" className="mb-5 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/listings/${cat}`}
              aria-current={cat === category ? "page" : undefined}
              className={chipStyles(cat === category)}
            >
              {categoryMeta[cat].label}
            </Link>
          ))}
        </nav>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Filter listings" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={city === null} onClick={() => setCity(null)} className={chipStyles(city === null)}>
              All cities
            </button>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={city === c}
                onClick={() => setCity(city === c ? null : c)}
                className={chipStyles(city === c)}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={verifiedOnly}
              onClick={() => setVerifiedOnly((v) => !v)}
              className={chipStyles(verifiedOnly)}
            >
              <VerifiedBadge size={14} label={null} />
              Verified sellers
            </button>
          </div>
          <Menu
            label="Sort listings"
            buttonClassName="inline-flex h-8 items-center gap-2 rounded-full px-2 text-sm font-semibold text-subdued transition-colors hover:text-fg"
            trigger={
              <>
                {SORTS.find((s) => s.id === sort)?.label}
                <ArrowDownWideNarrow className="size-4" aria-hidden />
              </>
            }
            items={SORTS.map((s) => ({
              label: s.label,
              icon: s.id === sort ? Check : undefined,
              onSelect: () => setSort(s.id),
            }))}
          />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg bg-surface px-6 py-14 text-center">
            <p className="text-xl font-bold">
              {filtered ? "Nothing matches these filters" : `No ${meta.label.toLowerCase()} listings yet`}
            </p>
            <p className="mt-2 max-w-sm text-subdued">
              {filtered ? "Try another city, or include unverified sellers." : "Be the first — it takes about a minute."}
            </p>
            {filtered ? (
              <button
                type="button"
                onClick={() => {
                  setCity(null);
                  setVerifiedOnly(false);
                }}
                className={buttonStyles("outline", "sm", "mt-6")}
              >
                Clear filters
              </button>
            ) : (
              <Link href="/post?mode=classified" className={buttonStyles("primary", "sm", "mt-6")}>
                Post a listing
              </Link>
            )}
          </div>
        ) : (
          <div className="shelf-row shelf-wrap">
            {items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
