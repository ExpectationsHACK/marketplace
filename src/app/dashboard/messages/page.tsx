import { currentUser } from "@/lib/mock-data";
import { MessagesInbox } from "@/components/messages-inbox";

export const metadata = { title: "Messages" };

export default function DashboardMessagesPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold tracking-[-0.02em]">Messages</h2>
      <MessagesInbox userId={currentUser.id} />
    </div>
  );
}
