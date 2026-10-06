import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Stepper, type StepItem } from '../../components/Stepper';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { fetchCases, createDataRequest } from '../../api/services';
import type { CaseItem } from '../../types';

export const NewDataRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [sourceAuthority, setSourceAuthority] = useState('State Police Headquarters — CID Intelligence Wing');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'Telecom Tower & Switch Handover Logs',
    'Financial Intelligence Unit Suspicious Reports',
  ]);
  const [statutoryReason, setStatutoryReason] = useState('Requisition issued under Section 91 of the Code of Criminal Procedure for tracing interstate cash couriers.');
  const [urgency, setUrgency] = useState<'HIGH' | 'ROUTINE'>('HIGH');

  useEffect(() => {
    fetchCases()
      .then(data => {
        setCases(data);
        if (data.length > 0) setSelectedCaseId(data[0].id);
      })
      .catch(() => {});
  }, []);

  const steps: StepItem[] = [
    { id: 1, label: '1. Source Authority', description: 'Target agency' },
    { id: 2, label: '2. Select Case', description: 'Investigation ref' },
    { id: 3, label: '3. Information Types', description: 'Data checkboxes' },
    { id: 4, label: '4. Legal Justification', description: 'Statutory basis' },
    { id: 5, label: '5. Review & Transmit', description: 'Cryptographic sign-off' },
  ];

  const availableCategories = [
    'Telecom Tower & Switch Handover Logs',
    'Financial Intelligence Unit Suspicious Reports',
    'Vehicle Registration & Chassis Inspection Records',
    'State Border Checkpoint ANPR Footage Metadata',
    'Interstate Organized Crime Network Dossier',
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createDataRequest({
        targetAuthority: sourceAuthority,
        caseId: selectedCaseId || (cases[0]?.id ?? 'CASE-2026-0891'),
        categories,
        purpose: statutoryReason,
        urgency,
      });
      alert('Data Request securely transmitted and logged in Station Audit Trail.');
      navigate('/requests');
    } catch (err: any) {
      alert(`Request submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Request Investigation Data"
        subtitle="Submit formal requisition to external law enforcement agency"
        onBack={() => navigate('/requests')}
      />

      <Stepper steps={steps} currentStep={currentStep} />

      {/* STEP 1: Source Authority */}
      {currentStep === 1 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
            Step 1: Select Target External Authority
          </h2>

          <FormField id="target-authority" label="Target Law Enforcement Agency / State Wing" required>
            <select
              id="target-authority"
              value={sourceAuthority}
              onChange={e => setSourceAuthority(e.target.value)}
            >
              <option value="State Police Headquarters — CID Intelligence Wing">State Police Headquarters — CID Intelligence Wing</option>
              <option value="Transport Department — Regional RTO Database">Transport Department — Regional RTO Database</option>
              <option value="Financial Intelligence Unit — State Liaison Office">Financial Intelligence Unit — State Liaison Office</option>
              <option value="State Cyber Crime Police Station">State Cyber Crime Police Station</option>
              <option value="Navi Mumbai Crime Branch — Anti-Extortion Cell">Navi Mumbai Crime Branch — Anti-Extortion Cell</option>
            </select>
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button variant="primary" icon={<ArrowRight size={16} />} onClick={() => setCurrentStep(2)}>
              Continue to Select Case
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Case */}
      {currentStep === 2 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
            Step 2: Associate with Station Investigation Case
          </h2>

          <FormField id="case-select" label="Select Registered Case" required>
            <select
              id="case-select"
              value={selectedCaseId}
              onChange={e => setSelectedCaseId(e.target.value)}
            >
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title} ({c.crimeType})
                </option>
              ))}
            </select>
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button variant="primary" icon={<ArrowRight size={16} />} onClick={() => setCurrentStep(3)}>
              Select Information Types
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Information Checkboxes */}
      {currentStep === 3 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Step 3: Specify Requisite Data Records
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Select only categories proportionate and necessary for the current investigative scope.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {availableCategories.map(cat => (
              <label
                key={cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: categories.includes(cat) ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight size={16} />}
              onClick={() => setCurrentStep(4)}
              disabled={categories.length === 0}
            >
              Provide Legal Justification
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Reason & Legal Justification */}
      {currentStep === 4 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
            Step 4: Statutory Reason &amp; Legal Justification
          </h2>

          <FormField
            id="statutory-reason"
            label="Legal Basis &amp; Warrant / Section Reference"
            required
            hint="Mandatory under Inter-Agency Data Sharing Protocol 2026."
          >
            <textarea
              id="statutory-reason"
              rows={4}
              value={statutoryReason}
              onChange={e => setStatutoryReason(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontFamily: 'inherit',
                fontSize: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            />
          </FormField>

          <FormField id="urgency-level" label="Request Priority Level" required>
            <select
              id="urgency-level"
              value={urgency}
              onChange={e => setUrgency(e.target.value as 'HIGH' | 'ROUTINE')}
            >
              <option value="HIGH">High (Urgent / Active Lead Followup)</option>
              <option value="ROUTINE">Routine (Standard Dossier Corroboration)</option>
            </select>
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button variant="primary" icon={<ArrowRight size={16} />} onClick={() => setCurrentStep(5)}>
              Review &amp; Transmit
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Review & Send */}
      {currentStep === 5 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
            Step 5: Review Requisition &amp; Transmit
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: 'var(--bg-page)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '28px',
              fontSize: '14px',
            }}
          >
            <div><strong>Target Agency:</strong> {sourceAuthority}</div>
            <div><strong>Associated Case:</strong> {selectedCaseId}</div>
            <div><strong>Categories:</strong> {categories.join(' · ')}</div>
            <div><strong>Urgency:</strong> {urgency}</div>
            <div><strong>Legal Justification:</strong> {statutoryReason}</div>
            <div><strong>Transmitting Officer:</strong> Insp. Vikram Deshmukh (Badge: MH-POL-4412)</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(4)}>
              Back
            </Button>
            <Button
              variant="primary"
              icon={<Send size={16} />}
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
            >
              {isSubmitting ? 'Transmitting...' : 'Transmit Data Requisition'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
