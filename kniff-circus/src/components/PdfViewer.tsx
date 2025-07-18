// src/components/PdfViewer.tsx
import { useEffect, useState } from 'react';
import { ModalBackdrop, StyledDetailModal, StyledDetailHeader, CloseButton } from './TerminalUI';
import { Dot } from './TerminalComponents';

interface PdfViewerProps {
  file: string | File | { url: string };
  onClose: () => void;
  title?: string;
}

export default function PdfViewer({ file, onClose, title }: PdfViewerProps) {
  // 1) Compute a URL that the <iframe> can consume
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    if (!file) return setSrc('');
    if (typeof file === 'string') {
      setSrc(file);
    } else if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if ('url' in file) {
      setSrc(file.url);
    }
  }, [file]);

  if (!src) return null;

  return (
    <ModalBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit  = {{ opacity: 0 }}
      onClick={onClose}
    >
      <StyledDetailModal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        exit  = {{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <StyledDetailHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CloseButton onClick={onClose} aria-label="Close PDF viewer">×</CloseButton>
            {title && (
              <span style={{
                color: '#0F0',
                fontFamily: '"Source Code Pro", monospace',
                fontSize: '1rem'
              }}>
                {title}
              </span>
            )}
          </div>
          <div>
            <Dot style={{ background: '#f00' }} />
            <Dot style={{ background: '#ff0' }} />
            <Dot style={{ background: '#0f0' }} />
          </div>
        </StyledDetailHeader>

        {/* 2) Embedded PDF via iframe */}
        <div style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #0F0',
          borderRadius: '4px',
          overflow: 'hidden',
          background: 'rgba(0,30,0,0.5)'
        }}>
          <iframe
            src={src}
            title={title || 'PDF Viewer'}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>
      </StyledDetailModal>
    </ModalBackdrop>
  );
}
