// src/components/Contact.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => (
  <Section>
    <h2>🔮 Contact</h2>
    <Form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Input placeholder="Your Name" />
      <Input placeholder="Your Email" />
      <Textarea placeholder="Your Message" rows={4} />
      <Submit
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Send a Digital Ticket 🎟️
      </Submit>
    </Form>
  </Section>
);

const Section = styled.div`
  text-align: center;
  h2 { font-family:'Russo One',sans-serif; font-size:2.4rem; margin-bottom:1rem; color:#ffe743; }
`;
const Form = styled(motion.form)`
  display:flex; flex-direction:column; gap:1rem;
  max-width:360px; margin:auto;
`;
const Input = styled.input`
  padding:0.8rem; border:none; border-radius:0.6rem;
  background:#25003f; color:#fff;
  box-shadow: inset 0 2px 8px #0004;
  &:focus { outline:2px solid #ffe743; }
`;
const Textarea = styled.textarea`
  padding:0.8rem; border:none; border-radius:0.6rem;
  background:#25003f; color:#fff;
  box-shadow: inset 0 2px 8px #0004;
  &:focus { outline:2px solid #ff2aff; }
`;
const Submit = styled(motion.button)`
  padding:0.8rem;
  background: linear-gradient(145deg,#ffe743 30%,#11e5c0 120%);
  border:none; border-radius:0.8rem;
  font-weight:700; cursor:pointer;
  color:#25003f;
  box-shadow: 0 4px 16px #ffe74355;
`;
