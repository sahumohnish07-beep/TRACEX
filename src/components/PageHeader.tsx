import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  actions,
  badge,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <div>
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            icon={<ArrowLeft size={16} />}
            style={{
              padding: '0 8px',
              minHeight: '32px',
              marginBottom: '8px',
              color: 'var(--accent)',
            }}
          >
            Back
          </Button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: 'var(--text)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {badge}
        </div>

        {subtitle && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              margin: '6px 0 0 0',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
};
