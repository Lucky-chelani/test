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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 2000;
  transform: translateY(${props => props.isOpen ? '0' : '-100%'});
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }
`;

const DialogContent = styled.div`
  width: 100%;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40px 60px 50px;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 30px 40px 40px;
    min-height: 250px;
  }
  @media (max-width: 480px) {
    padding: 25px 20px 35px;
    min-height: 200px;
  }
`;
const SearchForm = styled.form`
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
`;
const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  &:focus-within {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 1);
    transform: scale(1.02);
  }
  @media (max-width: 768px) {
    height: 55px;
    border-radius: 28px;
  }
  @media (max-width: 480px) {
    height: 50px;
    border-radius: 25px;
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
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: 2px solid rgba(220, 38, 38, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: white;
  transition: all 0.3s ease;
  z-index: 2001;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  &:hover, &:active {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.1) rotate(90deg);
    border-color: rgba(185, 28, 28, 1);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    top: 16px;
    right: 16px;
  }
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    top: 12px;
    right: 12px;
    font-size: 1rem;
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
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const RecentLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  text-align: center;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  padding: 12px 24px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 8px;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    transform: translateY(0px);
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
`;

const CancelButton = styled.button`
  display: none;
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