// src/components/Projects.tsx
import React from 'react';
import styled from 'styled-components';

const StyledProjects = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px 0;
  
  .projects-grid {
    list-style: none;
    padding: 0;
    margin: 50px 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
    position: relative;
    
    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);
  
  &:hover,
  &:focus-within {
    .project-inner {
      transform: translateY(-5px);
      
      &:before {
        top: 0;
        left: 0;
      }
      
      .project-links {
        opacity: 1;
      }
      
      .project-tech-list {
        margin: 10px 0;
        opacity: 1;
      }
    }
  }
  
  .project-inner {
    height: 100%;
    position: relative;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
    
    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3;
      transition: var(--transition);
      background-color: var(--navy);
      mix-blend-mode: screen;
    }
  }
  
  .project-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    .folder {
      color: var(--primary);
      svg {
        width: 40px;
        height: 40px;
      }
    }
    
    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);
      
      a {
        padding: 5px 10px;
        
        svg {
          width: 20px;
          height: 20px;
          
          &:hover,
          &:focus {
            color: var(--primary);
          }
        }
      }
    }
  }
  
  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    
    a {
      position: static;
      
      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }
  
  .project-description {
    color: var(--light-slate);
    font-size: 17px;
    
    p {
      margin: 0;
    }
  }
  
  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;
    
    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
      margin-right: 15px;
      
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
`;

const projects = [
  {
    title: 'Project One',
    description: 'A short description of the project. Just a few sentences will do.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com',
    external: 'https://example.com',
  },
  {
    title: 'Project Two',
    description: 'Another short description of the project. Keep it brief and to the point.',
    tech: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    github: 'https://github.com',
    external: 'https://example.com',
  },
  {
    title: 'Project Three',
    description: 'A third project description. Highlight the key features and tech stack.',
    tech: ['Python', 'Django', 'PostgreSQL'],
    github: 'https://github.com',
    external: 'https://example.com',
  },
];

export const Projects: React.FC = () => {
  return (
    <StyledProjects id="projects">
      <h2 className="numbered-heading">Some Things I've Built</h2>
      
      <ul className="projects-grid">
        {projects.map((project, i) => {
          const { title, description, tech, github, external } = project;
          
          return (
            <StyledProject key={i}>
              <div className="project-inner">
                <header>
                  <div className="project-top">
                    <div className="folder">
                      <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <title>Folder</title>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div className="project-links">
                      {github && (
                        <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <title>GitHub</title>
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </a>
                      )}
                      {external && (
                        <a href={external} aria-label="External Link" className="external" target="_blank" rel="noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <title>External Link</title>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="project-title">
                    <a href={external} target="_blank" rel="noreferrer">
                      {title}
                    </a>
                  </h3>
                  <div className="project-description">
                    <p>{description}</p>
                  </div>
                </header>
                <footer>
                  <ul className="project-tech-list">
                    {tech.map((tech, i) => (
                      <li key={i}>{tech}</li>
                    ))}
                  </ul>
                </footer>
              </div>
            </StyledProject>
          );
        })}
      </ul>
    </StyledProjects>
  );
};
