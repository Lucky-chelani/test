// filepath: c:\Users\DELL\Documents\Coders\test\src\components\Explore.js
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import trek1 from '../assets/images/trek1.png';
import Footer from './Footer';
import groupImg from '../assets/images/trek1.png';
import eventImg from '../assets/images/trek1.png';
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiUsers, FiInfo, FiTrendingUp, FiAward, FiSearch, FiX } from 'react-icons/fi';
import { FaMountain, FaStar } from 'react-icons/fa';
import { RiCommunityFill } from 'react-icons/ri';
import { MdEventAvailable } from 'react-icons/md';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useSearch } from '../context/SearchContext';

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Main Container Components
const ExploreSection = styled.section`
  position: relative;
  background: #080812;
  min-height: 100vh;
  color: #fff;
  padding: 100px 0 0 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 70px 0 0 0;
  }
`;

const MapPatternBackground = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1; 
  background: url(${mapPattern});
  background-size: 600px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 0;
  animation: ${breathe} 15s infinite ease-in-out;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, 
    rgba(10, 10, 40, 0.7) 0%, 
    rgba(0, 0, 0, 0.95) 100%);
  z-index: 1;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 24px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

// Title Components

// Search Components
const SearchBarContainer = styled.div`
  margin: 20px auto 40px auto;
  max-width: 600px;
  width: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 90%;
    margin: 10px auto 30px auto;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 5px 25px rgba(128, 255, 219, 0.3);
  }
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: 16px 60px 16px 25px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 14px 50px 14px 20px;
    font-size: 0.95rem;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(128, 255, 219, 0.3);
    color: white;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }
`;

const ClearButton = styled(SearchButton)`
  right: 60px;
  background: transparent;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 480px) {
    right: 50px;
  }
`;

const SearchResultsHeader = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding: 0 10px;
  font-style: italic;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;
const SectionTitleContainer = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 0.6rem;
  background: linear-gradient(to right, #fff 0%, #bbb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1024px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SectionUnderline = styled.div`
  width: 80px;
  height: 6px;
  background: linear-gradient(to right, #FFD2BF, #ffbfa3);
  border-radius: 6px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

// Slider Components
const SliderWrapper = styled.div`
  position: relative;
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 3rem;
  }
`;

const TreksSlider = styled.div`
  display: flex;
  gap: 30px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 30px 10px;
  margin: 0 -10px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  perspective: 1000px;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 25px 5px;
  }
  
  @media (max-width: 480px) {
    gap: 15px;
    padding: 20px 5px;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const LeftArrowButton = styled(ArrowButton)`
  left: -25px;
  
  @media (max-width: 768px) {
    left: -15px;
  }
  
  @media (max-width: 480px) {
    left: -10px;
  }
`;

const RightArrowButton = styled(ArrowButton)`
  right: -25px;
  
  @media (max-width: 768px) {
    right: -15px;
  }
  
  @media (max-width: 480px) {
    right: -10px;
  }
`;

// Card Components
// Clean and modern Trek Card
const TrekCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  min-width: 380px;
  flex: 0 0 380px;
  box-shadow: ${props => props.featured ? 
    '0 10px 30px rgba(255, 87, 34, 0.15)' : 
    '0 10px 30px rgba(0, 0, 0, 0.15)'};
  transition: all 0.3s ease;
  border: ${props => props.featured ? 
    '1px solid rgba(255, 87, 34, 0.1)' : 
    'none'};
  scroll-snap-align: start;
  position: relative;
  will-change: transform;
    @media (min-width: 769px) {
    &:hover {
      transform: translateY(-10px);
      box-shadow: ${props => props.featured ? 
        '0 15px 35px rgba(255, 87, 34, 0.2)' : 
        '0 15px 35px rgba(0, 0, 0, 0.2)'};
    }
  }
  
  ${props => props.featured && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #FF5722;
      z-index: 1;
    }
  `}
  
  @media (max-width: 1200px) {
    min-width: 340px;
    flex: 0 0 340px;
  }
  
  @media (max-width: 1000px) {
    min-width: 300px;
    flex: 0 0 300px;
  }
      
  @media (max-width: 768px) {
    min-width: 80%;
    flex: 0 0 80%;
  }
  
  @media (max-width: 480px) {
    min-width: 90%;
    flex: 0 0 90%;
  }

  @media (max-width: 1024px) {
    min-width: 360px;
    flex: 0 0 360px;
  }
  
  @media (max-width: 768px) {
    min-width: 300px;
    flex: 0 0 300px;
  }

  @media (max-width: 480px) {
    min-width: 85%;
    flex: 0 0 85%;
  }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    z-index: 2;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const TrekImage = styled.div`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
  filter: saturate(1.2) contrast(1.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.4) 70%
    );
    z-index: 1;
    pointer-events: none;
  }
  
  ${TrekCard}:hover & {
    transform: scale(1.1) rotate(-1deg);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  z-index: 1;
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  z-index: 2;
  max-width: 70%;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const PriceTag = styled.span`
  background: linear-gradient(135deg, #FFD700, #FFC107);
  color: #222;
  font-weight: 800;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 12px;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.9);
  color: #222;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  svg {
    color: #666;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
`;

const DifficultyTag = styled(Tag)`
  background: #FFD2BF;
  color: #222;
  
  svg {
    color: #d06830;
  }
`;

const GroupTag = styled(Tag)`
  background: #e0f7fa;
  color: #295a30;
  
  svg {
    color: #295a30;
  }
`;

const EventTag = styled(Tag)`
  background: #ffe0b2;
  color: #b26a00;
  
  svg {
    color: #b26a00;
  }
`;

const TrekInfo = styled.div`
  padding: 24px;
  background: white;
  color: #333;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const TrekLocation = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 1rem;
  margin-bottom: 14px;
  gap: 8px;
  
  svg {
    color: #2196F3;
    min-width: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
  
  svg {
    color: #2196F3;
    min-width: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 6px;
  }
`;

const Difficulty = styled.div`
  color: #666;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #2196F3;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
  
  svg {
    color: #FFC107;
    font-size: 1.1rem;
  }
  
  span {
    font-weight: 700;
    color: #333;
  }
  
  .reviews {
    color: #999;
    font-weight: 400;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
    
    svg {
      font-size: 1rem;
    }
    
    .reviews {
      font-size: 0.8rem;
    }
  }
`;

const ActionButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  width: 100%;
  text-decoration: none;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background: #45a049;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(76, 175, 80, 0.3);
    
    svg {
      transform: translateX(4px);
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(76, 175, 80, 0.2);
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 12px 20px;
  }
`;

const EventButton = styled(ActionButton)`
  background: #FF9800;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
  
  &:hover {
    background: #F57C00;
    box-shadow: 0 6px 15px rgba(255, 152, 0, 0.3);
    transform: translateY(-3px);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(255, 152, 0, 0.2);
  }
`;

const BadgeTag = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #00aeff, #0080ff);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 6px 14px;
  border-radius: 10px;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 128, 255, 0.3);
  
  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
`;

const ScrollIndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
`;

const ScrollIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#FFD2BF' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.2);
    background: ${props => props.active ? '#FFD2BF' : 'rgba(255, 255, 255, 0.4)'};
  }
`;

// Loading Placeholder Component
const LoadingCard = styled(TrekCard)`
  background: rgba(255, 255, 255, 0.05);
  min-height: 450px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0), 
      rgba(255, 255, 255, 0.1), 
      rgba(255, 255, 255, 0)
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
`;

// Error state for treks
const ErrorState = styled.div`
  padding: 20px;
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 12px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  width: 80%;
  max-width: 600px;
  margin: 0 auto 40px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  button {
    background: linear-gradient(135deg, #ff5252, #ff1744);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    margin-top: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #ff5252;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(255, 0, 0, 0.3);
    }
  }
`;

// Empty state component
const EmptyState = styled.div`
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  width: 80%;
  max-width: 600px;
  margin: 0 auto 40px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  button {
    background: linear-gradient(135deg, #FFD2BF 0%, #ffbfa3 100%);
    color: #333;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(255, 210, 191, 0.4);
    }
  }
`;

// Sample data for active groups and events (would come from backend in full app)
const activeGroups = [
  { name: 'Himalayan Trekkers', members: 250 },
  { name: 'Weekend Wanderers', members: 180 },
  { name: 'Mountain Enthusiasts', members: 320 },
  { name: 'Adventure Seekers', members: 210 }
];

const upcomingEvents = [
  { name: 'Trekking Summit 2023', date: 'Oct 15' },
  { name: 'Gear Workshop', date: 'Nov 5' },
  { name: 'Photo Exhibition', date: 'Oct 28' },
  { name: 'Travel Meetup', date: 'Dec 10' }
];

const Explore = () => {
  const navigate = useNavigate();
  const [recommendedTreks, setRecommendedTreks] = useState([]);
  const [popularTreks, setPopularTreks] = useState([]);
  const [upcomingTreks, setUpcomingTreks] = useState([]);
  const [trendingTreks, setTrendingTreks] = useState([]);
  const [filteredRecommendedTreks, setFilteredRecommendedTreks] = useState([]);
  const [filteredPopularTreks, setFilteredPopularTreks] = useState([]);
  const [filteredUpcomingTreks, setFilteredUpcomingTreks] = useState([]);
  const [filteredTrendingTreks, setFilteredTrendingTreks] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, updateSearchQuery, searchTreks } = useSearch();

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        const treksCollection = collection(db, "treks");
        
        // Fetch all treks
        const treksSnapshot = await getDocs(treksCollection);
        const treksData = treksSnapshot.docs
          .filter(doc => doc.id !== "placeholder" && doc.data().title)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            featured: doc.data().featured || false,
            image: doc.data().image || trek1, // Default image if none provided
          }));

        // Filter treks by categories
        setRecommendedTreks(
          treksData.filter(trek => trek.recommended || trek.rating >= 4.8)
        );
        
        setPopularTreks(
          treksData.filter(trek => trek.popular || trek.reviews >= 100)
        );
        
        setUpcomingTreks(
          treksData.filter(trek => trek.upcoming || trek.season === "Upcoming")
        );
          setTrendingTreks(
          treksData.filter(trek => trek.trending || trek.rating >= 4.5)
        );
        
        // Set filtered treks to be the same as all treks initially
        setFilteredRecommendedTreks(treksData.filter(trek => trek.recommended || trek.rating >= 4.8));
        setFilteredPopularTreks(treksData.filter(trek => trek.popular || trek.reviews >= 100));
        setFilteredUpcomingTreks(treksData.filter(trek => trek.upcoming || trek.season === "Upcoming"));
        setFilteredTrendingTreks(treksData.filter(trek => trek.trending || trek.rating >= 4.5));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching treks:", err);
        setError("Failed to load treks. Please try again later.");
        setLoading(false);
      }
    };

    fetchTreks();  }, []);

  // Handle search functionality
  useEffect(() => {
    const query = localSearchQuery || searchQuery;
    
    if (!query) {
      // If no search query, show all treks
      setFilteredRecommendedTreks(recommendedTreks);
      setFilteredPopularTreks(popularTreks);
      setFilteredUpcomingTreks(upcomingTreks);
      setFilteredTrendingTreks(trendingTreks);
    } else {
      // Filter treks based on search query
      setFilteredRecommendedTreks(searchTreks(recommendedTreks, query));
      setFilteredPopularTreks(searchTreks(popularTreks, query));
      setFilteredUpcomingTreks(searchTreks(upcomingTreks, query));
      setFilteredTrendingTreks(searchTreks(trendingTreks, query));
    }
  }, [
    recommendedTreks, 
    popularTreks, 
    upcomingTreks, 
    trendingTreks, 
    searchQuery, 
    localSearchQuery, 
    searchTreks
  ]);
    // Handle local search
  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
  };
  
  // Clear search
  const clearSearch = () => {
    setLocalSearchQuery('');
    updateSearchQuery('');
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      updateSearchQuery(localSearchQuery);
      navigate('/search-results');
    }
  };

  const renderTrekSection = (sectionTitle, treks, sectionId) => {
    if (loading) {
      return (
        <>
          <SectionTitleContainer>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SectionUnderline />
          </SectionTitleContainer>
          <SliderWrapper>
            {[1,2,3].map((_, idx) => (
              <LoadingCard key={idx} />
            ))}
          </SliderWrapper>
        </>
      );
    }

    if (error) {
      return (
        <>
          <SectionTitleContainer>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SectionUnderline />
          </SectionTitleContainer>
          <ErrorState>
            <h3>Error Loading Treks</h3>
            <p>{error}</p>
          </ErrorState>
        </>
      );
    }

    if (treks.length === 0) {
      return (
        <>
          <SectionTitleContainer>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SectionUnderline />
          </SectionTitleContainer>
          <EmptyState>
            <h3>No Treks Available</h3>
            <p>Check back later for exciting new treks!</p>
          </EmptyState>
        </>
      );
    }

    return (
      <>
        <SectionTitleContainer>
          <SectionTitle>{sectionTitle}</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer>
        
        <SliderWithArrows data={treks} sectionId={sectionId}>
          {treks.map((trek, idx) => (
            <TrekCard key={idx} featured={trek.featured}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${trek.image})` }} />
                <ImageOverlay />
                <TrekTags>
                  <Tag><FiMapPin /> {trek.location || trek.state || "India"}</Tag>
                  <DifficultyTag><FaMountain /> {trek.difficulty || "Moderate"}</DifficultyTag>
                </TrekTags>
                <PriceTag>{trek.price || `₹${Math.floor(Math.random() * 10000) + 5000}`}</PriceTag>
                {trek.featured && (
                  <BadgeTag style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    top: "60px"
                  }}>
                    Featured
                  </BadgeTag>
                )}
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{trek.title}</TrekTitle>
                <TrekLocation>
                  <FiMapPin />
                  {trek.location || "India"}
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiClock />
                    {trek.days || Math.floor(Math.random() * 7) + 2} Days
                  </MetaItem>
                  <Difficulty>
                    <FaMountain />
                    {trek.difficulty || "Moderate"}
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FaStar />
                  <span>{trek.rating || (4 + Math.random()).toFixed(1)}</span>
                  <span className="reviews">({trek.reviews || Math.floor(Math.random() * 100) + 50} reviews)</span>
                </TrekRating>
                <ActionButton as={Link} to={`/trek/${trek.id || trek.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  Book Now <FiArrowRight />
                </ActionButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows>
      </>
    );  
  };

  // Enhanced Slider Component
  function SliderWithArrows({ children, data, sectionId }) {
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleScroll = (direction) => {
      if (sliderRef.current && !isScrolling) {
        setIsScrolling(true);
        const { scrollLeft, clientWidth } = sliderRef.current;
        const scrollTo = direction === 'left' 
          ? scrollLeft - clientWidth / 1.5
          : scrollLeft + clientWidth / 1.5;
        
        sliderRef.current.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });

        setTimeout(() => {
          if (sliderRef.current) {
            const newIndex = Math.round(sliderRef.current.scrollLeft / (sliderRef.current.scrollWidth / data.length));
            setActiveIndex(Math.min(Math.max(newIndex, 0), data.length - 1));
            setIsScrolling(false);
          }
        }, 500);
      }
    };

    const handleIndicatorClick = (index) => {
      if (sliderRef.current && !isScrolling) {
        setIsScrolling(true);
        const cardWidth = sliderRef.current.scrollWidth / data.length;
        const scrollTo = cardWidth * index;
        
        sliderRef.current.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
        
        setActiveIndex(index);
        setTimeout(() => setIsScrolling(false), 500);
      }
    };

    // Listen for scroll events to update active index
    useEffect(() => {
      const handleScrollUpdate = () => {
        if (sliderRef.current && !isScrolling) {
          const { scrollLeft, scrollWidth } = sliderRef.current;
          const cardWidth = scrollWidth / data.length;
          const newIndex = Math.round(scrollLeft / cardWidth);
          
          if (newIndex !== activeIndex) {
            setActiveIndex(Math.min(Math.max(newIndex, 0), data.length - 1));
          }
        }
      };

      const ref = sliderRef.current;
      if (ref) {
        ref.addEventListener('scroll', handleScrollUpdate);
        return () => ref.removeEventListener('scroll', handleScrollUpdate);
      }
    }, [activeIndex, isScrolling, data.length]);

    return (
      <SliderWrapper>
        <LeftArrowButton 
          onClick={() => handleScroll('left')}
          disabled={activeIndex === 0 || isScrolling}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </LeftArrowButton>
        
        <TreksSlider ref={sliderRef} id={sectionId}>
          {children}
        </TreksSlider>
        
        <RightArrowButton 
          onClick={() => handleScroll('right')}
          disabled={activeIndex === data.length - 1 || isScrolling}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </RightArrowButton>
        
        <ScrollIndicatorContainer>
          {data.map((_, idx) => (
            <ScrollIndicator 
              key={idx} 
              active={idx === activeIndex}
              onClick={() => handleIndicatorClick(idx)}
            />
          ))}
        </ScrollIndicatorContainer>
      </SliderWrapper>
    );
  }

  return (
    <ExploreSection>

      <MapPatternBackground />
      <Overlay />      <Container>
        {/* Search Bar */}
        <SearchBarContainer>
          <form onSubmit={handleSearchSubmit}>
            <SearchInputWrapper>
              <SearchInputField
                type="text"
                placeholder="Search for treks by name, location, difficulty..."
                value={localSearchQuery || searchQuery}
                onChange={handleSearch}
              />
              {(localSearchQuery || searchQuery) && (
                <ClearButton onClick={clearSearch} aria-label="Clear search">
                  <FiX />
                </ClearButton>
              )}
              <SearchButton aria-label="Search" type="submit">
                <FiSearch />
              </SearchButton>
            </SearchInputWrapper>
          </form>
        </SearchBarContainer>
        
        {(localSearchQuery || searchQuery) && (
          <SearchResultsHeader>
            {filteredRecommendedTreks.length + filteredPopularTreks.length + 
             filteredUpcomingTreks.length + filteredTrendingTreks.length === 0 
              ? "No treks match your search. Try a different keyword." 
              : `Found treks matching "${localSearchQuery || searchQuery}"`}
          </SearchResultsHeader>
        )}
        
        {/* Render Trek Sections with filtered treks */}
        {renderTrekSection("Recommended Treks", filteredRecommendedTreks, "recommended-treks")}
        {renderTrekSection("Popular Treks", filteredPopularTreks, "popular-treks")}
        {renderTrekSection("Upcoming Treks", filteredUpcomingTreks, "upcoming-treks")}
        {renderTrekSection("Trending Treks", filteredTrendingTreks, "trending-treks")}
        
        {/* Active Groups Section */}
        <SectionTitleContainer>
          <SectionTitle>Active Groups</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer>
        
        <SliderWithArrows data={activeGroups} sectionId="active-groups">
          {activeGroups.map((group, idx) => (
            <TrekCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${groupImg})` }} />
                <ImageOverlay />
                <TrekTags>
                  <GroupTag><RiCommunityFill /> Community</GroupTag>
                </TrekTags>
                <BadgeTag>80 XP</BadgeTag>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{group.name}</TrekTitle>
                <TrekLocation>
                  <FiUsers />
                  {group.members} active members
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiCalendar />
                    Weekly Meetups
                  </MetaItem>
                  <Difficulty>
                    <FiInfo />
                    Open to Join
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FaStar />
                  <span>4.9</span>
                  <span className="reviews">(32 reviews)</span>
                </TrekRating>
                <ActionButton as={Link} to="/signup">
                  Join Group <FiArrowRight />
                </ActionButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows>
        
        {/* Upcoming Events Section */}
        <SectionTitleContainer>
          <SectionTitle>Upcoming Events</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer>
        
        <SliderWithArrows data={upcomingEvents} sectionId="upcoming-events">
          {upcomingEvents.map((event, idx) => (
            <TrekCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${eventImg})` }} />
                <ImageOverlay />
                <TrekTags>
                  <EventTag><MdEventAvailable /> Event</EventTag>
                </TrekTags>
                <BadgeTag>{event.date}</BadgeTag>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{event.name}</TrekTitle>
                <TrekLocation>
                  <FiMapPin />
                  Online & In-person
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiClock />
                    Registration Open
                  </MetaItem>
                  <Difficulty>
                    <FiInfo />
                    Limited Spots
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FiUsers />
                  <span>58</span>
                  <span className="reviews">people attending</span>
                </TrekRating>
                <EventButton as={Link} to="/signup">
                  Register Now <FiArrowRight />
                </EventButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows>
      </Container>
      <Footer />
    </ExploreSection>
  );
};

export default Explore;
