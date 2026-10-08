"use client";

import Link from "next/link";
import { CircleCheck, Ellipsis, Eye, Plus, RotateCcw, Tag, Trash2 } from "lucide-react";
import type { Listing } from "@/lib/types";
import { categoryMeta, currentUser, formatPrice, timeAgo } from "@/lib/mock-data";
import { getMergedListingsBySeller, renewListing, updateListing, useSellerData } from "@/lib/seller-store";
import { toast } from "@/lib/toast-store";
import { Cover } from "@/components/ui/cover";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { Menu, type MenuItem } from "@/components/ui/menu";

const statusStyle: Record<Listing["status"], { label: string; dot: string }> = {
  ACTIVE: { label: "Live", dot: "bg-accent" },
  SOLD: { label: "Sold", dot: "bg-fg" },
  EXPIRED: { label: "Expired", dot: "bg-warning" },
  REMOVED: { label: "Removed", dot: "bg-faint" },
};

function actionsFor(listing: Listing): MenuItem[] {
  const items: MenuItem[] = [{ label: "View listing", icon: Eye, href: `/listing/${listing.id}` }];
  if (listing.status === "ACTIVE") {
    items.push({
      label: "Mark as sold",
      icon: Tag,
      onSelect: async () => {
        await updateListing(listing.id, { status: "SOLD" });
        toast("Marked as sold");
      },
    });
  } else {
    items.push({
      label: listing.status === "SOLD" ? "Relist" : "Renew for 30 days",
      icon: RotateCcw,
      onSelect: async () => {
        await renewListing(listing.id);
        toast("Listing is live again");
      },
    });
  }
  if (listing.status === "ACTIVE") {
    items.push({
      label: "Renew for 30 days",
      icon: CircleCheck,
      onSelect: async () => {
        await renewListing(listing.id);
        toast("Renewed — it's back at the top of Fresh listings");
      },
    });
  }
  if (listing.status !== "REMOVED") {
    items.push({
      label: "Take down",
      icon: Trash2,
      danger: true,
      divider: true,
      onSelect: async () => {
        await updateListing(listing.id, { status: "REMOVED" });
        toast("Listing taken down");
      },
    });
  }
  return items;
}

export function ListingsView() {
  const local = useSellerData();
  const listings = getMergedListingsBySeller(currentUser.id, local);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-[-0.02em]">
          Your listings <span className="tabular text-subdued">{listings.length}</span>
        </h2>
        <Link href="/post?mode=classified" className={buttonStyles("primary", "sm")}>
          <Plus className="-ml-1 size-4" strokeWidth={3} aria-hidden />
          Post a listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg bg-surface px-6 py-14 text-center">
          <p className="text-xl font-bold">You haven&apos;t posted anything yet</p>
          <p className="mt-1 text-subdued">One-off items, rentals, jobs, services — posting is free.</p>
          <Link href="/post?mode=classified" className={buttonStyles("primary", "sm", "mt-6")}>
            Post your first listing
          </Link>
        </div>
      ) : (
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">Your listings</caption>
          <thead>
            <tr className="border-b border-line text-sm text-subdued">
              <th scope="col" className="w-8 pb-2 text-right font-normal">
                #
              </th>
              <th scope="col" className="px-4 pb-2 font-normal">
                Listing
              </th>
              <th scope="col" className="hidden w-[16%] px-4 pb-2 font-normal @4xl/main:table-cell">
                Posted
              </th>
              <th scope="col" className="hidden w-[18%] px-4 pb-2 text-right font-normal sm:table-cell">
                Price
              </th>
              <th scope="col" className="w-24 px-2 pb-2 font-normal sm:w-28">
                Status
              </th>
              <th scope="col" className="w-12 pb-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr aria-hidden>
              <td className="h-3 p-0" />
            </tr>
            {listings.map((listing, i) => {
              const status = statusStyle[listing.status];
              return (
                <tr key={listing.id} className="group text-subdued transition-colors hover:bg-tint">
                  <td className="tabular rounded-l-[4px] py-2 text-right">{i + 1}</td>
                  <td className="px-4 py-2">
                    <Link href={`/listing/${listing.id}`} className="flex min-w-0 items-center gap-3">
                      <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-10 shrink-0" decorative />
                      <span className="min-w-0">
                        <span className="block truncate text-fg group-hover:underline">{listing.title}</span>
                        <span className="block truncate text-sm">
                          {categoryMeta[listing.category].label} · {listing.location.city}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-2 text-sm @4xl/main:table-cell" suppressHydrationWarning>
                    {timeAgo(listing.createdAt)}
                  </td>
                  <td className="tabular hidden px-4 py-2 text-right text-sm text-fg sm:table-cell">
                    {formatPrice(listing.price, listing.currency)}
                  </td>
                  <td className="px-2 py-2">
                    <span className="inline-flex items-center gap-2 text-sm text-fg">
                      <span className={`size-2 rounded-full ${status.dot}`} aria-hidden />
                      {status.label}
                    </span>
                  </td>
                  <td className="rounded-r-[4px] py-2 pr-1 text-right">
                    <Menu
                      label={`Actions for ${listing.title}`}
                      buttonClassName={iconButtonStyles("sm")}
                      trigger={<Ellipsis className="size-5" aria-hidden />}
                      items={actionsFor(listing)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
