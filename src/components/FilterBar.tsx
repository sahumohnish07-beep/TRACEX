import React from 'react';
import { Filter } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (val: string) => void;
}

interface FilterBarProps {
  groups: FilterGroup[];
  onReset?: () => void;
  children?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  groups,
  onReset,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <Filter size={16} aria-hidden="true" />
        <span>Filters</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1 }}>
        {groups.map(g => (
          <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label
              htmlFor={`filter-${g.id}`}
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {g.label}:
            </label>
            <select
              id={`filter-${g.id}`}
              value={g.selectedValue}
              onChange={e => g.onChange(e.target.value)}
              style={{
                minHeight: '38px',
                height: '38px',
                padding: '0 12px',
                fontSize: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              {g.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {children}
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          style={{
            fontSize: '14px',
            color: 'var(--accent)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '36px',
          }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
