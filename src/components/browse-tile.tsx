import Link from "next/link";
import type { Category } from "@/lib/types";
import { categoryMeta } from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { Cover } from "@/components/ui/cover";

/**
 * Spotify's Browse-all tile: a saturated field, a bold label top-left, and
 * a cover tilted 25° into the bottom-right corner. On hover the cover leans
 * further in.
 */
export function BrowseTile({ category, count }: { category: Category; count?: number }) {
  const meta = categoryMeta[category];
  let artColor = seedColor(`${category}-art`);
  if (artColor === meta.color) artColor = seedColor(`${category}-alt`);
  return (
    <Link
      href={`/listings/${category}`}
      className="group relative block aspect-[1.6] overflow-hidden rounded-lg p-4 focus-visible:outline-offset-4"
      style={{ backgroundColor: meta.color }}
    >
      <span className="relative z-10 block max-w-[62%] text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white [text-wrap:balance]">
        {meta.label}
      </span>
      {count !== undefined && (
        <span className="relative z-10 mt-1 block text-sm font-semibold text-white/85">
          {count} {count === 1 ? "listing" : "listings"}
        </span>
      )}
      <Cover
        seed={category}
        title={meta.label}
        category={category}
        color={artColor}
        decorative
        className="absolute bottom-[-4%] right-[-5%] aspect-square w-[34%] rotate-[25deg] shadow-[0_4px_12px_rgb(0_0_0/0.35)] transition-transform duration-300 ease-out-expo group-hover:rotate-[30deg] group-hover:scale-[1.04]"
      />
    </Link>
  );
}
