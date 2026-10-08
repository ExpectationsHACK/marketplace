// Deterministic cover art. There is no photo library yet, so every listing,
// product, and shop gets a stable, distinct color + glyph derived from its id
// and title. The same color drives the Spotify-style "dynamic color" header
// on that entity's page, the way Spotify extracts a color from album art.

// Saturated, deep enough for white glyphs and >=24px white text (>=3:1).
// Spread around the wheel; only three sit in the violet/magenta band.
const PALETTE = [
  "#e13300",
  "#1e3264",
  "#e8115b",
  "#148a08",
  "#0d73ec",
  "#8400e7",
  "#27856a",
  "#ba5d07",
  "#477d95",
  "#dc148c",
  "#006450",
  "#608108",
  "#b06239",
  "#2d46b9",
  "#c27c0e",
  "#5e7d8c",
] as const;

export function seedHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function seedColor(seed: string): string {
  return PALETTE[seedHash(seed) % PALETTE.length];
}

export function initials(label: string): string {
  const parts = label
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Glyph names map to lucide icons in components/ui/cover.tsx. */
export type GlyphName =
  | "bag"
  | "phone"
  | "laptop"
  | "car"
  | "building"
  | "bed"
  | "footprints"
  | "camera"
  | "sparkles"
  | "coffee"
  | "truck"
  | "sofa"
  | "megaphone"
  | "briefcase"
  | "wrench"
  | "zap"
  | "users"
  | "shirt"
  | "scissors"
  | "gem"
  | "droplet"
  | "leaf"
  | "package"
  | "store";

// Title keywords beat category, so "Toyota Vitz" gets a car, not a bag.
const KEYWORDS: [RegExp, GlyphName][] = [
  [/iphone|phone|samsung|tecno|infinix|pixel/i, "phone"],
  [/macbook|laptop|computer|dell|hp |thinkpad/i, "laptop"],
  [/toyota|honda|car|vitz|corolla|vehicle|motor/i, "car"],
  [/apartment|flat|duplex|house|bedroom|land|plot|office space/i, "building"],
  [/bedsitter|studio|room|shortlet|hostel/i, "bed"],
  [/sneaker|shoe|sandal|air max|yeezy|jordan|boot/i, "footprints"],
  [/photo|camera|video|shoot/i, "camera"],
  [/clean|laundry|wash/i, "sparkles"],
  [/barista|coffee|cafe|chef|cook/i, "coffee"],
  [/mover|moving|delivery|haul|van|logistics/i, "truck"],
  [/furniture|sofa|couch|table|chair|bookshelf/i, "sofa"],
  [/social media|marketing|instagram|tiktok/i, "megaphone"],
  [/kaftan|dress|jacket|varsity|shirt|agbada|wear/i, "shirt"],
  [/ankara|fabric|lace|adire|aso|textile|wrapper|yard/i, "scissors"],
  [/gele|jewel|bead|necklace|earring|accessor/i, "gem"],
  [/oil|serum|hair/i, "droplet"],
  [/shea|soap|butter|skin|natural/i, "leaf"],
];

const CATEGORY_GLYPH: Record<string, GlyphName> = {
  FOR_SALE: "bag",
  HOUSING: "building",
  JOBS: "briefcase",
  SERVICES: "wrench",
  GIGS: "zap",
  COMMUNITY: "users",
  Fabric: "scissors",
  Accessories: "gem",
  "Ready to Wear": "shirt",
  Sneakers: "footprints",
  Streetwear: "shirt",
  Skincare: "leaf",
  Haircare: "droplet",
  "Fashion & Fabric": "scissors",
  "Sneakers & Streetwear": "footprints",
  "Beauty & Wellness": "leaf",
  Electronics: "phone",
  "Food & Groceries": "coffee",
  "Home & Living": "sofa",
};

export function glyphFor(title: string, category?: string): GlyphName {
  for (const [pattern, glyph] of KEYWORDS) {
    if (pattern.test(title)) return glyph;
  }
  if (category && CATEGORY_GLYPH[category]) return CATEGORY_GLYPH[category];
  return "package";
}
