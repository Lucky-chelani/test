import React from 'react';
import styled from 'styled-components';
import { FaMountain, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrganizerCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #333;
  
  /* Ensure it doesn't overflow its parent */
  width: 100%; 
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const OrganizerHeader = styled.div`
  display: flex;
  align-items: center; /* Aligns icon and text vertically */
  margin-bottom: 1rem;
  gap: 0.75rem;
`;

const OrganizerIcon = styled.div`
  background: linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  
  /* CRITICAL FOR RESPONSIVENESS: Prevents icon from squashing on small screens */
  flex-shrink: 0; 
`;

const OrganizerInfo = styled.div`
  flex: 1;
  /* Ensures text truncate works if you add it later */
  min-width: 0; 
`;

const OrganizerName = styled.h4`
  margin: 0 0 0.25rem 0;
  color: #000;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  
  /* RESPONSIVE FIX: Handle long names on small screens */
  flex-wrap: wrap; 
  line-height: 1.3;
  
  svg {
    color: #4CC9F0;
    font-size: 0.9rem;
    flex-shrink: 0; /* Prevents checkmark from squashing */
  }
`;

const OrganizerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #000;
  font-size: 0.85rem;
  
  /* RESPONSIVE FIX: Allow items to stack on very small phones (Galaxy Fold/iPhone SE) */
  flex-wrap: wrap; 
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap; /* Keeps icon and text together */
  
  svg {
    color: #4a5568;
  }
`;

const OrganizerBody = styled.div`
  margin-bottom: 1.25rem;
  color: #000;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const OrganizerAction = styled.div`
  margin-top: auto;
  width: 100%; /* Ensure container is full width */
`;

const ViewMoreButton = styled(Link)`
  background: rgba(67, 97, 238, 0.1);
  color: #4361EE;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center; /* Centers text if button gets wider */
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(67, 97, 238, 0.2);
    text-decoration: none;
  }
  
  svg {
    font-size: 0.85rem;
  }

  /* RESPONSIVE FIX: Make button full width on mobile for better touch target */
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.8rem; /* Slightly larger tap area */
  }
`;

const OrganizerCard = ({ name, description, verified, trekCount, experience, id, inTrekDetails = false }) => {
  return (
    <OrganizerCardContainer inTrekDetails={inTrekDetails}>
      <OrganizerHeader>
        <OrganizerIcon>
          <FaMountain />
        </OrganizerIcon>
        
        <OrganizerInfo>
          <OrganizerName inTrekDetails={inTrekDetails}>
            {name}
            {verified && <FaCheckCircle />}
          </OrganizerName>
          
          <OrganizerMeta inTrekDetails={inTrekDetails}>
            <MetaItem inTrekDetails={inTrekDetails}>
              <FaMountain /> {trekCount || 0} Treks
            </MetaItem>
            
            {experience && (
              <MetaItem inTrekDetails={inTrekDetails}>
                <FaClock /> {experience}
              </MetaItem>
            )}
          </OrganizerMeta>
        </OrganizerInfo>
      </OrganizerHeader>
      
      <OrganizerBody inTrekDetails={inTrekDetails}>
        {description || 'Experienced trek organizer providing amazing trekking experiences.'}
      </OrganizerBody>
      
      <OrganizerAction>
        <ViewMoreButton to={`/organizer/${id}`} inTrekDetails={inTrekDetails}>
          View more treks by this organizer
        </ViewMoreButton>
      </OrganizerAction>
    </OrganizerCardContainer>
  );
};

export default OrganizerCard;