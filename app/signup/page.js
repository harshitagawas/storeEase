"use client";

import AuthLayout from "@/components/AuthLayout";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout title="Sign Up">
      <SignupForm />
    </AuthLayout>
  );
}
