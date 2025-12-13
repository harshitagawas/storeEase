"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Navbar />
      <Hero />
    </div>
  );
}
