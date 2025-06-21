import React from 'react';
import styled from 'styled-components';
import { FaMountain, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrganizerCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: #fff;  /* Always white background for better contrast with black text */
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #333;  
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
  align-items: center;
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
  flex-shrink: 0;
`;

const OrganizerInfo = styled.div`
  flex: 1;
`;

const OrganizerName = styled.h4`
  margin: 0 0 0.25rem 0;
  color: #000;  /* Changed to always use black color */
  font-weight: 600;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    color: #4CC9F0;
    font-size: 0.9rem;
  }
`;

const OrganizerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #000;  /* Changed to always use black color */
  font-size: 0.85rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    color: #4a5568;  /* Changed to a consistent dark color */
  }
`;

const OrganizerBody = styled.div`
  margin-bottom: 1.25rem;
  color: #000;  /* Changed to always use black color */
  font-size: 0.95rem;
  line-height: 1.6;
`;

const OrganizerAction = styled.div`
  margin-top: auto;
`;

const ViewMoreButton = styled(Link)`
  background: rgba(67, 97, 238, 0.1);
  color: #4361EE;  /* Using a consistent blue color that will be visible on any background */
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s;
    &:hover {
    background: rgba(67, 97, 238, 0.2);
      : 'rgba(67, 97, 238, 0.2)'};
    text-decoration: none;
  }
  
  svg {
    font-size: 0.85rem;
  }
`;

/**
 * OrganizerCard component to display trek organizer information
 * @param {Object} props - Component props
 * @param {string} props.name - Organizer name or organization name
 * @param {string} props.description - Organizer description
 * @param {boolean} props.verified - Whether the organizer is verified
 * @param {number} props.trekCount - Number of treks by this organizer
 * @param {string} props.experience - Organizer experience level
 * @param {string} props.id - Organizer ID for linking to profile
 * @param {boolean} props.inTrekDetails - Whether this card is shown in trek details page (for styling)
 */
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
