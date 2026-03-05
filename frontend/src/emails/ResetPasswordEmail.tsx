/* eslint-disable @next/next/no-head-element */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';

interface ResetPasswordProps {
    resetUrl: string;
}

const baseStyles = `
  body {
    margin: 0; padding: 0;
    background: #060A12;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  .wrapper {
    max-width: 560px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .card {
    background: #0E1626;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 40px;
  }
  .logo {
    font-size: 13px;
    letter-spacing: 3px;
    color: #D4590A;
    margin-bottom: 32px;
    font-weight: 600;
  }
  .heading {
    font-size: 32px;
    font-weight: 700;
    color: #F2EDE4;
    margin: 0 0 16px 0;
    line-height: 1.2;
  }
  .body-text {
    font-size: 15px;
    color: #9A8F82;
    line-height: 1.7;
    margin: 0 0 24px 0;
  }
  .btn {
    display: inline-block;
    padding: 14px 32px;
    background: #D4590A;
    color: #F2EDE4 !important;
    text-decoration: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    margin: 8px 0 24px 0;
  }
  .divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin: 32px 0;
  }
  .footer {
    font-size: 12px;
    color: rgba(154,143,130,0.6);
    text-align: center;
    margin-top: 32px;
    line-height: 1.6;
  }
`;

export const ResetPasswordEmail: React.FC<ResetPasswordProps> = ({ resetUrl }) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <style dangerouslySetInnerHTML={{ __html: baseStyles }} />
        </head>
        <body>
            <div className="wrapper">
                <div className="card">
                    <div className="logo">✦ PRAGATI SETU</div>

                    <h1 className="heading">
                        Reset your password.
                    </h1>

                    <p className="body-text">
                        We received a request to reset your
                        password. Click below to choose a
                        new one.
                    </p>

                    <a href={resetUrl} className="btn">
                        Reset My Password →
                    </a>

                    <p className="body-text"
                        style={{ fontSize: '13px', marginTop: '16px' }}>
                        This link expires in{' '}
                        <strong style={{ color: '#F2EDE4' }}>
                            1 hour.
                        </strong>
                        {' '}If you didn't request this, ignore
                        this email — your account is safe.
                    </p>

                    <hr className="divider" />

                    <p className="body-text" style={{ fontSize: '12px' }}>
                        If the button doesn't work, copy this URL into your browser:<br />
                        <span style={{ color: '#D4590A', wordBreak: 'break-all' }}>
                            {resetUrl}
                        </span>
                    </p>

                </div>
                <div className="footer">
                    Pragati Setu · Travel with Certainty<br />
                    This link expires in 1 hour.
                </div>
            </div>
        </body>
    </html>
);

export default ResetPasswordEmail;
