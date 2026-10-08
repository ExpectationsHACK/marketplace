"use client";

// Client-side data store — the frontend's stand-in for a real backend.
//
// Every mutation here is written as an async function returning the same
// shapes as the Prisma-mirrored types in lib/types.ts, specifically so that
// swapping this module's internals for real `fetch()` calls against a real
// API later is a drop-in change — components call `createStorefront(...)`,
// `await` it, and don't need to know whether it hit localStorage or a server.
//
// Data here LAYERS ON TOP of the read-only seed data in mock-data.ts:
// seed data is the always-present demo content; anything a user creates or
// edits in their own browser lives here and shadows/extends the seed data
// for that browser only. Editing a seed record "forks" it into the overlay
// under the same id, so the seed arrays themselves are never mutated. There
// is no server, so nothing here is shared between users or devices — that's
// the real backend's job.

import { useSyncExternalStore } from "react";
import type { Conversation, Listing, Message, Product, Storefront } from "./types";
import {
  conversations as seedConversations,
  listings as seedListings,
  products as seedProducts,
  storefronts as seedStorefronts,
} from "./mock-data";

const STORAGE_KEY = "sokoni:seller-data:v1";

export interface SellerData {
  storefronts: Storefront[];
  products: Product[];
  listings: Listing[];
  conversations: Conversation[];
}

function emptyData(): SellerData {
  return { storefronts: [], products: [], listings: [], conversations: [] };
}

// Stable singleton so useSyncExternalStore's server/pre-hydration snapshot
// is referentially consistent across calls (required for it to bail out
// correctly), and so components can detect "this is still the placeholder
// snapshot, not real client data yet" via reference equality — see
// isHydrated() below.
const EMPTY_SNAPSHOT: SellerData = emptyData();

function readStorage(): SellerData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw);
    return {
      storefronts: parsed.storefronts ?? [],
      products: parsed.products ?? [],
      listings: parsed.listings ?? [],
      conversations: parsed.conversations ?? [],
    };
  } catch {
    return emptyData();
  }
}

let data: SellerData = readStorage();
const listeners = new Set<() => void>();
let storageListening = false;

function notify() {
  for (const listener of listeners) listener();
}

function persistAndNotify() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage full or blocked: keep the in-memory change for this session.
    }
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in sync, so a listing posted in one tab shows in another.
  if (!storageListening && typeof window !== "undefined") {
    storageListening = true;
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      data = readStorage();
      notify();
    });
  }
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return data;
}

function getServerSnapshot(): SellerData {
  return EMPTY_SNAPSHOT;
}

/** Reactive read of this browser's locally-created seller data. */
export function useSellerData(): SellerData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * True once `local` is the real client snapshot rather than the
 * server/pre-hydration placeholder. Components that seed `useState` from
 * merged data (form defaults) need this instead of comparing an entity id:
 * an entity edited locally keeps the SAME id as its seed original (that's
 * the point of forking on first edit), so an id-based "have we synced yet"
 * guard never re-fires once hydration replaces the empty placeholder with
 * real localStorage data — the form silently keeps showing seed values.
 */
export function isHydrated(local: SellerData): boolean {
  return local !== EMPTY_SNAPSHOT;
}

function id(prefix: string) {
  return `local-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function slugTaken(slug: string): boolean {
  return seedStorefronts.some((s) => s.slug === slug) || data.storefronts.some((s) => s.slug === slug);
}

/** Appends -2, -3, ... until the slug is free, mirroring how a real API would resolve a unique-constraint conflict. */
function uniqueSlug(base: string): string {
  const fallback = base || "shop";
  if (!slugTaken(fallback)) return fallback;
  let n = 2;
  while (slugTaken(`${fallback}-${n}`)) n++;
  return `${fallback}-${n}`;
}

/**
 * Seed records shadowed by local forks (same id), plus local-only records.
 * `localFirst` puts brand-new local records ahead of the seed list (newest
 * posts first); otherwise they're appended.
 */
function overlay<T extends { id: string }>(seed: T[], local: T[], localFirst = false): T[] {
  const localById = new Map(local.map((item) => [item.id, item]));
  const seedIds = new Set(seed.map((item) => item.id));
  const merged = seed.map((item) => localById.get(item.id) ?? item);
  const added = local.filter((item) => !seedIds.has(item.id));
  return localFirst ? [...added.reverse(), ...merged] : [...merged, ...added];
}

// ---------------------------------------------------------------------------
// Merged reads: seed data + this browser's local overlay
// ---------------------------------------------------------------------------

export function getAllMergedStorefronts(local: SellerData): Storefront[] {
  return overlay(seedStorefronts, local.storefronts);
}

/** A locally-created/edited storefront for this owner takes priority over the seed one. */
export function getMergedStorefrontByOwnerId(ownerId: string, local: SellerData): Storefront | undefined {
  const localMatch = [...local.storefronts].reverse().find((s) => s.ownerId === ownerId);
  return localMatch ?? seedStorefronts.find((s) => s.ownerId === ownerId);
}

export function getMergedStorefrontBySlug(slug: string, local: SellerData): Storefront | undefined {
  return getAllMergedStorefronts(local).find((s) => s.slug === slug);
}

export function getMergedProductsByStorefront(storefrontId: string, local: SellerData): Product[] {
  return overlay(seedProducts, local.products).filter((p) => p.storefrontId === storefrontId);
}

/** Every listing, newest local posts first. Includes sold/removed — filter at the call site. */
export function getAllMergedListings(local: SellerData): Listing[] {
  return overlay(seedListings, local.listings, true);
}

export function getMergedListingsBySeller(sellerId: string, local: SellerData): Listing[] {
  return getAllMergedListings(local).filter((l) => l.sellerId === sellerId);
}

export function getMergedListingById(listingId: string, local: SellerData): Listing | undefined {
  return getAllMergedListings(local).find((l) => l.id === listingId);
}

/** Public feeds only show live listings. */
export function isLive(listing: Listing): boolean {
  return listing.status === "ACTIVE";
}

export function getMergedConversationsForUser(userId: string, local: SellerData): Conversation[] {
  const all = overlay(seedConversations, local.conversations, true);
  // A thread with no messages yet was just opened; keep it on top.
  const lastAt = (c: Conversation) => c.messages[c.messages.length - 1]?.createdAt ?? "￿";
  return all.filter((c) => c.participantIds.includes(userId)).sort((a, b) => (lastAt(a) < lastAt(b) ? 1 : -1));
}

// ---------------------------------------------------------------------------
// Mutations — async on purpose, see file header
// ---------------------------------------------------------------------------

/** Replace-or-insert into a local collection, forking from `seed` on first edit. */
function upsert<K extends keyof SellerData>(
  key: K,
  seed: SellerData[K],
  recordId: string,
  patch: (current: SellerData[K][number]) => SellerData[K][number],
): SellerData[K][number] {
  const collection = data[key] as { id: string }[];
  const existing = collection.find((r) => r.id === recordId) ?? (seed as { id: string }[]).find((r) => r.id === recordId);
  if (!existing) throw new Error(`${String(key)} ${recordId} not found`);
  const updated = patch(existing as SellerData[K][number]) as { id: string };
  const next = collection.some((r) => r.id === recordId)
    ? collection.map((r) => (r.id === recordId ? updated : r))
    : [...collection, updated];
  data = { ...data, [key]: next };
  persistAndNotify();
  return updated as SellerData[K][number];
}

export async function createStorefront(input: {
  ownerId: string;
  name: string;
  bio: string;
  whatsappNumber: string;
  category: string;
  city: string;
}): Promise<Storefront> {
  const storefront: Storefront = {
    id: id("shop"),
    ownerId: input.ownerId,
    slug: uniqueSlug(slugify(input.name)),
    name: input.name,
    bio: input.bio,
    logoUrl: "",
    coverUrl: "",
    whatsappNumber: input.whatsappNumber,
    category: input.category,
    city: input.city,
    isVerified: false,
    plan: "FREE",
    productIds: [],
    followers: 0,
    responseRate: 0,
    domainStatus: "NONE",
  };
  data = { ...data, storefronts: [...data.storefronts, storefront] };
  persistAndNotify();
  return storefront;
}

export async function updateStorefront(
  storefrontId: string,
  patch: Partial<Omit<Storefront, "id" | "ownerId">>,
): Promise<Storefront> {
  return upsert("storefronts", seedStorefronts, storefrontId, (s) => ({ ...s, ...patch })) as Storefront;
}

export async function addProduct(input: {
  storefrontId: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  description: string;
  images?: string[];
}): Promise<Product> {
  const product: Product = {
    id: id("prod"),
    storefrontId: input.storefrontId,
    title: input.title,
    price: input.price,
    currency: input.currency,
    images: input.images ?? [],
    inStock: true,
    category: input.category,
    description: input.description,
    createdAt: new Date().toISOString(),
  };
  data = { ...data, products: [...data.products, product] };
  persistAndNotify();
  return product;
}

export async function updateProduct(
  productId: string,
  patch: Partial<Omit<Product, "id" | "storefrontId">>,
): Promise<Product> {
  return upsert("products", seedProducts, productId, (p) => ({ ...p, ...patch })) as Product;
}

export async function createListing(input: {
  sellerId: string;
  category: Listing["category"];
  title: string;
  description: string;
  price?: number;
  currency: string;
  city: string;
  country: string;
  images?: string[];
}): Promise<Listing> {
  const now = new Date();
  const listing: Listing = {
    id: id("listing"),
    sellerId: input.sellerId,
    category: input.category,
    title: input.title,
    description: input.description,
    price: input.price,
    currency: input.currency,
    images: input.images ?? [],
    location: { lat: 0, lng: 0, city: input.city, country: input.country },
    status: "ACTIVE",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 86_400_000).toISOString(),
  };
  data = { ...data, listings: [...data.listings, listing] };
  persistAndNotify();
  return listing;
}

export async function updateListing(
  listingId: string,
  patch: Partial<Omit<Listing, "id" | "sellerId">>,
): Promise<Listing> {
  return upsert("listings", seedListings, listingId, (l) => ({ ...l, ...patch })) as Listing;
}

/** Re-list for another 30 days and bump it back to the top of "Fresh listings". */
export async function renewListing(listingId: string): Promise<Listing> {
  const now = new Date();
  return updateListing(listingId, {
    status: "ACTIVE",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 30 * 86_400_000).toISOString(),
  });
}

// --- Messages -------------------------------------------------------------

/** Returns the existing thread between these two people about this listing, or opens a new one. */
export async function openConversation(input: {
  participantIds: [string, string];
  listingId?: string;
}): Promise<Conversation> {
  const existing = overlay(seedConversations, data.conversations).find(
    (c) =>
      input.participantIds.every((p) => c.participantIds.includes(p)) &&
      (input.listingId ? c.listingId === input.listingId : true),
  );
  if (existing) return existing;
  const conversation: Conversation = {
    id: id("conv"),
    listingId: input.listingId,
    participantIds: input.participantIds,
    messages: [],
  };
  data = { ...data, conversations: [...data.conversations, conversation] };
  persistAndNotify();
  return conversation;
}

export async function sendMessage(conversationId: string, senderId: string, body: string): Promise<Message> {
  const message: Message = {
    id: id("msg"),
    conversationId,
    senderId,
    body,
    createdAt: new Date().toISOString(),
  };
  upsert("conversations", seedConversations, conversationId, (c) => ({
    ...c,
    messages: [...c.messages, message],
  }));
  return message;
}
