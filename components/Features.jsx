"use client";

import { useTheme } from "next-themes";

const IconBrain = () => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className="w-10 h-10 text-purple-500"
    fill="none"
  >
    <path
      d="M22 20c-6 0-10 4.5-10 10.5 0 4.7 1.5 7 4.5 9.5-1.2 4 1.6 7 5.5 7h2"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M42 20c6 0 10 4.5 10 10.5 0 4.7-1.5 7-4.5 9.5 1.2 4-1.6 7-5.5 7h-2"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M32 14v36"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M23 16c0 6 9 6 9 0M32 30c0 6 9 6 9 0M23 30c0 6 9 6 9 0M32 44c0 6 9 6 9 0"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const IconShield = () => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className="w-10 h-10 text-blue-500"
    fill="none"
  >
    <path
      d="M32 54c-12-5-18-13-18-24V16l18-6 18 6v14c0 11-6 19-18 24Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M24 32l6 6 10-12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconFiles = () => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className="w-12 h-12 text-indigo-500"
    fill="none"
  >
    <path
      d="M26 12h20v40H26l-8-8V20l8-8Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M18 20h8v8h-8v-8Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M30 28h16M30 36h16M30 44h10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const IconFormats = () => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className="w-12 h-12 text-orange-400"
    fill="none"
  >
    <rect
      x="14"
      y="12"
      width="20"
      height="24"
      rx="3"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect
      x="30"
      y="20"
      width="20"
      height="28"
      rx="3"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.85"
    />
    <path
      d="M20 20h8M20 28h8M36 28h8M36 36h8"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const cardBase =
  "relative overflow-hidden rounded-2xl border border-[var(--color-card-border)]  shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.16)]";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-[rgba(124,160,254,0.16)] text-[var(--color-foreground)]";

export default function Features() {
  const { theme, resolvedTheme } = useTheme();
  const isDark =
    theme === "dark" || resolvedTheme === "dark" || resolvedTheme === "system";

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div
          className="absolute inset-16 rounded-[48px] blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(124,160,254,0.28), transparent 35%), radial-gradient(circle at 80% 10%, rgba(153,121,223,0.24), transparent 32%), radial-gradient(circle at 70% 70%, rgba(229,224,246,0.35), transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg,rgba(26,26,26,0.55),rgba(37,37,37,0.75))"
              : "transparent",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <div className="space-y-3 max-w-3xl">
          <div className={badgeClass}>StoreEase · Smart Digital Locker</div>
          <h2
            className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--foreground)",
            }}
          >
            Modern features that keep your files organized, intelligent, and
            secure.
          </h2>
          <p
            className="text-lg leading-relaxed text-[var(--color-foreground-secondary)]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            A bento grid built for clarity—highlighting how StoreEase delivers
            effortless management, flexible formats, AI understanding, and
            trust-first protection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
          <article className={cardBase}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,160,254,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(153,121,223,0.12),transparent_40%)]" />
            <div className="relative flex h-full flex-col justify-between gap-8 p-8 md:p-10">
              <div className="flex flex-col gap-4 max-w-xl">
                <div className={badgeClass}>Smart File Management</div>
                <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)]">
                  Organize anything, find everything instantly.
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-[var(--color-foreground-secondary)]">
                  Organize files into folders, subfolders, and categories with
                  seamless navigation and instant access. Fluid breadcrumbs,
                  quick filters, and a clean hierarchy keep teams in flow.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-blue-sky)]" />
                  Deep folder nesting without clutter
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-purple-deep)]" />
                  Lightning-fast previews and search
                </div>
              </div>
            </div>
          </article>

          <article className={cardBase}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,208,170,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(124,160,254,0.14),transparent_45%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6 p-7 md:p-8">
              <div className="flex flex-col gap-3">
                <div className={badgeClass}>Seamless File Handling</div>
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-foreground)]">
                  Multi-format uploads, previews, and sharing.
                </h3>
                <p className="text-base leading-relaxed text-[var(--color-foreground-secondary)]">
                  Upload and manage PDFs, images, documents, and more — all in
                  one secure digital locker with consistent previews and smooth
                  drag-and-drop.
                </p>
              </div>
              <div className="relative flex flex-wrap items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-[#1f1f1f]/80">
                  <IconFormats />
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  {[
                    { label: "PDF", color: "var(--color-orange-bright)" },
                    { label: "IMG", color: "var(--color-blue-sky)" },
                    { label: "DOC", color: "var(--color-purple-deep)" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background-secondary)] px-3 py-2 text-center text-sm font-semibold text-[var(--color-foreground)]"
                    >
                      <span
                        className="mb-1 inline-flex h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className={cardBase}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(153,121,223,0.12),transparent_45%)]" />
            <div className="relative flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <div className={badgeClass}>AI Document Intelligence</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(153,121,223,0.14)] text-[var(--color-purple-deep)]">
                  <IconBrain />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                Summaries and key insights—automatically.
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground-secondary)]">
                Generate concise summaries and extract highlights from any
                document with zero setup. Surface what matters before you even
                open the file.
              </p>
            </div>
          </article>

          <article className={cardBase}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,160,254,0.12),transparent_40%)]" />
            <div className="relative flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <div className={badgeClass}>Secure &amp; Private Storage</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(124,160,254,0.14)] text-[var(--color-blue-sky)]">
                  <IconShield />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                Built-in encryption and access control.
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground-secondary)]">
                Files stay protected with authentication, role-based access, and
                encrypted storage. Calm, trustworthy protection without added
                friction.
              </p>
              <div className="mt-auto flex items-center gap-3 text-sm font-medium text-[var(--color-foreground)]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-blue-sky)]" />
                Zero-trust sharing · Audit trails
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
