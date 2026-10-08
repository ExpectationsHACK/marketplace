import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

/** Spotify's "Page not found": one icon, one line, one way home. */
export function NotFoundState({
  title = "Page not found",
  body = "We can't find the page you're looking for. It may have sold, expired, or moved.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <SearchX className="size-16 text-subdued" strokeWidth={1.25} aria-hidden />
      <h1 className="mt-6 text-[2rem] font-black leading-tight tracking-[-0.03em] text-fg sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-md text-subdued">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonStyles("primary", "md")}>
          Home
        </Link>
        <Link href="/search" className={buttonStyles("outline", "md")}>
          Browse all
        </Link>
      </div>
    </div>
  );
}
