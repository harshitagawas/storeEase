"use client";

import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/LoginForm";

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <AuthLayout title="Login">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </AuthLayout>
  );
}
