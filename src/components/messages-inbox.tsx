"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, MessagesSquare, ShieldCheck } from "lucide-react";
import { formatPrice, getUserById } from "@/lib/mock-data";
import {
  getMergedConversationsForUser,
  getMergedListingById,
  isHydrated,
  openConversation,
  sendMessage,
  useSellerData,
} from "@/lib/seller-store";
import { Avatar, Cover } from "@/components/ui/cover";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";

function stamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/**
 * Inbox + thread. `withUser`/`listingId` (from ?with=&listing=) open or
 * create the right thread, so "Message" on a listing lands in context.
 */
export function MessagesInbox({
  userId,
  withUser,
  listingId,
}: {
  userId: string;
  withUser?: string;
  listingId?: string;
}) {
  const local = useSellerData();
  const conversations = getMergedConversationsForUser(userId, local);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [mobileThread, setMobileThread] = useState(false);
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const openedFor = useRef<string | null>(null);

  // Deep link: open (or start) the thread once real client data is loaded.
  useEffect(() => {
    if (!withUser || withUser === userId || !isHydrated(local)) return;
    const key = `${withUser}:${listingId ?? ""}`;
    if (openedFor.current === key) return;
    openedFor.current = key;
    openConversation({ participantIds: [userId, withUser], listingId }).then((c) => {
      setActiveId(c.id);
      setMobileThread(true);
    });
  }, [withUser, listingId, userId, local]);

  const active = conversations.find((c) => c.id === activeId) ?? (withUser ? undefined : conversations[0]);
  const messageCount = active?.messages.length ?? 0;

  // Scroll only the thread, never the page around it.
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [active?.id, messageCount, mobileThread]);

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-surface px-6 py-16 text-center">
        <MessagesSquare className="size-12 text-subdued" strokeWidth={1.25} aria-hidden />
        <p className="mt-4 text-xl font-bold">No conversations yet</p>
        <p className="mt-1 text-subdued">Message a seller from any listing and the thread lands here.</p>
        <Link href="/search" className={buttonStyles("primary", "sm", "mt-6")}>
          Browse listings
        </Link>
      </div>
    );
  }

  const other = active ? getUserById(active.participantIds.find((p) => p !== userId) ?? "") : undefined;
  const listing = active?.listingId ? getMergedListingById(active.listingId, local) : undefined;

  async function onSend(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !active) return;
    setDraft("");
    await sendMessage(active.id, userId, body);
  }

  return (
    <div className="grid h-[min(46rem,calc(100dvh-13rem))] min-h-[28rem] grid-cols-1 overflow-hidden rounded-lg bg-surface @3xl/main:grid-cols-[20rem_minmax(0,1fr)]">
      <ul
        aria-label="Conversations"
        className={`pane-scroll min-h-0 overflow-y-auto border-line p-2 @3xl/main:border-r ${mobileThread ? "hidden @3xl/main:block" : ""}`}
      >
        {conversations.map((c) => {
          const person = getUserById(c.participantIds.find((p) => p !== userId) ?? "");
          const about = c.listingId ? getMergedListingById(c.listingId, local) : undefined;
          const last = c.messages[c.messages.length - 1];
          const selected = c.id === active?.id;
          const unread = last && last.senderId !== userId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setActiveId(c.id);
                  setMobileThread(true);
                }}
                aria-current={selected ? "true" : undefined}
                className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors ${
                  selected ? "bg-tint-hi" : "hover:bg-tint"
                }`}
              >
                {person && <Avatar seed={person.id} name={person.name} size={48} />}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={`truncate font-semibold ${selected ? "text-accent" : "text-fg"}`}>
                      {person?.name ?? "Sokoni user"}
                    </span>
                    {unread && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="Awaiting your reply" />}
                  </span>
                  <span className="block truncate text-sm text-subdued">
                    {about ? `${about.title} · ` : ""}
                    {last?.body ?? "New conversation"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <section
        aria-label={other ? `Conversation with ${other.name}` : "Conversation"}
        className={`flex min-h-0 flex-col ${mobileThread ? "" : "hidden @3xl/main:flex"}`}
      >
        {active && other ? (
          <>
            <header className="flex items-center gap-3 border-b border-line px-3 py-3 sm:px-4">
              <button
                type="button"
                onClick={() => setMobileThread(false)}
                aria-label="Back to conversations"
                className={iconButtonStyles("sm", "@3xl/main:hidden")}
              >
                <ChevronLeft className="size-6" aria-hidden />
              </button>
              <Link href={`/profile/${other.id}`} className="flex min-w-0 items-center gap-3 hover:underline">
                <Avatar seed={other.id} name={other.name} size={40} />
                <span className="flex min-w-0 items-center gap-1.5 font-bold">
                  <span className="truncate">{other.name}</span>
                  {other.verified && <VerifiedBadge size={16} label="ID verified" />}
                </span>
              </Link>
              {listing && (
                <Link
                  href={`/listing/${listing.id}`}
                  className="ml-auto hidden max-w-[16rem] items-center gap-2 rounded-md bg-tint p-1.5 pr-3 transition-colors hover:bg-tint-hi sm:flex"
                >
                  <Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="size-9 shrink-0" decorative />
                  <span className="min-w-0 text-sm">
                    <span className="block truncate font-semibold">{listing.title}</span>
                    <span className="tabular block text-subdued">{formatPrice(listing.price, listing.currency)}</span>
                  </span>
                </Link>
              )}
            </header>

            <div ref={threadRef} className="pane-scroll min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-4">
              <p className="mx-auto mb-4 flex max-w-md items-start gap-2 rounded-md bg-tint px-3 py-2 text-xs text-subdued">
                <ShieldCheck className="size-4 shrink-0 text-accent" aria-hidden />
                Meet in a public place and check the item before you pay. Sokoni will never ask for a code or your card PIN in chat.
              </p>
              {active.messages.length === 0 && (
                <p className="py-6 text-center text-sm text-subdued">Say hello — ask about condition, pickup, or delivery.</p>
              )}
              {active.messages.map((m) => {
                const mine = m.senderId === userId;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${
                        mine ? "rounded-br-md bg-accent text-on-accent" : "rounded-bl-md bg-surface-hi text-fg"
                      }`}
                    >
                      <p className="whitespace-pre-line break-words">{m.body}</p>
                      <p className={`mt-1 text-[0.6875rem] ${mine ? "text-black/65" : "text-subdued"}`} suppressHydrationWarning>
                        {stamp(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={onSend} className="flex items-center gap-2 border-t border-line p-3">
              <label htmlFor="message-draft" className="sr-only">
                Message {other.name}
              </label>
              <input
                id="message-draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${other.name.split(" ")[0]}…`}
                autoComplete="off"
                className="h-11 flex-1 rounded-full bg-surface-hi px-4 text-fg placeholder:text-hint focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-fg)]"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-100 hover:scale-[1.04] hover:bg-accent-hi disabled:opacity-40 disabled:hover:scale-100"
              >
                <ArrowUp className="size-5" strokeWidth={2.5} aria-hidden />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-subdued">Pick a conversation</div>
        )}
      </section>
    </div>
  );
}
