import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import mapPattern from "../assets/images/map-pattren.png";
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiSearch } from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getValidImageUrl } from "../utils/images";
import { useSearch } from "../context/SearchContext";

const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

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

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Section = styled.section`
  position: relative;
  min-height: 800px;
  padding: 120px 0 140px 0;
  background-color: #080808; /* Darker background to match cards */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  @media (max-width: 768px) {
    padding: 90px 0 110px 0;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 60px 0 90px 0;
  }
`;

// Enhanced map pattern with higher opacity and blend mode
const MapPatternBackground = styled.div`
  position: absolute;
  inset: 0;
  background: url(${mapPattern});
  background-size: 500px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 2;
  opacity: 0.2;
  will-change: transform;
  
  /* Removed mix-blend-mode and filter for better performance */
  
  /* Only animate on non-mobile devices */
  @media (min-width: 769px) {
    animation: breathe 20s infinite ease-in-out;
    
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(92, 188, 226, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%);
    z-index: 1;
  }
`;

// Lighter overlay to make map pattern more visible
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, 
    rgba(10, 26, 47, 0.6) 0%, 
    rgba(8, 22, 48, 0.85) 100%);
  z-index: 1;
  pointer-events: none;
`;

const SectionContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  padding: 0 50px;
  
  @media (max-width: 768px) {
    padding: 0 30px;
  }
  
  @media (max-width: 480px) {
    padding: 0 20px;
  }
`;

// Enhanced heading with bold gradient and larger size
const Heading = styled.h2`
  color: #fff;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(to right, #ffffff 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 3.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

// Improved underline with animation and increased size
const Underline = styled.div`
  width: 120px;
  height: 8px;
  background: linear-gradient(to right, #5390D9, #7400B8);
  border-radius: 8px;
  margin: 0 auto 30px auto;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
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

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  letter-spacing: 0.5px;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 30px;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 25px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0 50px 0 20px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(128, 255, 219, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchIconContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const SearchResultsInfo = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 20px;
  font-style: italic;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 30px;
`;

// Enhanced card container with better scrolling
const TrekListContainer = styled.div`
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding: 30px 15px 50px 15px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  will-change: scroll-position;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
  
  /* Optimized for smoother scrolling */
  > * {
    scroll-snap-align: start;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 20px 5px 40px 5px;
  }
`;

// Enhanced navigation buttons
const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(128, 255, 219, 0.1);
  border: 1px solid rgba(128, 255, 219, 0.3);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  will-change: transform, background-color;
  
  /* Removed backdrop-filter for better performance */
  
  &:hover {
    background: rgba(128, 255, 219, 0.2);
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
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: -27px;
  
  @media (max-width: 768px) {
    left: -15px;
  }
  
  @media (max-width: 480px) {
    left: -10px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: -27px;
  
  @media (max-width: 768px) {
    right: -15px;
  }
  
  @media (max-width: 480px) {
    right: -10px;
  }
`;

// Premium card with clean, modern design
const TrekCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  min-width: 380px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  flex-shrink: 0;
  position: relative;
  border: none;
  
  @media (min-width: 769px) {
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
  }
  
  @media (max-width: 1200px) {
    min-width: 360px;
  }
  
  @media (max-width: 1000px) {
    min-width: 320px;
  }
      
  @media (max-width: 768px) {
    min-width: 85%;
    max-width: 85%;
  }
  
  @media (max-width: 480px) {
    min-width: 90%;
    max-width: 90%;
  }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
`;

const TrekImage = styled.div`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0) 50%
    );
    z-index: 1;
  }
  
  @media (min-width: 769px) {
    ${TrekCard}:hover & {
      transform: scale(1.05);
    }
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0), 
    rgba(0, 0, 0, 0.3)
  );
  z-index: 1;
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  z-index: 10;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background 0.3s, transform 0.3s;
  gap: 6px;
  
  svg {
    flex-shrink: 0;
    font-size: 1.2rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

// Fresh, bright difficulty tag
const DifficultyTag = styled(Tag)`
  background: #FF5722;
  color: white;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
  border: none;
  min-width: 90px;
  justify-content: center;
  
  svg {
    color: white;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    min-width: 80px;
    font-size: 0.8rem;
  }
`;

const LocationTag = styled(Tag)`
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  min-width: 90px;
  justify-content: center;
  
  svg {
    color: white;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    min-width: 80px;
    font-size: 0.8rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #666;
  font-size: 0.95rem;
  flex-wrap: wrap;
  align-items: center;
  
  &:last-of-type {
    margin-bottom: 20px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  
  svg {
    color: #2196F3;
    font-size: 1.1rem;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const Price = styled.div`
  color: #333;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  
  span {
    font-size: 0.95rem;
    color: #888;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    span {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    justify-content: center;
    
    span {
      font-size: 0.85rem;
    }
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  color: #FFC107;
  font-size: 1rem;
`;

const Star = styled.span`
  color: #FFC107;
  margin-right: 3px;
  font-size: 1rem;
`;

const ReviewCount = styled.span`
  color: #999;
  font-weight: 400;
  font-size: 0.9rem;
`;

const ViewButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  
  &:hover {
    background: #45a049;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(76, 175, 80, 0.3);
  }
      
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(76, 175, 80, 0.2);
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 18px;
    font-size: 0.9rem;
  }
`;

// Enhanced scroll indicators
const ScrollIndicatorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  color: #b0b0b0;
  font-size: 1.05rem;
  margin: 14px 0;
  letter-spacing: 0.3px;
`;


const ScrollIndicator = styled.div`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 10px;
  background: ${props => props.active ? 
    'linear-gradient(to right, #5390D9, #7400B8)' : 
    'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? 
    '0 2px 8px rgba(83, 144, 217, 0.3)' : 
    '0 1px 3px rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    transform: ${props => props.active ? 'scale(1.1)' : 'scale(1.2)'};
    background: ${props => props.active ? 
      'linear-gradient(to right, #5390D9, #7400B8)' : 
      'rgba(255, 255, 255, 0.4)'};
  }
`;

// Treks will be fetched from Firebase

export default function FeaturedTreks() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [treks, setTreks] = useState([]);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const { searchQuery, updateSearchQuery, searchTreks } = useSearch();

  // Fetch treks from Firebase when component mounts
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        
        // Check if the treks collection exists
        const treksCollection = collection(db, "treks");
        
        try {
          const treksSnapshot = await getDocs(treksCollection);
          const treksData = treksSnapshot.docs
            .filter(doc => doc.id !== "placeholder" && doc.data().title) // Filter out placeholder docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
          
          if (treksData.length === 0) {
            console.log("No treks found. Admin needs to add treks.");
          }
          
          setTreks(treksData);
        } catch (fetchError) {
          console.error("Error fetching trek documents:", fetchError);
          setError("Unable to load treks. The trek data might not be initialized yet. Please contact the administrator.");
        }
      } catch (err) {
        console.error("Error fetching treks:", err);
        setError("Failed to load treks. Please try again later or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  // Optimized scrolling with requestAnimationFrame
  const handleScroll = (direction) => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      const { scrollLeft, clientWidth } = scrollRef.current;
      const cardWidth = clientWidth / 2; // Scroll by half a view width
      
      const scrollTo = direction === 'left' 
        ? scrollLeft - cardWidth
        : scrollLeft + cardWidth;
      
      // Use standard scrollTo for smoother scrolling
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.scrollLeft = scrollTo;
      
      setTimeout(() => {
        if (scrollRef.current) {
          const totalWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          const progress = Math.min(Math.max(scrollRef.current.scrollLeft / totalWidth, 0), 1);
          const newIndex = Math.min(
            Math.floor(progress * treks.length),
            treks.length - 1
          );
          setActiveIndex(newIndex);
          setIsScrolling(false);
        }
      }, 300); // Reduced timeout for better responsiveness
    }
  };

  const handleIndicatorClick = (index) => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      const totalWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const scrollTo = (index / (treks.length - 1)) * totalWidth;
      
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.scrollLeft = scrollTo;
      
      setActiveIndex(index);
      setTimeout(() => setIsScrolling(false), 300);
    }
  };
  
  const navigateToTrekDetails = (trekId) => {
    navigate(`/trek/${trekId}`);
  };

  // Optimized scroll event handler with debounce effect
  useEffect(() => {
    let scrollTimeout;
    
    const handleScrollUpdate = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        if (scrollRef.current && !isScrolling) {
          const totalWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          const progress = Math.min(Math.max(scrollRef.current.scrollLeft / totalWidth, 0), 1);
          const newIndex = Math.min(
            Math.floor(progress * treks.length),
            treks.length - 1
          );
          
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        }
      }, 50);
    };

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScrollUpdate, { passive: true });
      return () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        ref.removeEventListener('scroll', handleScrollUpdate);
      };
    }  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isScrolling, treks.length]);
  return (
    <Section>
      {/* Enhanced Map Pattern */}
      <MapPatternBackground />
      <Overlay />
      
      {/* Removed decorative floating elements */}
      
      <SectionContent>
        <Heading>Featured Treks</Heading>
        <Underline />
        <Subtitle>Discover breathtaking adventures, from mountain peaks to hidden valleys. Perfect for explorers of all levels!</Subtitle>
        
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px', 
            flexDirection: 'column',
            color: 'white',
            gap: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '5px solid rgba(128, 255, 219, 0.3)',
              borderTopColor: '#5390D9',
              animation: 'spin 1.5s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
            <p style={{ fontSize: '1.2rem' }}>Loading treks...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        ) : treks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px 20px' 
          }}>
            <p>No treks found. Please check back later!</p>          </div>        ) : (
          <>
          <ScrollContainer>
            <PrevButton 
              onClick={() => handleScroll('left')}
              disabled={activeIndex === 0 || isScrolling}
              aria-label="Previous treks"
            >
              <FiChevronLeft />
            </PrevButton>
            
            <TrekListContainer ref={scrollRef}>            {treks.map((trek, idx) => (
              <TrekCard key={idx}>
                <TrekImageWrapper>
                  <TrekImage style={{backgroundImage: `url(${getValidImageUrl(trek.image)})`}} />
                  <ImageOverlay />
                  <TrekTags>
                    <LocationTag><FiMapPin /> {trek.country}</LocationTag>
                    <DifficultyTag><FaMountain /> {trek.difficulty}</DifficultyTag>
                  </TrekTags>
                </TrekImageWrapper>
                <TrekInfo>
                  <TrekTitle>{trek.title}</TrekTitle>
                  <InfoRow>                    <InfoItem>
                      <FiClock />
                      <span>{trek.days} Days</span>
                    </InfoItem>
                    <InfoItem>
                      <FiCalendar />
                      <span>{trek.season || "Year-round"}</span>
                    </InfoItem>
                  </InfoRow>
                  <InfoRow>
                    <InfoItem>
                      <FiMapPin />
                      <span>{trek.location}</span>
                    </InfoItem>
                  </InfoRow>
                  <RatingRow>
                    <StarContainer>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i}>★</Star>
                      ))}
                    </StarContainer>
                    <span>{trek.rating} <ReviewCount>({trek.reviews} reviews)</ReviewCount></span>
                  </RatingRow>                  <ActionRow>
                    <Price>
                      {trek.price} <span>per person</span>
                    </Price>
                    <ViewButton onClick={() => navigateToTrekDetails(trek.id)}>
                      Book Now
                      <FiArrowRight />
                    </ViewButton>
                  </ActionRow>
                </TrekInfo>
              </TrekCard>
            ))}          </TrekListContainer>
          
          <NextButton 
            onClick={() => handleScroll('right')}
            disabled={activeIndex === treks.length - 1 || isScrolling}
            aria-label="Next treks"
          >
            <FiChevronRight />
          </NextButton>        </ScrollContainer>
        
        <ScrollIndicatorContainer>
          {treks.map((_, idx) => (
            <ScrollIndicator 
              key={idx} 
              active={idx === activeIndex}
              onClick={() => handleIndicatorClick(idx)}
              aria-label={`Go to trek ${idx + 1}`}
            />
          ))}
        </ScrollIndicatorContainer>
      </>
      )}
      </SectionContent>
    </Section>
  );
}

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