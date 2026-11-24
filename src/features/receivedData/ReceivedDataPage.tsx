import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  Network,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { DataTable, type Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { fetchReceivedData, addToInvestigationView, fetchCaseDetail } from '../../api/services';
import type { ReceivedDataItem, CaseItem } from '../../types';

export const ReceivedDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ReceivedDataItem | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<{ payload: ReceivedDataItem; caseData?: CaseItem } | null>(null);
  const [importModalItem, setImportModalItem] = useState<ReceivedDataItem | null>(null);
  const [dataList, setDataList] = useState<ReceivedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReceivedData();
      setDataList(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load received data packages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCaseClick = async (item: ReceivedDataItem) => {
    setSelectedCaseDetail({ payload: item });
    try {
      const detail = await fetchCaseDetail(item.caseId);
      setSelectedCaseDetail({ payload: item, caseData: detail });
    } catch {
      // Fallback shows item context
    }
  };

  const handleImportToView = async () => {
    if (!importModalItem) return;
    try {
      await addToInvestigationView(importModalItem.id, importModalItem.caseId);
      setDataList(prev =>
        prev.map(d => (d.id === importModalItem.id ? { ...d, addedToView: true } : d))
      );
      setImportModalItem(null);
      alert(`Payload ${importModalItem.id} imported into case investigation view.`);
      navigate(`/cases/${importModalItem.caseId}/network`);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  const columns: Column<ReceivedDataItem>[] = [
    {
      header: 'Payload ID',
      accessor: 'id',
      width: '160px',
      render: r => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {r.id}
        </span>
      ),
    },
    {
      header: 'Source Agency',
      accessor: 'sourceAuthority',
      render: r => <span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.sourceAuthority}</span>,
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
          title="Click to view detailed case summary"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
            {r.caseId}
          </span>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>{r.caseTitle}</div>
        </div>
      ),
    },
    {
      header: 'Transfer Protocol',
      accessor: 'transferProtocol',
      width: '240px',
      render: r => <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{r.transferProtocol}</span>,
    },
    {
      header: 'Date Received',
      accessor: 'receivedDate',
      width: '140px',
    },
    {
      header: 'Workspace Status',
      width: '180px',
      render: r =>
        r.addedToView ? (
          <span style={{ color: 'var(--status-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
            <CheckCircle2 size={16} /> Added to View
          </span>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Unassigned</span>
        ),
    },
    {
      header: 'Action',
      width: '180px',
      align: 'right',
      render: r => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            style={{ minHeight: '34px', padding: '0 10px', fontSize: '14px' }}
            onClick={e => {
              e.stopPropagation();
              setSelectedItem(r);
            }}
          >
            Details
          </Button>
          <Button
            variant="primary"
            style={{ minHeight: '34px', padding: '0 10px', fontSize: '14px' }}
            onClick={e => {
              e.stopPropagation();
              setImportModalItem(r);
            }}
            disabled={r.addedToView}
          >
            Add to View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Received External Intelligence Data"
        subtitle="Inbound encrypted intelligence packages from State, Central, and partner jurisdictions"
      />

      {/* Prominent Isolation Notice */}
      <Card
        padding="18px 24px"
        style={{
          marginBottom: '24px',
          backgroundColor: 'var(--primary-subtle)',
          borderColor: '#C7D2FE',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
            CONTROLLED INGESTION POLICY:
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text)' }}>
            External data is never automatically merged into original case records. Data must be reviewed and selectively added to an Investigation View.
          </span>
        </div>
      </Card>

      {loading && <LoadingState message="Loading received intelligence payloads..." />}

      {error && (
        <ErrorState
          title="Failed to load intelligence packages"
          message={error}
          onAction={loadData}
        />
      )}

      {!loading && !error && dataList.length === 0 && (
        <EmptyState
          title="No incoming intelligence packages"
          message="No data packages have been transferred from external agencies for station cases."
        />
      )}

      {!loading && !error && dataList.length > 0 && (
        <DataTable
          columns={columns}
          data={dataList}
          keyExtractor={item => item.id}
          onRowClick={item => setSelectedItem(item)}
        />
      )}

      {/* Payload Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Data Payload Details: ${selectedItem.id}`}
          maxWidth="600px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const it = selectedItem;
                  setSelectedItem(null);
                  handleCaseClick(it);
                }}
              >
                View Detailed Case Summary
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
            <div>
              <strong>Source Authority:</strong> {selectedItem.sourceAuthority}
            </div>
            <div>
              <strong>Case:</strong> {selectedItem.caseId} — {selectedItem.caseTitle}
            </div>
            <div>
              <strong>Summary:</strong> {selectedItem.summary}
            </div>
            <div>
              <strong>Record Types Included:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                {selectedItem.recordTypes.map((rt, i) => (
                  <li key={i}>{rt}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Entities Contained:</strong> {selectedItem.entitiesCount} verified entities
            </div>
            <div>
              <strong>Transfer Security:</strong> {selectedItem.transferProtocol}
            </div>
          </div>
        </Modal>
      )}

      {/* Detailed Case Summary Modal */}
      {selectedCaseDetail && (
        <Modal
          isOpen={!!selectedCaseDetail}
          onClose={() => setSelectedCaseDetail(null)}
          title={`Detailed Case Dossier Summary: ${selectedCaseDetail.payload.caseId}`}
          maxWidth="680px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Button variant="secondary" onClick={() => setSelectedCaseDetail(null)}>
                Close
              </Button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  icon={<Network size={16} />}
                  onClick={() => {
                    const caseId = selectedCaseDetail.payload.caseId;
                    setSelectedCaseDetail(null);
                    navigate(`/cases/${caseId}/network`);
                  }}
                >
                  Network Graph
                </Button>
                <Button
                  variant="primary"
                  icon={<ArrowRight size={16} />}
                  onClick={() => {
                    const caseId = selectedCaseDetail.payload.caseId;
                    setSelectedCaseDetail(null);
                    navigate(`/cases/${caseId}`);
                  }}
                >
                  Open Full Case Workspace
                </Button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px' }}>
            {/* Header info */}
            <div
              style={{
                padding: '16px 18px',
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
                  Case Title &amp; Classification
                </span>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                  {selectedCaseDetail.caseData?.title || selectedCaseDetail.payload.caseTitle}
                </span>
                <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                  {selectedCaseDetail.caseData?.crimeType || 'Organized Syndicate Crime'}
                </div>
              </div>
              {selectedCaseDetail.caseData && (
                <StatusBadge status={selectedCaseDetail.caseData.status} />
              )}
            </div>

            {/* Comprehensive Case Summary */}
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                Comprehensive Case Summary &amp; Scope:
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg-page)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                {selectedCaseDetail.caseData?.summary ||
                  'Active syndicate investigation with multi-jurisdiction coordination. High-priority inquiry establishing financial trails, electronic intercepts, and contraband transit logistics.'}
              </p>
            </div>

            {/* Case Metrics Row */}
            {selectedCaseDetail.caseData && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                }}
              >
                <div style={{ padding: '10px 14px', backgroundColor: '#F8F9FC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Linked Entities:</span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                    {selectedCaseDetail.caseData.entitiesCount} entities
                  </span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: '#F8F9FC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Network Links:</span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                    {selectedCaseDetail.caseData.connectionsCount} connections
                  </span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: '#F8F9FC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Seized Evidence:</span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#1E7B4F' }}>
                    {selectedCaseDetail.caseData.evidenceCount} items
                  </span>
                </div>
              </div>
            )}

            {/* Detailed Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Priority Level:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {selectedCaseDetail.caseData?.priority || 'HIGH'}
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Registration Date:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {selectedCaseDetail.caseData?.dateOpened || '2026-02-14'}
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Lead Investigating Officer:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {selectedCaseDetail.caseData?.leadOfficer || 'Insp. Vikram Deshmukh'}
                </span>
              </div>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>Jurisdiction Station:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  {selectedCaseDetail.caseData?.station || 'Central Division Police Station'}
                </span>
              </div>
            </div>

            {/* Inbound Payload Correlation Alert */}
            <div
              style={{
                backgroundColor: '#ECFDF3',
                border: '1px solid #A6F4C5',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#027A48', marginBottom: '2px' }}>
                CORRELATED INBOUND PAYLOAD: {selectedCaseDetail.payload.id} ({selectedCaseDetail.payload.sourceAuthority})
              </div>
              <div style={{ fontSize: '13px', color: '#05603A' }}>
                {selectedCaseDetail.payload.summary}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Import to View Modal */}
      {importModalItem && (
        <Modal
          isOpen={!!importModalItem}
          onClose={() => setImportModalItem(null)}
          title="Import External Data to Investigation View"
          footer={
            <>
              <Button variant="secondary" onClick={() => setImportModalItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<PlusCircle size={16} />} onClick={handleImportToView}>
                Import to View
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, marginBottom: '12px', fontSize: '16px' }}>
            Import <strong>{importModalItem.id}</strong> ({importModalItem.recordTypes.join(', ')}) into your active workspace view?
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            This copies entities into your private working graph. The official station case file will remain unmodified until supervisor sign-off.
          </p>
        </Modal>
      )}
    </div>
  );
};
