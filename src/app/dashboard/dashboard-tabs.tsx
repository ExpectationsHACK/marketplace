"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chipStyles } from "@/components/ui/button";

const tabs = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/storefront", label: "Shop" },
  { href: "/dashboard/listings", label: "Listings" },
  { href: "/dashboard/messages", label: "Messages" },
];

export function DashboardTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Seller hub" className="mt-6 flex gap-2 overflow-x-auto [scrollbar-width:none]">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined} className={chipStyles(active)}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
