import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Design tokens matching your app theme
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    border: "rgba(255,255,255,0.07)",
    primary: "#f97316",
    primaryDark: "#c2410c",
    primaryLight: "#fb923c",
    textPrimary: "#F1F5F9",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    success: "#10b981",
    successBg: "rgba(16, 185, 129, 0.1)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px" },
  transition: { base: "all 0.25s ease" },
};

// Styled Components
const Card = styled.div`
  background: ${tokens.colors.bgCard};
  border-radius: ${tokens.radius.lg};
  padding: 1.5rem;
  cursor: pointer;
  transition: ${tokens.transition.base};
  border: 1px solid ${tokens.colors.border};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${tokens.colors.primary} 0%,
      ${tokens.colors.primaryLight} 100%
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: ${tokens.colors.primary};
    box-shadow: 0 12px 32px rgba(249, 115, 22, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary} 0%,
    ${tokens.colors.primaryDark} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
  transition: ${tokens.transition.base};

  ${Card}:hover & {
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
    transform: scale(1.05);
  }
`;

const VerifiedBadgeIcon = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  background: ${tokens.colors.success};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${tokens.colors.bgCard};
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);

  svg {
    width: 12px;
    height: 12px;
    color: white;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const Name = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  font-family: 'Sora', sans-serif;
  margin: 0;
  line-height: 1.3;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${tokens.colors.success};
  background: ${tokens.colors.successBg};
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    width: 10px;
    height: 10px;
  }
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${tokens.colors.textSecondary};
  flex-wrap: wrap;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;

  .icon {
    font-size: 1rem;
  }

  .label {
    color: ${tokens.colors.textMuted};
    font-size: 0.8125rem;
  }

  .value {
    color: ${tokens.colors.primary};
    font-weight: 600;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${tokens.colors.border};
  margin: 1rem 0;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 1.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ViewProfileBtn = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary} 0%,
    ${tokens.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: ${tokens.radius.md};
  font-weight: 700;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: ${tokens.transition.base};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);

    &::before {
      left: 100%;
    }

    .arrow {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  .arrow {
    transition: transform 0.3s ease;
    font-size: 1.125rem;
  }
`;

const OrganizerCard = ({ 
  id,
  name, 
  trekCount = 0, 
  verified = false, 
  description,
  experience 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate(`/organizer/${id}`);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (id) {
      navigate(`/organizer/${id}`);
    }
  };

  const avatarLetter = name ? name.charAt(0).toUpperCase() : "O";

  return (
    <Card onClick={handleCardClick}>
      <Header>
        <AvatarWrapper>
          <Avatar>{avatarLetter}</Avatar>
          {verified && (
            <VerifiedBadgeIcon>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </VerifiedBadgeIcon>
          )}
        </AvatarWrapper>
        
        <Info>
          <NameRow>
            <Name>{name}</Name>
            {verified && (
              <VerifiedBadge>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Verified
              </VerifiedBadge>
            )}
          </NameRow>
          
          <Stats>
            <StatItem>
              <span className="icon">🏔️</span>
              <span className="value">{trekCount}</span>
              <span className="label">Trek{trekCount !== 1 ? 's' : ''}</span>
            </StatItem>
            {experience && (
              <StatItem>
                <span className="icon">⏱️</span>
                <span className="value">{experience}</span>
              </StatItem>
            )}
          </Stats>
        </Info>
      </Header>

      {description && (
        <>
          <Divider />
          <Description>{description}</Description>
        </>
      )}

      <ViewProfileBtn onClick={handleButtonClick}>
        <span>View Organizer Profile</span>
        <span className="arrow">→</span>
      </ViewProfileBtn>
    </Card>
  );
};

export default OrganizerCard;