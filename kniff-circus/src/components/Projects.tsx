import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { TerminalWindow, WindowHeader, Dot, WindowBody, List, Prompt } from './TerminalComponents';

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
  
  a {
    color: #0F0;
    text-decoration: none;
    border-bottom: 1px solid #0F0;
    transition: all 0.2s ease;
    
    &:hover {
      color: #fff;
      text-shadow: 0 0 5px #0F0;
      border-color: #fff;
    }
  }
`;

const projects = [
  {
    id: 'windsurf-cms',
    title: 'Windsurf CMS',
    description: 'Dynamic portfolio generator',
    technologies: 'TypeScript, React, Vite, Node.js',
    link: 'https://github.com/evankniffen/windsurf-cms',
    details: [
      'Developed a headless CMS for creating and managing portfolio websites',
      'Implemented real-time preview and live editing capabilities',
      'Created a plugin system for extending functionality',
      'Built with modern web technologies for optimal performance'
    ]
  },
  {
    id: 'meme-analyzer',
    title: 'Meme Analyzer',
    description: 'ML pipeline for meme virality prediction',
    technologies: 'Python, PyTorch, FastAPI, React',
    link: 'https://github.com/evankniffen/meme-analyzer',
    details: [
      'Trained deep learning models to predict meme virality',
      'Processed and analyzed large datasets of social media content',
      'Built a RESTful API for model inference',
      'Created an interactive dashboard for visualizing predictions'
    ]
  },
  {
    id: 'ito-explorer',
    title: 'Itô Explorer',
    description: 'Interactive stochastic calculus visualizer',
    technologies: 'TypeScript, D3.js, React',
    link: 'https://github.com/evankniffen/ito-explorer',
    details: [
      'Visualized stochastic processes and Itô calculus concepts',
      'Implemented interactive charts with D3.js',
      'Created educational content and examples',
      'Designed an intuitive user interface for exploring mathematical concepts'
    ]
  }
];

const ProjectListItem = styled.li`
  padding: 0.5rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #fff;
    text-shadow: 0 0 5px #0F0;
    
    span {
      transform: translateX(5px);
    }
  }
  
  span {
    transition: transform 0.2s ease;
    margin-left: 0.5rem;
  }
`;

export const Projects: React.FC = () => {
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const selectedProject = showDetail ? projects.find(proj => proj.id === showDetail) : null;

  return (
    <TerminalWindow as={motion.div} initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
      <WindowHeader>
        <Dot style={{ background: '#f00' }}/>
        <Dot style={{ background: '#ff0' }}/>
        <Dot style={{ background: '#0f0' }}/>
      </WindowHeader>
      <WindowBody>
        <Prompt>Kniff@tamu:~/projects$</Prompt>{' '}
        <Typewriter words={['ls -la']} cursor cursorStyle="_" typeSpeed={90} delaySpeed={1500} />
        <List>
          {projects.map((project) => (
            <ProjectListItem key={project.id} onClick={() => setShowDetail(project.id)}>
              <Prompt> &gt; {project.id}</Prompt> <span>{project.title} - {project.description}</span>
            </ProjectListItem>
          ))}
        </List>
        
        <AnimatePresence>
          {showDetail && selectedProject && (
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
                <CloseButton onClick={() => setShowDetail(null)}>×</CloseButton>
                <div>
                  <Dot style={{ background: '#f00' }}/>
                  <Dot style={{ background: '#ff0' }}/>
                  <Dot style={{ background: '#0f0' }}/>
                </div>
              </DetailHeader>
              <DetailBody>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.description}</p>
                <p><strong>Technologies:</strong> {selectedProject.technologies}</p>
                <p><strong>GitHub:</strong> <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">{selectedProject.link}</a></p>
                <h3>Features:</h3>
                <ul>
                  {selectedProject.details.map((detail, index) => (
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

const CloseButton = styled(Close)`
  &:hover { 
    color: #f00;
    text-shadow: 0 0 5px #f00;
  }
`;
