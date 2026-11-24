import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '540px',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(30, 36, 48, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: maxWidth,
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 32px rgba(16, 24, 40, 0.18)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            id="modal-title"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ minHeight: '36px', width: '36px', padding: 0 }}
          >
            <X size={20} aria-hidden="true" />
          </Button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            fontSize: '16px',
            lineHeight: 1.6,
            color: 'var(--text)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: 'var(--bg-page)',
              borderBottomLeftRadius: 'var(--radius-md)',
              borderBottomRightRadius: 'var(--radius-md)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
