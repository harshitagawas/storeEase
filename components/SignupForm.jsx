"use client";

import { useState } from "react";
import AuthInput from "./Inputs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
      });
      // Show success message and redirect to login or show verification message
      setError(""); // Clear any previous errors
      alert(
        "Verification email sent! Please check your email to verify your account."
      );
      router.push("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed. Please try again."
      );
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
      <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
      <AuthInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <AuthInput
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      <button
        onClick={handleSignup}
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
        Sign Up
      </button>
      <p
        className="text-sm mt-4 text-center"
        style={{
          color: "var(--foreground-secondary)",
          fontFamily: "var(--font-sora)",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium transition-opacity hover:opacity-80"
          style={{
            color: "var(--blue-sky)",
          }}
        >
          Login
        </Link>
      </p>
    </div>
  );
}
