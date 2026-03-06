
import React from "react";

export default function MessagesPage() {
    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#F2EDE4', marginBottom: '16px' }}>Guide Messages</h1>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', color: '#9A8F82' }}>
                Your conversations with local guides and experts.
            </p>
            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(11, 110, 114, 0.05)', borderRadius: '12px', border: '1px solid rgba(11, 110, 114, 0.2)' }}>
                <p style={{ color: '#F2EDE4' }}>No new messages from your guides.</p>
            </div>
        </div>
    );
}
