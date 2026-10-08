"use client";

import Link from "next/link";
import { useState } from "react";
import { Camera, FileUp, Lock, ScanFace, Search, Smartphone } from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { toast } from "@/lib/toast-store";
import { buttonStyles, inputStyles, labelStyles } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { WizardDone, WizardFrame } from "@/components/wizard-frame";

const BENEFITS = [
  { icon: VerifiedBadgeIcon, text: "A blue verified badge on your listings, shop, and profile" },
  { icon: Search, text: "Higher placement in search and category browsing" },
  { icon: Lock, text: "Your documents are used only to confirm it's you, never shown to buyers" },
];

function VerifiedBadgeIcon({ className }: { className?: string }) {
  return <VerifiedBadge size={20} label={null} className={className} />;
}

const STEPS = [
  { key: "phone", title: "Confirm your phone number", icon: Smartphone },
  { key: "id", title: "Upload a government ID", icon: FileUp },
  { key: "selfie", title: "Take a quick selfie", icon: ScanFace },
] as const;

function maskPhone(phone: string) {
  const d = phone.replace(/\s/g, "");
  return `${d.slice(0, 4)} ••• ${d.slice(-4)}`;
}

export function VerifyWizard() {
  const [previewing, setPreviewing] = useState(!currentUser.verified);
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [idFile, setIdFile] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const valid = [code.length === 6, !!idFile, !!selfie][step];

  function next(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;
    setTouched(false);
    if (step < STEPS.length - 1) setStep(step + 1);
    else setSubmitted(true);
  }

  const benefits = (
    <aside aria-label="Why verify" className="h-fit rounded-lg bg-surface p-6">
      <h2 className="text-lg font-bold">What verification gets you</h2>
      <ul className="mt-4 space-y-4">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <span className="text-subdued">{text}</span>
          </li>
        ))}
      </ul>
    </aside>
  );

  if (!previewing) {
    return (
      <div className="grid grid-cols-1 gap-12 @4xl/main:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <VerifiedBadge size={64} label={null} />
          <h1 className="mt-6 text-[2rem] font-black leading-tight tracking-[-0.03em] sm:text-5xl">You&apos;re verified</h1>
          <p className="mt-3 max-w-xl text-subdued">
            Your phone, ID, and selfie have been checked. Buyers see the blue badge next to your name on every listing, your shop,
            and your profile.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/profile/${currentUser.id}`} className={buttonStyles("primary", "md")}>
              View your profile
            </Link>
            <button type="button" onClick={() => setPreviewing(true)} className={buttonStyles("outline", "md")}>
              See the steps
            </button>
          </div>
        </div>
        {benefits}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md">
        <WizardDone title="Submitted for review">
          <p className="mt-3 text-subdued">
            We usually review documents within 24 hours. Your trust score updates automatically once you&apos;re approved.
          </p>
          <Link href="/dashboard" className={buttonStyles("primary", "md", "mt-8")}>
            Back to seller hub
          </Link>
        </WizardDone>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="grid grid-cols-1 gap-12 @4xl/main:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div>
        <h1 className="mb-10 text-[2rem] font-black leading-tight tracking-[-0.03em] sm:text-5xl">Get verified</h1>
        <form onSubmit={next} noValidate>
          <WizardFrame step={step + 1} total={STEPS.length} title={current.title} onBack={step > 0 ? () => setStep(step - 1) : undefined}>
            {current.key === "phone" && (
              <div>
                <label htmlFor="verify-code" className={labelStyles}>
                  6-digit code
                </label>
                <input
                  id="verify-code"
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  aria-invalid={(touched && code.length !== 6) || undefined}
                  aria-describedby="code-hint"
                  className={`${inputStyles} tabular h-14 text-center text-2xl font-bold tracking-[0.5em]`}
                />
                <p id="code-hint" className={`mt-2 text-sm ${touched && code.length !== 6 ? "text-negative" : "text-subdued"}`}>
                  {touched && code.length !== 6
                    ? "Enter all 6 digits."
                    : `Sent by SMS to ${maskPhone(currentUser.phone)}. Demo: any 6 digits work.`}
                </p>
                <button
                  type="button"
                  onClick={() => toast("A new code is on its way")}
                  className="mt-3 text-sm font-bold text-fg hover:underline"
                >
                  Resend code
                </button>
              </div>
            )}

            {current.key === "id" && (
              <FilePick
                id="verify-id"
                icon={FileUp}
                accept="image/*,.pdf"
                prompt="National ID, passport, or driver's licence"
                hint="A clear photo or PDF, all four corners visible."
                file={idFile}
                onPick={setIdFile}
                invalid={touched && !idFile}
              />
            )}

            {current.key === "selfie" && (
              <FilePick
                id="verify-selfie"
                icon={Camera}
                accept="image/*"
                capture="user"
                prompt="Take or upload a selfie"
                hint="Face the camera in good light. We match it to your ID photo."
                file={selfie}
                onPick={setSelfie}
                invalid={touched && !selfie}
              />
            )}

            <button type="submit" className={buttonStyles("primary", "md", "mt-10 w-full")}>
              {step === STEPS.length - 1 ? "Submit for review" : "Next"}
            </button>
          </WizardFrame>
        </form>
      </div>
      <div className="@4xl/main:pt-24">{benefits}</div>
    </div>
  );
}

function FilePick({
  id,
  icon: Icon,
  accept,
  capture,
  prompt,
  hint,
  file,
  onPick,
  invalid,
}: {
  id: string;
  icon: typeof FileUp;
  accept: string;
  capture?: "user";
  prompt: string;
  hint: string;
  file: string | null;
  onPick: (name: string | null) => void;
  invalid: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg bg-surface px-6 py-10 text-center transition-colors hover:bg-surface-hi has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg ${
          invalid ? "shadow-[inset_0_0_0_1px_var(--color-negative)]" : "shadow-[inset_0_0_0_1px_var(--color-faint)]"
        }`}
      >
        <Icon className="size-8 text-fg" strokeWidth={1.5} aria-hidden />
        <span className="font-bold">{file ?? prompt}</span>
        <span className="text-sm text-subdued">{file ? "Tap to choose a different file" : hint}</span>
        <input
          id={id}
          type="file"
          accept={accept}
          capture={capture}
          className="sr-only"
          onChange={(e) => onPick(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      {invalid && <p className="mt-2 text-sm text-negative">Choose a file to continue.</p>}
    </div>
  );
}
