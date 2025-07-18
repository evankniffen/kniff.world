// src/components/Sidebar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { id: 'hero',       label: '> start' },
  { id: 'about',      label: '> about' },
  { id: 'experience', label: '> experience' },
  { id: 'projects',   label: '> projects' },
  { id: 'research',   label: '> research' },
  { id: 'contact',    label: '> contact' },
];

interface SidebarProps {
  onMenuToggle?: (isOpen: boolean) => void;
  isMenuOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onMenuToggle, isMenuOpen: propIsMenuOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Sync with props when they change
  useEffect(() => {
    if (propIsMenuOpen !== undefined) {
      setIsOpen(propIsMenuOpen);
    }
  }, [propIsMenuOpen]);
  
  // Notify parent about menu state changes
  const handleMenuToggle = useCallback((open: boolean) => {
    setIsOpen(open);
    if (onMenuToggle) {
      onMenuToggle(open);
    }
  }, [onMenuToggle]);
  
  // Toggle menu function
  const toggleMenu = useCallback(() => {
    if (isMobile) {
      handleMenuToggle(!isOpen);
    }
  }, [isMobile, isOpen, handleMenuToggle]);
  
  // Handle nav item click
  const handleNavClick = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (isMobile) {
      handleMenuToggle(false);
    }
  }, [isMobile, handleMenuToggle]);

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
  width: 280px;
  max-width: 90%;
  height: 100vh;
  z-index: ${({ $isMobile }) => ($isMobile ? 1500 : 10)};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 5rem 1.5rem 2rem;
  background: rgba(0, 15, 0, 0.98);
  border-right: 2px solid #0F0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isMobile, $isOpen }) => 
    $isMobile ? ($isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  backdrop-filter: blur(5px);
  
  @media (min-width: 769px) {
    width: 250px;
    padding: 2rem 1.5rem;
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
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(0, 50, 0, 0.5);
    border-color: rgba(0, 255, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 1rem 1.2rem;
  }
`;

const HamburgerButton = styled(motion.button)`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #0F0;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.75rem;
  z-index: 2000;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.5);
  }
  
  span {
    display: block;
    width: 100%;
    height: 0.2rem;
    background: #0F0;
    border-radius: 2px;
    transition: all 0.3s ease;
    margin: 0.15rem 0;
    transform-origin: center;

    &:first-child {
      margin-top: 0;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
