"use client";

import { getUserById } from "@/lib/mock-data";
import {
  getMergedListingsBySeller,
  getMergedProductsByStorefront,
  getMergedStorefrontBySlug,
  isHydrated,
  isLive,
  useSellerData,
} from "@/lib/seller-store";
import { StorefrontView } from "@/components/storefront-view";
import { NotFoundState } from "@/components/not-found-state";

// Seed storefronts resolve identically from the server snapshot, so they
// paint with no flash; a seller's local edits and locally-created shops
// appear once hydrated.
export function StorefrontClientLookup({ slug }: { slug: string }) {
  const local = useSellerData();
  const storefront = getMergedStorefrontBySlug(slug, local);

  if (!storefront) {
    if (!isHydrated(local)) return <div className="min-h-[60vh]" aria-busy />;
    return (
      <NotFoundState
        title="No shop at this link"
        body="It may have been created in a different browser — shops made in this demo only exist on the device that created them."
      />
    );
  }

  const owner = getUserById(storefront.ownerId);
  return (
    <StorefrontView
      storefront={storefront}
      owner={owner}
      catalog={getMergedProductsByStorefront(storefront.id, local)}
      oneOffListings={owner ? getMergedListingsBySeller(owner.id, local).filter(isLive) : []}
    />
  );
}
