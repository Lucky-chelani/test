import React from "react";
import styled, { keyframes } from "styled-components";
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight, FiShield } from 'react-icons/fi';
import { 
  FaMountain, FaMapMarkedAlt, FaLeaf, FaSnowflake, FaSun, FaCloudRain 
} from 'react-icons/fa';

// --- HELPER FUNCTION ---
const getSeasonIcon = (season) => {
  if (!season) return <FaSun />;
  const s = season.toLowerCase();
  if (s.includes('winter') || s.includes('snow')) return <FaSnowflake />;
  if (s.includes('monsoon') || s.includes('rain')) return <FaCloudRain />;
  if (s.includes('spring') || s.includes('autumn')) return <FaLeaf />;
  return <FaSun />;
};

// --- STYLED COMPONENTS ---

const CardWrapper = styled.div`
  /* Modern Dark Glass Aesthetic */
  background: rgba(30, 41, 59, 0.75); 
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  
  position: relative;
  width: 100%;
  max-width: 400px; /* Default max-width for desktop sidebar */
  transition: transform 0.3s ease;

  /* Top Gradient Line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6366F1, #A855F7);
  }

  /* --- RESPONSIVE ADJUSTMENTS --- */
  @media (max-width: 1024px) {
    max-width: 100%; /* Full width on tablets/mobile if needed */
  }

  @media (max-width: 768px) {
    border-radius: 20px;
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.4);
  }
`;

const BookingHeader = styled.div`
  padding: 2rem 2rem 1.5rem;
  background: linear-gradient(to bottom, rgba(255,255,255,0.03), transparent);

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem 1.25rem;
  }
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap; /* Allows wrapping on very small screens */
`;

const Price = styled.div`
  /* Fluid Typography: Scales between 1.75rem and 2.25rem */
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  
  background: linear-gradient(to right, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PricePerPerson = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #94a3b8;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PriceCaption = styled.div`
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    min-width: 6px; /* Prevents shrinking */
    background: #4ADE80; 
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const BookingDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 2rem;

  @media (max-width: 480px) {
    margin: 0 1.25rem;
  }
`;

const BookingBody = styled.div`
  padding: 2rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }
`;

const BookingDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 1rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    gap: 1.25rem 0.75rem; /* Tighter gap on mobile */
    margin-bottom: 1.5rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* Critical for text-overflow to work in grid */
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;

  svg {
    font-size: 0.9rem;
    color: #6366F1;
    flex-shrink: 0; /* Prevents icon from squishing */
  }
`;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  
  /* Robust text truncation */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.95rem; /* Slightly smaller on mobile */
  }
`;

const BookNowBtn = styled.button`
  width: 100%;
  padding: 1.1rem;
  
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: #ffffff;
  
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(79, 70, 229, 0.4);
    
    &::after {
      left: 100%;
    }

    svg {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const SecureText = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  svg {
    color: #10B981;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-top: 0.75rem;
  }
`;

// --- COMPONENT ---

const BookingCard = ({ 
  trekPrice, 
  trekDays, 
  trekLocation, 
  trekDifficulty, 
  trekCapacity, 
  trekSeason, 
  trekAltitude, 
  onBookClick 
}) => {
  return (
    <CardWrapper>
      <BookingHeader>
        <PriceTag>
          <PriceRow>
            <Price>{trekPrice}</Price>
            <PricePerPerson>per person</PricePerPerson>
          </PriceRow>
          <PriceCaption>
            All-inclusive • {trekDays} {trekDays === 1 ? 'day' : 'days'} adventure
          </PriceCaption>
        </PriceTag>
      </BookingHeader>
      
      <BookingDivider />

      <BookingBody>
        <BookingDetailsGrid>
          <DetailItem>
            <DetailLabel>
              <FiCalendar /> Duration
            </DetailLabel>
            <DetailValue>{trekDays} {trekDays === 1 ? 'Day' : 'Days'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>
              <FiMapPin /> Location
            </DetailLabel>
            <DetailValue title={trekLocation}>{trekLocation}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>
              <FaMountain /> Difficulty
            </DetailLabel>
            <DetailValue>{trekDifficulty}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>
              <FiUsers /> Group Size
            </DetailLabel>
            <DetailValue>Max {trekCapacity}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>
              {getSeasonIcon(trekSeason)} Season
            </DetailLabel>
            <DetailValue>{trekSeason}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>
              <FaMapMarkedAlt /> Altitude
            </DetailLabel>
            <DetailValue>{trekAltitude}</DetailValue>
          </DetailItem>
        </BookingDetailsGrid>

        <BookNowBtn onClick={onBookClick}>
          Book This Trek
          <FiArrowRight />
        </BookNowBtn>
        
        <SecureText>
          <FiShield /> No payment required today
        </SecureText>
      </BookingBody>
    </CardWrapper>
  );
};

export default BookingCard;