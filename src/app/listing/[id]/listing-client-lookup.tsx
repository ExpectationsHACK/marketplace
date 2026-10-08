"use client";

import { getAverageRating, getReviewsForUser, getUserById } from "@/lib/mock-data";
import { getAllMergedListings, getMergedListingById, getMergedStorefrontByOwnerId, isHydrated, isLive, useSellerData } from "@/lib/seller-store";
import { ListingView } from "@/components/listing-view";
import { NotFoundState } from "@/components/not-found-state";

// Resolves a listing against seed data merged with this browser's local
// overlay. Seed listings resolve identically on the server snapshot, so they
// render with no flash; locally-posted ones appear once hydrated. Once a
// real backend exists this collapses into a plain server component.
export function ListingLookup({ id }: { id: string }) {
  const local = useSellerData();
  const listing = getMergedListingById(id, local);

  if (!listing) {
    if (!isHydrated(local)) return <div className="min-h-[60vh]" aria-busy />;
    return (
      <NotFoundState
        title="No listing at this link"
        body="It may have been posted in a different browser — listings created in this demo only exist on the device that made them."
      />
    );
  }

  const seller = getUserById(listing.sellerId);
  const storefront = seller ? getMergedStorefrontByOwnerId(seller.id, local) : undefined;
  const all = getAllMergedListings(local).filter((l) => isLive(l) && l.id !== listing.id);

  return (
    <ListingView
      listing={listing}
      seller={seller}
      storefront={storefront}
      rating={seller ? getAverageRating(seller.id) : 0}
      reviewCount={seller ? getReviewsForUser(seller.id).length : 0}
      moreFromSeller={all.filter((l) => l.sellerId === listing.sellerId).slice(0, 8)}
      related={all.filter((l) => l.category === listing.category && l.sellerId !== listing.sellerId).slice(0, 8)}
    />
  );
}
