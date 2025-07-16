// src/components/Contact.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TerminalWindow, 
  WindowHeader, 
  WindowBody, 
  Dot, 
  Prompt 
} from './TerminalComponents';

export const Contact: React.FC = () => {
  const contactLinks = [
    {
      label: 'Email',
      url: 'mailto:kniff@tamu.edu',
      display: 'kniff@tamu.edu',
      icon: '✉️'
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/kniffen',
      display: 'linkedin.com/in/kniffen',
      icon: '💼'
    },
    {
      label: 'GitHub',
      url: 'https://github.com/evankniffen',
      display: 'github.com/evankniffen',
      icon: '💻'
    }
  ];

  return (
    <TerminalWindow
      as={motion.div}
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type:'spring', stiffness:100 }}
    >
      <WindowHeader>
        <Dot style={{ background:'#f00' }}/>
        <Dot style={{ background:'#ff0' }}/>
        <Dot style={{ background:'#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>Kniff@tamu:~/contact$</Prompt> connect
        <ContactList>
          {contactLinks.map((link) => (
            <ContactItem key={link.label}>
              <ContactLink 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span role="img" aria-label={link.label}>
                  {link.icon}
                </span>{' '}
                {link.display}
              </ContactLink>
            </ContactItem>
          ))}
        </ContactList>
      </WindowBody>
    </TerminalWindow>
  );
};

/* ────────────────────────────────────────────────────────────── */
/* ─── Styled Components ──────────────────────────────────────── */

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;

const ContactLink = styled.a`
  color: #0F0;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid transparent;
  
  &:hover {
    color: #fff;
    text-shadow: 0 0 10px #0F0;
    background: rgba(0, 255, 0, 0.1);
    border-color: #0F0;
    transform: translateX(5px);
  }
  
  &:active {
    transform: translateX(5px) scale(0.98);
  }
  
  span {
    font-size: 1.2rem;
  }
`;
