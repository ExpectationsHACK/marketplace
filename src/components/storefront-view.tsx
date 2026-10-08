"use client";

import Link from "next/link";
import { useState } from "react";
import { Ellipsis, Link2, Pencil, User } from "lucide-react";
import type { Listing, Product, Storefront, User as Person } from "@/lib/types";
import { currentUser, formatPrice, trustLabel } from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { Cover } from "@/components/ui/cover";
import { TrustRing } from "@/components/ui/trust-ring";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { EntityPage, Dot } from "@/components/entity";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ListingCard } from "@/components/listing-card";
import { Shelf, pagePad } from "@/components/shelf";
import { FollowButton, RecordView, ShareButton, copyText } from "@/components/library-actions";

const planLabel: Record<Storefront["plan"], string> = {
  FREE: "Free plan",
  PRO: "Pro shop",
  BUSINESS: "Business shop",
};

const CATALOG_PREVIEW = 5;

/**
 * The shop's banner is its own color field (like every entity header), with
 * the catalog's covers printed into it as a faint grayscale texture.
 */
function ShopBanner({ storefront, catalog }: { storefront: Storefront; catalog: Product[] }) {
  const tiles = catalog.length > 0 ? catalog : [{ id: storefront.id, title: storefront.name, category: storefront.category }];
  return (
    <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
      <div className="absolute -inset-x-[15%] -inset-y-[45%] grid rotate-[-8deg] grid-cols-4 gap-3 opacity-[0.22] mix-blend-luminosity grayscale sm:grid-cols-6 @4xl/main:grid-cols-8">
        {Array.from({ length: 32 }, (_, i) => {
          const item = tiles[i % tiles.length];
          return (
            <Cover
              key={i}
              seed={`${item.id}${i >= tiles.length ? `-${Math.floor(i / tiles.length)}` : ""}`}
              title={item.title}
              category={item.category}
              className="aspect-square w-full"
              rounded="rounded-md"
              decorative
            />
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
    </div>
  );
}

export function StorefrontView({
  storefront,
  owner,
  catalog,
  oneOffListings,
}: {
  storefront: Storefront;
  owner: Person | undefined;
  catalog: Product[];
  oneOffListings: Listing[];
}) {
  const [showAll, setShowAll] = useState(false);
  const isMine = storefront.ownerId === currentUser.id;
  const shown = showAll ? catalog : catalog.slice(0, CATALOG_PREVIEW);
  const shopPath = `/s/${storefront.slug}`;
  const firstName = owner?.name.split(" ")[0];

  return (
    <>
      <RecordView kind="shop" id={storefront.id} />
      <EntityPage
        banner
        color={seedColor(storefront.id)}
        art={<ShopBanner storefront={storefront} catalog={catalog} />}
        title={storefront.name}
        titleAdornment={storefront.isVerified ? <VerifiedBadge size={48} label="Verified shop" /> : undefined}
        meta={
          <>
            {owner && (
              <>
                <Link href={`/profile/${owner.id}`} className="inline-flex items-center gap-1.5 font-bold hover:underline">
                  <TrustRing score={owner.trustScore} verified={owner.verified} size={18} stroke={2.5} />
                  {trustLabel(owner.trustScore).label} · {owner.trustScore}
                </Link>
                <Dot />
              </>
            )}
            {storefront.isVerified && (
              <>
                <span>Verified</span>
                <Dot />
              </>
            )}
            <span className="tabular">{storefront.followers.toLocaleString("en-US")} followers</span>
            <Dot />
            <span>{storefront.category}</span>
            <Dot />
            <span>{storefront.city}</span>
          </>
        }
        stickyAction={
          storefront.whatsappNumber && !isMine ? (
            <WhatsAppButton
              number={storefront.whatsappNumber}
              size="sm"
              label="Order"
              message={`Hi ${storefront.name}, I found your shop on Sokoni and I'd like to order.`}
            />
          ) : undefined
        }
        actions={
          <>
            {isMine ? (
              <Link href="/dashboard/storefront" className={buttonStyles("primary", "lg")}>
                <Pencil className="-ml-1 size-5" aria-hidden />
                Edit shop
              </Link>
            ) : (
              storefront.whatsappNumber && (
                <WhatsAppButton
                  number={storefront.whatsappNumber}
                  size="lg"
                  className="w-full sm:w-auto"
                  label="Order on WhatsApp"
                  message={`Hi ${storefront.name}, I found your shop on Sokoni and I'd like to order.`}
                />
              )
            )}
            <div className="flex items-center gap-4">
              {!isMine && <FollowButton storefrontId={storefront.id} name={storefront.name} />}
              <ShareButton path={shopPath} title={storefront.name} />
              <Menu
                label={`More options for ${storefront.name}`}
                align="start"
                buttonClassName={iconButtonStyles("md")}
                trigger={<Ellipsis className="size-7" aria-hidden />}
                items={[
                  { label: "Copy shop link", icon: Link2, onSelect: () => copyText(`${window.location.origin}${shopPath}`) },
                  ...(owner ? [{ label: "Go to owner profile", icon: User, href: `/profile/${owner.id}` }] : []),
                ]}
              />
            </div>
          </>
        }
      >
        <div className={pagePad}>
          <section aria-labelledby="catalog-heading" className="mb-10">
            <h2 id="catalog-heading" className="text-2xl font-bold tracking-[-0.02em]">
              Catalog
            </h2>
            {catalog.length === 0 ? (
              <p className="mt-4 text-subdued">
                {isMine ? (
                  <>
                    Your catalog is empty.{" "}
                    <Link href="/post?mode=product" className="font-bold text-fg hover:underline">
                      Add your first product
                    </Link>
                  </>
                ) : (
                  "No products listed yet."
                )}
              </p>
            ) : (
              <>
                <div
                  aria-hidden
                  className="mt-4 hidden max-w-4xl grid-cols-[minmax(0,1fr)_7rem_7rem] gap-4 border-b border-line px-4 pb-2 text-sm text-subdued sm:grid"
                >
                  <span>Product</span>
                  <span className="text-right">Price</span>
                  <span />
                </div>
                <ul className="mt-2 max-w-4xl sm:mt-3">
                  {shown.map((product) => (
                    <li
                      key={product.id}
                      className="group grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[4px] px-2 py-2 transition-colors hover:bg-tint sm:grid-cols-[minmax(0,1fr)_7rem_7rem] sm:px-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Cover seed={product.id} image={product.images[0]} title={product.title} category={product.category} className="size-10 shrink-0" />
                        <div className="min-w-0">
                          <p className={`line-clamp-2 sm:truncate ${product.inStock ? "text-fg" : "text-subdued"}`}>{product.title}</p>
                          <p className="truncate text-sm text-subdued">
                            <span className="tabular text-fg sm:hidden">{formatPrice(product.price, product.currency)} · </span>
                            {product.inStock ? product.description : "Out of stock"}
                          </p>
                        </div>
                      </div>
                      <span className="tabular hidden text-right text-subdued sm:block">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {!isMine && storefront.whatsappNumber ? (
                        <WhatsAppButton
                          number={storefront.whatsappNumber}
                          variant="outline"
                          size="sm"
                          className="justify-self-end"
                          label={product.inStock ? "Order" : "Restock?"}
                          message={
                            product.inStock
                              ? `Hi ${storefront.name}, I'd like to order "${product.title}" (${formatPrice(product.price, product.currency)}) from your Sokoni shop.`
                              : `Hi ${storefront.name}, will "${product.title}" be back in stock soon?`
                          }
                        />
                      ) : (
                        <span className={`justify-self-end text-sm ${product.inStock ? "text-subdued" : "text-warning"}`}>
                          {product.inStock ? "In stock" : "Out of stock"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {catalog.length > CATALOG_PREVIEW && (
                  <button
                    type="button"
                    onClick={() => setShowAll((s) => !s)}
                    className="mt-3 px-4 text-sm font-bold text-subdued transition-colors hover:text-fg"
                  >
                    {showAll ? "Show less" : `See all ${catalog.length} products`}
                  </button>
                )}
              </>
            )}
          </section>

          <section aria-labelledby="about-shop" className="mb-10">
            <h2 id="about-shop" className="text-2xl font-bold tracking-[-0.02em]">
              About
            </h2>
            <div className="mt-4 grid max-w-4xl grid-cols-1 overflow-hidden rounded-lg bg-surface @3xl/main:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="p-6">
                <p className="tabular text-lg font-bold text-fg">
                  {storefront.followers.toLocaleString("en-US")} followers
                </p>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-subdued">{storefront.bio || "This shop hasn't written a bio yet."}</p>
                <button
                  type="button"
                  onClick={() => copyText(`${window.location.origin}${shopPath}`)}
                  className="mt-5 rounded-full bg-tint px-3 py-1.5 text-sm text-subdued transition-colors hover:bg-tint-hi hover:text-fg"
                >
                  sokoni.africa{shopPath}
                  <span className="sr-only"> — copy link</span>
                </button>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-line @3xl/main:grid-cols-1">
                <div className="bg-surface px-6 py-4">
                  <dt className="text-sm text-subdued">Response rate</dt>
                  <dd className="tabular mt-1 text-xl font-bold">{storefront.responseRate}%</dd>
                </div>
                <div className="bg-surface px-6 py-4">
                  <dt className="text-sm text-subdued">Plan</dt>
                  <dd className="mt-1 text-xl font-bold">{planLabel[storefront.plan]}</dd>
                </div>
                {owner && (
                  <div className="col-span-2 bg-surface px-6 py-4 @3xl/main:col-span-1">
                    <dt className="text-sm text-subdued">Run by</dt>
                    <dd className="mt-2">
                      <Link href={`/profile/${owner.id}`} className="group flex items-center gap-3">
                        <TrustRing score={owner.trustScore} verified={owner.verified} size={40} />
                        <span className="font-bold group-hover:underline">{owner.name}</span>
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {oneOffListings.length > 0 && owner && (
            <Shelf title={`Also posted by ${firstName}`} href={`/profile/${owner.id}`}>
              {oneOffListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </Shelf>
          )}
        </div>
      </EntityPage>
    </>
  );
}
