import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice, getUserById } from "@/lib/mock-data";
import { Cover } from "@/components/ui/cover";
import { TrustRing } from "@/components/ui/trust-ring";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { SaveButton } from "@/components/library-actions";

const statusLabel: Partial<Record<Listing["status"], string>> = {
  SOLD: "Sold",
  EXPIRED: "Expired",
  REMOVED: "Removed",
};

/**
 * A marketplace card on Spotify's card chassis (borderless, white/7% on
 * hover). It reads as an item for sale: 4:3 product framing, price first,
 * a bookmark to save it, and
 * the seller's trust and location. One stretched link; the save control
 * sits above it so no interactive elements nest.
 */
export function ListingCard({ listing }: { listing: Listing }) {
  const seller = getUserById(listing.sellerId);
  const status = statusLabel[listing.status];
  return (
    <article className="group relative rounded-card p-3 transition-colors duration-200 hover:bg-tint">
      <div className="relative mb-3">
        <Cover
          seed={listing.id}
          image={listing.images[0]}
          title={listing.title}
          category={listing.category}
          className="aspect-[4/3] w-full"
          rounded="rounded-md"
          decorative
        />
        {(listing.featured || status) && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-bold text-fg backdrop-blur-sm">
            {status ?? "Featured"}
          </span>
        )}
        <div className="absolute right-2 top-2">
          <SaveButton listingId={listing.id} title={listing.title} variant="corner" />
        </div>
      </div>
      <p className="tabular text-lg font-bold leading-tight text-fg">{formatPrice(listing.price, listing.currency)}</p>
      <h3 className="mt-0.5 line-clamp-2 leading-snug text-fg">
        <Link
          href={`/listing/${listing.id}`}
          className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-fg"
        >
          {listing.title}
        </Link>
      </h3>
      <p className="mt-1.5 flex min-w-0 items-center gap-1 text-sm text-subdued">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{listing.location.city}</span>
      </p>
      <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-subdued">
        {seller && <TrustRing score={seller.trustScore} verified={seller.verified} size={14} stroke={2.5} />}
        <span className="truncate">{seller ? seller.name : "Seller"}</span>
        {seller?.verified && <VerifiedBadge size={14} label="Verified seller" />}
      </p>
    </article>
  );
}
