import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (fileName: string) => void;
  onFileObject?: (file: File) => void;
  acceptedFormats?: string;
  selectedFile?: string | null;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  onFileObject,
  acceptedFormats = '.csv, .xlsx, .pdf, .json, .txt',
  selectedFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      onFileSelect(f.name);
      if (onFileObject) onFileObject(f);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      onFileSelect(f.name);
      if (onFileObject) onFileObject(f);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          fileInputRef.current?.click();
        }
      }}
      aria-label="Upload evidence file"
      style={{
        border: `2px dashed ${isDragOver ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        backgroundColor: isDragOver ? 'var(--primary-subtle)' : 'var(--bg-surface)',
        padding: '36px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 150ms ease',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
        accept={acceptedFormats}
      />

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: selectedFile ? 'var(--status-success-bg)' : 'var(--primary-subtle)',
          color: selectedFile ? 'var(--status-success)' : 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedFile ? <CheckCircle2 size={28} /> : <UploadCloud size={28} />}
      </div>

      {selectedFile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <FileText size={16} color="var(--primary)" />
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary)' }}>
              {selectedFile}
            </span>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--status-success)', fontWeight: 500 }}>
            File verified and ready for extraction pipeline
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
            Click to upload or drag and drop investigation data
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Accepted: CDR logs, bank statements, mobile forensic dumps, seizure memos ({acceptedFormats})
          </span>
        </div>
      )}
    </div>
  );
};
