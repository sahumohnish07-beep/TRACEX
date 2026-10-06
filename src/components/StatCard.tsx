import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  hint?: string;
  trend?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  hint,
  onClick,
  isActive = false,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <Card
      padding="24px"
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={isClickable ? isActive : undefined}
      onClick={onClick}
      onKeyDown={e => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.15s ease-in-out',
        border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
        backgroundColor: isActive ? 'var(--status-info-bg)' : 'var(--bg-surface)',
        boxShadow: isActive ? '0 0 0 1px var(--accent), 0 4px 12px rgba(47, 95, 208, 0.14)' : undefined,
        position: 'relative',
        outline: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        <div
          aria-hidden="true"
          style={{
            color: isActive ? '#FFFFFF' : 'var(--primary)',
            backgroundColor: isActive ? 'var(--accent)' : 'var(--primary-subtle)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: 600,
          color: isActive ? 'var(--accent)' : 'var(--text)',
          lineHeight: 1.1,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        {hint && (
          <span
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}
          >
            {hint}
          </span>
        )}
        {isActive && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--accent)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--accent)',
              padding: '2px 8px',
              borderRadius: '12px',
              marginLeft: 'auto',
              letterSpacing: '0.02em',
            }}
          >
            ACTIVE
          </span>
        )}
      </div>
    </Card>
  );
};
