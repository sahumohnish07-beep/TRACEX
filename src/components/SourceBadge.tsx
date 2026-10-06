import React from 'react';
import { ShieldCheck, Database, Sparkles } from 'lucide-react';
import type { SourceType } from '../types';

interface SourceBadgeProps {
  type: SourceType;
  evidenceBasis?: string[];
  compact?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type,
  evidenceBasis,
  compact = false,
}) => {
  let label = 'VERIFIED RECORD';
  let icon = <ShieldCheck size={14} aria-hidden="true" />;
  let color = 'var(--primary)';
  let bg = 'var(--primary-subtle)';
  let borderStyle = '1px solid var(--primary)';

  if (type === 'SYSTEM_DERIVED') {
    label = 'SYSTEM-DERIVED';
    icon = <Database size={14} aria-hidden="true" />;
    color = '#4A5A9E';
    bg = '#F0F4FC';
    borderStyle = '1px solid #4A5A9E';
  } else if (type === 'AI_ANALYSIS') {
    label = 'AI ANALYSIS';
    icon = <Sparkles size={14} aria-hidden="true" />;
    color = 'var(--accent)';
    bg = '#EEF4FD';
    borderStyle = '1px dashed var(--accent)';
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontWeight: 600,
          color: color,
          backgroundColor: bg,
          border: borderStyle,
          padding: compact ? '2px 8px' : '4px 10px',
          borderRadius: 'var(--radius-sm)',
          lineHeight: 1.2,
          letterSpacing: '0.02em',
        }}
        title={type === 'AI_ANALYSIS' ? 'AI Analysis — not proven fact; inspect evidence basis' : label}
      >
        {icon}
        <span>{label}</span>
      </span>

      {evidenceBasis && evidenceBasis.length > 0 && !compact && (
        <span
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            fontStyle: 'normal',
          }}
        >
          Basis: {evidenceBasis.join('; ')}
        </span>
      )}
    </div>
  );
};
