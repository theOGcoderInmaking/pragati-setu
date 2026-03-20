/* eslint-disable @next/next/no-head-element */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';

interface PassportReadyProps {
    name: string;
    destination: string;
    score: number;
    passportUrl: string;
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
  .score-box {
    background: rgba(212,89,10,0.08);
    border: 1px solid rgba(212,89,10,0.20);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    margin: 24px 0;
  }
  .score-number {
    font-size: 56px;
    font-weight: 700;
    line-height: 1;
    font-family: 'Courier New', monospace;
  }
  .score-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: #9A8F82;
    text-transform: uppercase;
    margin-top: 8px;
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

export const PassportReadyEmail: React.FC<PassportReadyProps> = ({
    name, destination, score, passportUrl
}) => {
    const scoreColor =
        score >= 80 ? '#2EC97A' :
            score >= 60 ? '#F5A623' : '#E8453C';

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <style dangerouslySetInnerHTML={{ __html: baseStyles }} />
            </head>
            <body>
                <div className="wrapper">
                    <div className="card">
                        <div className="logo">PRAGATI SETU</div>

                        <h1 className="heading">
                            Your passport is ready, {name}.
                        </h1>

                        <p className="body-text">
                            Your Decision Passport for{' '}
                            <strong style={{ color: '#F2EDE4' }}>
                                {destination}
                            </strong>{' '}
                            has been generated with 5 confidence
                            scores and a full risk register.
                        </p>

                        <div className="score-box">
                            <div className="score-number" style={{ color: scoreColor }}>
                                {score}
                            </div>
                            <div className="score-label">
                                Composite Confidence Score
                            </div>
                        </div>

                        <a href={passportUrl} className="btn">
                            View My Passport →
                        </a>

                        <hr className="divider" />

                        <p className="body-text" style={{ fontSize: '13px' }}>
                            Your passport includes:<br />
                            - Weather, Safety, Scam, Crowd + Budget scores<br />
                            - Full risk register with prevention steps<br />
                            - ₹25,000 guarantee coverage
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

export default PassportReadyEmail;
