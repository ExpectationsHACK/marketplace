"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Spotify's compact header: once the entity's action bar scrolls out of
 * view, a 64px bar in the entity's color slides in at the top of the pane
 * with the primary action and the title. Takes no layout space (-mb-16).
 */
export function StickyEntityBar({
  title,
  sentinelId,
  children,
}: {
  title: string;
  sentinelId: string;
  children?: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(sentinelId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 64),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [sentinelId]);

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={`sticky top-0 z-30 -mb-16 h-16 bg-[var(--entity)] transition-opacity duration-200 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div className="relative flex h-full items-center gap-3 px-4 sm:px-6">
        {children}
        <span className="truncate text-xl font-bold tracking-[-0.02em] text-fg sm:text-2xl">{title}</span>
      </div>
    </div>
  );
}
