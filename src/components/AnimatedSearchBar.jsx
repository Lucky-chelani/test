import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useSearch } from '../context/SearchContext';
import { FiSearch, FiX } from 'react-icons/fi';

// Animations
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(128, 255, 219, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(128, 255, 219, 0.4);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const barAnimation = keyframes`
  0% {
    height: 5px;
  }
  50% {
    height: 15px;
  }
  100% {
    height: 5px;
  }
`;

// Styled Components
const SearchIconContainer = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: 1000;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const SearchIcon = styled(FiSearch)`
  font-size: 1.5rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const VoiceBars = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props.visible ? 0.8 : 0};
  transition: opacity 0.3s ease;
`;

const Bar = styled.div`
  width: 3px;
  background: white;
  border-radius: 3px;
  animation: ${barAnimation} 0.5s infinite ease;
  animation-delay: ${props => props.delay}s;
`;

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const SearchDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transition: all 0.3s ease;
  padding: 20px;
`;

const DialogContent = styled.div`
  width: 100%;
  max-width: 500px;
  background: #151515;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideUp} 0.4s ease-out;
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 20px;
  }
`;

const SearchForm = styled.form`
  width: 100%;
  margin-bottom: 24px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 58px;
  border-radius: 18px;
  overflow: hidden;
  background: #222222;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 0 0 2px rgba(128, 255, 219, 0.3);
    border-color: rgba(128, 255, 219, 0.3);
  }
  
  @media (max-width: 768px) {
    height: 54px;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    height: 48px;
    border-radius: 14px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 60px 0 22px;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: white;
  font-family: 'Inter', 'Poppins', sans-serif;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 55px 0 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0 50px 0 16px;
    
    &::placeholder {
      font-size: 0.9rem;
    }
  }
`;

const SearchButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #10B981;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: white;
  transition: all 0.2s ease;
  
  &:hover, &:active {
    background: #059669;
    transform: translateY(-50%) scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    right: 8px;
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -15px;
  right: -15px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #333;
  border: 2px solid #151515;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  color: white;
  transition: all 0.2s ease;
  z-index: 2001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  
  &:hover, &:active {
    background: #444;
    transform: scale(1.1) rotate(90deg);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    top: -10px;
    right: -10px;
  }
`;

const SearchHint = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-bottom: 16px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
`;

const RecentSearches = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const popIn = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const RecentSearchItem = styled.button`
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${popIn} 0.3s ease forwards;
  animation-delay: calc(0.1s * var(--index, 0));
  opacity: 0;
  transform: scale(0.9);
  
  &:hover, &:active {
    background: linear-gradient(135deg, rgba(128, 255, 219, 0.15), rgba(76, 201, 240, 0.15));
    transform: translateY(-2px);
    border-color: rgba(128, 255, 219, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.8rem;
  }
`;

// Main component
const AnimatedSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearchQuery } = useSearch();
  
  // Sample recent searches - in a real app, these would come from localStorage or backend
  const recentSearches = [
    'Mountain Treks', 
    'Himalayan Adventures', 
    'Beginner Friendly', 
    'Weekend Getaways'
  ];
  
  useEffect(() => {
    // Focus input when dialog opens
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
    
    // Handle escape key to close dialog
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  const toggleSearchDialog = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      updateSearchQuery(searchValue.trim());
      navigate('/search-results');
      setIsOpen(false);
    }
  };
  
  const handleRecentSearchClick = (term) => {
    updateSearchQuery(term);
    navigate('/search-results');
    setIsOpen(false);
  };
  
  // Toggle animation when hovering over search icon
  const handleMouseEnter = () => {
    setIsAnimating(true);
  };
  
  const handleMouseLeave = () => {
    setIsAnimating(false);
  };
  
  return (
    <>
      <SearchIconContainer 
        onClick={toggleSearchDialog}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SearchIcon />
        <VoiceBars visible={isAnimating}>
          <Bar delay={0} />
          <Bar delay={0.1} />
          <Bar delay={0.2} />
          <Bar delay={0.3} />
          <Bar delay={0.2} />
        </VoiceBars>
      </SearchIconContainer>
      
      <SearchDialog isOpen={isOpen}>
        <CloseButton onClick={() => setIsOpen(false)}>
          <FiX />
        </CloseButton>
        
        <DialogContent>
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInputWrapper>
              <SearchInput
                ref={inputRef}
                type="text"
                placeholder="Search for treks, adventures, locations..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <SearchButton type="submit">
                <FiSearch />
              </SearchButton>
            </SearchInputWrapper>
          </SearchForm>
          
          <SearchHint>Try searching for trek names, locations, difficulty levels, or features</SearchHint>
          
          {recentSearches.length > 0 && (
            <>
              <SearchHint>Recent searches:</SearchHint>              <RecentSearches>
                {recentSearches.map((term, idx) => (
                  <RecentSearchItem
                    key={idx}
                    onClick={() => handleRecentSearchClick(term)}
                    style={{"--index": idx}}
                  >
                    {term}
                  </RecentSearchItem>
                ))}
              </RecentSearches>
            </>
          )}
        </DialogContent>
      </SearchDialog>
    </>
  );
};

export default AnimatedSearchBar;
