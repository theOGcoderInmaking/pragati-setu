/* eslint-disable @next/next/no-head-element */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
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

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <style dangerouslySetInnerHTML={{ __html: baseStyles }} />
        </head>
        <body>
            <div className="wrapper">
                <div className="card">
                    <div className="logo">✦ PRAGATI SETU</div>

                    <h1 className="heading">
                        Welcome, {name}.
                    </h1>

                    <p className="body-text">
                        Your account is ready. You now have
                        access to the world's first accountable
                        travel intelligence platform.
                    </p>

                    <p className="body-text">
                        Create your first Decision Passport —
                        5 confidence scores, a full risk register,
                        and a personal guarantee. All in one
                        document.
                    </p>

                    <a href={`${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/decision-passport`}
                        className="btn">
                        Create My First Passport →
                    </a>

                    <hr className="divider" />

                    <p className="body-text" style={{ fontSize: '13px' }}>
                        <strong style={{ color: '#F2EDE4' }}>
                            What you can do:
                        </strong><br />
                        ✦ Create Decision Passports for any destination<br />
                        ✦ Get 5 real-time confidence scores<br />
                        ✦ Access local guide intelligence<br />
                        ✦ Track safety alerts for your trips
                    </p>

                </div>
                <div className="footer">
                    Pragati Setu · Travel with Certainty<br />
                    You received this because you created
                    an account.
                </div>
            </div>
        </body>
    </html>
);

export default WelcomeEmail;
