import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = '24px',
  style,
  className = '',
  ...props
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-subtle)',
        padding: padding,
        ...style,
      }}
      className={`app-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
