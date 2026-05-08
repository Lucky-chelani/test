import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiArrowUpRight, FiHeart, FiArrowLeft } from "react-icons/fi";
import { FaCompass, FaHeart, FaClock, FaMountain, FaStar, FaUsers, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiMapPin, FiTrendingUp } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const tokens = {
  font: {
    display: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', sans-serif",
  },
  color: {
    white: "#ffffff",
    cream: "rgba(255,255,255,0.85)",
    muted: "rgba(255,255,255,0.55)",
    glassBorder: "rgba(255,255,255,0.22)",
    primary: "#f97316",
    primaryGlow: "rgba(249, 115, 22, 0.4)",
    gold: "#F59E0B",
  },
  radius: { pill: "100px", card: "20px" },
  transition: { 
    base: "all 0.3s ease", 
    spring: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" 
  },
  blur: "blur(14px)",
};

// ─────────────────────────────────────────────────────────────────────────────
// KEYFRAMES
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

// Cross-fade keyframe for carousel
const crossFadeIn = keyframes`
  from { opacity: 0; transform: scale(1.06); }
  to { opacity: 1; transform: scale(1.04); }
`;

const mImgReveal = keyframes`
  from { opacity: 0; transform: scale(1.06); }
  to { opacity: 1; transform: scale(1); }
`;

const mFadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL PROGRESS BAR ANIMATION
// ─────────────────────────────────────────────────────────────────────────────
const progressAnim = (duration) => keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

// =============================================================================
// DESKTOP STYLED-COMPONENTS
// =============================================================================

const Root = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  max-height: 960px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: ${tokens.font.body};

  @media (max-width: 768px) {
    display: none;
  }
`;

// ── Carousel Background ──────────────────────────────────────────────────────
const CarouselTrack = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const CarouselSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 1.2s ease-in-out;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(${({ $active }) => ($active ? 1.04 : 1)});
    transition: transform 8s ease-out, opacity 1.2s ease-in-out;
    animation: ${({ $active }) => $active ? crossFadeIn : 'none'} 1.2s ease-out forwards;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to top, rgba(5,5,10,0.95) 0%, rgba(5,5,10,0.55) 45%, rgba(5,5,10,0.15) 75%, transparent 100%),
      linear-gradient(to right, rgba(5,5,10,0.65) 0%, transparent 55%);
  }
`;

// ── Carousel Controls ────────────────────────────────────────────────────────
const CarouselControls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CarouselDots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CarouselDot = styled.button`
  position: relative;
  width: ${({ $active }) => ($active ? '32px' : '8px')};
  height: 8px;
  border-radius: 100px;
  border: none;
  background: ${({ $active }) => ($active ? tokens.color.primary : 'rgba(255,255,255,0.35)')};
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.4);
    border-radius: inherit;
    transform: scaleX(0);
    transform-origin: left;
    ${({ $active, $duration }) => $active && `
      animation: progressFill ${$duration}ms linear forwards;
    `}
  }

  @keyframes progressFill {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  &:hover {
    background: ${({ $active }) => $active ? tokens.color.primary : 'rgba(255,255,255,0.6)'};
    transform: scaleY(1.3);
  }
`;

const CarouselArrow = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  font-size: 0.875rem;

  &:hover {
    background: ${tokens.color.primary};
    border-color: ${tokens.color.primary};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// ── Slide Counter ────────────────────────────────────────────────────────────
const SlideCounter = styled.div`
  position: absolute;
  top: 2rem;
  right: 3rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  animation: ${fadeIn} 1s ease 0.5s both;
`;

const SlideCurrentNum = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
`;

const Body = styled.div`
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 0 2.5rem;
`;

const TopBadge = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  animation: ${fadeUp} 0.7s ease 0.2s both;
`;

const BadgePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, ${tokens.color.primaryGlow}, rgba(249, 115, 22, 0.15));
  backdrop-filter: ${tokens.blur};
  border: 1px solid rgba(249, 115, 22, 0.4);
  border-radius: ${tokens.radius.pill};
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.01em;

  svg {
    color: ${tokens.color.primary};
    font-size: 0.875rem;
  }
`;

const TitleBlock = styled.div`
  text-align: center;
  padding: 6.5rem 1rem;
  animation: ${fadeUp} 0.8s ease 0.35s both;
`;

const MainTitle = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(4rem, 5vw, 3.8rem);
  font-weight: 700;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0;

  @media (max-width: 640px) {
    font-size: clamp(1.75rem, 7vw, 2.4rem);
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 3rem;
  gap: 2rem;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }
`;

const LeftPanel = styled.div`
  flex-shrink: 0;
  max-width: 320px;
  animation: ${fadeUp} 0.9s ease 0.5s both;
`;

const TourLabel = styled.p`
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
`;

const TourDate = styled.p`
  color: ${tokens.color.primary};
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.9rem;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
`;

const AvatarStack = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(30,30,30,0.8);
  overflow: hidden;
  margin-left: ${({ $first }) => ($first ? "0" : "-10px")};
  background: ${({ $color }) => $color || "#555"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;

const CountBadge = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(30,30,30,0.8);
  background: linear-gradient(135deg, ${tokens.color.primary}, #ea580c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  margin-left: -10px;
  flex-shrink: 0;
`;

const PeopleText = styled.span`
  color: ${tokens.color.cream};
  font-size: 0.875rem;
  font-weight: 500;
`;

const Description = styled.p`
  color: ${tokens.color.muted};
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 1.25rem;
  max-width: 260px;
`;

const BookNowBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, ${tokens.color.primary}, #ea580c);
  border: none;
  border-radius: ${tokens.radius.pill};
  color: white;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  box-shadow: 0 4px 20px ${tokens.color.primaryGlow};

  .icon {
    width: 28px;
    height: 28px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    transition: ${tokens.transition.base};
  }

  &:hover {
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 10px 30px ${tokens.color.primaryGlow};
  }

  &:hover .icon {
    background: rgba(255,255,255,0.3);
    transform: rotate(45deg);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 5rem;
  right: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: ${tokens.color.muted};
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  animation: ${fadeIn} 1s ease 1.2s both;
  z-index: 10;
`;

const ScrollLine = styled.div`
  width: 1px;
  height: 42px;
  background: linear-gradient(to bottom, ${tokens.color.primary}, transparent);
  animation: ${pulse} 2s ease-in-out infinite;
`;

// =============================================================================
// MOBILE STYLED-COMPONENTS
// =============================================================================

const MRoot = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    font-family: ${tokens.font.body};
    overflow-x: hidden;
    position: relative;
  }
`;

const MHero = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    animation: ${mImgReveal} 0.8s ease forwards;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.2) 0%,
      rgba(0,0,0,0.05) 30%,
      rgba(0,0,0,0.05) 55%,
      rgba(0,0,0,0.92) 100%
    );
  }
`;

// ── FIXED: Fully transparent mobile top bar — just icons, no background ──────
const MTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px;

  /* Always fully transparent — no background, no blur, no border */
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: none;
  box-shadow: none;

  /* Remove all scroll-based transitions */
  pointer-events: none;

  animation: ${mFadeUp} 0.5s ease both;
`;

// ── Update MIconBtn to keep pointer events working ───────────────────────────
const MIconBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: ${({ $liked }) => ($liked ? tokens.color.primary : "white")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${tokens.transition.spring};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);

  /* Re-enable pointer events on buttons since parent is pointer-events: none */
  pointer-events: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    pointer-events: none;
    font-size: 18px;
  }

  @media (max-width: 380px) {
    width: 38px;
    height: 38px;
    svg { font-size: 16px; }
  }
`;

// ── Mobile Content - Centered, thumb-accessible ──────────────────────────────
const MContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px calc(110px + env(safe-area-inset-bottom, 0px)) 20px;
  animation: ${mFadeUp} 0.65s ease 0.15s both;
  width: 100%;
`;

const MTitleArea = styled.div`
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
`;

const MTrekName = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(1.75rem, 7vw, 2.25rem);
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.015em;
  margin: 0 0 8px;
  text-shadow: 0 3px 20px rgba(0,0,0,0.8);
  text-align: center;
`;

const MRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  animation: ${slideLeft} 0.6s ease 0.2s both;
  width: 100%;
`;

const MStars = styled.span`
  color: ${tokens.color.gold};
  font-size: 0.9rem;
  letter-spacing: 2px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
`;

const MRatNum = styled.span`
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
`;

const MRatCnt = styled.span`
  color: rgba(255,255,255,0.65);
  font-size: 0.8rem;
`;

// ── Info Grid - 2x2 centered ─────────────────────────────────────────────────
const MInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 14px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
`;

const MInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 10px 12px;
`;

const MInfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255,255,255,0.6);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 600;
`;

const MInfoIcon = styled.div`
  width: 13px;
  height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.color.primary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MInfoValue = styled.div`
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
`;

const MDesc = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  line-height: 1.6;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  padding: 0 8px;
  max-width: 340px;
`;

// ── Mobile Sticky CTA Bar ────────────────────────────────────────────────────
const MStickyBar = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    left: 16px;
    right: 16px;
    z-index: 200;
    background: linear-gradient(135deg, ${tokens.color.primary}, #ea580c);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 14px 18px;
    box-shadow: 0 8px 30px rgba(249, 115, 22, 0.6),
                0 0 0 1px rgba(255,255,255,0.1) inset;
    animation: ${mFadeUp} 0.6s ease 0.4s both;
  }
`;

const MUrgencyLine = styled.p`
  text-align: center;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
  opacity: 0.9;
`;

const MCtaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const MPriceWrap = styled.div`
  flex-shrink: 0;
`;

const MPriceLabel = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 2px;
`;

const MPriceVal = styled.p`
  color: white;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;

  span {
    font-size: 0.72rem;
    font-weight: 400;
    color: rgba(255,255,255,0.7);
    margin-left: 3px;
  }
`;

const MBookBtn = styled.button`
  flex: 1;
  height: 48px;
  background: white;
  border: none;
  border-radius: 12px;
  color: ${tokens.color.primary};
  font-family: ${tokens.font.body};
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: ${tokens.transition.spring};

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: 16px;
  }
`;

// =============================================================================
// FALLBACK DATA
// =============================================================================
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
];

const DEFAULT_AVATARS = [
  { color: "#f97316", initials: "JD" },
  { color: "#85dcba", initials: "AL" },
  { color: "#e8a87c", initials: "KM" },
];

const CAROUSEL_INTERVAL = 5000; // 5 seconds per slide

// =============================================================================
// COMPONENT
// =============================================================================
export default function Hero({
  // Desktop props
  title = "Unforgettable Mountain Trek",
  tourName = "Magic Himalayan Tour",
  tourDate = "24 July 2024",
  description = "Immerse yourself in the stunning beauty of the Himalayas with our iconic mountain treks",
  heroImage = null,
  carouselImages = null,
  avatars = DEFAULT_AVATARS,
  peopleCount = 32,
  onBookNow = () => {},

  // Mobile props
  price = "₹4,999",
  rating = 4.8,
  reviewCount = 120,
  days = 5,
  location = "Uttarakhand",
  difficulty = "Moderate",
  altitude = "12,500 ft",
  capacity = 15,
  season = "Apr - Jun, Sep - Nov",
  country = "India",
  spotsLeft = 3,
}) {
  const navigate = useNavigate();

  // ── Carousel State ─────────────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // ── UI State ───────────────────────────────────────────────────────────────
  const [liked, setLiked] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Build image array ──────────────────────────────────────────────────────
  // Priority: carouselImages prop > heroImage prop > fallback images
  const slideImages = (() => {
    if (carouselImages && carouselImages.length > 0) return carouselImages;
    if (heroImage) return [heroImage, ...FALLBACK_IMAGES.slice(1)];
    return FALLBACK_IMAGES;
  })();

  // ── Scroll listener - subtle glassmorphism ─────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Auto-carousel with setInterval ────────────────────────────────────────
  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideImages.length);
    }, CAROUSEL_INTERVAL);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, slideImages.length]);

  // ── Manual navigation ──────────────────────────────────────────────────────
  const goToSlide = (index) => {
    setActiveSlide(index);
    // Reset timer on manual navigation
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isAutoPlaying) startAutoPlay();
  };

  const goNext = () => goToSlide((activeSlide + 1) % slideImages.length);
  const goPrev = () => goToSlide((activeSlide - 1 + slideImages.length) % slideImages.length);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const toggleLike = () => setLiked((prev) => !prev);

  const MStarsComponent = ({ rating }) => "★".repeat(Math.floor(rating));

  return (
    <>
      {/* ====================================================================
          DESKTOP LAYOUT
      ==================================================================== */}
      <Root>
        {/* ── Auto Carousel Background ── */}
        <CarouselTrack>
          {slideImages.map((src, index) => (
            <CarouselSlide key={index} $active={index === activeSlide}>
              <img
                src={src}
                alt={`${title} - slide ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </CarouselSlide>
          ))}
        </CarouselTrack>


        <Body>


          {/* Title Only - No subtitle/italic text */}
          <TitleBlock>
            <MainTitle>{title}</MainTitle>
          </TitleBlock>

          <BottomRow>
            <LeftPanel>
              <TourLabel>{tourName}</TourLabel>
              <TourDate>{tourDate}</TourDate>
              <AvatarRow>
                <AvatarStack>
                  {avatars.map((a, i) => (
                    <Avatar key={i} $first={i === 0} $color={a.color}>
                      {a.initials}
                    </Avatar>
                  ))}
                  <CountBadge>+{peopleCount}</CountBadge>
                </AvatarStack>
                <PeopleText>People Joined</PeopleText>
              </AvatarRow>
              <Description>{description}</Description>
              <BookNowBtn onClick={onBookNow}>
                Book Now
                <span className="icon">
                  <FiArrowUpRight size={14} />
                </span>
              </BookNowBtn>
            </LeftPanel>

            {/* ── Carousel Controls (dots + arrows) ── */}
            <CarouselControls>
              <CarouselArrow onClick={goPrev} aria-label="Previous slide">
                <FaChevronLeft />
              </CarouselArrow>

              <CarouselDots>
                {slideImages.map((_, index) => (
                  <CarouselDot
                    key={index}
                    $active={index === activeSlide}
                    $duration={CAROUSEL_INTERVAL}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </CarouselDots>

              <CarouselArrow onClick={goNext} aria-label="Next slide">
                <FaChevronRight />
              </CarouselArrow>
            </CarouselControls>
          </BottomRow>
        </Body>

        <ScrollHint>
          <ScrollLine />
          Scroll
        </ScrollHint>
      </Root>

      {/* ====================================================================
          MOBILE LAYOUT
      ==================================================================== */}
      <MRoot>
        {/* Fixed Glassmorphism Top Bar */}
        <MTopBar $scrolled={scrolled}>
          <MIconBtn onClick={handleBack} aria-label="Go back">
            <FiArrowLeft />
          </MIconBtn>
          <MIconBtn
            onClick={toggleLike}
            $liked={liked}
            aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
          >
            {liked ? <FaHeart /> : <FiHeart />}
          </MIconBtn>
        </MTopBar>

        <MHero>
          {/* Background image - uses first carousel image or heroImage */}
          <img src={slideImages[0]} alt={title} />

          {/* All content overlaid at bottom, centered */}
          <MContentWrapper>
            {/* Title */}
            <MTitleArea>
              <MTrekName>{title}</MTrekName>
            </MTitleArea>

            {/* Rating - Centered */}
            <MRating>
              <MStars>
                <MStarsComponent rating={rating} />
              </MStars>
              <MRatNum>{rating}</MRatNum>
              <MRatCnt>· {reviewCount} reviews</MRatCnt>
            </MRating>

            {/* Info Grid */}
            <MInfoGrid>
              <MInfoItem>
                <MInfoLabel>
                  <MInfoIcon><FaClock /></MInfoIcon>
                  Duration
                </MInfoLabel>
                <MInfoValue>{days} Days</MInfoValue>
              </MInfoItem>

              <MInfoItem>
                <MInfoLabel>
                  <MInfoIcon><FiMapPin /></MInfoIcon>
                  Location
                </MInfoLabel>
                <MInfoValue>{location}</MInfoValue>
              </MInfoItem>

              <MInfoItem>
                <MInfoLabel>
                  <MInfoIcon><FiTrendingUp /></MInfoIcon>
                  Difficulty
                </MInfoLabel>
                <MInfoValue>{difficulty}</MInfoValue>
              </MInfoItem>

              <MInfoItem>
                <MInfoLabel>
                  <MInfoIcon><FaMountain /></MInfoIcon>
                  Altitude
                </MInfoLabel>
                <MInfoValue>{altitude}</MInfoValue>
              </MInfoItem>
            </MInfoGrid>

            {/* Description */}
            <MDesc>{description}</MDesc>
          </MContentWrapper>
        </MHero>

      </MRoot>
    </>
  );
}