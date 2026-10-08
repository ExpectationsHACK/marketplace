import { getListingById, listings } from "@/lib/mock-data";
import { ListingLookup } from "./listing-client-lookup";

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/listing/[id]">) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing" };
  return { title: listing.title, description: listing.description };
}

export default async function ListingDetailPage({ params }: PageProps<"/listing/[id]">) {
  const { id } = await params;
  // Seed listings render immediately; the client lookup then re-resolves
  // against this browser's local overlay (a listing marked sold, renewed,
  // or posted entirely locally via /post).
  return <ListingLookup id={id} />;
}
