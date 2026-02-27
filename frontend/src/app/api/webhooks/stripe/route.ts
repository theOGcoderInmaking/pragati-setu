import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch {
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const intent = event.data.object as Stripe.PaymentIntent;
            await query(
                `UPDATE orders SET
          status = 'paid',
          gateway_payment_id = $1,
          paid_at = NOW()
         WHERE gateway_order_id = $1`,
                [intent.id]
            );
            break;
        }

        case 'payment_intent.payment_failed': {
            const intent = event.data.object as Stripe.PaymentIntent;
            await query(
                `UPDATE orders SET status = 'failed'
         WHERE gateway_order_id = $1`,
                [intent.id]
            );
            break;
        }

        case 'customer.subscription.deleted': {
            const sub = event.data.object as Stripe.Subscription;
            await query(
                `UPDATE subscriptions SET
          status = 'cancelled',
          cancelled_at = NOW()
         WHERE gateway_subscription_id = $1`,
                [sub.id]
            );
            break;
        }
    }

    return NextResponse.json({ received: true });
}
