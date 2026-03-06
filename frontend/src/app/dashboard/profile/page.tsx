
import React from "react";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user;

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#F2EDE4', marginBottom: '16px' }}>My Profile</h1>
            <div style={{ marginTop: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4590A, #0B6E72)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px' }}>
                    🧑
                </div>
                <div>
                    <p style={{ color: '#F2EDE4', fontSize: '20px', fontWeight: 'bold' }}>{user?.name || "Travel Ibrahim"}</p>
                    <p style={{ color: '#9A8F82' }}>{user?.email || "test@example.com"}</p>
                </div>
            </div>
        </div>
    );
}
