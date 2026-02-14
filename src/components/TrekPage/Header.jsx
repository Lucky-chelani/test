import React, { useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
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
  background: ${props => props.isScrolled 
    ? 'rgba(15, 15, 18, 0.98)' 
    : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(12px)' : 'none'};
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
  gap: 1.25rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 0.55rem;
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
  font-size: ${props => props.isScrolled ? '1.15rem' : '2.2rem'};
  font-weight: ${props => props.isScrolled ? '600' : '700'};
  line-height: 1.1;
  letter-spacing: -0.02em;
  transform-origin: left center;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: ${props => props.isScrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.3)'};

  @media (max-width: 768px) {
    font-size: ${props => props.isScrolled ? '1rem' : '1.5rem'};
  }
`;

const HeaderMetaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.9);
  opacity: ${props => props.isScrolled ? '0' : '1'};
  height: ${props => props.isScrolled ? '0' : 'auto'};
  visibility: ${props => props.isScrolled ? 'hidden' : 'visible'};
  transform: ${props => props.isScrolled ? 'translateY(-10px)' : 'translateY(0)'};
  transition: all 0.3s ease;

  @media (max-width: 576px) {
    gap: 6px;
    margin-top: 2px;
    max-width: 100%;
    overflow: hidden;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  
  svg {
    width: 14px;
    height: 14px;
    opacity: 0.8;
    display: block;
  }

  @media (max-width: 576px) {
    font-size: 0.75rem;
    gap: 4px;
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
  display: flex;
  align-items: center; 
  height: 100%;
  padding-bottom: 2px;

  @media (max-width: 576px) {
    font-size: 0.6rem;
  }
`;

// Base Button Styles
const BaseBtn = styled.button`
  width: 40px;
  height: 40px;
  min-width: 40px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 50%;
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
    min-width: 36px;
    font-size: 1rem;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const BackBtn = styled(BaseBtn)``;

// Modified ActionBtn to handle 'isActive' prop for the Heart button
const ActionBtn = styled(BaseBtn)`
  ${props => props.isActive && css`
    background: rgba(239, 68, 68, 0.2); /* Red tint background */
    border-color: #ef4444;
    color: #ef4444;

    /* Fills the heart icon */
    svg {
      fill: #ef4444; 
    }

    &:hover {
      background: rgba(239, 68, 68, 0.3);
      border-color: #ef4444;
    }
  `}
`;

// --- COMPONENT ---

const Header = ({ 
  navScrolled, 
  trekTitle, 
  trekLocation, 
  trekDays, 
  trekAltitude 
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // --- LOGIC FOR LIKE BUTTON ---
  const handleLike = () => {
    setIsLiked(!isLiked);
    // Optional: Add logic here to save to local storage or API
  };

  // --- LOGIC FOR SHARE BUTTON ---
  const handleShare = async () => {
    const shareData = {
      title: trekTitle,
      text: `Check out this trek: ${trekTitle} in ${trekLocation}`,
      url: window.location.href,
    };

    // Use Native Web Share API if supported (Mobile/Modern Browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled or failed", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link", err);
      }
    }
  };

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
          {/* Added onClick for Share */}
          <ActionBtn 
            isScrolled={navScrolled} 
            onClick={handleShare}
            aria-label="Share"
          >
            <FiShare2 />
          </ActionBtn>
          
          {/* Added onClick and isActive for Like */}
          <ActionBtn 
            isScrolled={navScrolled} 
            isActive={isLiked}
            onClick={handleLike}
            aria-label="Save"
          >
            <FiHeart />
          </ActionBtn>
        </HeaderRight>
      </HeaderInner>
    </ModernHeader>
  );
};

export default Header;