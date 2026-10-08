"use client";

// "Your Library": what a buyer has saved, which shops they follow, and what
// they looked at recently. Same contract as seller-store.ts — async-shaped
// mutations over a localStorage snapshot, so a real API can replace the
// internals later without touching components.
//
// Unlike seller data, the library starts from a seeded default (the demo
// user already follows a couple of shops) and the server snapshot IS that
// default, so pre-hydration markup matches for anyone who hasn't changed it.

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sokoni:library:v1";

export interface LibraryEntry {
  id: string;
  at: string;
}

export interface RecentEntry extends LibraryEntry {
  kind: "listing" | "shop";
}

export interface LibraryData {
  saved: LibraryEntry[];
  following: LibraryEntry[];
  recent: RecentEntry[];
}

const DEFAULT_LIBRARY: LibraryData = {
  saved: [
    { id: "l8", at: "2026-09-01T10:00:00Z" },
    { id: "l4", at: "2026-08-24T18:30:00Z" },
  ],
  following: [
    { id: "s2", at: "2026-07-02T09:00:00Z" },
    { id: "s3", at: "2026-06-11T12:00:00Z" },
  ],
  recent: [],
};

function read(): LibraryData {
  if (typeof window === "undefined") return DEFAULT_LIBRARY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LIBRARY;
    const parsed = JSON.parse(raw);
    return {
      saved: parsed.saved ?? [],
      following: parsed.following ?? [],
      recent: parsed.recent ?? [],
    };
  } catch {
    return DEFAULT_LIBRARY;
  }
}

let data: LibraryData = read();
const listeners = new Set<() => void>();
let storageListening = false;

function commit(next: LibraryData) {
  data = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Private mode / quota: keep the in-memory state for this session.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!storageListening && typeof window !== "undefined") {
    storageListening = true;
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      data = read();
      for (const l of listeners) l();
    });
  }
  return () => listeners.delete(listener);
}

export function useLibrary(): LibraryData {
  return useSyncExternalStore(
    subscribe,
    () => data,
    () => DEFAULT_LIBRARY,
  );
}

export function isSaved(library: LibraryData, listingId: string) {
  return library.saved.some((e) => e.id === listingId);
}

export function isFollowing(library: LibraryData, storefrontId: string) {
  return library.following.some((e) => e.id === storefrontId);
}

/** Returns the new saved state. */
export async function toggleSaved(listingId: string): Promise<boolean> {
  const saved = data.saved.some((e) => e.id === listingId);
  commit({
    ...data,
    saved: saved
      ? data.saved.filter((e) => e.id !== listingId)
      : [{ id: listingId, at: new Date().toISOString() }, ...data.saved],
  });
  return !saved;
}

/** Returns the new following state. */
export async function toggleFollowing(storefrontId: string): Promise<boolean> {
  const following = data.following.some((e) => e.id === storefrontId);
  commit({
    ...data,
    following: following
      ? data.following.filter((e) => e.id !== storefrontId)
      : [{ id: storefrontId, at: new Date().toISOString() }, ...data.following],
  });
  return !following;
}

const RECENT_LIMIT = 12;

export function recordView(kind: RecentEntry["kind"], id: string) {
  if (data.recent[0]?.id === id && data.recent[0]?.kind === kind) return;
  commit({
    ...data,
    recent: [
      { kind, id, at: new Date().toISOString() },
      ...data.recent.filter((e) => !(e.id === id && e.kind === kind)),
    ].slice(0, RECENT_LIMIT),
  });
}
