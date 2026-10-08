import { trustLabel } from "@/lib/mock-data";

// Sokoni's signature element: a seller's 0–100 trust score drawn as a ring.
// Green when highly trusted, amber while trust is building, gray when new.
const toneColor: Record<"high" | "mid" | "low", string> = {
  high: "var(--color-accent)",
  mid: "var(--color-warning)",
  low: "var(--color-faint)",
};

export function TrustRing({
  score,
  verified,
  size = 44,
  showLabel = false,
  stroke,
}: {
  score: number;
  verified: boolean;
  size?: number;
  showLabel?: boolean;
  stroke?: number;
}) {
  const { label, tone } = trustLabel(score);
  const width = stroke ?? Math.max(2, size * 0.08);
  const radius = (size - width) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = toneColor[tone];
  const showNumber = size >= 28;

  return (
    <span
      className="inline-flex items-center gap-3"
      role="img"
      aria-label={`Trust score ${score} out of 100, ${label}${verified ? ", identity verified" : ""}`}
    >
      <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth={width} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {showNumber && (
          <span
            className="tabular absolute inset-0 flex items-center justify-center font-bold text-fg"
            style={{ fontSize: Math.max(10, size * 0.32) }}
            aria-hidden
          >
            {score}
          </span>
        )}
      </span>
      {showLabel && (
        <span className="leading-tight" aria-hidden>
          <span className="block text-sm font-bold text-fg">{label}</span>
          <span className="block text-sm text-subdued">Trust score {score}/100</span>
        </span>
      )}
    </span>
  );
}
