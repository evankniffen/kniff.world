// src/components/Sidebar.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const items = [
  { id: 'hero',       label: '> hero' },
  { id: 'about',      label: '> about' },
  { id: 'experience', label: '> experience' },
  { id: 'projects',   label: '> projects' },
  { id: 'contact',    label: '> contact' },
];

export const Sidebar: React.FC = () => (
  <Nav>
    {items.map(i => (
      <NavItem
        key={i.id}
        whileHover={{ color: '#00FF00' }}
        onClick={() => document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' })}
      >
        {i.label}
      </NavItem>
    ))}
  </Nav>
);

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap:1rem;
  padding:2rem 1rem;
  background:rgba(0,0,0,0.8);
  border-right:2px solid #0F0;
`;
const NavItem = styled(motion.div)`
  cursor: pointer;
  font-size:1rem;
  color:#0F0;
`;
