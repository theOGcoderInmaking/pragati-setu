'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import PageWrapper from '@/components/PageWrapper';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!email) {
            setError('Please enter your email.');
            return;
        }
        setLoading(true);
        setError('');

        const res = await fetch(
            '/api/auth/forgot-password',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
            }
        );

        setLoading(false);

        if (res.ok) {
            setSent(true);
        } else {
            setError('Something went wrong. Try again.');
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        height: '48px',
        padding: '0 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '10px',
        color: '#F2EDE4',
        fontFamily: "'Sora', sans-serif",
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    };

    return (
        <PageWrapper>
            <div style={{
                minHeight: '100vh',
                background: '#060A12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'rgba(14,22,38,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                }}>

                    {/* Back */}
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: "'Sora', sans-serif",
                            fontSize: '13px',
                            color: '#9A8F82',
                            textDecoration: 'none',
                            marginBottom: '32px',
                        }}
                    >
                        <ArrowLeft size={14} />
                        Back to login
                    </Link>

                    {!sent ? (
                        <>
                            {/* Header */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '9px',
                                    letterSpacing: '3px',
                                    color: '#D4590A',
                                    marginBottom: '12px',
                                }}>
                                    ✦ PRAGATI SETU
                                </div>
                                <h1 style={{
                                    fontFamily:
                                        "'Cormorant Garamond', serif",
                                    fontSize: '32px',
                                    color: '#F2EDE4',
                                    fontWeight: 700,
                                    margin: '0 0 8px 0',
                                }}>
                                    Forgot password?
                                </h1>
                                <p style={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: '14px',
                                    color: '#9A8F82',
                                    margin: 0,
                                }}>
                                    Enter your email and we&apos;ll send
                                    a reset link.
                                </p>
                            </div>

                            {/* Email input */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontFamily:
                                        "'Space Mono', monospace",
                                    fontSize: '9px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#9A8F82',
                                    marginBottom: '8px',
                                }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            handleSubmit();
                                    }}
                                    placeholder="your@email.com"
                                    style={inputStyle}
                                />
                                {error && (
                                    <p style={{
                                        fontFamily: "'Sora', sans-serif",
                                        fontSize: '12px',
                                        color: '#E8453C',
                                        marginTop: '8px',
                                    }}>
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    height: '52px',
                                    background: loading
                                        ? 'rgba(212,89,10,0.7)'
                                        : '#D4590A',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#F2EDE4',
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: loading
                                        ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {loading
                                    ? 'Sending…'
                                    : 'Send Reset Link'}
                            </button>
                        </>
                    ) : (
                        /* Success state */
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '24px',
                            }}>
                                ✦
                            </div>
                            <h2 style={{
                                fontFamily:
                                    "'Cormorant Garamond', serif",
                                fontSize: '28px',
                                color: '#F2EDE4',
                                marginBottom: '12px',
                            }}>
                                Check your inbox.
                            </h2>
                            <p style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: '14px',
                                color: '#9A8F82',
                                lineHeight: 1.6,
                                marginBottom: '32px',
                            }}>
                                If an account exists for{' '}
                                <strong style={{ color: '#F2EDE4' }}>
                                    {email}
                                </strong>
                                , you&apos;ll receive a reset link
                                within a few minutes.
                            </p>
                            <Link
                                href="/login"
                                style={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: '14px',
                                    color: '#D4590A',
                                    textDecoration: 'none',
                                }}
                            >
                                Back to login →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
