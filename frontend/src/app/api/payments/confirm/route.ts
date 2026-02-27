import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const { payment_intent_id, order_id, passport_id } =
        await req.json();

    // Verify payment with Stripe
    const intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
    );

    if (intent.status !== 'succeeded') {
        return NextResponse.json(
            { error: 'Payment not completed' },
            { status: 400 }
        );
    }

    // Update order status
    await query(
        `UPDATE orders SET
      status = 'paid',
      gateway_payment_id = $1,
      paid_at = NOW()
     WHERE id = $2 AND user_id = $3`,
        [payment_intent_id, order_id, session.user.id]
    );

    // Link passport to order
    if (passport_id) {
        await query(
            `UPDATE decision_passports SET
        order_id = $1,
        updated_at = NOW()
       WHERE id = $2 AND user_id = $3`,
            [order_id, passport_id, session.user.id]
        );
    }

    return NextResponse.json({ success: true });
}
