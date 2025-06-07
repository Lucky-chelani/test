import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import trek1 from "../assets/images/photo1.jpeg";
import trek2 from "../assets/images/photo2.jpeg";
import trek3 from "../assets/images/photo3.jpeg";
import mapPattern from "../assets/images/map-pattren.png";
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';

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
  min-height: 700px;
  padding: 100px 0 120px 0;
  background-color: #0a1a2f;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 70px 0 90px 0;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 50px 0 70px 0;
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

// Enhanced heading with modern gradient
const Heading = styled.h2`
  color: #fff;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

// Improved underline with animation
const Underline = styled.div`
  width: 80px;
  height: 6px;
  background: linear-gradient(to right, #5390D9, #7400B8);
  border-radius: 6px;
  margin: 0 auto 24px auto;
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
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
  margin-bottom: 60px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
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

// Enhanced card with optimized animation
const TrekCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  min-width: 380px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(128, 255, 219, 0.1);
  flex-shrink: 0;
  /* Removed backdrop-filter and transform-style for better performance */
  will-change: transform;
  
  @media (min-width: 769px) {
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba(128, 255, 219, 0.2);
    }
  }
  
  @media (max-width: 1200px) {
    min-width: 340px;
  }
  
  @media (max-width: 1000px) {
    min-width: 300px;
  }
      
  @media (max-width: 768px) {
    min-width: 80%;
    max-width: 80%;
    
    &:hover {
      transform: translateY(-5px);
    }
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
  transition: transform 0.3s ease;
  will-change: transform;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
    pointer-events: none;
  }
  
  @media (min-width: 769px) {
    ${TrekCard}:hover & {
      transform: scale(1.05);
    }
  }
`;

// Enhanced image overlay
const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(10, 26, 47, 0.5) 100%);
  z-index: 1;
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 2;
`;

// Modern clean card info section
const TrekInfo = styled.div`
  padding: 28px 25px;
  background: rgba(255, 255, 255, 0.97);
  color: #111;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
  }
  
  @media (max-width: 768px) {
    padding: 22px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #181828;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
  line-height: 1.3;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const TagRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #F7FAFF;
  color: #181828;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 6px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  svg {
    color: #666;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 14px;
  }
`;

// Updated difficulty tag with new color
const DifficultyTag = styled(Tag)`
  background: linear-gradient(to right, #5390D9, #7400B8);
  color: white;
  font-weight: 700;
  
  svg {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const LocationTag = styled(Tag)`
  background: rgba(128, 255, 219, 0.2);
  border: 1px solid rgba(128, 255, 219, 0.3);
  
  svg {
    color: #5390D9;
  }
  
  /* Only animate on non-mobile devices */
  @media (min-width: 769px) {
    animation: ${floatAnimation} 5s infinite ease-in-out;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #444;
  font-size: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  
  svg {
    color: #5390D9;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const Price = styled.div`
  color: #181828;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  
  span {
    font-size: 0.9rem;
    color: #777;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    
    span {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    justify-content: center;
    
    span {
      font-size: 0.75rem;
    }
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 16px;
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.span`
  color: #5390D9;
  font-size: 1.1rem;
`;

const ReviewCount = styled.span`
  color: #777;
  font-weight: 400;
  font-size: 0.9rem;
`;

// Enhanced button with simplified animations
const ViewButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 36px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(83, 144, 217, 0.3);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  will-change: transform;
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-2px);
  }
      
  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
    min-width: 120px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 0.9rem;
    min-width: unset;
  }
`;

// Enhanced scroll indicators
const ScrollIndicatorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
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

const treks = [
  {
    id: "bhrigu-lake",
    image: trek1,
    country: "India",
    difficulty: "Difficult",
    title: "Bhrigu Lake Trek",
    rating: 4.8,
    reviews: 124,
    days: 8,
    price: "3,850 Rupees",
    location: "Himachal Pradesh"
  },
  {
    id: "valley-of-flowers",
    image: trek2,
    country: "India",
    difficulty: "Moderate",
    title: "Valley Of Flowers Trek",
    rating: 5.0,
    reviews: 98,
    days: 7,
    price: "8,250 Rupees",
    location: "Uttarakhand Himalayas"
  },
  {
    id: "hampta-pass",
    image: trek3,
    country: "India",
    difficulty: "Moderate",
    title: "Hampta Pass Trek ",
    rating: 4.2,
    reviews: 87,
    days: 6,
    price: "6,050 Rupees",
    location: "Himachal Pradesh"
  },
 
];

export default function FeaturedTreks() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

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
    }
  }, [activeIndex, isScrolling]);

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
        
        <ScrollContainer>
          <PrevButton 
            onClick={() => handleScroll('left')}
            disabled={activeIndex === 0 || isScrolling}
            aria-label="Previous treks"
          >
            <FiChevronLeft />
          </PrevButton>
          
          <TrekListContainer ref={scrollRef}>
            {treks.map((trek, idx) => (
              <TrekCard key={idx}>
                <TrekImageWrapper>
                  <TrekImage style={{backgroundImage: `url(${trek.image})`}} />
                  <ImageOverlay />
                  <TrekTags>
                    <LocationTag><FiMapPin /> {trek.country}</LocationTag>
                    <DifficultyTag><FaMountain /> {trek.difficulty}</DifficultyTag>
                  </TrekTags>
                </TrekImageWrapper>
                <TrekInfo>
                  <TrekTitle>{trek.title}</TrekTitle>
                  <InfoRow>
                    <InfoItem>
                      <FiClock />
                      <span>{trek.days} Days</span>
                    </InfoItem>
                    <InfoItem>
                      <FiCalendar />
                      <span>Aug-Sept</span>
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
                  </RatingRow>
                  <ActionRow>
                    <Price>
                      {trek.price} <span>per person</span>
                    </Price>
                    <ViewButton onClick={() => navigateToTrekDetails(trek.id)}>
                      View Trek
                      <FiArrowRight />
                    </ViewButton>
                  </ActionRow>
                </TrekInfo>
              </TrekCard>
            ))}
          </TrekListContainer>
          
          <NextButton 
            onClick={() => handleScroll('right')}
            disabled={activeIndex === treks.length - 1 || isScrolling}
            aria-label="Next treks"
          >
            <FiChevronRight />
          </NextButton>
        </ScrollContainer>
        
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
      </SectionContent>
    </Section>
  );
}