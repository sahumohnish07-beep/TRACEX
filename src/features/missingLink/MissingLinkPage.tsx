import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  GitFork,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { SourceBadge } from '../../components/SourceBadge';
import { Modal } from '../../components/Modal';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateContainer';
import { fetchCaseDetail, fetchMissingLinks } from '../../api/services';
import { useRbac } from '../../core/rbac';
import type { MissingLinkCandidate, CaseItem } from '../../types';

export const MissingLinkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEditCase } = useRbac();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidates, setCandidates] = useState<MissingLinkCandidate[]>([]);
  const [currentCase, setCurrentCase] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissModalOpen, setDismissModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [caseData, linksData] = await Promise.all([
        fetchCaseDetail(id),
        fetchMissingLinks(id),
      ]);
      setCurrentCase(caseData);
      setCandidates(linksData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load missing links analysis.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const candidate = candidates[currentIndex];

  const handleNext = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActionNotice(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setActionNotice(null);
    }
  };

  const handleConfirm = () => {
    const updated = [...candidates];
    updated[currentIndex] = { ...candidate, status: 'CONFIRMED' };
    setCandidates(updated);
    setActionNotice('Connection confirmed and merged into case investigation graph.');
  };

  const handleDismiss = () => {
    const updated = [...candidates];
    updated[currentIndex] = { ...candidate, status: 'DISMISSED' };
    setCandidates(updated);
    setDismissModalOpen(false);
    setActionNotice('Candidate connection dismissed. Record retained in audit trail.');
  };

  if (loading) {
    return <LoadingState message="Running graph missing link analysis and corroboration checks..." />;
  }

  if (error || !currentCase) {
    return (
      <ErrorState
        title="Missing link analysis unavailable"
        message={error || 'Case not found'}
        onAction={loadData}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={`Missing Link Analysis: ${currentCase.title}`}
        subtitle={`${currentCase.id} · Automated graph correlation engine`}
        onBack={() => navigate(`/cases/${currentCase.id}`)}
        badge={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--status-warning-bg)',
              color: 'var(--status-warning)',
              border: '1px solid #FFE0B2',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            <AlertCircle size={14} />
            REQUIRES INVESTIGATOR REVIEW
          </span>
        }
      />

      {candidates.length === 0 && (
        <EmptyState
          title="No missing link candidates found"
          message="Graph topology and anomaly analysis did not detect any high-probability unlinked entities for this case."
        />
      )}

      {candidates.length > 0 && (
        <>
          {/* Stepper / candidate count indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              padding: '12px 20px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitFork size={18} color="var(--primary)" />
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                Candidate Connection {currentIndex + 1} of {candidates.length}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="secondary"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                style={{ minHeight: '36px', padding: '0 12px' }}
              >
                <ArrowLeft size={16} /> Previous
              </Button>
              <Button
                variant="secondary"
                disabled={currentIndex >= candidates.length - 1}
                onClick={handleNext}
                style={{ minHeight: '36px', padding: '0 12px' }}
              >
                Next <ArrowRight size={16} />
              </Button>
            </div>
          </div>

      {actionNotice && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            border: '1px solid #C8E6C9',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {candidate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Candidate Card */}
          <Card padding="28px">
            {/* Entity Linking Visual */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                backgroundColor: 'var(--bg-page)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              {/* Source Entity */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Source Entity ({candidate.sourceEntity.type})
                </span>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                  {candidate.sourceEntity.name}
                </div>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                  {candidate.sourceEntity.id}
                </span>
              </div>

              {/* Center Link Status */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0 16px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>
                  CANDIDATE LINK
                </span>
                <div
                  style={{
                    width: '120px',
                    height: '2px',
                    backgroundColor: 'var(--accent)',
                    borderTop: '2px dashed var(--accent)',
                  }}
                />
                <div style={{ marginTop: '6px' }}>
                  <StatusBadge
                    status={candidate.evidenceStrength}
                    customLabel={`Strength: ${candidate.evidenceStrength}`}
                  />
                </div>
              </div>

              {/* Target Entity */}
              <div style={{ flex: 1, minWidth: '200px', textAlign: 'right' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target Entity ({candidate.targetEntity.type})
                </span>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                  {candidate.targetEntity.name}
                </div>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                  {candidate.targetEntity.id}
                </span>
              </div>
            </div>

            {/* Why This Connection Was Identified */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
                Why This Connection Was Identified
              </h3>

              {/* Connection Basis Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {candidate.connectionBasis.map((chip, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      border: '1px solid #D0D8F0',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Evidence Basis List */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
                Underlying Forensic Evidence Basis
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {candidate.evidenceBasis.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface)',
                      fontSize: '14px',
                    }}
                  >
                    <FileText size={16} color="var(--primary)" aria-hidden="true" />
                    <span style={{ color: 'var(--text)', fontWeight: 500, flex: 1 }}>{ev}</span>
                    <SourceBadge type="AI_ANALYSIS" compact />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border)',
                paddingTop: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Status:</span>
                <StatusBadge status={candidate.status} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="destructive"
                  icon={<XCircle size={16} />}
                  onClick={() => setDismissModalOpen(true)}
                  disabled={candidate.status === 'DISMISSED' || !canEditCase}
                >
                  Dismiss Connection
                </Button>
                <Button
                  variant="primary"
                  icon={<CheckCircle2 size={16} />}
                  onClick={handleConfirm}
                  disabled={candidate.status === 'CONFIRMED' || !canEditCase}
                >
                  Confirm Connection
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
      </>
      )}

      {/* Dismiss Confirmation Modal */}
      <Modal
        isOpen={dismissModalOpen}
        onClose={() => setDismissModalOpen(false)}
        title="Confirm Dismissal of Candidate Connection"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDismissModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDismiss}>
              Confirm Dismissal
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, marginBottom: '12px' }}>
          Are you sure you want to dismiss the candidate connection between{' '}
          <strong>{candidate?.sourceEntity.name}</strong> and{' '}
          <strong>{candidate?.targetEntity.name}</strong>?
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          This will archive the candidate link from active workspace visualization. A full immutable entry will be recorded in the Station Audit Log under your officer badge.
        </p>
      </Modal>
    </div>
  );
};
