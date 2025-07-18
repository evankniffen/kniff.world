import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TerminalWindow, WindowHeader, WindowBody, Dot, Prompt } from './TerminalComponents';

// Simple icons using text
const Icons = {
  Mail: '✉️',
  LinkedIn: '💼',
  GitHub: '💻',
  Copy: '📋',
  External: '↗️'
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15
    }
  },
  tap: { 
    scale: 0.98,
    transition: { 
      type: 'spring',
      stiffness: 500,
      damping: 20
    }
  }
} as const;

const ContactCard = styled(motion.div).attrs({
  variants: item,
  initial: 'hidden',
  whileHover: 'hover',
  whileTap: 'tap',
  animate: 'show'
})`
  position: relative;
  background: rgba(10, 25, 10, 0.7);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0f0, transparent);
    opacity: 0.5;
  }
  
  &:hover {
    border-color: rgba(0, 255, 0, 0.4);
    box-shadow: 0 8px 25px rgba(0, 255, 0, 0.1);
    
    .contact-icon {
      transform: scale(1.1) rotate(5deg);
      filter: drop-shadow(0 0 8px rgba(0, 255, 0, 0.5));
    }
  }
`;

const ContactGrid = styled(motion.div).attrs(() => ({
  variants: container,
  initial: 'hidden',
  animate: 'show'
}))`
  display: grid;
  grid-template-columns: repeat(2, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactContent = styled.div`
  position: relative;
  z-index: 2;
`;

const ContactHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ContactIcon = styled.div`
  font-size: 1.8rem;
  color: #0f0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.5rem;
`;

const ContactTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ContactValue = styled.p`
  margin: 0.5rem 0 0;
  color: #aaa;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-break: break-all;
`;

const ActionButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #0f0;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 255, 0, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(0, 255, 0, 0.05) 0%,
    transparent 60%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ContactCard}:hover & {
    opacity: 1;
  }
`;

interface ContactCardProps {
  id: string;
  title: string;
  value: string;
  url: string;
  icon: string;
  color: string;
}

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const contactCards = useRef<(HTMLDivElement | null)[]>([]);
  
  const contacts: ContactCardProps[] = [
    {
      id: 'email',
      title: 'Email',
      value: 'kniff@tamu.edu',
      url: 'mailto:kniff@tamu.edu',
      icon: Icons.Mail,
      color: '#0f0'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      value: 'linkedin.com/in/kniffen',
      url: 'https://www.linkedin.com/in/kniffen',
      icon: Icons.LinkedIn,
      color: '#0A66C2'
    },
    {
      id: 'github',
      title: 'GitHub',
      value: 'github.com/evankniffen',
      url: 'https://github.com/evankniffen',
      icon: Icons.GitHub,
      color: '#f0f0f0'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    const card = contactCards.current[cardIndex];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };
  
  const handleCardClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <TerminalWindow
      as={motion.div}
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <WindowHeader>
        <Dot style={{ background: '#f00' }} />
        <Dot style={{ background: '#ff0' }} />
        <Dot style={{ background: '#0f0' }} />
      </WindowHeader>
      <WindowBody>
        <div style={{ position: 'relative' }}>
          <Prompt>Kniff@tamu:~/contact$</Prompt> connect
          <span className="blinking-cursor">_</span>
          
          <ContactGrid>
            {contacts.map((contact, index) => (
              <ContactCard
                key={contact.id}
                ref={el => {
                  if (el) {
                    contactCards.current[index] = el;
                  }
                }}
                onMouseMove={(e) => handleCardHover(e, index)}
                style={{
                  '--card-color': contact.color,
                  '--card-hover-color': `${contact.color}30`,
                  '--card-glow': `${contact.color}20`,
                } as React.CSSProperties}
                onClick={(e) => handleCardClick(contact.url, e)}
              >
                <GlowEffect />
                <ContactContent>
                  <ContactHeader>
                    <ContactIcon 
                      className="contact-icon"
                      style={{ 
                        color: contact.color,
                        background: `${contact.color}15`,
                        border: `1px solid ${contact.color}30`
                      }}
                    >
                      {contact.icon}
                    </ContactIcon>
                    <ContactTitle>{contact.title}</ContactTitle>
                    
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(contact.id === 'email' ? contact.value : contact.url, contact.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        background: contact.id === copied 
                          ? 'rgba(0, 255, 0, 0.2)' 
                          : 'rgba(0, 0, 0, 0.2)',
                        borderColor: contact.id === copied 
                          ? '#0f0' 
                          : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {contact.id === copied ? (
                        <>
                          {Icons.Copy} Copied!
                        </>
                      ) : (
                        <>
                          {Icons.External} {contact.id === 'email' ? 'Copy' : 'Open'}
                        </>
                      )}
                    </ActionButton>
                  </ContactHeader>
                  
                  <ContactValue>
                    {contact.value}
                  </ContactValue>
                </ContactContent>
                
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(
                    800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
                    var(--card-hover-color),
                    transparent 40%
                  )`,
                  pointerEvents: 'none',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 1,
                  borderRadius: 'inherit'
                }} />
              </ContactCard>
            ))}
          </ContactGrid>
        </div>
      </WindowBody>
    </TerminalWindow>
  );
};

export const ContactLink = styled.a`
  color: #0F0;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid transparent;
  position: relative;
  
  &:hover {
    color: #fff;
    text-shadow: 0 0 10px #0F0;
    transform: translateX(5px);
    
    &::after {
      width: 100%;
      opacity: 1;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: #0F0;
    transition: all 0.3s ease;
    opacity: 0;
  }
  
  &:active {
    transform: translateX(5px) scale(0.98);
  }
  
  span {
    font-size: 1.2rem;
  }
`;
