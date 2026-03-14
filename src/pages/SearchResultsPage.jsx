import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { FiSearch, FiMapPin, FiClock, FiUsers, FiHeart, 
  FiStar, FiArrowLeft, FiGrid, FiList, FiCheckCircle, FiUser, 
  FiShield, FiAward, FiTrendingUp, FiLock, FiX } from 'react-icons/fi';
import { FaSnowflake, FaSun, FaLeaf, FaCloudRain } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getValidImageUrl } from '../utils/images';
import { useSearch } from '../context/SearchContext';
import Footer from '../components/Footer';

import SearchBg from '../assets/images/SearchBackground.png';

const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

/* ========================================================================
   STYLED COMPONENTS - MOBILE OPTIMIZED & TRUST-FOCUSED
   ======================================================================== */

const PageContainer = styled.div`
  min-height: 100vh;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom, 
      rgba(13, 15, 20, 0.4) 0%,     
      rgba(13, 15, 20, 0.85) 40%,   
      rgba(13, 15, 20, 0.98) 100%   
    );
    z-index: 0;
    pointer-events: none;
  }
  
  > * { position: relative; z-index: 10; }
`;
const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e4e4e7;
  font-size: 13px;
  font-weight: 600;
  
  svg { color: #fbbf24; font-size: 14px; }
  .reviews { color: #a1a1aa; font-weight: 400; font-size: 12px; margin-left: 2px; }
`;

const HeroTitleArea = styled.div`
  text-align: center;
  padding-top: 60px;
  margin-bottom: 30px;
  padding-left: 20px;
  padding-right: 20px;

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
    text-shadow: 0 4px 15px rgba(0,0,0,0.5);
    
    @media (max-width: 768px) { font-size: 2.2rem; }
  }

  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    @media (max-width: 768px) { font-size: 1rem; }
  }
`;

const SearchHeader = styled.div`
  width: 100%;
  padding: 0 20px;
  margin-bottom: 30px;
  
  /* 📱 MOBILE FIX: Nice edge margins so it doesn't touch the screen sides */
  @media (max-width: 768px) {
    padding: 0 15px; 
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px; 
  width: 100%;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px; /* More rounded like iOS */
  padding: 12px 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
    gap: 15px;
    border-radius: 20px;
  }
`;

const SearchInputContainer = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px 14px 45px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2); 
  border-radius: 16px;
  font-size: 16px;
  color: white;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #8b5cf6;
    background: rgba(0, 0, 0, 0.4);
  }
  
  &::placeholder { color: rgba(255, 255, 255, 0.5); }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b5cf6;
  font-size: 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 14px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover { background: rgba(139, 92, 246, 0.2); border-color: #8b5cf6; }

  @media (max-width: 768px) { align-self: flex-start; }
`;

/* Trust-Based Filters */
const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid ${props => props.active ? '#8b5cf6' : 'rgba(255, 255, 255, 0.15)'};
  border-radius: 14px;
  background: ${props => props.active ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  color: ${props => props.active ? '#a78bfa' : '#e2e8f0'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.5);
  }
  
  svg { font-size: 16px; color: ${props => props.active ? '#a78bfa' : '#94a3b8'}; }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-left: auto;
  flex-shrink: 0;
  
  @media (max-width: 768px) { margin-left: 0; }
`;

const ViewButton = styled.button`
  padding: 10px 14px;
  border: none;
  background: ${props => props.active ? 'rgba(139, 92, 246, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#a78bfa' : '#94a3b8'};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  /* 📱 MOBILE FIX: Side padding added so cards don't touch edges */
  padding: 20px 20px 80px 20px; 
  min-height: calc(100vh - 200px);
  
  @media (max-width: 768px) { padding: 10px 15px 80px 15px; }
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ResultsInfo = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuickFilters = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: center;
  overflow-x: auto;
  padding: 5px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  
  @media (max-width: 900px) { width: 100%; justify-content: flex-start; }
`;

const QuickFilter = styled.button`
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  flex-shrink: 0; 
  
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const SortDropdown = styled.select`
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  
  &:focus { outline: none; border-color: #8b5cf6; }
  option { background: #0f172a; color: white; }
  
  @media (max-width: 768px) { width: 100%; }
`;

const TreksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) { gap: 20px; }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const TreksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const TrekCard = styled.div`
  background: rgba(15, 20, 30, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px; /* Gen Z squircle */
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${props => props.index * 0.05}s;
  opacity: 0;
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 20px 40px rgba(124, 58, 237, 0.25);
  }
`;

const TrekImage = styled.div`
  width: 100%;
  height: 220px; 
  background-color: #1e293b;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    /* Soft gradient pulling the dark theme into the image */
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15, 20, 30, 0.95) 100%);
    z-index: 1;
  }
`;

const TrustBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg { color: #facc15; }
`;

const TrekContent = styled.div`
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  z-index: 2;
  margin-top: -30px; /* Pulls content up into the image gradient */
`;

const TrekTitle = styled.h3`
  padding-top: 6px;
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.2;
  letter-spacing: -0.03em;
`;

const TrekLocation = styled.p`
  color: #94a3b8;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;

  .loc-text {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #e2e8f0;
  }

  .dynamic-tag {
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
  }
`;

const FavoriteButton = styled.button`
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  svg { font-size: 18px; }
`;

/* 🛡️ Trust Signal: Verified Organizer */
const TrekOrganizer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 14px 6px 6px;
  border-radius: 50px;
  margin-bottom: 16px;
  align-self: flex-start; /* Keeps pill tight */
  
  .avatar-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a855f7, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  .organizer-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
  .verified-badge { color: #10b981; font-size: 14px; }
`;

const TrekDetails = styled.div`
  display: flex; 
  /* Ensures they sit side-by-side */
  flex-direction: row; 
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const TrekDetail = styled.div`
  /* flex: 1 ensures all three take equal width in the row */
  flex: 1; 
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0; /* Prevents overflow */
  
  svg { 
    color: #a855f7; 
    font-size: 1rem; 
  }
  
  span { 
    font-size: 11px; 
    font-weight: 600; 
    color: #cbd5e1; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 480px) {
    padding: 6px 2px;
    span { font-size: 10px; }
  }
`;

const TrekListItem = styled.div`
  background: rgba(15, 20, 30, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease forwards;
  opacity: 0;
  color: white;
  display: flex;
  flex-direction: row; /* Horizontal layout for list */
  align-items: stretch;
  
  &:hover {
    transform: translateY(-6px);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 20px 40px rgba(124, 58, 237, 0.25);
  }
  
  @media (max-width: 768px) {
    flex-direction: column; /* Stacks on mobile */
  }
`;


const ListTrekImage = styled.div`
  width: 340px; /* Perfect width for desktop */
  background-color: #1e293b;
  /* 👈 THE FIX: Added quotes around the URL so it loads properly */
  background-image: linear-gradient(135deg, rgba(30, 41, 59, 0.2), rgba(15, 23, 42, 0.8)), url("${props => props.src}");
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  
  @media (max-width: 768px) { 
    width: 100%; 
    height: 240px; 
  }
`;

/* --- 4. Fix the Title Height and Spacing --- */
const ListTrekContent = styled.div`
  padding: 24px 30px; /* More breathing room */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers content beautifully next to the image */
`;


const SecureBookingTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  
  svg { font-size: 14px; }
`;

const TrekPrice = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;

  .label { 
    font-size: 10px; 
    color: #94a3b8; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
    font-weight: 700; 
    margin-bottom: 6px;
  }
  
  .amount-wrapper { 
    display: flex; 
    align-items: baseline; 
  }
  
  .currency { 
    font-size: 16px; 
    color: #a855f7; /* The bright purple from your screenshot */
    font-weight: 700; 
    margin-right: 2px;
  }
  
  .amount { 
    font-size: 24px; 
    font-weight: 800; 
    color: white; 
  }
  
  .slash {
    font-size: 16px;
    color: #64748b;
    margin: 0 2px 0 4px;
    font-weight: 400;
  }
  
  .unit { 
    font-size: 13px; 
    color: #64748b; 
    font-weight: 500; 
  }
`;

const TrekFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 15px;
`;

const ViewTrekButton = styled.button`
  padding: 0 16px;
  height: 44px;
  background: #8b5cf6; /* Solid purple match */
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  white-space: pre-line; /* Allows text to stack neatly if needed */
  text-align: center;
  line-height: 1.2;
  
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TrustRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 14px;
  margin-bottom: 16px;
  border: 1px dashed rgba(16, 185, 129, 0.2);

  .secure {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #10b981;
    font-size: 13px;
    font-weight: 700;
  }
`;

// Loading / Empty States
const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: white;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  
  h2 { font-size: 24px; margin-bottom: 12px; font-weight: 700; }
  p { font-size: 15px; color: #94a3b8; max-width: 400px; margin: 0 auto 24px; line-height: 1.5; }
`;


/* ========================================================================
   MAIN COMPONENT LOGIC
   ======================================================================== */

const SearchResultsPage = () => {
  const { searchQuery, searchTreks } = useSearch();
  const navigate = useNavigate();
  
  const [allTreks, setAllTreks] = useState([]);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  
  // 🛡️ Updated Filter State to match Trust Filters
  const [filters, setFilters] = useState({
    trustLevel: '', // 'top-rated', 'beginner', 'expert'
    duration: '',
    season: ''
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('trovia_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (e, trekId) => {
    e.stopPropagation(); // Prevents clicking the heart from opening the Trek Details page
    setFavorites(prev => {
      const isFavorited = prev.includes(trekId);
      const newFavs = isFavorited 
        ? prev.filter(id => id !== trekId) // Remove it
        : [...prev, trekId];               // Add it
      
      localStorage.setItem('trovia_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };
  
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, 'treks'));
        const treksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllTreks(treksData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchTreks();
  }, []);
  
  useEffect(() => {
    let results = allTreks;
    
    if (searchInput.trim()) results = searchTreks(results, searchInput);
    
    // 🛡️ Apply Trust/Quality Filters instead of generic difficulty
    if (filters.trustLevel === 'top-rated') {
      results = results.filter(trek => Number(trek.rating) >= 4.5);
    } else if (filters.trustLevel === 'beginner') {
      results = results.filter(trek => trek.difficulty?.toLowerCase() === 'easy');
    } else if (filters.trustLevel === 'expert') {
      results = results.filter(trek => ['hard', 'moderate'].includes(trek.difficulty?.toLowerCase()));
    }

    
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number);
      results = results.filter(trek => {
        const days = Number(trek.days) || 0;
        return days >= min && days <= max;
      });
    }
    
    if (filters.season) {
      results = results.filter(trek => trek.season?.toLowerCase().includes(filters.season.toLowerCase()));
    }
    
    const parsePrice = (price) => {
      if (!price) return 0;
      const num = Number(String(price).replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? 0 : num;
    };

    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return parsePrice(a.price) - parsePrice(b.price);
        case 'price-high': return parsePrice(b.price) - parsePrice(a.price);
        case 'rating': return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'duration': return (Number(a.days) || 0) - (Number(b.days) || 0);
        default: return 0;
      }
    });
    
    setFilteredTreks(results);
  }, [allTreks, searchInput, filters, sortBy, searchTreks]);
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };
  
  const getSeasonIcon = (season) => {
    if (!season) return <FaLeaf />;
    const s = season.toLowerCase();
    if (s.includes('winter') || s.includes('dec')) return <FaSnowflake />;
    if (s.includes('summer') || s.includes('jun')) return <FaSun />;
    if (s.includes('monsoon') || s.includes('rain')) return <FaCloudRain />;
    return <FaLeaf />;
  };

  return (
    <>
      <GlobalFonts />
      <PageContainer bgImage={SearchBg}>
        
        <HeroTitleArea>
          <h1>Find Your Next Adventure</h1>
          <p>Book secure, verified treks with expert organizers.</p>
        </HeroTitleArea>

        <SearchHeader>
          <HeaderContent>
            <BackButton onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back
            </BackButton>
            
            <SearchInputContainer>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Where do you want to go?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </SearchInputContainer>
            
            <FiltersContainer>
              {/* 🛡️ New Trust Filters */}
              <FilterButton active={filters.trustLevel === 'top-rated'} onClick={() => handleFilterChange('trustLevel', 'top-rated')}>
                <FiStar /> Top Rated
              </FilterButton>
              <FilterButton active={filters.trustLevel === 'beginner'} onClick={() => handleFilterChange('trustLevel', 'beginner')}>
                <FiShield /> Beginner Friendly
              </FilterButton>
              <FilterButton active={filters.trustLevel === 'expert'} onClick={() => handleFilterChange('trustLevel', 'expert')}>
                <FiAward /> Expert Led
              </FilterButton>
              
              <ViewToggle>
                <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')}><FiGrid /></ViewButton>
                <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')}><FiList /></ViewButton>
              </ViewToggle>
            </FiltersContainer>
          </HeaderContent>
        </SearchHeader>
        
        <ContentContainer>
          <ResultsHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <ResultsInfo>
              <FiTrendingUp style={{ color: '#10b981' }}/> {filteredTreks.length} premium treks found
            </ResultsInfo>
            
            {/* NEW FUNCTIONALITY: Only show if filters or search are active */}
            {(searchInput || filters.trustLevel || filters.duration || filters.season) && (
              <button 
                onClick={() => {
                  setSearchInput('');
                  setFilters({ trustLevel: '', duration: '', season: '' });
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FiX /> Clear Filters
              </button>
            )}
          </div>
            
            <QuickFilters>
              <QuickFilter active={filters.duration === '1-3'} onClick={() => handleFilterChange('duration', '1-3')}>Weekend (1-3 Days)</QuickFilter>
              <QuickFilter active={filters.duration === '4-7'} onClick={() => handleFilterChange('duration', '4-7')}>One Week (4-7 Days)</QuickFilter>
              <QuickFilter active={filters.season === 'summer'} onClick={() => handleFilterChange('season', 'summer')}>Summer Escapes</QuickFilter>
              <QuickFilter active={filters.season === 'winter'} onClick={() => handleFilterChange('season', 'winter')}>Winter Treks</QuickFilter>
            </QuickFilters>

            <SortDropdown value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="duration">Duration</option>
            </SortDropdown>
          </ResultsHeader>
          
          {filteredTreks.length === 0 && !loading ? (
            <EmptyState>
              <h2>No treks found</h2>
              <p>We couldn't find any treks matching your current filters. Try adjusting them to see more verified adventures.</p>
              <button onClick={() => setFilters({ trustLevel: '', duration: '', season: '' })} style={{ padding: '10px 20px', background: '#8b5cf6', color: 'white', borderRadius: '10px', border: 'none' }}>
                Clear Filters
              </button>
            </EmptyState>
          ) : (
            <>
              {viewMode === 'grid' ? (
                /* --- GRID VIEW --- */
                <TreksGrid>
                  {filteredTreks.map((trek, index) => (
                    <TrekCard key={trek.id} index={index} onClick={() => navigate(`/trek/${trek.id}`)}>
                      
                      <TrekImage src={getValidImageUrl(trek.image)}>
                        {trek.rating >= 4.5 && (
                          <TrustBadge><FiStar fill="#facc15" /> Guest Favorite</TrustBadge>
                        )}
                      </TrekImage>
                      
                      <TrekContent>
                        <TrekLocation>
                          <div className="loc-text"><FiMapPin /> {trek.location}, {trek.country || 'India'}</div>
                          <div className="dynamic-tag">Trending</div>
                        </TrekLocation>

                        <TrekTitle>{trek.title}</TrekTitle>
                        
                        {trek.organizerName && (
                          <TrekOrganizer>
                            <div className="avatar-circle"><FiUser /></div>
                            <span className="organizer-name">{trek.organizerName}</span>
                            {trek.organizerVerified && <FiCheckCircle className="verified-badge" />}
                          </TrekOrganizer>
                        )}
                        
                        <TrekDetails>
                          <TrekDetail>
                            <FiClock />
                            <span>{trek.days || 1} Days</span>
                          </TrekDetail>
                          <TrekDetail>
                            <FiAward />
                            <span>{trek.difficulty || 'Medium'}</span>
                          </TrekDetail>
                          <TrekDetail>
                            {getSeasonIcon(trek.season)}
                            <span>{trek.season || 'All seasons'}</span>
                          </TrekDetail>
                        </TrekDetails>
                        
                        <TrustRow>
                          <div className="secure">
                            <FiShield /> Secure Booking
                          </div>
                          {trek.rating && (
                            <TrekRating>
                              <FiStar fill="#facc15" /> {trek.rating} <span className="reviews">({trek.reviews || 0})</span>
                            </TrekRating>
                          )}
                        </TrustRow>
                        
                        <TrekFooter>
                          <TrekPrice>
                            <span className="label">TOTAL PRICE</span>
                            <div className="amount-wrapper">
                              <span className="currency">₹</span>
                              <span className="amount">
                                {typeof trek.price === 'string' ? trek.price.replace('₹', '') : trek.price || '0'}
                              </span>
                              <span className="slash">/</span>
                              <span className="unit">pax</span>
                            </div>
                          </TrekPrice>
                          
                          <ActionGroup>
                            <FavoriteButton 
                              onClick={(e) => toggleFavorite(e, trek.id)}
                              style={{ color: favorites.includes(trek.id) ? '#ef4444' : '#ffffff' }}
                            >
                              <FiHeart style={{ fill: favorites.includes(trek.id) ? '#ef4444' : 'transparent' }} />
                            </FavoriteButton>
                            <ViewTrekButton>View<br/>Details</ViewTrekButton>
                          </ActionGroup>
                        </TrekFooter>
                      </TrekContent>
                    </TrekCard>
                  ))}
                </TreksGrid>
              ) : (
                /* --- LIST VIEW --- */
                <TreksList>
                  {filteredTreks.map((trek, index) => (
                    <TrekListItem key={trek.id} index={index} onClick={() => navigate(`/trek/${trek.id}`)}>
                      
                      <ListTrekImage src={getValidImageUrl(trek.image)}>
                        {trek.rating >= 4.5 && (
                          <TrustBadge><FiStar fill="#facc15" /> Guest Favorite</TrustBadge>
                        )}
                      </ListTrekImage>
                      
                      <ListTrekContent>
                        <TrekLocation>
                          <div className="loc-text"><FiMapPin /> {trek.location}, {trek.country || 'India'}</div>
                          <div className="dynamic-tag">Trending</div>
                        </TrekLocation>
                        
                        <TrekTitle>{trek.title}</TrekTitle>
                        
                        {trek.organizerName && (
                          <TrekOrganizer>
                            <div className="avatar-circle"><FiUser /></div>
                            <span className="organizer-name">{trek.organizerName}</span>
                            {trek.organizerVerified && <FiCheckCircle className="verified-badge" />}
                          </TrekOrganizer>
                        )}
                        
                        <TrekDetails>
                          <TrekDetail>
                            <FiClock />
                            <span>{trek.days || 1} Days</span>
                          </TrekDetail>
                          <TrekDetail>
                            <FiAward />
                            <span>{trek.difficulty || 'Moderate'}</span>
                          </TrekDetail>
                          <TrekDetail>
                            {getSeasonIcon(trek.season)}
                            <span>{trek.season || 'All seasons'}</span>
                          </TrekDetail>
                        </TrekDetails>
                        
                        <TrustRow>
                          <div className="secure">
                            <FiShield /> Secure Booking
                          </div>
                          {trek.rating && (
                            <TrekRating>
                              <FiStar fill="#facc15" /> {trek.rating} <span className="reviews">({trek.reviews || 0})</span>
                            </TrekRating>
                          )}
                        </TrustRow>
                        
                        <TrekFooter>
                          <TrekPrice>
                            <span className="label">TOTAL PRICE</span>
                            <div className="amount-wrapper">
                              <span className="currency">₹</span>
                              <span className="amount">
                                {typeof trek.price === 'string' ? trek.price.replace('₹', '') : trek.price || '0'}
                              </span>
                              <span className="slash">/</span>
                              <span className="unit">pax</span>
                            </div>
                          </TrekPrice>
                          
                          <ActionGroup>
                            <FavoriteButton 
                              onClick={(e) => toggleFavorite(e, trek.id)}
                              style={{ color: favorites.includes(trek.id) ? '#ef4444' : '#ffffff' }}
                            >
                              <FiHeart style={{ fill: favorites.includes(trek.id) ? '#ef4444' : 'transparent' }} />
                            </FavoriteButton>
                            <ViewTrekButton>View<br/>Details</ViewTrekButton>
                          </ActionGroup>
                        </TrekFooter>
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