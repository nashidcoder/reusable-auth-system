import { Resend } from "resend";

// Resend API key environment se le rahe hain.
const resend = new Resend(process.env.RESEND_API_KEY);

// Verification email bhejne ka function.
export async function sendVerificationEmail(email, token) {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Verify your email</h2>
      <p>Please click the button below to verify your account.</p>
      <a href="${link}">Verify Email</a>
    `,
  });
}

// Password reset email bhejne ka function.
export async function sendResetPasswordEmail(email, token) {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset your password</h2>
      <p>Click the button below to create a new password.</p>
      <a href="${link}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}