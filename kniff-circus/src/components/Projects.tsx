// src/components/Projects.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const projects = [
  { title: 'Windsurf CMS', desc: 'DIY portfolio builder', url:'#' },
  { title: 'Meme Analyzer', desc: 'Virality pipeline in Python', url:'#' },
  { title: 'Itô Explorer', desc: 'Interactive stochastic visualizer', url:'#' },
];

export const Projects: React.FC = () => (
  <Section>
    <h2>🎪 Projects</h2>
    <Grid>
      {projects.map((p,i) => (
        <Ticket key={i} href={p.url}>
          <motion.div whileHover={{ scale:1.05, rotate:-1 }} whileTap={{ scale:0.95 }}>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </motion.div>
        </Ticket>
      ))}
    </Grid>
  </Section>
);

const Section = styled.div`
  text-align: center;
  h2 { font-family:'Russo One',sans-serif; font-size:2.4rem; margin-bottom:1rem; color:#11e5c0; }
`;
const Grid = styled.div`
  display:grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
  gap:1.6rem; padding:0 2rem;
`;
const Ticket = styled.a`
  display:block;
  background: linear-gradient(145deg,#25003f 0%,#0a001f 100%);
  border:2px dashed #11e5c0;
  border-radius:1rem;
  color:#fff; padding:1rem;
  box-shadow: 0 4px 18px #11e5c040;
  h3 { margin-bottom:0.5rem; font-size:1.1rem; }
  p { font-size:0.9rem; color:#ccc; }
`;
