import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
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
const slideInFromTop = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;
const scaleIn = keyframes`
  from { transform: scale(0.95); }
  to { transform: scale(1); }
`;

// --- Styled components ---
const SearchTapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  min-height: 54px;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
  padding: 0 20px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  animation: ${pulse} 2.5s infinite;
  position: relative;
  border: 1.5px solid #e6e6e6;
  &:hover {
    box-shadow: 0 6px 32px 0 rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.02);
  }
`;
const SearchIcon = styled(FiSearch)`
  font-size: 1.5rem;
  color: #2d3748;
  margin-right: 14px;
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
const SearchDialog = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: auto;
  max-height: 320px;
  background: rgba(255,255,255,0.98);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 24px;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transform: translateY(${props => props.isOpen ? '0' : '-100%'});
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border-bottom: 1px solid rgba(0,0,0,0.08);
`;

const DialogContent = styled.div`
  width: 100%;
  max-width: 780px;
  position: relative;
  animation: ${scaleIn} 0.25s ease-out;
  padding: 0 24px;
`;
const SearchForm = styled.form`
  width: 100%;
  margin-bottom: 22px;
`;
const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #cbd5e0;
    box-shadow: 0 0 0 3px rgba(66,153,225,0.15);
  }
`;
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 60px;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #2d3748;
  font-family: inherit;
  &:focus { outline: none; }
  &::placeholder { 
    color: #a0aec0; 
    font-weight: 400;
  }
`;
const SearchInputIcon = styled(FiSearch)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 1.25rem;
`;
const SearchButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  height: 40px;
  padding: 0 16px;
  border-radius: 6px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover { 
    transform: translateY(-50%) scale(1.02);
    box-shadow: 0 2px 8px rgba(66,153,225,0.3);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.98);
  }
`;
const CloseButton = styled.button`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: rgba(0,0,0,0.7);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  color: white;
  transition: all 0.2s ease;
  
  &:hover { 
    background: #000;
    transform: translateX(-50%) scale(1.05);
  }
  
  &:active {
    transform: translateX(-50%) scale(0.95);
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
  }
`;
const CancelButton = styled.button`
  position: absolute;
  top: 0;
  right: 24px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #718096;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  
  &:hover {
    color: #2d3748;
    background: rgba(0,0,0,0.05);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;
const SearchHint = styled.div`
  color: #718096;
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 0;
`;
const RecentSearchesWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 20px;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 10px;
    height: 1px;
    background: #e2e8f0;
  }
`;
const RecentLabel = styled.div`
  display: inline-block;
  background: white;
  padding: 0 10px;
  font-size: 0.85rem;
  color: #718096;
  position: relative;
  top: 0;
  left: 12px;
`;
const RecentSearches = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
`;
const RecentSearchItem = styled.button`
  padding: 6px 14px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #4a5568;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:before {
    content: '${props => props.icon || "🔍"}';
    margin-right: 6px;
    font-size: 0.85rem;
  }
  
  &:hover {
    background: #edf2f7;
    color: #2d3748;
    transform: translateY(-1px);
  }
`;
const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 10px 20px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #edf2f7;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  & svg {
    margin-right: 8px;
    font-size: 1.1rem;
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

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1999;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
`;

const AnimatedSearchTapBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearchQuery } = useSearch();

  // Fix: Define recentSearches array
  const recentSearches = [
    'Mountain Treks',
    'Himalayan Adventures',
    'Beginner Friendly',
    'Weekend Getaways'
  ];

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
        <ArrowIndicator>→</ArrowIndicator>
      </SearchTapContainer>
      <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <SearchDialog isOpen={isOpen}>
        <DialogContent>
          <CancelButton 
            onClick={() => setIsOpen(false)}
            aria-label="Cancel search"
          >
            Cancel
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
              />
              <SearchButton type="submit">
                Search
              </SearchButton>
            </SearchInputWrapper>
            <SearchHint>Try searching for trek names, locations, difficulty levels, or duration</SearchHint>
          </SearchForm>
          
          {recentSearches.length > 0 && (
            <RecentSearchesWrapper>
              <RecentLabel>Recent Searches</RecentLabel>
              <RecentSearches>
                {recentSearches.map((term, idx) => {
                  const icons = ['🏔️', '🥾', '🗻', '🏕️'];
                  return (
                    <RecentSearchItem
                      key={idx}
                      icon={icons[idx % icons.length]}
                      onClick={() => handleRecentSearchClick(term)}
                    >
                      {term}
                    </RecentSearchItem>
                  );
                })}
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