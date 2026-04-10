
import styled, { keyframes } from "styled-components";
import { FaClock, FaMountain, FaStar, FaUsers, FaCalendarAlt, FaShieldAlt, FaCompass, FaWhatsapp } from "react-icons/fa";
import { FiMapPin, FiTrendingUp, FiZap, FiAward } from "react-icons/fi";

import { useState } from "react";

// ─── Animation Keyframes ──────────────────────────────────────────────────────
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 4px 24px rgba(249, 115, 22, 0.3);
  }
  50% {
    box-shadow: 0 8px 36px rgba(249, 115, 22, 0.5);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const heartBeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(0.98);
  }
  75% {
    transform: scale(1.03);
  }
`;

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bgCard: "#121212",
    bgCardHover: "#1a1a1a",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.15)",
    primary: "#f97316",
    primaryDark: "#ea580c",
    primaryLight: "#fb923c",
    primaryGlow: "rgba(249, 115, 22, 0.15)",
    textPrimary: "#F1F5F9",
    textMuted: "#64748b",
    textSecondary: "#94A3B8",
    success: "#22c55e",
    gold: "#F59E0B",
    whatsapp: "#25d366",
  },
  radius: { lg: "16px", xl: "20px", pill: "100px" },
  transition: { 
    base: "all 0.25s ease", 
    fast: "all 0.15s ease",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  shadows: { 
    card: "0 4px 24px rgba(0,0,0,0.6)",
    cardHover: "0 12px 48px rgba(0,0,0,0.8)"
  },
};

// ─── Styled Components ────────────────────────────────────────────────────────
const BookingCard = styled.div`
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  overflow: hidden;
  box-shadow: ${tokens.shadows.card};
  animation: ${fadeIn} 0.6s ease-out;
  transition: ${tokens.transition.spring};
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${tokens.shadows.cardHover};
    border-color: ${tokens.colors.borderHover};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent,
      ${tokens.colors.primary},
      ${tokens.colors.primaryLight},
      ${tokens.colors.primary},
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }
`;

const BookingCardHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.1),
    rgba(234, 88, 12, 0.05)
  );
  border-bottom: 1px solid ${tokens.colors.border};
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 90% 10%,
      rgba(249, 115, 22, 0.15),
      transparent 40%
    );
    pointer-events: none;
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
  animation: ${scaleIn} 0.4s ease-out;
`;

const PriceAmount = styled.div`
  font-family: "Sora", sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: ${tokens.colors.textPrimary};
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
    transition: width 0.3s ease;
  }

  ${BookingCard}:hover & {
    &::after {
      width: 100%;
    }
  }
`;

const PriceLabel = styled.div`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  transition: ${tokens.transition.base};

  ${BookingCard}:hover & {
    color: ${tokens.colors.primaryLight};
  }
`;

const BookingRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
  animation: ${fadeIn} 0.5s ease-out 0.1s both;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.2rem;
  transition: ${tokens.transition.base};

  ${BookingCard}:hover & {
    transform: scale(1.05);
  }
`;

const StarIcon = styled(FaStar)`
  transition: ${tokens.transition.fast};
  cursor: pointer;

  &:hover {
    transform: scale(1.2) rotate(15deg);
    filter: drop-shadow(0 0 8px ${tokens.colors.gold});
  }
`;

const BookingCardBody = styled.div`
  padding: 1.5rem;
`;

const BookingInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const BookingInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 0;
  border-bottom: 1px solid ${tokens.colors.border};
  gap: 1rem;
  transition: ${tokens.transition.base};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${tokens.colors.primaryGlow};
    transform: translateX(4px);

    &::before {
      width: 4px;
    }
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: ${tokens.colors.primary};
    transition: width 0.3s ease;
  }
`;

const BookingInfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  transition: ${tokens.transition.base};

  svg {
    color: ${tokens.colors.primary};
    font-size: 0.875rem;
    flex-shrink: 0;
    transition: ${tokens.transition.spring};
    transform: rotate(0deg);
  }

  ${BookingInfoItem}:hover & {
    color: ${tokens.colors.primary};

    svg {
      transform: rotate(10deg) scale(1.1);
    }
  }
`;

const BookingInfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};
  text-align: right;
  transition: ${tokens.transition.base};

  ${BookingInfoItem}:hover & {
    color: ${tokens.colors.primary};
    transform: translateX(4px);
  }
`;

const BookNowBtn = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: ${tokens.radius.lg};
  border: none;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary} 0%,
    ${tokens.colors.primaryDark} 100%
  );
  color: white;
  font-weight: 700;
  font-size: 1.0625rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-top: 1.25rem;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  position: relative;
  overflow: hidden;
  animation: ${pulseGlow} 3s ease-in-out infinite;

  &::before {
    content: "";
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
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 16px 40px rgba(249, 115, 22, 0.5);
    
    &::before {
      left: 100%;
    }

    svg {
      animation: ${float} 2s ease-in-out infinite;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    transition: ${tokens.transition.spring};
  }
`;

const SafetyNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  text-align: center;
  justify-content: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(34, 197, 94, 0.05);
  border-radius: ${tokens.radius.lg};
  border: 1px solid rgba(34, 197, 94, 0.2);
  transition: ${tokens.transition.base};

  &:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
  }

  svg {
    color: ${tokens.colors.success};
    font-size: 0.875rem;
    flex-shrink: 0;
    transition: ${tokens.transition.spring};
  }

  &:hover svg {
    transform: scale(1.1) rotate(5deg);
  }
`;

const SideCard = styled.div`
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 1.5rem;
  margin-top: 1.25rem;
  animation: ${fadeIn} 0.6s ease-out;
  transition: ${tokens.transition.spring};

  &:hover {
    transform: translateY(-2px);
    border-color: ${tokens.colors.borderHover};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
`;

const SideCardTitle = styled.div`
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${tokens.colors.textPrimary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: ${tokens.transition.base};

  svg {
    color: ${tokens.colors.primary};
    transition: ${tokens.transition.spring};
    transform: rotate(0deg);
  }

  ${SideCard}:hover & svg {
    transform: rotate(10deg) scale(1.1);
  }
`;

const WhatsAppSideBtn = styled.a`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: rgba(37, 211, 102, 0.1);
  border: 1px solid rgba(37, 211, 102, 0.3);
  border-radius: ${tokens.radius.lg};
  color: ${tokens.colors.whatsapp};
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: ${tokens.transition.spring};
  cursor: pointer;
  margin-top: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(37, 211, 102, 0.15),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(37, 211, 102, 0.18);
    border-color: rgba(37, 211, 102, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.2);

    &::before {
      opacity: 1;
    }

    svg {
      transform: scale(1.1) rotate(10deg);
      animation: ${float} 2s ease-in-out infinite;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    font-size: 1.25rem;
    transition: ${tokens.transition.spring};
  }
`;

const QuickFactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${tokens.colors.border};
  font-size: 0.875rem;
  transition: ${tokens.transition.base};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:hover {
    background: ${tokens.colors.primaryGlow};
    transform: translateX(4px);
  }

  span:first-child {
    color: ${tokens.colors.textMuted};
    transition: ${tokens.transition.base};
  }

  span:last-child {
    color: ${tokens.colors.textPrimary};
    font-weight: 600;
    transition: ${tokens.transition.base};
  }

  &:hover span {
    color: ${tokens.colors.primary};
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookingCardComponent({
  cardRef,
  price,
  rating,
  reviewCount,
  days,
  location,
  difficulty,
  altitude,
  capacity,
  season,
  country,
  onBook,
  organizerName,
  whatsappLink,
}) {
  const [hoveredStar, setHoveredStar] = useState(null);

  const StarsComponent = ({ rating, size = 13 }) => {
    return (
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            size={size}
            color={
              i <= (hoveredStar || Math.round(rating))
                ? tokens.colors.gold
                : tokens.colors.textMuted
            }
            onMouseEnter={() => setHoveredStar(i)}
            onMouseLeave={() => setHoveredStar(null)}
          />
        ))}
      </StarsContainer>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const d = difficulty?.toLowerCase() || "";
    if (d.includes("easy")) return tokens.colors.success;
    if (d.includes("hard") || d.includes("difficult")) return tokens.colors.primary;
    return tokens.colors.gold;
  };

  const getBestForText = (difficulty) => {
    const d = difficulty?.toLowerCase() || "";
    if (d.includes("easy")) return "Beginners";
    if (d.includes("moderate")) return "Intermediate";
    return "Experienced trekkers";
  };

  return (
    <>
      <BookingCard ref={cardRef}>
        <BookingCardHeader>
          <PriceDisplay>
            <PriceAmount>{price}</PriceAmount>
          </PriceDisplay>
          <PriceLabel>per person · all inclusive</PriceLabel>
          <BookingRating>
            <StarsComponent rating={rating} size={13} />
            <span style={{ fontSize: "0.8125rem", color: tokens.colors.textMuted }}>
              {rating} ({reviewCount} reviews)
            </span>
          </BookingRating>
        </BookingCardHeader>

        <BookingCardBody>
          <BookingInfoList>
            <BookingInfoItem>
              <BookingInfoLabel>
                <FaClock /> Duration
              </BookingInfoLabel>
              <BookingInfoValue>{days} Days</BookingInfoValue>
            </BookingInfoItem>
            <BookingInfoItem>
              <BookingInfoLabel>
                <FiMapPin /> Location
              </BookingInfoLabel>
              <BookingInfoValue>{location}</BookingInfoValue>
            </BookingInfoItem>
            <BookingInfoItem>
              <BookingInfoLabel>
                <FiTrendingUp /> Difficulty
              </BookingInfoLabel>
              <BookingInfoValue style={{ color: getDifficultyColor(difficulty) }}>
                {difficulty}
              </BookingInfoValue>
            </BookingInfoItem>
            <BookingInfoItem>
              <BookingInfoLabel>
                <FaMountain /> Altitude
              </BookingInfoLabel>
              <BookingInfoValue>{altitude}</BookingInfoValue>
            </BookingInfoItem>
            <BookingInfoItem>
              <BookingInfoLabel>
                <FaUsers /> Group Size
              </BookingInfoLabel>
              <BookingInfoValue>Max {capacity} people</BookingInfoValue>
            </BookingInfoItem>
            <BookingInfoItem>
              <BookingInfoLabel>
                <FaCalendarAlt /> Season
              </BookingInfoLabel>
              <BookingInfoValue>{season}</BookingInfoValue>
            </BookingInfoItem>
          </BookingInfoList>

          <BookNowBtn onClick={onBook}>
            <FiZap /> Reserve Your Spot
          </BookNowBtn>

          <SafetyNote>
            <FaShieldAlt />
            Free cancellation · Secure payment
          </SafetyNote>
        </BookingCardBody>
      </BookingCard>

      <SideCard>
        <SideCardTitle>
          <FaCompass /> Need Help?
        </SideCardTitle>
        <p style={{ fontSize: "0.875rem", color: tokens.colors.textMuted, lineHeight: 1.6, marginBottom: "0.5rem" }}>
          Have questions about this trek? Chat with {organizerName || "our team"} directly.
        </p>
        <WhatsAppSideBtn href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp /> Chat on WhatsApp
        </WhatsAppSideBtn>
      </SideCard>

      <SideCard>
        <SideCardTitle>
          <FiAward /> Quick Facts
        </SideCardTitle>
        {[
          { label: "Country", value: country },
          { label: "Start / End", value: location },
          { label: "Max Group", value: `${capacity} people` },
          { label: "Best For", value: getBestForText(difficulty) },
        ].map(({ label, value }, index) => (
          <QuickFactItem key={label}>
            <span>{label}</span>
            <span>{value}</span>
          </QuickFactItem>
        ))}
      </SideCard>
    </>
  );
}


