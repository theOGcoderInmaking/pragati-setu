"use client";

import React from 'react';

// This component is the firewall between pages.
// Wrap EVERY page in this. Never remove it.

export default function PageWrapper({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={className}
            style={{
                // These inline styles CANNOT be overridden
                // by any CSS Module or component style
                isolation: 'isolate',
                position: 'relative',
                minHeight: '100vh',
            }}
        >
            {children}
        </div>
    );
}
