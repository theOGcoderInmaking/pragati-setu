'use server';

import { auth } from '@/lib/auth';
import {
    updateUserProfileBundle,
    type UserProfileUpdateInput,
} from '@/lib/user-profile';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(input: UserProfileUpdateInput) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error('Unauthorized');
    }

    try {
        const result = await updateUserProfileBundle(userId, input);

        if (!result) {
            return { success: false, error: 'Account not found' };
        }

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/settings');
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}
