import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, WindowBody, Dot, List, Prompt } from './TerminalComponents';

// PDF paths
const reyesPdf = '/papers/reyes_paper.pdf';
const cattlePdf = '/papers/ARP BRD Poster.pdf';
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
      id: 'pyranim',
      title: 'Pyranim: A Combinatorial Game of Doom and Despair',
      authors: 'E. Kniffen, Y. Binyamin',
      year: '2026',
      abstract: 'Designing and analyzing a new impartial, Nim-adjacent chip-removal game via isomorphisms to Nim group structures. Using explicit bijections from symmetric Dyck paths to permutation involutions (building on work of Sergi Elizalde and Krattenthaler) to bound the number of distinct game states up to isomorphism. Developing a Python/Tkinter analysis tool that live-tracks Dyck paths, 132-avoiding permutations, and Sprague–Grundy nimbers for arbitrary starting positions to validate optimal play strategies.',
      technologies: ['Combinatorial Game Theory', 'Python', 'Tkinter', 'Permutation Patterns', 'Dyck Paths', 'Sprague-Grundy Theory'],
      details: [
        'Designing and analyzing a new impartial, Nim-adjacent chip-removal game via isomorphisms to Nim group structures',
        'Using explicit bijections from symmetric Dyck paths to permutation involutions to bound the number of distinct game states up to isomorphism',
        'Developing a Python/Tkinter analysis tool that live-tracks Dyck paths, 132-avoiding permutations, and Sprague–Grundy nimbers for arbitrary starting positions',
        'Joint work with Yoav Binyamin'
      ]
    },
    {
      id: 'brd-stochastic',
      title: 'Stochastic Modeling of Bovine Respiratory Disease',
      authors: 'E. Kniffen, PI: A. Adekunle',
      year: '2025',
      abstract: 'Formulated a discrete-time stochastic model on a SEIQRS state space with a CTMC sidecar; derived per-step transition kernels via Markov hazards and explicit competing-risk splits for I and Q outflows. Gave a mean-reverting SDE for weight toward the Gompertz target weight function and checked linear-growth & global-Lipschitz conditions to ensure existence/uniqueness of a strong solution; related the Euler–Maruyama discretization to the ABM weight recursion and its geometric mean-reversion. Specified population draws (binomial flows) consistent with the generator, clarifying the CTMC→DTMC sampling scheme and providing a rate-consistent pathwise construction for inference.',
      technologies: ['Stochastic Modeling', 'SDEs', 'Markov Processes', 'Agent-Based Modeling', 'NetLogo'],
      details: [
        'Formulated a discrete-time stochastic model on a SEIQRS state space with a CTMC sidecar',
        'Derived per-step transition kernels via Markov hazards and explicit competing-risk splits',
        'Gave a mean-reverting SDE for weight toward the Gompertz target weight function',
        'Checked linear-growth & global-Lipschitz conditions to ensure existence/uniqueness of a strong solution',
        'Texas A&M AgriLife Research'
      ],
      pdfUrl: cattlePdf
    },
    {
      id: 'brd-ml',
      title: 'Machine Learning-Based Risk Prediction of Bovine Respiratory Disease',
      authors: 'E. Kniffen, PI: K. Kaniyamattam',
      year: '2025',
      abstract: 'Derived and interpreted evaluation metrics and baselines in probabilistic methods, including ROC/AUC, Brier scores and their optimal constant baseline, and imbalance-aware majority-class accuracy to separate discrimination from calibration. Provided mathematical definitions for the classifiers (LR, SVM, KNN, RF, XGBoost), including the logistic loss, second-order gradient/Hessian leaf updates and split-gain formula for XGBoost, and tree-ensemble feature importance and one-factor partial dependence.',
      technologies: ['Machine Learning', 'XGBoost', 'Random Forest', 'SVM', 'Logistic Regression', 'KNN'],
      details: [
        'Derived and interpreted evaluation metrics and baselines in probabilistic methods',
        'Including ROC/AUC, Brier scores and their optimal constant baseline',
        'Imbalance-aware majority-class accuracy to separate discrimination from calibration',
        'Provided mathematical definitions for classifiers (LR, SVM, KNN, RF, XGBoost)',
        'Texas A&M AgriLife Research'
      ]
    },
    {
      id: 'spacecraft',
      title: 'Physics-Informed Stochastic Time Series Generation and ML for Anomaly Detection in Spacecraft Telemetry',
      authors: 'E. Kniffen',
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
