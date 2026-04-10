import { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaClock, FaMountain, FaStar, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    bgCardHover: "#1a1a1a",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.15)",
    primary: "#f97316",
    primaryGlow: "rgba(249, 115, 22, 0.3)",
    textPrimary: "#F1F5F9",
    textMuted: "#64748b",
    success: "#22c55e",
    warning: "#F59E0B",
    danger: "#EF4444",
    blue: "#3b82f6",
    purple: "#8b5cf6",
    gold: "#F59E0B",
  },
  radius: { md: "12px", lg: "16px", xl: "20px" },
};

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(249, 115, 22, 0.2);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const StatsBar = styled.div`
  background: linear-gradient(
    180deg,
    ${tokens.colors.bgCard} 0%,
    rgba(18, 18, 18, 0.95) 100%
  );
  border-top: 1px solid ${tokens.colors.border};
  border-bottom: 1px solid ${tokens.colors.border};
  position: sticky;
  top: 72px;
  z-index: 50;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: ${slideIn} 0.6s ease-out, ${glowPulse} 4s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${tokens.colors.primary}40,
      ${tokens.colors.primary}80,
      ${tokens.colors.primary}40,
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }
`;

const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const StatsBarInner = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;

  @media (min-width: 769px) {
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  @media (max-width: 768px) {
    overflow: hidden;
    position: relative;
  }
`;

const MobileCarouselWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
`;

const DesktopWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  width: fit-content;
  animation: ${scroll} 20s linear infinite;
`;

const StatBarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.75rem;
  border-right: 1px solid ${tokens.colors.border};
  flex-shrink: 0;
  min-width: fit-content;
  white-space: nowrap;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;

  &:last-child {
    border-right: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      ${tokens.colors.primary},
      transparent
    );
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  &:hover {
    background: ${tokens.colors.bgCardHover};

    &::after {
      width: 80%;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    gap: 0.75rem;
    border-right: 1px solid ${tokens.colors.border};

    &:hover {
      background: transparent;
      &::after {
        width: 0;
      }
    }
  }
`;

const iconFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-1px) rotate(1deg);
  }
  75% {
    transform: translateY(1px) rotate(-1deg);
  }
`;

const StatBarIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${tokens.radius.lg};
  background: ${({ $color }) =>
    $color || `linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))`};
  border: 1px solid ${({ $borderColor }) => $borderColor || "rgba(249, 115, 22, 0.3)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.125rem;
  color: ${({ $iconColor }) => $iconColor || tokens.colors.primary};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    animation: ${shimmer} 3s ease-in-out infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${StatBarItem}:hover & {
    transform: scale(1.1);
    animation: ${iconFloat} 2s ease-in-out infinite;
    box-shadow: 0 0 20px ${({ $shadowColor }) => $shadowColor || tokens.colors.primaryGlow};

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 1rem;
    border-radius: ${tokens.radius.md};
  }
`;

const StatBarText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatBarLabel = styled.div`
  font-size: 0.65rem;
  color: ${tokens.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  transition: color 0.3s ease;

  ${StatBarItem}:hover & {
    color: ${tokens.colors.textPrimary};
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

const StatBarValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.3s ease;

  ${StatBarItem}:hover & {
    color: ${({ $hoverColor }) => $hoverColor || tokens.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

function getDifficultyColor(difficulty) {
  const d = difficulty?.toLowerCase() || "";
  if (d.includes("easy"))
    return {
      bg: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
      border: "rgba(34,197,94,0.3)",
      color: "#22c55e",
      shadow: "rgba(34, 197, 94, 0.3)",
    };
  if (d.includes("hard") || d.includes("difficult"))
    return {
      bg: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
      border: "rgba(239,68,68,0.3)",
      color: "#EF4444",
      shadow: "rgba(239, 68, 68, 0.3)",
    };
  return {
    bg: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
    border: "rgba(245,158,11,0.3)",
    color: "#F59E0B",
    shadow: "rgba(245, 158, 11, 0.3)",
  };
}

const statsConfig = {
  duration: {
    bg: `linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))`,
    border: "rgba(249, 115, 22, 0.3)",
    color: tokens.colors.primary,
    shadow: tokens.colors.primaryGlow,
  },
  altitude: {
    bg: `linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))`,
    border: "rgba(59, 130, 246, 0.3)",
    color: "#60A5FA",
    shadow: "rgba(59, 130, 246, 0.3)",
  },
  capacity: {
    bg: `linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))`,
    border: "rgba(139, 92, 246, 0.3)",
    color: "#A78BFA",
    shadow: "rgba(139, 92, 246, 0.3)",
  },
  rating: {
    bg: `linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))`,
    border: "rgba(245, 158, 11, 0.3)",
    color: tokens.colors.gold,
    shadow: "rgba(245, 158, 11, 0.3)",
  },
  season: {
    bg: `linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))`,
    border: "rgba(34, 197, 94, 0.3)",
    color: "#22c55e",
    shadow: "rgba(34, 197, 94, 0.3)",
  },
};

export default function Stats({ days, altitude, difficulty, capacity, rating, season }) {
  const diffColor = getDifficultyColor(difficulty);

  const statItems = [
    {
      icon: <FaClock />,
      label: "Duration",
      value: `${days} Days`,
      config: statsConfig.duration,
    },
    {
      icon: <FaMountain />,
      label: "Altitude",
      value: altitude,
      config: statsConfig.altitude,
    },
    {
      icon: <FiTrendingUp />,
      label: "Difficulty",
      value: difficulty,
      config: diffColor,
    },
    {
      icon: <FaUsers />,
      label: "Group Size",
      value: `Max ${capacity}`,
      config: statsConfig.capacity,
    },
    {
      icon: <FaStar />,
      label: "Rating",
      value: `${rating} / 5`,
      config: statsConfig.rating,
    },
    {
      icon: <FaCalendarAlt />,
      label: "Best Season",
      value: season,
      config: statsConfig.season,
    },
  ];

  const StatItem = ({ item, index }) => (
    <StatBarItem key={index}>
      <StatBarIcon
        $color={item.config.bg}
        $borderColor={item.config.border}
        $iconColor={item.config.color}
        $shadowColor={item.config.shadow}
      >
        {item.icon}
      </StatBarIcon>
      <StatBarText>
        <StatBarLabel>{item.label}</StatBarLabel>
        <StatBarValue $hoverColor={item.config.color}>{item.value}</StatBarValue>
      </StatBarText>
    </StatBarItem>
  );

  return (
    <StatsBar>
      <Container>
        {/* Desktop View */}
        <DesktopWrapper>
          <StatsBarInner>
            {statItems.map((item, index) => (
              <StatItem key={index} item={item} index={index} />
            ))}
          </StatsBarInner>
        </DesktopWrapper>

        {/* Mobile Carousel View - Always rotating */}
        <MobileCarouselWrapper>
          <CarouselTrack>
            {/* Duplicate items for infinite scroll effect */}
            {[...statItems, ...statItems].map((item, index) => (
              <StatItem key={index} item={item} index={index} />
            ))}
          </CarouselTrack>
        </MobileCarouselWrapper>
      </Container>
    </StatsBar>
  );
}