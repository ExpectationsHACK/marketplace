import {
  Bed,
  Bookmark,
  Briefcase,
  Building2,
  Car,
  Coffee,
  Droplet,
  Footprints,
  Gem,
  Laptop,
  Leaf,
  Megaphone,
  Package,
  Camera,
  Scissors,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
  Store,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { glyphFor, initials, seedColor, type GlyphName } from "@/lib/placeholder";

const GLYPHS: Record<GlyphName, LucideIcon> = {
  bag: ShoppingBag,
  phone: Smartphone,
  laptop: Laptop,
  car: Car,
  building: Building2,
  bed: Bed,
  footprints: Footprints,
  camera: Camera,
  sparkles: Sparkles,
  coffee: Coffee,
  truck: Truck,
  sofa: Sofa,
  megaphone: Megaphone,
  briefcase: Briefcase,
  wrench: Wrench,
  zap: Zap,
  users: Users,
  shirt: Shirt,
  scissors: Scissors,
  gem: Gem,
  droplet: Droplet,
  leaf: Leaf,
  package: Package,
  store: Store,
};

export function GlyphIcon({ name, className }: { name: GlyphName; className?: string }) {
  const Icon = GLYPHS[name];
  return <Icon aria-hidden className={className} />;
}

/**
 * Procedural cover art: a seeded color field, a soft top-left light, and a
 * large subject glyph tilted into the bottom-right corner —
 * the way Spotify tucks a rotated album cover into its Browse tiles.
 * The glyph stroke scales with the cover, so thumbs and heroes stay one family.
 */
export function Cover({
  seed,
  title,
  category,
  image,
  className = "",
  rounded = "rounded-[4px]",
  color,
  decorative = false,
}: {
  seed: string;
  title: string;
  category?: string;
  /** A real photo (seller upload). When present it replaces the procedural art. */
  image?: string;
  className?: string;
  rounded?: string;
  color?: string;
  decorative?: boolean;
}) {
  const fill = color ?? seedColor(seed);
  const Icon = GLYPHS[glyphFor(title, category)];
  if (image) {
    return (
      <div
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : title}
        aria-hidden={decorative || undefined}
        className={`relative overflow-hidden ${rounded} ${className}`}
        style={{ backgroundColor: fill }}
      >
        {/* Local uploads are data URLs, which next/image can't optimise. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      </div>
    );
  }
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
      className={`relative isolate overflow-hidden ${rounded} ${className}`}
      style={{ backgroundColor: fill }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 8%, rgb(255 255 255 / 0.24), transparent 55%), linear-gradient(165deg, transparent 45%, rgb(0 0 0 / 0.38))",
        }}
      />
      <Icon
        aria-hidden
        strokeWidth={1.35}
        className="absolute -bottom-[9%] -right-[11%] h-[76%] w-[76%] rotate-[-14deg] text-white/90 drop-shadow-[0_10px_18px_rgb(0_0_0/0.28)]"
      />
    </div>
  );
}

/** Monogram avatar for people and shops (Spotify shows artists as circles). */
export function Avatar({
  seed,
  name,
  size = 40,
  className = "",
}: {
  seed: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-extrabold tracking-[-0.03em] text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.36),
        background: `radial-gradient(110% 110% at 25% 15%, rgb(255 255 255 / 0.22), transparent 60%), ${seedColor(seed)}`,
      }}
    >
      <span className="relative">{initials(name)}</span>
    </span>
  );
}

/** Fluid circular shop art that fills its column; the monogram scales with it. */
export function ShopArt({
  seed,
  name,
  square = false,
  className = "",
}: {
  seed: string;
  name: string;
  /** Businesses get a square logo tile; people stay round. */
  square?: boolean;
  className?: string;
}) {
  const shape = square ? "rounded-lg" : "rounded-full";
  return (
    <div className={`@container aspect-square w-full ${shape} ${className}`} aria-hidden>
      <div
        className={`relative flex size-full items-center justify-center overflow-hidden ${shape} font-extrabold tracking-[-0.04em] text-white`}
        style={{
          fontSize: "34cqi",
          background: `radial-gradient(110% 110% at 25% 15%, rgb(255 255 255 / 0.22), transparent 60%), ${seedColor(seed)}`,
        }}
      >
        <span className="relative">{initials(name)}</span>
      </div>
    </div>
  );
}

/** Cover for the pinned "Saved" collection, Sokoni's Liked Songs. */
export function SavedArt({ className = "", iconClassName = "size-[42%]" }: { className?: string; iconClassName?: string }) {
  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ background: "linear-gradient(135deg, #3b1e8f 0%, #2d6bc4 48%, #7fe3bd 100%)" }}
    >
      <Bookmark className={`fill-white text-white ${iconClassName}`} strokeWidth={1.5} />
    </div>
  );
}
