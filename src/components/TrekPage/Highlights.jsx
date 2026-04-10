import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { 
  FaTrophy, 
  FaMountain, 
  FaLeaf, 
  FaStar, 
  FaShieldAlt,
  FaCamera,
  FaHiking,
  FaWater,
  FaSnowflake,
  FaSun,
  FaEye,
  FaHeart,
  FaGem,
  FaCampground,
  FaRoute,
  FaBinoculars
} from "react-icons/fa";
import { FiCheck, FiArrowRight } from "react-icons/fi";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    bgElevated: "#1a1a1a",
    bgHover: "#1f1f1f",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.15)",
    primary: "#f97316",
    primaryDark: "#ea580c",
    primaryLight: "#fb923c",
    primaryGlow: "rgba(249, 115, 22, 0.15)",
    primaryBorder: "rgba(249, 115, 22, 0.3)",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748b",
    surface1: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.06)",
    success: "#22c55e",
    gold: "#fbbf24",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", pill: "100px" },
  transition: { 
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
    fast: "all 0.15s ease",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(249, 115, 22, 0.2);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const checkPop = keyframes`
  0% {
    transform: scale(0) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const shine = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
`;

const iconBounce = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-2px) rotate(-5deg);
  }
  75% {
    transform: translateY(2px) rotate(5deg);
  }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const SectionCard = styled.section`
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 2rem;
  animation: ${fadeUp} 0.6s ease-out both, ${glow} 4s ease-in-out infinite;
  transition: ${tokens.transition.base};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${tokens.colors.primary}50,
      ${tokens.colors.primaryLight},
      ${tokens.colors.primary}50,
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`;

const SectionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const SectionIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${tokens.radius.lg};
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1.25rem;
  flex-shrink: 0;
  animation: ${float} 3s ease-in-out infinite;
  transition: ${tokens.transition.spring};
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shine} 3s ease-in-out infinite;
  }

  &:hover {
    transform: rotate(-10deg) scale(1.1);
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: 1.375rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  letter-spacing: -0.01em;
  margin: 0;
`;

const SectionSubtitle = styled.span`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
`;

const HighlightCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.primary};
  animation: ${pulse} 3s ease-in-out infinite;

  svg {
    font-size: 0.875rem;
  }
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.lg};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${scaleIn} 0.5s ease-out both;
  animation-delay: ${({ $index }) => $index * 0.08}s;
  transition: ${tokens.transition.spring};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      ${tokens.colors.primary},
      ${tokens.colors.primaryDark}
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(249, 115, 22, 0.05) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${tokens.colors.surface2};
    border-color: ${tokens.colors.primaryBorder};
    transform: translateY(-4px) translateX(4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
      animation: ${shimmer} 1.5s ease infinite;
    }
  }

  &:active {
    transform: translateY(-2px) translateX(2px);
  }
`;

const HighlightIconWrapper = styled.div`
  position: relative;
`;

const HighlightIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${tokens.radius.md};
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1.125rem;
  flex-shrink: 0;
  transition: ${tokens.transition.spring};
  position: relative;
  z-index: 1;

  ${HighlightItem}:hover & {
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
    color: white;
    transform: rotate(-10deg) scale(1.1);
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
    animation: ${iconBounce} 0.5s ease;
  }
`;

const HighlightNumber = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${tokens.colors.primary};
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
  transition: ${tokens.transition.spring};

  ${HighlightItem}:hover & {
    transform: scale(1.2);
    background: ${tokens.colors.primaryLight};
  }
`;

const HighlightContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const HighlightText = styled.span`
  font-size: 0.9375rem;
  color: ${tokens.colors.textSecondary};
  line-height: 1.6;
  transition: ${tokens.transition.fast};

  ${HighlightItem}:hover & {
    color: ${tokens.colors.textPrimary};
  }
`;

const HighlightMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(5px);
  transition: ${tokens.transition.base};

  ${HighlightItem}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ViewMore = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${tokens.colors.primary};
  font-weight: 600;

  svg {
    transition: transform 0.2s ease;
  }

  ${HighlightItem}:hover & svg {
    transform: translateX(3px);
  }
`;

const CheckBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${tokens.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  opacity: 0;
  transform: scale(0);
  transition: ${tokens.transition.spring};
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);

  ${HighlightItem}:hover & {
    opacity: 1;
    animation: ${checkPop} 0.4s ease-out forwards;
  }
`;

const FeaturedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.25));
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: ${tokens.radius.sm};
  font-size: 0.625rem;
  font-weight: 700;
  color: ${tokens.colors.gold};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  svg {
    font-size: 0.5rem;
  }
`;

const SummaryBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${tokens.colors.border};
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.pill};
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  transition: ${tokens.transition.base};

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
    background: ${tokens.colors.primaryGlow};
  }

  svg {
    font-size: 0.75rem;
    color: ${tokens.colors.primary};
  }
`;

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap = [
  FaMountain,
  FaLeaf,
  FaStar,
  FaShieldAlt,
  FaCamera,
  FaHiking,
  FaWater,
  FaSnowflake,
  FaSun,
  FaEye,
  FaHeart,
  FaGem,
  FaCampground,
  FaRoute,
  FaBinoculars,
];

// ─── Helper Function ──────────────────────────────────────────────────────────
const getIconForHighlight = (text, index) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("mountain") || lowerText.includes("peak") || lowerText.includes("summit")) return FaMountain;
  if (lowerText.includes("forest") || lowerText.includes("tree") || lowerText.includes("nature")) return FaLeaf;
  if (lowerText.includes("view") || lowerText.includes("scenic") || lowerText.includes("panoram")) return FaEye;
  if (lowerText.includes("photo") || lowerText.includes("picture") || lowerText.includes("instagram")) return FaCamera;
  if (lowerText.includes("trek") || lowerText.includes("hike") || lowerText.includes("walk")) return FaHiking;
  if (lowerText.includes("lake") || lowerText.includes("river") || lowerText.includes("water")) return FaWater;
  if (lowerText.includes("snow") || lowerText.includes("glacier") || lowerText.includes("ice")) return FaSnowflake;
  if (lowerText.includes("sunrise") || lowerText.includes("sunset") || lowerText.includes("sun")) return FaSun;
  if (lowerText.includes("camp") || lowerText.includes("tent") || lowerText.includes("stay")) return FaCampground;
  if (lowerText.includes("wildlife") || lowerText.includes("bird") || lowerText.includes("animal")) return FaBinoculars;
  if (lowerText.includes("trail") || lowerText.includes("path") || lowerText.includes("route")) return FaRoute;
  if (lowerText.includes("experience") || lowerText.includes("unique") || lowerText.includes("special")) return FaGem;
  if (lowerText.includes("safe") || lowerText.includes("secure") || lowerText.includes("guide")) return FaShieldAlt;
  
  // Fallback to rotating icons
  return iconMap[index % iconMap.length];
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Highlights({ highlights = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!highlights || highlights.length === 0) return null;

  return (
    <SectionCard>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionIconBox>
            <FaTrophy />
          </SectionIconBox>
          <SectionTitleWrapper>
            <SectionTitle>Trek Highlights</SectionTitle>
            <SectionSubtitle>What makes this trek special</SectionSubtitle>
          </SectionTitleWrapper>
        </SectionHeaderLeft>

        <HighlightCount>
          <FaStar />
          {highlights.length} highlights
        </HighlightCount>
      </SectionHeader>

      <HighlightsGrid>
        {highlights.map((highlight, index) => {
          const IconComponent = getIconForHighlight(highlight, index);
          const isFeatured = index < 2; // First two items are featured

          return (
            <HighlightItem
              key={index}
              $index={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <HighlightIconWrapper>
                <HighlightIcon>
                  <IconComponent />
                </HighlightIcon>
                <HighlightNumber>{index + 1}</HighlightNumber>
              </HighlightIconWrapper>

              <HighlightContent>
                {isFeatured && (
                  <FeaturedBadge>
                    <FaStar /> Featured
                  </FeaturedBadge>
                )}
                <HighlightText>{highlight}</HighlightText>
              </HighlightContent>

              <CheckBadge>
                <FiCheck />
              </CheckBadge>
            </HighlightItem>
          );
        })}
      </HighlightsGrid>

      <SummaryBar>
        <SummaryItem>
          <FaStar />
          {highlights.length} unique experiences
        </SummaryItem>
        <SummaryItem>
          <FaCamera />
          Insta-worthy spots
        </SummaryItem>
        <SummaryItem>
          <FaShieldAlt />
          Expert guided
        </SummaryItem>
        <SummaryItem>
          <FaHeart />
          Handpicked trails
        </SummaryItem>
      </SummaryBar>
    </SectionCard>
  );
}