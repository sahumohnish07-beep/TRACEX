import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/Card';

export const StatePlaceholderPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      <Card style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '40px 32px' }}>
        <div
          aria-hidden="true"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}
        >
          <Landmark size={28} />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
          State Authority Portal
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
          This authority level is not available in this build. This deployment is configured specifically for Local Authority / Police Station Level operations.
        </p>

        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Authority Selection</span>
        </Link>
      </Card>
    </div>
  );
};
