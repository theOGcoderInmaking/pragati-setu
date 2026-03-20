'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';
import PageWrapper from '@/components/PageWrapper';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const token = params?.token as string;

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError('');

        if (password.length < 8) {
            setError(
                'Password must be at least 8 characters.'
            );
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        const res = await fetch(
            '/api/auth/reset-password',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password }),
            }
        );

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2500);
        } else {
            setError(
                data.error ?? 'Something went wrong.'
            );
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

                    {!success ? (
                        <>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{
                                    fontFamily:
                                        "'Space Mono', monospace",
                                    fontSize: '9px',
                                    letterSpacing: '3px',
                                    color: '#D4590A',
                                    marginBottom: '12px',
                                }}>
                                    PRAGATI SETU
                                </div>
                                <h1 style={{
                                    fontFamily:
                                        "'Cormorant Garamond', serif",
                                    fontSize: '32px',
                                    color: '#F2EDE4',
                                    fontWeight: 700,
                                    margin: '0 0 8px 0',
                                }}>
                                    Set new password.
                                </h1>
                                <p style={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: '14px',
                                    color: '#9A8F82',
                                    margin: 0,
                                }}>
                                    Choose a strong password for
                                    your account.
                                </p>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '16px' }}>
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
                                    New Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Min. 8 characters"
                                        style={inputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPw(v => !v)
                                        }
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#9A8F82',
                                            cursor: 'pointer',
                                            padding: '4px',
                                        }}
                                    >
                                        {showPw
                                            ? <EyeSlash size={16} />
                                            : <Eye size={16} />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Confirm */}
                            <div style={{ marginBottom: '24px' }}>
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
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirm}
                                    onChange={(e) => {
                                        setConfirm(e.target.value);
                                        setError('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            handleSubmit();
                                    }}
                                    placeholder="Repeat password"
                                    style={inputStyle}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p style={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: '13px',
                                    color: '#E8453C',
                                    marginBottom: '16px',
                                    padding: '12px 16px',
                                    background:
                                        'rgba(232,69,60,0.08)',
                                    border:
                                        '1px solid rgba(232,69,60,0.25)',
                                    borderRadius: '8px',
                                }}>
                                    {error}
                                </p>
                            )}

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
                                    ? 'Updating…'
                                    : 'Update Password'}
                            </button>
                        </>
                    ) : (
                        /* Success */
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <CheckCircle size={48} weight="fill" color="#D4590A" />
                            </div>
                            <h2 style={{
                                fontFamily:
                                    "'Cormorant Garamond', serif",
                                fontSize: '28px',
                                color: '#F2EDE4',
                                marginBottom: '12px',
                            }}>
                                Password updated.
                            </h2>
                            <p style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: '14px',
                                color: '#9A8F82',
                            }}>
                                Redirecting to login…
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
