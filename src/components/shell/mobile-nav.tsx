"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, House, MessageCircle, Plus, Search } from "lucide-react";
import { iconButtonStyles } from "@/components/ui/button";
import { AccountMenu } from "./top-bar";
import { Logo } from "./logo";

const tabs = [
  { href: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  { href: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") || p.startsWith("/listings/") },
  { href: "/library", label: "Saved", icon: Bookmark, match: (p: string) => p === "/library" || p === "/saved" },
  { href: "/post", label: "Sell", icon: Plus, match: (p: string) => p.startsWith("/post") },
];

/** Spotify mobile's bottom tab bar, fading up from black. */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black from-55% to-transparent pb-[env(safe-area-inset-bottom)] pt-6 lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 pb-2 pt-1 text-[0.6875rem] transition-colors ${
                  active ? "font-bold text-fg" : "text-subdued"
                }`}
              >
                <Icon
                  className={`size-6 ${active && href === "/" ? "fill-current" : ""}`}
                  strokeWidth={active ? 2.25 : 1.75}
                  aria-hidden
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between bg-canvas px-4 lg:hidden">
      <Logo />
      <div className="flex items-center gap-1">
        <Link href="/messages" aria-label="Messages" className={iconButtonStyles("md")}>
          <MessageCircle className="size-6" strokeWidth={1.75} aria-hidden />
        </Link>
        <AccountMenu />
      </div>
    </header>
  );
}
