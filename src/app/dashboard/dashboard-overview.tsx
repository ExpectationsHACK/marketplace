"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BadgeCheck, MessageCircle, PackageX, RotateCcw, Sparkles } from "lucide-react";
import { currentUser, getUserById } from "@/lib/mock-data";
import {
  getMergedConversationsForUser,
  getMergedListingsBySeller,
  getMergedProductsByStorefront,
  getMergedStorefrontByOwnerId,
  isLive,
  useSellerData,
} from "@/lib/seller-store";
import { TrustRing } from "@/components/ui/trust-ring";
import { buttonStyles } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { Shelf } from "@/components/shelf";

interface Task {
  key: string;
  icon: typeof PackageX;
  tone: "accent" | "warning" | "negative" | "subdued";
  title: ReactNode;
  body: string;
  action: { href: string; label: string };
}

const toneClass = {
  accent: "text-accent",
  warning: "text-warning",
  negative: "text-negative",
  subdued: "text-subdued",
};

export function DashboardOverview() {
  const local = useSellerData();
  const storefront = getMergedStorefrontByOwnerId(currentUser.id, local);
  const listings = getMergedListingsBySeller(currentUser.id, local);
  const conversations = getMergedConversationsForUser(currentUser.id, local);
  const catalog = storefront ? getMergedProductsByStorefront(storefront.id, local) : [];
  const live = listings.filter(isLive);

  // Everything that needs the seller to act, most urgent first.
  const tasks: Task[] = [];
  for (const c of conversations) {
    const last = c.messages[c.messages.length - 1];
    if (!last || last.senderId === currentUser.id) continue;
    const person = getUserById(last.senderId);
    tasks.push({
      key: `reply-${c.id}`,
      icon: MessageCircle,
      tone: "subdued",
      title: <>{person?.name ?? "A buyer"} is waiting for a reply</>,
      body: `“${last.body}”`,
      action: { href: `/messages?with=${last.senderId}${c.listingId ? `&listing=${c.listingId}` : ""}`, label: "Reply" },
    });
  }
  for (const p of catalog.filter((p) => !p.inStock)) {
    tasks.push({
      key: `stock-${p.id}`,
      icon: PackageX,
      tone: "warning",
      title: <>{p.title} is out of stock</>,
      body: "Buyers can still ask about a restock on WhatsApp.",
      action: { href: "/dashboard/storefront", label: "Update stock" },
    });
  }
  for (const l of listings.filter((l) => l.status === "EXPIRED")) {
    tasks.push({
      key: `renew-${l.id}`,
      icon: RotateCcw,
      tone: "warning",
      title: <>{l.title} has expired</>,
      body: "Renew it to put it back at the top of Fresh listings.",
      action: { href: "/dashboard/listings", label: "Renew" },
    });
  }
  if (!currentUser.verified) {
    tasks.push({
      key: "verify",
      icon: BadgeCheck,
      tone: "accent",
      title: <>Get verified</>,
      body: "Verified sellers get a blue badge and rank higher in search.",
      action: { href: "/verify", label: "Start" },
    });
  }

  const stats = [
    { label: "Shop followers", value: storefront ? storefront.followers.toLocaleString("en-US") : "—" },
    { label: "Live listings", value: String(live.length) },
    { label: "Open chats", value: String(conversations.length) },
    { label: "Response rate", value: storefront ? `${storefront.responseRate}%` : "—" },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-8 @4xl/main:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="attention">
          <h2 id="attention" className="text-2xl font-bold tracking-[-0.02em]">
            Needs your attention
          </h2>
          {tasks.length === 0 ? (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-surface p-5">
              <Sparkles className="size-6 text-accent" aria-hidden />
              <p className="font-semibold">You&apos;re all caught up.</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-lg bg-surface">
              {tasks.map(({ key, icon: Icon, tone, title, body, action }) => (
                <li key={key} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                  <Icon className={`size-6 shrink-0 ${toneClass[tone]}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-subdued">{body}</p>
                  </div>
                  <Link href={action.href} className={buttonStyles("outline", "sm", "self-start sm:self-center")}>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside aria-label="Your trust" className="h-fit rounded-lg bg-surface p-5">
          <h2 className="font-bold">Your trust</h2>
          <div className="mt-4">
            <TrustRing score={currentUser.trustScore} verified={currentUser.verified} size={64} showLabel />
          </div>
          <p className="mt-4 text-sm text-subdued">
            Buyers see this ring on every listing. Verification, good reviews and quick replies raise it.
          </p>
          <Link href={`/profile/${currentUser.id}`} className={buttonStyles("outline", "sm", "mt-4")}>
            View public profile
          </Link>
        </aside>
      </div>

      <section aria-label="At a glance">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line @3xl/main:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-5">
              <dt className="text-sm text-subdued">{s.label}</dt>
              <dd className="tabular mt-1 text-[2rem] font-bold leading-none tracking-[-0.03em]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {listings.length > 0 && (
        <Shelf title="Your listings" href="/dashboard/listings">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </Shelf>
      )}
    </div>
  );
}
