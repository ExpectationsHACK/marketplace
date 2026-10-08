import Link from "next/link";

// The mark is an open trust ring closing on a dot: Sokoni's signature
// element (the seller Trust Ring) reduced to a logo. Deliberately not a
// filled circle, so it never reads as Spotify's mark.
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={`shrink-0 ${className}`} aria-hidden>
      <circle
        cx="16"
        cy="16"
        r="11.5"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="50 72.3"
        transform="rotate(10.5 16 16)"
      />
      <circle cx="24.1" cy="7.9" r="3.1" fill="var(--color-fg)" />
    </svg>
  );
}

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Sokoni home"
      className={`inline-flex items-center gap-2 rounded-full text-fg transition-transform duration-100 hover:scale-[1.03] ${className}`}
    >
      <LogoMark />
      {!compact && <span className="text-[1.375rem] font-extrabold tracking-[-0.045em]">sokoni</span>}
    </Link>
  );
}
