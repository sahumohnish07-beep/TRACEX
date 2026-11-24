import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { FormField } from '../../components/FormField';
import { MOCK_INCOMING_REQUESTS } from '../../data/mockData';

export const IncomingRequestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const req = MOCK_INCOMING_REQUESTS.find(r => r.id === id) || MOCK_INCOMING_REQUESTS[0];

  // Explicit unselected by default - NEVER default-all per Section 8.10
  const [selectedShares, setSelectedShares] = useState<string[]>([]);
  const [accessDuration, setAccessDuration] = useState('30_DAYS');
  const [sharingPurpose, setSharingPurpose] = useState(
    'Approved for mutual intelligence correlation in organized crime syndicate inquiry.'
  );

  const toggleShare = (item: string) => {
    if (selectedShares.includes(item)) {
      setSelectedShares(selectedShares.filter(s => s !== item));
    } else {
      setSelectedShares([...selectedShares, item]);
    }
  };

  const handleProceedToReview = () => {
    if (selectedShares.length === 0) {
      alert('You must explicitly select at least one record to share, or reject the request.');
      return;
    }
    // Save to session storage for the review screen
    sessionStorage.setItem('pending_share_items', JSON.stringify(selectedShares));
    sessionStorage.setItem('pending_share_duration', accessDuration);
    sessionStorage.setItem('pending_share_purpose', sharingPurpose);
    navigate(`/incoming/${req.id}/review`);
  };

  return (
    <div>
      <PageHeader
        title={`Incoming Data Request: ${req.id}`}
        subtitle={`From ${req.requestingAgency} · Official Requisition`}
        onBack={() => navigate('/requests')}
        badge={<StatusBadge status={req.status} />}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Requisition Origin Card */}
        <Card padding="24px">
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
            Requisition Details &amp; Agency Mandate
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Requesting Agency:</span>
              <strong style={{ color: 'var(--primary)' }}>{req.requestingAgency}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Requesting Officer:</span>
              <strong>{req.officerName} ({req.officerBadge})</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Case Reference:</span>
              <strong>{req.caseRef}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Date Received:</span>
              <strong>{req.requestDate}</strong>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-page)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              fontSize: '14px',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '4px' }}>
              Statutory Justification:
            </span>
            <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.5 }}>
              {req.justification}
            </p>
          </div>
        </Card>

        {/* Restricted Data Warning Banner */}
        <Card
          padding="20px 24px"
          style={{
            backgroundColor: 'var(--status-danger-bg)',
            borderColor: '#FECDCA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldAlert size={18} color="var(--status-danger)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--status-danger)', margin: 0 }}>
              Classified &amp; Restricted Station Data (Withheld from Sharing)
            </h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0, marginBottom: '8px' }}>
            The following requested items have been automatically masked and marked as non-exportable under station privilege:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--status-danger)' }}>
            {req.restrictedData.map((res, i) => (
              <li key={i} style={{ fontWeight: 500 }}>{res}</li>
            ))}
          </ul>
        </Card>

        {/* Explicit Data Selection (Never default-all) */}
        <Card padding="28px">
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>
              Select Data to Disclose (Controlled Selective Sharing)
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Per TRACE-X security policy, records are never shared by default. Manually check each record approved for external release.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {req.availableData.map(item => (
              <label
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedShares.includes(item) ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background-color 120ms ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedShares.includes(item)}
                  onChange={() => toggleShare(item)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--text)', flex: 1 }}>{item}</span>
                <span style={{ fontSize: '14px', color: 'var(--status-success)', fontWeight: 600 }}>
                  [VERIFIED AVAILABLE]
                </span>
              </label>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField id="access-duration" label="Approved Access Duration" required>
              <select
                id="access-duration"
                value={accessDuration}
                onChange={e => setAccessDuration(e.target.value)}
              >
                <option value="15_DAYS">15 Days (Time-locked token)</option>
                <option value="30_DAYS">30 Days (Standard investigation window)</option>
                <option value="60_DAYS">60 Days (Requires SHO sign-off)</option>
              </select>
            </FormField>

            <FormField id="share-purpose" label="Authorized Sharing Scope" required>
              <input
                id="share-purpose"
                type="text"
                value={sharingPurpose}
                onChange={e => setSharingPurpose(e.target.value)}
              />
            </FormField>
          </div>

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border)',
              paddingTop: '20px',
              marginTop: '12px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="destructive"
                onClick={() => {
                  alert('Request rejected. Formal memo sent back to requesting agency.');
                  navigate('/requests');
                }}
              >
                Reject Request
              </Button>
              <Button
                variant="secondary"
                onClick={() => alert('Clarification requested from requesting officer Sr. Insp. Arvind Kulkarni.')}
              >
                Request Clarification
              </Button>
            </div>

            <Button
              id="btn-proceed-review"
              variant="primary"
              icon={<ArrowRight size={16} />}
              onClick={handleProceedToReview}
              disabled={selectedShares.length === 0}
            >
              Review Data Before Sending ({selectedShares.length} items)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
