import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { iconButtonStyles } from "@/components/ui/button";

/**
 * Spotify's sign-up step: a thin green progress bar, a back chevron,
 * "Step n of m", and one bold question. One decision per screen.
 */
export function WizardFrame({
  step,
  total,
  title,
  onBack,
  children,
}: {
  step: number;
  total: number;
  title: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className="h-0.5 w-full rounded-full bg-faint/50"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out-expo"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="mt-6 flex items-center gap-2">
        {onBack ? (
          <button type="button" onClick={onBack} aria-label="Back" className={iconButtonStyles("md", "-ml-3 shrink-0")}>
            <ChevronLeft className="size-7" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0">
          <p className="text-subdued">
            Step {step} of {total}
          </p>
          <h2 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">{title}</h2>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/** Centered success state used at the end of every flow. */
export function WizardDone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent text-on-accent">
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <h2 className="mt-6 text-[2rem] font-black leading-tight tracking-[-0.03em]">{title}</h2>
      {children}
    </div>
  );
}
