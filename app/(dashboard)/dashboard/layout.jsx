"use client";

import { useState } from "react";
import SideNav from "@/components/SideNav";
import DashboardHeader from "@/components/DashboardHeader";
import { DialogProvider } from "@/components/ui/Dialog";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DialogProvider>
      <div className="flex min-h-screen">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed position */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideNav onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main
          className="flex-1 lg:ml-[260px] transition-colors duration-300 w-full"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <div className="max-w-[1280px] mx-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg"
              style={{
                backgroundColor: "var(--card-background)",
                border: `1px solid var(--card-border)`,
                color: "var(--foreground)",
              }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Dashboard Header */}
            <DashboardHeader />

            {/* Page Content */}
            <div className="px-4 sm:px-6 pb-6 pt-4 lg:pt-0">{children}</div>
          </div>
        </main>
      </div>
    </DialogProvider>
  );
}
