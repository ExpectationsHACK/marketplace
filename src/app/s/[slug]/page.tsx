import { getStorefrontBySlug, storefronts } from "@/lib/mock-data";
import { StorefrontClientLookup } from "./storefront-client-lookup";

export function generateStaticParams() {
  return storefronts.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/s/[slug]">) {
  const { slug } = await params;
  const storefront = getStorefrontBySlug(slug);
  if (!storefront) return { title: "Shop" };
  return { title: storefront.name, description: storefront.bio };
}

export default async function StorefrontPage({ params }: PageProps<"/s/[slug]">) {
  const { slug } = await params;
  // Seed shops render instantly from the server snapshot; the client lookup
  // then re-resolves against this browser's local edits, and finds shops
  // created entirely locally via onboarding.
  return <StorefrontClientLookup slug={slug} />;
}
