import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaImages, FaPlay } from "react-icons/fa";
import { FiZoomIn, FiArrowRight, FiMaximize2, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getValidImageUrl } from "../../utils/images";

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
    glass: "rgba(255, 255, 255, 0.08)",
    glassBorder: "rgba(255, 255, 255, 0.12)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", pill: "100px" },
  transition: {
    fast: "all 0.15s ease",
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
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

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const expandPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ─── Styled Components ────────────────────────────────────────────────────────
const GallerySection = styled(motion.section)`
  background: ${tokens.colors.bgCard};
  position: relative;
  padding: 5rem 0;
  margin: 4rem 0;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse 60% 50% at 20% 30%,
        rgba(249, 115, 22, 0.06) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 50% 40% at 80% 70%,
        rgba(249, 115, 22, 0.04) 0%,
        transparent 55%
      );
    pointer-events: none;
  }

  &::after {
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
    padding: 2.5rem 0 3rem;
    margin: 1.5rem 0;
  }
`;

const GalleryContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const GalleryHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3.5rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
`;

const EyebrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

const GalleryEyebrow = styled.div`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${tokens.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 0.875rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  @media (max-width: 640px) {
    font-size: 0.625rem;
    letter-spacing: 0.15em;
    gap: 0.375rem;

    svg {
      font-size: 0.75rem;
    }
  }
`;

const EyebrowLine = styled.div`
  width: 40px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${tokens.colors.primary},
    transparent
  );

  @media (max-width: 640px) {
    width: 24px;
  }
`;

const GalleryTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: clamp(1.75rem, 4vw, 3rem);
  color: ${tokens.colors.textPrimary};
  margin-bottom: 0.75rem;
  position: relative;
  display: inline-block;

  span {
    background: linear-gradient(
      135deg,
      ${tokens.colors.primary},
      ${tokens.colors.primaryLight}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 640px) {
    margin-bottom: 0.5rem;
  }
`;

const GallerySubtitle = styled.p`
  font-size: 1rem;
  color: ${tokens.colors.textMuted};
  font-style: italic;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.5;
    max-width: 100%;
    padding: 0 0.5rem;
  }
`;

const PhotoCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.primary};
  margin-top: 1.25rem;
  animation: ${float} 3s ease-in-out infinite;

  svg {
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    padding: 0.375rem 0.875rem;
    font-size: 0.75rem;
    margin-top: 1rem;
    animation: none;

    svg {
      font-size: 0.75rem;
    }
  }
`;

const DemoLabel = styled.span`
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  background: rgba(249, 115, 22, 0.3);
  border-radius: 4px;
  margin-left: 0.25rem;

  @media (max-width: 640px) {
    font-size: 0.5625rem;
    padding: 0.125rem 0.25rem;
  }
`;

// ─── Desktop Grid ─────────────────────────────────────────────────────────────
const GalleryGrid = styled(motion.div)`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: ${({ $count }) => {
    if ($count >= 5) return "2fr 1fr 1fr";
    if ($count === 4) return "repeat(2, 1fr)";
    if ($count === 3) return "repeat(3, 1fr)";
    return "repeat(auto-fit, minmax(280px, 1fr))";
  }};
  grid-template-rows: ${({ $count }) => {
    if ($count >= 5) return "repeat(2, 240px)";
    if ($count === 4) return "repeat(2, 240px)";
    if ($count === 3) return "280px";
    return "280px";
  }};

  @media (max-width: 900px) {
    grid-template-columns: ${({ $count }) =>
      $count >= 5 ? "1fr 1fr" : "repeat(auto-fit, minmax(280px, 1fr))"};
    grid-template-rows: ${({ $count }) =>
      $count >= 5 ? "repeat(3, 220px)" : "auto"};
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

// ─── Mobile Carousel ──────────────────────────────────────────────────────────
const MobileCarouselWrapper = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
    position: relative;
    padding-bottom: 3rem;
  }
`;

const CarouselScrollContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0 1rem 1.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Fade gradient on edges */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,
    black 95%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,
    black 95%,
    transparent
  );
`;

const CarouselItem = styled(motion.div)`
  flex: 0 0 85%;
  scroll-snap-align: center;
  border-radius: ${tokens.radius.lg};
  overflow: hidden;
  position: relative;
  border: 1px solid ${tokens.colors.border};
  background: ${tokens.colors.bgElevated};
  cursor: pointer;
  transition: ${tokens.transition.base};

  &:first-child {
    margin-left: 7.5%;
  }

  &:last-child {
    margin-right: 7.5%;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CarouselImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: ${tokens.colors.bgElevated};
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${CarouselItem}:active & {
    transform: scale(1.05);
  }
`;

const CarouselOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 10, 0.9) 0%,
    rgba(10, 10, 10, 0.3) 40%,
    transparent 70%
  );
  pointer-events: none;
`;

const CarouselBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${({ $isDemo }) =>
    $isDemo
      ? "rgba(100, 116, 139, 0.9)"
      : `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark})`};
  backdrop-filter: blur(8px);
  border-radius: ${tokens.radius.pill};
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  svg {
    font-size: 0.625rem;
  }
`;

const CarouselInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CarouselTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};

  svg {
    color: ${tokens.colors.primary};
    font-size: 1rem;
  }
`;

const CarouselCounter = styled.div`
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  font-family: "JetBrains Mono", monospace;
`;

const ExpandButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  z-index: 5;
  cursor: pointer;
  transition: ${tokens.transition.spring};

  &:active {
    transform: scale(0.9);
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  }
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0 0;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "24px" : "8px")};
  height: 8px;
  border-radius: ${tokens.radius.pill};
  background: ${({ $active }) =>
    $active ? tokens.colors.primary : tokens.colors.border};
  border: none;
  cursor: pointer;
  transition: ${tokens.transition.base};
  padding: 0;

  &:active {
    transform: scale(0.9);
  }
`;

const SwipeHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin: 0 1rem;
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.md};
  font-size: 0.75rem;
  color: ${tokens.colors.primary};
  font-weight: 600;
  animation: ${slideIn} 0.6s ease-out;

  svg {
    font-size: 0.875rem;
    animation: ${float} 2s ease-in-out infinite;
  }
`;

// ─── Desktop Gallery Item ─────────────────────────────────────────────────────
const GalleryItem = styled(motion.div)`
  border-radius: ${tokens.radius.xl};
  overflow: hidden;
  position: relative;
  cursor: ${({ $isDemo }) => ($isDemo ? "default" : "pointer")};
  border: 1px solid ${tokens.colors.border};
  min-height: 240px;
  grid-row: ${({ $isFirst, $totalCount }) =>
    $isFirst && $totalCount >= 5 ? "span 2" : "auto"};
  transition: ${tokens.transition.base};

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: ${tokens.radius.xl};
    background: linear-gradient(
      135deg,
      ${tokens.colors.primary},
      ${tokens.colors.primaryDark}
    );
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

    &::before {
      opacity: 1;
      animation: ${glow} 2s ease-in-out infinite;
    }
  }

  @media (max-width: 900px) {
    grid-row: ${({ $isFirst, $totalCount }) =>
      $isFirst && $totalCount >= 5 ? "span 1" : "auto"};
    grid-column: ${({ $isFirst, $totalCount }) =>
      $isFirst && $totalCount >= 5 ? "span 2" : "auto"};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.85) saturate(1.1);

  ${GalleryItem}:hover & {
    transform: scale(1.08);
    filter: brightness(1) saturate(1.2);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 10, 10, 0.8) 0%,
    rgba(10, 10, 10, 0.2) 40%,
    transparent 70%
  );
  pointer-events: none;
  transition: ${tokens.transition.base};

  ${GalleryItem}:hover & {
    background: linear-gradient(
      to top,
      rgba(10, 10, 10, 0.9) 0%,
      rgba(10, 10, 10, 0.3) 50%,
      transparent 80%
    );
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  border-radius: ${tokens.radius.pill};
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 3;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);

  svg {
    font-size: 0.625rem;
  }
`;

const DemoBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(100, 116, 139, 0.8);
  backdrop-filter: blur(8px);
  border-radius: ${tokens.radius.pill};
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 3;
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.125rem;
  z-index: 5;
  cursor: pointer;
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: scale(0.8);
  transition: ${tokens.transition.spring};

  ${GalleryItem}:hover & {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
    transform: scale(1);
  }

  &:hover {
    background: ${({ $disabled }) =>
      $disabled
        ? tokens.colors.glass
        : `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark})`};
    border-color: ${({ $disabled }) => ($disabled ? tokens.colors.glassBorder : tokens.colors.primary)};
    transform: ${({ $disabled }) => ($disabled ? "scale(1)" : "scale(1.15)")};
    box-shadow: ${({ $disabled }) =>
      $disabled ? "none" : `0 8px 25px rgba(249, 115, 22, 0.5)`};
    animation: ${({ $disabled }) => ($disabled ? "none" : css`${expandPulse} 0.6s ease`)};
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "scale(1)" : "scale(0.95)")};
  }
`;

const ImageInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  transform: translateY(10px);
  opacity: 0;
  transition: ${tokens.transition.base};

  ${GalleryItem}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ImageTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};

  svg {
    color: ${tokens.colors.primary};
    font-size: 1rem;
  }
`;

const MorePhotosOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(8px);
  transition: ${tokens.transition.base};

  ${GalleryItem}:hover & {
    background: rgba(10, 10, 10, 0.9);
  }
`;

const MoreCount = styled.span`
  font-family: "Sora", sans-serif;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary},
    ${tokens.colors.primaryLight}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const MoreLabel = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${tokens.colors.primary};
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  border: none;
  border-radius: ${tokens.radius.pill};
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-top: 0.75rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(249, 115, 22, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const LoadingPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: ${tokens.colors.bgElevated};
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 40px;
    height: 40px;
    border: 3px solid ${tokens.colors.border};
    border-top-color: ${tokens.colors.primary};
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
  }
`;

// ─── Modal Styled Components ──────────────────────────────────────────────────
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (max-width: 640px) {
    padding: 0;
  }
`;

const ModalContent = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    max-height: 100vh;
    height: 100vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: ${tokens.radius.lg} ${tokens.radius.lg} 0 0;
  border-bottom: 1px solid ${tokens.colors.glassBorder};
  backdrop-filter: blur(10px);

  @media (max-width: 640px) {
    padding: 1rem;
    border-radius: 0;
  }
`;

const ModalTitle = styled.h3`
  font-family: "Sora", sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: 0.9375rem;
  }
`;

const ImageCounter = styled.span`
  font-size: 0.875rem;
  color: ${tokens.colors.textSecondary};
  margin-left: 0.75rem;

  @media (max-width: 640px) {
    font-size: 0.6875rem;
    margin-left: 0.5rem;
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${tokens.colors.glassBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.textPrimary};
  cursor: pointer;
  transition: ${tokens.transition.base};
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.125rem;
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;

    svg {
      font-size: 1rem;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;

  @media (max-width: 640px) {
    padding: 0.5rem;
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${tokens.radius.lg};
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);

  @media (max-width: 640px) {
    border-radius: ${tokens.radius.sm};
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${tokens.colors.primary};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    border-width: 2px;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === "left" ? "left: 1rem;" : "right: 1rem;")}
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid ${tokens.colors.glassBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.textPrimary};
  cursor: pointer;
  transition: ${tokens.transition.base};
  backdrop-filter: blur(10px);
  z-index: 10;

  &:hover {
    background: ${tokens.colors.primary};
    border-color: ${tokens.colors.primary};
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      border-color: ${tokens.colors.glassBorder};
      transform: translateY(-50%);
    }
  }

  svg {
    font-size: 1.5rem;
  }

  @media (max-width: 640px) {
    ${({ $direction }) => ($direction === "left" ? "left: 0.5rem;" : "right: 0.5rem;")}
    width: 40px;
    height: 40px;

    svg {
      font-size: 1.25rem;
    }

    &:hover {
      transform: translateY(-50%) scale(1.05);
    }
  }
`;

// ─── Fallback Images ──────────────────────────────────────────────────────────
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80",
];

// ─── Gallery Modal Component ──────────────────────────────────────────────────
function GalleryModal({ isOpen, images, currentIndex, onClose, onNavigate, title }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) onNavigate("prev");
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) onNavigate("next");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setLoading(true);
  }, [currentIndex, isOpen]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>
              {title}
              <ImageCounter>
                {currentIndex + 1} / {images.length}
              </ImageCounter>
            </ModalTitle>
            <CloseButton onClick={onClose} title="Close gallery">
              <FiX />
            </CloseButton>
          </ModalHeader>

          <ImageContainer>
            {loading && <LoadingSpinner />}
            <ModalImage
              src={getValidImageUrl(currentImage)}
              alt={`${title} photo ${currentIndex + 1}`}
              onLoad={() => setLoading(false)}
              style={{ display: loading ? "none" : "block" }}
            />

            <NavButton
              $direction="left"
              onClick={() => onNavigate("prev")}
              disabled={!hasPrev}
              title="Previous image"
            >
              <FiChevronLeft />
            </NavButton>
            <NavButton
              $direction="right"
              onClick={() => onNavigate("next")}
              disabled={!hasNext}
              title="Next image"
            >
              <FiChevronRight />
            </NavButton>
          </ImageContainer>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhotoGallery({ images = [], title, onImageClick }) {
  const [loadedImages, setLoadedImages] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef(null);

  const hasRealImages = useMemo(() => {
    return images && Array.isArray(images) && images.filter(Boolean).length > 0;
  }, [images]);

  const actualImageCount = useMemo(() => {
    const validImages = images.filter(Boolean);
    return validImages.length;
  }, [images]);

  const galleryImages = useMemo(() => {
    const validImages = images.filter(Boolean);

    if (validImages.length > 0) {
      const result = [...validImages];
      let fallbackIndex = 0;
      
      while (result.length < 5) {
        result.push(FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length]);
        fallbackIndex++;
      }
      
      return result;
    }

    return FALLBACK_IMAGES.slice(0, 5);
  }, [images]);

  const allGalleryImages = useMemo(() => {
    const validImages = images.filter(Boolean);
    
    if (validImages.length > 0) {
      const result = [...validImages];
      let fallbackIndex = 0;
      
      while (result.length < 8) {
        result.push(FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length]);
        fallbackIndex++;
      }
      
      return result;
    }

    return FALLBACK_IMAGES;
  }, [images]);

  // Track carousel scroll position
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.offsetWidth * 0.85 + 16; // 85% + gap
      const index = Math.round(scrollLeft / itemWidth);
      setActiveCarouselIndex(index);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCarouselIndex = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const itemWidth = carousel.offsetWidth * 0.85 + 16;
    carousel.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth'
    });
  };

  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleImageClick = useCallback(
    (index) => {
      if (!hasRealImages) return;
      const safeIndex = Math.min(index, actualImageCount - 1);
      setCurrentImageIndex(safeIndex >= 0 ? safeIndex : 0);
      setModalOpen(true);
    },
    [hasRealImages, actualImageCount]
  );

  const handleFullscreenClick = useCallback(
    (e, index) => {
      e.stopPropagation();
      if (!hasRealImages) return;
      handleImageClick(index);
    },
    [hasRealImages, handleImageClick]
  );

  const handleNavigate = useCallback((direction) => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) => Math.max(0, prev - 1));
    } else if (direction === "next") {
      setCurrentImageIndex((prev) => Math.min(actualImageCount - 1, prev + 1));
    }
  }, [actualImageCount]);

  if (galleryImages.length === 0) return null;

  const displayCount = hasRealImages ? actualImageCount : 5;
  const showMoreOverlay = hasRealImages && actualImageCount > 5;

  return (
    <>
      <GallerySection
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <GalleryContainer>
          <GalleryHeader variants={headerVariants}>
            <EyebrowWrapper>
              <EyebrowLine />
              <GalleryEyebrow>
                <FaCamera /> Captured Moments
              </GalleryEyebrow>
              <EyebrowLine />
            </EyebrowWrapper>

            <GalleryTitle>
              Trek <span>Gallery</span>
            </GalleryTitle>

            <GallerySubtitle>
              {hasRealImages
                ? `Breathtaking views and unforgettable moments from ${title}`
                : "Sample gallery images - actual photos coming soon"}
            </GallerySubtitle>

            <PhotoCount>
              <FaImages />
              {hasRealImages ? (
                `${displayCount} Photos Available`
              ) : (
                <>
                  Demo Gallery
                  <DemoLabel>Sample</DemoLabel>
                </>
              )}
            </PhotoCount>
          </GalleryHeader>

          {/* Desktop Grid */}
          <GalleryGrid variants={containerVariants} $count={galleryImages.length}>
            {galleryImages.map((img, i) => {
              const isDemo = !hasRealImages;
              const isRealImage = hasRealImages && i < actualImageCount;
              const canClick = isRealImage;

              return (
                <GalleryItem
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: canClick ? -8 : -4 }}
                  onClick={() => canClick && handleImageClick(i)}
                  $isFirst={i === 0}
                  $totalCount={galleryImages.length}
                  $isDemo={isDemo}
                >
                  <ImageWrapper>
                    {!loadedImages[i] && <LoadingPlaceholder />}
                    <GalleryImage
                      src={getValidImageUrl(img)}
                      alt={`${title || "Trek"} photo ${i + 1}`}
                      onLoad={() => handleImageLoad(i)}
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                        handleImageLoad(i);
                      }}
                      style={{ opacity: loadedImages[i] ? 1 : 0 }}
                    />
                    <ImageOverlay />

                    {i === 0 && (
                      isDemo || !isRealImage ? (
                        <DemoBadge>Sample Image</DemoBadge>
                      ) : (
                        <FeaturedBadge>
                          <FaPlay /> Featured
                        </FeaturedBadge>
                      )
                    )}

                    <FullscreenButton
                      onClick={(e) => handleFullscreenClick(e, i)}
                      title={canClick ? "View fullscreen" : "Sample image"}
                      $disabled={!canClick}
                    >
                      <FiMaximize2 />
                    </FullscreenButton>

                    {i === 4 && showMoreOverlay ? (
                      <MorePhotosOverlay>
                        <MoreCount>+{actualImageCount - 5}</MoreCount>
                        <MoreLabel>More Photos</MoreLabel>
                        <ViewAllButton onClick={(e) => handleFullscreenClick(e, i)}>
                          View All Gallery <FiArrowRight />
                        </ViewAllButton>
                      </MorePhotosOverlay>
                    ) : (
                      <ImageInfo>
                        <ImageTitle>
                          <FiZoomIn />
                          {canClick ? "Click to expand" : "Sample image"}
                        </ImageTitle>
                      </ImageInfo>
                    )}
                  </ImageWrapper>
                </GalleryItem>
              );
            })}
          </GalleryGrid>

          {/* Mobile Carousel */}
          <MobileCarouselWrapper>
            <SwipeHint>
              <FiArrowRight />
              Swipe to explore all photos
            </SwipeHint>

            <CarouselScrollContainer ref={carouselRef}>
              {allGalleryImages.map((img, i) => {
                const isDemo = !hasRealImages;
                const isRealImage = hasRealImages && i < actualImageCount;
                const canClick = isRealImage;

                return (
                  <CarouselItem
                    key={i}
                    onClick={() => canClick && handleImageClick(i)}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <CarouselImageWrapper>
                      {!loadedImages[i] && <LoadingPlaceholder />}
                      <CarouselImage
                        src={getValidImageUrl(img)}
                        alt={`${title || "Trek"} photo ${i + 1}`}
                        onLoad={() => handleImageLoad(i)}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                          handleImageLoad(i);
                        }}
                        style={{ opacity: loadedImages[i] ? 1 : 0 }}
                      />
                      <CarouselOverlay />

                      <CarouselBadge $isDemo={isDemo || !isRealImage}>
                        {i === 0 && !isDemo && isRealImage ? (
                          <>
                            <FaPlay /> Featured
                          </>
                        ) : (
                          isDemo || !isRealImage ? "Sample" : `Photo ${i + 1}`
                        )}
                      </CarouselBadge>

                      {canClick && (
                        <ExpandButton onClick={(e) => handleFullscreenClick(e, i)}>
                          <FiMaximize2 />
                        </ExpandButton>
                      )}

                      <CarouselInfo>
                        <CarouselTitle>
                          <FiZoomIn />
                          {canClick ? "Tap to view fullscreen" : "Sample image"}
                        </CarouselTitle>
                        <CarouselCounter>
                          {i + 1} / {allGalleryImages.length}
                        </CarouselCounter>
                      </CarouselInfo>
                    </CarouselImageWrapper>
                  </CarouselItem>
                );
              })}
            </CarouselScrollContainer>

            <CarouselDots>
              {allGalleryImages.map((_, i) => (
                <Dot
                  key={i}
                  $active={i === activeCarouselIndex}
                  onClick={() => scrollToCarouselIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </CarouselDots>
          </MobileCarouselWrapper>
        </GalleryContainer>
      </GallerySection>

      <GalleryModal
        isOpen={modalOpen}
        images={images.filter(Boolean)}
        currentIndex={currentImageIndex}
        onClose={() => setModalOpen(false)}
        onNavigate={handleNavigate}
        title={title}
      />
    </>
  );
}