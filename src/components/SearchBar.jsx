import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const SearchContainer = styled.div`
  position: relative;
  width: ${props => props.expanded ? '300px' : '50px'};
  height: 50px;
  transition: all 0.3s ease;
  border-radius: ${props => props.expanded ? '25px' : '50%'};
  overflow: hidden;
  background: ${props => props.expanded ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 100;

  @media (max-width: 768px) {
    width: ${props => props.expanded ? '250px' : '45px'};
    height: 45px;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.expanded ? '85%' : '40px'};
    height: 40px;
    margin: ${props => props.expanded ? '0 auto' : '0'};
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0 15px;
  outline: none;
  font-size: 1rem;
  color: #333;
  font-family: 'Poppins', sans-serif;
  
  &::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  width: ${props => props.expanded ? '50px' : '100%'};
  height: ${props => props.expanded ? '50px' : '100%'};
  border: none;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #333;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    color: #5390D9;
  }

  @media (max-width: 768px) {
    width: ${props => props.expanded ? '45px' : '100%'};
    height: ${props => props.expanded ? '45px' : '100%'};
  }
  
  @media (max-width: 480px) {
    width: ${props => props.expanded ? '40px' : '100%'};
    height: ${props => props.expanded ? '40px' : '100%'};
    
  }
`;

const ClearButton = styled.button`
  width: 40px;
  height: 100%;
  border: none;
  background: transparent;
  display: ${props => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #999;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #333;
  }
`;

const SearchBar = ({ onSearch, className }) => {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearchQuery } = useSearch();
  
  // Handle click outside to collapse search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) && expanded && inputValue === '') {
        setExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, inputValue]);
  
  // Focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);
    const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      updateSearchQuery(inputValue);
      navigate('/search-results');
    }
  };
  
  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    } else if (inputValue.trim()) {
      handleSubmit({ preventDefault: () => {} });
    }
  };
  
  const handleClear = () => {
    setInputValue('');
    updateSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <SearchContainer expanded={expanded} className={className} ref={inputRef}>
      <SearchForm onSubmit={handleSubmit}>
        {expanded && (
          <SearchInput
            placeholder="Search for treks..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        <SearchButton 
          type={expanded ? "submit" : "button"}
          onClick={handleExpand}
          expanded={expanded}
          aria-label="Search"
        >
          <FiSearch />
        </SearchButton>
        {expanded && (
          <ClearButton 
            type="button"
            onClick={handleClear}
            visible={inputValue !== ''}
            aria-label="Clear search"
          >
            <FiX />
          </ClearButton>
        )}
      </SearchForm>
    </SearchContainer>
  );
};

export default SearchBar;
