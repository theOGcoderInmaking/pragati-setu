import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/WelcomeEmail';
import ResetPasswordEmail from '@/emails/ResetPasswordEmail';
import PassportReadyEmail from '@/emails/PassportReadyEmail';
import SafetyAlertEmail from '@/emails/SafetyAlertEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.FROM_EMAIL
  ?? 'onboarding@resend.dev';

const BASE_URL = process.env.NEXTAUTH_URL
  ?? 'http://localhost:3000';

// ── Send welcome email ──────────────────────────
export async function sendWelcomeEmail(
  to: string,
  name: string
) {
  try {
    const html = await render(
      WelcomeEmail({ name })
    );
    await resend.emails.send({
      from: FROM,
      to,
      subject: '✦ Welcome to Pragati Setu',
      html,
    });
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
}

// ── Send password reset email ───────────────────
export async function sendPasswordResetEmail(
  to: string,
  token: string
) {
  const resetUrl =
    `${BASE_URL}/reset-password/${token}`;
  try {
    const html = await render(
      ResetPasswordEmail({ resetUrl })
    );
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Reset your Pragati Setu password',
      html,
    });
  } catch (error) {
    console.error('Reset email failed:', error);
  }
}

// ── Send passport ready email ───────────────────
export async function sendPassportReadyEmail(
  to: string,
  name: string,
  destination: string,
  score: number,
  passportId: string
) {
  const passportUrl =
    `${BASE_URL}/dashboard/passports/${passportId}`;
  try {
    const html = await render(
      PassportReadyEmail({
        name, destination, score, passportUrl
      })
    );
    await resend.emails.send({
      from: FROM,
      to,
      subject: `✦ Your ${destination} Passport is ready`,
      html,
    });
  } catch (error) {
    console.error('Passport email failed:', error);
  }
}

// ── Send safety alert email ─────────────────────
export async function sendSafetyAlertEmail(
  to: string,
  name: string,
  city: string,
  alertTitle: string,
  severity: string
) {
  try {
    const html = await render(
      SafetyAlertEmail({
        name, city, alertTitle, severity
      })
    );
    await resend.emails.send({
      from: FROM,
      to,
      subject: `⚠️ Safety alert for ${city}`,
      html,
    });
  } catch (error) {
    console.error('Safety alert email failed:', error);
  }
}
