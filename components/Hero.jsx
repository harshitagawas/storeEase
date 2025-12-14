"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden h-screen flex items-center">
      {/* Elegant Gradient Glow */}
      <div
        className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg opacity-60"
        style={{
          background: `linear-gradient(106.89deg, 
            var(--purple-deep) 15.73%, 
            var(--blue-sky) 15.74%, 
            var(--violet-mist) 56.49%, 
            var(--indigo-soft) 115.91%)`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center h-full">
        {/* LEFT TEXT BLOCK */}
        <div className="space-y-6 flex flex-col justify-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--foreground)",
              background: `linear-gradient(135deg, var(--foreground) 0%, var(--purple-deep) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            EASY AND SECURE
            <br />
            ACCESS TO YOUR
            <br />
            <span style={{ color: "var(--blue-sky)" }}>PRIVATE FILES</span>
          </h1>

          <p
            className="text-lg max-w-lg leading-relaxed"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            Store, share, and co-work on files from any device. Safe. Fast.
            Designed for modern creators who want privacy with power.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/signup">
              <button
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--blue-sky)",
                  color: "white",
                  boxShadow: `0 4px 20px rgba(124, 160, 254, 0.4)`,
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE BLOCK */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full">
            <div
              className="text-center space-y-4"
              style={{ color: "var(--foreground-secondary)" }}
            >
              <Image
                src="/collecting.svg"
                alt="Hero Image"
                width={700}
                height={700}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
