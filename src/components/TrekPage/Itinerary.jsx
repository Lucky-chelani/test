import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoon,
  FaRoute,
  FaUtensils,
  FaCheckCircle,
  FaMountain,
  FaTimes,
} from "react-icons/fa";
import {
  FiChevronRight,
  FiClock,
  FiTrendingUp,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#111111",
    bgElevated: "#1a1a1a",
    bgHover: "#1f1f1f",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.15)",
    primary: "#f97316",
    primaryDark: "#ea580c",
    primaryLight: "#fb923c",
    primaryGlow: "rgba(249, 115, 22, 0.12)",
    primaryBorder: "rgba(249, 115, 22, 0.3)",
    teal: "#14b8a6",
    tealGlow: "rgba(20, 184, 166, 0.15)",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748b",
    surface1: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.06)",
    success: "#22c55e",
    successGlow: "rgba(34, 197, 94, 0.12)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "100px" },
  transition: {
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.15s ease",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0   rgba(249,115,22,0.4); }
  50%       { box-shadow: 0 0 0 10px rgba(249,115,22,0);   }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const modalSlideIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.92);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
`;

const tagSlide = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const dotPop = keyframes`
  0%   { transform: scale(0) translate(-50%, -100%); opacity: 0; }
  70%  { transform: scale(1.3) translate(-38%, -77%); }
  100% { transform: scale(1) translate(-50%, -100%);   opacity: 1; }
`;

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
const useFadeIn = (threshold = 0.12) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [threshold]);

  return [ref, visible];
};

// ─── FadeInView Wrapper ───────────────────────────────────────────────────────
const FadeInView = ({ children, delay = "0s", style, className }) => {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease-out ${delay}, transform 0.7s ease-out ${delay}`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatMeals = (meals) => {
  if (!meals) return null;
  if (typeof meals === "string") return meals;
  if (Array.isArray(meals)) return meals.join(", ");
  if (typeof meals === "object") {
    const list = [];
    if (meals.breakfast) list.push("Breakfast");
    if (meals.lunch) list.push("Lunch");
    if (meals.dinner) list.push("Dinner");
    if (!list.length) return null;
    if (list.length === 3) return "All Meals";
    return list.join(", ");
  }
  return null;
};

// ─── Map Coordinates (up to 8 stops) ─────────────────────────────────────────
const MAP_COORDS = [
  { cx: "18%", cy: "14%" },
  { cx: "68%", cy: "24%" },
  { cx: "28%", cy: "38%" },
  { cx: "72%", cy: "52%" },
  { cx: "22%", cy: "66%" },
  { cx: "65%", cy: "76%" },
  { cx: "35%", cy: "87%" },
  { cx: "60%", cy: "95%" },
];

const TRAIL_D =
  "M 144 98 C 300 60, 520 168, 544 196 " +
  "C 580 240, 260 266, 224 308 " +
  "C 188 350, 560 346, 576 416 " +
  "C 600 476, 210 447, 176 524 " +
  "C 150 580, 520 517, 520 601 " +
  "C 520 651, 280 608, 280 679 " +
  "C 280 716, 480 679, 480 740";

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  color: ${tokens.colors.textPrimary};
  * {
    box-sizing: border-box;
  }
`;

/* ── HERO MAP SECTION ── */
const MapSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 480px;
  padding: 5rem 1.5rem 4rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 600px) {
    min-height: auto;
    padding: 4rem 1rem 3rem;
  }
`;

const MapCanvas = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
  background: ${({ color }) => color || tokens.colors.primary};
  width: ${({ size }) => size || "400px"};
  height: ${({ size }) => size || "400px"};
  top: ${({ top }) => top || "0"};
  left: ${({ left }) => left || "auto"};
  right: ${({ right }) => right || "auto"};
  animation: ${float} ${({ dur }) => dur || "6s"} ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
`;

const MapGrid = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.04;
`;

const TopoLines = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.06;
  pointer-events: none;
`;

const RiverSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.5;
`;

const MountainSvg = styled.svg`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 260px;
  pointer-events: none;
  opacity: 0.18;
`;

const HeroCenter = styled.div`
  position: relative;
  z-index: 5;
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${tokens.colors.teal};
  font-weight: 600;
  margin-bottom: 1rem;

  &::before,
  &::after {
    content: "";
    height: 1px;
    width: 36px;
    background: ${tokens.colors.teal};
    opacity: 0.4;
  }
`;

const HeroTitle = styled.h2`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  font-style: italic;
  color: #ffffff;
  letter-spacing: 0.02em;
  margin: 0 0 1rem;
  line-height: 1.15;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.6);
`;

const HeroSub = styled.p`
  font-size: 0.9375rem;
  color: ${tokens.colors.textMuted};
  margin: 0;
  letter-spacing: 0.02em;
`;

const StatsRow = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StatPillBase = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.25rem;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.pill};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${tokens.colors.textSecondary};
  transition: ${tokens.transition.base};

  svg {
    color: ${tokens.colors.primary};
    font-size: 0.875rem;
  }

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.textPrimary};
    background: rgba(30, 30, 30, 0.9);
    transform: translateY(-3px);
  }
`;

/* ── INLINE MAP (desktop & mobile) ── */
const InlineMapWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 3rem auto 5rem;
  padding: 0 1rem;

  @media (max-width: 600px) {
    margin: 2rem auto 3rem;
  }
`;

const InlineMapSvgBg = styled.svg`
  width: 100%;
  height: 760px;
  display: block;

  @media (max-width: 600px) {
    height: 600px;
  }
`;

const MapPin = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: ${tokens.transition.spring};
  animation: ${css`${dotPop}`} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: ${({ $delay }) => $delay || "0s"};

  &:hover {
    z-index: 20;
  }

  @media (max-width: 600px) {
    transform: translate(-50%, -100%) scale(0.9);
  }
`;

const PinDot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary},
    ${tokens.colors.primaryDark}
  );
  border: 3px solid rgba(249, 115, 22, 0.4);
  box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.12);
  transition: ${tokens.transition.spring};
  animation: ${css`${pulse}`} 2.5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};

  ${MapPin}:hover & {
    transform: scale(1.3);
    background: linear-gradient(135deg, #fbbf24, ${tokens.colors.primary});
  }

  @media (max-width: 600px) {
    width: 14px;
    height: 14px;
    border-width: 2px;
  }
`;

const PinLabel = styled.div`
  background: rgba(17, 17, 17, 0.92);
  backdrop-filter: blur(10px);
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.md};
  padding: 0.45rem 0.75rem;
  margin-bottom: 4px;
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  span.day-num {
    display: block;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${tokens.colors.primary};
    font-weight: 700;
    margin-bottom: 2px;
  }

  span.day-title {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${tokens.colors.textPrimary};
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 600px) {
    padding: 0.35rem 0.6rem;
    
    span.day-num {
      font-size: 0.55rem;
    }
    
    span.day-title {
      font-size: 0.7rem;
      max-width: 100px;
    }
  }
`;

/* ── MODAL POPUP (OPTIMIZED) ── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 680px;
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.xl};
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${modalSlideIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7),
              0 0 0 1px rgba(249, 115, 22, 0.1);
  will-change: transform, opacity;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${tokens.colors.primary} ${tokens.colors.bgElevated};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 600px) {
    padding: 1.5rem;
    max-height: 92vh;
    border-radius: ${tokens.radius.lg};
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 36px;
  height: 36px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  color: ${tokens.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${tokens.transition.fast};
  font-size: 1.1rem;
  z-index: 10;

  &:hover {
    background: rgba(249, 115, 22, 0.15);
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }

  @media (max-width: 600px) {
    top: 1rem;
    right: 1rem;
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.75rem;
  padding-right: 2.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
    padding-right: 2rem;
  }
`;

const ModalDayBadge = styled.div`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${tokens.radius.pill};
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary},
    ${tokens.colors.primaryDark}
  );
  border: 1px solid rgba(249, 115, 22, 0.5);
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);

  svg {
    font-size: 0.7rem;
  }
`;

const ModalTitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const ModalTitle = styled.h3`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.65rem;
  font-weight: 700;
  font-style: italic;
  color: ${tokens.colors.textPrimary};
  margin: 0 0 0.5rem;
  line-height: 1.25;

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${tokens.colors.textMuted};
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  svg {
    color: ${tokens.colors.primary};
    font-size: 0.75rem;
  }
`;

const ModalHighlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ModalHighlightTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.875rem;
  background: ${tokens.colors.successGlow};
  border: 1px solid rgba(34, 197, 94, 0.28);
  border-radius: ${tokens.radius.pill};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${tokens.colors.success};
  transition: ${tokens.transition.fast};

  &:hover {
    background: rgba(34, 197, 94, 0.22);
    transform: translateY(-2px);
  }

  svg {
    font-size: 0.65rem;
  }
`;

const ModalDescription = styled.p`
  font-size: 0.9375rem;
  color: ${tokens.colors.textSecondary};
  line-height: 1.75;
  margin: 0 0 1.75rem;
  padding: 1rem 1.25rem;
  background: ${tokens.colors.surface1};
  border-left: 3px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.md};

  @media (max-width: 600px) {
    font-size: 0.875rem;
    padding: 0.875rem 1rem;
    line-height: 1.7;
  }
`;

const ModalDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.875rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const ModalDetailCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.md};
  transition: ${tokens.transition.base};

  &:hover {
    background: rgba(249, 115, 22, 0.08);
    border-color: ${tokens.colors.primaryBorder};
    transform: translateY(-2px);
  }
`;

const ModalDetailIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${tokens.radius.md};
  background: linear-gradient(
    135deg,
    ${tokens.colors.primaryGlow},
    rgba(249, 115, 22, 0.22)
  );
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1rem;
  flex-shrink: 0;
  transition: ${tokens.transition.spring};

  ${ModalDetailCard}:hover & {
    transform: scale(1.1);
    background: linear-gradient(
      135deg,
      ${tokens.colors.primary},
      ${tokens.colors.primaryDark}
    );
    color: #fff;
  }
`;

const ModalDetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
`;

const ModalDetailLabel = styled.span`
  font-size: 0.68rem;
  color: ${tokens.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 500;
`;

const ModalDetailValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Itinerary({ itinerary = [] }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedDay(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedDay !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedDay]);

  if (!itinerary || itinerary.length === 0) return null;

  const visibleCoords = MAP_COORDS.slice(0, itinerary.length);

  const openDayModal = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const closeDayModal = () => {
    setSelectedDay(null);
  };

  const currentDay = selectedDay !== null ? itinerary[selectedDay] : null;

  return (
    <Wrapper>
      {/* ── HERO MAP HEADER ── */}
      <MapSection>
        <MapCanvas>
          <GlowOrb
            color={tokens.colors.primary}
            size="500px"
            top="-10%"
            left="-8%"
            dur="7s"
            delay="0s"
          />
          <GlowOrb
            color={tokens.colors.teal}
            size="350px"
            top="30%"
            right="-5%"
            dur="9s"
            delay="2s"
          />
          <GlowOrb
            color={tokens.colors.primary}
            size="280px"
            top="65%"
            left="20%"
            dur="8s"
            delay="4s"
          />

          <MapGrid>
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </MapGrid>

          <TopoLines
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
          >
            {[80, 140, 200, 260, 320].map((r, i) => (
              <ellipse
                key={i}
                cx="200"
                cy="180"
                rx={r}
                ry={r * 0.55}
                fill="none"
                stroke={tokens.colors.teal}
                strokeWidth="1"
                opacity={0.7 - i * 0.1}
              />
            ))}
            {[60, 110, 160, 210].map((r, i) => (
              <ellipse
                key={`b${i}`}
                cx="780"
                cy="380"
                rx={r}
                ry={r * 0.5}
                fill="none"
                stroke={tokens.colors.primary}
                strokeWidth="0.8"
                opacity={0.6 - i * 0.1}
              />
            ))}
          </TopoLines>

          <RiverSvg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M -50 200 C 200 150, 400 350, 600 250 C 800 150, 900 400, 1100 300"
              fill="none"
              stroke="#162438"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M -50 202 C 200 152, 400 352, 600 252 C 800 152, 900 402, 1100 302"
              fill="none"
              stroke="#0f172a"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </RiverSvg>

          <MountainSvg viewBox="0 0 1200 260" preserveAspectRatio="none">
            <path
              d="M0 260 L120 80 L200 160 L320 40 L430 180 L560 60 L670 200 L780 30 L890 170 L1000 90 L1100 210 L1200 100 L1200 260 Z"
              fill="#2c323f"
            />
            <path
              d="M0 260 L130 90 L210 170 L330 50 L440 190 L570 70 L680 210 L790 40 L900 180 L1010 100 L1110 220 L1200 110 L1200 260 Z"
              fill="#1e222b"
            />
            {[
              "M320 40 L305 72 L325 65 L340 75 Z",
              "M560 60 L548 88 L565 80 L578 90 Z",
              "M780 30 L762 68 L784 58 L800 70 Z",
            ].map((d, i) => (
              <path key={i} d={d} fill="#cad0dd" opacity="0.75" />
            ))}
          </MountainSvg>
        </MapCanvas>

        <HeroCenter>
          <FadeInView delay="0s">
            <Eyebrow>The Journey</Eyebrow>
            <HeroTitle>A Trip to Remember</HeroTitle>
            <HeroSub>{itinerary.length} days of curated adventure</HeroSub>
          </FadeInView>
        </HeroCenter>

        <StatsRow>
          <FadeInView delay="0.1s">
            <StatPillBase>
              <FaCalendarAlt /> {itinerary.length} Days
            </StatPillBase>
          </FadeInView>
          <FadeInView delay="0.2s">
            <StatPillBase>
              <FaMapMarkerAlt /> {itinerary.length} Destinations
            </StatPillBase>
          </FadeInView>
          <FadeInView delay="0.3s">
            <StatPillBase>
              <FaMountain /> Full Itinerary
            </StatPillBase>
          </FadeInView>
        </StatsRow>
      </MapSection>

      {/* ── INTERACTIVE MAP ── */}
      <InlineMapWrapper>
        <InlineMapSvgBg viewBox="0 0 800 760" preserveAspectRatio="none">
          <rect x="0" y="0" width="800" height="760" rx="20" fill="#111111" />
          <rect
            x="0"
            y="0"
            width="800"
            height="760"
            rx="20"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <defs>
            <pattern
              id="mapgrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.025)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="800"
            height="760"
            rx="20"
            fill="url(#mapgrid)"
          />

          {/* Topo rings */}
          <ellipse
            cx="160"
            cy="150"
            rx="100"
            ry="60"
            fill="none"
            stroke={tokens.colors.teal}
            strokeWidth="0.8"
            opacity="0.08"
          />
          <ellipse
            cx="160"
            cy="150"
            rx="60"
            ry="36"
            fill="none"
            stroke={tokens.colors.teal}
            strokeWidth="0.8"
            opacity="0.12"
          />
          <ellipse
            cx="640"
            cy="560"
            rx="120"
            ry="70"
            fill="none"
            stroke={tokens.colors.primary}
            strokeWidth="0.8"
            opacity="0.08"
          />
          <ellipse
            cx="640"
            cy="560"
            rx="70"
            ry="42"
            fill="none"
            stroke={tokens.colors.primary}
            strokeWidth="0.8"
            opacity="0.1"
          />

          {/* River */}
          <path
            d="M 260 -20 C 50 150, 700 350, 450 650 C 360 750, 120 720, 0 960"
            fill="none"
            stroke="#162438"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 255 -20 C 45 150, 695 350, 445 650 C 355 750, 115 720, -5 960"
            fill="none"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Mountains */}
          <path
            d="M 400 760 L 480 600 L 520 670 L 570 550 L 620 650 L 680 530 L 730 610 L 800 470 L 800 760 Z"
            fill="#1e222b"
            opacity="0.6"
          />
          <path
            d="M 570 550 L 552 582 L 572 572 L 585 580 Z"
            fill="#cad0dd"
            opacity="0.5"
          />
          <path
            d="M 680 530 L 665 560 L 682 552 L 695 560 Z"
            fill="#cad0dd"
            opacity="0.4"
          />

          {/* Trees */}
          <text x="90" y="340" fontSize="18" opacity="0.3">
            🌲🌲
          </text>
          <text x="680" y="220" fontSize="14" opacity="0.25">
            🌲🌲🌲
          </text>
          <text x="330" y="490" fontSize="16" opacity="0.28">
            🌲🌲
          </text>
          <text x="550" y="690" fontSize="14" opacity="0.25">
            🌲🌲🌲
          </text>

          {/* Trail */}
          <path
            d={TRAIL_D}
            fill="none"
            stroke="rgba(249,115,22,0.15)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={TRAIL_D}
            fill="none"
            stroke="rgba(249,115,22,0.35)"
            strokeWidth="2.5"
            strokeDasharray="8 10"
            strokeLinecap="round"
          />
        </InlineMapSvgBg>

        {/* Waypoint pins */}
        {itinerary.map((day, i) => {
          const coord =
            visibleCoords[i] || visibleCoords[visibleCoords.length - 1];
          return (
            <MapPin
              key={i}
              style={{ left: coord.cx, top: coord.cy }}
              $delay={`${i * 0.12 + 0.3}s`}
              onClick={() => openDayModal(i)}
            >
              <PinLabel>
                <span className="day-num">Day {day.day}</span>
                <span className="day-title">{day.title}</span>
              </PinLabel>
              <PinDot $delay={`${i * 0.12}s`} />
            </MapPin>
          );
        })}
      </InlineMapWrapper>

      {/* ── MODAL POPUP (OPTIMIZED) ── */}
      {selectedDay !== null && currentDay && (
        <ModalOverlay onClick={closeDayModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={closeDayModal}>
              <FaTimes />
            </ModalClose>

            <ModalHeader>
              <ModalDayBadge>
                {selectedDay === 0 ? (
                  <FiSun />
                ) : selectedDay === itinerary.length - 1 ? (
                  <FiMoon />
                ) : (
                  <FaRoute />
                )}
                Day {currentDay.day}
              </ModalDayBadge>
              <ModalTitleWrap>
                <ModalTitle>{currentDay.title}</ModalTitle>
                {(currentDay.duration || currentDay.elevation) && (
                  <ModalMeta>
                    {currentDay.duration && (
                      <span>
                        <FiClock /> {currentDay.duration}
                      </span>
                    )}
                    {currentDay.elevation && (
                      <span>
                        <FiTrendingUp /> {currentDay.elevation}
                      </span>
                    )}
                  </ModalMeta>
                )}
              </ModalTitleWrap>
            </ModalHeader>

            {currentDay.highlights?.length > 0 && (
              <ModalHighlights>
                {currentDay.highlights.map((h, idx) => (
                  <ModalHighlightTag key={idx}>
                    <FaCheckCircle /> {h}
                  </ModalHighlightTag>
                ))}
              </ModalHighlights>
            )}

            <ModalDescription>{currentDay.description}</ModalDescription>

            {(currentDay.duration ||
              currentDay.elevation ||
              currentDay.accommodation ||
              formatMeals(currentDay.meals)) && (
              <ModalDetailsGrid>
                {currentDay.duration && (
                  <ModalDetailCard>
                    <ModalDetailIcon>
                      <FiClock />
                    </ModalDetailIcon>
                    <ModalDetailContent>
                      <ModalDetailLabel>Duration</ModalDetailLabel>
                      <ModalDetailValue>{currentDay.duration}</ModalDetailValue>
                    </ModalDetailContent>
                  </ModalDetailCard>
                )}
                {currentDay.elevation && (
                  <ModalDetailCard>
                    <ModalDetailIcon>
                      <FiTrendingUp />
                    </ModalDetailIcon>
                    <ModalDetailContent>
                      <ModalDetailLabel>Elevation</ModalDetailLabel>
                      <ModalDetailValue>
                        {currentDay.elevation}
                      </ModalDetailValue>
                    </ModalDetailContent>
                  </ModalDetailCard>
                )}
                {currentDay.accommodation && (
                  <ModalDetailCard>
                    <ModalDetailIcon>
                      <FaMoon />
                    </ModalDetailIcon>
                    <ModalDetailContent>
                      <ModalDetailLabel>Stay</ModalDetailLabel>
                      <ModalDetailValue>
                        {currentDay.accommodation}
                      </ModalDetailValue>
                    </ModalDetailContent>
                  </ModalDetailCard>
                )}
                {formatMeals(currentDay.meals) && (
                  <ModalDetailCard>
                    <ModalDetailIcon>
                      <FaUtensils />
                    </ModalDetailIcon>
                    <ModalDetailContent>
                      <ModalDetailLabel>Meals</ModalDetailLabel>
                      <ModalDetailValue>
                        {formatMeals(currentDay.meals)}
                      </ModalDetailValue>
                    </ModalDetailContent>
                  </ModalDetailCard>
                )}
              </ModalDetailsGrid>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}