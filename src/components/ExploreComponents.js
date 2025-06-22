// ExploreComponents.js - Additional styled components for Explore.js
import styled from 'styled-components';

// Define animations for the ActionButton
const buttonHover = `
  @keyframes buttonHover {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const arrowAnimation = `
  @keyframes arrowAnimation {
    0% { transform: translateX(0); }
    50% { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }
`;

export const ActionButton = styled.button`
  background: linear-gradient(135deg, #5390D9, #4C6FFF, #5E60CE, #4C6FFF);
  background-size: 300% 300%;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 30px;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.7px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(76, 111, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  width: 100%;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  
  /* Inject keyframes */
  ${buttonHover}
  ${arrowAnimation}
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: 0.5s;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px; 
    padding: 2px;
    background: linear-gradient(135deg, #7FC8F8, #4C6FFF);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    animation: buttonHover 3s ease infinite;
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(76, 111, 255, 0.5);
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
  }
  
  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
    font-size: 1.3rem;
  }
  
  span, a {
    position: relative;
    z-index: 1;
  }
  
  &:hover svg {
    transform: translateX(6px);
  }
`;

export const EventButton = styled(ActionButton)`
  background: linear-gradient(135deg, #FF9800, #F57C00, #FB8C00, #FF9800);
  background-size: 300% 300%;
  box-shadow: 0 10px 25px rgba(255, 152, 0, 0.3);
  
  &::after {
    background: linear-gradient(135deg, #FFCC80, #FF9800);
  }
  
  &:hover {
    animation: buttonHover 3s ease infinite;
    box-shadow: 0 15px 30px rgba(255, 152, 0, 0.5);
  }
`;

const badgeAnimation = `
  @keyframes badgePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export const BadgeTag = styled.span`
  padding: 8px 16px;
  background: linear-gradient(135deg, #FF8A65, #FF5722);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(255, 87, 34, 0.35);
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 87, 34, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-right: auto; /* Push to the right of DifficultyTag */
  
  /* Inject keyframes */
  ${badgeAnimation}
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px; 
    padding: 2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 87, 34, 0.5));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 87, 34, 0.5);
    animation: badgePulse 2s infinite;
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 7px 14px;
  }
`;
