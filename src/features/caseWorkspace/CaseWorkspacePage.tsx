import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Network,
  GitFork,
  Building,
  Calendar,
  FileCheck,
  Upload,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { SourceBadge } from '../../components/SourceBadge';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tabs } from '../../components/Tabs';
import { DataTable, type Column } from '../../components/DataTable';
import { LoadingState, ErrorState } from '../../components/StateContainer';
import { fetchCaseDetail, uploadCaseDocument } from '../../api/services';
import { useRbac } from '../../core/rbac';
import { MOCK_PERSONS, MOCK_EVIDENCE_ITEMS } from '../../data/mockData';
import type { EvidenceItem, CaseItem } from '../../types';

export const CaseWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEditCase } = useRbac();
  const [activeTab, setActiveTab] = useState('overview');

  const [currentCase, setCurrentCase] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCase = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCaseDetail(id);
      setCurrentCase(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve case dossier from station database.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    setUploading(true);
    setUploadSuccess(null);
    try {
      const res = await uploadCaseDocument(id, file);
      setUploadSuccess(`Document ${res.filename} uploaded successfully. Analysis pipeline queued.`);
      loadCase();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const caseTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'network', label: 'Network Graph' },
    { id: 'persons', label: 'Persons & Entities', badge: currentCase?.entitiesCount || 0 },
    { id: 'evidence', label: 'Evidence Dossier', badge: currentCase?.evidenceCount || 0 },
    { id: 'missing-links', label: 'Missing Link Analysis' },
    { id: 'requests', label: 'Data Requests' },
  ];

  const handleTabChange = (tabId: string) => {
    if (!currentCase) return;
    if (tabId === 'network') {
      navigate(`/cases/${currentCase.id}/network`);
    } else if (tabId === 'missing-links') {
      navigate(`/cases/${currentCase.id}/missing-links`);
    } else if (tabId === 'requests') {
      navigate('/requests');
    } else {
      setActiveTab(tabId);
    }
  };

  const evidenceColumns: Column<EvidenceItem>[] = [
    {
      header: 'Evidence ID',
      accessor: 'id',
      width: '160px',
      render: e => (
        <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {e.id}
        </span>
      ),
    },
    {
      header: 'Category',
      accessor: 'type',
      width: '180px',
    },
    {
      header: 'Description & Seizure Details',
      render: e => <span style={{ color: 'var(--text)' }}>{e.description}</span>,
    },
    {
      header: 'Collected',
      accessor: 'dateCollected',
      width: '140px',
    },
    {
      header: 'Chain of Custody',
      accessor: 'chainOfCustody',
      width: '240px',
    },
    {
      header: 'Source Verification',
      width: '200px',
      render: e => <SourceBadge type={e.sourceType} compact />,
    },
  ];

  if (loading) {
    return <LoadingState message="Loading case dossier and investigative evidence..." />;
  }

  if (error || !currentCase) {
    return (
      <ErrorState
        title="Case dossier unavailable"
        message={error || 'Case not found'}
        onAction={loadCase}
      />
    );
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
      />

      <PageHeader
        title={currentCase.title}
        subtitle={`${currentCase.id} · ${currentCase.crimeType}`}
        onBack={() => navigate('/cases')}
        badge={<StatusBadge status={currentCase.status} />}
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            {canEditCase && (
              <Button
                variant="secondary"
                icon={<Upload size={16} />}
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Processing Document...' : 'Upload Document'}
              </Button>
            )}
            <Button
              variant="secondary"
              icon={<GitFork size={16} />}
              onClick={() => navigate(`/cases/${currentCase.id}/missing-links`)}
            >
              Missing Link Analysis
            </Button>
            <Button
              variant="primary"
              icon={<Network size={16} />}
              onClick={() => navigate(`/cases/${currentCase.id}/network`)}
            >
              Open Network Analysis
            </Button>
          </div>
        }
      />

      {uploadSuccess && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--status-success)',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          {uploadSuccess}
        </div>
      )}

      {/* Case Metadata Banner */}
      <Card style={{ marginBottom: '28px', padding: '18px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            fontSize: '14px',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Station Jurisdiction:
            </span>
            <span style={{ fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={14} color="var(--primary)" />
              {currentCase.station}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Lead Investigating Officer:
            </span>
            <span style={{ fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck size={14} color="var(--primary)" />
              {currentCase.leadOfficer}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Date Registered:
            </span>
            <span style={{ fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--primary)" />
              {currentCase.dateOpened}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Case Priority:
            </span>
            <StatusBadge status={currentCase.priority} />
          </div>
        </div>
      </Card>

      {/* Workspace Tabs */}
      <Tabs tabs={caseTabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Case Summary */}
          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Investigative Case Summary
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              {currentCase.summary}
            </p>
          </Card>

          {/* Known Entities */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                Primary Identified Subjects &amp; Persons of Interest ({MOCK_PERSONS.length})
              </h2>
              <Button
                variant="ghost"
                onClick={() => navigate(`/cases/${currentCase.id}/network`)}
              >
                Inspect in Graph &rarr;
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {MOCK_PERSONS.map(person => (
                <Card key={person.id} padding="20px">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          margin: '0 0 2px 0',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/persons/${person.id}`)}
                      >
                        {person.fullName}
                      </h3>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        Aliases: {person.aliases.join(', ')}
                      </span>
                    </div>
                    <StatusBadge status={person.status} />
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <div><strong>Address:</strong> {person.primaryAddress}</div>
                    <div><strong>Phone:</strong> {person.phoneNumbers.join(', ')}</div>
                    <div><strong>Vehicles:</strong> {person.vehicles.join(', ')}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <SourceBadge type="VERIFIED_RECORD" compact />
                    <Button
                      variant="secondary"
                      style={{ minHeight: '36px', padding: '0 12px' }}
                      onClick={() => navigate(`/persons/${person.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Cases */}
          <Card>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
              Cross-Jurisdiction &amp; Related Investigations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginRight: '12px' }}>
                    CASE-2026-0419
                  </span>
                  <span style={{ fontWeight: 500, color: 'var(--text)' }}>
                    Illegal SIM Gateway &amp; Phishing Call Hub
                  </span>
                </div>
                <SourceBadge type="SYSTEM_DERIVED" compact />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginRight: '12px' }}>
                    NM-CR-2026-1108
                  </span>
                  <span style={{ fontWeight: 500, color: 'var(--text)' }}>
                    Port Extortion &amp; Contraband (Navi Mumbai Crime Branch)
                  </span>
                </div>
                <SourceBadge type="AI_ANALYSIS" compact />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Evidence Tab Content */}
      {activeTab === 'evidence' && (
        <div>
          <DataTable
            columns={evidenceColumns}
            data={MOCK_EVIDENCE_ITEMS}
            keyExtractor={item => item.id}
          />
        </div>
      )}

      {/* Persons Tab Content */}
      {activeTab === 'persons' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {MOCK_PERSONS.map(person => (
            <Card key={person.id} padding="20px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      margin: '0 0 2px 0',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/persons/${person.id}`)}
                  >
                    {person.fullName}
                  </h3>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    National ID: {person.nationalId}
                  </span>
                </div>
                <StatusBadge status={person.status} />
              </div>

              <div style={{ fontSize: '14px', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div><strong>Address:</strong> {person.primaryAddress}</div>
                <div><strong>Contact:</strong> {person.phoneNumbers.join(', ')}</div>
                <div><strong>Associated Cases:</strong> {person.associatedCases.length} records</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <SourceBadge type="VERIFIED_RECORD" compact />
                <Button
                  variant="secondary"
                  style={{ minHeight: '36px', padding: '0 12px' }}
                  onClick={() => navigate(`/persons/${person.id}`)}
                >
                  Full Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
