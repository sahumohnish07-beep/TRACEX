import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  ariaLabel?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  ariaLabel = 'Case workspace sections',
}) => {
  return (
    <nav
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '24px',
        overflowX: 'auto',
      }}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              backgroundColor: 'transparent',
              borderRadius: '0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-1px',
              transition: 'color 120ms ease, border-color 120ms ease',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--border)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  lineHeight: 1,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
