import { notFound } from "next/navigation";
import { categories, categoryMeta, isCategory } from "@/lib/mock-data";
import { CategoryView } from "./category-view";

export function generateStaticParams() {
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/listings/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const meta = categoryMeta[category];
  return { title: meta.label, description: meta.blurb };
}

export default async function CategoryPage({ params }: PageProps<"/listings/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  return <CategoryView category={category} />;
}
