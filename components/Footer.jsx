"use client";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--color-card-border)] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm text-[var(--color-foreground-secondary)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          © {new Date().getFullYear()} StoreEase – Smart Digital Locker. All
          rights reserved.
        </p>
        <p
          className="text-xs text-[var(--color-foreground-secondary)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Built for secure, organized, multi-format file workflows.
        </p>
      </div>
    </footer>
  );
}
