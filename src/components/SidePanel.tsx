import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = '420px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <aside
      aria-label={`${title} detail panel`}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: width,
        maxWidth: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-4px 0 16px rgba(16, 24, 40, 0.08)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                margin: '4px 0 0 0',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={onClose}
          aria-label="Close panel"
          style={{ minHeight: '36px', width: '36px', padding: 0 }}
        >
          <X size={20} aria-hidden="true" />
        </Button>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {children}
      </div>
    </aside>
  );
};
