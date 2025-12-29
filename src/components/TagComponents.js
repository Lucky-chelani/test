import styled from 'styled-components';

// Tag components (These are already good)
export const TagsContainer = styled.div`
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

export const Tag = styled.div`
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

// Organizer components
export const OrganizerRow = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
  
  /* ADD THIS: Prevent row from overflowing card on mobile */
  max-width: calc(100% - 32px); 
`;

export const OrganizerIcon = styled.div`
  width: 30px;
  height: 30px;
  /* Add flex-shrink to prevent icon from squashing */
  flex-shrink: 0; 
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  
  svg {
    font-size: 14px;
  }
`;

export const OrganizerText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* ADD THIS: Text Truncation for mobile safety */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; 
`;

export const OrganizerName = styled.span`
  font-weight: 600;
  color: white;
`;