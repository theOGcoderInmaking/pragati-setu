
import React from "react";

export default function AlertsPage() {
    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#F2EDE4', marginBottom: '16px' }}>Safety Alerts</h1>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', color: '#9A8F82' }}>
                Real-time safety and security updates for your active destinations.
            </p>
            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(212, 89, 10, 0.05)', borderRadius: '12px', border: '1px solid rgba(212, 89, 10, 0.2)' }}>
                <p style={{ color: '#F2EDE4', fontWeight: 'bold' }}>No critical alerts in your current area.</p>
                <p style={{ color: '#9A8F82', fontSize: '14px' }}>We monitor locally for transit strikes, weather events, and safety advisories.</p>
            </div>
        </div>
    );
}
