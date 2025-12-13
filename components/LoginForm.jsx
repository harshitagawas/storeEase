"use client";

import { useState } from "react";
import AuthInput from "./Inputs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
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
      <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
      <AuthInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
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
        Don't have an account?{" "}
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
