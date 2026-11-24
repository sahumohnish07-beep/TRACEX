import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onValueChange,
  placeholder = 'Search...',
  ariaLabel = 'Search query',
  style,
  ...props
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '14px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Search size={18} />
      </div>

      <input
        type="search"
        aria-label={ariaLabel}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '44px',
          paddingLeft: '42px',
          paddingRight: value ? '40px' : '14px',
          fontSize: '14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text)',
        }}
        {...props}
      />

      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange('')}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            minHeight: '32px',
            width: '32px',
            padding: 0,
            borderRadius: '50%',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
