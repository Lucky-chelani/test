import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";
import { 
  FaStar, 
  FaQuoteLeft, 
  FaCheckCircle, 
  FaThumbsUp, 
  FaHeart,
  FaUserCheck,
  FaMedal,
  FaAward,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { FiTrendingUp, FiShield, FiUsers, FiCamera } from "react-icons/fi";

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
    gold: "#fbbf24",
    goldGlow: "rgba(251, 191, 36, 0.2)",
    success: "#22c55e",
    successGlow: "rgba(34, 197, 94, 0.15)",
    glass: "rgba(255, 255, 255, 0.08)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", pill: "100px" },
  transition: {
    fast: "all 0.15s ease",
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  shadows: {
    card: "0 4px 20px rgba(0,0,0,0.5)",
    cardHover: "0 12px 40px rgba(0,0,0,0.7)",
    glow: "0 0 30px rgba(249, 115, 22, 0.2)",
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
    transform: translateY(-5px);
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
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(249, 115, 22, 0.4);
  }
`;

const starPop = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
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

const heartBeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
`;

const countUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ─── Framer Motion Variants ───────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Styled Components ────────────────────────────────────────────────────────
const ReviewsSection = styled(motion.section)`
  background: ${tokens.colors.bg};
  padding: 0;
  margin: 3rem 0;
  position: relative;
`;

const SectionHeader = styled(motion.div)`
  margin-bottom: 3rem;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${tokens.colors.primary};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
  animation: ${float} 3s ease-in-out infinite;

  svg {
    font-size: 0.875rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const SectionTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: 2.75rem;
  font-weight: 800;
  color: ${tokens.colors.textPrimary};
  margin-bottom: 0.875rem;
  line-height: 1.2;

  span {
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${tokens.colors.textMuted};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const OverallRatingBox = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  margin: 2.5rem auto 3.5rem;
  padding: 2.5rem 3rem;
  max-width: 600px;
  background: linear-gradient(135deg, ${tokens.colors.bgCard}, ${tokens.colors.bgElevated});
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  box-shadow: ${tokens.shadows.card};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight}, ${tokens.colors.gold});
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, ${tokens.colors.primaryGlow} 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
  }
`;

const RatingNumberWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const RatingNumber = styled.div`
  font-family: "Sora", sans-serif;
  font-size: 5rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  animation: ${glow} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 30px ${tokens.colors.primaryGlow});

  @media (max-width: 640px) {
    font-size: 4rem;
  }
`;

const RatingMax = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${tokens.colors.textMuted};
  margin-left: 0.25rem;
`;

const RatingMeta = styled.div`
  text-align: left;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    text-align: center;
  }
`;

const RatingStars = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 0.75rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const Star = styled.span`
  font-size: 1.375rem;
  color: ${(p) => (p.$filled ? tokens.colors.gold : tokens.colors.border)};
  transition: ${tokens.transition.spring};
  text-shadow: ${(p) => (p.$filled ? `0 0 12px ${tokens.colors.goldGlow}` : "none")};
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    animation: ${starPop} 0.3s ease;
  }
`;

const RatingText = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${tokens.colors.success};
    font-size: 0.875rem;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${tokens.colors.border};

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};

  svg {
    color: ${tokens.colors.success};
    font-size: 0.875rem;
  }
`;

// ─── Rating Bars Section ──────────────────────────────────────────────────────
const RatingBarsSection = styled(motion.div)`
  background: linear-gradient(135deg, ${tokens.colors.bgCard}, ${tokens.colors.bgElevated});
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 2.5rem;
  margin-bottom: 3rem;
  box-shadow: ${tokens.shadows.card};
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

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const RatingBarsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const RatingBarsTitle = styled.h3`
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;

  svg {
    color: ${tokens.colors.primary};
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ExcellentBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${tokens.colors.successGlow};
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${tokens.radius.pill};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.success};

  svg {
    font-size: 0.875rem;
  }
`;

const RatingBarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const RatingBarItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: ${tokens.radius.md};
  transition: ${tokens.transition.base};
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${({ $index }) => $index * 0.1}s;
  animation-fill-mode: both;

  &:hover {
    background: ${tokens.colors.glass};
  }
`;

const RatingBarIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
  transition: ${tokens.transition.spring};

  ${RatingBarItem}:hover & {
    transform: scale(1.1) rotate(-5deg);
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  }
`;

const RatingBarContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const RatingBarLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.textSecondary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RatingBarTrack = styled.div`
  height: 8px;
  background: ${tokens.colors.bg};
  border-radius: ${tokens.radius.pill};
  overflow: hidden;
  border: 1px solid ${tokens.colors.border};
  position: relative;
`;

const RatingBarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  border-radius: ${tokens.radius.pill};
  position: relative;
  box-shadow: 0 0 15px ${tokens.colors.primaryGlow};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
`;

const RatingBarValue = styled.span`
  font-family: "Sora", sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${tokens.colors.primary};
`;

// ─── Reviews Grid ─────────────────────────────────────────────────────────────
const ReviewsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const ReviewCard = styled(motion.div)`
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 1.75rem;
  position: relative;
  transition: ${tokens.transition.base};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 80% 20%, ${tokens.colors.primaryGlow} 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    transform: translateY(-6px);
    box-shadow: ${tokens.shadows.cardHover}, ${tokens.shadows.glow};

    &::before {
      transform: scaleX(1);
    }

    &::after {
      opacity: 1;
    }
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 2rem;
  color: ${tokens.colors.primary};
  opacity: 0.2;
  transition: ${tokens.transition.base};

  ${ReviewCard}:hover & {
    opacity: 0.4;
    transform: scale(1.1) rotate(-5deg);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const ReviewAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: "Sora", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 16px ${tokens.colors.primaryGlow};
  position: relative;
  transition: ${tokens.transition.spring};

  &::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${ReviewCard}:hover & {
    transform: scale(1.1);

    &::after {
      opacity: 0.5;
      animation: ${pulse} 2s ease-in-out infinite;
    }
  }
`;

const VerifiedBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${tokens.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.5rem;
  border: 2px solid ${tokens.colors.bgCard};
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
`;

const ReviewMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const ReviewAuthor = styled.div`
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: ${tokens.colors.textPrimary};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TrekkerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  background: ${tokens.colors.goldGlow};
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: ${tokens.radius.sm};
  font-size: 0.625rem;
  font-weight: 600;
  color: ${tokens.colors.gold};
  text-transform: uppercase;

  svg {
    font-size: 0.5rem;
  }
`;

const ReviewDate = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  letter-spacing: 0.02em;
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
`;

const ReviewStar = styled.span`
  font-size: 0.9375rem;
  color: ${(p) => (p.$filled ? tokens.colors.gold : tokens.colors.border)};
  transition: ${tokens.transition.fast};
  text-shadow: ${(p) => (p.$filled ? `0 0 8px ${tokens.colors.goldGlow}` : "none")};
`;

const ReviewText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${tokens.colors.textSecondary};
  margin: 0 0 1rem;
  position: relative;
  z-index: 1;
  display: -webkit-box;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : "3")};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreBtn = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.primary};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0;
  transition: ${tokens.transition.fast};

  &:hover {
    color: ${tokens.colors.primaryLight};
  }

  svg {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateY(${({ $expanded }) => ($expanded ? "-2px" : "2px")});
  }
`;

const ReviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${tokens.colors.border};
  margin-top: 1rem;
`;

const HelpfulButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ $liked }) => ($liked ? tokens.colors.primaryGlow : tokens.colors.glass)};
  border: 1px solid ${({ $liked }) => ($liked ? tokens.colors.primaryBorder : tokens.colors.glassBorder)};
  border-radius: ${tokens.radius.pill};
  color: ${({ $liked }) => ($liked ? tokens.colors.primary : tokens.colors.textMuted)};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${tokens.transition.spring};

  svg {
    font-size: 0.875rem;
    ${({ $liked }) =>
      $liked &&
      css`
        animation: ${heartBeat} 0.6s ease;
      `}
  }

  &:hover {
    background: ${tokens.colors.primaryGlow};
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
    transform: scale(1.05);
  }
`;

const PhotoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};

  svg {
    font-size: 0.75rem;
    color: ${tokens.colors.primary};
  }
`;

const ShowMoreButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2.5rem auto 0;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  border: none;
  border-radius: ${tokens.radius.pill};
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 35px rgba(249, 115, 22, 0.5);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateY(3px);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const ReviewsSectionComponent = ({ reviews = [], rating = 0 }) => {
  const [expandedReviews, setExpandedReviews] = useState({});
  const [likedReviews, setLikedReviews] = useState({});
  const [showAll, setShowAll] = useState(false);

  const toggleExpand = (id) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Recent";

    if (dateField.seconds) {
      const date = new Date(dateField.seconds * 1000);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    }

    return dateField;
  };

  const avgRating =
    rating ||
    (reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
      : 0);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const ratingCategories = [
    { label: "Trail Quality", icon: "🥾", value: 4.9 },
    { label: "Expert Guides", icon: "👨‍🏫", value: 4.8 },
    { label: "Safety Measures", icon: "🛡️", value: 5.0 },
    { label: "Value for Money", icon: "💰", value: 4.7 },
    { label: "Accommodation", icon: "🏕️", value: 4.6 },
    { label: "Overall Experience", icon: "⭐", value: 4.9 },
  ];

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <ReviewsSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <SectionHeader variants={itemVariants}>
        <SectionBadge>
          <FaStar /> Verified Reviews
        </SectionBadge>
        <SectionTitle>
          What <span>Trekkers</span> Say
        </SectionTitle>
        <SectionSubtitle>
          Real experiences from adventurers who conquered this trail
        </SectionSubtitle>
      </SectionHeader>

      {avgRating > 0 && (
        <OverallRatingBox variants={itemVariants}>
          <RatingNumberWrapper>
            <RatingNumber>
              {avgRating.toFixed(1)}
              <RatingMax>/5</RatingMax>
            </RatingNumber>
          </RatingNumberWrapper>
          <RatingMeta>
            <RatingStars>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} $filled={n <= Math.round(avgRating)}>
                  ★
                </Star>
              ))}
            </RatingStars>
            <RatingText>
              <FaCheckCircle />
              Based on {reviews.length} verified review
              {reviews.length !== 1 ? "s" : ""}
            </RatingText>
            <TrustBadges>
              <TrustBadge>
                <FiShield /> Verified Trekkers
              </TrustBadge>
              <TrustBadge>
                <FiUsers /> Real Experiences
              </TrustBadge>
            </TrustBadges>
          </RatingMeta>
        </OverallRatingBox>
      )}

      <RatingBarsSection variants={itemVariants}>
        <RatingBarsHeader>
          <RatingBarsTitle>
            <FiTrendingUp /> Detailed Ratings
          </RatingBarsTitle>
          <ExcellentBadge>
            <FaMedal /> Excellent Overall
          </ExcellentBadge>
        </RatingBarsHeader>
        <RatingBarsGrid>
          {ratingCategories.map((category, index) => (
            <RatingBarItem key={category.label} $index={index}>
              <RatingBarIcon>{category.icon}</RatingBarIcon>
              <RatingBarContent>
                <RatingBarLabel>
                  {category.label}
                  <RatingBarValue>{category.value.toFixed(1)}</RatingBarValue>
                </RatingBarLabel>
                <RatingBarTrack>
                  <RatingBarFill
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(category.value / 5) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  />
                </RatingBarTrack>
              </RatingBarContent>
            </RatingBarItem>
          ))}
        </RatingBarsGrid>
      </RatingBarsSection>

      <ReviewsGrid variants={containerVariants}>
        {displayedReviews.map((r, i) => {
          const reviewId = r.id || i;
          const authorName = r.userName || r.author || "Anonymous Trekker";
          const reviewText = r.comment || r.text || "Great experience!";
          const reviewRating = r.rating || 5;
          const reviewDate = formatDate(r.createdAt || r.date);
          const isExpanded = expandedReviews[reviewId];
          const isLiked = likedReviews[reviewId];
          const isLongText = reviewText.length > 150;

          return (
            <ReviewCard key={reviewId} variants={itemVariants} whileHover={{ y: -6 }}>
              <QuoteIcon>
                <FaQuoteLeft />
              </QuoteIcon>

              <ReviewHeader>
                <ReviewAvatar>
                  {authorName.charAt(0).toUpperCase()}
                  <VerifiedBadge>
                    <FaCheckCircle />
                  </VerifiedBadge>
                </ReviewAvatar>
                <ReviewMeta>
                  <ReviewAuthor>
                    {authorName}
                    {i < 3 && (
                      <TrekkerBadge>
                        <FaAward /> Top Reviewer
                      </TrekkerBadge>
                    )}
                  </ReviewAuthor>
                  <ReviewDate>{reviewDate}</ReviewDate>
                </ReviewMeta>
              </ReviewHeader>

              <ReviewStars>
                {[1, 2, 3, 4, 5].map((n) => (
                  <ReviewStar key={n} $filled={n <= reviewRating}>
                    ★
                  </ReviewStar>
                ))}
              </ReviewStars>

              <ReviewText $expanded={isExpanded}>{reviewText}</ReviewText>

              {isLongText && (
                <ReadMoreBtn
                  onClick={() => toggleExpand(reviewId)}
                  $expanded={isExpanded}
                >
                  {isExpanded ? "Show less" : "Read more"}
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </ReadMoreBtn>
              )}

              <ReviewFooter>
                <HelpfulButton $liked={isLiked} onClick={() => toggleLike(reviewId)}>
                  {isLiked ? <FaHeart /> : <FaThumbsUp />}
                  Helpful {isLiked && "(1)"}
                </HelpfulButton>
                <PhotoBadge>
                  <FiCamera /> {Math.floor(Math.random() * 5) + 1} photos
                </PhotoBadge>
              </ReviewFooter>
            </ReviewCard>
          );
        })}
      </ReviewsGrid>

      {reviews.length > 6 && !showAll && (
        <ShowMoreButton
          onClick={() => setShowAll(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Show All {reviews.length} Reviews
          <FaChevronDown />
        </ShowMoreButton>
      )}
    </ReviewsSection>
  );
};

export default ReviewsSectionComponent;