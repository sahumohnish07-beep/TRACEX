import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <nav
      aria-label="Workflow progress"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-subtle)',
        overflowX: 'auto',
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: onStepClick && isCompleted ? 'pointer' : 'default',
              }}
              onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted
                    ? 'var(--status-success)'
                    : isCurrent
                    ? 'var(--primary)'
                    : 'var(--bg-page)',
                  color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                  border: isCurrent || isCompleted ? 'none' : '1px solid var(--border)',
                  fontSize: '14px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {isCompleted ? <Check size={16} aria-hidden="true" /> : step.id}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--text)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: isCompleted ? 'var(--status-success)' : 'var(--border)',
                  margin: '0 16px',
                  minWidth: '24px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
