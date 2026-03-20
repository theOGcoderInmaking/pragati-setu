import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
    getUserProfileBundle,
    updateUserProfileBundle,
} from '@/lib/user-profile';

// GET — fetch profile
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const bundle = await getUserProfileBundle(session.user.id);

    if (!bundle) {
        return NextResponse.json(
            { error: 'Account not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: bundle });
}

// PATCH — update profile
export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const body = await req.json();
    const bundle = await updateUserProfileBundle(
        session.user.id,
        body
    );

    if (!bundle) {
        return NextResponse.json(
            { error: 'Account not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ data: bundle });
}
