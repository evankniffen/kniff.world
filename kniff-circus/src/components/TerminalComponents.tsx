import styled from 'styled-components';

export const TerminalWindow = styled.div`
  width: 90%;
  max-width: 900px;
  height: auto;
  min-height: 60vh;
  max-height: 80vh;
  background: #111;
  border: 2px solid #0F0;
  border-radius: 8px;
  box-shadow: 0 0 16px #0F0A0F;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 85vh;
  }
`;

export const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #222;
`;

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

export const List = styled.ul`
  list-style: none;
  margin: 1rem 0 0 0;
  padding: 0;
`;

export const ListItem = styled.li`
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

export const Prompt = styled.span`
  color: #0F0;
  font-weight: 600;
  margin-right: 0.5rem;
  user-select: none;
`;

export const WindowBody = styled.div`
  padding: 1.5rem;
  color: #0F0;
  font-family: 'Source Code Pro', monospace;
  font-size: 1rem;
  line-height: 1.6;
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #0F0;
    border-radius: 3px;
  }
`;

