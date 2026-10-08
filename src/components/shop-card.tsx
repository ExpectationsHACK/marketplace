import Link from "next/link";
import { Store } from "lucide-react";
import type { Storefront } from "@/lib/types";
import { initials, seedColor } from "@/lib/placeholder";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { FollowButton } from "@/components/library-actions";

/**
 * A storefront card: a shopfront band in the shop's color with its square
 * logo tile, then name, what it sells, where, and a Follow button. Square
 * logo, never a round portrait: this is a business, not a person.
 */
export function ShopCard({ storefront }: { storefront: Storefront }) {
  const color = seedColor(storefront.id);
  return (
    <article className="group relative rounded-card p-3 transition-colors duration-200 hover:bg-tint">
      <div
        aria-hidden
        className="relative mb-3 flex aspect-[4/3] w-full items-end overflow-hidden rounded-md p-3"
        style={{ background: `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 55%, #000))` }}
      >
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-fg">
          <Store className="size-3.5" />
          Shop
        </span>
        <span
          className="flex size-14 items-center justify-center rounded-lg text-xl font-extrabold tracking-[-0.03em] text-white shadow-[0_4px_12px_rgb(0_0_0/0.35)] ring-2 ring-white/25"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 70%, #000)` }}
        >
          {initials(storefront.name)}
        </span>
      </div>
      <h3 className="flex items-center gap-1.5 font-semibold text-fg">
        <Link
          href={`/s/${storefront.slug}`}
          className="truncate after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-fg"
        >
          {storefront.name}
        </Link>
        {storefront.isVerified && <VerifiedBadge size={16} label="Verified shop" />}
      </h3>
      <p className="mt-0.5 truncate text-sm text-subdued">
        {storefront.category} · {storefront.city.split(",")[0]}
      </p>
      <div className="relative z-10 mt-3">
        <FollowButton storefrontId={storefront.id} name={storefront.name} />
      </div>
    </article>
  );
}
