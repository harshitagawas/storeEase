"use client";

import { useState } from "react";
import AuthInput from "@/components/Inputs";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setSuccess(
        "If an account with that email exists, we've sent a password reset link."
      );
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p
          className="text-sm mb-3 text-center transition-colors duration-200"
          style={{
            color: "#ef4444",
            fontFamily: "var(--font-sora)",
          }}
        >
          {error}
        </p>
      )}
      {success && (
        <p
          className="text-sm mb-3 text-center transition-colors duration-200"
          style={{
            color: "#10b981",
            fontFamily: "var(--font-sora)",
          }}
        >
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--blue-sky)",
            fontFamily: "var(--font-sora)",
            boxShadow: `0 4px 14px 0 rgba(124, 160, 254, 0.3)`,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.boxShadow = `0 4px 20px rgba(124, 160, 254, 0.4)`;
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = `0 4px 14px 0 rgba(124, 160, 254, 0.3)`;
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p
        className="text-sm mt-4 text-center"
        style={{
          color: "var(--foreground-secondary)",
          fontFamily: "var(--font-sora)",
        }}
      >
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium transition-opacity hover:opacity-80"
          style={{
            color: "var(--blue-sky)",
          }}
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
}
