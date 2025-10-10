import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, WindowBody, Dot, List, Prompt } from './TerminalComponents';
import { ModalBackdrop, StyledDetailModal, StyledDetailHeader, StyledDetailBody, CloseButton } from './TerminalUI';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Removed unused terminalGlow animation (About modal now uses shared TerminalUI modal styles)

// Styled Components

export const AboutItem = styled.li`
  margin: 1rem 0;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  background: rgba(0, 30, 0, 0.1);
  border-left: 2px solid transparent;
  animation: ${fadeIn} 0.5s ease-out forwards;
  opacity: 0;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(0, 50, 0, 0.2);
    border-left: 2px solid #0F0;
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.1);
    
    .title {
      color: #0F0;
      text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
    }
    
    .description {
      opacity: 1;
      max-height: 100px;
    }
  }
  
  .command {
    color: #0F0;
    font-family: 'Source Code Pro', monospace;
    margin-bottom: 0.5rem;
    display: block;
    white-space: pre;
  }
  
  .title {
    font-size: 1.1rem;
    color: #fff;
    margin: 0.3rem 0;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  .subtitle {
    color: #aaa;
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }
  
  .description {
    color: #888;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    line-height: 1.5;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease;
    opacity: 0;
  }
  
  // Staggered animation
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }

  // Mobile-specific styles
  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
    margin: 0.8rem 0;
    border-radius: 8px;
    
    // Make entire item tappable
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    // Show description by default on mobile
    .description {
      max-height: 500px !important;
      opacity: 1 !important;
      margin-top: 0.8rem;
      font-size: 0.9rem;
      color: #999;
    }
    
    // Adjust title and subtitle for better mobile viewing
    .title {
      font-size: 1.15rem;
      margin: 0.4rem 0 0.3rem;
    }
    
    .subtitle {
      font-size: 0.9rem;
      margin: 0.2rem 0 0.5rem;
    }
    
    // Add touch feedback
    &:active {
      background: rgba(0, 50, 0, 0.3);
      transform: scale(0.98);
    }
    touch-action: manipulation;
  }
`;

export const About: React.FC = () => {
  const [showDetail, setShowDetail] = useState<string | null>(null);
  // Removed global touchmove preventDefault to allow modal inner scrolling on mobile
  
  const aboutItems = [
    {
      id: 'the-goat',
      title: 'Evan Kniffen',
      subtitle: 'Local legend',
      description: 'I\'m a lifelong student of the game who builds cool stuff, solves integrals, and plays a lot of blackjack.'
    },
    {
      id: 'edu',
      title: 'Education',
      subtitle: 'B.S. in Mathematics - Texas A&M University',
      description: '2024-2026, GPA: 3.61, w/ honors. Currently submitting PhD applications for Fall 2026.'
    },
    {
      id: 'passions',
      title: 'Interests & Passions',
      subtitle: 'Stochastic Calculus, Probability, Measure Theory, Machine Learning, Brownian Motion, Gambling',
      description: 'I love to solve and write integrals, and can frequently be found doomscrolling on AoPS or MSE.'
    }
  ];

  const selectedItem = aboutItems.find(item => item.id === showDetail) || null;

  return (
    <TerminalWindow as={motion.div} initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>kniff@tamu:~/about$</Prompt>{' '}
        <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        <List>
          {aboutItems.map((item, index) => (
            <AboutItem 
              key={item.id} 
              onClick={() => setShowDetail(item.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="command">&gt; {item.id}</span>
              <div className="title">{item.title}</div>
              <div className="subtitle">{item.subtitle}</div>
              <div className="description">
                {item.description}
              </div>
            </AboutItem>
          ))}
        </List>
        
        {showDetail && selectedItem && createPortal(
          (
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
                  key={showDetail}
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: 0,
                    transition: { 
                      type: "spring",
                      damping: 25,
                      stiffness: 300
                    }
                  }}
                  exit={{ 
                    scale: 0.95, 
                    opacity: 0,
                    y: 20,
                    transition: { duration: 0.15 }
                  }}
                >
                  <StyledDetailHeader>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Dot style={{ background: '#f00' }}/>
                      <Dot style={{ background: '#ff0' }}/>
                      <Dot style={{ background: '#0f0' }}/>
                    </div>
                    <CloseButton onClick={() => setShowDetail(null)}>×</CloseButton>
                  </StyledDetailHeader>
                  <StyledDetailBody>
                    <h3>{selectedItem.title}</h3>
                    <div className="subtitle">{selectedItem.subtitle}</div>
                    <p>{selectedItem.description}</p>
                    {selectedItem.id === 'whoami' && (
                      <p>Let's build something amazing together!</p>
                    )}
                  </StyledDetailBody>
                </StyledDetailModal>
              </ModalBackdrop>
            </AnimatePresence>
          ),
          document.body
        )}
      </WindowBody>
    </TerminalWindow>
  );
};
