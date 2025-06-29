import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

// --- Animation keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(20px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// --- Styled components ---
const SearchTapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  min-height: 64px;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${float} 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: ${shimmer} 3s infinite;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px -5px rgba(0, 0, 0, 0.15),
      0 16px 20px -6px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    .search-icon {
      color: white;
      transform: rotate(90deg);
    }
    
    .search-text {
      color: white;
    }
    
    .arrow-icon {
      color: white;
      transform: translateX(8px);
    }
  }
  
  &:active {
    transform: translateY(-4px) scale(0.98);
  }
  
  @media (max-width: 768px) {
    max-width: 320px;
    min-height: 56px;
    padding: 0 20px;
    border-radius: 28px;
  }
  
  @media (max-width: 480px) {
    max-width: 280px;
    min-height: 52px;
    padding: 0 18px;
    border-radius: 26px;
  }
`;

const SearchIcon = styled(FiSearch)`
  font-size: 1.5rem;
  color: #6b46c1;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  margin: 0 16px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    margin: 0 12px;
  }
`;

const AnimatedTextBase = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.025em;
  transition: color 0.4s ease;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const FadeInText = styled(AnimatedTextBase)`
  animation: ${fadeIn} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const FadeOutText = styled(AnimatedTextBase)`
  animation: ${fadeOut} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const ArrowIcon = styled(FiArrowRight)`
  font-size: 1.2rem;
  color: #6b46c1;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  @media (max-width: 480px) {
    display: none;
  }
`;

// --- Main component ---
const PHRASES = [
  'Search adventures...',
  'Find your next trek...',
  'Discover destinations...',
  'Explore new trails...',
  'Plan your journey...'
];

const AnimatedSearchTapBar = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  // Phrase animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIdx((idx) => (idx + 1) % PHRASES.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchBarClick = () => {
    navigate('/search-results');
  };

  // --- Render ---
  return (
    <>
      <SearchTapContainer
        onClick={handleSearchBarClick}
        aria-label="Go to Search Page"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSearchBarClick();
          }
        }}
      >
        <SearchIcon className="search-icon" />
        <TextContainer>
          {fade ? (
            <FadeInText className="search-text">{PHRASES[phraseIdx]}</FadeInText>
          ) : (
            <FadeOutText className="search-text">{PHRASES[phraseIdx]}</FadeOutText>
          )}
        </TextContainer>
        <ArrowIcon className="arrow-icon" />
      </SearchTapContainer>
    </>
  );
};

export default AnimatedSearchTapBar;