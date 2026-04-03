import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiClock, 
  FiActivity, 
  FiShare2, 
  FiHeart 
} from 'react-icons/fi';

// --- STYLED COMPONENTS ---

const ModernHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* Premium Dark Matte on scroll, Transparent Gradient on Hero */
  background: ${props => props.isScrolled 
    ? 'rgba(15, 15, 18, 0.98)' 
    : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)'};
  
  /* Remove heavy glass blur, use subtle blur only on scroll */
  backdrop-filter: ${props => props.isScrolled ? 'blur(12px)' : 'none'};
  
  /* Height transition */
  padding: ${props => props.isScrolled ? '0.75rem 0' : '2rem 0'};
  
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: ${props => props.isScrolled ? '0 1px 0 rgba(255,255,255,0.1)' : 'none'};
  will-change: background, padding, box-shadow;

  @media (max-width: 768px) {
    padding: ${props => props.isScrolled ? '0.75rem 0' : '1.5rem 0'};
  }
`;

const HeaderInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0 1.25rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem; /* Default spacing for desktop */
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 0.55rem; /* Reduced spacing for mobile */
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 1rem;
`;

const HeaderTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; 
`;

const HeaderTrekTitle = styled.h1`
  color: white;
  margin: 0;
  /* Typography Scale: Large Hero vs Compact Nav */
  font-size: ${props => props.isScrolled ? '1.15rem' : '2.2rem'};
  font-weight: ${props => props.isScrolled ? '600' : '700'};
  line-height: 1.1;
  letter-spacing: -0.02em;
  
  /* Positioning Transition */
  transform-origin: left center;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Text Shadow for readability over images */
  text-shadow: ${props => props.isScrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.3)'};

  @media (max-width: 768px) {
    font-size: ${props => props.isScrolled ? '1rem' : '1.5rem'};
  }
`;

const HeaderMetaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Desktop gap */
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.9);
  
  /* Transition/Hide logic */
  opacity: ${props => props.isScrolled ? '0' : '1'};
  height: ${props => props.isScrolled ? '0' : 'auto'};
  visibility: ${props => props.isScrolled ? 'hidden' : 'visible'};
  transform: ${props => props.isScrolled ? 'translateY(-10px)' : 'translateY(0)'};
  transition: all 0.3s ease;

  /* --- MOBILE OPTIMIZATIONS --- */
  @media (max-width: 576px) {
    gap: 6px; /* Tighter gap */
    margin-top: 2px;
    max-width: 100%; /* Ensure it fits in container */
    overflow: hidden; /* Cut off if too long */
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center; /* Ensures Icon and Text are vertically centered */
  gap: 5px;            /* Space between Icon and Text */
  
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap; /* Prevents text like "5 Days" from breaking */
  
  svg {
    width: 14px;
    height: 14px;
    opacity: 0.8;
    display: block; /* Removes SVG hidden line-height issues */
  }

  @media (max-width: 576px) {
    font-size: 0.75rem; /* Smaller text for mobile */
    gap: 4px; /* Tighter icon gap */
    
    /* Optional: If location is very long, truncate it with "..." */
    &:first-child {
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const MetaSeparator = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  display: flex;      /* Helps with vertical alignment */
  align-items: center; 
  height: 100%;
  padding-bottom: 2px; /* Micro-adjustment to lift the dot to center */

  @media (max-width: 576px) {
    font-size: 0.6rem; /* Smaller dot on mobile */
  }
`;

// Base Button Styles
const BaseBtn = styled.button`
  /* --- Structural Fixes --- */
  width: 40px;
  height: 40px;
  min-width: 40px; /* distinct fix: prevents width from collapsing */
  flex-shrink: 0;  /* distinct fix: prevents flexbox from squishing it */
  padding: 0;      /* distinct fix: removes default button padding */
  border-radius: 50%;
  
  /* --- Visual Styles --- */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    min-width: 36px; /* Ensure min-width matches on mobile */
    font-size: 1rem;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const BackBtn = styled(BaseBtn)``;

const ActionBtn = styled(BaseBtn)``;

// --- COMPONENT ---

const Header = ({ 
  navScrolled, 
  trekTitle, 
  trekLocation, 
  trekDays, 
  trekAltitude 
}) => {
  const navigate = useNavigate();

  return (
    <ModernHeader isScrolled={navScrolled}>
      <HeaderInner>
        <HeaderLeft>
          <BackBtn isScrolled={navScrolled} onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft />
          </BackBtn>
          
          <HeaderTitleContainer>
            <HeaderTrekTitle isScrolled={navScrolled}>
              {trekTitle}
            </HeaderTrekTitle>
            
            {/* Metadata Section: Hides on scroll */}
            <HeaderMetaWrapper isScrolled={navScrolled}>
              <MetaItem>
                <FiMapPin /> {trekLocation}
              </MetaItem>
              <MetaSeparator>•</MetaSeparator>
              <MetaItem>
                <FiClock /> {trekDays}
              </MetaItem>
              <MetaSeparator>•</MetaSeparator>
              <MetaItem>
                <FiActivity /> {trekAltitude}
              </MetaItem>
            </HeaderMetaWrapper>
          </HeaderTitleContainer>
        </HeaderLeft>

        <HeaderRight>
          <ActionBtn isScrolled={navScrolled} aria-label="Share">
            <FiShare2 />
          </ActionBtn>
          <ActionBtn isScrolled={navScrolled} aria-label="Save">
            <FiHeart />
          </ActionBtn>
        </HeaderRight>
      </HeaderInner>
    </ModernHeader>
  );
};

export default Header;