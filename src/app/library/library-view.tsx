"use client";

import Link from "next/link";
import { useState } from "react";
import { Pin, Plus, X } from "lucide-react";
import { LIBRARY_FILTERS, useLibraryRows, type Filter } from "@/components/shell/library-sidebar";
import { buttonStyles, chipStyles } from "@/components/ui/button";
import { pagePad } from "@/components/shelf";

/** Your Library as a full page — the mobile tab, and a roomier view on desktop. */
export function LibraryView() {
  const [filter, setFilter] = useState<Filter>(null);
  const { rows, pinned, isEmpty } = useLibraryRows(filter, "");
  const list = isEmpty && !filter ? pinned : rows;

  return (
    <div className={`${pagePad} pb-6 pt-4 sm:pt-8`}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-[-0.02em] sm:text-[2rem]">Saved & following</h1>
        <Link href="/post" className={buttonStyles("tinted", "sm")}>
          <Plus className="-ml-1 size-4" strokeWidth={2.5} aria-hidden />
          Post an ad
        </Link>
      </div>

      <div role="group" aria-label="Filter saved and following" className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {filter && (
          <button type="button" onClick={() => setFilter(null)} aria-label="Clear filter" className={chipStyles(false, "w-8 justify-center px-0")}>
            <X className="size-4" aria-hidden />
          </button>
        )}
        {LIBRARY_FILTERS.filter((f) => !filter || f.id === filter).map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(filter === f.id ? null : f.id)}
            className={chipStyles(filter === f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-4 @3xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {list.map((row) => (
          <li key={row.key}>
            <Link href={row.href} className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-tint">
              {row.art}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-fg">{row.title}</span>
                <span className="flex items-center gap-1.5 truncate text-sm text-subdued">
                  {row.pinned && <Pin className="size-3.5 shrink-0 rotate-45 fill-accent text-accent" aria-label="Pinned" />}
                  <span className="truncate">{row.subtitle}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {isEmpty && !filter && (
        <div className="mt-6 rounded-lg bg-surface p-5">
          <p className="font-bold">Start your library</p>
          <p className="mt-1 text-sm text-subdued">Save listings and follow shops — they&apos;ll wait for you here.</p>
          <Link href="/search" className={buttonStyles("outline", "sm", "mt-4")}>
            Browse Sokoni
          </Link>
        </div>
      )}
      {filter && rows.length === 0 && <p className="py-10 text-center text-subdued">Nothing here yet.</p>}
    </div>
  );
}
