"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessagesSquare, X } from "lucide-react";
import type { Conversation } from "@/lib/types";
import { currentUser, formatPrice, getUserById } from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { getAllMergedStorefronts, getMergedListingById, sendMessage, useSellerData } from "@/lib/seller-store";
import { getItemChats, selectChat, setPanelOpen, useChatUi } from "@/lib/chat-store";
import { Avatar, Cover } from "@/components/ui/cover";
import { TrustRing } from "@/components/ui/trust-ring";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { SaveButton } from "@/components/library-actions";
import { WhatsAppButton } from "@/components/whatsapp-button";

/**
 * The right-hand view (Spotify desktop's now-playing slot), showing the
 * chat in focus: the item, the latest messages with a reply box, who you're
 * dealing with and their trust, and your other chats. Visibility is pure CSS
 * (html[data-panel="open"], ≥1280px) so it never flashes on load.
 */
export function ChatPanel() {
  const local = useSellerData();
  const ui = useChatUi();
  const chats = getItemChats(local);
  const chat = chats.find((c) => c.id === ui.selectedId) ?? chats[0];

  return (
    <aside aria-label="Chat details" className="chat-panel min-h-0 flex-col overflow-hidden rounded-pane bg-canvas">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
        <h2 className="truncate font-bold">{chat ? "Your chat" : "Chats"}</h2>
        <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close chat details" className={iconButtonStyles("sm")}>
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="pane-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {chat ? (
          <ChatDetail key={chat.id} chat={chat} others={chats.filter((c) => c.id !== chat.id)} focusSignal={ui.focusComposer} />
        ) : (
          <div className="pt-2">
            <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-surface">
              <MessagesSquare className="size-20 text-subdued" strokeWidth={1.25} aria-hidden />
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-[-0.02em]">No chats yet</h3>
            <p className="mt-2 text-sm text-subdued">Message a seller from any listing to ask about price, condition or delivery.</p>
            <Link href="/search" className={buttonStyles("outline", "sm", "mt-5")}>
              Browse listings
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

function ChatDetail({ chat, others, focusSignal }: { chat: Conversation; others: Conversation[]; focusSignal: number }) {
  const local = useSellerData();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listing = chat.listingId ? getMergedListingById(chat.listingId, local) : undefined;
  const other = getUserById(chat.participantIds.find((p) => p !== currentUser.id) ?? "");
  const theirShop = other ? getAllMergedStorefronts(local).find((s) => s.ownerId === other.id) : undefined;
  const whatsapp = theirShop?.whatsappNumber ?? other?.phone;
  const recent = chat.messages.slice(-4);

  // "Reply" in the bottom bar focuses the box here.
  useEffect(() => {
    if (focusSignal) inputRef.current?.focus();
  }, [focusSignal]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    await sendMessage(chat.id, currentUser.id, body);
  }

  return (
    <div className="space-y-4">
      {listing && (
        <>
          <Link href={`/listing/${listing.id}`} className="block" aria-label={listing.title}>
            <Cover
              seed={listing.id}
              image={listing.images[0]}
              title={listing.title}
              category={listing.category}
              className="aspect-[4/3] w-full"
              rounded="rounded-lg"
              decorative
            />
          </Link>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="tabular text-2xl font-bold leading-tight">{formatPrice(listing.price, listing.currency)}</p>
              <Link href={`/listing/${listing.id}`} className="mt-1 line-clamp-2 font-semibold hover:underline">
                {listing.title}
              </Link>
              <p className="mt-0.5 text-sm text-subdued">{listing.location.city}</p>
            </div>
            <SaveButton listingId={listing.id} title={listing.title} variant="small" />
          </div>
        </>
      )}

      <section aria-labelledby="panel-messages" className="rounded-lg bg-surface p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 id="panel-messages" className="font-bold">
            Messages
          </h3>
          {other && (
            <Link
              href={`/messages?with=${other.id}${chat.listingId ? `&listing=${chat.listingId}` : ""}`}
              className="text-sm font-bold text-subdued hover:text-fg hover:underline"
            >
              Open chat
            </Link>
          )}
        </div>
        <ul className="mt-3 space-y-2">
          {recent.length === 0 && <li className="text-sm text-subdued">No messages yet. Say hello.</li>}
          {recent.map((m) => {
            const mine = m.senderId === currentUser.id;
            return (
              <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${
                    mine ? "rounded-br-md bg-accent text-on-accent" : "rounded-bl-md bg-surface-hi text-fg"
                  }`}
                >
                  {m.body}
                </p>
              </li>
            );
          })}
        </ul>
        <form onSubmit={send} className="mt-3 flex items-center gap-2">
          <label htmlFor="panel-reply" className="sr-only">
            Reply to {other?.name ?? "seller"}
          </label>
          <input
            id="panel-reply"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reply…"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 rounded-full bg-surface-hi px-4 text-sm text-fg placeholder:text-hint focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-fg)]"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send reply"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-transform hover:scale-[1.04] disabled:opacity-40"
          >
            <ArrowUp className="size-5" strokeWidth={2.5} aria-hidden />
          </button>
        </form>
        {whatsapp && listing && (
          <WhatsAppButton
            number={whatsapp}
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            label="Continue on WhatsApp"
            message={`Hi ${other?.name.split(" ")[0] ?? "there"}, following up on "${listing.title}" from Sokoni.`}
          />
        )}
      </section>

      {other && (
        <section aria-labelledby="panel-seller" className="overflow-hidden rounded-lg bg-surface">
          <div className="relative h-20" style={{ backgroundColor: seedColor(other.id) }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" aria-hidden />
            <h3 id="panel-seller" className="absolute bottom-3 left-4 font-bold">
              About the seller
            </h3>
          </div>
          <div className="p-4">
            <Link href={`/profile/${other.id}`} className="flex items-center gap-3 hover:underline">
              <Avatar seed={other.id} name={other.name} size={40} />
              <span className="flex min-w-0 items-center gap-1.5 font-bold">
                <span className="truncate">{other.name}</span>
                {other.verified && <VerifiedBadge size={16} label="ID verified" />}
              </span>
            </Link>
            <div className="mt-4">
              <TrustRing score={other.trustScore} verified={other.verified} size={40} showLabel />
            </div>
            {other.responseTime && (
              <p className="mt-3 text-sm text-subdued">{other.responseTime[0].toUpperCase() + other.responseTime.slice(1)}</p>
            )}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="panel-others" className="rounded-lg bg-surface p-4">
          <h3 id="panel-others" className="font-bold">
            Your other chats
          </h3>
          <ul className="mt-3">
            {others.map((c) => {
              const l = c.listingId ? getMergedListingById(c.listingId, local) : undefined;
              const who = getUserById(c.participantIds.find((p) => p !== currentUser.id) ?? "");
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectChat(c.id)}
                    className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-tint"
                  >
                    {l && <Cover seed={l.id} image={l.images[0]} title={l.title} category={l.category} className="size-12 shrink-0" decorative />}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{l?.title ?? "Chat"}</span>
                      <span className="block truncate text-xs text-subdued">with {who?.name ?? "Sokoni user"}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
