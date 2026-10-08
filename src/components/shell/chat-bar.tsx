"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MessageCircle, MessagesSquare, PanelRight, Reply } from "lucide-react";
import { currentUser, getUserById } from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { getAllMergedStorefronts, getMergedListingById, useSellerData } from "@/lib/seller-store";
import { getItemChats, panelFits, replyIn, selectChat, setPanelOpen, useChatUi } from "@/lib/chat-store";
import { Cover } from "@/components/ui/cover";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { SaveButton } from "@/components/library-actions";
import { WhatsAppButton } from "@/components/whatsapp-button";

function ago(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h`;
  return `${Math.floor(mins / 1440)}d`;
}

/**
 * The persistent bottom bar (Spotify desktop's slot), used for the deal
 * you're negotiating: the item and who it's with, the latest message and
 * the two ways to answer (reply here, or continue on WhatsApp), and
 * switching between chats. On phones it's a compact bar above the tabs.
 */
export function ChatBar() {
  const router = useRouter();
  const local = useSellerData();
  const ui = useChatUi();
  const chats = getItemChats(local);
  const index = Math.max(0, chats.findIndex((c) => c.id === ui.selectedId));
  const chat = chats[index];
  const listing = chat?.listingId ? getMergedListingById(chat.listingId, local) : undefined;
  const other = chat ? getUserById(chat.participantIds.find((p) => p !== currentUser.id) ?? "") : undefined;
  const last = chat?.messages[chat.messages.length - 1];
  const lastFrom = last ? (last.senderId === currentUser.id ? "You" : getUserById(last.senderId)?.name.split(" ")[0]) : "";
  const theirShop = other ? getAllMergedStorefronts(local).find((s) => s.ownerId === other.id) : undefined;
  const whatsapp = theirShop?.whatsappNumber ?? other?.phone;
  const threadHref = other ? `/messages?with=${other.id}${chat?.listingId ? `&listing=${chat.listingId}` : ""}` : "/messages";

  const step = (delta: number) => {
    if (chats.length < 2) return;
    selectChat(chats[(index + delta + chats.length) % chats.length].id);
  };
  const reply = () => (chat && panelFits() ? replyIn(chat.id) : router.push(threadHref));

  return (
    <>
      <footer
        aria-label="Your latest chat"
        className="hidden h-[4.5rem] grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-6 px-2 lg:grid"
      >
        {/* Left: the item */}
        <div className="flex min-w-0 items-center gap-3 pl-2">
          {chat && listing ? (
            <>
              <Link href={`/listing/${listing.id}`} className="shrink-0" aria-label={listing.title}>
                <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-14" decorative />
              </Link>
              <div className="min-w-0">
                <Link href={`/listing/${listing.id}`} className="block truncate text-sm font-semibold text-fg hover:underline">
                  {listing.title}
                </Link>
                {other && (
                  <Link href={`/profile/${other.id}`} className="block truncate text-xs text-subdued hover:text-fg hover:underline">
                    Chat with {other.name}
                  </Link>
                )}
              </div>
              <SaveButton listingId={listing.id} title={listing.title} variant="small" />
            </>
          ) : (
            <>
              <span className="flex size-14 shrink-0 items-center justify-center rounded-[4px] bg-surface">
                <MessagesSquare className="size-6 text-subdued" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">No chats yet</p>
                <p className="truncate text-xs text-subdued">Message a seller from any listing</p>
              </div>
            </>
          )}
        </div>

        {/* Center: latest message + how to answer */}
        <div className="flex min-w-0 flex-col items-center gap-1.5">
          {chat ? (
            <>
              <p className="w-full max-w-[34rem] truncate text-center text-xs text-subdued">
                {last ? (
                  <>
                    <span className="font-semibold text-fg">{lastFrom}:</span> {last.body}{" "}
                    <span suppressHydrationWarning>· {ago(last.createdAt)}</span>
                  </>
                ) : (
                  "No messages yet — say hello"
                )}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={reply} className={buttonStyles("primary", "sm", "h-8")}>
                  <Reply className="-ml-1 size-4" strokeWidth={2.5} aria-hidden />
                  Reply
                </button>
                {whatsapp && listing && (
                  <WhatsAppButton
                    number={whatsapp}
                    variant="outline"
                    size="sm"
                    className="h-8"
                    label="Continue on WhatsApp"
                    message={`Hi ${other?.name.split(" ")[0] ?? "there"}, following up on "${listing.title}" from Sokoni.`}
                  />
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-subdued">Ask about price, condition or delivery — your chats show up here.</p>
          )}
        </div>

        {/* Right: switch chats, open details */}
        <div className="flex items-center justify-end gap-2 pr-2">
          {chats.length > 1 && (
            <div className="flex items-center gap-1 text-xs text-subdued">
              <button type="button" onClick={() => step(-1)} aria-label="Previous chat" className={iconButtonStyles("sm")}>
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <span className="tabular whitespace-nowrap">
                Chat {index + 1} of {chats.length}
              </span>
              <button type="button" onClick={() => step(1)} aria-label="Next chat" className={iconButtonStyles("sm")}>
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setPanelOpen(!ui.panelOpen)}
            aria-pressed={ui.panelOpen}
            className={`hidden h-8 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors xl:inline-flex ${
              ui.panelOpen ? "bg-tint-hi text-fg" : "text-subdued hover:text-fg"
            }`}
          >
            <PanelRight className="size-4" aria-hidden />
            Chat details
          </button>
          <Link href="/messages" className="whitespace-nowrap text-sm font-semibold text-subdued hover:text-fg hover:underline">
            All messages
          </Link>
        </div>
      </footer>

      {/* Phones: compact bar above the tabs, tinted with the item's color */}
      {chat && listing && (
        <div
          className="mini-chat fixed inset-x-2 bottom-[calc(3.6rem+env(safe-area-inset-bottom))] z-40 overflow-hidden rounded-md shadow-[0_8px_24px_rgb(0_0_0/0.5)] lg:hidden"
          style={{ backgroundColor: `color-mix(in srgb, ${seedColor(listing.id)} 42%, #121212)` }}
        >
          <Link href={threadHref} className="flex items-center gap-3 p-2 pr-3">
            <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-10 shrink-0" decorative />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-fg">{listing.title}</span>
              <span className="block truncate text-xs text-fg/75">
                {last ? `${lastFrom}: ${last.body}` : `Chat with ${other?.name ?? "the seller"}`}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-fg">
              <MessageCircle className="size-4" aria-hidden />
              Reply
            </span>
          </Link>
        </div>
      )}
    </>
  );
}
