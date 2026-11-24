import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/SearchInput';
import { FilterBar, type FilterGroup } from '../../components/FilterBar';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { fetchCases } from '../../api/services';
import { useRbac } from '../../core/rbac';
import type { CaseItem } from '../../types';

export const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { canCreateCase } = useRbac();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const loadCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCases();
      setCases(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load cases from station server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.crimeType.toLowerCase().includes(q) ||
        (c.leadOfficer && c.leadOfficer.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchQuery, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredCases.length / pageSize) || 1;
  const paginatedCases = filteredCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      label: 'Status',
      selectedValue: statusFilter,
      onChange: val => { setStatusFilter(val); setCurrentPage(1); },
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Under Analysis', value: 'UNDER_ANALYSIS' },
        { label: 'Pending Review', value: 'PENDING_REVIEW' },
        { label: 'Closed', value: 'CLOSED' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      selectedValue: priorityFilter,
      onChange: val => { setPriorityFilter(val); setCurrentPage(1); },
      options: [
        { label: 'All Priorities', value: 'ALL' },
        { label: 'Critical', value: 'CRITICAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
      ],
    },
  ];

  const columns: Column<CaseItem>[] = [
    {
      header: 'Case ID',
      accessor: 'id',
      width: '180px',
      render: c => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {c.id}
        </span>
      ),
    },
    {
      header: 'Title & Offense',
      render: c => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.title}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{c.crimeType}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      width: '180px',
      render: c => <StatusBadge status={c.status} />,
    },
    {
      header: 'Priority',
      width: '140px',
      render: c => <StatusBadge status={c.priority} />,
    },
    {
      header: 'Lead Officer',
      accessor: 'leadOfficer',
      width: '200px',
    },
    {
      header: 'Opened Date',
      accessor: 'dateOpened',
      width: '140px',
      render: c => <span style={{ color: 'var(--text-muted)' }}>{c.dateOpened}</span>,
    },
    {
      header: 'Nodes',
      width: '100px',
      align: 'right',
      render: c => (
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
          {c.entitiesCount}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Station Criminal Cases"
        subtitle="Central Division Police Station · Registry of Investigations"
        actions={
          canCreateCase ? (
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => navigate('/cases/new')}
            >
              Create New Case
            </Button>
          ) : undefined
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <SearchInput
          value={searchQuery}
          onValueChange={val => { setSearchQuery(val); setCurrentPage(1); }}
          placeholder="Filter by case number, subject name, crime type, or officer..."
          ariaLabel="Filter case registry"
        />

        <FilterBar
          groups={filterGroups}
          onReset={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
            setPriorityFilter('ALL');
            setCurrentPage(1);
          }}
        />
      </div>

      {loading && <LoadingState message="Loading station criminal cases..." />}

      {error && (
        <ErrorState
          title="Failed to load cases"
          message={error}
          onAction={loadCases}
        />
      )}

      {!loading && !error && filteredCases.length === 0 && (
        <EmptyState
          title="No cases found"
          message={
            searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'No registered investigations match the applied search and filter criteria.'
              : 'No criminal cases have been registered for this police division.'
          }
          actionText={canCreateCase ? 'Create New Case' : undefined}
          onAction={canCreateCase ? () => navigate('/cases/new') : undefined}
        />
      )}

      {!loading && !error && filteredCases.length > 0 && (
        <>
          <DataTable
            columns={columns}
            data={paginatedCases}
            keyExtractor={item => item.id}
            onRowClick={item => navigate(`/cases/${item.id}`)}
          />

          {/* Pagination Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              padding: '12px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}
          >
            <span>
              Showing {paginatedCases.length} of {filteredCases.length} registered cases
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{ minHeight: '36px', padding: '0 14px' }}
              >
                Previous
              </Button>

              <span style={{ fontWeight: 600, color: 'var(--text)', padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{ minHeight: '36px', padding: '0 14px' }}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
