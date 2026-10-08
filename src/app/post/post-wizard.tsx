"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, FilePlus2, ImagePlus, PackagePlus, X } from "lucide-react";
import type { Category, Listing, Product } from "@/lib/types";
import { categories, categoryMeta, currentUser, formatPrice } from "@/lib/mock-data";
import { addProduct, createListing, getMergedStorefrontByOwnerId, useSellerData } from "@/lib/seller-store";
import { Cover } from "@/components/ui/cover";
import { TrustRing } from "@/components/ui/trust-ring";
import { buttonStyles, chipStyles, fieldHeight, inputStyles, labelStyles } from "@/components/ui/button";
import { WizardDone, WizardFrame } from "@/components/wizard-frame";
import { downscaleImage } from "@/lib/image";

export type Mode = "choose" | "classified" | "product";

const CURRENCIES = [
  { code: "NGN", label: "₦ NGN" },
  { code: "GHS", label: "GH₵ GHS" },
  { code: "KES", label: "KSh KES" },
  { code: "UGX", label: "USh UGX" },
];

const PRODUCT_CATEGORIES = ["Fabric", "Ready to Wear", "Accessories", "Sneakers", "Streetwear", "Skincare", "Haircare", "General"];

export function PostWizard({ initialMode }: { initialMode: Mode }) {
  const local = useSellerData();
  const storefront = getMergedStorefrontByOwnerId(currentUser.id, local);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [category, setCategory] = useState<Category>("FOR_SALE");
  const [productCategory, setProductCategory] = useState("General");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [city, setCity] = useState(storefront?.city.split(",")[0] ?? "");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Listing | Product | null>(null);

  const priceNumber = price === "" ? undefined : Number(price);
  const priceOk = mode === "product" ? priceNumber !== undefined && priceNumber >= 0 : priceNumber === undefined || priceNumber >= 0;
  const valid = title.trim().length > 2 && description.trim().length > 9 && priceOk && (mode !== "classified" || city.trim().length > 1);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "classified") {
        setCreated(
          await createListing({
            sellerId: currentUser.id,
            category,
            title: title.trim(),
            description: description.trim(),
            price: priceNumber,
            currency,
            city: city.trim(),
            country: "",
            images: photo ? [photo] : [],
          }),
        );
      } else if (storefront) {
        setCreated(
          await addProduct({
            storefrontId: storefront.id,
            title: title.trim(),
            price: priceNumber ?? 0,
            currency,
            category: productCategory,
            description: description.trim(),
            images: photo ? [photo] : [],
          }),
        );
      }
    } catch {
      setError("We couldn't publish this. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setCreated(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setPhoto(null);
    setTouched(false);
  }

  if (created) {
    const isListing = "sellerId" in created;
    return (
      <div className="mx-auto max-w-md">
        <WizardDone title={isListing ? "Your listing is live" : "Added to your catalog"}>
          <p className="mt-3 text-subdued">
            “{created.title}” is now on Sokoni. Manage it any time from your seller hub.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={isListing ? `/listing/${created.id}` : `/s/${storefront?.slug ?? ""}`}
              className={buttonStyles("primary", "md")}
            >
              {isListing ? "View listing" : "View your shop"}
            </Link>
            <button type="button" onClick={reset} className={buttonStyles("outline", "md")}>
              Post another
            </button>
          </div>
        </WizardDone>
      </div>
    );
  }

  if (mode === "choose") {
    const options = [
      {
        id: "classified" as const,
        icon: FilePlus2,
        title: "Post a listing",
        body: "A one-off item, rental, job, service, or gig. Free, and live until it sells or expires.",
      },
      {
        id: "product" as const,
        icon: PackagePlus,
        title: "Add a product to your shop",
        body: storefront
          ? `Goes straight into ${storefront.name}'s catalog with WhatsApp ordering.`
          : "You'll need a shop first — it takes about two minutes.",
      },
    ];
    return (
      <div className="max-w-2xl">
        <h1 className="text-[2rem] font-black leading-tight tracking-[-0.03em] sm:text-5xl">What are you posting?</h1>
        <p className="mt-2 text-subdued">Both live under the same identity and trust score.</p>
        <ul className="mt-8 space-y-2">
          {options.map(({ id, icon: Icon, title: optionTitle, body }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => setMode(id)}
                className="group flex w-full items-center gap-4 rounded-lg bg-surface p-5 text-left transition-colors hover:bg-surface-hi"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-tint-hi">
                  <Icon className="size-6 text-fg" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold">{optionTitle}</span>
                  <span className="mt-0.5 block text-subdued">{body}</span>
                </span>
                <ChevronRight className="size-6 shrink-0 text-subdued transition-transform group-hover:translate-x-1 group-hover:text-fg" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (mode === "product" && !storefront) {
    return (
      <div className="max-w-md">
        <WizardFrame step={2} total={2} title="Open a shop first" onBack={() => setMode("choose")}>
          <p className="text-subdued">Products live in a shop catalog. Opening one takes about two minutes.</p>
          <Link href="/onboarding" className={buttonStyles("primary", "md", "mt-8 w-full")}>
            Open a shop
          </Link>
        </WizardFrame>
      </div>
    );
  }

  const isListing = mode === "classified";
  const showError = (bad: boolean) => (touched && bad) || undefined;

  return (
    <div className="grid grid-cols-1 gap-12 @4xl/main:grid-cols-[minmax(0,32rem)_minmax(0,1fr)]">
      <form onSubmit={submit} noValidate>
        <WizardFrame
          step={2}
          total={2}
          title={isListing ? "Post a listing" : `Add to ${storefront?.name}`}
          onBack={() => setMode("choose")}
        >
          <div className="space-y-6">
            <fieldset>
              <legend className={labelStyles}>Category</legend>
              <div className="flex flex-wrap gap-2">
                {isListing
                  ? categories.map((cat) => (
                      <button key={cat} type="button" aria-pressed={category === cat} onClick={() => setCategory(cat)} className={chipStyles(category === cat)}>
                        {categoryMeta[cat].label}
                      </button>
                    ))
                  : PRODUCT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={productCategory === cat}
                        onClick={() => setProductCategory(cat)}
                        className={chipStyles(productCategory === cat)}
                      >
                        {cat}
                      </button>
                    ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="post-title" className={labelStyles}>
                Title
              </label>
              <input
                id="post-title"
                autoFocus
                value={title}
                maxLength={80}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isListing ? "e.g. iPhone 13 Pro, 256GB" : "e.g. Premium Ankara — 6 yards"}
                aria-invalid={showError(title.trim().length < 3)}
                className={`${inputStyles} ${fieldHeight}`}
              />
            </div>

            <div>
              <p className={labelStyles}>
                Photo <span className="font-normal text-subdued">(optional)</span>
              </p>
              {photo ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
                  <img src={photo} alt="Your listing photo" className="size-24 rounded-md object-cover" />
                  <button type="button" onClick={() => setPhoto(null)} className={buttonStyles("outline", "sm")}>
                    <X className="-ml-1 size-4" aria-hidden />
                    Remove photo
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="post-photo"
                  className="flex cursor-pointer items-center gap-4 rounded-[4px] px-4 py-4 shadow-[inset_0_0_0_1px_var(--color-faint)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-fg)] has-[:focus-visible]:shadow-[inset_0_0_0_2px_var(--color-fg)]"
                >
                  <ImagePlus className="size-6 shrink-0 text-subdued" aria-hidden />
                  <span>
                    <span className="block font-semibold">Add a photo</span>
                    <span className="block text-sm text-subdued">It becomes the cover everywhere this appears. Skip it and we generate one.</span>
                  </span>
                  <input
                    id="post-photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setPhotoError(null);
                      try {
                        setPhoto(await downscaleImage(file));
                      } catch {
                        setPhotoError("We couldn't read that file. Try a JPG or PNG photo.");
                      }
                    }}
                  />
                </label>
              )}
              {photoError && <p className="mt-2 text-sm text-negative">{photoError}</p>}
            </div>

            <div>
              <label htmlFor="post-description" className={labelStyles}>
                Description
              </label>
              <textarea
                id="post-description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Condition, size, what's included, pickup or delivery…"
                aria-invalid={showError(description.trim().length < 10)}
                className={`${inputStyles} resize-y py-3`}
              />
            </div>

            <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3">
              <div>
                <label htmlFor="post-currency" className={labelStyles}>
                  Currency
                </label>
                <select
                  id="post-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`${inputStyles} ${fieldHeight} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-8`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b3b3b3' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="post-price" className={labelStyles}>
                  Price {isListing && <span className="font-normal text-subdued">(optional)</span>}
                </label>
                <input
                  id="post-price"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={isListing ? "Leave blank for “contact for price”" : "0"}
                  aria-invalid={showError(!priceOk)}
                  className={`${inputStyles} ${fieldHeight} tabular`}
                />
              </div>
            </div>

            {isListing && (
              <div>
                <label htmlFor="post-city" className={labelStyles}>
                  City
                </label>
                <input
                  id="post-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos"
                  autoComplete="address-level2"
                  aria-invalid={showError(city.trim().length < 2)}
                  className={`${inputStyles} ${fieldHeight}`}
                />
              </div>
            )}

            {touched && !valid && (
              <p className="text-sm text-negative">
                Still needed:{" "}
                {[
                  title.trim().length < 3 && "a title",
                  description.trim().length < 10 && "a description (10+ characters)",
                  !priceOk && (isListing ? "a valid price" : "a price"),
                  isListing && city.trim().length < 2 && "your city",
                ]
                  .filter(Boolean)
                  .join(", ")}
                .
              </p>
            )}
            {error && <p className="text-sm text-negative">{error}</p>}
          </div>

          <button type="submit" disabled={submitting} className={buttonStyles("primary", "md", "mt-10 w-full")}>
            {submitting ? "Publishing…" : isListing ? "Publish listing" : "Add to catalog"}
          </button>
        </WizardFrame>
      </form>

      {/* Live preview: exactly the card buyers will see in a shelf */}
      <aside aria-label="Preview" className="hidden @4xl/main:block">
        <p className="mb-3 text-sm font-bold text-subdued">Preview</p>
        <div className="w-60 rounded-card bg-tint p-3">
          <Cover
            seed={title || "preview"}
            image={photo ?? undefined}
            title={title || "Your listing"}
            category={isListing ? category : productCategory}
            className="aspect-square w-full shadow-[0_8px_24px_rgb(0_0_0/0.5)]"
            rounded="rounded-md"
          />
          <p className="mt-3 line-clamp-2 font-semibold">{title || "Your title appears here"}</p>
          <p className="tabular mt-1 font-semibold">{formatPrice(priceNumber, currency)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-subdued">
            <TrustRing score={currentUser.trustScore} verified={currentUser.verified} size={14} stroke={2.5} />
            {currentUser.name.split(" ")[0]} · {isListing ? city || "Your city" : storefront?.city.split(",")[0]}
          </p>
        </div>
        <p className="mt-4 max-w-60 text-sm text-subdued">
          {photo ? "Your photo is the cover." : "No photo yet, so the cover is generated from your title."}
        </p>
      </aside>
    </div>
  );
}
