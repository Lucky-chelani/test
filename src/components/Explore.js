import React, { useRef } from 'react';
import styled from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import trek1 from '../assets/images/trek1.png';
import Footer from './Footer';
import groupImg from '../assets/images/trek1.png'; // Placeholder, replace with group image if available
import eventImg from '../assets/images/trek1.png'; // Placeholder, replace with event image if available
import Navbar from './Navbar';

const ExploreSection = styled.section`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding: 100px 0 0 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
`;

const SectionTitle = styled.h2`
  font-size: 2.3rem;
  text-align: center;
  margin-bottom: 2.2rem;
  font-weight: 700;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(0,0,0,0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, background 0.2s, transform 0.2s;
  
  &:hover {
    background: rgba(0,0,0,0.8);
    transform: translateY(-50%) scale(1.1);
      }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
    opacity: 0.9; /* More visible on mobile */
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  overflow: visible;
  
  &:hover ${ArrowButton} {
    opacity: 1;
  }
  
  /* Make arrows always visible on touch devices */
  @media (pointer: coarse) {
    ${ArrowButton} {
      opacity: 1;
    }
  }
`;

const TreksSlider = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px;
  scroll-behavior: smooth;
  margin-bottom: 3.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.3);
    border-radius: 6px;
  }
      @media (max-width: 768px) {
    gap: 24px;
    padding-bottom: 12px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const TrekCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
  width: 410px;
  flex: 0 0 410px;
  display: flex;
  flex-direction: column;
  color: #222;
  scroll-snap-align: start;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, box-shadow;
  
  &:hover {
    transform: translateY(-18px) scale(1.03);
    box-shadow: 0 16px 48px rgba(0,0,0,0.25);
  }

  @media (max-width: 1024px) {
    width: 360px;
    flex: 0 0 360px;
  }
      @media (max-width: 768px) {
    width: 300px;
    flex: 0 0 300px;
    &:hover {
      transform: translateY(-10px) scale(1.01);
    }
  }

  @media (max-width: 480px) {
    width: 260px;
    flex: 0 0 260px;
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const TrekImage = styled.div`
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;

  @media (max-width: 768px) {
    height: 180px;
  }
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 10px;
`;

const Tag = styled.span`
  background: #f7feff;
  color: #523d3d;
  font-size: 1rem;
  padding: 6px 18px;
  border-radius: 12px;
  font-weight: 600;
`;

const DifficultyTag = styled(Tag)`
  background: #ffd2bf;
`;

const PriceTag = styled.span`
  background: #ffd700;
  color: #222;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 6px 18px;
  border-radius: 16px;
  position: absolute;
  top: 16px;
  right: 16px;
`;

const TrekInfo = styled.div`
  padding: 24px 24px 18px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 18px 18px 14px 18px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 14px 14px 12px 14px;
  }
`;


const TrekTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px 0;

  @media (max-width: 768px) {
    font-size: 1.15rem;
    margin: 0 0 4px 0;
  }
`;

const TrekLocation = styled.div`
  display: flex;
  align-items: center;
  color: #7d7d7d;
  font-size: 1rem;
  margin-bottom: 2px;
  gap: 6px;
`;

const TrekMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7d7d7d;
  font-size: 1rem;
`;

const Difficulty = styled.div`
  color: #7d7d7d;
  font-size: 1rem;
  font-weight: 500;
`;

const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #222;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 8px;
`;

// SVG Icons
const LocationIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#7d7d7d" strokeWidth="2" d="M12 21c-4.418 0-8-5.373-8-10a8 8 0 1 1 16 0c0 4.627-3.582 10-8 10z"/><circle cx="12" cy="11" r="3" stroke="#7d7d7d" strokeWidth="2"/></svg>
);
const DaysIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#7d7d7d" strokeWidth="2"/><path stroke="#7d7d7d" strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2"/></svg>
);
const StarIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FFD700"/></svg>
);

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

function SliderWithArrows({ children }) {
  const sliderRef = useRef();
  const scrollBy = 420 + 40; // card width + gap
  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -scrollBy, behavior: 'smooth' });
  };
  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: scrollBy, behavior: 'smooth' });
  };
  return (
    <SliderWrapper>
      <ArrowButton style={{ left: 0 }} onClick={scrollLeft} aria-label="Scroll left">&#8592;</ArrowButton>
      <TreksSlider ref={sliderRef}>{children}</TreksSlider>
      <ArrowButton style={{ right: 0 }} onClick={scrollRight} aria-label="Scroll right">&#8594;</ArrowButton>
    </SliderWrapper>
  );
}

const ActionButton = styled.button`
  background: #FF4B1F;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 12px;
  width: 100%;
  transition: background 0.18s;
  &:hover {
    background: #d13a13;
  }
`;

const EventButton = styled(ActionButton)`
  background: #295a30;
  &:hover {
    background: #1e3e22;
  }
`;

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

const BadgeTag = styled.span`
  background: #ffd700;
  color: #222;
  font-weight: 700;
  font-size: 1rem;
  padding: 6px 18px;
  border-radius: 16px;
  position: absolute;
  top: 16px;
  right: 16px;
`;

const GroupTag = styled(Tag)`
  background: #e0f7fa;
  color: #295a30;
`;

const EventTag = styled(Tag)`
  background: #ffe0b2;
  color: #b26a00;
`;

const Explore = () => (
  <ExploreSection>
    <Navbar />
    <Container>
      <SectionTitle>Recommended for You</SectionTitle>
      <SliderWithArrows>
        {recommendedTreks.map((trek, idx) => (
          <TrekCard key={idx}>
            <TrekImage style={{ backgroundImage: `url(${trek.image})` }}>
              <TrekTags>
                <Tag>{trek.state}</Tag>
                <DifficultyTag>{trek.difficulty}</DifficultyTag>
              </TrekTags>
              <PriceTag>{trek.price}</PriceTag>
            </TrekImage>
            <TrekInfo>
              <TrekTitle>{trek.title}</TrekTitle>
              <TrekLocation><LocationIcon />{trek.location}</TrekLocation>
              <TrekMetaRow>
                <MetaItem><DaysIcon />{trek.days} Days</MetaItem>
                <Difficulty>{trek.difficulty}</Difficulty>
              </TrekMetaRow>
              <TrekRating><StarIcon />{trek.rating} <span style={{color:'#7d7d7d', fontWeight:400}}>({trek.reviews} reviews)</span></TrekRating>
            </TrekInfo>
          </TrekCard>
        ))}
      </SliderWithArrows>
      <SectionTitle>Popular Treks</SectionTitle>
      <SliderWithArrows>
        {popularTreks.map((trek, idx) => (
          <TrekCard key={idx}>
            <TrekImage style={{ backgroundImage: `url(${trek.image})` }}>
              <TrekTags>
                <Tag>{trek.state}</Tag>
                <DifficultyTag>{trek.difficulty}</DifficultyTag>
              </TrekTags>
              <PriceTag>{trek.price}</PriceTag>
            </TrekImage>
            <TrekInfo>
              <TrekTitle>{trek.title}</TrekTitle>
              <TrekLocation><LocationIcon />{trek.location}</TrekLocation>
              <TrekMetaRow>
                <MetaItem><DaysIcon />{trek.days} Days</MetaItem>
                <Difficulty>{trek.difficulty}</Difficulty>
              </TrekMetaRow>
              <TrekRating><StarIcon />{trek.rating} <span style={{color:'#7d7d7d', fontWeight:400}}>({trek.reviews} reviews)</span></TrekRating>
            </TrekInfo>
          </TrekCard>
        ))}
      </SliderWithArrows>
      <SectionTitle>Active Groups</SectionTitle>
      <SliderWithArrows>
        {activeGroups.map((group, idx) => (
          <TrekCard key={idx}>
            <TrekImage style={{ backgroundImage: `url(${groupImg})` }}>
              <TrekTags>
                <GroupTag>Group</GroupTag>
              </TrekTags>
              <BadgeTag>{group.xp || '80 XP'}</BadgeTag>
            </TrekImage>
            <TrekInfo>
              <TrekTitle>{group.name}</TrekTitle>
              <TrekLocation>
                <LocationIcon />{group.members} members
              </TrekLocation>
              <TrekMetaRow>
                <MetaItem><DaysIcon />Active</MetaItem>
                <Difficulty>Open</Difficulty>
              </TrekMetaRow>
              <ActionButton>Join Group</ActionButton>
            </TrekInfo>
          </TrekCard>
        ))}
      </SliderWithArrows>
      <SectionTitle>Upcoming Events</SectionTitle>
      <SliderWithArrows>
        {upcomingEvents.map((event, idx) => (
          <TrekCard key={idx}>
            <TrekImage style={{ backgroundImage: `url(${eventImg})` }}>
              <TrekTags>
                <EventTag>Event</EventTag>
              </TrekTags>
              <BadgeTag>{event.xp || event.date}</BadgeTag>
            </TrekImage>
            <TrekInfo>
              <TrekTitle>{event.name}</TrekTitle>
              <TrekLocation>
                <LocationIcon />Online/Offline
              </TrekLocation>
              <TrekMetaRow>
                <MetaItem><DaysIcon />Soon</MetaItem>
                <Difficulty>Upcoming</Difficulty>
              </TrekMetaRow>
              <EventButton>Register</EventButton>
            </TrekInfo>
          </TrekCard>
        ))}
      </SliderWithArrows>
    </Container>
    <Footer />
  </ExploreSection>
);

export default Explore; 