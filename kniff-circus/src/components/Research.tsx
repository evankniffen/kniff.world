import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, WindowBody, Dot, List, Prompt } from './TerminalComponents';

// PDF paths
const reyesPdf = '/papers/reyes_paper.pdf';
const cattlePdf = '/papers/cattle_paper.pdf';
import {
  ModalBackdrop,
  StyledDetailModal,
  StyledDetailHeader,
  StyledDetailBody,
  TerminalItem as BaseTerminalItem,
  CloseButton
} from './TerminalUI';
import styled from 'styled-components';

const TerminalItem = styled(BaseTerminalItem)`
  .abstract {
    color: #888;
    font-size: 0.85rem;
    margin-top: 0;
    line-height: 1.5;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    opacity: 0;
  }
  
  &:hover .abstract {
    max-height: 500px;
    opacity: 1;
    margin-top: 0.5rem;
  }
`;
import PdfViewer from './PdfViewer';

interface ResearchItem {
  id: string;
  title: string;
  authors: string;
  year: string;
  abstract: string;
  details: string[];
  technologies: string[];
  delay: number;
  pdfUrl?: string;
  pdfFile?: File | null;
}

const Research: React.FC = () => {
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState<{id: string | null, file: File | string | null}>({ id: null, file: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (showDetail || showPdf.id) {
        e.preventDefault();
      }
    };
    
    const options = { passive: false } as AddEventListenerOptions;
    document.addEventListener('touchmove', handleTouchMove, options);
    return () => {
      document.removeEventListener('touchmove', handleTouchMove, options);
    };
  }, [showDetail, showPdf.id]);
  
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setShowPdf({ id, file });
    } else {
      alert('Please upload a valid PDF file');
    }
  };
  
  const openPdfViewer = (id: string, file: File | string) => {
    setShowPdf({ id, file });
  };

  const [researchItems, setResearchItems] = useState<ResearchItem[]>([
    {
      id: 'spacecraft',
      title: 'Physics-Informed Stochastic Time Series Generation and ML for Anomaly Detection in Spacecraft Telemetry',
      authors: 'E. Kniffen (WIP)',
      year: '2025',
      abstract: 'A mathematically rigorous framework for simulating physically plausible, high-dimensional synthetic telemetry representative of complex spacecraft systems, as well as a suite of advanced machine learning (ML) models tailored for rare event (failure) detection in this challenging regime. Our data synthesis combines Brownian motion, harmonic oscillations, wavelet bursts, cross-sensor dependencies, and controlled stochasticity, calibrated to mimic the statistical and dynamical structure of real spacecraft subsystems. I developed a multi-level feature extraction pipeline—emphasizing time, frequency, and nonlinear statistics—and benchmark Long ShortTerm Memory (LSTM) networks, Random Forests, and Logistic Regression ensembles. The resulting performance and failure detection rates are critically analyzed in light of underlying physical and information-theoretic constraints.',
      technologies: ['LSTM', 'Random Forests', 'Logistic Regression', 'Monte Carlo', 'Stochastic Drift'],
      details: [
        'Developed syntethic data generation framework for telementry',
        'Implemented machine learning models for anomaly detection',
        'ML ensembles outperformed any one model, however only by 1% in some cases',
        'Developed for Berkeley Physics REYES Program'
      ],
      pdfUrl: reyesPdf
    },
    {
      id: 'moooo',
      title: 'Modeling Beef Cattle Growth and Economic Value under Morbidity',
      authors: 'E. Kniffen (WIP)',
      year: '2025',
      abstract: 'Accurate simulation of beef cattle growth and economic outcomes is essential for optimizing production systems and evaluating the impact of disease management strategies. We present an agent-based modeling framework, implemented in NetLogo, that explicitly tracks individual animal variables including age (age), liveweight (weightlbs), health state (isInfected, timesInfected), and economic value (valueusd). Growth is modeled using three alternative sigmoidal functions: Gompertz, Logistic, and von Bertalanffy; each one with full parameterization and rationale. A phase-specific valuation function maps liveweight to market value across production stages (price-CC, price-ST, price-FL), supporting sensitivity to price volatility and net present value (NPV) discounting. The morbidity submodel quantifies both the direct and proportional impacts of bovine respiratory disease (BRD) events on average daily gain and cumulative costs, using parameter estimates from empirical studies. We demonstrate model selection, parameter calibration, and scenario analysis in a simulated herd of 100 calves run over a 540-day production cycle, supporting detailed experiments for disease, price, and management interventions.',
      technologies: ['NetLogo', 'Python', 'Stochastic Modeling', 'Agent-Based Modeling'],
      details: [
        'Developed agent-based model for cattle production',
        'Implemented stochastic and exponential growth models',
        'Developed for Texas A&M University Department of Animal Science'
      ],
      pdfUrl: cattlePdf
    },
  ].map((item, index) => ({
    ...item,
    delay: index * 0.1, // Staggered animation delay
    pdfFile: null
  })));

  const selectedResearch = showDetail ? researchItems.find(item => item.id === showDetail) : null;

  return (
    <TerminalWindow as={motion.div} initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>kniff@tamu:~/research$</Prompt>{' '}
        <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        <List>
          {researchItems.map((item) => (
            <TerminalItem 
              key={item.id} 
              onClick={() => setShowDetail(item.id)}
              style={{ animationDelay: `${item.delay}s` }}
            >
              <div className="command">
                <Prompt> &gt; {item.id}</Prompt>
              </div>
              <div className="title">
                {item.title}
              </div>
              <div className="subtitle">
                {item.authors} • {item.year}
              </div>
              <div className="abstract">
                {item.abstract}
              </div>
              <div className="pdf-actions" style={{ marginTop: '0.5rem' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.pdfUrl) {
                      openPdfViewer(item.id, item.pdfUrl);
                    } else if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #0F0',
                    color: '#0F0',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontFamily: '"Source Code Pro", monospace',
                    marginTop: '0.5rem'
                  }}
                >
                  {item.pdfUrl || item.pdfFile ? 'View PDF' : 'Upload PDF'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handlePdfUpload(e, item.id);
                    if (e.target) {
                      (e.target as HTMLInputElement).value = ''; // Reset input to allow re-uploading the same file
                    }
                  }}
                />
              </div>
            </TerminalItem>
          ))}
        </List>
        
        <AnimatePresence>
          {showDetail && selectedResearch && (
            <ModalBackdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowDetail(null);
                }
              }}
            >
              <StyledDetailModal 
                key={selectedResearch.id}
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 0.95, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StyledDetailHeader>
                  <CloseButton onClick={() => setShowDetail(null)}>×</CloseButton>
                  <div>
                    <Dot style={{ background: '#f00' }}/>
                    <Dot style={{ background: '#ff0' }}/>
                    <Dot style={{ background: '#0f0' }}/>
                  </div>
                </StyledDetailHeader>
                <StyledDetailBody>
                  <h3>{selectedResearch.title}</h3>
                  <p className="subtitle">
                    {selectedResearch.authors} • {selectedResearch.year}
                  </p>
                  <h3>Abstract</h3>
                  <p style={{ marginBottom: '1.5rem' }}>{selectedResearch.abstract}</p>
                  
                  <h3>Key Contributions</h3>
                  <ul className="details-list">
                    {selectedResearch.details.map((detail, i) => (
                      <li key={i}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  <h3>Technologies & Methods</h3>
                  <div className="tech-tags" style={{ marginBottom: '1.5rem' }}>
                    {selectedResearch.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="tech-tag"
                        style={{
                          display: 'inline-block',
                          backgroundColor: 'rgba(0, 255, 0, 0.1)',
                          color: '#0F0',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          margin: '0.25rem',
                          fontSize: '0.8rem',
                          border: '1px solid rgba(0, 255, 0, 0.3)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(0, 255, 0, 0.2)', paddingTop: '1rem' }}>
                    <h3>Paper</h3>
                    <button 
                      onClick={() => {
                        if (selectedResearch.pdfUrl) {
                          openPdfViewer(selectedResearch.id, selectedResearch.pdfUrl);
                        } else if (selectedResearch.pdfFile) {
                          openPdfViewer(selectedResearch.id, selectedResearch.pdfFile);
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #0F0',
                        color: '#0F0',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: '"Source Code Pro", monospace',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem'
                      }}
                    >
                      <span>📄</span>
                      {selectedResearch.pdfUrl || selectedResearch.pdfFile ? 'View Full Paper' : 'Upload PDF'}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const updatedItems = researchItems.map(item => 
                            item.id === selectedResearch.id 
                              ? { ...item, pdfFile: e.target.files?.[0] } 
                              : item
                          );
                          setResearchItems(updatedItems);
                          openPdfViewer(selectedResearch.id, e.target.files[0]);
                          if (e.target) {
                            (e.target as HTMLInputElement).value = ''; // Reset input
                          }
                        }
                      }}
                    />
                  </div>
                </StyledDetailBody>
              </StyledDetailModal>
            </ModalBackdrop>
          )}
        </AnimatePresence>
      </WindowBody>
      
      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {showPdf.id && showPdf.file && (
          <PdfViewer 
            file={showPdf.file} 
            onClose={() => setShowPdf({ id: null, file: null })}
            title={researchItems.find(item => item.id === showPdf.id)?.title || 'Research Paper'}
          />
        )}
      </AnimatePresence>
    </TerminalWindow>
  );
};

export default Research;
