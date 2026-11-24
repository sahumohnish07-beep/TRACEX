import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Stepper, type StepItem } from '../../components/Stepper';
import { FormField } from '../../components/FormField';
import { Button } from '../../components/Button';
import { FileDropzone } from '../../components/FileDropzone';
import { SourceBadge } from '../../components/SourceBadge';
import { ErrorState } from '../../components/StateContainer';

import { createCase, uploadCaseDocument, confirmExtractedEntity } from '../../api/services';
import { useRbac } from '../../core/rbac';

interface ExtractedEntity {
  id: string;
  name: string;
  type: string;
  details: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

export const NewCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { canCreateCase } = useRbac();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Case Details
  const [title, setTitle] = useState('');
  const [crimeType, setCrimeType] = useState('Financial Crime / Syndicate Hawala');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [narrative, setNarrative] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 2: Upload Data
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 3: Extraction simulation
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Step 4: Review Extracted Entities
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([
    { id: 'EXT-01', name: 'Zahir Abbas Merchant', type: 'PERSON', details: 'Identified as bank account signatory', status: 'PENDING' },
    { id: 'EXT-02', name: '+91 98204 11902', type: 'PHONE', details: 'High-frequency burst contact on transaction night', status: 'PENDING' },
    { id: 'EXT-03', name: 'Terminal Pier 4 Warehouse', type: 'LOCATION', details: 'Consignment unloading coordinate in shipping bill', status: 'PENDING' },
    { id: 'EXT-04', name: 'MH-04-CZ-7719', type: 'VEHICLE', details: 'Commercial truck listed in gate entry pass', status: 'PENDING' },
  ]);

  const steps: StepItem[] = [
    { id: 1, label: '1. Case Details', description: 'Primary information' },
    { id: 2, label: '2. Upload Data', description: 'Evidence files' },
    { id: 3, label: '3. Extract Entities', description: 'AI parsing' },
    { id: 4, label: '4. Review & Confirm', description: 'Investigator sign-off' },
    { id: 5, label: '5. Create Case', description: 'Initialize case file' },
  ];

  // Validation
  const handleStep1Next = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Case title is required';
    if (!narrative.trim()) errors.narrative = 'Initial narrative summary is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (!uploadedFile) {
      alert('Please upload an evidence document or CDR log to run entity extraction.');
      return;
    }
    setCurrentStep(3);
    // Extraction simulation
    setExtractionProgress(20);
    setTimeout(() => setExtractionProgress(60), 400);
    setTimeout(() => {
      setExtractionProgress(100);
      setCurrentStep(4);
    }, 1000);
  };

  // Review step checks
  const allResolved = extractedEntities.every(e => e.status !== 'PENDING');

  const updateEntityStatus = (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    setExtractedEntities(prev =>
      prev.map(e => (e.id === id ? { ...e, status } : e))
    );
  };

  const handleFinalCreate = async () => {
    setIsSubmitting(true);
    try {
      // 1. Generate statutory case number: CASE-YYYY-XXXX
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const caseNumber = `CASE-2026-${randomSuffix}`;

      // 2. Real POST to /api/v1/cases
      const newCase = await createCase({
        caseNumber,
        title,
        crimeType,
        priority,
        summary: narrative,
      });

      const targetCaseNumber = newCase.id || caseNumber;

      // 3. If file was attached, upload it
      if (fileObject) {
        try {
          await uploadCaseDocument(targetCaseNumber, fileObject);
        } catch (docErr) {
          console.warn('Document upload warning:', docErr);
        }
      }

      // 4. Confirm extracted entities into case
      for (const ent of extractedEntities) {
        if (ent.status === 'CONFIRMED') {
          try {
            await confirmExtractedEntity(targetCaseNumber, {
              entity_type: ent.type,
              entity_id: ent.name,
              role_in_case: ent.details,
            });
          } catch (e) {
            console.warn('Entity confirm warning:', e);
          }
        }
      }

      navigate(`/cases/${targetCaseNumber}`);
    } catch (err: any) {
      alert(`Case creation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canCreateCase) {
    return (
      <ErrorState
        title="Unauthorized: Case Registration Restricted"
        message="Your clearance level does not permit filing new criminal investigation cases."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Create New Case Investigation"
        subtitle="Local Authority Station Registry · Controlled Intake Pipeline"
        onBack={() => navigate('/cases')}
      />

      <Stepper steps={steps} currentStep={currentStep} />

      {/* STEP 1: Case Details */}
      {currentStep === 1 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>
            Step 1: Enter Investigation Case Details
          </h2>

          <FormField id="case-title" label="Case Title / Operational Codename" required error={formErrors.title}>
            <input
              id="case-title"
              type="text"
              placeholder="e.g. Hawala Logistics & Shadow Syndicate"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FormField id="crime-type" label="Primary Crime Category" required>
              <select
                id="crime-type"
                value={crimeType}
                onChange={e => setCrimeType(e.target.value)}
              >
                <option value="Financial Crime / Syndicate Hawala">Financial Crime / Syndicate Hawala</option>
                <option value="Organized Vehicle Trafficking">Organized Vehicle Trafficking</option>
                <option value="Counterfeit Currency Circulation">Counterfeit Currency Circulation</option>
                <option value="Commercial Burglary">Commercial Burglary</option>
                <option value="Cyber Syndicate Fraud">Cyber Syndicate Fraud</option>
              </select>
            </FormField>

            <FormField id="priority-level" label="Investigative Priority" required>
              <select
                id="priority-level"
                value={priority}
                onChange={e => setPriority(e.target.value as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW')}
              >
                <option value="CRITICAL">Critical (Immediate Response)</option>
                <option value="HIGH">High (Active Multi-Officer)</option>
                <option value="MEDIUM">Medium (Standard Inquiry)</option>
                <option value="LOW">Low (Routine File)</option>
              </select>
            </FormField>
          </div>

          <FormField
            id="case-narrative"
            label="Initial Incident Summary &amp; FIR Narrative"
            required
            hint="Summarize known facts, initial seizure or complainant statement."
            error={formErrors.narrative}
          >
            <textarea
              id="case-narrative"
              rows={4}
              placeholder="Provide context regarding initial arrests, seizure memos, or intelligence inputs..."
              value={narrative}
              onChange={e => setNarrative(e.target.value)}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button variant="primary" icon={<ArrowRight size={16} />} onClick={handleStep1Next}>
              Proceed to Upload Data
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Upload Data */}
      {currentStep === 2 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Step 2: Upload Investigation Data Files
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Upload raw forensic extracts, telecom CDR logs, or financial ledgers to feed the automated entity resolution engine.
          </p>

          <FileDropzone
            selectedFile={uploadedFile}
            onFileSelect={fileName => setUploadedFile(fileName)}
            onFileObject={file => setFileObject(file)}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight size={16} />}
              onClick={handleStep2Next}
              disabled={!uploadedFile}
            >
              Start Entity Extraction
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Extract Entities */}
      {currentStep === 3 && (
        <Card padding="48px" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
            Step 3: Processing Extraction Pipeline...
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Parsing document structure, identifying named entities, telecom identifiers, and geolocation records.
          </p>

          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '8px',
              backgroundColor: 'var(--bg-page)',
              borderRadius: '4px',
              overflow: 'hidden',
              margin: '0 auto 16px auto',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: `${extractionProgress}%`,
                height: '100%',
                backgroundColor: 'var(--accent)',
                transition: 'width 300ms ease',
              }}
            />
          </div>

          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Status: {extractionProgress}% complete (4 candidates identified)
          </span>
        </Card>
      )}

      {/* STEP 4: Review & Confirm */}
      {currentStep === 4 && (
        <Card padding="32px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
              Step 4: Review Extracted Entity Candidates
            </h2>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: allResolved ? 'var(--status-success)' : 'var(--status-warning)',
              }}
            >
              {allResolved ? 'All items resolved' : 'Action required on pending entities'}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Investigators must explicitly confirm or reject each candidate. The &quot;Confirm Review&quot; button remains disabled until every item is resolved.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {extractedEntities.map(entity => (
              <div
                key={entity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-page)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text)' }}>
                      {entity.name}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>
                      [{entity.type}]
                    </span>
                    <SourceBadge type="AI_ANALYSIS" compact />
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {entity.details}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {entity.status === 'CONFIRMED' ? (
                    <span style={{ color: 'var(--status-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                      <CheckCircle2 size={16} /> Confirmed
                    </span>
                  ) : entity.status === 'REJECTED' ? (
                    <span style={{ color: 'var(--status-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                      <XCircle size={16} /> Rejected
                    </span>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        style={{ minHeight: '36px', padding: '0 12px' }}
                        onClick={() => updateEntityStatus(entity.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        style={{ minHeight: '36px', padding: '0 12px' }}
                        onClick={() => updateEntityStatus(entity.id, 'CONFIRMED')}
                      >
                        Confirm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button
              id="btn-confirm-review"
              variant="primary"
              icon={<ArrowRight size={16} />}
              disabled={!allResolved}
              onClick={() => setCurrentStep(5)}
            >
              Confirm Review &amp; Continue
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Create Case */}
      {currentStep === 5 && (
        <Card padding="32px">
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
            Step 5: Final Review &amp; Register Case
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px', backgroundColor: 'var(--bg-page)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div><strong>Case Title:</strong> {title || 'Hawala Logistics & Shadow Syndicate'}</div>
            <div><strong>Category:</strong> {crimeType}</div>
            <div><strong>Priority:</strong> {priority}</div>
            <div><strong>Narrative:</strong> {narrative || 'Initial investigation documentation verified.'}</div>
            <div><strong>Confirmed Entities:</strong> {extractedEntities.filter(e => e.status === 'CONFIRMED').length} records</div>
            <div><strong>Source Evidence:</strong> {uploadedFile || 'Evidence_Extract_2026.csv'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(4)}>
              Back
            </Button>
            <Button
              variant="primary"
              icon={<FileCheck size={16} />}
              onClick={handleFinalCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering Case & Syncing...' : 'Register & Open Case File'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
