import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found matching current criteria.',
}: DataTableProps<T>) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-surface)',
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '32px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '16px',
                  height: '80px',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 120ms ease',
                }}
                className={onRowClick ? 'table-row-clickable' : ''}
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    style={{
                      fontSize: '16px',
                      color: 'var(--text)',
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border)',
                      height: '56px',
                      verticalAlign: 'middle',
                      textAlign: col.align || 'left',
                    }}
                  >
                    {col.render
                      ? col.render(item)
                      : col.accessor
                      ? String(item[col.accessor] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style>{`
        .table-row-clickable:hover {
          background-color: var(--primary-subtle) !important;
        }
      `}</style>
    </div>
  );
}
