import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import trek1 from '../assets/images/trek1.png';
import Footer from './Footer';
import groupImg from '../assets/images/trek1.png';
import eventImg from '../assets/images/trek1.png';
import Navbar from './Navbar';
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiUsers, FiInfo } from 'react-icons/fi';
import { FaMountain, FaStar } from 'react-icons/fa';
import { RiCommunityFill } from 'react-icons/ri';
import { MdEventAvailable } from 'react-icons/md';

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
const TrekCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  overflow: hidden;
  min-width: 380px;
  flex: 0 0 380px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              box-shadow 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  scroll-snap-align: start;
  transform-style: preserve-3d;
  
  &:hover {
    transform: translateY(-15px) rotateX(5deg);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 210, 191, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1024px) {
    min-width: 360px;
    flex: 0 0 360px;
  }
  
  @media (max-width: 768px) {
    min-width: 300px;
    flex: 0 0 300px;
    
    &:hover {
      transform: translateY(-10px) rotateX(3deg);
    }
  }

  @media (max-width: 480px) {
    min-width: 85%;
    flex: 0 0 85%;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
  
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
  
  ${TrekCard}:hover & {
    transform: scale(1.08);
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
  padding: 25px 22px;
  background: rgba(255, 255, 255, 0.97);
  color: #222;
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
    padding: 20px 18px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 14px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 1.4rem;
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
    background: #FFD2BF;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
`;

const TrekLocation = styled.div`
  display: flex;
  align-items: center;
  color: #555;
  font-size: 1rem;
  margin-bottom: 16px;
  gap: 8px;
  
  svg {
    color: #FFD2BF;
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
  margin-bottom: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 0.95rem;
  
  svg {
    color: #FFD2BF;
    min-width: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 6px;
  }
`;

const Difficulty = styled.div`
  color: #555;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #FFD2BF;
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
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  
  svg {
    color: #FFD700;
  }
  
  span {
    font-weight: 700;
    color: #181828;
    font-size: 1rem;
  }
  
  .reviews {
    color: #777;
    font-weight: 400;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
    padding-top: 10px;
    gap: 6px;
    
    span {
      font-size: 0.9rem;
    }
    
    .reviews {
      font-size: 0.8rem;
    }
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #FFD2BF 0%, #ffbfa3 100%);
  color: #181828;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-weight: 700;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(24, 24, 40, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #ffbfa3 0%, #ffa889 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 210, 191, 0.4);
    
    svg {
      transform: translateX(4px);
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 0.9rem;
  }
`;

const EventButton = styled(ActionButton)`
  background: linear-gradient(135deg, #295a30 0%, #3a7a41 100%);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #3a7a41 0%, #4a8a51 100%);
    box-shadow: 0 8px 25px rgba(41, 90, 48, 0.4);
  }
`;

const BadgeTag = styled.span`
  background: linear-gradient(135deg, #FFD700, #FFC107);
  color: #222;
  font-weight: 700;
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

const ScrollIndicatorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: -20px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-top: -10px;
    margin-bottom: 30px;
  }
`;

const ScrollIndicator = styled.div`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 10px;
  background: ${props => props.active ? 
    'linear-gradient(to right, #FFD2BF, #ffbfa3)' : 
    'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? 
    '0 2px 8px rgba(255, 210, 191, 0.3)' : 
    '0 1px 3px rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    transform: ${props => props.active ? 'scale(1.1)' : 'scale(1.2)'};
    background: ${props => props.active ? 
      'linear-gradient(to right, #FFD2BF, #ffbfa3)' : 
      'rgba(255, 255, 255, 0.4)'};
  }
`;

// Example data
const recommendedTreks = [
  {
    image: trek1,
    state: 'Uttarakhand',
    title: 'Kedarnath Trek',
    location: 'Sankri, Uttarakhand',
    days: 6,
    difficulty: 'Moderate',
    price: '₹12,500',
    rating: 4.8,
    reviews: 120,
  },
  {
    image: trek1,
    state: 'Uttarakhand',
    title: 'Valley of Flowers',
    location: 'Govindghat, Uttarakhand',
    days: 7,
    difficulty: 'Moderate',
    price: '₹15,800',
    rating: 4.9,
    reviews: 98,
  },
  {
    image: trek1,
    state: 'Himachal Pradesh',
    title: 'Hampta Pass Trek',
    location: 'Manali, Himachal',
    days: 5,
    difficulty: 'Moderate',
    price: '₹14,200',
    rating: 4.7,
    reviews: 110,
  },
];

const popularTreks = [
  {
    image: trek1,
    state: 'Himachal Pradesh',
    title: 'Triund Trek',
    location: 'Mcleodganj, Himachal',
    days: 2,
    difficulty: 'Easy',
    price: '₹5,000',
    rating: 4.6,
    reviews: 150,
  },
  {
    image: trek1,
    state: 'Uttarakhand',
    title: 'RoopKund Trek',
    location: 'Lohajung, Uttarakhand',
    days: 8,
    difficulty: 'Difficult',
    price: '₹18,000',
    rating: 4.8,
    reviews: 115,
  },
  {
    image: trek1,
    state: 'Himachal Pradesh',
    title: 'Kheerganga Trek',
    location: 'Barshaini, Himachal',
    days: 3,
    difficulty: 'Moderate',
    price: '₹6,200',
    rating: 4.6,
    reviews: 186,
  },
];

// Example data for groups and events
const activeGroups = [
  { name: 'Himalayan Explorers', members: 128 },
  { name: 'Patagonia Trekkers', members: 89 },
  { name: 'Sahyadri Hikers', members: 54 },
  { name: 'Alpine Adventurers', members: 73 },
];

const upcomingEvents = [
  { name: 'Full Moon Trek', date: '12 July 2024' },
  { name: 'Winter Summit', date: '25 Dec 2024' },
  { name: 'Spring Valley Hike', date: '15 Mar 2025' },
  { name: 'Night Forest Walk', date: '2 Feb 2025' },
];

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

const Explore = () => {
  return (
    <ExploreSection>
      <MapPatternBackground />
      <Overlay />
      <Navbar />
      <Container>
        {/* Recommended Treks Section */}
        <SectionTitleContainer>
          <SectionTitle>Recommended for You</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer>
        
        <SliderWithArrows data={recommendedTreks} sectionId="recommended-treks">
          {recommendedTreks.map((trek, idx) => (
            <TrekCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${trek.image})` }} />
                <ImageOverlay />
                <TrekTags>
                  <Tag><FiMapPin /> {trek.state}</Tag>
                  <DifficultyTag><FaMountain /> {trek.difficulty}</DifficultyTag>
                </TrekTags>
                <PriceTag>{trek.price}</PriceTag>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{trek.title}</TrekTitle>
                <TrekLocation>
                  <FiMapPin />
                  {trek.location}
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiClock />
                    {trek.days} Days
                  </MetaItem>
                  <Difficulty>
                    <FaMountain />
                    {trek.difficulty}
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FaStar />
                  <span>{trek.rating}</span>
                  <span className="reviews">({trek.reviews} reviews)</span>
                </TrekRating>
                <ActionButton as={Link} to={`/trek/${trek.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  View Trek <FiArrowRight />
                </ActionButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows>

        {/* Popular Treks Section */}
        <SectionTitleContainer>
          <SectionTitle>Popular Treks</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer>
        
        <SliderWithArrows data={popularTreks} sectionId="popular-treks">
          {popularTreks.map((trek, idx) => (
            <TrekCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${trek.image})` }} />
                <ImageOverlay />
                <TrekTags>
                  <Tag><FiMapPin /> {trek.state}</Tag>
                  <DifficultyTag><FaMountain /> {trek.difficulty}</DifficultyTag>
                </TrekTags>
                <PriceTag>{trek.price}</PriceTag>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{trek.title}</TrekTitle>
                <TrekLocation>
                  <FiMapPin />
                  {trek.location}
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiClock />
                    {trek.days} Days
                  </MetaItem>
                  <Difficulty>
                    <FaMountain />
                    {trek.difficulty}
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FaStar />
                  <span>{trek.rating}</span>
                  <span className="reviews">({trek.reviews} reviews)</span>
                </TrekRating>
                <ActionButton as={Link} to={`/trek/${trek.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  View Trek <FiArrowRight />
                </ActionButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows>

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