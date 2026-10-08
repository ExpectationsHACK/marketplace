"use client";

import { useSyncExternalStore } from "react";
import type { Conversation } from "./types";
import { currentUser } from "./mock-data";
import { getMergedConversationsForUser, type SellerData } from "./seller-store";

// Shared state for the desktop chat bar (Spotify desktop's bottom-bar slot)
// and the chat panel (its right-hand view): which conversation about an item
// is in focus, and whether the panel is open.

/** Conversations about a listing, most recent activity first. */
export function getItemChats(local: SellerData): Conversation[] {
  return getMergedConversationsForUser(currentUser.id, local).filter((c) => c.listingId);
}

interface ChatUi {
  selectedId: string | null;
  panelOpen: boolean;
  focusComposer: number;
}

const PANEL_KEY = "sokoni:panel";
const SERVER: ChatUi = { selectedId: null, panelOpen: false, focusComposer: 0 };

let state: ChatUi =
  typeof document === "undefined" ? SERVER : { ...SERVER, panelOpen: document.documentElement.dataset.panel === "open" };
const listeners = new Set<() => void>();

function set(patch: Partial<ChatUi>) {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

export function useChatUi(): ChatUi {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => SERVER,
  );
}

export function selectChat(id: string) {
  set({ selectedId: id });
}

export function setPanelOpen(open: boolean) {
  document.documentElement.dataset.panel = open ? "open" : "closed";
  try {
    localStorage.setItem(PANEL_KEY, open ? "open" : "closed");
  } catch {}
  set({ panelOpen: open });
}

/** Open the panel on this chat with the reply box focused. */
export function replyIn(id: string) {
  setPanelOpen(true);
  set({ selectedId: id, focusComposer: state.focusComposer + 1 });
}

/** The panel needs room: only ≥1280px shows it, matching globals.css. */
export function panelFits() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches;
}
