import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Email verification
export async function sendVerificationEmail(email, token) {
  try {
    // Get APP_URL from environment or use default for local development
    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const link = `${appUrl}/api/auth/verify-email?token=${token}`;

    const result = await resend.emails.send({
      from: "StoreEase <onboarding@resend.dev>", // ✅ VERIFIED SENDER
      to: email,
      subject: "Verify your StoreEase account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to StoreEase</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for signing up! Please verify your email address by clicking the link below:
          </p>
          <div style="margin: 30px 0;">
            <a href="${link}" 
               style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #3b82f6; font-size: 12px; word-break: break-all;">
            ${link}
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend email error:", result.error);
      throw new Error(
        `Failed to send email: ${result.error.message || "Unknown error"}`
      );
    }

    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

// ✅ Forgot / Reset password
export async function sendResetPasswordEmail(email, token) {
  try {
    // Get APP_URL from environment or use default for local development
    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const link = `${appUrl}/reset-password?token=${token}`;

    const result = await resend.emails.send({
      from: "StoreEase <onboarding@resend.dev>", // ✅ VERIFIED SENDER
      to: email,
      subject: "Reset your StoreEase password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">
            Click the link below to reset your password:
          </p>
          <div style="margin: 30px 0;">
            <a href="${link}" 
               style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #3b82f6; font-size: 12px; word-break: break-all;">
            ${link}
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link expires in 15 minutes. If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend email error:", result.error);
      throw new Error(
        `Failed to send email: ${result.error.message || "Unknown error"}`
      );
    }

    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
