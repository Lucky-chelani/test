import React, { useState, useEffect, useRef, useCallback } from "react";
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
  FaHandPointer,
} from "react-icons/fa";
import {
  FiChevronRight,
  FiClock,
  FiTrendingUp,
  FiSun,
  FiMoon,
  FiX,
  FiInfo,
  FiMapPin,
  FiCompass,
  FiArrowRight,
} from "react-icons/fi";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0a0a0a",
  bgCard: "#111111",
  bgElevated: "#1a1a1a",
  bgGlass: "rgba(17,17,17,0.92)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.15)",
  primary: "#f97316",
  primaryDark: "#ea580c",
  primaryLight: "#fb923c",
  primaryGlow: "rgba(249, 115, 22, 0.12)",
  primaryBorder: "rgba(249, 115, 22, 0.3)",
  primaryBorderStrong: "rgba(249, 115, 22, 0.5)",
  teal: "#14b8a6",
  tealGlow: "rgba(20, 184, 166, 0.15)",
  ink: "#F1F5F9",
  inkMuted: "#94A3B8",
  inkFaint: "#64748b",
  success: "#22c55e",
  successGlow: "rgba(34, 197, 94, 0.12)",
  r: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "100px" },
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(22px); }
  to   { opacity:1; transform:translateY(0); }
`;
const float = keyframes`
  0%,100% { transform:translateY(0); }
  50%      { transform:translateY(-5px); }
`;
const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.45); }
  50%      { box-shadow: 0 0 0 9px rgba(249,115,22,0); }
`;
const shimmer = keyframes`
  0%   { background-position:-200% 0; }
  100% { background-position: 200% 0; }
`;
const ringExpand = keyframes`
  0%   { transform:scale(1); opacity:0.6; }
  100% { transform:scale(2.2); opacity:0; }
`;
const fadeIn = keyframes`
  from { opacity:0; }
  to   { opacity:1; }
`;
const slideUp = keyframes`
  from { opacity:0; transform:translateY(16px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1); }
`;
const dotPop = keyframes`
  0%   { transform:scale(0) translate(-50%,-100%); opacity:0; }
  70%  { transform:scale(1.25) translate(-40%,-80%); }
  100% { transform:scale(1) translate(-50%,-100%); opacity:1; }
`;
const lineGrow = keyframes`
  from { stroke-dashoffset:1600; }
  to   { stroke-dashoffset:0; }
`;
const bannerIn = keyframes`
  from { opacity:0; transform:translateY(-12px); }
  to   { opacity:1; transform:translateY(0); }
`;

// ─── Scroll-Reveal ────────────────────────────────────────────────────────────
const useFadeIn = () => {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  return [ref, v];
};

const Reveal = ({ children, delay = "0s", style }) => {
  const [ref, v] = useFadeIn();
  return (
    <div ref={ref} style={{
      ...style,
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.65s ease-out ${delay}, transform 0.65s ease-out ${delay}`,
    }}>
      {children}
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatMeals = (meals) => {
  if (!meals) return null;
  if (typeof meals === "string") return meals;
  if (Array.isArray(meals)) return meals.join(", ");
  if (typeof meals === "object") {
    const l = [];
    if (meals.breakfast) l.push("Breakfast");
    if (meals.lunch) l.push("Lunch");
    if (meals.dinner) l.push("Dinner");
    if (!l.length) return null;
    return l.length === 3 ? "All Meals" : l.join(", ");
  }
  return null;
};

const getPreview = (desc) => {
  if (!desc) return "";
  const s = desc.split(/[.!?]/)[0];
  return (s.length > 90 ? s.slice(0, 87) + "…" : s) + ".";
};

// ─── Map coordinates (up to 8 pins) ──────────────────────────────────────────
const COORDS = [
  { cx: "18%", cy: "11%" },
  { cx: "67%", cy: "22%" },
  { cx: "26%", cy: "36%" },
  { cx: "73%", cy: "50%" },
  { cx: "20%", cy: "64%" },
  { cx: "66%", cy: "75%" },
  { cx: "33%", cy: "87%" },
  { cx: "62%", cy: "95%" },
];

const TRAIL =
  "M 144 83 C 300 44, 520 158, 536 186 " +
  "C 572 232, 256 258, 208 299 " +
  "C 172 340, 560 337, 584 400 " +
  "C 608 464, 200 438, 160 508 " +
  "C 136 558, 520 504, 528 580 " +
  "C 536 640, 280 596, 264 660 " +
  "C 256 700, 480 665, 496 730";

// ─── Compute tooltip alignment from % position ────────────────────────────────
const getTooltipPos = (coord) => {
  const x = parseInt(coord.cx);
  const y = parseInt(coord.cy);

  let horizontal = "center";
  if (x < 32) horizontal = "left";
  else if (x > 68) horizontal = "right";

  const vertical = y < 35 ? "below" : "above";

  return { horizontal, vertical };
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  font-family: "Inter", -apple-system, sans-serif;
  color: ${T.ink};
  * { box-sizing: border-box; }
`;

/* ── HERO ── */
const Hero = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 6rem 2rem 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: ${({ $op }) => $op || 0.12};
  background: ${({ $c }) => $c || T.primary};
  width: ${({ $s }) => $s || "420px"};
  height: ${({ $s }) => $s || "420px"};
  top: ${({ $top }) => $top || "auto"};
  left: ${({ $l }) => $l || "auto"};
  right: ${({ $r }) => $r || "auto"};
  bottom: ${({ $b }) => $b || "auto"};
  animation: ${float} ${({ $dur }) => $dur || "7s"} ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;

const GridSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.04;
`;

const HeroLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${T.teal};
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;

  &::before, &::after {
    content: "";
    width: 36px;
    height: 1px;
    background: ${T.teal};
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
  position: relative;
  z-index: 2;
`;

const HeroSub = styled.p`
  font-size: 0.9375rem;
  color: ${T.inkMuted};
  margin: 0 0 2.5rem;
  letter-spacing: 0.02em;
  position: relative;
  z-index: 2;
`;

const StatRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
`;

const StatPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.25rem;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid ${T.border};
  border-radius: ${T.r.pill};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${T.inkMuted};
  transition: all 0.3s ${T.ease};

  svg { 
    color: ${T.primary}; 
    font-size: 0.875rem; 
  }

  &:hover {
    border-color: ${T.primaryBorder};
    color: ${T.ink};
    background: rgba(30, 30, 30, 0.9);
    transform: translateY(-3px);
  }
`;

/* ── DIVIDER ── */
const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0 2rem;
  margin: 0 0 1rem;

  span {
    color: ${T.primary};
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.7;
  }

  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${T.primaryBorder}, transparent);
  }
`;

/* ── MAP WRAPPER ── */
const MapWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  margin: 0 auto 5rem;
  padding: 0 1.5rem;

  @media (max-width: 600px) {
    margin-bottom: 3rem;
    padding: 0 0.75rem;
  }
`;

/* ── MOBILE BANNER ── */
const Banner = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 1.25rem;
    padding: 0.875rem 1.125rem;
    background: linear-gradient(
      135deg,
      rgba(249, 115, 22, 0.08) 0%,
      rgba(249, 115, 22, 0.12) 100%
    );
    border: 1px solid ${T.primaryBorder};
    border-radius: ${T.r.lg};
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.15);
    animation: ${bannerIn} 0.6s ${T.spring} both;
    animation-delay: 0.8s;
    position: relative;
    overflow: hidden;

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
        rgba(249, 115, 22, 0.1),
        transparent
      );
      animation: ${shimmer} 3s linear infinite;
    }
  }
`;

const BannerIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${T.r.md};
  background: linear-gradient(
    135deg,
    ${T.primary},
    ${T.primaryDark}
  );
  border: 1px solid ${T.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
  color: white;
  font-size: 1.125rem;
  flex-shrink: 0;

  svg {
    animation: ${float} 2.5s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: ${T.r.md};
    background: linear-gradient(
      135deg,
      ${T.primary},
      ${T.primaryLight}
    );
    opacity: 0.3;
    z-index: -1;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const BannerText = styled.div`
  flex: 1;
  font-size: 0.8125rem;
  color: ${T.inkMuted};
  font-weight: 500;
  letter-spacing: 0.02em;

  strong {
    color: ${T.primary};
    font-weight: 700;
  }
`;

const BannerClose = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${T.r.sm};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${T.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.inkFaint};
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s;

  &:hover, &:active {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${T.borderHover};
    color: ${T.inkMuted};
    transform: scale(0.95);
  }
`;

/* ── MAP SVG BG ── */
const MapSvg = styled.svg`
  width: 100%;
  height: 760px;
  display: block;
  border-radius: ${T.r.xl};
  overflow: hidden;

  @media (max-width: 600px) { 
    height: 620px; 
  }
`;

/* ── PIN ── */
const Pin = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: z-index 0s;
  animation: ${css`${dotPop}`} 0.5s ${T.spring} both;
  animation-delay: ${({ $d }) => $d || "0s"};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &.active, &:hover { z-index: 30; }

  @media (max-width: 600px) {
    transform: translate(-50%, -100%) scale(0.9);
  }
`;

const PinBubble = styled.div`
  background: ${T.bgGlass};
  backdrop-filter: blur(14px);
  border: 1px solid ${T.primaryBorder};
  border-radius: ${T.r.md};
  padding: 0.45rem 0.75rem;
  margin-bottom: 4px;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ${T.spring};

  .num {
    display: block;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${T.primary};
    font-weight: 700;
    margin-bottom: 2px;
  }

  .name {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${T.ink};
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${Pin}:hover &, ${Pin}.active & {
    transform: translateY(-4px);
    background: rgba(249, 115, 22, 0.15);
    border-color: ${T.primary};
    box-shadow: 0 12px 32px rgba(249, 115, 22, 0.3);
  }

  @media (max-width: 600px) {
    padding: 0.4rem 0.65rem;
    .num { font-size: 0.55rem; }
    .name { font-size: 0.7rem; max-width: 100px; }
  }
`;

const Dot = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${T.primary}, ${T.primaryDark});
  border: 3px solid rgba(249, 115, 22, 0.4);
  box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.12);
  animation: ${css`${pulse}`} 2.5s ease-in-out infinite;
  animation-delay: ${({ $d }) => $d || "0s"};
  transition: all 0.3s ${T.spring};

  &::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px solid rgba(249, 115, 22, 0.25);
    animation: ${css`${ringExpand}`} 2.5s ease-out infinite;
    animation-delay: ${({ $d }) => $d || "0s"};
  }

  ${Pin}:hover &, ${Pin}.active & {
    transform: scale(1.5);
    background: linear-gradient(135deg, #fbbf24, ${T.primary});
    border-width: 4px;
    box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.2);
  }

  @media (max-width: 600px) {
    width: 16px;
    height: 16px;
    border-width: 2.5px;

    ${Pin}:hover &, ${Pin}.active & {
      transform: scale(1.4);
      border-width: 3px;
    }
  }
`;

/* ── TOOLTIP ── */
const Tooltip = styled.div`
  position: absolute;
  z-index: 100;
  pointer-events: none;
  min-width: 240px;
  max-width: 290px;
  background: linear-gradient(
    135deg,
    rgba(17, 17, 17, 0.98),
    rgba(26, 26, 26, 0.98)
  );
  backdrop-filter: blur(18px);
  border: 1px solid ${T.primaryBorder};
  border-radius: ${T.r.lg};
  padding: 1rem 1.25rem;
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.6), 
    0 0 0 1px rgba(249, 115, 22, 0.2);
  animation: ${slideUp} 0.25s ${T.spring} both;

  /* Default: above pin, centered */
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);

  /* Arrow below (pointing down to pin) */
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    border: 8px solid transparent;
    border-top-color: ${T.primaryBorder};
  }
  &::before {
    content: "";
    position: absolute;
    top: 100%;
    border: 7px solid transparent;
    border-top-color: rgba(17, 17, 17, 0.98);
    margin-top: -1px;
    z-index: 1;
  }

  /* ─── VERTICAL: below ─── */
  &[data-v="below"] {
    bottom: auto;
    top: calc(100% + 14px);
    left: 50%;
    transform: translateX(-50%);

    /* Arrow above (pointing up to pin) */
    &::after {
      top: auto;
      bottom: 100%;
      border-top-color: transparent;
      border-bottom-color: ${T.primaryBorder};
    }
    &::before {
      top: auto;
      bottom: 100%;
      margin-top: 0;
      margin-bottom: -1px;
      border-top-color: transparent;
      border-bottom-color: rgba(17, 17, 17, 0.98);
    }
  }

  /* ─── HORIZONTAL: left-pinned ─── */
  &[data-h="left"] {
    left: 0;
    transform: translateX(0);

    &::after  { left: 20px; transform: translateX(0); }
    &::before { left: 20px; transform: translateX(0); }
  }

  /* ─── HORIZONTAL: right-pinned ─── */
  &[data-h="right"] {
    left: auto;
    right: 0;
    transform: translateX(0);

    &::after  { left: auto; right: 20px; transform: translateX(0); }
    &::before { left: auto; right: 20px; transform: translateX(0); }
  }

  @media (max-width: 600px) {
    min-width: 160px;
    max-width: 180px;
    padding: 0.75rem 0.875rem;
    font-size: 0.8125rem;
  }
`;

const TipBody = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${T.inkMuted};
  margin: 0 0 0.75rem;

  @media (max-width: 600px) {
    font-size: 0.7rem;
    line-height: 1.45;
    margin-bottom: 0.625rem;
  }
`;

const TipCta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${T.primary};
  padding-top: 0.625rem;
  border-top: 1px solid rgba(249, 115, 22, 0.2);

  svg { 
    font-size: 0.875rem; 
    animation: ${float} 2s ease-in-out infinite; 
  }

  @media (max-width: 600px) {
    font-size: 0.65rem;
    padding-top: 0.5rem;
    gap: 0.375rem;

    svg {
      font-size: 0.75rem;
    }
  }
`;

/* ── MODAL ── */
const Overlay = styled.div`
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
  -webkit-overflow-scrolling: touch;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 680px;
  background: ${T.bgCard};
  border: 1px solid ${T.primaryBorder};
  border-radius: ${T.r.xl};
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.25s ${T.ease} both;
  box-shadow: 
    0 24px 60px rgba(0, 0, 0, 0.7), 
    0 0 0 1px rgba(249, 115, 22, 0.1);
  will-change: transform, opacity;

  scrollbar-width: thin;
  scrollbar-color: ${T.primary} ${T.bgElevated};

  &::-webkit-scrollbar { 
    width: 6px; 
  }
  &::-webkit-scrollbar-track { 
    background: transparent; 
  }
  &::-webkit-scrollbar-thumb { 
    background: ${T.primary}; 
    border-radius: 3px; 
  }

  @media (max-width: 600px) {
    padding: 1.5rem;
    max-height: 92vh;
    border-radius: ${T.r.lg};
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 36px;
  height: 36px;
  border-radius: ${T.r.md};
  background: ${T.bgElevated};
  border: 1px solid ${T.border};
  color: ${T.inkMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.1rem;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(249, 115, 22, 0.15);
    border-color: ${T.primaryBorder};
    color: ${T.primary};
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

const MHead = styled.div`
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

const MBadge = styled.div`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${T.r.pill};
  background: linear-gradient(
    135deg,
    ${T.primary},
    ${T.primaryDark}
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

const MTitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const MTitle = styled.h3`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.65rem;
  font-weight: 700;
  font-style: italic;
  color: ${T.ink};
  margin: 0 0 0.5rem;
  line-height: 1.25;

  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const MMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${T.inkMuted};
  flex-wrap: wrap;

  span { 
    display: flex; 
    align-items: center; 
    gap: 0.35rem; 
  }
  svg { 
    color: ${T.primary}; 
    font-size: 0.75rem; 
  }
`;

const MHighlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const MTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.875rem;
  background: ${T.successGlow};
  border: 1px solid rgba(34, 197, 94, 0.28);
  border-radius: ${T.r.pill};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${T.success};
  transition: all 0.2s;

  svg { 
    font-size: 0.65rem; 
  }
  
  &:hover { 
    background: rgba(34, 197, 94, 0.22); 
    transform: translateY(-2px); 
  }
`;

const MDesc = styled.p`
  font-size: 0.9375rem;
  color: ${T.inkMuted};
  line-height: 1.75;
  margin: 0 0 1.75rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid ${T.primaryBorder};
  border-radius: ${T.r.md};

  @media (max-width: 600px) {
    font-size: 0.875rem;
    padding: 0.875rem 1rem;
    line-height: 1.7;
  }
`;

const MGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.875rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const MCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${T.border};
  border-radius: ${T.r.md};
  transition: all 0.3s ${T.ease};

  &:hover {
    background: rgba(249, 115, 22, 0.08);
    border-color: ${T.primaryBorder};
    transform: translateY(-2px);
  }
`;

const MIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${T.r.md};
  background: linear-gradient(
    135deg,
    ${T.primaryGlow},
    rgba(249, 115, 22, 0.22)
  );
  border: 1px solid ${T.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.primary};
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.25s ${T.spring};

  ${MCard}:hover & {
    transform: scale(1.1);
    background: linear-gradient(
      135deg,
      ${T.primary},
      ${T.primaryDark}
    );
    color: #fff;
  }
`;

const MInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
`;

const MLabel = styled.span`
  font-size: 0.68rem;
  color: ${T.inkFaint};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 500;
`;

const MValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${T.ink};
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Itinerary({ itinerary = [] }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [banner, setBanner] = useState(true);
  const touchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  useEffect(() => {
    if (selected !== null || hovered !== null) setBanner(false);
  }, [selected, hovered]);

  if (!itinerary?.length) return null;

  const coords = COORDS.slice(0, itinerary.length);
  const day = selected !== null ? itinerary[selected] : null;

  const open = (i) => { setSelected(i); setHovered(null); };
  const close = () => setSelected(null);

  const onTouchStart = (i) => {
    touchRef.current = setTimeout(() => setHovered(i), 180);
  };
  const onTouchEnd = (i) => {
    clearTimeout(touchRef.current);
    if (hovered === i) setHovered(null);
    else open(i);
  };
  const onTouchCancel = () => {
    clearTimeout(touchRef.current);
    setHovered(null);
  };

  return (
    <Wrapper>
      {/* ── HERO ── */}
      <Hero>
        <HeroBg>
          <Orb $c={T.primary} $s="500px" $top="-10%" $l="-8%" $dur="7s" $delay="0s" />
          <Orb $c={T.teal} $s="350px" $top="30%" $r="-5%" $dur="9s" $delay="2s" $op={0.08} />
          <Orb $c={T.primary} $s="280px" $top="65%" $l="20%" $dur="8s" $delay="4s" />
          <GridSvg>
            <defs>
              <pattern id="hg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hg)" />
          </GridSvg>
        </HeroBg>

        <Reveal delay="0s">
          <HeroLabel>The Journey</HeroLabel>
          <HeroTitle>A Trip to Remember</HeroTitle>
          <HeroSub>{itinerary.length} days of curated adventure</HeroSub>
        </Reveal>

        <Reveal delay="0.1s">
          <StatRow>
            <StatPill><FaCalendarAlt />{itinerary.length} Days</StatPill>
            <StatPill><FaMapMarkerAlt />{itinerary.length} Destinations</StatPill>
            <StatPill><FaMountain />Full Itinerary</StatPill>
          </StatRow>
        </Reveal>
      </Hero>

      <Divider><span>Your Route</span></Divider>

      {/* ── INTERACTIVE MAP ── */}
      <MapWrap>
        {banner && (
          <Banner>
            <BannerIcon><FaHandPointer /></BannerIcon>
            <BannerText><strong>Tap</strong> any marker to explore</BannerText>
            <BannerClose onClick={() => setBanner(false)}><FiX size={13} /></BannerClose>
          </Banner>
        )}

        <MapSvg viewBox="0 0 800 760" preserveAspectRatio="none">
          <rect x="0" y="0" width="800" height="760" rx="20" fill="#111111" />
          <rect x="0" y="0" width="800" height="760" rx="20" fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          <defs>
            <pattern id="mg" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="800" height="760" rx="20" fill="url(#mg)" />

          {/* Topo rings */}
          <ellipse cx="160" cy="150" rx="100" ry="60" fill="none" stroke={T.teal} strokeWidth="0.8" opacity="0.08" />
          <ellipse cx="160" cy="150" rx="60" ry="36" fill="none" stroke={T.teal} strokeWidth="0.8" opacity="0.12" />
          <ellipse cx="640" cy="560" rx="120" ry="70" fill="none" stroke={T.primary} strokeWidth="0.8" opacity="0.08" />
          <ellipse cx="640" cy="560" rx="70" ry="42" fill="none" stroke={T.primary} strokeWidth="0.8" opacity="0.1" />

          {/* River */}
          <path
            d="M 260 -20 C 50 150, 700 350, 450 650 C 360 750, 120 720, 0 960"
            fill="none" stroke="#162438" strokeWidth="28" strokeLinecap="round" opacity="0.5" />
          <path
            d="M 255 -20 C 45 150, 695 350, 445 650 C 355 750, 115 720, -5 960"
            fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" opacity="0.4" />

          {/* Mountains */}
          <path
            d="M 400 760 L 480 600 L 520 670 L 570 550 L 620 650 L 680 530 L 730 610 L 800 470 L 800 760 Z"
            fill="#1e222b" opacity="0.6" />
          <path d="M 570 550 L 552 582 L 572 572 L 585 580 Z" fill="#cad0dd" opacity="0.5" />
          <path d="M 680 530 L 665 560 L 682 552 L 695 560 Z" fill="#cad0dd" opacity="0.4" />

          {/* Trees */}
          <text x="90" y="340" fontSize="18" opacity="0.3">🌲🌲</text>
          <text x="680" y="220" fontSize="14" opacity="0.25">🌲🌲🌲</text>
          <text x="330" y="490" fontSize="16" opacity="0.28">🌲🌲</text>
          <text x="550" y="690" fontSize="14" opacity="0.25">🌲🌲🌲</text>

          {/* Trail */}
          <path d={TRAIL} fill="none" stroke="rgba(249,115,22,0.15)"
            strokeWidth="10" strokeLinecap="round" />
          <path d={TRAIL} fill="none" stroke="rgba(249,115,22,0.35)"
            strokeWidth="2.5" strokeDasharray="8 10" strokeLinecap="round" />
        </MapSvg>

        {/* Pins */}
        {itinerary.map((d, i) => {
          const coord = coords[i] || coords[coords.length - 1];
          const isHov = hovered === i;
          const { horizontal, vertical } = getTooltipPos(coord);

          return (
            <Pin
              key={i}
              className={isHov ? "active" : ""}
              style={{ left: coord.cx, top: coord.cy }}
              $d={`${i * 0.12 + 0.3}s`}
              onClick={() => open(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onTouchStart={() => onTouchStart(i)}
              onTouchEnd={() => onTouchEnd(i)}
              onTouchCancel={onTouchCancel}
            >
              <PinBubble>
                <span className="num">Day {d.day || i + 1}</span>
                <span className="name">{d.title}</span>
              </PinBubble>
              <Dot $d={`${i * 0.12}s`} />

              {isHov && (
                <Tooltip data-h={horizontal} data-v={vertical}>
                  <TipBody>{getPreview(d.description)}</TipBody>
                  <TipCta><FiArrowRight />Tap for details</TipCta>
                </Tooltip>
              )}
            </Pin>
          );
        })}
      </MapWrap>

      {/* ── MODAL ── */}
      {selected !== null && day && (
        <Overlay onClick={close}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <CloseBtn onClick={close}><FaTimes /></CloseBtn>

            <MHead>
              <MBadge>
                {selected === 0 ? <FiSun /> : selected === itinerary.length - 1 ? <FiMoon /> : <FaRoute />}
                Day {day.day || selected + 1}
              </MBadge>
              <MTitleWrap>
                <MTitle>{day.title}</MTitle>
                {(day.duration || day.elevation) && (
                  <MMeta>
                    {day.duration && <span><FiClock />{day.duration}</span>}
                    {day.elevation && <span><FiTrendingUp />{day.elevation}</span>}
                  </MMeta>
                )}
              </MTitleWrap>
            </MHead>

            {day.highlights?.length > 0 && (
              <MHighlights>
                {day.highlights.map((h, idx) => (
                  <MTag key={idx}><FaCheckCircle />{h}</MTag>
                ))}
              </MHighlights>
            )}

            <MDesc>{day.description}</MDesc>

            {(day.duration || day.elevation || day.accommodation || formatMeals(day.meals)) && (
              <MGrid>
                {day.duration && (
                  <MCard>
                    <MIcon><FiClock /></MIcon>
                    <MInfo>
                      <MLabel>Duration</MLabel>
                      <MValue>{day.duration}</MValue>
                    </MInfo>
                  </MCard>
                )}
                {day.elevation && (
                  <MCard>
                    <MIcon><FiTrendingUp /></MIcon>
                    <MInfo>
                      <MLabel>Elevation</MLabel>
                      <MValue>{day.elevation}</MValue>
                    </MInfo>
                  </MCard>
                )}
                {day.accommodation && (
                  <MCard>
                    <MIcon><FaMoon /></MIcon>
                    <MInfo>
                      <MLabel>Stay</MLabel>
                      <MValue>{day.accommodation}</MValue>
                    </MInfo>
                  </MCard>
                )}
                {formatMeals(day.meals) && (
                  <MCard>
                    <MIcon><FaUtensils /></MIcon>
                    <MInfo>
                      <MLabel>Meals</MLabel>
                      <MValue>{formatMeals(day.meals)}</MValue>
                    </MInfo>
                  </MCard>
                )}
              </MGrid>
            )}
          </Modal>
        </Overlay>
      )}
    </Wrapper>
  );
}