"use client";

import { useEffect } from "react";
import { Bookmark, Share } from "lucide-react";
import { isFollowing, isSaved, recordView, toggleFollowing, toggleSaved, useLibrary } from "@/lib/library-store";
import { toast } from "@/lib/toast-store";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";

/**
 * Save a listing to Your Library.
 * - "corner": the bookmark on a card's photo, always visible (touch too);
 *   turns green and filled once saved.
 * - "icon": the 32px circle-plus of an entity action bar; turns into a green check.
 * - "small": the 18px version that sits beside the item in the deal bar.
 */
export function SaveButton({
  listingId,
  title,
  variant = "icon",
}: {
  listingId: string;
  title: string;
  variant?: "corner" | "icon" | "small";
}) {
  const library = useLibrary();
  const saved = isSaved(library, listingId);
  const label = saved ? `Remove ${title} from saved items` : `Save ${title}`;

  async function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const next = await toggleSaved(listingId);
    toast(next ? "Saved — find it under Saved items" : "Removed from saved items");
  }

  if (variant === "corner") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={saved}
        title={saved ? "Saved" : "Save"}
        className={`relative z-10 flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-[transform,background-color] duration-100 hover:scale-[1.06] active:scale-100 ${
          saved ? "bg-accent text-on-accent" : "bg-black/60 text-fg hover:bg-black/80"
        }`}
      >
        <Bookmark className={`size-[1.125rem] ${saved ? "fill-current" : ""}`} strokeWidth={2.25} aria-hidden />
      </button>
    );
  }

  if (variant === "small") {
    return (
      <button type="button" onClick={onClick} aria-label={label} aria-pressed={saved} className={iconButtonStyles("sm")}>
        <Bookmark
          className={`size-[1.125rem] ${saved ? "fill-accent text-accent" : ""}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={saved} className={iconButtonStyles("md")}>
      <Bookmark className={`size-7 ${saved ? "fill-accent text-accent" : ""}`} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

/** Follow a shop: the outline Follow / Following pill. */
export function FollowButton({
  storefrontId,
  name,
}: {
  storefrontId: string;
  name: string;
}) {
  const library = useLibrary();
  const following = isFollowing(library, storefrontId);

  async function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const next = await toggleFollowing(storefrontId);
    toast(next ? `Following ${name}` : `Unfollowed ${name}`);
  }

  return (
    <button type="button" onClick={onClick} aria-pressed={following} className={buttonStyles("outline", "sm", "min-w-[6.5rem]")}>
      {following ? "Following" : "Follow"}
    </button>
  );
}

/** Copies the canonical URL (or opens the native share sheet on touch devices). */
export function ShareButton({ path, title }: { path: string; title: string }) {
  async function onClick() {
    const url = `${window.location.origin}${path}`;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // dismissed — fall through to copying
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    } catch {
      toast("Couldn't copy the link — copy it from the address bar");
    }
  }
  return (
    <button type="button" onClick={onClick} aria-label={`Share ${title}`} className={iconButtonStyles("md")}>
      <Share className="size-6" strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export async function copyText(text: string, success = "Link copied to clipboard") {
  try {
    await navigator.clipboard.writeText(text);
    toast(success);
  } catch {
    toast("Couldn't copy — select and copy it manually");
  }
}

/** Records a visit for the "Recently viewed" shelf. Renders nothing. */
export function RecordView({ kind, id }: { kind: "listing" | "shop"; id: string }) {
  useEffect(() => {
    recordView(kind, id);
  }, [kind, id]);
  return null;
}
