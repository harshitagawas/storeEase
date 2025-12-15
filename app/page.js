"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function LandingPage() {
  // const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

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
      <Features />
      <Footer />
    </div>
  );
}
