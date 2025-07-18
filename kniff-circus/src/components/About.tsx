import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, WindowBody, Dot, List, Prompt } from './TerminalComponents';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const terminalGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.2); }
`;

// Styled Components
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const StyledDetailModal = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(10, 25, 10, 0.98);
  border: 1px solid #0F0;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 0 40px rgba(0, 255, 0, 0.2);
  overflow-y: auto;
  animation: ${terminalGlow} 3s infinite;
  backdrop-filter: blur(5px);
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    max-height: 90vh;
    margin: 1rem;
    width: calc(100% - 2rem);
    box-sizing: border-box;
    
    button, [role="button"] {
      min-height: 48px;
      min-width: 48px;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #0F0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 1rem;
  margin: -1rem;
  line-height: 1;
  position: relative;
  z-index: 2;
  
  &:hover {
    color: #fff;
    text-shadow: 0 0 5px #0F0;
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    margin: -1.2rem;
    font-size: 1.8rem;
  }
`;

const StyledDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -2.5rem -2.5rem 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 30, 0, 0.3);
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #0F0, transparent);
  }
  
  @media (max-width: 768px) {
    margin: -1.2rem -1.2rem 1.5rem;
    padding: 0.8rem 1.2rem;
  }
`;

const StyledDetailBody = styled.div`
  line-height: 1.8;
  font-size: 1.05rem;
  
  h3 {
    color: #0F0;
    margin: 1.5rem 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 500;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 2px;
      background: #0F0;
    }
  }
  
  .subtitle {
    color: #bbb;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    font-style: italic;
  }
  
  p {
    margin: 1.2rem 0;
    color: #ddd;
    line-height: 1.7;
  }
  
  code {
    background: rgba(0, 50, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.9em;
    color: #0F0;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
    
    h3 {
      font-size: 1.4rem;
      margin: 1rem 0 0.8rem;
    }
    
    .subtitle {
      font-size: 1rem;
      margin-bottom: 1.2rem;
    }
  }
`;

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
  
  // Add touch-action to prevent browser's touch actions on the document
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling when modal is open
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
  
  const aboutItems = [
    {
      id: 'whoami',
      title: 'Evan Kniffen',
      subtitle: 'Quant, Mathematician, Physicist',
      description: 'I\'m a lifelong student of the game who builds cool stuff, solves integrals, and plays a lot of blackjack.'
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      subtitle: 'Python, C++, Java, Mathematica, R, TensorFlow, Keras, PyTorch',
      description: 'I\'ve built stock-trading algorithms, Monte Carlo integrators, and SDE blackjack bots.'
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
        
        <AnimatePresence>
          {showDetail && selectedItem && (
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
                <h3>{selectedItem.title}</h3>
                <div className="subtitle">{selectedItem.subtitle}</div>
                <p>{selectedItem.description}</p>
                {selectedItem.id === 'whoami' && (
                    <p>Let's build something amazing together!</p>
                )}
              </StyledDetailBody>
            </StyledDetailModal>
            </ModalBackdrop>
          )}
        </AnimatePresence>
      </WindowBody>
    </TerminalWindow>
  );
};
