import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      <label
        htmlFor={id}
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span>{label}</span>
        {required && (
          <span style={{ color: 'var(--status-danger)' }} aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{hint}</span>
      )}

      {error && (
        <span
          role="alert"
          style={{
            fontSize: '14px',
            color: 'var(--status-danger)',
            fontWeight: 500,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
