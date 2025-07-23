import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, WindowBody, Dot, List, Prompt } from './TerminalComponents';
import {
  ModalBackdrop,
  StyledDetailModal,
  StyledDetailHeader,
  StyledDetailBody,
  TerminalItem,
  CloseButton,
  GitHubButton
} from './TerminalUI';

// Project data
const projects = [
    {
      id: 'stocks',
      title: 'sellMeThisPen',
      description: 'Performing fractal analysis to develop a trading strategy that outperforms Buy and Hold.',
      details: [
        'Applied Lorenz attractor & 4th‑order Runge‑Kutta for short‑term stock prediction',
        'Programmed entirely in OCaml using data from the Yahoo! Finance API',
        'Analyzed scale‑invariance properties of financial time series',
        'Backtested strategy demonstrating consistent 8-15% annual returns'
      ],
      technologies: ['OCaml', 'Functional Programming', 'Financial Analysis'],
      year: '2025',
      githubUrl: 'https://github.com/evankniffen/'
    },
    {
      id: 'blackjack',
      title: 'beatTheHouse',
      description: 'Building a stochastic blackjack simulation to find optimal play strategies and minimize losses.',
      details: [
        'Simulated 1 million hands using StochPy & Matplotlib for visualization',
        'Implemented core game logic in Python and high‑performance C++ modules',
        'Modeled win/loss distributions with Euler‑Maruyama SDE approximations',
        'Compared simulated results against theoretical benchmarks'
      ],
      technologies: ['Stochastic Modeling', 'Python', 'C++', 'Stochastic Differential Equations'],
      year: '2025',
      githubUrl: 'https://github.com/evankniffen/beatthehouse'
    },
    {
      id: 'poker',
      title: 'pokerihardlyknowher',
      description: 'Counterfactual Regret Minimization (CFR) pokerbot built for the Build4Good competition.',
      details: [
        'Implemented CFR to approximate game-theoretic Nash equilibria',
        'Ran Monte Carlo simulations per hand for strategy refinement',
        'Leveraged a custom genetic algorithm for parameter optimization',
        'Tested performance in live Build4Good pokerbot matches'
      ],
      technologies: ['Monte Carlo Simulation', 'Genetic Algorithms', 'Game Theory', 'Poker Theory'],
      year: '2025',
      githubUrl: 'https://github.com/evankniffen/pokerihardlyknowher'
    },
    {
      id: 'homework',
      title: 'EZstudy',
      description: 'LLM‑powered homework assistant using Google Gemini & Wolfram APIs to answer questions from scanned notes.',
      details: [
        'Extracted text from user documents via AWS Textract',
        'Built a chat interface leveraging Google Gemini and Wolfram Language models',
        'Deployed on AWS Bedrock with secure, scalable data pipelines',
        'Built in 24hrs for the TIDALtamu Hackathon'
      ],
      technologies: ['AWS', 'Prompt Engineering', 'Google Gemini', 'Wolfram Language', 'Node.js'],
      year: '2025',
      githubUrl: 'https://github.com/evankniffen/ezstudy'
    }
  ].map((project, index) => ({
  ...project,
  delay: index * 0.1 // Staggered animation delay
}));

export const Projects: React.FC = () => {
  const [showDetail, setShowDetail] = useState<string | null>(null);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (showDetail) {
        e.preventDefault();
      }
    };
    
    const options = { passive: false } as AddEventListenerOptions;
    document.addEventListener('touchmove', handleTouchMove, options);
    return () => {
      document.removeEventListener('touchmove', handleTouchMove, options);
    };
  }, [showDetail]);
  
  const selectedProject = showDetail ? projects.find(p => p.id === showDetail) : null;

  return (
    <TerminalWindow 
      as={motion.div} 
      initial={{ x: -200, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      style={{
        overflow: 'hidden',
        WebkitOverflowScrolling: 'touch',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        minHeight: '10vh'
      }}
    >
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>kniff@tamu:~/projects$</Prompt>{' '}
        <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        <List>
          {projects.map((project) => (
            <TerminalItem 
              key={project.id} 
              onClick={() => setShowDetail(project.id)}
              style={{ animationDelay: `${project.delay}s` }}
            >
              <div className="command">
                <Prompt> &gt; {project.id}</Prompt>
              </div>
              <div className="title">
                {project.title}
              </div>
              <div className="subtitle">
                {project.technologies.join(' • ')} • {project.year}
              </div>
              <div className="description">
                {project.description}
              </div>
            </TerminalItem>
          ))}
        </List>
        
        {/* Modal rendered outside terminal container using Portal */}
        {showDetail && selectedProject && createPortal(
          <AnimatePresence>
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
                key={selectedProject.id}
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 0.95, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
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
                  <h3>{selectedProject.title}</h3>
                  <p className="subtitle">
                    {selectedProject.technologies.join(' • ')} • {selectedProject.year}
                  </p>
                  <div className="project-description" style={{
                    marginBottom: '1.5rem',
                    lineHeight: '1.7',
                    fontSize: '1rem',
                    color: '#ddd'
                  }}>
                    <p style={{ margin: '0 0 1.5rem' }}>{selectedProject.description}</p>
                    
                    {selectedProject.githubUrl && (
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '1.5rem'
                      }}>
                        <GitHubButton 
                          href={selectedProject.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.6rem 1.2rem',
                            background: 'rgba(0, 255, 0, 0.1)',
                            border: '1px solid rgba(0, 255, 0, 0.3)',
                            borderRadius: '4px',
                            color: '#0F0',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                          }}
                          className="github-button"
                        >
                          <svg className="github-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                          </svg>
                          <span className="github-text">View on GitHub</span>
                        </GitHubButton>
                      </div>
                    )}
                  </div>
                  
                  <h3>Key Features</h3>
                  <ul className="details-list">
                    {selectedProject.details.map((detail, i) => (
                      <li key={i}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  

                  
                  <h3>Technologies Used</h3>
                  <div className="tech-tags" style={{ marginBottom: '1.5rem' }}>
                    {selectedProject.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="tech-tag"
                        style={{
                          display: 'inline-block',
                          backgroundColor: 'rgba(0, 255, 0, 0.1)',
                          color: '#0F0',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          margin: '0.2rem',
                          fontSize: '0.85rem',
                          border: '1px solid rgba(0, 255, 0, 0.3)',
                          fontFamily: '"Source Code Pro", monospace'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </StyledDetailBody>
              </StyledDetailModal>
            </ModalBackdrop>
          </AnimatePresence>,
          document.body
        )}
      </WindowBody>
    </TerminalWindow>
  );
};
