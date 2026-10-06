import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  children,
  className = '',
  style,
  disabled,
  ...props
}) => {
  let baseStyle: React.CSSProperties = {
    minHeight: '44px',
    padding: '0 var(--space-2)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
    fontFamily: 'var(--font-sans)',
  };

  if (variant === 'primary') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: 'var(--primary)',
      color: '#FFFFFF',
      border: '1px solid var(--primary)',
    };
  } else if (variant === 'secondary') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-subtle)',
    };
  } else if (variant === 'destructive') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--status-danger)',
      border: '1px solid var(--status-danger)',
    };
  } else if (variant === 'ghost') {
    baseStyle = {
      ...baseStyle,
      backgroundColor: 'transparent',
      color: 'var(--text)',
      border: '1px solid transparent',
    };
  }

  return (
    <button
      style={{ ...baseStyle, ...style }}
      className={`app-button variant-${variant} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
