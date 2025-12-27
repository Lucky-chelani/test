import React from 'react';
import styled from 'styled-components';
import { FiCalendar, FiCheck } from 'react-icons/fi';

const Container = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Month = styled.div`
  background: ${props => props.selected 
    ? 'rgba(90, 220, 128, 0.2)' 
    : 'rgba(255, 255, 255, 0.08)'};
  border: 1px solid ${props => props.selected 
    ? 'rgba(90, 220, 128, 0.4)' 
    : 'rgba(255, 255, 255, 0.12)'};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.selected 
      ? 'rgba(90, 220, 128, 0.25)' 
      : 'rgba(255, 255, 255, 0.12)'};
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.selected 
      ? 'rgba(90, 220, 128, 0.7)' 
      : 'transparent'};
    transition: all 0.2s;
  }
`;

const MonthName = styled.div`
  font-weight: 600;
  /* ... color logic ... */
  
  /* Add this to prevent layout breaking on tiny screens */
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis; 
  
  @media (max-width: 380px) {
    font-size: 0.8rem; /* Scale down text slightly on tiny phones */
  }
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  color: rgba(90, 220, 128, 0.9);
  font-size: 0.8rem;
`;

const HelpText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 12px;
  margin-bottom: 0;
`;

/**
 * Month Availability Selector Component
 */
const MonthAvailability = ({ availableMonths = [], onChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];
  
  // Toggle month selection
  const toggleMonth = (monthIndex) => {
    if (availableMonths.includes(monthIndex)) {
      // Remove month
      onChange(availableMonths.filter(m => m !== monthIndex));
    } else {
      // Add month
      onChange([...availableMonths, monthIndex].sort((a, b) => a - b));
    }
  };
  
  return (
    <Container>
      <Title>
        <FiCalendar /> Trek Availability
      </Title>
      
      <MonthsGrid>
        {months.map((month, index) => (
          <Month 
            key={index}
            selected={availableMonths.includes(index)}
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              toggleMonth(index);
            }}
          >
            <MonthName selected={availableMonths.includes(index)}>
              {month}
            </MonthName>
            {availableMonths.includes(index) && (
              <CheckIcon>
                <FiCheck />
              </CheckIcon>
            )}
          </Month>
        ))}
      </MonthsGrid>
      
      <HelpText>
        Select months when this trek is available for booking. 
        This will restrict bookings to only these months.
      </HelpText>
    </Container>
  );
};

export default MonthAvailability;
