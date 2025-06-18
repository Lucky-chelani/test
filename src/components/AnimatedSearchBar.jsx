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

const SearchDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 15vh;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;
`;

const DialogContent = styled.div`
  width: 100%;
  max-width: 700px;
  padding: 0 20px;
`;

const SearchForm = styled.form`
  width: 100%;
  margin-bottom: 30px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  border-radius: 35px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 10px 40px rgba(128, 255, 219, 0.3);
    border-color: rgba(128, 255, 219, 0.3);
  }
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 70px 0 30px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: white;
  font-family: 'Poppins', sans-serif;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0 60px 0 25px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(128, 255, 219, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(128, 255, 219, 0.3);
    transform: translateY(-50%) scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const SearchHint = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const RecentSearches = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const RecentSearchItem = styled.button`
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
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
              <SearchHint>Recent searches:</SearchHint>
              <RecentSearches>
                {recentSearches.map((term, idx) => (
                  <RecentSearchItem
                    key={idx}
                    onClick={() => handleRecentSearchClick(term)}
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
