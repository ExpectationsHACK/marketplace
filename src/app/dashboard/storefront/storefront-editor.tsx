"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Link2, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { currentUser, formatPrice } from "@/lib/mock-data";
import {
  getMergedProductsByStorefront,
  getMergedStorefrontByOwnerId,
  isHydrated,
  updateProduct,
  updateStorefront,
  useSellerData,
} from "@/lib/seller-store";
import { toast } from "@/lib/toast-store";
import { Avatar, Cover } from "@/components/ui/cover";
import { buttonStyles, fieldHeight, inputStyles, labelStyles } from "@/components/ui/button";
import { copyText } from "@/components/library-actions";

// Only claims the product already makes; plan pricing and limits aren't decided yet.
const PLAN_COPY = {
  FREE: { name: "Free", body: "Upgrade to unlock unlimited catalog items and priority placement." },
  PRO: { name: "Pro", body: "Upgrade to Business to unlock unlimited catalog items and priority placement." },
  BUSINESS: { name: "Business", body: "Unlimited catalog items, priority placement in search, and dedicated support." },
} as const;

export function StorefrontEditor() {
  const local = useSellerData();
  const storefront = getMergedStorefrontByOwnerId(currentUser.id, local);

  const [name, setName] = useState(storefront?.name ?? "");
  const [bio, setBio] = useState(storefront?.bio ?? "");
  const [whatsapp, setWhatsapp] = useState(storefront?.whatsappNumber ?? "");
  const [city, setCity] = useState(storefront?.city ?? "");
  const [domain, setDomain] = useState(storefront?.customDomain ?? "");
  const [saving, setSaving] = useState(false);

  // Seed the form once real client data is available. The first render(s)
  // use the empty pre-hydration snapshot, so the initializers above may hold
  // seed values; re-sync once past it, and if the storefront itself changes.
  // Adjusted during render, per React's guidance for derived state.
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const key = storefront && isHydrated(local) ? storefront.id : null;
  if (storefront && key && key !== syncedKey) {
    setSyncedKey(key);
    setName(storefront.name);
    setBio(storefront.bio);
    setWhatsapp(storefront.whatsappNumber);
    setCity(storefront.city);
    setDomain(storefront.customDomain ?? "");
  }

  if (!storefront) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-surface px-6 py-14 text-center">
        <p className="text-xl font-bold">You don&apos;t have a shop yet</p>
        <p className="mt-1 max-w-sm text-subdued">A shop gives you a permanent link, a catalog, and orders straight to your WhatsApp.</p>
        <Link href="/onboarding" className={buttonStyles("primary", "sm", "mt-6")}>
          Open a shop
        </Link>
      </div>
    );
  }

  const catalog = getMergedProductsByStorefront(storefront.id, local);
  const dirty =
    name !== storefront.name || bio !== storefront.bio || whatsapp !== storefront.whatsappNumber || city !== storefront.city;
  const plan = PLAN_COPY[storefront.plan];
  const shopUrl = `sokoni.africa/s/${storefront.slug}`;

  async function saveDetails(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateStorefront(storefront!.id, { name: name.trim(), bio, whatsappNumber: whatsapp, city });
      toast("Shop details saved");
    } finally {
      setSaving(false);
    }
  }

  async function saveDomain(event: React.FormEvent) {
    event.preventDefault();
    const value = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    setDomain(value);
    await updateStorefront(storefront!.id, {
      customDomain: value || undefined,
      domainStatus: value ? "PENDING" : "NONE",
    });
    toast(value ? `${value} reserved — verification pending` : "Custom domain removed");
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar seed={storefront.id} name={storefront.name} size={56} />
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold tracking-[-0.02em]">{storefront.name}</h2>
            <button
              type="button"
              onClick={() => copyText(`https://${shopUrl}`)}
              className="inline-flex items-center gap-1.5 text-sm text-subdued hover:text-fg"
            >
              <Link2 className="size-4" aria-hidden />
              {shopUrl}
              <span className="sr-only">— copy link</span>
            </button>
          </div>
        </div>
        <Link href={`/s/${storefront.slug}`} className={buttonStyles("outline", "sm")}>
          View live shop
          <ExternalLink className="-mr-1 size-4" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 @4xl/main:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={saveDetails} aria-labelledby="details-heading" className="max-w-2xl">
          <h3 id="details-heading" className="text-xl font-bold">
            Shop details
          </h3>
          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="shop-name" className={labelStyles}>
                Shop name
              </label>
              <input
                id="shop-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!name.trim() || undefined}
                className={`${inputStyles} ${fieldHeight}`}
              />
            </div>
            <div>
              <label htmlFor="shop-bio" className={labelStyles}>
                Bio
              </label>
              <textarea
                id="shop-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={280}
                className={`${inputStyles} resize-y py-3`}
              />
              <p className="tabular mt-1.5 text-right text-xs text-subdued">{bio.length}/280</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="shop-whatsapp" className={labelStyles}>
                  WhatsApp number
                </label>
                <input
                  id="shop-whatsapp"
                  type="tel"
                  inputMode="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`${inputStyles} ${fieldHeight}`}
                />
              </div>
              <div>
                <label htmlFor="shop-city" className={labelStyles}>
                  City
                </label>
                <input id="shop-city" value={city} onChange={(e) => setCity(e.target.value)} className={`${inputStyles} ${fieldHeight}`} />
              </div>
            </div>
            <button type="submit" disabled={saving || !dirty || !name.trim()} className={buttonStyles("primary", "md")}>
              {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <section aria-labelledby="plan-heading" className="rounded-lg bg-surface p-5">
            <h3 id="plan-heading" className="font-bold">
              {plan.name} plan
            </h3>
            <p className="mt-2 text-sm text-subdued">{plan.body}</p>
            {storefront.plan !== "BUSINESS" && (
              <p className="mt-3 text-sm text-subdued">Plan changes open once billing is connected.</p>
            )}
          </section>

          <form onSubmit={saveDomain} aria-labelledby="domain-heading" className="rounded-lg bg-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 id="domain-heading" className="font-bold">
                Custom domain
              </h3>
              {storefront.domainStatus === "PENDING" && (
                <span className="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-warning">Pending</span>
              )}
            </div>
            <p className="mt-2 text-sm text-subdued">
              Use your own address instead of the sokoni.africa link. We reserve it now; DNS and SSL checks run once the backend
              is live.
            </p>
            <label htmlFor="shop-domain" className="sr-only">
              Domain
            </label>
            <input
              id="shop-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourshop.com"
              className={`${inputStyles} mt-4 h-10 text-sm`}
            />
            <button type="submit" className={buttonStyles("outline", "sm", "mt-3")}>
              {storefront.customDomain ? "Update domain" : "Reserve domain"}
            </button>
          </form>
        </div>
      </div>

      <section aria-labelledby="catalog-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 id="catalog-heading" className="text-xl font-bold">
            Catalog <span className="tabular text-subdued">{catalog.length}</span>
          </h3>
          <Link href="/post?mode=product" className={buttonStyles("primary", "sm")}>
            <Plus className="-ml-1 size-4" strokeWidth={3} aria-hidden />
            Add product
          </Link>
        </div>
        {catalog.length === 0 ? (
          <p className="rounded-lg bg-surface p-6 text-subdued">
            No products yet.{" "}
            <Link href="/post?mode=product" className="font-bold text-fg hover:underline">
              Add your first one
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-lg bg-surface">
            {catalog.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(String(product.price));

  async function toggleStock() {
    await updateProduct(product.id, { inStock: !product.inStock });
    toast(product.inStock ? `${product.title} marked out of stock` : `${product.title} is back in stock`);
  }

  async function savePrice(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(price);
    if (!Number.isFinite(value) || value < 0) return;
    await updateProduct(product.id, { price: Math.round(value) });
    setEditing(false);
    toast("Price updated");
  }

  return (
    <li className="flex flex-wrap items-center gap-4 p-3 sm:px-4">
      <Cover seed={product.id} image={product.images[0]} title={product.title} category={product.category} className="size-12 shrink-0" decorative />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{product.title}</p>
        <p className="truncate text-sm text-subdued">{product.category}</p>
      </div>

      {editing ? (
        <form onSubmit={savePrice} className="flex items-center gap-2">
          <label htmlFor={`price-${product.id}`} className="sr-only">
            Price in {product.currency}
          </label>
          <input
            id={`price-${product.id}`}
            type="number"
            min={0}
            inputMode="numeric"
            autoFocus
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputStyles} tabular h-9 w-32 text-sm`}
          />
          <button type="submit" className={buttonStyles("primary", "sm")}>
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setPrice(String(product.price));
              setEditing(false);
            }}
            className={buttonStyles("ghost", "sm", "px-2")}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="tabular rounded-full px-3 py-1 text-sm text-fg transition-colors hover:bg-tint"
          aria-label={`Edit price of ${product.title}, currently ${formatPrice(product.price, product.currency)}`}
        >
          {formatPrice(product.price, product.currency)}
        </button>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={product.inStock}
        onClick={toggleStock}
        className="flex items-center gap-2 text-sm text-subdued"
      >
        <span
          aria-hidden
          className={`relative h-5 w-9 rounded-full transition-colors ${product.inStock ? "bg-accent" : "bg-faint"}`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-black transition-transform duration-150 ${
              product.inStock ? "translate-x-[1.125rem]" : "translate-x-0.5"
            }`}
          />
        </span>
        <span className="w-[5.5rem] text-left">{product.inStock ? "In stock" : "Out of stock"}</span>
      </button>
    </li>
  );
}
