"use client";

import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";
import ResetPasswordForm from "./ResetPasswordForm";

function ResetPasswordFormWrapper() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset Password">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordFormWrapper />
      </Suspense>
    </AuthLayout>
  );
}
