import SideNav from "@/components/SideNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-[260px] fixed inset-y-0 left-0 border-r border-black/5 dark:border-white/10 bg-background">
        <SideNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-[260px]">
        <div className="px-6 py-6 max-w-[1280px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
