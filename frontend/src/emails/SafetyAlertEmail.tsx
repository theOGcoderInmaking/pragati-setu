/* eslint-disable @next/next/no-head-element */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';

interface SafetyAlertProps {
    name: string;
    city: string;
    alertTitle: string;
    severity: string;
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
  .alert-pill {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .alert-high {
    background: rgba(232,69,60,0.12);
    color: #E8453C;
    border: 1px solid rgba(232,69,60,0.25);
  }
  .alert-med {
    background: rgba(245,166,35,0.12);
    color: #F5A623;
    border: 1px solid rgba(245,166,35,0.25);
  }
`;

export const SafetyAlertEmail: React.FC<SafetyAlertProps> = ({
    name, city, alertTitle, severity
}) => {
    const isHigh =
        severity.toLowerCase() === 'high' ||
        severity.toLowerCase() === 'critical';

    return (
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
                            Safety alert for {city}.
                        </h1>

                        <p className="body-text">
                            Hi {name}, we've detected a new
                            safety alert for one of your
                            destinations.
                        </p>

                        <div style={{
                            padding: '20px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderLeft: `3px solid ${isHigh ? '#E8453C' : '#F5A623'}`,
                            borderRadius: '12px',
                            margin: '24px 0'
                        }}>
                            <div style={{ marginBottom: '10px' }}>
                                <span className={`alert-pill ${isHigh ? 'alert-high' : 'alert-med'}`}>
                                    {severity.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ fontSize: '15px', color: '#F2EDE4', fontWeight: 600 }}>
                                {alertTitle}
                            </div>
                        </div>

                        <a href={`${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/dashboard`} className="btn">
                            View Dashboard →
                        </a>

                        <hr className="divider" />

                        <p className="body-text" style={{ fontSize: '12px' }}>
                            You received this because you have an
                            active passport for {city}.
                        </p>

                    </div>
                    <div className="footer">
                        Pragati Setu · Travel with Certainty
                    </div>
                </div>
            </body>
        </html>
    );
};

export default SafetyAlertEmail;
