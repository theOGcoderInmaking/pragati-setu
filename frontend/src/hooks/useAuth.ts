'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isLoading = status === 'loading';
    const isLoggedIn = status === 'authenticated';
    const user = session?.user;

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    const loginWithGoogle = async () => {
        await signIn('google', { callbackUrl: '/dashboard' });
    };

    return {
        user,
        isLoading,
        isLoggedIn,
        logout,
        loginWithGoogle,
        session,
    };
}
