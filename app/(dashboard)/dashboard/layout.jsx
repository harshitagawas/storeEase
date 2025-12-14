import SideNav from "@/components/SideNav";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed position */}
      <aside className="fixed inset-y-0 left-0 z-10">
        <SideNav />
      </aside>

      {/* Main content */}
      <main
        className="flex-1 ml-[260px] transition-colors duration-300"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div className="max-w-[1280px] mx-auto">
          {/* Dashboard Header */}
          <DashboardHeader />

          {/* Page Content */}
          <div className="px-6 pb-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
