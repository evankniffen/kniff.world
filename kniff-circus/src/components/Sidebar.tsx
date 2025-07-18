// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { id: 'hero',       label: '> hero' },
  { id: 'about',      label: '> about' },
  { id: 'experience', label: '> experience' },
  { id: 'projects',   label: '> projects' },
  { id: 'research',   label: '> research' },
  { id: 'contact',    label: '> contact' },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <HamburgerButton 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 7 }
            }}
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -7 }
            }}
          />
        </HamburgerButton>
      )}
      
      <Nav $isMobile={isMobile} $isOpen={isOpen}>
        <AnimatePresence>
          {(!isMobile || isOpen) && (
            <NavItems
              initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {items.map(i => (
                <NavItem
                  key={i.id}
                  whileHover={{ color: '#00FF00' }}
                  onClick={() => handleNavClick(i.id)}
                >
                  {i.label}
                </NavItem>
              ))}
            </NavItems>
          )}
        </AnimatePresence>
      </Nav>
    </>
  );
};

const Nav = styled.nav<{ $isMobile: boolean; $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.85);
  border-right: 2px solid #0F0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isMobile, $isOpen }) => 
    $isMobile ? ($isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'};
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding-top: 5rem;
  }
`;

const NavItems = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const NavItem = styled(motion.div)`
  cursor: pointer;
  font-size: 1rem;
  color: #0F0;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
  }
`;

const HamburgerButton = styled(motion.button)`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1100;
  
  &:focus {
    outline: none;
  }
  
  span {
    width: 2rem;
    height: 0.25rem;
    background: #0F0;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
`;
