import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';

interface StateContainerProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  minHeight?: string;
}

export const LoadingState: React.FC<{ message?: string; minHeight?: string }> = ({
  message = 'Loading data...',
  minHeight = '240px',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        padding: '32px',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2
        size={36}
        className="spin-animation"
        style={{
          animation: 'spin 1s linear infinite',
          color: 'var(--primary)',
          marginBottom: '16px',
        }}
      />
      <div style={{ fontSize: '15px', fontWeight: 500 }}>{message}</div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const ErrorState: React.FC<StateContainerProps> = ({
  title = 'Failed to load records',
  message = 'An unexpected error occurred while communicating with the station server.',
  actionText = 'Try Again',
  onAction,
  minHeight = '240px',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        padding: '32px',
        textAlign: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.04)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}
    >
      <AlertCircle size={40} style={{ color: 'var(--status-critical)', marginBottom: '12px' }} />
      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: onAction ? '16px' : '0' }}>
        {message}
      </div>
      {onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<StateContainerProps> = ({
  title = 'No records found',
  message = 'No data available for the current query or station jurisdiction.',
  actionText,
  onAction,
  minHeight = '240px',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        padding: '32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}
    >
      <Inbox size={42} style={{ color: 'var(--border)', marginBottom: '12px' }} />
      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '14px', maxWidth: '400px', marginBottom: onAction ? '16px' : '0' }}>
        {message}
      </div>
      {onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
