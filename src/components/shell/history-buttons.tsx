"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { iconButtonStyles } from "@/components/ui/button";

// The Navigation API reports whether back/forward are possible (Chromium
// today). Where it's missing both stay enabled, like a browser's own arrows.
interface NavigationLike extends EventTarget {
  canGoBack: boolean;
  canGoForward: boolean;
}

function nav(): NavigationLike | undefined {
  return (globalThis as { navigation?: NavigationLike }).navigation;
}

function subscribe(onChange: () => void) {
  const n = nav();
  n?.addEventListener("currententrychange", onChange);
  return () => n?.removeEventListener("currententrychange", onChange);
}

function snapshot() {
  const n = nav();
  return n ? `${n.canGoBack ? 1 : 0}${n.canGoForward ? 1 : 0}` : "11";
}

/** Spotify desktop's ‹ › history arrows. */
export function HistoryButtons() {
  const router = useRouter();
  const state = useSyncExternalStore(subscribe, snapshot, () => "11");
  const button = iconButtonStyles("sm", "bg-black/60 text-fg disabled:pointer-events-none disabled:opacity-40");
  return (
    <div className="flex items-center gap-2 collapsed:hidden">
      <button type="button" onClick={() => router.back()} disabled={state[0] === "0"} aria-label="Go back" className={button}>
        <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden />
      </button>
      <button type="button" onClick={() => router.forward()} disabled={state[1] === "0"} aria-label="Go forward" className={button}>
        <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
