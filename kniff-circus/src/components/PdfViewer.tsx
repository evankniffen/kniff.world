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
  const [src, setSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (!file) return setSrc('');
      
      let url = '';
      if (typeof file === 'string') {
        url = file;
      } else if (file instanceof File) {
        url = URL.createObjectURL(file);
      } else if ('url' in file) {
        url = file.url;
      }
      
      // Ensure the URL is absolute
      if (url && !url.startsWith('http') && !url.startsWith('blob:')) {
        url = new URL(url, window.location.origin).toString();
      }
      
      setSrc(url);
      setError(null);
      
      // Cleanup function
      return () => {
        if (file instanceof File && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      };
    } catch (err) {
      console.error('Error preparing PDF:', err);
      setError('Failed to load PDF. Please try again.');
    }
  }, [file]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: any) => {
    console.error('Error loading PDF:', e);
    setIsLoading(false);
    setError('Failed to load PDF. The file might be corrupted or the format is not supported.');
  };

  if (error) {
    return (
      <ModalBackdrop onClick={onClose}>
        <StyledDetailModal onClick={e => e.stopPropagation()}>
          <StyledDetailHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CloseButton onClick={onClose} aria-label="Close">×</CloseButton>
              <span style={{ color: '#f00', fontFamily: '"Source Code Pro", monospace' }}>
                Error
              </span>
            </div>
            <div>
              <Dot style={{ background: '#f00' }} />
              <Dot style={{ background: '#ff0' }} />
              <Dot style={{ background: '#0f0' }} />
            </div>
          </StyledDetailHeader>
          <div style={{ 
            padding: '2rem', 
            color: '#fff',
            textAlign: 'center',
            fontFamily: '"Source Code Pro", monospace',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div>{error}</div>
            <a 
              href={src} 
              download 
              style={{
                display: 'inline-block',
                padding: '0.8rem 1.5rem',
                background: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid rgba(0, 255, 0, 0.3)',
                borderRadius: '4px',
                color: '#0F0',
                textDecoration: 'none',
                fontFamily: '"Source Code Pro", monospace',
                marginTop: '1rem'
              }}
            >
              Download PDF Instead
            </a>
          </div>
        </StyledDetailModal>
      </ModalBackdrop>
    );
  }

  if (!src) {
    return (
      <ModalBackdrop onClick={onClose}>
        <StyledDetailModal onClick={e => e.stopPropagation()}>
          <div style={{ 
            padding: '2rem', 
            color: '#fff',
            textAlign: 'center',
            fontFamily: '"Source Code Pro", monospace'
          }}>
            Loading PDF...
          </div>
        </StyledDetailModal>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <StyledDetailModal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
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

        <div style={{
          width: '100%',
          height: '70vh',
          border: '1px solid #0F0',
          borderRadius: '4px',
          overflow: 'auto',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '1rem',
          boxSizing: 'border-box'
        }}>
          {src.endsWith('.pdf') || src.startsWith('blob:') || src.startsWith('http') ? (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'auto',
              backgroundColor: '#fff'
            }}>
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#0F0',
                  fontFamily: '"Source Code Pro", monospace',
                  textAlign: 'center',
                  zIndex: 1
                }}>
                  Loading PDF...
                </div>
              )}
              <object
                data={`${src}#view=FitH`}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '500px',
                  border: 'none',
                  backgroundColor: '#fff',
                  opacity: isLoading ? 0.5 : 1,
                  transition: 'opacity 0.3s ease'
                }}
                aria-label="PDF Viewer"
                onLoad={handleLoad}
                onError={handleError}
              >
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center',
                  color: '#000'
                }}>
                  <p>Unable to display PDF file. <a href={src} download>Download</a> it instead.</p>
                </div>
              </object>
            </div>
          ) : (
            <div style={{ 
              color: '#fff', 
              padding: '2rem', 
              textAlign: 'center',
              fontFamily: '"Source Code Pro", monospace'
            }}>
              Unsupported file format. Please use a PDF file.
            </div>
          )}
        </div>
      </StyledDetailModal>
    </ModalBackdrop>
  );
}
