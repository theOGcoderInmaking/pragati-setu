
import React from "react";

export default function ReviewsPage() {
    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#F2EDE4', marginBottom: '16px' }}>Reviews Due</h1>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', color: '#9A8F82' }}>
                You have items from your recent trips that are waiting for your feedback.
            </p>
            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: '#F2EDE4' }}>Feature coming soon: Rate your hotels, guides and experiences.</p>
            </div>
        </div>
    );
}
