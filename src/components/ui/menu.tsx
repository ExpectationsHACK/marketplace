"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;
  divider?: boolean;
}

/**
 * Spotify's context menu: #282828 panel, 4px radius, 40px rows that
 * highlight on hover. Keyboard: Enter/Space/ArrowDown opens, arrows move,
 * Escape closes and returns focus to the trigger.
 */
export function Menu({
  label,
  trigger,
  items,
  align = "end",
  side = "bottom",
  buttonClassName = "",
}: {
  label: string;
  trigger: ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  side?: "bottom" | "top";
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Activity keeps hidden routes mounted; never come back to an open menu.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function onMenuKeyDown(event: React.KeyboardEvent) {
    const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
    const index = nodes.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      nodes[(index + 1) % nodes.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      nodes[(index - 1 + nodes.length) % nodes.length]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  const itemClass = (danger?: boolean) =>
    `flex h-10 w-full items-center gap-3 rounded-[2px] px-3 text-left text-sm outline-none transition-colors hover:bg-menu-hi focus-visible:bg-menu-hi ${
      danger ? "text-negative" : "text-fg"
    }`;

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={buttonClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={`absolute z-50 min-w-[14rem] animate-menu-in rounded-[4px] bg-menu p-1 shadow-[0_16px_24px_rgb(0_0_0/0.3),0_6px_8px_rgb(0_0_0/0.2)] ${
            align === "end" ? "right-0" : "left-0"
          } ${side === "bottom" ? "top-full mt-2 origin-top" : "bottom-full mb-2 origin-bottom"}`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                {Icon && <Icon aria-hidden className="size-4 shrink-0 text-subdued" />}
                <span className="truncate">{item.label}</span>
              </>
            );
            return (
              <div key={item.label}>
                {item.divider && <div className="my-1 h-px bg-[rgb(255_255_255/0.1)]" role="separator" />}
                {item.href ? (
                  <Link href={item.href} role="menuitem" tabIndex={-1} onClick={() => close(false)} className={itemClass(item.danger)}>
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => {
                      item.onSelect?.();
                      close();
                    }}
                    className={itemClass(item.danger)}
                  >
                    {content}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
