import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Spotify's section: bold title (a link when there's more), "Show all" on
 * the right, then a single row of cards (see .shelf-row in globals.css).
 * `kind` lets the home filter chips hide listing or shop shelves.
 */
export function Shelf({
  title,
  href,
  subtitle,
  kind,
  wrap = false,
  children,
}: {
  title: string;
  href?: string;
  subtitle?: string;
  kind?: "listings" | "shops";
  wrap?: boolean;
  children: ReactNode;
}) {
  return (
    <section data-kind={kind} className="mb-8">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-fg">
            {href ? (
              <Link href={href} className="hover:underline">
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-subdued">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="shrink-0 pb-1 text-sm font-bold text-subdued transition-colors hover:text-fg hover:underline">
            Show all
          </Link>
        )}
      </div>
      <div className={`shelf-row ${wrap ? "shelf-wrap" : ""}`}>{children}</div>
    </section>
  );
}

/** Standard horizontal page padding inside the main pane. */
export const pagePad = "px-4 sm:px-6";
