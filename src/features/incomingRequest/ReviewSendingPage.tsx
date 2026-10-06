import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Send,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { MOCK_INCOMING_REQUESTS } from '../../data/mockData';

import { shareRecordsForRequest, approveIncomingRequest } from '../../api/services';
import { useRbac } from '../../core/rbac';

export const ReviewSendingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canShareRecords } = useRbac();

  const req = MOCK_INCOMING_REQUESTS.find(r => r.id === id) || MOCK_INCOMING_REQUESTS[0];

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [certified, setCertified] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);

  const rawShares = sessionStorage.getItem('pending_share_items');
  const selectedShares: string[] = rawShares ? JSON.parse(rawShares) : req.availableData;
  const accessDuration = sessionStorage.getItem('pending_share_duration') || '30_DAYS';
  const sharingPurpose = sessionStorage.getItem('pending_share_purpose') || 'Mutual intelligence exchange';

  const handleTransmit = async () => {
    setIsTransmitting(true);
    try {
      if (id) {
        await approveIncomingRequest(id, accessDuration);
        await shareRecordsForRequest(id, selectedShares);
      }
      setConfirmModalOpen(false);
      alert('Transmission Successful: Encrypted data package signed and transferred via Secure Gateway. Logged in Audit Trail.');
      navigate('/requests');
    } catch (err: any) {
      alert(`Transmission failed: ${err.message}`);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Review Data Disclosure Package"
        subtitle={`Pre-Transmission Final Verification · Recipient: ${req.requestingAgency}`}
        onBack={() => navigate(`/incoming/${req.id}`)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Recipient & Authorization Summary */}
        <Card padding="24px">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
            Transmission Specifications
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              fontSize: '14px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Destination Agency:</span>
              <strong style={{ color: 'var(--primary)' }}>{req.requestingAgency}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Recipient Officer:</span>
              <strong>{req.officerName} ({req.officerBadge})</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Time-Lock Validity:</span>
              <strong>{accessDuration.replace(/_/g, ' ')}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Protocol:</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontWeight: 600 }}>
                <Lock size={14} /> Gov-PKI Level 3
              </span>
            </div>
          </div>
        </Card>

        {/* Selected Data Records */}
        <Card padding="24px">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
            Approved Data Records for Release ({selectedShares.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {selectedShares.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                }}
              >
                <CheckCircle2 size={16} color="var(--status-success)" />
                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '14px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <strong>Scope &amp; Purpose:</strong> {sharingPurpose}
          </div>
        </Card>

        {/* Certification Box */}
        <Card
          padding="24px"
          style={{
            backgroundColor: 'var(--primary-subtle)',
            borderColor: '#C7D2FE',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            <input
              type="checkbox"
              checked={certified}
              onChange={e => setCertified(e.target.checked)}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--primary)' }}>
              I hereby certify as an authorized investigating officer of Central Division Police Station that the data disclosed herein is strictly proportionate to the requisition mandate, does not breach classified internal informant protection, and is logged in the permanent station audit register.
            </span>
          </label>
        </Card>

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(`/incoming/${req.id}`)}
          >
            Cancel / Edit Selection
          </Button>

          <Button
            id="btn-confirm-send"
            variant="primary"
            icon={<Send size={16} />}
            disabled={!certified}
            onClick={() => setConfirmModalOpen(true)}
          >
            Confirm &amp; Send Data
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Authorize Cryptographic Data Transfer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>
              Abort Transfer
            </Button>
            <Button
              variant="primary"
              icon={<ShieldCheck size={16} />}
              disabled={!canShareRecords || isTransmitting}
              onClick={handleTransmit}
            >
              {isTransmitting ? 'Signing & Transmitting...' : 'Sign & Transmit Package'}
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, marginBottom: '12px', fontSize: '16px' }}>
          You are about to transmit <strong>{selectedShares.length} intelligence records</strong> to{' '}
          <strong>{req.requestingAgency}</strong>.
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          This transfer will be cryptographically signed with your officer key (Insp. Vikram Deshmukh, MH-POL-4412) and cannot be recalled once sent.
        </p>
      </Modal>
    </div>
  );
};
