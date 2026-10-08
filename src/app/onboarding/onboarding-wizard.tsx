"use client";

import Link from "next/link";
import { useState } from "react";
import { Link2 } from "lucide-react";
import type { Storefront } from "@/lib/types";
import { currentUser } from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { createStorefront, slugify } from "@/lib/seller-store";
import { ShopArt } from "@/components/ui/cover";
import { buttonStyles, chipStyles, fieldHeight, inputStyles, labelStyles } from "@/components/ui/button";
import { WizardDone, WizardFrame } from "@/components/wizard-frame";
import { WhatsAppGlyph } from "@/components/whatsapp-button";
import { copyText } from "@/components/library-actions";

const SHOP_CATEGORIES = [
  "Fashion & Fabric",
  "Beauty & Wellness",
  "Sneakers & Streetwear",
  "Electronics",
  "Food & Groceries",
  "Home & Living",
];

const STEP_TITLES = ["Tell us about your shop", "Where should orders go?", "Introduce your shop"];

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(SHOP_CATEGORIES[0]);
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Storefront | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(name) || "your-shop";
  const phoneOk = digits(whatsapp).length >= 9;
  const stepValid = [name.trim().length > 1 && city.trim().length > 1, phoneOk, true][step];

  async function next(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!stepValid) return;
    setTouched(false);
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const storefront = await createStorefront({
        ownerId: currentUser.id,
        name: name.trim(),
        bio: bio.trim(),
        whatsappNumber: whatsapp.trim(),
        category,
        city: city.trim(),
      });
      setCreated(storefront);
    } catch {
      setError("We couldn't create your shop. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    const url = `sokoni.africa/s/${created.slug}`;
    return (
      <div className="mx-auto max-w-md">
        <WizardDone title={`${created.name} is live`}>
          <button
            type="button"
            onClick={() => copyText(`https://${url}`)}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-tint px-4 py-2 text-sm text-fg hover:bg-tint-hi"
          >
            <Link2 className="size-4" aria-hidden />
            {url}
            <span className="sr-only">— copy link</span>
          </button>
          <p className="mt-4 text-subdued">
            Share the link anywhere. Customers browse your catalog and order straight into your WhatsApp. (In this demo your shop
            lives in this browser.)
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/post?mode=product" className={buttonStyles("primary", "md")}>
              Add your first product
            </Link>
            <Link href={`/s/${created.slug}`} className={buttonStyles("outline", "md")}>
              View your shop
            </Link>
          </div>
        </WizardDone>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 @4xl/main:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <form onSubmit={next} noValidate>
        <WizardFrame step={step + 1} total={3} title={STEP_TITLES[step]} onBack={step > 0 ? () => setStep(step - 1) : undefined}>
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="shop-name" className={labelStyles}>
                  Shop name
                </label>
                <input
                  id="shop-name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amara Fabrics & Ankara"
                  aria-invalid={(touched && name.trim().length < 2) || undefined}
                  aria-describedby="shop-name-hint"
                  className={`${inputStyles} ${fieldHeight}`}
                />
                <p id="shop-name-hint" className="mt-2 text-sm text-subdued">
                  Your link will be sokoni.africa/s/<span className="text-fg">{slug}</span>
                </p>
              </div>
              <fieldset>
                <legend className={labelStyles}>What do you sell?</legend>
                <div className="flex flex-wrap gap-2">
                  {SHOP_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={category === c}
                      onClick={() => setCategory(c)}
                      className={chipStyles(category === c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="shop-city" className={labelStyles}>
                  City
                </label>
                <input
                  id="shop-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                  autoComplete="address-level2"
                  aria-invalid={(touched && city.trim().length < 2) || undefined}
                  className={`${inputStyles} ${fieldHeight}`}
                />
              </div>
              {touched && !stepValid && <p className="text-sm text-negative">Add your shop name and city to continue.</p>}
            </div>
          )}

          {step === 1 && (
            <div>
              <label htmlFor="shop-whatsapp" className={labelStyles}>
                WhatsApp number
              </label>
              <input
                id="shop-whatsapp"
                autoFocus
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+234 800 000 0000"
                aria-invalid={(touched && !phoneOk) || undefined}
                aria-describedby="whatsapp-hint"
                className={`${inputStyles} ${fieldHeight}`}
              />
              <p id="whatsapp-hint" className={`mt-2 text-sm ${touched && !phoneOk ? "text-negative" : "text-subdued"}`}>
                {touched && !phoneOk
                  ? "Enter the full number, including the country code."
                  : "Orders and questions land here. We link to it — no API keys, no setup."}
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="shop-bio" className={labelStyles}>
                Shop bio <span className="font-normal text-subdued">(optional)</span>
              </label>
              <textarea
                id="shop-bio"
                autoFocus
                rows={5}
                maxLength={280}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What you sell, where you deliver, and what makes your shop different."
                className={`${inputStyles} resize-y py-3`}
              />
              <p className="tabular mt-1.5 text-right text-xs text-subdued">{bio.length}/280</p>
              {error && <p className="mt-2 text-sm text-negative">{error}</p>}
            </div>
          )}

          <button type="submit" disabled={submitting} className={buttonStyles("primary", "md", "mt-10 w-full")}>
            {submitting ? "Opening your shop…" : step === 2 ? "Open my shop" : "Next"}
          </button>
        </WizardFrame>
      </form>

      {/* Live preview: the shop header buyers will see */}
      <aside aria-label="Preview" className="hidden @4xl/main:block">
        <p className="mb-3 text-sm font-bold text-subdued">Preview</p>
        <div className="overflow-hidden rounded-lg bg-canvas shadow-[0_8px_24px_rgb(0_0_0/0.5)] ring-1 ring-line">
          <div className="relative h-40 transition-colors duration-500" style={{ backgroundColor: seedColor(slug) }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
            <div className="absolute bottom-4 left-5 right-5 flex items-end gap-4">
              <div className="size-20 shrink-0">
                <ShopArt seed={slug} name={name || "Your shop"} className="shadow-[0_4px_24px_rgb(0_0_0/0.5)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Shop</p>
                <p className="truncate text-3xl font-black tracking-[-0.03em]">{name || "Your shop name"}</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm text-subdued">
              {category}
              {city && ` · ${city}`}
            </p>
            <p className="mt-3 line-clamp-3 text-sm text-subdued">{bio || "Your bio appears here."}</p>
            <span className={buttonStyles("white", "sm", "pointer-events-none mt-5")} aria-hidden>
              <WhatsAppGlyph className="size-4" />
              Order on WhatsApp
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
