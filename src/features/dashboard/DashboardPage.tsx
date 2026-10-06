import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Cpu,
  SendHorizontal,
  Share2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable, type Column } from '../../components/DataTable';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import {
  fetchDashboardSummary,
  fetchCases,
  fetchDataRequests,
  fetchMissingLinks,
  type DashboardSummaryResponse,
} from '../../api/services';
import { useRbac } from '../../core/rbac';
import type { CaseItem, DataRequestItem, MissingLinkCandidate } from '../../types';

export type DashboardFilter = 'ACTIVE_CASES' | 'UNDER_ANALYSIS' | 'PENDING_REQUESTS' | 'NEW_CONNECTIONS' | null;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { canCreateCase } = useRbac();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [requests, setRequests] = useState<DataRequestItem[]>([]);
  const [newConnections, setNewConnections] = useState<MissingLinkCandidate[]>([]);
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, casesData, requestsData, linksData] = await Promise.all([
        fetchDashboardSummary(),
        fetchCases(),
        fetchDataRequests(),
        fetchMissingLinks('CASE-2026-0891'),
      ]);
      setSummary(summaryData);
      setCases(casesData);
      setRequests(requestsData);
      setNewConnections(linksData);
    } catch (err: any) {
      setError(err?.message || 'Failed to communicate with the station API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered datasets
  const activeCases = useMemo(() => cases.filter(c => c.status === 'ACTIVE'), [cases]);
  const underAnalysisCases = useMemo(() => cases.filter(c => c.status === 'UNDER_ANALYSIS'), [cases]);
  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'PENDING'), [requests]);
  const candidateConnections = useMemo(() => newConnections, [newConnections]);

  const activeCasesCount = activeCases.length > 0 ? activeCases.length : (summary?.activeCases ?? 0);
  const underAnalysisCount = underAnalysisCases.length > 0 ? underAnalysisCases.length : (summary?.casesUnderAnalysis ?? 0);
  const pendingRequestsCount = pendingRequests.length > 0 ? pendingRequests.length : (summary?.pendingRequests ?? 0);
  const newConnectionsCount = candidateConnections.length > 0 ? candidateConnections.length : (summary?.newConnections ?? 0);

  // Table columns for Cases
  const caseColumns: Column<CaseItem>[] = [
    {
      header: 'Case Identifier',
      accessor: 'id',
      width: '180px',
      render: c => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {c.id}
        </span>
      ),
    },
    {
      header: 'Case Title / Primary Offense',
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
      render: c => <span style={{ color: 'var(--text)' }}>{c.leadOfficer}</span>,
    },
    {
      header: 'Entities',
      width: '120px',
      align: 'right',
      render: c => (
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
          {c.entitiesCount} nodes
        </span>
      ),
    },
    {
      header: 'Action',
      width: '150px',
      align: 'right',
      render: c => (
        <Button
          variant="secondary"
          style={{ minHeight: '36px', padding: '0 12px' }}
          icon={<ArrowRight size={14} />}
          onClick={e => {
            e.stopPropagation();
            navigate(`/cases/${c.id}`);
          }}
        >
          Inspect
        </Button>
      ),
    },
  ];

  // Table columns for Pending Requests
  const requestColumns: Column<DataRequestItem>[] = [
    {
      header: 'Request Reference',
      accessor: 'id',
      width: '190px',
      render: r => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {r.id}
        </span>
      ),
    },
    {
      header: 'Target Authority',
      accessor: 'targetAuthority',
      render: r => <span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.targetAuthority}</span>,
    },
    {
      header: 'Associated Case',
      render: r => (
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)', marginRight: '6px' }}>
            {r.caseId}
          </span>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{r.caseTitle}</div>
        </div>
      ),
    },
    {
      header: 'Urgency',
      width: '140px',
      render: r => <StatusBadge status={r.urgency} />,
    },
    {
      header: 'Status',
      width: '150px',
      render: r => <StatusBadge status={r.status} />,
    },
    {
      header: 'Date Filed',
      accessor: 'requestDate',
      width: '140px',
      render: r => <span style={{ color: 'var(--text)' }}>{r.requestDate}</span>,
    },
    {
      header: 'Action',
      width: '150px',
      align: 'right',
      render: () => (
        <Button
          variant="secondary"
          style={{ minHeight: '36px', padding: '0 12px' }}
          icon={<ExternalLink size={14} />}
          onClick={e => {
            e.stopPropagation();
            navigate('/requests');
          }}
        >
          Ledger
        </Button>
      ),
    },
  ];

  // Table columns for New Connections
  const connectionColumns: Column<MissingLinkCandidate>[] = [
    {
      header: 'Candidate Ref',
      accessor: 'id',
      width: '140px',
      render: m => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {m.id}
        </span>
      ),
    },
    {
      header: 'Entity Correlation Pair',
      render: m => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{m.sourceEntity.name}</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>&harr;</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{m.targetEntity.name}</span>
        </div>
      ),
    },
    {
      header: 'Associated Case',
      render: m => (
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)', marginRight: '6px' }}>
            {m.caseId}
          </span>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{m.caseTitle}</div>
        </div>
      ),
    },
    {
      header: 'Strength',
      width: '140px',
      render: m => <StatusBadge status={m.evidenceStrength} />,
    },
    {
      header: 'Primary Evidence Basis',
      render: m => (
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {m.connectionBasis[0] || 'Statistical co-occurrence'}
        </span>
      ),
    },
    {
      header: 'Identified',
      accessor: 'identifiedDate',
      width: '130px',
      render: m => <span style={{ color: 'var(--text)' }}>{m.identifiedDate}</span>,
    },
    {
      header: 'Action',
      width: '160px',
      align: 'right',
      render: m => (
        <Button
          variant="secondary"
          style={{ minHeight: '36px', padding: '0 12px' }}
          icon={<ArrowRight size={14} />}
          onClick={e => {
            e.stopPropagation();
            navigate(`/cases/${m.caseId}/missing-links`);
          }}
        >
          Review Link
        </Button>
      ),
    },
  ];

  const handleStatCardClick = (filter: DashboardFilter) => {
    setActiveFilter(prev => (prev === filter ? null : filter));
  };

  return (
    <div>
      <PageHeader
        title="Local Authority Investigation Dashboard"
        subtitle="Central Division Police Station · Operational Overview"
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

      {loading && <LoadingState message="Loading station dashboard metrics..." />}

      {error && (
        <ErrorState
          title="Unable to load dashboard summary"
          message={error}
          onAction={loadData}
        />
      )}

      {!loading && !error && (
        <>
          {/* 4 Clickable Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '24px',
            }}
          >
            <StatCard
              label="Active Cases"
              value={activeCasesCount}
              icon={<FolderKanban size={20} />}
              hint="Assigned to local jurisdiction"
              isActive={activeFilter === 'ACTIVE_CASES'}
              onClick={() => handleStatCardClick('ACTIVE_CASES')}
            />
            <StatCard
              label="Under Analysis"
              value={underAnalysisCount}
              icon={<Cpu size={20} />}
              hint="Active graph & entity pipelines"
              isActive={activeFilter === 'UNDER_ANALYSIS'}
              onClick={() => handleStatCardClick('UNDER_ANALYSIS')}
            />
            <StatCard
              label="Pending Requests"
              value={pendingRequestsCount}
              icon={<SendHorizontal size={20} />}
              hint="Inter-agency data inquiries"
              isActive={activeFilter === 'PENDING_REQUESTS'}
              onClick={() => handleStatCardClick('PENDING_REQUESTS')}
            />
            <StatCard
              label="New Connections"
              value={newConnectionsCount}
              icon={<Share2 size={20} />}
              hint="AI & system-derived candidates"
              isActive={activeFilter === 'NEW_CONNECTIONS'}
              onClick={() => handleStatCardClick('NEW_CONNECTIONS')}
            />
          </div>

          {/* Active Filter Notice Bar */}
          {activeFilter !== null && (
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
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Filter size={18} color="var(--accent)" aria-hidden="true" />
                <span style={{ fontSize: '15px', color: 'var(--text)' }}>
                  Filtered view active:{' '}
                  <strong>
                    {activeFilter === 'ACTIVE_CASES' && 'Active Cases'}
                    {activeFilter === 'UNDER_ANALYSIS' && 'Cases Under Analysis'}
                    {activeFilter === 'PENDING_REQUESTS' && 'Pending Requests'}
                    {activeFilter === 'NEW_CONNECTIONS' && 'New Connections'}
                  </strong>
                  {' · '}
                  <span style={{ color: 'var(--text-muted)' }}>
                    {activeFilter === 'ACTIVE_CASES' && `${activeCases.length} active investigations`}
                    {activeFilter === 'UNDER_ANALYSIS' && `${underAnalysisCases.length} cases processing`}
                    {activeFilter === 'PENDING_REQUESTS' && `${pendingRequests.length} pending requisitions`}
                    {activeFilter === 'NEW_CONNECTIONS' && `${candidateConnections.length} connection candidates`}
                  </span>
                </span>
              </div>
              <Button
                variant="secondary"
                style={{ minHeight: '36px', padding: '0 12px' }}
                icon={<X size={14} />}
                onClick={() => setActiveFilter(null)}
              >
                Clear Filter & Show All
              </Button>
            </div>
          )}

          {/* 1. If ACTIVE_CASES Filter Selected: ONLY show Active Cases */}
          {activeFilter === 'ACTIVE_CASES' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    Active Station Cases ({activeCases.length})
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Only displaying cases registered under local jurisdiction with ACTIVE operational status.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/cases')}>
                  View All in Registry &rarr;
                </Button>
              </div>

              {activeCases.length === 0 ? (
                <EmptyState
                  title="No active cases found"
                  message="There are currently no cases in active status in this jurisdiction."
                  actionText={canCreateCase ? 'Create New Case' : undefined}
                  onAction={canCreateCase ? () => navigate('/cases/new') : undefined}
                />
              ) : (
                <DataTable
                  columns={caseColumns}
                  data={activeCases}
                  keyExtractor={item => item.id}
                  onRowClick={item => navigate(`/cases/${item.id}`)}
                />
              )}
            </div>
          )}

          {/* 2. If UNDER_ANALYSIS Filter Selected: ONLY show Under Analysis Cases */}
          {activeFilter === 'UNDER_ANALYSIS' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    Cases Under Active Analysis ({underAnalysisCases.length})
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Investigations actively processing algorithmic entity extraction, CDR correlation, and graph inference.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/cases')}>
                  View All in Registry &rarr;
                </Button>
              </div>

              {underAnalysisCases.length === 0 ? (
                <EmptyState
                  title="No cases under analysis"
                  message="No cases are currently undergoing graph processing or entity extraction."
                />
              ) : (
                <DataTable
                  columns={caseColumns}
                  data={underAnalysisCases}
                  keyExtractor={item => item.id}
                  onRowClick={item => navigate(`/cases/${item.id}`)}
                />
              )}
            </div>
          )}

          {/* 3. If PENDING_REQUESTS Filter Selected: ONLY show Pending Requests */}
          {activeFilter === 'PENDING_REQUESTS' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    Pending Inter-Agency Requests ({pendingRequests.length})
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Data inquiries and statutory records requested from external police and intelligence jurisdictions.
                  </p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/requests')}>
                  Open Requests Ledger &rarr;
                </Button>
              </div>

              {pendingRequests.length === 0 ? (
                <EmptyState
                  title="No pending data requests"
                  message="All inter-agency requisitions have been approved, rejected, or completed."
                  actionText="File New Request"
                  onAction={() => navigate('/requests/new')}
                />
              ) : (
                <DataTable
                  columns={requestColumns}
                  data={pendingRequests}
                  keyExtractor={item => item.id}
                  onRowClick={() => navigate('/requests')}
                />
              )}
            </div>
          )}

          {/* 4. If NEW_CONNECTIONS Filter Selected: ONLY show New Connections */}
          {activeFilter === 'NEW_CONNECTIONS' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    New Connections & Missing Links ({candidateConnections.length})
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Algorithmic candidate links flagged by telecom co-location, shared financial trails, and latent evidence.
                  </p>
                </div>
              </div>

              {candidateConnections.length === 0 ? (
                <EmptyState
                  title="No new connection candidates"
                  message="System has not flagged any new missing link correlations for current cases."
                />
              ) : (
                <DataTable
                  columns={connectionColumns}
                  data={candidateConnections}
                  keyExtractor={item => item.id}
                  onRowClick={item => navigate(`/cases/${item.caseId}/missing-links`)}
                />
              )}
            </div>
          )}

          {/* 5. Default View (No filter selected): Overview with Attention Alert & Recent Cases */}
          {activeFilter === null && (
            <>
              {/* Requires Attention Section */}
              {summary && summary.recentCases.filter(c => c.requiresAttention).length > 0 && (
                <div style={{ marginBottom: '36px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <AlertTriangle size={18} color="var(--status-danger)" aria-hidden="true" />
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      Requires Investigator Attention ({summary.recentCases.filter(c => c.requiresAttention).length})
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {summary.recentCases
                      .filter(c => c.requiresAttention)
                      .map(item => (
                        <Card key={item.id} padding="20px 24px">
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: 'var(--primary)',
                                  }}
                                >
                                  {item.id}
                                </span>
                                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                                  {item.title}
                                </span>
                                <StatusBadge status={item.priority} />
                              </div>
                              <p style={{ margin: 0, fontSize: '14px', color: 'var(--status-danger)', fontWeight: 500 }}>
                                {item.attentionReason || 'Requires immediate review'}
                              </p>
                            </div>

                            <Button
                              variant="secondary"
                              icon={<ArrowRight size={16} />}
                              onClick={() => navigate(`/cases/${item.id}`)}
                            >
                              Inspect Case
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Recent Cases Table */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    Active Station Investigations
                  </h2>
                  <Button variant="ghost" onClick={() => navigate('/cases')}>
                    View All Cases &rarr;
                  </Button>
                </div>

                {(!summary?.recentCases || summary.recentCases.length === 0) ? (
                  <EmptyState
                    title="No active station investigations"
                    message="No cases registered under current local jurisdiction."
                    actionText={canCreateCase ? 'Create First Case' : undefined}
                    onAction={canCreateCase ? () => navigate('/cases/new') : undefined}
                  />
                ) : (
                  <DataTable
                    columns={caseColumns}
                    data={summary.recentCases.slice(0, 5)}
                    keyExtractor={item => item.id}
                    onRowClick={item => navigate(`/cases/${item.id}`)}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
