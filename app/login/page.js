"use client";

import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  );
}
