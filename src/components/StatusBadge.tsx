import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

export type StatusType =
  | 'ACTIVE'
  | 'UNDER_ANALYSIS'
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'RESOLVED'
  | 'CLOSED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'SUSPECT'
  | 'PERSON_OF_INTEREST'
  | 'ASSOCIATE'
  | 'WITNESS'
  | 'ELEVATED'
  | 'STANDARD';

interface StatusBadgeProps {
  status: StatusType | string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customLabel }) => {
  let color = 'var(--status-neutral)';
  let bg = 'var(--status-neutral-bg)';
  let icon = <Info size={14} aria-hidden="true" />;
  let label = customLabel || status.replace(/_/g, ' ');

  switch (status) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'RESOLVED':
      color = 'var(--status-success)';
      bg = 'var(--status-success-bg)';
      icon = <CheckCircle2 size={14} aria-hidden="true" />;
      break;

    case 'UNDER_ANALYSIS':
    case 'PENDING':
    case 'PENDING_REVIEW':
    case 'PERSON_OF_INTEREST':
    case 'ELEVATED':
      color = 'var(--status-warning)';
      bg = 'var(--status-warning-bg)';
      icon = <Clock size={14} aria-hidden="true" />;
      break;

    case 'CRITICAL':
    case 'HIGH':
    case 'REJECTED':
    case 'SUSPECT':
      color = 'var(--status-danger)';
      bg = 'var(--status-danger-bg)';
      icon = <AlertTriangle size={14} aria-hidden="true" />;
      break;

    case 'MEDIUM':
    case 'ASSOCIATE':
      color = 'var(--status-info)';
      bg = 'var(--status-info-bg)';
      icon = <Info size={14} aria-hidden="true" />;
      break;

    case 'LOW':
    case 'CLOSED':
    case 'STANDARD':
    case 'WITNESS':
      color = 'var(--status-neutral)';
      bg = 'var(--status-neutral-bg)';
      icon = <ShieldCheck size={14} aria-hidden="true" />;
      break;

    default:
      if (status === 'DISMISSED') {
        color = 'var(--status-neutral)';
        bg = 'var(--status-neutral-bg)';
        icon = <XCircle size={14} aria-hidden="true" />;
      }
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        fontWeight: 600,
        color: color,
        backgroundColor: bg,
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        lineHeight: 1.2,
      }}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
