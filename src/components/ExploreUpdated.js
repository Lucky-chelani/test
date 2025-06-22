import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import trek1 from '../assets/images/trek1.png';
import Footer from './Footer';
import groupImg from '../assets/images/trek1.png';
import eventImg from '../assets/images/trek1.png';
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiUsers, FiInfo, FiTrendingUp, FiAward, FiSearch, FiX } from 'react-icons/fi';
import { FaMountain, FaStar, FaUserAlt } from 'react-icons/fa';
import { RiCommunityFill } from 'react-icons/ri';
import { MdEventAvailable } from 'react-icons/md';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useSearch } from '../context/SearchContext';
import { ActionButton, EventButton, BadgeTag } from './ExploreComponents';

// Adding required fonts for premium trek card design
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
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
  font-family: 'Inter', sans-serif;
  
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
const PageTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #ffffff, #5390D9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

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
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
`;

// Sections Components
const SectionContainer = styled.div`
  margin-bottom: 60px;
`;

const SectionTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  background: linear-gradient(90deg, #fff 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
`;

const SectionUnderline = styled.div`
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #5390D9, #7400B8);
  margin-top: 8px;
  border-radius: 2px;
`;

// UPDATED CARD COMPONENTS - Clean and Premium Style
// Premium Trek Card Component
const TrekCard = styled.div`
  width: 100%;
  max-width: 320px;
  border-radius: 16px;
  background-color: #0d0f14;
  color: white;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  flex: 0 0 320px;
  scroll-snap-align: start;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 1200px) {
    max-width: 300px;
    flex: 0 0 300px;
  }
  
  @media (max-width: 768px) {
    max-width: 85%;
    flex: 0 0 85%;
  }
  
  @media (max-width: 480px) {
    max-width: 90%;
    flex: 0 0 90%;
  }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 220px;
  width: 100%;
  overflow: hidden;
`;

const TrekImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
  
  ${TrekCard}:hover & {
    transform: scale(1.05);
  }
`;

const DifficultyTag = styled.div`
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

// Tags for admin-assigned categories
const TagsContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  z-index: 10;
  justify-content: flex-end;
  max-width: 70%;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: rgba(76, 29, 149, 0.9);
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const FeaturedBadge = styled(Tag)`
  background-color: rgba(245, 158, 11, 0.9);
  margin-bottom: 8px;
`;

const OrganizerRow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 5;
`;

const OrganizerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.9rem;
  color: white;
  background: rgba(124, 58, 237, 0.6);
  border-radius: 50%;
  padding: 4px;
`;

const OrganizerText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
`;

const OrganizerName = styled.span`
  font-weight: 600;
`;

const TrekInfo = styled.div`
  padding: 20px;
  background: #0d0f14;
  color: #ffffff;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (max-width: 480px) {
    padding: 16px;
    gap: 10px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  color: #ffffff;
`;

const MetaDataRow = styled.div`
  display: flex;
  align-items: center;
  color: #a1a1aa;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 4px;
`;

const MetaDataDot = styled.span`
  margin: 0 6px;
  opacity: 0.6;
`;

const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e4e4e7;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  
  svg {
    color: #fbbf24;
    font-size: 14px;
  }
  
  span.reviews {
    color: #a1a1aa;
    font-weight: 400;
    font-size: 12px;
    margin-left: 2px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const PriceTag = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  
  span {
    font-size: 14px;
    margin-right: 1px;
    font-weight: 400;
    opacity: 0.8;
  }
  
  .unit {
    font-size: 12px;
    color: #a1a1aa;
    margin-left: 2px;
    font-weight: 400;
  }
`;

const ViewButton = styled.button`
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #7c3aed;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #8b5cf6;
    transform: translateY(-2px);
  }
`;

// Star Rating Components
const StarContainer = styled.div`
  display: flex;
  margin-right: 3px;
`;

const Star = styled.span`
  margin-right: 1px;
  color: #fbbf24;
  font-size: 14px;
`;

// Create a similar styled card for groups and events
const GroupCard = styled(TrekCard)``;
const EventCard = styled(TrekCard)``;

export default function Explore() {
  const navigate = useNavigate();
  const { searchQuery, updateSearchQuery, searchTreks } = useSearch();
  const [treks, setTreks] = useState([]);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const trekSliderRef = useRef(null);
  const groupSliderRef = useRef(null);
  const eventSliderRef = useRef(null);
  
  // Fetch treks data from Firestore
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        
        // Get treks collection
        const treksCollection = collection(db, 'treks');
        const treksSnapshot = await getDocs(treksCollection);
        
        const treksData = treksSnapshot.docs
          .filter(doc => doc.id !== "placeholder" && doc.data().title)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        
        // Set mock data for groups and events if they don't exist yet
        setTreks(treksData);
        setFilteredTreks(treksData);
        
        // Mock groups and events data
        const mockGroups = [
          {
            id: 'group1',
            title: 'Himalayan Explorers',
            memberCount: 235,
            image: groupImg,
            description: 'A community of passionate trekkers exploring the Himalayas.',
            tags: ['Himalayas', 'Experienced']
          },
          {
            id: 'group2',
            title: 'Weekend Wanderers',
            memberCount: 189,
            image: groupImg,
            description: 'Join weekend treks around popular destinations.',
            tags: ['Weekend Trips', 'Beginners']
          },
          {
            id: 'group3',
            title: 'Adventure Seekers',
            memberCount: 320,
            image: groupImg,
            description: 'For those who seek thrill and adventure in the mountains.',
            tags: ['Adventure', 'Difficult']
          }
        ];
        
        const mockEvents = [
          {
            id: 'event1',
            title: 'Annual Himalayan Fest',
            date: 'July 25-28, 2023',
            image: eventImg,
            location: 'Manali',
            tags: ['Festival', 'Community']
          },
          {
            id: 'event2',
            title: 'Trekking Workshop',
            date: 'August 12, 2023',
            image: eventImg,
            location: 'Delhi',
            tags: ['Workshop', 'Beginners']
          },
          {
            id: 'event3',
            title: 'Photography Trek',
            date: 'September 5-10, 2023',
            image: eventImg,
            location: 'Ladakh',
            tags: ['Photography', 'Intermediate']
          }
        ];
        
        setGroups(mockGroups);
        setEvents(mockEvents);
        
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchQuery(localSearchValue);
    
    // Filter treks based on search query
    if (localSearchValue.trim() === '') {
      setFilteredTreks(treks);
    } else {
      const filtered = treks.filter(trek => 
        trek.title?.toLowerCase().includes(localSearchValue.toLowerCase()) ||
        trek.location?.toLowerCase().includes(localSearchValue.toLowerCase()) ||
        trek.country?.toLowerCase().includes(localSearchValue.toLowerCase()) ||
        trek.description?.toLowerCase().includes(localSearchValue.toLowerCase()) ||
        trek.difficulty?.toLowerCase().includes(localSearchValue.toLowerCase())
      );
      setFilteredTreks(filtered);
    }
  };
  
  const clearSearch = () => {
    setLocalSearchValue('');
    updateSearchQuery('');
    setFilteredTreks(treks);
  };
  
  // Render the TreksSection component
  const TreksSection = ({ sectionId = 'treks' }) => {
    const activeSlider = filteredTreks.length > 0 ? filteredTreks : treks;
    
    return (
      <>
        <SectionTitleContainer>
          <div>
            <SectionTitle>Popular Treks</SectionTitle>
            <SectionUnderline />
          </div>
        </SectionTitleContainer>
        
        <SliderWithArrows data={activeSlider} sectionId={sectionId}>
          {activeSlider.map((trek, idx) => (
            <TrekCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${trek.image})` }} />
                <DifficultyTag>{trek.difficulty || "Easy"}</DifficultyTag>
                
                {/* Dynamic tags container */}
                <TagsContainer>
                  {trek.featured && (
                    <FeaturedBadge>Featured</FeaturedBadge>
                  )}
                  {trek.tags && trek.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
                
                {/* Organizer information */}
                {(trek.organizerName || trek.organizer) && (
                  <OrganizerRow>
                    <OrganizerIcon>
                      <FaUserAlt />
                    </OrganizerIcon>
                    <OrganizerText>
                      Organized by <OrganizerName>{trek.organizerName || trek.organizer || "Local Guide"}</OrganizerName>
                    </OrganizerText>
                  </OrganizerRow>
                )}
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{trek.title}</TrekTitle>
                
                <MetaDataRow>
                  {trek.days} Days <MetaDataDot>·</MetaDataDot> 
                  {trek.location || trek.country || "Location"} <MetaDataDot>·</MetaDataDot> 
                  {trek.season || trek.month || "Year-round"}
                </MetaDataRow>
                
                {trek.rating && (
                  <CardRating>
                    <FaStar /> {trek.rating} 
                    {trek.reviews && <span className="reviews">({trek.reviews} reviews)</span>}
                  </CardRating>
                )}
                
                <CardFooter>
                  <PriceTag>
                    <span>₹</span>{trek.price || "4,999"}
                    <span className="unit">/ person</span>
                  </PriceTag>
                  
                  <ViewButton as={Link} to={`/trek/${trek.id || trek.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    View Trek <FiArrowRight />
                  </ViewButton>
                </CardFooter>
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
    
    const scroll = (direction) => {
      if (sliderRef.current) {
        const { current: slider } = sliderRef;
        const scrollWidth = slider.clientWidth / 2;
        
        if (direction === 'left') {
          slider.scrollBy({ left: -scrollWidth, behavior: 'smooth' });
        } else {
          slider.scrollBy({ left: scrollWidth, behavior: 'smooth' });
        }
      }
    };
    
    return (
      <div style={{ position: 'relative' }}>
        <SliderArrow direction="left" onClick={() => scroll('left')} aria-label="Previous">
          <FiChevronLeft />
        </SliderArrow>
        
        <SliderContainer ref={sliderRef}>
          {children}
        </SliderContainer>
        
        <SliderArrow direction="right" onClick={() => scroll('right')} aria-label="Next">
          <FiChevronRight />
        </SliderArrow>
      </div>
    );
  }

  const SliderContainer = styled.div`
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 20px 10px 40px 10px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  `;

  const SliderArrow = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${props => props.direction === 'left' ? 'left: -15px;' : 'right: -15px;'}
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.2);
    border: 1px solid rgba(124, 58, 237, 0.3);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(124, 58, 237, 0.4);
    }
    
    @media (max-width: 768px) {
      width: 35px;
      height: 35px;
      ${props => props.direction === 'left' ? 'left: -10px;' : 'right: -10px;'}
    }
  `;

  const GroupsSection = () => {
    const activeGroups = groups;
    
    return (
      <>
        <SectionTitleContainer>
          <div>
            <SectionTitle>Trekking Groups</SectionTitle>
            <SectionUnderline />
          </div>
        </SectionTitleContainer>
        
        <SliderWithArrows data={activeGroups} sectionId="groups">
          {activeGroups.map((group, idx) => (
            <GroupCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${group.image})` }} />
                
                {/* Display group tags */}
                <TagsContainer>
                  {group.tags && group.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{group.title}</TrekTitle>
                
                <MetaDataRow>
                  <FiUsers /> <span style={{ marginLeft: '4px' }}>{group.memberCount} Members</span>
                </MetaDataRow>
                
                <div style={{ fontSize: '13px', color: '#a1a1aa', marginTop: '8px', marginBottom: '12px' }}>
                  {group.description}
                </div>
                
                <CardFooter>
                  <ViewButton as={Link} to={`/groups/${group.id}`}>
                    Join Group <FiArrowRight />
                  </ViewButton>
                </CardFooter>
              </TrekInfo>
            </GroupCard>
          ))}
        </SliderWithArrows>
      </>
    );
  };

  const EventsSection = () => {
    const upcomingEvents = events;
    
    return (
      <>
        <SectionTitleContainer>
          <div>
            <SectionTitle>Upcoming Events</SectionTitle>
            <SectionUnderline />
          </div>
        </SectionTitleContainer>
        
        <SliderWithArrows data={upcomingEvents} sectionId="events">
          {upcomingEvents.map((event, idx) => (
            <EventCard key={idx}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${event.image})` }} />
                
                {/* Display event tags */}
                <TagsContainer>
                  {event.tags && event.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{event.title}</TrekTitle>
                
                <MetaDataRow>
                  <FiCalendar /> <span style={{ marginLeft: '4px' }}>{event.date}</span>
                </MetaDataRow>
                
                <MetaDataRow>
                  <FiMapPin /> <span style={{ marginLeft: '4px' }}>{event.location}</span>
                </MetaDataRow>
                
                <CardFooter style={{ marginTop: '16px' }}>
                  <ViewButton as={Link} to={`/events/${event.id}`}>
                    View Event <FiArrowRight />
                  </ViewButton>
                </CardFooter>
              </TrekInfo>
            </EventCard>
          ))}
        </SliderWithArrows>
      </>
    );
  };

  return (
    <ExploreSection>
      <GlobalFonts />
      <MapPatternBackground />
      <Overlay />
      <Container>
        <PageTitle>Explore Treks</PageTitle>
        
        <SearchBarContainer>
          <form onSubmit={handleSearch}>
            <SearchInputWrapper>
              <SearchInputField
                type="text"
                placeholder="Search treks by name, location or difficulty..."
                value={localSearchValue}
                onChange={(e) => setLocalSearchValue(e.target.value)}
              />
              {localSearchValue && (
                <ClearButton type="button" onClick={clearSearch} aria-label="Clear search">
                  <FiX />
                </ClearButton>
              )}
              <SearchButton type="submit" aria-label="Search">
                <FiSearch />
              </SearchButton>
            </SearchInputWrapper>
          </form>
        </SearchBarContainer>

        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px', 
            color: 'white',
            fontSize: '1.2rem'
          }}>
            Loading...
          </div>
        ) : filteredTreks.length === 0 && localSearchValue ? (
          <SearchResultsHeader>
            No treks found matching "{localSearchValue}". Try a different search.
          </SearchResultsHeader>
        ) : (
          <>
            <SectionContainer>
              <TreksSection sectionId="treks" />
            </SectionContainer>
            
            <SectionContainer>
              <GroupsSection />
            </SectionContainer>
            
            <SectionContainer>
              <EventsSection />
            </SectionContainer>
          </>
        )}
      </Container>
      <Footer />
    </ExploreSection>
  );
}
