import React from "react";
import styled from "styled-components";
import OrganizerCard from "../OrganizerCard"; 

// Design tokens
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    border: "rgba(255,255,255,0.07)",
    primary: "#f97316",
    textPrimary: "#F1F5F9",
    textMuted: "#64748b",
  },
  radius: { lg: "16px", xl: "20px" },
};

// Styled Components
const Section = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const SectionHeader = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  font-family: 'Sora', sans-serif;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '👤';
    font-size: 1.125rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  margin: 0;
`;

const OrganizerWrapper = styled.div`
  width: 100%;
  
  /* Override any default card styles for sidebar context */
  & > div {
    background: ${tokens.colors.bgCard};
    border: 1px solid ${tokens.colors.border};
  }
`;

// Component
const OrganizerSection = ({ 
  organizerId, 
  organizerName, 
  trekCount, 
  verified, 
  description, 
  experience 
}) => {
  // Guard clause
  if (!organizerId || !organizerName) return null;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Meet Your Organizer</SectionTitle>
        <SectionSubtitle>Experienced trek leader & guide</SectionSubtitle>
      </SectionHeader>
      
      <OrganizerWrapper>
        <OrganizerCard 
          id={organizerId}
          name={organizerName}
          trekCount={trekCount}
          verified={verified}
          description={description}
          experience={experience}
        />
      </OrganizerWrapper>
    </Section>
  );
};

export default OrganizerSection;