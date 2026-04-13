import styled, { keyframes } from "styled-components";
import { FiUser, FiMapPin, FiAward, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { FaShieldAlt, FaMountain, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(249,115,22,0.4)",
    primary: "#f97316",
    primaryDark: "#c2410c",
    primaryLight: "#fb923c",
    primaryGlow: "rgba(249, 115, 22, 0.15)",
    primaryBorder: "rgba(249, 115, 22, 0.3)",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748b",
    surface1: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.06)",
    success: "#22c55e",
    successBg: "rgba(34, 197, 94, 0.1)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", xxl: "24px" },
  transition: { base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", fast: "all 0.15s ease" },
};

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
  50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// ============================================================
// STYLED COMPONENTS
// ============================================================
const SectionWrapper = styled.section`
  width: 100%;
  margin: 2rem 0;
  animation: ${fadeUp} 0.6s ease-out both;
  animation-delay: 0.2s;

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const SectionCard = styled.div`
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xxl};
  overflow: hidden;
  position: relative;
  transition: ${tokens.transition.base};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${tokens.colors.primary} 0%,
      ${tokens.colors.primaryLight} 50%,
      ${tokens.colors.primary} 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }

  &:hover {
    border-color: ${tokens.colors.borderHover};
    box-shadow: 0 20px 60px rgba(249, 115, 22, 0.15);
  }

  @media (max-width: 768px) {
    border-radius: ${tokens.radius.md};

    &::before {
      height: 3px;
    }
  }
`;

const CardHeader = styled.div`
  padding: 2rem 2.5rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.05) 0%,
    rgba(249, 115, 22, 0.02) 100%
  );
  border-bottom: 1px solid ${tokens.colors.border};
  animation: ${slideInLeft} 0.5s ease-out both;
  animation-delay: 0.3s;

  @media (max-width: 768px) {
    padding: 1rem 1rem 0.75rem;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  @media (max-width: 640px) {
    margin-bottom: 0;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    gap: 0.625rem;
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${tokens.radius.md};
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
    animation: none;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  }
`;

const SectionTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${tokens.colors.textPrimary};
  letter-spacing: -0.02em;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 640px) {
    display: none;
  }
`;

const CardBody = styled.div`
  padding: 2.5rem;
  animation: ${slideInRight} 0.5s ease-out both;
  animation-delay: 0.4s;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const OrganizerCard = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  padding: 2rem;
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  cursor: pointer;
  transition: ${tokens.transition.base};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(249, 115, 22, 0.05) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${tokens.colors.surface2};
    border-color: ${tokens.colors.primary};
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(249, 115, 22, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
  }

  /* ── MOBILE: stack avatar+info row, then action row ── */
  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.875rem;
    border-radius: ${tokens.radius.md};

    &:hover {
      transform: none;
    }
  }
`;

/* NEW: wraps avatar + info side-by-side on mobile */
const MobileTopRow = styled.div`
  display: contents; /* transparent on desktop – children go into grid normally */

  @media (max-width: 640px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }
`;

const AvatarSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;

  @media (max-width: 640px) {
    width: 56px;
    height: 56px;
  }
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${tokens.radius.lg};
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Sora", sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 12px 32px rgba(249, 115, 22, 0.4);
  transition: ${tokens.transition.base};
  animation: ${glow} 3s ease-in-out infinite;

  ${OrganizerCard}:hover & {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 16px 48px rgba(249, 115, 22, 0.6);
  }

  @media (max-width: 640px) {
    font-size: 1.5rem;
    border-radius: ${tokens.radius.sm};
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    animation: none;

    ${OrganizerCard}:hover & {
      transform: none;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }
  }
`;

const VerifiedBadgeIcon = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  background: ${tokens.colors.success};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${tokens.colors.bgCard};
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  z-index: 2;
  animation: ${pulse} 2s ease-in-out infinite;

  svg {
    width: 14px;
    height: 14px;
    color: white;
  }

  @media (max-width: 640px) {
    width: 20px;
    height: 20px;
    bottom: -2px;
    right: -2px;
    border-width: 2px;
    animation: none;

    svg {
      width: 10px;
      height: 10px;
    }
  }
`;

const InfoSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.375rem;
    margin-bottom: 0.375rem;
    flex-wrap: nowrap;
  }
`;

const OrganizerName = styled.h3`
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    font-size: 0.9375rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${tokens.colors.successBg};
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${tokens.radius.sm};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${tokens.colors.success};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    width: 11px;
    height: 11px;
  }

  @media (max-width: 640px) {
    padding: 0.2rem 0.4rem;
    font-size: 0.5625rem;
    gap: 0.2rem;
    flex-shrink: 0;

    svg {
      width: 8px;
      height: 8px;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 640px) {
    /* inline row of stats beneath the name */
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 0.375rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: rgba(249, 115, 22, 0.05);
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: ${tokens.radius.sm};
  transition: ${tokens.transition.fast};

  &:hover {
    background: rgba(249, 115, 22, 0.1);
    border-color: ${tokens.colors.primaryBorder};
  }

  @media (max-width: 640px) {
    padding: 0.3rem 0.5rem;
    gap: 0.3rem;
    border-radius: 6px;
    flex-shrink: 0;
  }
`;

const StatIcon = styled.div`
  font-size: 1.125rem;
  flex-shrink: 0;
  line-height: 1; /* keeps emoji vertically centred */

  @media (max-width: 640px) {
    font-size: 0.8125rem;
  }
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

const StatValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${tokens.colors.primary};
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

const StatLabel = styled.span`
  font-size: 0.6875rem;
  color: ${tokens.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 640px) {
    font-size: 0.5rem;
  }
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 900px) {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 640px) {
    flex-direction: row;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid ${tokens.colors.border};
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
`;

const ViewProfileButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${tokens.radius.md};
  font-family: "Inter", sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: ${tokens.transition.base};
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
  position: relative;
  overflow: hidden;
  white-space: nowrap;

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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(249, 115, 22, 0.5);

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
    font-size: 1.125rem;
    transition: transform 0.3s ease;
  }

  @media (max-width: 900px) {
    flex: 1;
  }

  @media (max-width: 640px) {
    flex: 1;
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
    border-radius: ${tokens.radius.sm};
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    gap: 0.375rem;

    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
    }

    .arrow {
      font-size: 0.875rem;
    }
  }
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: ${tokens.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  color: #fbbf24;

  svg {
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.25rem;

    svg {
      font-size: 0.875rem;
    }
  }
`;

const DescriptionSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.lg};
  animation: ${fadeUp} 0.5s ease-out both;
  animation-delay: 0.5s;

  @media (max-width: 640px) {
    margin-top: 1rem;
    padding: 0.875rem;
    border-radius: ${tokens.radius.md};
  }
`;

const DescriptionTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📋';
    font-size: 1.125rem;
  }

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    margin-bottom: 0.5rem;
    gap: 0.375rem;

    &::before {
      font-size: 0.875rem;
    }
  }
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: ${tokens.colors.textSecondary};
  line-height: 1.7;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    line-height: 1.6;
  }
`;

// ============================================================
// COMPONENT
// ============================================================
export default function MeetOrganizer({
  organizerName,
  organizerId,
  organizerVerified,
  organizerTrekCount,
  organizerExperience,
  organizerDescription,
}) {
  const navigate = useNavigate();

  if (!organizerName && !organizerId) return null;

  const handleClick = () => {
    if (organizerId) {
      navigate(`/organizer/${organizerId}`);
    }
  };

  const avatarLetter = (organizerName || "O").charAt(0).toUpperCase();

  return (
    <SectionWrapper>
      <SectionCard>
        <CardHeader>
          <HeaderTop>
            <TitleGroup>
              <IconWrapper>
                <FiUser />
              </IconWrapper>
              <div>
                <SectionTitle>Meet Your Trek Organizer</SectionTitle>
                <Subtitle>Expert-led adventures & professional guidance</Subtitle>
              </div>
            </TitleGroup>
          </HeaderTop>
        </CardHeader>

        <CardBody>
          <OrganizerCard
            onClick={handleClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/*
              MobileTopRow is transparent on desktop (display:contents),
              so the three grid columns work as before.
              On mobile it becomes a flex row: avatar | info side-by-side.
            */}
            <MobileTopRow>
              <AvatarSection>
                <AvatarWrapper>
                  <Avatar>{avatarLetter}</Avatar>
                  {organizerVerified && (
                    <VerifiedBadgeIcon>
                      <FaShieldAlt />
                    </VerifiedBadgeIcon>
                  )}
                </AvatarWrapper>
              </AvatarSection>

              <InfoSection>
                <NameRow>
                  <OrganizerName>{organizerName || "Trek Organizer"}</OrganizerName>
                  {organizerVerified && (
                    <VerifiedBadge>
                      <FaShieldAlt /> Verified
                    </VerifiedBadge>
                  )}
                </NameRow>

                <StatsGrid>
                  {organizerTrekCount && (
                    <StatItem>
                      <StatIcon>🏔️</StatIcon>
                      <StatContent>
                        <StatValue>{organizerTrekCount}</StatValue>
                        <StatLabel>Treks Led</StatLabel>
                      </StatContent>
                    </StatItem>
                  )}
                  {organizerExperience && (
                    <StatItem>
                      {/* fixed: icon sits beside value, not above it */}
                      <StatIcon>⏱️</StatIcon>
                      <StatContent>
                        <StatValue>{organizerExperience}</StatValue>
                        <StatLabel>Experience</StatLabel>
                      </StatContent>
                    </StatItem>
                  )}
                </StatsGrid>
              </InfoSection>
            </MobileTopRow>

            <ActionSection>
              <RatingBadge>
                <FaStar /> 4.9
              </RatingBadge>
              <ViewProfileButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Change 1: button label */}
                <span>More Treks</span>
                <FiArrowRight className="arrow" />
              </ViewProfileButton>
            </ActionSection>
          </OrganizerCard>

          {organizerDescription && (
            <DescriptionSection>
              <DescriptionTitle>About the Organizer</DescriptionTitle>
              <Description>{organizerDescription}</Description>
            </DescriptionSection>
          )}
        </CardBody>
      </SectionCard>
    </SectionWrapper>
  );
}