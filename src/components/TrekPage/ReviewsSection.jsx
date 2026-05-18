import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaThumbsUp,
  FaHeart,
  FaMedal,
  FaAward,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaTimes, // <--- Import FaTimes here
  FaExclamationTriangle,
} from "react-icons/fa";
import { FiTrendingUp, FiShield, FiUsers, FiMoreVertical } from "react-icons/fi";
import { db, auth } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import ReviewForm from "./ReviewForm";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    bgElevated: "#1a1a1a",
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
    error: "#ef4444",
    errorGlow: "rgba(239, 68, 68, 0.08)",
    errorBorder: "rgba(239, 68, 68, 0.3)",
    glass: "rgba(255,255,255,0.08)",
    glassBorder: "rgba(255,255,255,0.12)",
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
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.2); }
  50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.4); }
`;

const starPop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const heartBeat = keyframes`
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
`;

const newReviewPop = keyframes`
  0% { opacity: 0; transform: translateY(-16px) scale(0.97); }
  60% { transform: translateY(4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ─── Framer Variants ──────────────────────────────────────────────────────────
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

// ─── Main Section ─────────────────────────────────────────────────────────────
const Section = styled.section`
  background: ${tokens.colors.bg};
  padding: 0;
  margin: 3rem 0;
  position: relative;
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  @media (max-width: 768px) { margin-bottom: 2rem; }
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${tokens.colors.primary};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;

  svg {
    font-size: 0.875rem;
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
  @media (max-width: 768px) { font-size: 2rem; }
  @media (max-width: 480px) { font-size: 1.625rem; }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${tokens.colors.textMuted};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
  @media (max-width: 768px) { font-size: 1rem; }
  @media (max-width: 480px) { font-size: 0.875rem; padding: 0 0.5rem; }
`;

// ─── Overall Rating ───────────────────────────────────────────────────────────
const OverallRatingBox = styled.div`
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
    height: 2px;
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.75rem 1.5rem;
    margin: 2rem 0 2.5rem;
  }
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
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    font-size: 3.5rem;
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
  @media (max-width: 640px) { text-align: center; }
`;

const RatingStars = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 0.75rem;
  @media (max-width: 640px) { justify-content: center; }
`;

const Star = styled.span`
  font-size: 1.375rem;
  color: ${(p) => (p.$filled ? tokens.colors.gold : tokens.colors.border)};
  text-shadow: ${(p) => (p.$filled ? `0 0 8px ${tokens.colors.goldGlow}` : "none")};
`;

const RatingText = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 640px) { justify-content: center; font-size: 0.8125rem; }
  svg { color: ${tokens.colors.success}; font-size: 0.875rem; }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${tokens.colors.border};
  @media (max-width: 640px) { flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  svg { color: ${tokens.colors.success}; font-size: 0.875rem; }
`;

// ─── Rating Bars ──────────────────────────────────────────────────────────────
const RatingBarsSection = styled.div`
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
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  }

  @media (max-width: 768px) {
    padding: 1.75rem 1.25rem;
  }
`;

const RatingBarsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 768px) { flex-direction: column; text-align: center; }
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
  svg { color: ${tokens.colors.primary}; }
  @media (max-width: 768px) { font-size: 1.25rem; }
`;

const ExcellentBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${tokens.colors.successGlow};
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: ${tokens.radius.pill};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.success};
`;

const RatingBarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 3rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 1.25rem; }
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
  &:hover { background: ${tokens.colors.glass}; }
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
  justify-content: space-between;
`;

const RatingBarTrack = styled.div`
  height: 8px;
  background: ${tokens.colors.bg};
  border-radius: ${tokens.radius.pill};
  overflow: hidden;
  border: 1px solid ${tokens.colors.border};
`;

const RatingBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  border-radius: ${tokens.radius.pill};
  width: ${({ $width }) => $width || '0%'};
  transition: width 0.8s ease;
`;
const RatingBarValue = styled.span`
  font-family: "Sora", sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${tokens.colors.primary};
`;

// ─── Reviews Grid ─────────────────────────────────────────────────────────────
const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 1.25rem; }
`;

const ReviewCard = styled.div`
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

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

const NewBadge = styled.div`
  position: absolute;
  top: 0.875rem;
  left: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-size: 0.6rem;
  font-weight: 700;
  color: ${tokens.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  z-index: 3;
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 2rem;
  color: ${tokens.colors.primary};
  opacity: 0.15;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  margin-top: ${({ $hasNewBadge }) => ($hasNewBadge ? "1.25rem" : "0")};
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
  position: relative;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 1rem;
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
  box-shadow: 0 2px 8px rgba(34,197,94,0.4);
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) { font-size: 0.875rem; }
`;

const TrekkerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  background: ${tokens.colors.goldGlow};
  border: 1px solid rgba(251,191,36,0.3);
  border-radius: ${tokens.radius.sm};
  font-size: 0.625rem;
  font-weight: 600;
  color: ${tokens.colors.gold};
  text-transform: uppercase;
  svg { font-size: 0.5rem; }
`;

const ReviewDate = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  @media (max-width: 480px) { font-size: 0.675rem; }
`;

// ─── Three-dot Menu & Delete ──────────────────────────────────────────────────
const MenuWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  z-index: 5;
`;

const MenuBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid transparent;
  color: ${tokens.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${tokens.transition.base};
  font-size: 1rem;

  &:hover {
    background: ${tokens.colors.glass};
    border-color: ${tokens.colors.border};
    color: ${tokens.colors.textSecondary};
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: ${tokens.colors.bgElevated};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.md};
  box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  overflow: hidden;
  z-index: 50;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${({ $danger }) => ($danger ? tokens.colors.error : tokens.colors.textSecondary)};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${tokens.transition.fast};
  text-align: left;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? tokens.colors.errorGlow : tokens.colors.glass};
    color: ${({ $danger }) =>
      $danger ? tokens.colors.error : tokens.colors.textPrimary};
  }

  svg { font-size: 0.875rem; flex-shrink: 0; }
`;

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: ${tokens.colors.bgElevated};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.8);

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ModalIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  background: ${tokens.colors.errorGlow};
  border: 1px solid ${tokens.colors.errorBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.error};
  font-size: 1.5rem;
`;

const ModalTitle = styled.h4`
  font-family: "Sora", sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0 0 0.5rem;
`;

const ModalText = styled.p`
  font-size: 0.875rem;
  color: ${tokens.colors.textMuted};
  margin: 0 0 1.5rem;
  line-height: 1.6;
`;

const ModalBtns = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ModalCancelBtn = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${tokens.radius.pill};
  border: 1px solid ${tokens.colors.border};
  background: transparent;
  color: ${tokens.colors.textSecondary};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: ${tokens.transition.base};
  &:hover {
    background: ${tokens.colors.glass};
    color: ${tokens.colors.textPrimary};
  }
  @media (max-width: 480px) { width: 100%; }
`;

const ModalDeleteBtn = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${tokens.radius.pill};
  border: none;
  background: ${tokens.colors.error};
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 6px 20px rgba(239,68,68,0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) { width: 100%; }
`;

const DeleteSpinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

// ─── AlertBox (Moved from ReviewForm.jsx) ─────────────────────────────────────
const AlertBox = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: ${tokens.radius.md};
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
  background: ${({ $type }) =>
    $type === "error" ? tokens.colors.errorGlow : tokens.colors.successGlow};
  border: 1px solid ${({ $type }) =>
    $type === "error" ? tokens.colors.errorBorder : tokens.colors.successBorder};
  color: ${({ $type }) =>
    $type === "error" ? tokens.colors.error : tokens.colors.success};

  svg { flex-shrink: 0; margin-top: 1px; font-size: 1rem; }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

const AlertClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  margin-left: auto;
  opacity: 0.6;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

// ─── Review Stars / Text / Footer ─────────────────────────────────────────────
const ReviewStars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
`;

const ReviewStar = styled.span`
  font-size: 0.9375rem;
  color: ${(p) => (p.$filled ? tokens.colors.gold : tokens.colors.border)};
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

  @media (max-width: 480px) { font-size: 0.8125rem; }
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
  &:hover { color: ${tokens.colors.primaryLight}; }
  svg { font-size: 0.75rem; }
`;

const ReviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${tokens.colors.border};
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const HelpfulButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ $liked }) => ($liked ? tokens.colors.primaryGlow : tokens.colors.glass)};
  border: 1px solid ${({ $liked }) =>
    $liked ? tokens.colors.primaryBorder : tokens.colors.glassBorder};
  border-radius: ${tokens.radius.pill};
  color: ${({ $liked }) => ($liked ? tokens.colors.primary : tokens.colors.textMuted)};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${tokens.transition.base};

  &:hover {
    background: ${tokens.colors.primaryGlow};
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const HelpfulCount = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
`;

// ─── Misc ─────────────────────────────────────────────────────────────────────
const ShowMoreButton = styled.button`
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
  transition: ${tokens.transition.base};
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.875rem 2rem;
    font-size: 0.9rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, ${tokens.colors.border}, transparent);
  margin: 3rem 0;
  @media (max-width: 640px) { margin: 2rem 0; }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem 2rem;
  color: ${tokens.colors.textMuted};
  p { font-size: 1rem; margin: 0.5rem 0 0; }
  @media (max-width: 480px) { padding: 2rem 1rem; }
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.4;
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const RATING_CATEGORIES = [
  { label: "Trail Quality", icon: "🥾", value: 4.9 },
  { label: "Expert Guides", icon: "👨‍🏫", value: 4.8 },
  { label: "Safety Measures", icon: "🛡️", value: 5.0 },
  { label: "Value for Money", icon: "💰", value: 4.7 },
  { label: "Accommodation", icon: "🏕️", value: 4.6 },
  { label: "Overall Experience", icon: "⭐", value: 4.9 },
];

// Replace with your actual admin UIDs
const ADMIN_UIDS = [
  "REPLACE_WITH_YOUR_ADMIN_UID",
  // Add more admin UIDs here
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateField) {
  if (!dateField) return "Just now";
  if (dateField?.seconds) {
    const date = new Date(dateField.seconds * 1000);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  return dateField;
}

// ─── Single Review Card ───────────────────────────────────────────────────────
function SingleReviewCard({ r, index, newReviewId, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(r.helpfulCount || 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = auth.currentUser;
  const authorName = r.userName || r.author || "Anonymous Trekker";
  const reviewText = r.comment || r.text || "Great experience!";
  const reviewRating = r.rating || 5;
  const reviewDate = formatDate(r.createdAt || r.date);
  const isLongText = reviewText.length > 150;
  const isThisNew = r._isNew || r.id === newReviewId;

  // Check if current user can delete this review
  const isAuthor = user && r.userId && user.uid === r.userId;
  const isAdmin = user && ADMIN_UIDS.includes(user.uid);
  const canDelete = isAuthor || isAdmin;

  const handleHelpful = () => {
    setLiked((prev) => {
      setHelpfulCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  // Close menu when clicking outside
  const handleMenuBlur = () => {
    setTimeout(() => setMenuOpen(false), 150);
  };

  return (
    <ReviewCard variants={itemVariants} whileHover={{ y: -6 }} $isNew={isThisNew} layout>
      {isThisNew && <NewBadge>✨ New</NewBadge>}

      <QuoteIcon><FaQuoteLeft /></QuoteIcon>

      <ReviewHeader $hasNewBadge={isThisNew}>
        <ReviewAvatar>
          {authorName.charAt(0).toUpperCase()}
          <VerifiedBadge><FaCheckCircle /></VerifiedBadge>
        </ReviewAvatar>
        <ReviewMeta>
          <ReviewAuthor>
            {authorName}
            {index < 3 && !isThisNew && (
              <TrekkerBadge><FaAward /> Top Reviewer</TrekkerBadge>
            )}
          </ReviewAuthor>
          <ReviewDate>{reviewDate}</ReviewDate>
        </ReviewMeta>

        {/* Three-dot menu — only if user can delete */}
        {canDelete && (
          <MenuWrapper onBlur={handleMenuBlur}>
            <MenuBtn onClick={() => setMenuOpen((p) => !p)} title="Options">
              <FiMoreVertical />
            </MenuBtn>
            <AnimatePresence>
              {menuOpen && (
                <MenuDropdown
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <MenuItem
                    $danger
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(r.id, authorName);
                    }}
                  >
                    <FaTrash /> Delete Review
                  </MenuItem>
                </MenuDropdown>
              )}
            </AnimatePresence>
          </MenuWrapper>
        )}
      </ReviewHeader>

      <ReviewStars>
        {[1, 2, 3, 4, 5].map((n) => (
          <ReviewStar key={n} $filled={n <= reviewRating}>★</ReviewStar>
        ))}
      </ReviewStars>

      <ReviewText $expanded={expanded}>{reviewText}</ReviewText>

      {isLongText && (
        <ReadMoreBtn onClick={() => setExpanded((p) => !p)} $expanded={expanded}>
          {expanded ? "Show less" : "Read more"}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </ReadMoreBtn>
      )}

      <ReviewFooter>
        <HelpfulButton $liked={liked} onClick={handleHelpful}>
          {liked ? <FaHeart /> : <FaThumbsUp />}
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </HelpfulButton>
      </ReviewFooter>
    </ReviewCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReviewsSectionComponent({
  reviews: initialReviews = [],
  rating = 0,
  trekId = "",
  trekTitle = "",
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReviewId, setNewReviewId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, authorName }
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const avgRating = rating || (reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
    : 0);

  // ── Add new review (from ReviewForm) ──────────────────────────────────────
  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setNewReviewId(newReview.id);
    setTimeout(() => setNewReviewId(null), 8000);
  };

  // ── Open delete confirmation ──────────────────────────────────────────────
  const handleDeleteRequest = (reviewId, authorName) => {
    setDeleteTarget({ id: reviewId, authorName });
    setDeleteError("");
  };

  // ── Confirm delete — removes from Firestore + local state ─────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "reviews", deleteTarget.id));
      console.log("🗑️ Review deleted:", deleteTarget.id);

      // Remove from local state
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      if (err.code === "permission-denied") {
        setDeleteError("You don't have permission to delete this review. (Admin access needed or review author)");
      } else {
        setDeleteError("Failed to delete. Please try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

 return (
    <Section>
      {/* ── Header ── */}
      <SectionHeader>
        <SectionBadge><FaStar /> Verified Reviews</SectionBadge>
        <SectionTitle>What <span>Trekkers</span> Say</SectionTitle>
        <SectionSubtitle>Real experiences from adventurers who conquered this trail</SectionSubtitle>
      </SectionHeader>

      {/* ── Overall Rating ── */}
      {avgRating > 0 && (
        <OverallRatingBox>
          <RatingNumber>
            {avgRating.toFixed(1)}<RatingMax>/5</RatingMax>
          </RatingNumber>
          <RatingMeta>
            <RatingStars>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} $filled={n <= Math.round(avgRating)}>★</Star>
              ))}
            </RatingStars>
            <RatingText>
              <FaCheckCircle />
              Based on {reviews.length} verified review{reviews.length !== 1 ? "s" : ""}
            </RatingText>
            <TrustBadges>
              <TrustBadge><FiShield /> Verified Trekkers</TrustBadge>
              <TrustBadge><FiUsers /> Real Experiences</TrustBadge>
            </TrustBadges>
          </RatingMeta>
        </OverallRatingBox>
      )}

      {/* ── Rating Bars ── */}
      <RatingBarsSection>
        <RatingBarsHeader>
          <RatingBarsTitle><FiTrendingUp /> Detailed Ratings</RatingBarsTitle>
          <ExcellentBadge><FaMedal /> Excellent Overall</ExcellentBadge>
        </RatingBarsHeader>
        <RatingBarsGrid>
          {RATING_CATEGORIES.map((cat, index) => (
            <RatingBarItem key={cat.label}>
              <RatingBarIcon>{cat.icon}</RatingBarIcon>
              <RatingBarContent>
                <RatingBarLabel>
                  {cat.label}
                  <RatingBarValue>{cat.value.toFixed(1)}</RatingBarValue>
                </RatingBarLabel>
                <RatingBarTrack>
                  <RatingBarFill $width={`${(cat.value / 5) * 100}%`} />
                </RatingBarTrack>
              </RatingBarContent>
            </RatingBarItem>
          ))}
        </RatingBarsGrid>
      </RatingBarsSection>

      {/* ── Review Form ── */}
      <ReviewForm
        trekId={trekId}
        trekTitle={trekTitle}
        onReviewSubmitted={handleNewReview}
      />

      <Divider />

      {/* ── Reviews Grid ── */}
      {reviews.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏔️</EmptyIcon>
          <SectionTitle style={{ fontSize: "1.25rem" }}>No reviews yet</SectionTitle>
          <p>Be the first to share your experience on this trek!</p>
        </EmptyState>
      ) : (
        <ReviewsGrid>
          {displayedReviews.map((r, i) => (
            <SingleReviewCard
              key={r.id || i}
              r={r}
              index={i}
              newReviewId={newReviewId}
              onDelete={handleDeleteRequest}
            />
          ))}
        </ReviewsGrid>
      )}

      {reviews.length > 6 && !showAll && (
        <ShowMoreButton onClick={() => setShowAll(true)}>
          Show All {reviews.length} Reviews
          <FaChevronDown />
        </ShowMoreButton>
      )}

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <ModalBox
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalIcon><FaExclamationTriangle /></ModalIcon>
              <ModalTitle>Delete Review?</ModalTitle>
              <ModalText>
                This will permanently remove {deleteTarget.authorName}'s review.
                This action cannot be undone.
              </ModalText>
              {deleteError && (
                <AlertBox $type="error" style={{ marginBottom: "1rem", textAlign: "left" }}>
                  <FaTimes />
                  {deleteError}
                </AlertBox>
              )}
              <ModalBtns>
                <ModalCancelBtn onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Cancel
                </ModalCancelBtn>
                <ModalDeleteBtn onClick={handleConfirmDelete} disabled={deleting}>
                  {deleting ? (
                    <><DeleteSpinner /> Deleting...</>
                  ) : (
                    <><FaTrash /> Delete</>
                  )}
                </ModalDeleteBtn>
              </ModalBtns>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Section>
  );
}