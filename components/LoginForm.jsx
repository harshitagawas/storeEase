"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import AuthInput from "./Inputs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const hasProcessedReset = useRef(false);

  useEffect(() => {
    // Only process reset success message once
    if (!hasProcessedReset.current && searchParams.get("reset") === "success") {
      hasProcessedReset.current = true;
      // Use setTimeout to defer state update and avoid cascading renders
      setTimeout(() => {
        setSuccess(
          "Password reset successful! You can now login with your new password."
        );
      }, 0);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;

      // Store token in localStorage (for client-side access)
      localStorage.setItem("token", token);

      // Also set cookie for middleware to check (server-side access)
      // This allows middleware.js to verify authentication
      document.cookie = `auth-token=${token}; path=/; max-age=604800; SameSite=Lax`; // 7 days

      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
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
      <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
      <AuthInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <div className="text-right mb-2">
        <Link
          href="/forgot-password"
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            color: "var(--blue-sky)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Forgot password?
        </Link>
      </div>
      <button
        onClick={handleLogin}
        className="w-full py-2 mt-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        style={{
          backgroundColor: "var(--blue-sky)",
          fontFamily: "var(--font-sora)",
          boxShadow: `0 4px 14px 0 rgba(124, 160, 254, 0.3)`,
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = `0 4px 20px rgba(124, 160, 254, 0.4)`;
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = `0 4px 14px 0 rgba(124, 160, 254, 0.3)`;
        }}
      >
        Login
      </button>
      <p
        className="text-sm mt-4 text-center"
        style={{
          color: "var(--foreground-secondary)",
          fontFamily: "var(--font-sora)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium transition-opacity hover:opacity-80"
          style={{
            color: "var(--blue-sky)",
          }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
