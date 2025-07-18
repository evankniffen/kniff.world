import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, WindowBody, Dot, List, Prompt } from './TerminalComponents';
import {
  ModalBackdrop,
  StyledDetailModal,
  StyledDetailHeader,
  StyledDetailBody,
  TerminalItem,
  CloseButton
} from './TerminalUI';

// Using shared components from TerminalUI

const Experience: React.FC = () => {
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
  
  interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    date: string;
    description: string;
    details: string[];
    technologies: string[];
    delay: number;
  }

  const experiences = [
    {
      id: 'novvia',
      company: 'Novvia Group',
      role: 'Pricing Analyst Intern',
      date: 'May 2025 - Present',
      description: 'Collaborated with cross‑functional teams to refine pricing models and improve decision accuracy',
      technologies: ['Python', 'Tableau', 'Excel', 'VBA'],
      details: [
        'Built interactive Tableau dashboards to surface pricing trends and identify inactive customer segments',
        'Automated Excel reports using VBA macros to improve efficiency by 40%',
        'Built information theoretic models to predict customer inactivity',
        'Developed a fuzzy matching algorithm that outperformed Excel by 26%',
      ]
    },
    {
      id: 'approtec',
      company: 'Approtec Ran-Le',
      role: 'Data Analyst',
      date: 'Apr 2025 - Jul 2025',
      description: 'Developed math-infomred inventory models for supply chain optimization',
      technologies: ['Excel', 'Tableau', 'Microsoft Office', 'QuickBooks'],
      details: [
        'Developed and calibrated a modified (Q,r) inventory model accounting for stochastic lead times',
        'Analyzed historical inventory and shipping data to optimize reorder points, reducing stockouts by 18%',
        'Integrated advanced Excel models with VBA to automate demand forecasting and reporting',
      ]
    },
    {
      id: 'nexustrade',
      company: 'NexusTrade',
      role: 'SWE intern',
      date: 'Jun 2023 – Jul 2024',
      description: 'Development of trading platform interfaces',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'Python', 'OpenAI APIs'],
      details: [
        'Built full‑stack features for an AI‑powered financial research platform under mentorship of Austin Starks',
        'Implemented real‑time data pipelines with Node.js and WebSockets for live market updates',
        'Developed React UI components for interactive trading dashboards',
        'Integrated OpenAI API calls to power an in‑app stock research assistant chatbot'
      ]
    }
  ].map((exp, index) => ({
    ...exp,
    delay: index * 0.1 // Staggered animation delay
  }));

  const selectedExperience = showDetail ? experiences.find((exp: ExperienceItem) => exp.id === showDetail) : null;

  return (
    <TerminalWindow as={motion.div} initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>kniff@tamu:~/experience$</Prompt>{' '}
        <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        <List>
          {experiences.map((exp) => (
            <TerminalItem 
              key={exp.id} 
              onClick={() => setShowDetail(exp.id)}
              style={{ animationDelay: `${exp.delay}s` }}
            >
              <div className="command">
                <Prompt> &gt; {exp.id}</Prompt>
              </div>
              <div className="title">
                {exp.company}
              </div>
              <div className="subtitle">
                {exp.role} • {exp.date}
              </div>
              <div className="description">
                {exp.description}
              </div>
            </TerminalItem>
          ))}
        </List>
        
        <AnimatePresence>
          {showDetail && selectedExperience && (
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
                key={selectedExperience.id}
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
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
                  <h3>{selectedExperience.company}</h3>
                  <p className="subtitle">
                    {selectedExperience.role} • {selectedExperience.date}
                  </p>
                  <p>{selectedExperience.description}</p>
                  
                  <h3>Key Responsibilities</h3>
                  <ul className="details-list">
                    {selectedExperience.details.map((detail, i) => (
                      <li key={i}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  <h3>Technologies Used</h3>
                  <div className="tech-tags" style={{ marginBottom: '1.5rem' }}>
                    {selectedExperience.technologies.map((tech: string, i: number) => (
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
                    )) || (
                      <span 
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
                          fontFamily: '"Source Code Pro", monospace',
                          fontStyle: 'italic',
                          opacity: 0.7
                        }}
                      >
                        Not specified
                      </span>
                    )}
                  </div>
                </StyledDetailBody>
              </StyledDetailModal>
            </ModalBackdrop>
          )}
        </AnimatePresence>
      </WindowBody>
    </TerminalWindow>
  );
};

export default Experience;
