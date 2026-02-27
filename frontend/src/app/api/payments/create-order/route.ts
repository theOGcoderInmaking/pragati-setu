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

    const { order_type, passport_id, gateway } =
        await req.json();

    // Determine amount
    const amounts: Record<string, number> = {
        passport: 14900,       // ₹149 in paise
        subscription: 99900,   // ₹999 in paise
        guide_chat: 29900,     // ₹299
        guide_video: 99900,    // ₹999
        guide_inperson: 399900 // ₹3,999
    };

    const amount = amounts[order_type];
    if (!amount) {
        return NextResponse.json(
            { error: 'Invalid order type' },
            { status: 400 }
        );
    }

    if (gateway === 'stripe') {
        // Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            metadata: {
                user_id: session.user.id,
                order_type,
                passport_id: passport_id ?? '',
            },
        });

        // Save order to Neon
        const [order] = await query<{ id: number }>(
            `INSERT INTO orders (
        user_id, order_type, amount_inr,
        status, payment_gateway, gateway_order_id, metadata
      ) VALUES ($1,$2,$3,'pending','stripe',$4,$5)
      RETURNING id`,
            [
                session.user.id,
                order_type,
                amount / 100,
                paymentIntent.id,
                JSON.stringify({ passport_id }),
            ]
        );

        return NextResponse.json({
            gateway: 'stripe',
            client_secret: paymentIntent.client_secret,
            order_id: order.id,
        });
    }

    // Default: Razorpay (add when keys available)
    return NextResponse.json(
        { error: 'Gateway not configured' },
        { status: 400 }
    );
}
