"use client";

import Link from "next/link";
import { Bookmark, CircleCheck, Clock } from "lucide-react";
import { currentUser, formatPrice, getUserById } from "@/lib/mock-data";
import { getAllMergedListings, useSellerData } from "@/lib/seller-store";
import { toggleSaved, useLibrary } from "@/lib/library-store";
import { toast } from "@/lib/toast-store";
import { Avatar, Cover, SavedArt } from "@/components/ui/cover";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { EntityPage, Dot } from "@/components/entity";
import { pagePad } from "@/components/shelf";

const SAVED_COLOR = "#3b2a7a";

function savedAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Sokoni's "Liked Songs": every saved listing as one sortable track list. */
export function SavedView() {
  const library = useLibrary();
  const local = useSellerData();
  const all = getAllMergedListings(local);
  const rows = library.saved
    .map((entry) => ({ entry, listing: all.find((l) => l.id === entry.id) }))
    .filter((r) => r.listing !== undefined);

  return (
    <EntityPage
      color={SAVED_COLOR}
      art={<SavedArt className="aspect-square w-full" iconClassName="size-[38%]" />}
      title="Saved items"
      meta={
        <>
          <span className="inline-flex items-center gap-1.5 font-bold">
            <Avatar seed={currentUser.id} name={currentUser.name} size={24} />
            {currentUser.name}
          </span>
          <Dot />
          <span>
            {rows.length} {rows.length === 1 ? "listing" : "listings"}
          </span>
        </>
      }
      actions={
        <Link href="/search" className={buttonStyles("outline", "md")}>
          Find more
        </Link>
      }
    >
      <div className={`${pagePad} pb-6`}>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Bookmark className="size-14 text-fg" strokeWidth={1.25} aria-hidden />
            <h2 className="mt-6 text-[2rem] font-bold tracking-[-0.03em]">Listings you save will show up here</h2>
            <p className="mt-2 text-subdued">Tap the plus on any listing to save it.</p>
            <Link href="/search" className={buttonStyles("primary", "md", "mt-8")}>
              Browse listings
            </Link>
          </div>
        ) : (
          <table className="w-full table-fixed text-left">
            <caption className="sr-only">Saved listings</caption>
            <thead>
              <tr className="border-b border-line text-sm text-subdued">
                <th scope="col" className="w-10 px-2 pb-2 text-right font-normal">
                  #
                </th>
                <th scope="col" className="px-4 pb-2 font-normal">
                  Listing
                </th>
                <th scope="col" className="hidden w-[22%] px-4 pb-2 font-normal @3xl/main:table-cell">
                  Location
                </th>
                <th scope="col" className="hidden w-[16%] px-4 pb-2 font-normal @4xl/main:table-cell">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" aria-hidden />
                    Saved
                  </span>
                </th>
                <th scope="col" className="w-28 px-4 pb-2 text-right font-normal sm:w-36">
                  Price
                </th>
                <th scope="col" className="w-14 pb-2">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr aria-hidden>
                <td className="h-4 p-0" />
              </tr>
              {rows.map(({ entry, listing }, i) => {
                const l = listing!;
                const seller = getUserById(l.sellerId);
                const gone = l.status !== "ACTIVE";
                return (
                  <tr key={l.id} className="group text-subdued transition-colors hover:bg-tint">
                    <td className="tabular rounded-l-[4px] px-2 py-2 text-right">{i + 1}</td>
                    <td className="px-4 py-2">
                      <Link href={`/listing/${l.id}`} className="flex min-w-0 items-center gap-3">
                        <Cover seed={l.id} image={l.images[0]} title={l.title} category={l.category} className="size-10 shrink-0" decorative />
                        <span className="min-w-0">
                          <span className={`block truncate ${gone ? "text-subdued line-through" : "text-fg"} group-hover:underline`}>
                            {l.title}
                          </span>
                          <span className="flex items-center gap-1 truncate text-sm">
                            {seller?.verified && <VerifiedBadge size={13} label="Verified seller" />}
                            {seller?.name ?? "Seller"}
                            {gone && <span className="text-warning"> · {l.status.toLowerCase()}</span>}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="hidden truncate px-4 py-2 text-sm @3xl/main:table-cell">{l.location.city}</td>
                    <td className="hidden px-4 py-2 text-sm @4xl/main:table-cell" suppressHydrationWarning>
                      {savedAgo(entry.at)}
                    </td>
                    <td className="tabular px-4 py-2 text-right text-sm text-fg">{formatPrice(l.price, l.currency)}</td>
                    <td className="rounded-r-[4px] py-2 pr-2 text-right">
                      <button
                        type="button"
                        aria-label={`Remove ${l.title} from Saved`}
                        onClick={async () => {
                          await toggleSaved(l.id);
                          toast("Removed from saved items");
                        }}
                        className={iconButtonStyles("sm", "text-accent hover:text-accent")}
                      >
                        <CircleCheck className="size-5 fill-accent text-canvas" aria-hidden />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </EntityPage>
  );
}
