"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthInput from "@/components/Inputs";
import axios from "axios";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", { token, password });
      // Redirect to login with success message
      router.push("/login?reset=success");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div>
        <p
          className="text-sm mb-3 text-center transition-colors duration-200"
          style={{
            color: "#ef4444",
            fontFamily: "var(--font-sora)",
          }}
        >
          Invalid reset link. Please request a new password reset.
        </p>
      </div>
    );
  }

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
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="New Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <AuthInput
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
