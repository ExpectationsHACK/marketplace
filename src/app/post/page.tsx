import { PostWizard, type Mode } from "./post-wizard";

export const metadata = { title: "Post to Sokoni" };

export default async function PostPage({ searchParams }: PageProps<"/post">) {
  const { mode } = await searchParams;
  const initial: Mode = mode === "classified" || mode === "product" ? mode : "choose";
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:pt-12">
      <PostWizard key={initial} initialMode={initial} />
    </div>
  );
}
