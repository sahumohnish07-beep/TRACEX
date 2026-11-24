import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Car,
  Home,
  Network,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { SourceBadge } from '../../components/SourceBadge';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tabs } from '../../components/Tabs';
import { MOCK_PERSONS } from '../../data/mockData';

export const PersonProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const person = MOCK_PERSONS.find(p => p.id === id) || MOCK_PERSONS[0];

  const profileTabs = [
    { id: 'overview', label: 'Dossier Overview' },
    { id: 'cases', label: 'Associated Cases', badge: person.associatedCases.length },
    { id: 'records', label: 'Verified Records', badge: person.verifiedRecordsCount },
  ];

  return (
    <div>
      <PageHeader
        title={person.fullName}
        subtitle={`${person.id} · National ID: ${person.nationalId}`}
        onBack={() => navigate('/persons')}
        badge={<StatusBadge status={person.status} />}
        actions={
          <Button
            variant="primary"
            icon={<Network size={16} />}
            onClick={() => {
              const primaryCase = person.associatedCases[0]?.caseId || 'CASE-2026-0891';
              navigate(`/cases/${primaryCase}/network`);
            }}
          >
            Locate in Network Graph
          </Button>
        }
      />

      {/* Top Profile Summary Card */}
      <Card style={{ marginBottom: '28px', padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <User size={38} />
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                {person.fullName}
              </h2>
              <StatusBadge status={person.riskLevel} customLabel={`RISK: ${person.riskLevel}`} />
            </div>

            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Known Aliases: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{person.aliases.join(', ')}</span>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
              <span>DOB: <strong>{person.dateOfBirth}</strong></span>
              <span>Gender: <strong>{person.gender}</strong></span>
              <span>Verified Records: <strong>{person.verifiedRecordsCount}</strong></span>
            </div>
          </div>
        </div>
      </Card>

      <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Contact & Physical Vectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <Card padding="20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Home size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Primary Residential Address</h3>
              </div>
              <p style={{ fontSize: '16px', margin: 0, marginBottom: '12px', color: 'var(--text)' }}>
                {person.primaryAddress}
              </p>
              <SourceBadge type="VERIFIED_RECORD" compact />
            </Card>

            <Card padding="20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Verified Phone Numbers</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {person.phoneNumbers.map(ph => (
                  <div key={ph} style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    {ph}
                  </div>
                ))}
              </div>
              <SourceBadge type="VERIFIED_RECORD" compact />
            </Card>

            <Card padding="20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Car size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Registered Vehicles</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {person.vehicles.map(vh => (
                  <div key={vh} style={{ fontSize: '16px', fontWeight: 500 }}>
                    {vh}
                  </div>
                ))}
              </div>
              <SourceBadge type="VERIFIED_RECORD" compact />
            </Card>
          </div>

          {/* Intelligence Classification */}
          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Intelligence Summary &amp; Linkages
            </h3>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text)', margin: 0, marginBottom: '16px' }}>
              Identified as primary financial logistics controller in dock terminal 4 trade operations. Connected through phone CDR records and bank transactions to multiple local hawala agents.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <SourceBadge type="VERIFIED_RECORD" compact />
              <SourceBadge type="SYSTEM_DERIVED" compact />
              <SourceBadge type="AI_ANALYSIS" compact />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'cases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {person.associatedCases.map(c => (
            <Card key={c.caseId} padding="20px">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {c.caseId}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>{c.title}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Role: <strong style={{ color: 'var(--text)' }}>{c.role}</strong> · Year: {c.year}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => navigate(`/cases/${c.caseId}`)}
                >
                  Open Case File
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'records' && (
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Official Station &amp; Court Records
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Court Seizure Memo #41/26
              </div>
              <p style={{ margin: 0, color: 'var(--text)' }}>
                Seizure of 1 encrypted drive and Rs. 4,20,000 unaccounted cash executed under warrant on 2026-02-15.
              </p>
            </div>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                Station Lockup &amp; Biometrics File #BK-2024-88
              </div>
              <p style={{ margin: 0, color: 'var(--text)' }}>
                10-print fingerprint records and iris biometric scans archived in central automated fingerprint identification system.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
