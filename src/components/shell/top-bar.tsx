"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  House,
  LayoutGrid,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Search,
  Store,
  User,
  X,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { getMergedStorefrontByOwnerId, useSellerData } from "@/lib/seller-store";
import { Avatar } from "@/components/ui/cover";
import { Menu } from "@/components/ui/menu";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { Logo } from "./logo";
import { HistoryButtons } from "./history-buttons";

export function TopBar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  return (
    <header className="hidden items-center gap-4 px-2 lg:flex">
      <div className="flex w-[var(--sidebar-w)] shrink-0 items-center justify-between gap-3 pl-3 pr-1 collapsed:w-auto collapsed:pl-2">
        <Logo className="collapsed:[&>span]:hidden" />
        <HistoryButtons />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <Link
          href="/"
          aria-label="Home"
          aria-current={onHome ? "page" : undefined}
          className={iconButtonStyles("md", `bg-surface ${onHome ? "text-fg" : ""}`)}
        >
          <House className={`size-6 ${onHome ? "fill-current" : ""}`} strokeWidth={onHome ? 1.5 : 1.75} aria-hidden />
        </Link>
        <Suspense fallback={<SearchBoxShell />}>
          <SearchBox />
        </Suspense>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link href="/post" className={buttonStyles("primary", "sm", "h-8")}>
          <Plus className="-ml-1 size-4" strokeWidth={3} aria-hidden />
          Post an ad
        </Link>
        <Link href="/messages" aria-label="Messages" className={iconButtonStyles("sm")}>
          <MessageCircle className="size-5" strokeWidth={1.75} aria-hidden />
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}

function SearchBoxShell() {
  return (
    <div className="flex h-12 w-full max-w-[29.625rem] items-center rounded-full bg-surface pl-3 text-subdued">
      <Search className="size-6" strokeWidth={1.75} aria-hidden />
    </div>
  );
}

/**
 * Spotify's live search: typing anywhere jumps to /search and results
 * update as you type (debounced URL replace). Ctrl/⌘+K focuses it.
 */
function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const onSearch = pathname === "/search";
  const urlQuery = onSearch ? (params.get("q") ?? "") : "";
  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Follow the URL when it changes underneath us (back button, chip links).
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(next: string, immediate = false) {
    clearTimeout(timer.current);
    const href = next.trim() ? `/search?q=${encodeURIComponent(next.trim())}` : "/search";
    const navigate = () => (onSearch ? router.replace(href, { scroll: false }) : router.push(href));
    if (immediate || !onSearch) navigate();
    else timer.current = setTimeout(navigate, 220);
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(value, true);
      }}
      className="group/search relative flex h-12 w-full max-w-[29.625rem] items-center rounded-full bg-surface text-subdued shadow-[inset_0_0_0_1px_transparent] transition-[background-color,box-shadow] duration-100 hover:bg-surface-hi hover:shadow-[inset_0_0_0_1px_var(--color-surface-hi)] focus-within:shadow-[inset_0_0_0_2px_var(--color-fg)]"
    >
      <Search className="pointer-events-none absolute left-3 size-6 group-focus-within/search:text-fg" strokeWidth={1.75} aria-hidden />
      <label htmlFor="global-search" className="sr-only">
        Search listings, shops and sellers
      </label>
      <input
        ref={inputRef}
        id="global-search"
        type="search"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          go(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            setValue("");
            go("", true);
          }
        }}
        placeholder="Search phones, rentals, jobs, services…"
        className="h-full w-full rounded-full bg-transparent pl-12 pr-24 text-base text-fg placeholder:text-subdued focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute right-2 flex items-center">
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              go("", true);
              inputRef.current?.focus();
            }}
            className={iconButtonStyles("sm")}
          >
            <X className="size-5" aria-hidden />
          </button>
        )}
        <span className="mx-1 h-6 w-px bg-faint" aria-hidden />
        <Link href="/search" aria-label="Browse all categories" className={iconButtonStyles("sm")}>
          <LayoutGrid className="size-5" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </form>
  );
}

export function AccountMenu({ side = "bottom" }: { side?: "bottom" | "top" }) {
  const local = useSellerData();
  const storefront = getMergedStorefrontByOwnerId(currentUser.id, local);
  return (
    <Menu
      label="Account"
      side={side}
      buttonClassName={iconButtonStyles("md", "bg-surface")}
      trigger={<Avatar seed={currentUser.id} name={currentUser.name} size={32} />}
      items={[
        { label: "Profile", icon: User, href: `/profile/${currentUser.id}` },
        { label: "Seller hub", icon: LayoutDashboard, href: "/dashboard" },
        ...(storefront
          ? [{ label: "Your shop", icon: Store, href: `/s/${storefront.slug}` }]
          : [{ label: "Open a shop", icon: Store, href: "/onboarding" }]),
        { label: currentUser.verified ? "Verification" : "Get verified", icon: BadgeCheck, href: "/verify", divider: true },
      ]}
    />
  );
}
