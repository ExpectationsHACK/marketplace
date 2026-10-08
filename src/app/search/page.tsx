import { SearchView, type SearchType } from "./search-view";

export async function generateMetadata({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  return { title: query ? `Search: ${query}` : "Search" };
}

const TYPES: SearchType[] = ["all", "listings", "shops", "sellers"];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  // Repeated params arrive as arrays; take the first rather than crash.
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = first(params.q).trim();
  const rawType = first(params.type) as SearchType;
  const type = TYPES.includes(rawType) ? rawType : "all";
  return <SearchView q={q} type={type} />;
}
