import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useSearch } from '../context/SearchContext';
import { FiSearch, FiX } from 'react-icons/fi';

// --- Animation keyframes ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10); }
  50% { box-shadow: 0 4px 32px 0 rgba(0,0,0,0.13); }
`;


// --- Styled components ---
const SearchTapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  min-height: 48px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
  padding: 0 18px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  animation: ${pulse} 2.5s infinite;
  position: relative;
  border: 1.5px solid #e6e6e6;
  z-index: 1; /* Ensure it stays below the dialog */
  &:hover {
    box-shadow: 0 6px 32px 0 rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.02);
  }
`;
const SearchIcon = styled(FiSearch)`
  font-size: 1.3rem;
  color: #2d3748;
  margin-right: 12px;
  flex-shrink: 0;
`;
const AnimatedTextBase = styled.span`
  font-size: 1.13rem;
  font-weight: 500;
  color: #2d3748;
  min-width: 180px;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
`;

const FadeInText = styled(AnimatedTextBase)`
  animation: ${fadeIn} 0.5s;
  opacity: 1;
`;

const FadeOutText = styled(AnimatedTextBase)`
  animation: ${fadeOut} 0.35s;
  opacity: 0;
`;
const ArrowIndicator = styled.span`
  margin-left: 14px;
  color: #b5b5b5;
  font-size: 1.2rem;
  user-select: none;
  @media (max-width: 480px) { display: none; }
`;

// --- Dialog Styles ---
const slideUp = keyframes`
  from {
    transform: translateY(50px);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 80px 20px 20px;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;
  background: transparent;
  
  @media (max-width: 768px) {
    padding-top: 70px;
  }
  @media (max-width: 480px) {
    padding-top: 60px;
  }
`;

const DialogContent = styled.div`
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: ${slideUp} 0.4s ease-out;
  position: relative;
  transform-origin: top center;
  backdrop-filter: blur(5px);
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
  margin-bottom: 22px;
`;
const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 56px;
  border-radius: 16px;
  background: #f5f7fa;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  overflow: hidden;
  &:focus-within {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66,153,225,0.15);
    background: white;
  }
  @media (max-width: 768px) {
    height: 52px;
    border-radius: 14px;
  }
  @media (max-width: 480px) {
    height: 48px;
    border-radius: 12px;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 60px 0 45px;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: #222;
  font-family: 'Inter', 'Poppins', sans-serif;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #b0b0b0;
    font-size: 1rem;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 55px 0 42px;
  }
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 0 50px 0 38px;
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #4299e1;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: white;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &:hover, &:active {
    background: #3182ce;
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  }
  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
    border-radius: 10px;
  }
  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
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
  background: #4299e1;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  color: white;
  transition: all 0.2s ease;
  z-index: 2001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  &:hover, &:active {
    background: #3182ce;
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
const RecentSearches = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;
const RecentSearchItem = styled.button`
  padding: 8px 16px 8px 14px;
  background: #f5f7fa;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #222;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  &:hover, &:active {
    background: #e2e8f0;
    color: #3182ce;
    border-color: #bcd0ea;
  }
`;
const RemoveIcon = styled(FiX)`
  margin-left: 6px;
  font-size: 1.1em;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #e53e3e;
  }
`;

// --- Main component ---
const PHRASES = [
  'Explore Adventures',
  'Find Your Trek',
  'Search Destinations',
  'Discover Trails',
  'Plan Your Journey'
];

// Removed overlay component

const SearchInputIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1.2rem;
  pointer-events: none;
  @media (max-width: 480px) {
    font-size: 1rem;
    left: 14px;
  }
`;

const SearchHint = styled.div`
  font-size: 0.85rem;
  color: #718096;
  margin-top: 8px;
  padding-left: 2px;
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const RecentSearchesWrapper = styled.div`
  margin-top: 16px;
  width: 100%;
`;

const RecentLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 10px 20px;
  border-radius: 10px;
  background: #f5f7fa;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
  &:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  &:active {
    transform: translateY(0px);
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 8px 16px;
  }
`;

const CancelButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f2f2f2;
  border: none;
  color: #4a5568;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    background: #e2e8f0;
    transform: scale(1.05);
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
    width: 24px;
    height: 24px;
    top: 16px;
    right: 16px;
  }
`;

const AnimatedSearchTapBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [recentSearches, setRecentSearches] = useState([
    'Mountain Treks',
    'Himalayan Adventures',
    'Beginner Friendly',
    'Weekend Getaways'
  ]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearchQuery } = useSearch();

  // Phrase animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIdx((idx) => (idx + 1) % PHRASES.length);
        setFade(true);
      }, 350);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 250);
    }
    const handleEscape = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleSearchDialog = () => setIsOpen(!isOpen);
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
  };  const handleRemoveRecent = (e, term) => {
    e.stopPropagation(); // Prevent triggering the parent button's onClick
    setRecentSearches(recentSearches.filter(t => t !== term));
  };
  // --- Render ---
  return (
    <>
      <SearchTapContainer
        onClick={toggleSearchDialog}
        aria-label="Open Search"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSearchDialog(); }}
      >        <SearchIcon />
        {fade ? (
          <FadeInText>{PHRASES[phraseIdx]}</FadeInText>
        ) : (
          <FadeOutText>{PHRASES[phraseIdx]}</FadeOutText>
        )}
        <ArrowIndicator>→</ArrowIndicator>      </SearchTapContainer>      <SearchDialog isOpen={isOpen} onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}><CancelButton 
            onClick={() => setIsOpen(false)}
            aria-label="Cancel search"
          >
            <FiX size={16} />
          </CancelButton>
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInputWrapper>
              <SearchInputIcon />
              <SearchInput
                ref={inputRef}
                type="text"
                placeholder="Search for treks, adventures, locations..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
              />              <SearchButton type="submit" aria-label="Search">
                <FiSearch size={20} />
              </SearchButton>
            </SearchInputWrapper>
            <SearchHint>Try searching for trek names, locations, difficulty levels, or duration</SearchHint>
          </SearchForm>
          
          {recentSearches.length > 0 && (
            <RecentSearchesWrapper>
              <RecentLabel>Recent Searches</RecentLabel>
              <RecentSearches>                {recentSearches.map((term, idx) => (
                  <RecentSearchItem 
                    key={idx}
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    {term}
                    <RemoveIcon onClick={(e) => handleRemoveRecent(e, term)} />
                  </RecentSearchItem>
                ))}
              </RecentSearches>
            </RecentSearchesWrapper>
          )}
          
          <BackButton onClick={() => setIsOpen(false)}>
            <FiX /> Return Back
          </BackButton>
          
          <CloseButton onClick={() => setIsOpen(false)}>
            <FiX />
          </CloseButton>
        </DialogContent>
      </SearchDialog>
    </>
  );
};

export default AnimatedSearchTapBar;