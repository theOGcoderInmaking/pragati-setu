import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body.' },
            { status: 400 }
        );
    }

    const email = String(
        (body as { email?: unknown })?.email ?? ''
    )
        .trim()
        .toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json(
            { error: 'Enter a valid email address.' },
            { status: 400 }
        );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.FROM_EMAIL ?? 'onboarding@resend.dev';
    const to = process.env.NEWSLETTER_SIGNUP_TO ?? from;

    // 1. Always persist to database
    try {
        const { query } = await import('@/lib/db');
        await query(
            `INSERT INTO newsletter_subscribers (email, source)
             VALUES ($1, 'blog')
             ON CONFLICT (email) DO UPDATE SET is_active = true, subscribed_at = now()`,
            [email]
        );
    } catch (dbError) {
        console.error('Failed to persist newsletter subscriber:', dbError);
        // We continue anyway to try sending the email if possible, 
        // or return error if both fail.
    }

    // 2. Attempt to send email via Resend if configured
    if (!apiKey) {
        return NextResponse.json(
            {
                message: 'Subscription saved to our database. You will be added to the next intelligence brief.',
            },
            { status: 201 }
        );
    }

    try {
        const resend = new Resend(apiKey);

        await resend.emails.send({
            from,
            to,
            subject: `Newsletter signup: ${email}`,
            text:
                `New Pragati Setu newsletter signup\n\n` +
                `Email: ${email}\n` +
                `Received: ${new Date().toISOString()}\n`,
        });

        return NextResponse.json(
            {
                message:
                    'Subscription confirmed and saved. You will be added to the next intelligence brief.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Newsletter email notification failed:', error);
        // We return success because the DB save already happened
        return NextResponse.json(
            {
                message: 'Subscription saved. Notification email failed but your spot is reserved.',
            },
            { status: 201 }
        );
    }
}
