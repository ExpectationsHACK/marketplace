import type { Listing, Storefront, User } from "./types";
import { categoryMeta, getUserById } from "./mock-data";

// Word-based matching: every word in the query must appear somewhere in the
// record, so "iphone lagos" finds the iPhone listed in Lagos.

export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function hit(fields: (string | undefined)[], tokens: string[]) {
  const haystack = fields.filter(Boolean).join(" ").toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export function matchListing(l: Listing, tokens: string[]) {
  return hit(
    [l.title, l.description, l.location.city, l.location.country, categoryMeta[l.category].label, getUserById(l.sellerId)?.name],
    tokens,
  );
}

export function matchShop(s: Storefront, tokens: string[]) {
  return hit([s.name, s.bio, s.category, s.city], tokens);
}

export function matchUser(u: User, tokens: string[]) {
  return hit([u.name], tokens);
}

export type TopResult =
  | { kind: "listing"; listing: Listing }
  | { kind: "shop"; shop: Storefront }
  | { kind: "seller"; user: User };

/** Prefer an exact-ish name hit (shop, then seller), then a title hit, then the first listing. */
export function pickTopResult(
  query: string,
  listings: Listing[],
  shops: Storefront[],
  sellers: User[],
): TopResult | undefined {
  const q = query.toLowerCase().trim();
  const shop = shops.find((s) => s.name.toLowerCase().includes(q));
  if (shop) return { kind: "shop", shop };
  const seller = sellers.find((u) => u.name.toLowerCase().includes(q));
  if (seller) return { kind: "seller", user: seller };
  const titled = listings.find((l) => l.title.toLowerCase().includes(q));
  if (titled) return { kind: "listing", listing: titled };
  if (listings[0]) return { kind: "listing", listing: listings[0] };
  if (shops[0]) return { kind: "shop", shop: shops[0] };
  if (sellers[0]) return { kind: "seller", user: sellers[0] };
  return undefined;
}
