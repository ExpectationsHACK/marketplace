import type { CSSProperties, ReactNode } from "react";
import { StickyEntityBar } from "./sticky-entity-bar";

/** Spotify sizes entity titles to their length; we step through container-relative sizes. */
export function titleSize(title: string) {
  const n = title.length;
  if (n <= 12) return "text-[clamp(2.75rem,9cqi,6rem)]";
  if (n <= 22) return "text-[clamp(2.25rem,7cqi,4.5rem)]";
  if (n <= 34) return "text-[clamp(2rem,5.4cqi,3.5rem)]";
  return "text-[clamp(1.75rem,4cqi,2.75rem)]";
}

/**
 * The entity page frame (album / artist / profile grammar):
 * a header painted in the entity's own color, a sticky compact bar that
 * takes over once the action bar scrolls away, and a body whose first
 * 232px carry the same color fading into the canvas.
 */
export function EntityPage({
  color,
  art,
  title,
  titleAdornment,
  meta,
  actions,
  stickyAction,
  children,
  banner = false,
  round = false,
}: {
  color: string;
  art?: ReactNode;
  title: string;
  /** Inline after the title at cap height (e.g. the verified rosette). */
  titleAdornment?: ReactNode;
  meta?: ReactNode;
  actions: ReactNode;
  stickyAction?: ReactNode;
  children: ReactNode;
  /** Artist-page variant: a tall banner with the title inside it instead of beside cover art. */
  banner?: boolean;
  /** Circular art (people), so the drop shadow follows the circle. */
  round?: boolean;
}) {
  const style = { "--entity": color } as CSSProperties;
  return (
    <div style={style} className="relative">
      <StickyEntityBar title={title} sentinelId="entity-actions">
        {stickyAction}
      </StickyEntityBar>

      <header className="@container relative isolate overflow-hidden bg-[var(--entity)]">
        {banner && art}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-black/50" />
        <div
          className={`flex flex-col gap-5 px-4 pb-6 sm:px-6 ${
            banner
              ? "min-h-[clamp(16rem,40cqi,25rem)] justify-end pt-24"
              : "pt-8 sm:flex-row sm:items-end sm:gap-6 sm:pt-16 lg:pt-20"
          }`}
        >
          {!banner && art && (
            <div
              className={`w-[clamp(9rem,26cqi,14.5rem)] shrink-0 shadow-[0_4px_60px_rgb(0_0_0/0.5)] ${round ? "rounded-full" : ""}`}
            >
              {art}
            </div>
          )}
          <div className="relative min-w-0 flex-1">
            <h1
              className={`${titleSize(title)} break-words font-black leading-[1.04] tracking-[-0.04em] text-fg [text-wrap:balance] ${
                banner ? "drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)]" : ""
              }`}
            >
              {title}
              {titleAdornment && (
                <span className="ml-[0.18em] inline-block align-[0.06em] [&>svg]:size-[0.5em]">{titleAdornment}</span>
              )}
            </h1>
            {meta && <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-fg">{meta}</div>}
          </div>
        </div>
      </header>

      <div className="relative isolate">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[14.5rem] bg-[var(--entity)]">
          <div className="h-full bg-gradient-to-b from-black/60 to-canvas" />
        </div>
        <div id="entity-actions" className="flex flex-wrap items-center gap-x-6 gap-y-4 px-4 py-6 sm:px-6">
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}

/** "Name • 2026 • 4 items" meta separators. */
export function Dot() {
  return (
    <span aria-hidden className="px-0.5 text-fg">
      •
    </span>
  );
}
