import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
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
  CloseButton,
  
} from './TerminalUI';
import styled from 'styled-components';
import PdfViewer from './PdfViewer';

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

  @media (max-width: 768px) {
    .abstract {
      display: none;
      max-height: 0;
      opacity: 0;
      margin-top: 0;
    }
  }
`;

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
  const openAtRef = useRef<number>(0);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    if (showDetail || showPdf.id) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [showDetail, showPdf.id]);

  const openPdfViewer = (id: string, file: File | string) => {
    setShowPdf({ id, file });
  };

  const [researchItems] = useState<ResearchItem[]>([
    {
      id: 'spacecraft',
      title: 'Physics-Informed Stochastic Time Series Generation and ML for Anomaly Detection in Spacecraft Telemetry',
      authors: 'E. Kniffen (WIP)',
      year: '2025',
      abstract: 'A mathematically rigorous framework for simulating physically plausible, high-dimensional synthetic telemetry representative of complex spacecraft systems, as well as a suite of advanced machine learning (ML) models tailored for rare event (failure) detection in this challenging regime. Our data synthesis combines Brownian motion, harmonic oscillations, wavelet bursts, cross-sensor dependencies, and controlled stochasticity, calibrated to mimic the statistical and dynamical structure of real spacecraft subsystems. I developed a multi-level feature extraction pipeline—emphasizing time, frequency, and nonlinear statistics—and benchmark Long ShortTerm Memory (LSTM) networks, Random Forests, and Logistic Regression ensembles. The resulting performance and failure detection rates are critically analyzed in light of underlying physical and information-theoretic constraints.',
      technologies: ['LSTM', 'Random Forests', 'Logistic Regression', 'Monte Carlo', 'Stochastic Drift'],
      details: [
        'Developed synthetic data generation framework for telemetry',
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
    }
  ].map((item, index) => ({ ...item, delay: index * 0.1, pdfFile: null })));

  const selectedResearch = showDetail ? researchItems.find(item => item.id === showDetail) : null;
  // (optional) retain debug logging if needed
  // if (showDetail) console.log('showDetail set to:', showDetail, 'selectedResearch:', !!selectedResearch);

  return (
    <TerminalWindow as={motion.div} initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <div style={{ pointerEvents: 'none' }}>
          <Prompt>kniff@tamu:~/research$</Prompt>{' '}
          <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        </div>
        <List>
          {researchItems.map((item) => (
            <TerminalItem 
              key={item.id}
              tabIndex={0}
              role="button"
              data-id={item.id}
              onClick={(e) => {
                // Diagnostic: log click target to debug overlay issues
                // eslint-disable-next-line no-console
                console.log('Research item clicked:', item.id, 'target:', (e.target as HTMLElement).className);
                openAtRef.current = Date.now();
                setShowDetail(item.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openAtRef.current = Date.now();
                  setShowDetail(item.id);
                }
              }}
              style={{ animationDelay: `${item.delay}s` }}
            >
              <div className="command">
                <Prompt> &gt; {item.id}</Prompt>
              </div>
              <div className="title">{item.title}</div>
              <div className="subtitle">{item.authors} • {item.year}</div>
              <div className="abstract">{item.abstract}</div>
            </TerminalItem>
          ))}
        </List>

        {showDetail && createPortal(
          (
            <AnimatePresence>
              <ModalBackdrop
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowDetail(null);
                }}
              >
                <StyledDetailModal 
                  key={selectedResearch?.id || 'detail-modal'}
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
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
                    {selectedResearch ? (
                      <>
                        <h3>{selectedResearch.title}</h3>
                        <p className="subtitle">{selectedResearch.authors} • {selectedResearch.year}</p>
                        <h3>Abstract</h3>
                        <p>{selectedResearch.abstract}</p>
                        <h3>Key Contributions</h3>
                        <ul>
                          {selectedResearch.details.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                        <h3>Technologies & Methods</h3>
                        <ul>
                          {selectedResearch.technologies.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                        <h3>Paper</h3>
                        <button
                          onClick={() => {
                            if (selectedResearch.pdfUrl) openPdfViewer(selectedResearch.id, selectedResearch.pdfUrl);
                            else if (selectedResearch.pdfFile) openPdfViewer(selectedResearch.id, selectedResearch.pdfFile);
                          }}
                        >View PDF</button>
                      </>
                    ) : (
                      <div style={{ color: '#0F0' }}>Loading…</div>
                    )}
                  </StyledDetailBody>
                </StyledDetailModal>
              </ModalBackdrop>
            </AnimatePresence>
          ),
          document.body
        )}

        <AnimatePresence>
          {showPdf.id && showPdf.file && (
            <PdfViewer
              file={showPdf.file}
              onClose={() => setShowPdf({ id: null, file: null })}
              title={researchItems.find(item => item.id === showPdf.id)?.title || 'Research Paper'}
            />
          )}
        </AnimatePresence>
      </WindowBody>
    </TerminalWindow>
  );
};

export default Research;
