import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Email verification
export async function sendVerificationEmail(email, token) {
  const link = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "StoreEase <onboarding@resend.dev>", // ✅ VERIFIED SENDER
    to: email,
    subject: "Verify your StoreEase account",
    html: `
      <h2>Welcome to StoreEase</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

// ✅ Forgot / Reset password
export async function sendResetPasswordEmail(email, token) {
  const link = `${process.env.APP_URL}/api/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "StoreEase <onboarding@resend.dev>", // ✅ VERIFIED SENDER
    to: email,
    subject: "Reset your StoreEase password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}
