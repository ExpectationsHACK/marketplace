"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, FilePlus2, PackagePlus, Pin, Plus, Search, Store, X } from "lucide-react";
import { currentUser, formatPrice } from "@/lib/mock-data";
import {
  getAllMergedListings,
  getAllMergedStorefronts,
  getMergedListingsBySeller,
  getMergedStorefrontByOwnerId,
  useSellerData,
} from "@/lib/seller-store";
import { useLibrary } from "@/lib/library-store";
import { Avatar, Cover, SavedArt } from "@/components/ui/cover";
import { Menu } from "@/components/ui/menu";
import { buttonStyles, chipStyles, iconButtonStyles } from "@/components/ui/button";

export type Filter = "saved" | "shops" | "posts" | null;

export interface Row {
  key: string;
  href: string;
  title: string;
  subtitle: string;
  art: React.ReactNode;
  pinned?: boolean;
  at?: string;
}

const SIDEBAR_KEY = "sokoni:sidebar";

function toggleCollapsed() {
  const root = document.documentElement;
  const collapsed = root.dataset.sidebar !== "collapsed";
  if (collapsed) root.dataset.sidebar = "collapsed";
  else delete root.dataset.sidebar;
  try {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? "collapsed" : "expanded");
  } catch {}
}

export const LIBRARY_FILTERS: { id: Exclude<Filter, null>; label: string }[] = [
  { id: "saved", label: "Saved items" },
  { id: "shops", label: "Shops" },
  { id: "posts", label: "My ads" },
];

/** Rows for Your Library, shared by the desktop sidebar and the mobile /library page. */
export function useLibraryRows(filter: Filter, query: string) {
  const library = useLibrary();
  const local = useSellerData();
  const myShop = getMergedStorefrontByOwnerId(currentUser.id, local);
  const allListings = getAllMergedListings(local);
  const allShops = getAllMergedStorefronts(local);

  const savedRows: Row[] = library.saved.flatMap((entry) => {
    const listing = allListings.find((l) => l.id === entry.id);
    if (!listing) return [];
    return [
      {
        key: `l-${listing.id}`,
        href: `/listing/${listing.id}`,
        title: listing.title,
        subtitle: `${formatPrice(listing.price, listing.currency)} · ${listing.location.city}`,
        art: <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-12" decorative />,
        at: entry.at,
      },
    ];
  });

  const shopRows: Row[] = library.following.flatMap((entry) => {
    const shop = allShops.find((s) => s.id === entry.id);
    if (!shop) return [];
    return [
      {
        key: `s-${shop.id}`,
        href: `/s/${shop.slug}`,
        title: shop.name,
        subtitle: `Shop · ${shop.city.split(",")[0]}`,
        art: <Avatar seed={shop.id} name={shop.name} size={48} />,
        at: entry.at,
      },
    ];
  });

  const pinned: Row[] = [
    {
      key: "saved",
      href: "/saved",
      title: "Saved items",
      subtitle: `${library.saved.length} saved ${library.saved.length === 1 ? "item" : "items"}`,
      art: <SavedArt className="size-12 rounded-[4px]" />,
      pinned: true,
    },
    ...(myShop
      ? [
          {
            key: "my-shop",
            href: `/s/${myShop.slug}`,
            title: myShop.name,
            subtitle: "Your shop",
            art: <Avatar seed={myShop.id} name={myShop.name} size={48} />,
            pinned: true,
          },
        ]
      : []),
  ];

  const postRows: Row[] = getMergedListingsBySeller(currentUser.id, local).map((listing) => ({
    key: `p-${listing.id}`,
    href: `/listing/${listing.id}`,
    title: listing.title,
    subtitle: `My ad · ${listing.status === "ACTIVE" ? "Live" : listing.status.toLowerCase()}`,
    art: <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-12" decorative />,
  }));

  let rows: Row[];
  if (filter === "saved") rows = savedRows;
  else if (filter === "shops") rows = [...pinned.filter((r) => r.key === "my-shop"), ...shopRows];
  else if (filter === "posts") rows = postRows;
  else rows = [...pinned, ...[...shopRows, ...savedRows].sort((a, b) => ((a.at ?? "") < (b.at ?? "") ? 1 : -1))];

  const needle = query.trim().toLowerCase();
  if (needle) rows = rows.filter((r) => r.title.toLowerCase().includes(needle));

  const isEmpty = savedRows.length === 0 && shopRows.length === 0;
  return { rows, pinned, isEmpty, needle };
}

export function LibrarySidebar() {
  const pathname = usePathname();
  const [filter, setFilter] = useState<Filter>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { rows, pinned, isEmpty, needle } = useLibraryRows(filter, query);
  const myShop = pinned.some((r) => r.key === "my-shop");

  return (
    <aside aria-label="Saved and following" className="hidden min-h-0 flex-col overflow-hidden rounded-pane bg-canvas lg:flex">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3 collapsed:flex-col collapsed:px-2">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="group/lib flex h-10 items-center gap-3 rounded-full px-2 font-bold text-subdued transition-colors hover:text-fg"
          aria-label="Collapse or expand saved and following"
        >
          <Bookmark className="size-6" strokeWidth={1.75} aria-hidden />
          <span className="collapsed:hidden">Saved & following</span>
        </button>
        <Menu
          label="Sell"
          align="end"
          buttonClassName={`${buttonStyles("tinted", "sm", "h-8 pl-3 pr-4")} collapsed:w-8 collapsed:px-0`}
          trigger={
            <>
              <Plus className="size-4" strokeWidth={2.5} aria-hidden />
              <span className="collapsed:hidden">Sell</span>
            </>
          }
          items={[
            { label: "Post an ad", icon: FilePlus2, href: "/post?mode=classified" },
            { label: "Add a product to your shop", icon: PackagePlus, href: "/post?mode=product" },
            ...(myShop ? [] : [{ label: "Open a shop", icon: Store, href: "/onboarding" }]),
          ]}
        />
      </div>

      {!isEmpty && (
        <div className="collapsed:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none]">
            {filter && (
              <button type="button" onClick={() => setFilter(null)} aria-label="Clear filter" className={chipStyles(false, "w-8 justify-center px-0")}>
                <X className="size-4" aria-hidden />
              </button>
            )}
            {LIBRARY_FILTERS
              .filter((f) => !filter || f.id === filter)
              .map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(filter === f.id ? null : f.id)}
                  className={chipStyles(filter === f.id)}
                >
                  {f.label}
                </button>
              ))}
          </div>
          <div className="flex h-10 items-center px-2">
            {searching ? (
              <div className="flex h-8 flex-1 items-center gap-2 rounded-[4px] bg-surface-hi px-2">
                <Search className="size-4 text-subdued" aria-hidden />
                <label htmlFor="library-filter" className="sr-only">
                  Search saved items and shops
                </label>
                <input
                  id="library-filter"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearching(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setQuery("");
                      setSearching(false);
                    }
                  }}
                  placeholder="Search saved items and shops"
                  className="w-full bg-transparent text-sm text-fg placeholder:text-hint focus:outline-none"
                />
              </div>
            ) : (
              <button type="button" onClick={() => setSearching(true)} aria-label="Search saved items and shops" className={iconButtonStyles("sm")}>
                <Search className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="pane-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {isEmpty && !filter ? (
          <div className="space-y-4 px-2 pt-2 collapsed:hidden">
            <PromptCard
              title="Save listings you like"
              body="Tap the plus on any listing and it waits for you here."
              href="/listings/FOR_SALE"
              cta="Browse listings"
            />
            <PromptCard
              title="Follow shops you trust"
              body="See new products from sellers you buy from."
              href="/search"
              cta="Find shops"
            />
          </div>
        ) : null}

        <ul className="flex flex-col">
          {(isEmpty && !filter ? pinned : rows).map((row) => {
            const active = pathname === row.href;
            return (
              <li key={row.key}>
                <Link
                  href={row.href}
                  title={row.title}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md p-2 transition-colors collapsed:justify-center ${
                    active ? "bg-tint-hi hover:bg-[rgb(255_255_255/0.14)]" : "hover:bg-tint"
                  }`}
                >
                  {row.art}
                  <span className="min-w-0 flex-1 collapsed:hidden">
                    <span className={`block truncate font-medium ${active ? "text-accent" : "text-fg"}`}>{row.title}</span>
                    <span className="flex items-center gap-1.5 truncate text-sm text-subdued">
                      {row.pinned && <Pin className="size-3.5 shrink-0 rotate-45 fill-accent text-accent" aria-label="Pinned" />}
                      <span className="truncate">{row.subtitle}</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {needle && rows.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-subdued collapsed:hidden">Nothing saved matches “{query}”.</p>
        )}
        {filter === "posts" && rows.length === 0 && !needle && (
          <p className="px-2 py-6 text-sm text-subdued collapsed:hidden">
            You haven&apos;t posted anything yet.{" "}
            <Link href="/post" className="font-bold text-fg underline-offset-2 hover:underline">
              Post a listing
            </Link>
          </p>
        )}
      </div>
    </aside>
  );
}

function PromptCard({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="rounded-lg bg-surface px-5 py-4">
      <p className="font-bold text-fg">{title}</p>
      <p className="mt-2 text-sm text-fg">{body}</p>
      <Link href={href} className={buttonStyles("outline", "sm", "mt-5")}>
        {cta}
      </Link>
    </div>
  );
}
