import { currentUser } from "@/lib/mock-data";
import { MessagesInbox } from "@/components/messages-inbox";
import { pagePad } from "@/components/shelf";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: PageProps<"/messages">) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return (
    <div className={`${pagePad} pb-6 pt-4 sm:pt-8`}>
      <h1 className="mb-6 text-2xl font-bold tracking-[-0.02em] sm:text-[2rem]">Messages</h1>
      <MessagesInbox userId={currentUser.id} withUser={first(params.with)} listingId={first(params.listing)} />
    </div>
  );
}
