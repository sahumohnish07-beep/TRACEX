import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { fetchDataRequests, fetchCaseDetail } from '../../api/services';
import { useRbac } from '../../core/rbac';
import type { DataRequestItem, CaseItem } from '../../types';

export const DataRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { canCreateCase } = useRbac();
  const [requests, setRequests] = useState<DataRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<{ request: DataRequestItem; caseDetail?: CaseItem } | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load data requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCaseClick = async (request: DataRequestItem) => {
    setSelectedCase({ request });
    try {
      const detail = await fetchCaseDetail(request.caseId);
      setSelectedCase({ request, caseDetail: detail });
    } catch {
      // Still show request-level details if case fetch fails
    }
  };

  const columns: Column<DataRequestItem>[] = [
    {
      header: 'Request Reference',
      accessor: 'id',
      width: '180px',
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
        <div
          onClick={e => {
            e.stopPropagation();
            handleCaseClick(r);
          }}
          style={{ cursor: 'pointer' }}
          title="Click to view case summary"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
            {r.caseId}
          </span>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>{r.caseTitle}</div>
        </div>
      ),
    },
    {
      header: 'Requested Information',
      render: r => (
        <span style={{ fontSize: '14px', color: 'var(--text)' }}>
          {r.categories?.join(' · ') || 'General Records'}
        </span>
      ),
    },
    {
      header: 'Date Filed',
      accessor: 'requestDate',
      width: '140px',
    },
    {
      header: 'Urgency',
      accessor: 'urgency',
      width: '120px',
      render: r => <StatusBadge status={r.urgency} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '140px',
      render: r => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Inter-Agency Data Requests"
        subtitle="Outgoing formal data requisitions under official statutory mandate"
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            disabled={!canCreateCase}
            onClick={() => navigate('/requests/new')}
          >
            New Data Request
          </Button>
        }
      />

      {loading && <LoadingState message="Loading outgoing data requests..." />}

      {error && (
        <ErrorState
          title="Failed to load requests"
          message={error}
          onAction={loadRequests}
        />
      )}

      {!loading && !error && requests.length === 0 && (
        <EmptyState
          title="No data requests filed"
          message="No inter-agency requisitions have been filed from this station."
          actionText="File New Data Request"
          onAction={() => navigate('/requests/new')}
        />
      )}

      {!loading && !error && requests.length > 0 && (
        <DataTable
          columns={columns}
          data={requests}
          keyExtractor={item => item.id}
          onRowClick={item => handleCaseClick(item)}
        />
      )}

      {/* Case Summary Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={`Case Summary: ${selectedCase.request.caseId}`}
          maxWidth="640px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Button variant="secondary" onClick={() => setSelectedCase(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={<ArrowRight size={16} />}
                onClick={() => {
                  const caseId = selectedCase.request.caseId;
                  setSelectedCase(null);
                  navigate(`/cases/${caseId}`);
                }}
              >
                Open Full Case Workspace
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
            {/* Header info */}
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--bg-page)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                  Case Title
                </span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  {selectedCase.caseDetail?.title || selectedCase.request.caseTitle}
                </span>
              </div>
              {selectedCase.caseDetail && (
                <StatusBadge status={selectedCase.caseDetail.status} />
              )}
            </div>

            {/* Case Summary Description */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                Case Summary:
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg-page)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                {selectedCase.caseDetail?.summary ||
                  'Active case investigation under analysis involving cross-jurisdiction intelligence sharing and forensic audit trails.'}
              </p>
            </div>

            {/* Crime Type & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Crime Type:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {selectedCase.caseDetail?.crimeType || 'Syndicate Criminal Operation'}
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Priority:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {selectedCase.caseDetail?.priority || selectedCase.request.urgency}
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Lead Officer:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {selectedCase.caseDetail?.leadOfficer || selectedCase.request.requestingOfficer}
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Jurisdiction Station:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {selectedCase.caseDetail?.station || 'Central Division Police Station'}
                </span>
              </div>
            </div>

            {/* Associated Request Context */}
            <div
              style={{
                backgroundColor: '#EFF8FF',
                border: '1px solid #B2DDFF',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#175CD3', marginBottom: '4px' }}>
                REQUISITION TO: {selectedCase.request.targetAuthority}
              </div>
              <div style={{ fontSize: '13px', color: '#1849A9' }}>
                <strong>Purpose:</strong> {selectedCase.request.purpose}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
