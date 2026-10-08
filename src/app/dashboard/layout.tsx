import { currentUser } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/cover";
import { pagePad } from "@/components/shelf";
import { DashboardTabs } from "./dashboard-tabs";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className={`${pagePad} pb-6 pt-6 sm:pt-10`}>
      <header className="flex items-center gap-4">
        <Avatar seed={currentUser.id} name={currentUser.name} size={64} className="hidden sm:inline-flex" />
        <div className="min-w-0">
          <h1 className="text-[2rem] font-black leading-tight tracking-[-0.03em] sm:text-5xl">Seller hub</h1>
          <p className="mt-1 text-subdued">{currentUser.name}</p>
        </div>
      </header>
      <DashboardTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}
