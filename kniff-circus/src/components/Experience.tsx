import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, Dot, WindowBody, List, ListItem, Prompt } from './TerminalComponents';

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

const DetailModal = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(0, 20, 0, 0.98);
  border: 1px solid #0F0;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    max-height: 85vh;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #0F0;
`;

const Close = styled.button`
  background: none;
  border: none;
  color: #0F0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
  line-height: 1;
  
  &:hover {
    color: #fff;
    text-shadow: 0 0 5px #0F0;
  }
`;

const DetailBody = styled.div`
  line-height: 1.6;
  
  h3 {
    color: #0F0;
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 0.5rem;
  }
  
  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    position: relative;
    
    &::before {
      content: '>';
      color: #0F0;
      position: absolute;
      left: -1.2rem;
    }
  }
  
  .company {
    color: #0F0;
    font-weight: bold;
    margin-right: 0.5rem;
  }
  
  .date {
    color: #888;
    font-size: 0.9em;
  }
`;

const Experience: React.FC = () => {
  const [showDetail, setShowDetail] = useState<string | null>(null);
  
  const experiences = [
    {
      id: 'novvia',
      company: 'Novvia Group',
      role: 'Software Engineer',
      date: '2023 - Present',
      description: 'Full-stack development of enterprise applications',
      details: [
        'Developed and maintained internal tools and applications using modern web technologies',
        'Collaborated with cross-functional teams to design and implement new features',
        'Optimized application performance and improved user experience',
        'Mentored junior developers and conducted code reviews'
      ]
    },
    {
      id: 'approtec',
      company: 'ApproTEC',
      role: 'Software Developer',
      date: '2021 - 2023',
      description: 'Full-stack development for agricultural technology solutions',
      details: [
        'Designed and implemented responsive web applications for agricultural management',
        'Integrated IoT devices with web platforms for real-time data monitoring',
        'Developed RESTful APIs for data processing and analysis',
        'Collaborated with agricultural experts to create user-friendly interfaces'
      ]
    },
    {
      id: 'nexustrade',
      company: 'NexusTrade',
      role: 'Frontend Developer',
      date: '2020 - 2021',
      description: 'Development of trading platform interfaces',
      details: [
        'Built interactive data visualization components for financial data',
        'Implemented real-time updates using WebSockets',
        'Optimized frontend performance for better user experience',
        'Collaborated with UX designers to implement responsive designs'
      ]
    }
  ];

  const selectedExperience = showDetail ? experiences.find(exp => exp.id === showDetail) : null;

  return (
    <TerminalWindow as={motion.div} initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>Kniff@tamu:~/experience$</Prompt>{' '}
        <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        <List>
          {experiences.map((exp) => (
            <ListItem key={exp.id} onClick={() => setShowDetail(exp.id)}>
              <Prompt> &gt; {exp.id}</Prompt> <span>{exp.company} - {exp.role}</span>
            </ListItem>
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
              <DetailModal 
                key={showDetail} 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
              <DetailHeader>
                <Close onClick={() => setShowDetail(null)}>×</Close>
                <div>
                  <Dot style={{ background: '#f00' }}/>
                  <Dot style={{ background: '#ff0' }}/>
                  <Dot style={{ background: '#0f0' }}/>
                </div>
              </DetailHeader>
              <DetailBody>
                <h3><span className="company">{selectedExperience.company}</span> - {selectedExperience.role}</h3>
                <p className="date">{selectedExperience.date}</p>
                <p>{selectedExperience.description}</p>
                <h3>Key Responsibilities:</h3>
                <ul>
                  {selectedExperience.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </DetailBody>
              </DetailModal>
            </ModalBackdrop>
          )}
        </AnimatePresence>
      </WindowBody>
    </TerminalWindow>
  );
};

export default Experience;
