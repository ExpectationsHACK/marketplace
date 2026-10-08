import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Clock, MessageCircle, Phone, Star } from "lucide-react";
import {
  currentUser,
  getAverageRating,
  getListingsBySeller,
  getReviewsForUser,
  getStorefrontByOwnerId,
  getUserById,
  trustLabel,
  users,
} from "@/lib/mock-data";
import { seedColor } from "@/lib/placeholder";
import { Avatar, ShopArt } from "@/components/ui/cover";
import { TrustRing } from "@/components/ui/trust-ring";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { buttonStyles } from "@/components/ui/button";
import { EntityPage, Dot } from "@/components/entity";
import { ListingCard } from "@/components/listing-card";
import { ShopCard } from "@/components/shop-card";
import { Shelf, pagePad } from "@/components/shelf";
import { ShareButton } from "@/components/library-actions";

export function generateStaticParams() {
  return users.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: PageProps<"/profile/[id]">) {
  const { id } = await params;
  const user = getUserById(id);
  return user ? { title: user.name, description: `${user.name} on Sokoni — trust score ${user.trustScore}/100.` } : {};
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden className={`size-4 ${i < rating ? "fill-fg text-fg" : "text-faint"}`} />
      ))}
    </span>
  );
}

export default async function ProfilePage({ params }: PageProps<"/profile/[id]">) {
  const { id } = await params;
  const user = getUserById(id);
  if (!user) notFound();

  const userReviews = getReviewsForUser(user.id);
  const rating = getAverageRating(user.id);
  const activeListings = getListingsBySeller(user.id).filter((l) => l.status === "ACTIVE");
  const storefront = getStorefrontByOwnerId(user.id);
  const isMe = user.id === currentUser.id;
  const since = new Date(user.memberSince).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  const { label } = trustLabel(user.trustScore);

  const signals = [
    {
      icon: BadgeCheck,
      title: user.verified ? "Identity verified" : "Identity not yet verified",
      body: user.verified ? "Government ID and selfie checked by Sokoni." : "This seller hasn't completed ID checks.",
      ok: user.verified,
    },
    { icon: Phone, title: "Phone confirmed", body: "Reachable on the number buyers chat with.", ok: true },
    {
      icon: Star,
      title: userReviews.length ? `${rating.toFixed(1)} from ${userReviews.length} ${userReviews.length === 1 ? "review" : "reviews"}` : "No reviews yet",
      body: "Left by buyers after a sale.",
      ok: userReviews.length > 0,
    },
    ...(user.responseTime
      ? [{ icon: Clock, title: user.responseTime[0].toUpperCase() + user.responseTime.slice(1), body: "Based on recent chats.", ok: true }]
      : []),
  ];

  return (
    <EntityPage
      color={seedColor(user.id)}
      round
      art={<ShopArt seed={user.id} name={user.name} />}
      title={user.name}
      meta={
        <>
          {user.verified ? (
            <span className="inline-flex items-center gap-1.5 font-bold">
              <VerifiedBadge size={16} label={null} /> ID verified
            </span>
          ) : (
            <span>Not yet verified</span>
          )}
          <Dot />
          <span>Member since {since}</span>
          <Dot />
          <span>
            {userReviews.length} {userReviews.length === 1 ? "review" : "reviews"}
          </span>
        </>
      }
      actions={
        <>
          {isMe ? (
            <Link href="/dashboard" className={buttonStyles("primary", "lg")}>
              Open seller hub
            </Link>
          ) : (
            <Link href={`/messages?with=${user.id}`} className={buttonStyles("outline", "lg")}>
              <MessageCircle className="-ml-1 size-5" aria-hidden />
              Message
            </Link>
          )}
          <ShareButton path={`/profile/${user.id}`} title={user.name} />
        </>
      }
    >
      <div className={pagePad}>
        <section aria-labelledby="trust-heading" className="mb-10">
          <h2 id="trust-heading" className="text-2xl font-bold tracking-[-0.02em]">
            Trust
          </h2>
          <div className="mt-4 grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-lg bg-line @3xl/main:grid-cols-[18rem_minmax(0,1fr)]">
            <div className="flex items-center gap-5 bg-surface p-6">
              <TrustRing score={user.trustScore} verified={user.verified} size={88} />
              <div>
                <p className="text-xl font-bold">{label}</p>
                <p className="mt-1 text-sm text-subdued">Trust score {user.trustScore} out of 100</p>
                {userReviews.length > 0 && (
                  <p className="tabular mt-2 flex items-center gap-1.5 text-sm font-bold">
                    <Star className="size-4 fill-fg" aria-hidden /> {rating.toFixed(1)} average
                  </p>
                )}
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
              {signals.map(({ icon: Icon, title, body, ok }) => (
                <li key={title} className="flex gap-3 bg-surface p-5">
                  <Icon className={`mt-0.5 size-5 shrink-0 ${ok ? "text-accent" : "text-faint"}`} aria-hidden />
                  <span>
                    <span className="block font-bold">{title}</span>
                    <span className="mt-0.5 block text-sm text-subdued">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {isMe && !user.verified && (
            <Link href="/verify" className={buttonStyles("primary", "sm", "mt-4")}>
              Get verified
            </Link>
          )}
        </section>

        <section aria-labelledby="reviews-heading" className="mb-10">
          <h2 id="reviews-heading" className="text-2xl font-bold tracking-[-0.02em]">
            Reviews
          </h2>
          {userReviews.length === 0 ? (
            <p className="mt-4 text-subdued">No reviews yet.</p>
          ) : (
            <ul className="mt-4 grid max-w-5xl grid-cols-1 gap-2 @3xl/main:grid-cols-2">
              {userReviews.map((review) => {
                const from = getUserById(review.fromUserId);
                return (
                  <li key={review.id} className="rounded-lg bg-surface p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Link href={from ? `/profile/${from.id}` : "#"} className="flex min-w-0 items-center gap-3 hover:underline">
                        {from && <Avatar seed={from.id} name={from.name} size={32} />}
                        <span className="truncate font-bold">{from?.name ?? "Sokoni user"}</span>
                      </Link>
                      <Stars rating={review.rating} />
                    </div>
                    {review.comment && <p className="mt-3 leading-relaxed text-subdued">{review.comment}</p>}
                    <p className="mt-3 text-xs text-subdued">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {storefront && (
          <Shelf title={isMe ? "Your shop" : "Shop"}>
            <ShopCard storefront={storefront} />
          </Shelf>
        )}

        {activeListings.length > 0 && (
          <Shelf title="Active listings">
            {activeListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </Shelf>
        )}
      </div>
    </EntityPage>
  );
}
