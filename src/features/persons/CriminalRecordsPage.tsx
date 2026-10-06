import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  ShieldAlert,
  UserCheck,
  UserX,
  ArrowRight,
  Phone,
  Car,
  Filter,
  X,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/SearchInput';
import { FilterBar, type FilterGroup } from '../../components/FilterBar';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { StatCard } from '../../components/StatCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { fetchPersons } from '../../api/services';
import type { PersonRecord } from '../../types';

export const CriminalRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [persons, setPersons] = useState<PersonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const loadPersons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPersons();
      setPersons(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load criminal records registry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPersons();
  }, [loadPersons]);

  const filteredPersons = useMemo(() => {
    return persons.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.nationalId.toLowerCase().includes(q) ||
        p.aliases.some(alias => alias.toLowerCase().includes(q)) ||
        p.phoneNumbers.some(phone => phone.toLowerCase().includes(q)) ||
        p.vehicles.some(veh => veh.toLowerCase().includes(q)) ||
        p.associatedCases.some(c => c.title.toLowerCase().includes(q) || c.caseId.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [persons, searchQuery, statusFilter, riskFilter]);

  const totalPages = Math.ceil(filteredPersons.length / pageSize) || 1;
  const paginatedPersons = filteredPersons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filterGroups: FilterGroup[] = [
    {
      id: 'status',
      label: 'Record Status',
      selectedValue: statusFilter,
      onChange: val => { setStatusFilter(val); setCurrentPage(1); },
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Suspects', value: 'SUSPECT' },
        { label: 'Persons of Interest', value: 'PERSON_OF_INTEREST' },
        { label: 'Associates', value: 'ASSOCIATE' },
        { label: 'Witnesses', value: 'WITNESS' },
      ],
    },
    {
      id: 'risk',
      label: 'Risk Level',
      selectedValue: riskFilter,
      onChange: val => { setRiskFilter(val); setCurrentPage(1); },
      options: [
        { label: 'All Risk Tiers', value: 'ALL' },
        { label: 'High Risk', value: 'HIGH' },
        { label: 'Elevated Risk', value: 'ELEVATED' },
        { label: 'Standard Risk', value: 'STANDARD' },
      ],
    },
  ];

  const columns: Column<PersonRecord>[] = [
    {
      header: 'Subject Ref',
      accessor: 'id',
      width: '150px',
      render: p => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {p.id}
        </span>
      ),
    },
    {
      header: 'Subject Name & Known Aliases',
      render: p => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '15px' }}>
            {p.fullName}
          </div>
          {p.aliases && p.aliases.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {p.aliases.map((alias, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-page)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1px 6px',
                  }}
                >
                  aka &ldquo;{alias}&rdquo;
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      width: '160px',
      render: p => <StatusBadge status={p.status} />,
    },
    {
      header: 'Risk Level',
      width: '140px',
      render: p => <StatusBadge status={p.riskLevel} />,
    },
    {
      header: 'Primary Case Nexus',
      render: p => {
        const primaryCase = p.associatedCases[0];
        if (!primaryCase) {
          return <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No active case nexus</span>;
        }
        return (
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '14px' }}>
              {primaryCase.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600, marginRight: '6px' }}>
                {primaryCase.caseId}
              </span>
              · {primaryCase.role}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Identified Vectors',
      width: '180px',
      render: p => (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {p.phoneNumbers[0] && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} color="var(--primary)" /> {p.phoneNumbers[0]}
            </span>
          )}
          {p.vehicles[0] && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Car size={12} color="var(--primary)" /> {p.vehicles[0].split(' ')[0]}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Network Entities',
      width: '140px',
      align: 'right',
      render: p => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '14px' }}>
          {p.systemConnectionsCount} links
        </span>
      ),
    },
    {
      header: 'Action',
      width: '140px',
      align: 'right',
      render: p => (
        <Button
          variant="secondary"
          style={{ minHeight: '36px', padding: '0 12px' }}
          icon={<ArrowRight size={14} />}
          onClick={e => {
            e.stopPropagation();
            navigate(`/persons/${p.id}`);
          }}
        >
          Dossier
        </Button>
      ),
    },
  ];

  const totalSuspects = persons.filter(p => p.status === 'SUSPECT').length;
  const totalHighRisk = persons.filter(p => p.riskLevel === 'HIGH').length;
  const totalPOI = persons.filter(p => p.status === 'PERSON_OF_INTEREST').length;

  return (
    <div>
      <PageHeader
        title="Station Criminal Records Registry"
        subtitle="Central Division Police Station · Suspect & Person of Interest Master Dossiers"
      />

      {/* 4 Clickable Metric Summary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <StatCard
          label="Total Records"
          value={persons.length}
          icon={<Users size={20} />}
          hint="Registered subjects across active station cases"
          isActive={statusFilter === 'ALL' && riskFilter === 'ALL'}
          onClick={() => {
            setStatusFilter('ALL');
            setRiskFilter('ALL');
            setCurrentPage(1);
          }}
        />
        <StatCard
          label="Active Suspects"
          value={totalSuspects}
          icon={<ShieldAlert size={20} />}
          hint="Click to filter identified primary suspects"
          isActive={statusFilter === 'SUSPECT'}
          onClick={() => {
            setStatusFilter(prev => (prev === 'SUSPECT' ? 'ALL' : 'SUSPECT'));
            setRiskFilter('ALL');
            setCurrentPage(1);
          }}
        />
        <StatCard
          label="High Risk Tier"
          value={totalHighRisk}
          icon={<UserX size={20} />}
          hint="Click to filter elevated violence/flight risk"
          isActive={riskFilter === 'HIGH'}
          onClick={() => {
            setRiskFilter(prev => (prev === 'HIGH' ? 'ALL' : 'HIGH'));
            setStatusFilter('ALL');
            setCurrentPage(1);
          }}
        />
        <StatCard
          label="Persons of Interest"
          value={totalPOI}
          icon={<UserCheck size={20} />}
          hint="Click to filter active inquiry targets"
          isActive={statusFilter === 'PERSON_OF_INTEREST'}
          onClick={() => {
            setStatusFilter(prev => (prev === 'PERSON_OF_INTEREST' ? 'ALL' : 'PERSON_OF_INTEREST'));
            setRiskFilter('ALL');
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Search Input Bar */}
      <div style={{ marginBottom: '20px' }}>
        <SearchInput
          placeholder="Search by name, alias, national ID, phone number, vehicle plate, or case..."
          value={searchQuery}
          onValueChange={val => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        groups={filterGroups}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('ALL');
          setRiskFilter('ALL');
          setCurrentPage(1);
        }}
      />

      {/* Active Filter Notice Bar */}
      {(statusFilter !== 'ALL' || riskFilter !== 'ALL') && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'var(--status-info-bg)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} color="var(--accent)" aria-hidden="true" />
            <span style={{ fontSize: '15px', color: 'var(--text)' }}>
              Filtered dossier view:{' '}
              <strong>
                {statusFilter === 'SUSPECT' && 'Active Suspects'}
                {statusFilter === 'PERSON_OF_INTEREST' && 'Persons of Interest'}
                {statusFilter === 'ASSOCIATE' && 'Monitored Associates'}
                {statusFilter === 'WITNESS' && 'Witnesses'}
                {riskFilter === 'HIGH' && 'High Risk Tier'}
                {riskFilter === 'ELEVATED' && 'Elevated Risk Tier'}
                {riskFilter === 'STANDARD' && 'Standard Risk Tier'}
              </strong>
              {' · '}
              <span style={{ color: 'var(--text-muted)' }}>
                {filteredPersons.length} matching criminal subject{filteredPersons.length === 1 ? '' : 's'}
              </span>
            </span>
          </div>
          <Button
            variant="secondary"
            style={{ minHeight: '36px', padding: '0 12px' }}
            icon={<X size={14} />}
            onClick={() => {
              setStatusFilter('ALL');
              setRiskFilter('ALL');
              setCurrentPage(1);
            }}
          >
            Clear Filter & Show All
          </Button>
        </div>
      )}

      {loading && <LoadingState message="Loading station criminal records registry..." />}

      {error && (
        <ErrorState
          title="Unable to load criminal records"
          message={error}
          onAction={loadPersons}
        />
      )}

      {!loading && !error && (
        <>
          {filteredPersons.length === 0 ? (
            <EmptyState
              title="No criminal records match your search"
              message="Try adjusting your search criteria or resetting filters to view all station dossiers."
              actionText="Reset All Filters"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setRiskFilter('ALL');
                setCurrentPage(1);
              }}
            />
          ) : (
            <div>
              <DataTable
                columns={columns}
                data={paginatedPersons}
                keyExtractor={item => item.id}
                onRowClick={item => navigate(`/persons/${item.id}`)}
              />

              {/* Pagination Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, filteredPersons.length)} of{' '}
                  {filteredPersons.length} subjects
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    style={{ minHeight: '36px', padding: '0 12px' }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    style={{ minHeight: '36px', padding: '0 12px' }}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
