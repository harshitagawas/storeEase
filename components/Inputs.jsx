"use client";

export default function AuthInput({ label, type, value, onChange }) {
  return (
    <div className="mb-4">
      <label
        className="block mb-1 text-sm transition-colors duration-200"
        style={{
          color: "var(--foreground-secondary)",
          fontFamily: "var(--font-sora)",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg outline-none transition-all duration-200 focus:ring-2"
        style={{
          backgroundColor: "var(--background-secondary)",
          color: "var(--foreground)",
          border: `1px solid var(--border-color)`,
          fontFamily: "var(--font-sora)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--blue-sky)";
          e.target.style.boxShadow = `0 0 0 2px rgba(124, 160, 254, 0.2)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
