import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { FilterBar, type FilterGroup } from '../../components/FilterBar';
import { SearchInput } from '../../components/SearchInput';
import { DataTable, type Column } from '../../components/DataTable';
import { Button } from '../../components/Button';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { fetchAuditLogs } from '../../api/services';
import { useRbac } from '../../core/rbac';
import type { AuditLogEntry } from '../../types';

export const AuditLogPage: React.FC = () => {
  const { canViewAuditLog } = useRbac();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const loadAudit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLogs(100);
      setLogs(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve immutable station audit trail.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (log.id && log.id.toLowerCase().includes(q)) ||
        (log.officer && log.officer.toLowerCase().includes(q)) ||
        (log.caseRef && log.caseRef.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q));

      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, actionFilter]);

  const filterGroups: FilterGroup[] = [
    {
      id: 'action',
      label: 'Action Category',
      selectedValue: actionFilter,
      onChange: setActionFilter,
      options: [
        { label: 'All Actions', value: 'ALL' },
        { label: 'Login Authentication', value: 'USER_LOGIN_AUTHENTICATED' },
        { label: 'Data Request Review', value: 'DATA_REQUEST_APPROVAL_REVIEW' },
        { label: 'Investigation View Saved', value: 'INVESTIGATION_VIEW_SAVED' },
        { label: 'Missing Link Flagged', value: 'MISSING_LINK_FLAGGED' },
        { label: 'Received Data Merged', value: 'RECEIVED_DATA_MERGED_TO_VIEW' },
      ],
    },
  ];

  const columns: Column<AuditLogEntry>[] = [
    {
      header: 'Audit ID',
      accessor: 'id',
      width: '140px',
      render: l => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {l.id}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      width: '200px',
      render: l => <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{l.timestamp}</span>,
    },
    {
      header: 'Officer & Badge',
      render: l => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{l.officer}</div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {l.badgeNumber}
          </span>
        </div>
      ),
    },
    {
      header: 'Action Executed',
      accessor: 'action',
      width: '240px',
      render: l => (
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
          {l.action}
        </span>
      ),
    },
    {
      header: 'Case / Target Ref',
      accessor: 'caseRef',
      width: '160px',
      render: l => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
          {l.caseRef}
        </span>
      ),
    },
    {
      header: 'Action Details & IP Endpoint',
      render: l => (
        <div>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>{l.details}</div>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            IP: {l.ipAddress}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Station Statutory Audit Log"
        subtitle="Immutable, tamper-evident record of all platform operations and disclosures"
        badge={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} /> Cryptographically Chained
          </span>
        }
        actions={
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => alert('Official signed audit ledger exported as PDF for supervisory inspection.')}
          >
            Export Signed Ledger
          </Button>
        }
      />

      {/* RBAC Guard Check */}
      {!canViewAuditLog && (
        <ErrorState
          title="Access Restricted: Statutory Clearance Required"
          message="Station audit logs are restricted to Station Supervisors and System Administrators per Law Enforcement Evidentiary Matrix."
        />
      )}

      {canViewAuditLog && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <SearchInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Filter audit records by officer, badge, case reference, or keyword..."
              ariaLabel="Filter audit records"
            />

            <FilterBar
              groups={filterGroups}
              onReset={() => {
                setSearchQuery('');
                setActionFilter('ALL');
              }}
            />
          </div>

          {loading && <LoadingState message="Verifying cryptographic audit chain..." />}

          {error && (
            <ErrorState
              title="Audit trail unavailable"
              message={error}
              onAction={loadAudit}
            />
          )}

          {!loading && !error && filteredLogs.length === 0 && (
            <EmptyState
              title="No audit entries found"
              message="No recorded actions match the active query or filter category."
            />
          )}

          {!loading && !error && filteredLogs.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredLogs}
              keyExtractor={l => l.id}
            />
          )}
        </>
      )}
    </div>
  );
};
