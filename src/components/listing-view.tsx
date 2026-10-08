import Link from "next/link";
import { Clock, Ellipsis, Flag, Link2, MapPin, MessageCircle, Search, Star, User } from "lucide-react";
import type { Listing, Storefront, User as Person } from "@/lib/types";
import { categoryMeta, formatPrice, timeAgo, trustLabel } from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { Avatar, Cover } from "@/components/ui/cover";
import { TrustRing } from "@/components/ui/trust-ring";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles, iconButtonStyles } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { EntityPage, Dot } from "@/components/entity";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ListingCard } from "@/components/listing-card";
import { Shelf, pagePad } from "@/components/shelf";
import { RecordView, SaveButton, ShareButton, copyText } from "@/components/library-actions";
import { toast } from "@/lib/toast-store";
import { currentUser } from "@/lib/mock-data";

const statusCopy: Partial<Record<Listing["status"], string>> = {
  SOLD: "This item has been sold.",
  EXPIRED: "This listing has expired.",
  REMOVED: "This listing was taken down by the seller.",
};

/**
 * A listing's page in Spotify's album grammar: cover beside a huge title,
 * an action bar (WhatsApp is the white primary; in-app chat beside it),
 * then the details, the seller's trust, and related shelves.
 * Rendered client-side so a seller's local edits (sold, renewed) show here.
 */
export function ListingView({
  listing,
  seller,
  storefront,
  rating,
  reviewCount,
  moreFromSeller,
  related,
}: {
  listing: Listing;
  seller: Person | undefined;
  storefront: Storefront | undefined;
  rating: number;
  reviewCount: number;
  moreFromSeller: Listing[];
  related: Listing[];
}) {
  const category = categoryMeta[listing.category];
  const live = listing.status === "ACTIVE";
  const isMine = listing.sellerId === currentUser.id;
  const whatsappNumber = storefront?.whatsappNumber ?? seller?.phone;
  const place = listing.location.country ? `${listing.location.city}, ${listing.location.country}` : listing.location.city;
  const messageHref = seller ? `/messages?with=${seller.id}&listing=${listing.id}` : "/messages";

  return (
    <>
      <RecordView kind="listing" id={listing.id} />
      <EntityPage
        color={seedColor(listing.id)}
        art={<Cover seed={listing.id} image={listing.images[0]} title={listing.title} category={listing.category} className="aspect-square w-full" />}
        title={listing.title}
        meta={
          <>
            <Link href={`/listings/${listing.category}`} className="font-bold hover:underline">
              {category.label}
            </Link>
            <Dot />
            {seller && (
              <Link href={`/profile/${seller.id}`} className="inline-flex items-center gap-1.5 font-bold hover:underline">
                <Avatar seed={seller.id} name={seller.name} size={24} />
                {seller.name}
                {seller.verified && <VerifiedBadge size={16} label="Verified seller" />}
              </Link>
            )}
            {seller && (
              <>
                <Dot />
                <Link href={`/profile/${seller.id}`} className="inline-flex items-center gap-1.5 font-bold hover:underline">
                  <TrustRing score={seller.trustScore} verified={seller.verified} size={18} stroke={2.5} />
                  {trustLabel(seller.trustScore).label} · {seller.trustScore}
                </Link>
              </>
            )}
            <Dot />
            <span>{place}</span>
            <Dot />
            <time dateTime={listing.createdAt} suppressHydrationWarning>
              {timeAgo(listing.createdAt)}
            </time>
            <Dot />
            <span className="tabular font-bold">{formatPrice(listing.price, listing.currency)}</span>
          </>
        }
        stickyAction={
          live && whatsappNumber && !isMine ? (
            <WhatsAppButton
              number={whatsappNumber}
              size="sm"
              label="Chat on WhatsApp"
              message={`Hi ${seller?.name.split(" ")[0] ?? "there"}, is "${listing.title}" still available? I found it on Sokoni.`}
            />
          ) : undefined
        }
        actions={
          <>
            {live && whatsappNumber && !isMine && (
              <WhatsAppButton
                number={whatsappNumber}
                size="lg"
                className="w-full sm:w-auto"
                message={`Hi ${seller?.name.split(" ")[0] ?? "there"}, is "${listing.title}" still available? I found it on Sokoni.`}
              />
            )}
            {live && !isMine && (
              <Link href={messageHref} className={buttonStyles("outline", "lg", "w-full sm:w-auto")}>
                <MessageCircle className="-ml-1 size-5" aria-hidden />
                Message seller
              </Link>
            )}
            {isMine && (
              <Link href="/dashboard/listings" className={buttonStyles("outline", "lg")}>
                Manage listing
              </Link>
            )}
            <div className="flex items-center gap-2">
              <SaveButton listingId={listing.id} title={listing.title} />
              <ShareButton path={`/listing/${listing.id}`} title={listing.title} />
              <Menu
                label={`More options for ${listing.title}`}
                align="start"
                buttonClassName={iconButtonStyles("md")}
                trigger={<Ellipsis className="size-7" aria-hidden />}
                items={[
                  ...(seller ? [{ label: "Go to seller profile", icon: User, href: `/profile/${seller.id}` }] : []),
                  {
                    label: "Copy listing link",
                    icon: Link2,
                    onSelect: () => copyText(`${window.location.origin}/listing/${listing.id}`),
                  },
                  ...(!isMine
                    ? [
                        {
                          label: "Report listing",
                          icon: Flag,
                          divider: true,
                          onSelect: () => toast("Thanks — our trust team will review this listing"),
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </>
        }
      >
        <div className={`${pagePad} grid grid-cols-1 gap-10 pb-6 @4xl/main:grid-cols-[minmax(0,1fr)_20rem] @5xl/main:grid-cols-[minmax(0,1fr)_24rem]`}>
          <div className="min-w-0">
            {!live && statusCopy[listing.status] && (
              <p className="mb-6 rounded-lg bg-surface px-4 py-3 font-semibold text-fg">{statusCopy[listing.status]}</p>
            )}

            <section aria-labelledby="about-listing">
              <h2 id="about-listing" className="text-2xl font-bold tracking-[-0.02em]">
                About this listing
              </h2>
              <p className="mt-3 max-w-[65ch] whitespace-pre-line text-base leading-relaxed text-subdued">{listing.description}</p>
            </section>

            <dl className="mt-8 grid max-w-2xl grid-cols-1 border-t border-line text-sm sm:grid-cols-2">
              {[
                ["Category", category.label],
                ["Location", place],
                ["Price", formatPrice(listing.price, listing.currency)],
                ["Status", live ? "Available" : (listing.status[0] + listing.status.slice(1).toLowerCase())],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 border-b border-line py-3 sm:pr-6 sm:[&:nth-child(even)]:pl-6 sm:[&:nth-child(even)]:pr-0">
                  <dt className="text-subdued">{term}</dt>
                  <dd className="tabular text-right font-semibold text-fg">{value}</dd>
                </div>
              ))}
            </dl>

            {live && !isMine && <BuyingTips />}
          </div>

          {seller && (
            <SellerCard
              seller={seller}
              storefront={storefront}
              rating={rating}
              reviewCount={reviewCount}
              messageHref={isMine ? undefined : messageHref}
            />
          )}
        </div>

        <div className={pagePad}>
          {moreFromSeller.length > 0 && seller && (
            <Shelf title={`More from ${seller.name.split(" ")[0]}`} href={`/profile/${seller.id}`}>
              {moreFromSeller.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </Shelf>
          )}
          {related.length > 0 && (
            <Shelf title={`More in ${category.label}`} href={`/listings/${listing.category}`}>
              {related.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </Shelf>
          )}
        </div>
      </EntityPage>
    </>
  );
}

export function SellerCard({
  seller,
  storefront,
  rating,
  reviewCount,
  messageHref,
}: {
  seller: Person;
  storefront: Storefront | undefined;
  rating: number;
  reviewCount: number;
  messageHref?: string;
}) {
  const response = seller.responseTime ? seller.responseTime[0].toUpperCase() + seller.responseTime.slice(1) : null;
  return (
    <aside aria-label="Seller" className="h-fit rounded-lg bg-surface p-5">
      <h2 className="font-bold text-fg">Sold by</h2>
      <Link href={`/profile/${seller.id}`} className="group mt-4 flex items-center gap-3">
        <Avatar seed={seller.id} name={seller.name} size={56} />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-lg font-bold text-fg group-hover:underline">
            <span className="truncate">{seller.name}</span>
            {seller.verified && <VerifiedBadge size={18} label="ID verified" />}
          </span>
          <span className="block text-sm text-subdued">Member since {new Date(seller.memberSince).getFullYear()}</span>
        </span>
      </Link>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-5">
        <TrustRing score={seller.trustScore} verified={seller.verified} size={48} showLabel />
        {reviewCount > 0 && (
          <span className="text-right text-sm text-subdued">
            <span className="tabular flex items-center justify-end gap-1 font-bold text-fg">
              <Star className="size-4 fill-fg text-fg" aria-hidden />
              {rating.toFixed(1)}
            </span>
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {response && (
        <p className="mt-4 flex items-center gap-2 text-sm text-subdued">
          <Clock className="size-4 shrink-0" aria-hidden />
          {response}
        </p>
      )}

      {storefront && (
        <Link
          href={`/s/${storefront.slug}`}
          className="mt-4 flex items-center gap-3 rounded-md bg-tint p-2 transition-colors hover:bg-tint-hi"
        >
          <Avatar seed={storefront.id} name={storefront.name} size={40} />
          <span className="min-w-0">
            <span className="block text-xs text-subdued">Also runs a shop</span>
            <span className="block truncate font-bold text-fg">{storefront.name}</span>
          </span>
        </Link>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {messageHref && (
          <Link href={messageHref} className={buttonStyles("outline", "sm")}>
            <MessageCircle className="-ml-1 size-4" aria-hidden />
            Message
          </Link>
        )}
        <Link href={`/profile/${seller.id}`} className={buttonStyles("outline", "sm")}>
          View profile
        </Link>
      </div>
    </aside>
  );
}

const TIPS = [
  { icon: MessageCircle, title: "Ask before you go", body: "Condition, what's included, and the final price — get it in writing in chat." },
  { icon: MapPin, title: "Meet somewhere public", body: "A busy café, mall or bank. Bring someone along for bigger items." },
  { icon: Search, title: "Check before you pay", body: "Test it in person. Pay only for what you've seen." },
  { icon: Flag, title: "Report anything off", body: "Use “Report listing” in the menu and our trust team will look." },
];

function BuyingTips() {
  return (
    <section aria-labelledby="tips-heading" className="mt-10 max-w-3xl rounded-lg bg-surface p-5 sm:p-6">
      <h2 id="tips-heading" className="text-xl font-bold">
        Buying safely
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {TIPS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tint-hi text-fg">
              <Icon className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-bold text-fg">{title}</span>
              <span className="mt-0.5 block text-sm text-subdued">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
