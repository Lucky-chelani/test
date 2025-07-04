import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { FiSearch, FiX, FiFilter, FiMapPin, FiClock, FiUsers, FiHeart, 
  FiChevronRight, FiStar, FiArrowLeft, FiGrid, FiList, FiSliders, 
  FiCalendar, FiCheckCircle, FiShare2, FiMap, FiCompass, FiBookmark,
  FiRefreshCw, FiPlusCircle, FiInfo } from 'react-icons/fi';
import { FaMountain, FaSnowflake, FaSun, FaLeaf, FaCloudRain, FaRoute, 
  FaMedal, FaRegHeart, FaHeart } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getValidImageUrl } from '../utils/images';
import { useSearch } from '../context/SearchContext';
import Footer from '../components/Footer';

// Global font import for Inter font
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;

// Modern animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Main container with dark theme background to match website
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #080808;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(83, 144, 217, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
`;

// Header with search and filters - Updated for dark theme
const SearchHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(13, 15, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #8b5cf6;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 92, 246, 0.1);
    transform: translateX(-2px);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(-2px);
  }
`;

const SearchInputContainer = styled.div`
  flex: 1;
  position: relative;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 16px;
  color: white;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b5cf6;
  font-size: 18px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid ${props => props.active ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'};
  border-radius: 25px;
  background: ${props => props.active ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'white' : '#8b5cf6'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? '#7c3aed' : 'rgba(139, 92, 246, 0.1)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 12px 16px;
  border: none;
  background: ${props => props.active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#8b5cf6'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#7c3aed' : 'rgba(139, 92, 246, 0.1)'};
  }
`;

// Main content area
const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

const ResultsInfo = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 500;
  
  span {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }
`;

const SortDropdown = styled.select`
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.4);
  }
  
  option {
    background: #0d0f14;
    color: white;
  }
`;

// Grid and List layouts
const TreksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TreksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

// Trek card components - Updated to match FeaturedTreks design
const TrekCard = styled.div`
  background: #0d0f14;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  }
`;

const TrekImage = styled.div`
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.6s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }
  
  ${TrekCard}:hover & {
    transform: scale(1.05);
  }
`;

const TrekBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(124, 58, 237, 0.9);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  z-index: 10;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const TrekContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const TrekTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.2;
`;

const TrekLocation = styled.p`
  color: #a1a1aa;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 400;
`;

const TrekMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const TrekDetails = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
  color: #a1a1aa;
  flex-wrap: wrap;
`;

const TrekDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
  
  svg {
    color: #64B5F6;
    font-size: 1.1rem;
  }
`;

const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e4e4e7;
  font-size: 13px;
  font-weight: 500;
  
  svg {
    color: #fbbf24;
    font-size: 14px;
  }
  
  .reviews {
    color: #a1a1aa;
    font-weight: 400;
    font-size: 12px;
    margin-left: 2px;
  }
`;

const TrekPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  
  .currency {
    font-size: 14px;
    font-weight: 400;
    margin-right: 1px;
  }
  
  .unit {
    font-size: 12px;
    color: #a1a1aa;
    margin-left: 2px;
    font-weight: 400;
  }
`;

const TrekDescription = styled.p`
  color: #a1a1aa;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TrekFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;

const ViewTrekButton = styled.button`
  flex: 1;
  height: 38px;
  padding: 0 18px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #8b5cf6;
    transform: translateY(-2px);
  }
`;

const FavoriteButton = styled.button`
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: scale(1.1);
  }
  
  svg {
    font-size: 16px;
  }
`;

// List view components - Updated to match FeaturedTreks design
const TrekListItem = styled.div`
  background: #0d0f14;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  display: flex;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${slideIn} 0.6s ease forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ListTrekImage = styled.div`
  width: 200px;
  height: 150px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  transition: transform 0.6s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }
  
  ${TrekListItem}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ListTrekContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ListTrekHeader = styled.div`
  margin-bottom: 15px;
`;

const ListTrekFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

// Loading and empty states
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: white;
  font-size: 18px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: white;
  
  h2 {
    font-size: 32px;
    margin-bottom: 16px;
    font-weight: 700;
  }
  
  p {
    font-size: 18px;
    margin-bottom: 30px;
    opacity: 0.8;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 80px;
  margin-bottom: 30px;
  opacity: 0.6;
  animation: ${float} 3s ease-in-out infinite;
`;

const RetryButton = styled.button`
  padding: 15px 30px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #7c3aed;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
  }
`;

// Quick filters
const QuickFilters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding: 5px 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const QuickFilter = styled.button`
  padding: 8px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

// Main component
const SearchResultsPage = () => {
  const { searchQuery, searchTreks } = useSearch();
  const navigate = useNavigate();
  
  const [allTreks, setAllTreks] = useState([]);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    difficulty: '',
    priceRange: '',
    duration: '',
    season: ''
  });
  
  // Fetch all treks on component mount
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        const treksCollection = collection(db, 'treks');
        const snapshot = await getDocs(treksCollection);
        
        const treksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAllTreks(treksData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching treks:', err);
        setError('Failed to load treks. Please try again.');
        setLoading(false);
      }
    };
    
    fetchTreks();
  }, []);
  
  // Filter and search treks
  useEffect(() => {
    let results = allTreks;
    
    // Apply search query
    if (searchInput.trim()) {
      results = searchTreks(results, searchInput);
    }
    
    // Apply filters
    if (filters.difficulty) {
      results = results.filter(trek => 
        trek.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }
    
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number);
      results = results.filter(trek => {
        const days = Number(trek.days) || 0;
        return days >= min && days <= max;
      });
    }
    
    if (filters.season) {
      results = results.filter(trek => 
        trek.season?.toLowerCase().includes(filters.season.toLowerCase())
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'price-high':
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case 'rating':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'duration':
          return (Number(a.days) || 0) - (Number(b.days) || 0);
        default:
          return 0;
      }
    });
    
    setFilteredTreks(results);
  }, [allTreks, searchInput, filters, sortBy, searchTreks]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search happens automatically via useEffect
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };
  
  const handleTrekClick = (trek) => {
    navigate(`/trek/${trek.id}`);
  };
  
  const getSeasonIcon = (season) => {
    if (!season) return <FaLeaf />;
    const s = season.toLowerCase();
    if (s.includes('winter') || s.includes('dec') || s.includes('jan') || s.includes('feb')) return <FaSnowflake />;
    if (s.includes('summer') || s.includes('jun') || s.includes('jul') || s.includes('aug')) return <FaSun />;
    if (s.includes('monsoon') || s.includes('rain')) return <FaCloudRain />;
    return <FaLeaf />;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Searching for amazing treks...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState>
          <EmptyStateIcon>⚠️</EmptyStateIcon>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <RetryButton onClick={() => window.location.reload()}>
            Try Again
          </RetryButton>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <>
      <GlobalFonts />
      <PageContainer>
      <SearchHeader>
        <HeaderContent>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Back
          </BackButton>
          
          <SearchInputContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search treks, locations, difficulty..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </SearchInputContainer>
          
          <FiltersContainer>
            <FilterButton
              active={filters.difficulty === 'easy'}
              onClick={() => handleFilterChange('difficulty', 'easy')}
            >
              Easy
            </FilterButton>
            <FilterButton
              active={filters.difficulty === 'moderate'}
              onClick={() => handleFilterChange('difficulty', 'moderate')}
            >
              Moderate
            </FilterButton>
            <FilterButton
              active={filters.difficulty === 'hard'}
              onClick={() => handleFilterChange('difficulty', 'hard')}
            >
              Hard
            </FilterButton>
            
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </ViewButton>
            </ViewToggle>
          </FiltersContainer>
        </HeaderContent>
      </SearchHeader>
      
      <ContentContainer>
        <ResultsHeader>
          <ResultsInfo>
            {filteredTreks.length} trek{filteredTreks.length !== 1 ? 's' : ''} found
            {searchInput && <span> for "{searchInput}"</span>}
          </ResultsInfo>
          
          <SortDropdown value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Sort by Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="duration">Duration</option>
          </SortDropdown>
        </ResultsHeader>
        
        <QuickFilters>
          <QuickFilter
            active={filters.duration === '1-3'}
            onClick={() => handleFilterChange('duration', '1-3')}
          >
            1-3 Days
          </QuickFilter>
          <QuickFilter
            active={filters.duration === '4-7'}
            onClick={() => handleFilterChange('duration', '4-7')}
          >
            4-7 Days
          </QuickFilter>
          <QuickFilter
            active={filters.duration === '8-14'}
            onClick={() => handleFilterChange('duration', '8-14')}
          >
            8-14 Days
          </QuickFilter>
          <QuickFilter
            active={filters.season === 'summer'}
            onClick={() => handleFilterChange('season', 'summer')}
          >
            Summer
          </QuickFilter>
          <QuickFilter
            active={filters.season === 'winter'}
            onClick={() => handleFilterChange('season', 'winter')}
          >
            Winter
          </QuickFilter>
        </QuickFilters>
        
        {filteredTreks.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>🏔️</EmptyStateIcon>
            <h2>No treks found</h2>
            <p>
              {searchInput 
                ? `We couldn't find any treks matching "${searchInput}". Try adjusting your search terms or filters.`
                : 'No treks match your current filters. Try removing some filters to see more results.'
              }
            </p>
            <RetryButton onClick={() => {
              setSearchInput('');
              setFilters({
                difficulty: '',
                priceRange: '',
                duration: '',
                season: ''
              });
            }}>
              Clear Filters
            </RetryButton>
          </EmptyState>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <TreksGrid>
                {filteredTreks.map((trek, index) => (
                  <TrekCard
                    key={trek.id}
                    index={index}
                    onClick={() => handleTrekClick(trek)}
                  >
                    <TrekImage src={getValidImageUrl(trek.image)}>
                      <TrekBadge>
                        {trek.difficulty || 'Moderate'}
                      </TrekBadge>
                    </TrekImage>
                    
                    <TrekContent>
                      <TrekTitle>{trek.title}</TrekTitle>
                      <TrekLocation>
                        <FiMapPin />
                        {trek.location}, {trek.country || 'India'}
                      </TrekLocation>
                      
                      <TrekMeta>
                        <TrekDetails>
                          <TrekDetail>
                            <FiClock />
                            {trek.days || 1} days
                          </TrekDetail>
                          <TrekDetail>
                            <FiUsers />
                            {trek.capacity || '8-12'}
                          </TrekDetail>
                          <TrekDetail>
                            {getSeasonIcon(trek.season)}
                            {trek.season || 'All seasons'}
                          </TrekDetail>
                        </TrekDetails>
                        
                        {trek.rating && (
                          <TrekRating>
                            <FiStar />
                            {trek.rating}
                            <span className="reviews">({trek.reviews || 0})</span>
                          </TrekRating>
                        )}
                      </TrekMeta>
                      
                      <TrekPrice>
                        <span className="currency">₹</span>
                        {typeof trek.price === 'string' ? trek.price.replace('₹', '') : trek.price || '0'}
                        <span className="unit">/person</span>
                      </TrekPrice>
                      
                      <TrekDescription>
                        {trek.description || 'Experience this amazing trek with breathtaking views and unforgettable memories.'}
                      </TrekDescription>
                      
                      <TrekFooter>
                        <ViewTrekButton>
                          View Details
                        </ViewTrekButton>
                        <FavoriteButton>
                          <FiHeart />
                        </FavoriteButton>
                      </TrekFooter>
                    </TrekContent>
                  </TrekCard>
                ))}
              </TreksGrid>
            ) : (
              <TreksList>
                {filteredTreks.map((trek, index) => (
                  <TrekListItem
                    key={trek.id}
                    index={index}
                    onClick={() => handleTrekClick(trek)}
                  >
                    <ListTrekImage src={getValidImageUrl(trek.image)}>
                      <TrekBadge>
                        {trek.difficulty || 'Moderate'}
                      </TrekBadge>
                    </ListTrekImage>
                    
                    <ListTrekContent>
                      <ListTrekHeader>
                        <TrekTitle>{trek.title}</TrekTitle>
                        <TrekLocation>
                          <FiMapPin />
                          {trek.location}, {trek.country || 'India'}
                        </TrekLocation>
                      </ListTrekHeader>
                      
                      <TrekDescription>
                        {trek.description || 'Experience this amazing trek with breathtaking views and unforgettable memories.'}
                      </TrekDescription>
                      
                      <ListTrekFooter>
                        <TrekDetails>
                          <TrekDetail>
                            <FiClock />
                            {trek.days || 1} days
                          </TrekDetail>
                          <TrekDetail>
                            <FiUsers />
                            {trek.capacity || '8-12'}
                          </TrekDetail>
                          <TrekDetail>
                            {getSeasonIcon(trek.season)}
                            {trek.season || 'All seasons'}
                          </TrekDetail>
                          {trek.rating && (
                            <TrekRating>
                              <FiStar />
                              {trek.rating}
                              <span className="reviews">({trek.reviews || 0})</span>
                            </TrekRating>
                          )}
                        </TrekDetails>
                        
                        <TrekPrice>
                          <span className="currency">₹</span>
                          {typeof trek.price === 'string' ? trek.price.replace('₹', '') : trek.price || '0'}
                          <span className="unit">/person</span>
                        </TrekPrice>
                      </ListTrekFooter>
                    </ListTrekContent>
                  </TrekListItem>
                ))}
              </TreksList>
            )}
          </>
        )}
      </ContentContainer>
      
      <Footer />
    </PageContainer>
    </>
  );
};

export default SearchResultsPage;

