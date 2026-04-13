import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiArrowUpRight, FiHeart, FiArrowLeft } from "react-icons/fi";
import { FaCompass, FaHeart, FaClock, FaMountain, FaStar, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { FiMapPin, FiTrendingUp } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS  (shared)
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
  transition: { base: "all 0.3s ease", spring: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" },
  blur: "blur(14px)",
};

// ─────────────────────────────────────────────────────────────────────────────
// KEYFRAMES  (shared)
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideRight = keyframes`from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}`;
const slideLeft = keyframes`from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const imageTransition = keyframes`
  from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1.04); }
`;
const mImgReveal = keyframes`from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}`;
const mFadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

// =============================================================================
// DESKTOP STYLED-COMPONENTS — REDUCED FONT SIZES
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
  @media(max-width:768px){ display: none; }
`;

const BgImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: ${imageTransition} 0.8s ease-out forwards;
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
  svg { color: ${tokens.color.primary}; font-size: 0.875rem; }
`;

const TitleBlock = styled.div`
  text-align: center;
  padding: 0 1rem;
  animation: ${fadeUp} 0.8s ease 0.35s both;
`;

const MainTitle = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 700;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0;
  em {
    font-style: italic;
    font-weight: 400;
    background: linear-gradient(135deg, ${tokens.color.primary}, #fb923c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  @media(max-width:640px){ font-size: clamp(1.75rem, 7vw, 2.4rem); }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 3rem;
  gap: 2rem;
  @media(max-width:1024px){ padding: 0 2rem; }
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
  &:hover { transform: scale(1.04) translateY(-2px); box-shadow: 0 10px 30px ${tokens.color.primaryGlow}; }
  &:hover .icon { background: rgba(255,255,255,0.3); transform: rotate(45deg); }
  &:active { transform: scale(0.98); }
`;

const CardsPanel = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.85rem;
  animation: ${slideRight} 0.9s ease 0.6s both;
`;

const CardBase = styled.div`
  border-radius: ${tokens.radius.card};
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: ${tokens.transition.spring};
  position: relative;
  border: 2px solid transparent;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${tokens.color.primary}, #ea580c);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    pointer-events: none;
  }
  &:hover { transform: translateY(-6px) scale(1.02); border-color: ${tokens.color.primary}; }
  ${({ $active }) => $active && `
    border-color: ${tokens.color.primary};
    box-shadow: 0 0 30px rgba(249,115,22,0.4);
    &::before { opacity: 0.1; }
  `}
`;

const MainCard = styled(CardBase)`
  width: 220px; height: 240px;
  @media(max-width:1100px){ width: 190px; height: 210px; }
`;

const SmallCard = styled(CardBase)`
  width: 130px; height: 190px;
  @media(max-width:1100px){ width: 115px; height: 170px; }
`;

const TinyCard = styled(CardBase)`
  width: 115px; height: 165px;
  @media(max-width:1100px){ width: 100px; height: 148px; }
`;

const CardImg = styled.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.5s ease;
  ${CardBase}:hover & { transform: scale(1.1); }
`;

const CardOverlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 55%, transparent 100%);
  padding: 0.9rem;
  display: flex; flex-direction: column; justify-content: flex-end;
  z-index: 2;
`;

const CardTimeBadge = styled.span`
  position: absolute; top: 0.75rem; right: 0.75rem;
  background: linear-gradient(135deg, ${tokens.color.primary}, #ea580c);
  border-radius: ${tokens.radius.pill};
  color: white; font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.6rem;
`;

const CardTitle = styled.p`
  color: white; font-weight: 700; font-size: 0.9rem; margin: 0 0 0.2rem; line-height: 1.3;
`;

const CardDesc = styled.p`
  color: rgba(255,255,255,0.75); font-size: 0.72rem; line-height: 1.45; margin: 0;
`;

const ActiveIndicator = styled.div`
  position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
  width: 30px; height: 3px; background: ${tokens.color.primary}; border-radius: 2px;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ScrollHint = styled.div`
  position: absolute; bottom: 2rem; right: 3rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  color: ${tokens.color.muted}; font-size: 0.7rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  animation: ${fadeIn} 1s ease 1.2s both;
`;

const ScrollLine = styled.div`
  width: 1px; height: 42px;
  background: linear-gradient(to bottom, ${tokens.color.primary}, transparent);
  animation: ${pulse} 2s ease-in-out infinite;
`;

// =============================================================================
// MOBILE STYLED-COMPONENTS — FIXED NAV, LEFT REVIEWS
// =============================================================================

const MRoot = styled.div`
  display: none;
  @media(max-width:768px){
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

/* Hero image - full viewport */
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
    background:
      linear-gradient(to bottom,
        rgba(0,0,0,0.4) 0%,
        rgba(0,0,0,0.1) 30%,
        rgba(0,0,0,0.1) 60%,
        rgba(0,0,0,0.9) 100%
      );
  }
`;

/* Top bar - FIXED POSITION, stays on scroll */
const MTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top, 0px) + 16px) 16px 16px;
  background: ${({ $scrolled }) => 
    $scrolled ? 'rgba(0,0,0,0.8)' : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(20px)' : 'none'};
  transition: all 0.3s ease;
  animation: ${mFadeUp} 0.5s ease both;
`;

const MIconBtn = styled.button`
  width: 40px; 
  height: 40px; 
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  color: ${({ $liked }) => ($liked ? tokens.color.primary : "white")};
  cursor: pointer;
  display: flex; 
  align-items: center; 
  justify-content: center;
  transition: ${tokens.transition.spring};
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  
  &:hover { 
    background: rgba(255,255,255,0.15); 
    transform: scale(1.08); 
  }
  
  &:active { 
    transform: scale(0.95); 
  }
  
  svg { 
    pointer-events: none;
    font-size: 18px;
  }
`;

/* Content wrapper - overlaid on image */
const MContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 18px calc(100px + env(safe-area-inset-bottom, 0px)) 18px;
  animation: ${mFadeUp} 0.65s ease 0.15s both;
`;

/* Title */
const MTitleArea = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const MTrekName = styled.h1`
  font-family: ${tokens.font.display};
  font-size: 2rem; 
  font-weight: 700;
  color: white; 
  line-height: 1.15; 
  letter-spacing: -0.015em; 
  margin: 0 0 8px;
  text-shadow: 0 3px 20px rgba(0,0,0,0.8);
`;

const MTrekSub = styled.p`
  font-family: ${tokens.font.display};
  font-size: 1rem; 
  font-style: italic; 
  font-weight: 400;
  color: ${tokens.color.primary}; 
  margin: 0;
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
`;

/* Rating - LEFT ALIGNED */
const MRating = styled.div`
  display: flex; 
  align-items: center; 
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  animation: ${slideLeft} 0.6s ease 0.2s both;
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

/* Info grid - 2 columns */
const MInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  margin-bottom: 16px;
`;

const MInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
`;

const MInfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.65);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
`;

const MInfoIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.color.primary};
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const MInfoValue = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.3;
`;

/* Description */
const MDesc = styled.p`
  color: rgba(255,255,255,0.75);
  font-size: 0.82rem; 
  line-height: 1.6; 
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  padding: 0 10px;
`;

/* ── Floating CTA bar ── */
const MStickyBar = styled.div`
  display: none;
  
  @media(max-width:768px){
    display: block;
    position: fixed; 
    bottom: calc(64px + env(safe-area-inset-bottom, 0px)); 
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
  opacity: 0.95;
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
// INLINE SVG ICONS
// =============================================================================
const IcoArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// =============================================================================
// FALLBACK DATA
// =============================================================================
const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80";

const FALLBACK_CARDS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    heroImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    title: "Sunrise View Point",
    time: "02:30",
    desc: "Arrive at Sukapura Village and head to Sunrise View Point by using 4WD Jeep",
    main: true,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    heroImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
    title: "Crater Rim Trek",
    time: "05:00",
    desc: null,
    main: false,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    heroImg: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
    title: "Sea of Sand",
    time: "07:30",
    desc: null,
    main: false,
  },
];

const DEFAULT_AVATARS = [
  { color: "#f97316", initials: "JD" },
  { color: "#85dcba", initials: "AL" },
  { color: "#e8a87c", initials: "KM" },
];

// =============================================================================
// COMPONENT
// =============================================================================
export default function Hero({
  /* ── Desktop props ── */
  title = "Unforgettable Mount Bromo",
  titleItalic = "Sunrise Tour",
  tagline = "Experience the Magic of East Java",
  tourName = "Magic of East Java Tour",
  tourDate = "24 July 2024",
  description = "Immerse yourself in the stunning beauty of East Java with our iconic Mount Bromo Sunrise Tour",
  heroImage = null,
  cards = null,
  avatars = DEFAULT_AVATARS,
  peopleCount = 32,
  onBookNow = () => {},
  
  /* ── Mobile props from backend ── */
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
  
  // ── Desktop card state ─────────────────────────────────────────────────────
  const cardData = cards && cards.length > 0 ? cards : FALLBACK_CARDS;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [imageKey, setImageKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for mobile top bar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCurrentHeroImage = () => {
    if (heroImage) return heroImage;
    const activeCard = cardData[activeCardIndex];
    return activeCard?.heroImg || activeCard?.img || FALLBACK_HERO_IMAGE;
  };

  const handleCardClick = (index) => {
    if (index !== activeCardIndex) {
      setActiveCardIndex(index);
      setImageKey((prev) => prev + 1);
    }
  };

  const renderCard = (card, index) => {
    const isActive = activeCardIndex === index;
    const CardComponent =
      card.main ? MainCard : index === 1 ? SmallCard : TinyCard;
    return (
      <CardComponent key={card.id} $active={isActive} onClick={() => handleCardClick(index)}>
        <CardImg src={card.img} alt={card.title} />
        {card.main && (
          <CardOverlay>
            <CardTimeBadge>{card.time}</CardTimeBadge>
            <CardTitle>{card.title}</CardTitle>
            {card.desc && <CardDesc>{card.desc}</CardDesc>}
          </CardOverlay>
        )}
        <ActiveIndicator $active={isActive} />
      </CardComponent>
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const toggleLike = () => {
    setLiked(prev => !prev);
  };

  // Stars component
  const MStarsComponent = ({ rating }) => {
    const fullStars = Math.floor(rating);
    return "★".repeat(fullStars);
  };

  return (
    <>
      {/* ====================================================================
          DESKTOP LAYOUT
      ==================================================================== */}
      <Root>
        <BgImage key={imageKey}>
          <img src={getCurrentHeroImage()} alt={title} />
        </BgImage>

        <Body>
          <TopBadge>
            <BadgePill>
              <FaCompass /> {tagline}
            </BadgePill>
          </TopBadge>

          <TitleBlock>
            <MainTitle>
              {title}
              <br />
              <em>{titleItalic}</em>
            </MainTitle>
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
                <span className="icon"><FiArrowUpRight size={14} /></span>
              </BookNowBtn>
            </LeftPanel>

            <CardsPanel>
              {cardData.map((card, index) => renderCard(card, index))}
            </CardsPanel>
          </BottomRow>
        </Body>

        <ScrollHint>
          <ScrollLine />
          Scroll
        </ScrollHint>
      </Root>

      {/* ====================================================================
          MOBILE LAYOUT - FIXED NAV, LEFT-ALIGNED REVIEWS
      ==================================================================== */}
      <MRoot>
        {/* Fixed Top Bar - stays on scroll */}
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
          {/* Background image */}
          <img src={getCurrentHeroImage()} alt={title} />

          {/* All content overlaid at bottom */}
          <MContentWrapper>
            {/* Title */}
            <MTitleArea>
              <MTrekName>{title}</MTrekName>
              <MTrekSub>{titleItalic}</MTrekSub>
            </MTitleArea>

            {/* Rating - LEFT ALIGNED */}
            <MRating>
              <MStars><MStarsComponent rating={rating} /></MStars>
              <MRatNum>{rating}</MRatNum>
              <MRatCnt>· {reviewCount} reviews</MRatCnt>
            </MRating>

            {/* Info grid */}
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