// Blue rosette with a white check — the universal "verified" mark, the same
// role Spotify's Verified Artist badge plays. Points are precomputed once.
const ROSETTE = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 ? 9.3 : 11;
  const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

export function VerifiedBadge({ size = 16, className = "", label = "Verified" }: { size?: number; className?: string; label?: string | null }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    >
      <polygon points={ROSETTE} fill="var(--color-verified-fill)" stroke="var(--color-verified-fill)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m7.9 12.4 2.7 2.7 5.5-5.6" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
