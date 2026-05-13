import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FiArrowUpRight, FiHeart, FiArrowLeft } from "react-icons/fi";
import { FaCompass, FaHeart, FaMountain, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
    btnOrange: "#f97316", 
    iconOrange: "#f97316", 
  },
  radius: { pill: "100px", card: "20px", button: "14px" }, // Refined button radius
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

const Body = styled.div`
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LocationTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
  animation: ${fadeUp} 0.7s ease 0.2s both;

  svg {
    color: ${tokens.color.primary};
    font-size: 1rem;
  }
`;

const MainTitle = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 700;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 1.5rem;
  text-align: center;
  max-width: 900px;
  animation: ${fadeUp} 0.8s ease 0.35s both;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.9s ease 0.5s both;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 0.9rem;
  font-weight: 400;

  svg {
    color: ${tokens.color.primary};
  }
`;

const CenteredDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
  line-height: 1.6;
  text-align: center;
  max-width: 700px;
  margin: 0 0 2.5rem;
  font-weight: 400;
  animation: ${fadeUp} 1s ease 0.6s both;
`;

const BookNowBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.1rem 2.8rem;
  background: linear-gradient(135deg, ${tokens.color.primary}, #ea580c);
  border: none;
  border-radius: ${tokens.radius.button};
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  box-shadow: 0 4px 20px ${tokens.color.primaryGlow};
  animation: ${fadeUp} 1.1s ease 0.7s both;

  &:hover {
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 10px 30px ${tokens.color.primaryGlow};
  }

  &:active {
    transform: scale(0.98);
  }
`;

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
`;

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
    font-family: ${tokens.font.body};
    overflow-x: hidden;
    position: relative;
  }
`;

const MHero = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh; 
  display: flex;
  flex-direction: column;
`;

const MBackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  animation: ${mImgReveal} 0.8s ease forwards;
`;

const MContentOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.9) 100%);
`;

const MTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top, 0px) + 16px) 20px 16px;
  background: transparent;
  pointer-events: none;
`;

const MIconBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${({ $liked }) => ($liked ? tokens.color.primary : "white")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${tokens.transition.spring};
  pointer-events: auto;

  svg {
    pointer-events: none;
    font-size: 18px;
  }
`;

const MContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem 2.5rem;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
`;

const MLocationTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
  color: rgba(255,255,255,0.85);
  animation: ${fadeUp} 0.7s ease 0.2s both;

  svg {
    color: ${tokens.color.iconOrange};
    font-size: 1.05rem;
  }
`;

const MTitle = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(2.4rem, 8vw, 3rem); /* Slightly larger */
  font-weight: 700;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 1.8rem;
  white-space: pre-wrap;
  text-shadow: 0 4px 16px rgba(0,0,0,0.4);
  animation: ${fadeUp} 0.8s ease 0.35s both;
`;

const MInfoPillContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2.2rem;
  animation: ${fadeUp} 0.9s ease 0.5s both;
`;

const MInfoPillRowTop = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const MInfoPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem; /* Adjusted proportions */
  background: rgba(255,255,255,0.06); /* Frosted aesthetic */
  border: 1px solid rgba(255,255,255,0.25); /* Fine crisp border */
  border-radius: ${tokens.radius.pill};
  font-size: 0.9rem;
  font-weight: 400; /* Lighter weight for pills */
  color: white;
  backdrop-filter: blur(12px);

  svg {
    font-size: 0.9rem;
    color: ${tokens.color.iconOrange};
  }
`;

const MDescription = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1rem; /* Slightly larger, more readable */
  line-height: 1.65;
  margin: 0 0 2.8rem;
  max-width: 90%;
  font-weight: 400; /* Lighter weight for text */
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  animation: ${fadeUp} 1s ease 0.6s both;
`;

const MBottomBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  animation: ${fadeUp} 1.1s ease 0.7s both;
`;

const MBookBtn = styled.button`
  width: 100%;
  max-width: 340px; /* Wider button */
  height: 56px; /* Taller, better tap target */
  background: ${tokens.color.btnOrange};
  border: none;
  border-radius: ${tokens.radius.button};
  color: white; 
  font-family: ${tokens.font.body};
  font-size: 1.1rem;
  font-weight: 800; /* Bold CTA */
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35); 
  transition: ${tokens.transition.spring};

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ScrollDarkenOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 50; 
  pointer-events: none; 
  background-color: rgba(0, 0, 0, 0); 
`;

// =============================================================================
// FALLBACK DATA
// =============================================================================
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
];

const DEFAULT_AVATARS = [
  { color: "#f97316", initials: "JD" },
];

const CAROUSEL_INTERVAL = 5000; 

// =============================================================================
// COMPONENT
// =============================================================================
export default function Hero({
  // Desktop & Shared props
  title = "Annapurna Base Camp Trek",
  tourName = "Magic Himalayan Tour",
  tourDate = "24 July 2024",
  description = "Journey to the heart of the Annapurna Sanctuary with breathtaking views of the Himalayas, lush rhododendron forests, and diverse local culture during this 4-5 hour trek to this picturesque settlement at 1940 meters.",
  heroImage = null,
  carouselImages = null,
  avatars = DEFAULT_AVATARS,
  peopleCount = 32,
  onBookNow = () => {},

  // Mobile & Dynamic structural props
  price = "₹15,999",
  rating = 4.8,
  reviewCount = 120,
  days = 7,
  location = "Nepal",
  country = "Himalayas",
  difficulty = "Moderate",
  altitude = "4,130m",
}) {
  const navigate = useNavigate();

  // ── Carousel State ─────────────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // ── UI State ───────────────────────────────────────────────────────────────
  const [liked, setLiked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // ── REFS for Scroll Animation ──────────────────────────────────────────────
  const desktopOverlayRef = useRef(null);
  const mobileOverlayRef = useRef(null);

  // ── Build image array ──────────────────────────────────────────────────────
  const slideImages = (() => {
    if (carouselImages && carouselImages.length > 0) return carouselImages;
    if (heroImage) return [heroImage, ...FALLBACK_IMAGES.slice(1)];
    return FALLBACK_IMAGES;
  })();

  // ── Scroll listener with requestAnimationFrame for performance ─────────────
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxDarkenScrollPoint = window.innerHeight * 0.75; 
          const opacity = Math.min(scrollY / maxDarkenScrollPoint, 0.95);

          if (desktopOverlayRef.current) {
            desktopOverlayRef.current.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
          }
          if (mobileOverlayRef.current) {
            mobileOverlayRef.current.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Auto-carousel ──────────────────────────────────────────────────────────
  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideImages.length);
    }, CAROUSEL_INTERVAL);
  };

  useEffect(() => {
    if (isAutoPlaying) startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, slideImages.length]);

  const goToSlide = (index) => {
    setActiveSlide(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isAutoPlaying) startAutoPlay();
  };

  const goNext = () => goToSlide((activeSlide + 1) % slideImages.length);
  const goPrev = () => goToSlide((activeSlide - 1 + slideImages.length) % slideImages.length);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const toggleLike = () => setLiked((prev) => !prev);

  return (
    <>
      {/* ====================================================================
          DESKTOP LAYOUT 
      ==================================================================== */}
      <Root>
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
          <LocationTag>
            <FiMapPin /> {location}, {country}
          </LocationTag>
          <MainTitle>{title}</MainTitle>
          <StatsRow>
            <StatPill><FiTrendingUp /> {difficulty}</StatPill>
            <StatPill><FaCalendarAlt /> {days} Days</StatPill>
            <StatPill><FaMountain /> {altitude}</StatPill>
          </StatsRow>
          <CenteredDescription>{description}</CenteredDescription>
          <BookNowBtn onClick={onBookNow}>
            Book Now - {price}
          </BookNowBtn>
        </Body>

        <CarouselControls>
          <CarouselArrow onClick={goPrev}><FaChevronLeft /></CarouselArrow>
          <CarouselDots>
            {slideImages.map((_, index) => (
              <CarouselDot
                key={index}
                $active={index === activeSlide}
                $duration={CAROUSEL_INTERVAL}
                onClick={() => goToSlide(index)}
              />
            ))}
          </CarouselDots>
          <CarouselArrow onClick={goNext}><FaChevronRight /></CarouselArrow>
        </CarouselControls>

        

        <ScrollDarkenOverlay ref={desktopOverlayRef} />
      </Root>

      {/* ====================================================================
          MOBILE LAYOUT
      ==================================================================== */}
      <MRoot>
        

        <MHero>
          <MBackgroundImage src={slideImages[0]} alt={title} />
          <MContentOverlay />

          <MContentWrapper>
            <MLocationTag>
              <FiMapPin /> {location}, {country}
            </MLocationTag>
            <MTitle>{title}</MTitle>

            <MInfoPillContainer>
              <MInfoPillRowTop>
                <MInfoPill>
                  <FiTrendingUp /> {difficulty}
                </MInfoPill>
                <MInfoPill>
                  <FaCalendarAlt /> {days} Days
                </MInfoPill>
              </MInfoPillRowTop>
              <MInfoPill>
                <FaMountain /> {altitude}
              </MInfoPill>
            </MInfoPillContainer>

            <MDescription>{description}</MDescription>

            <MBottomBtnWrapper>
              <MBookBtn onClick={onBookNow}>
                Book Now - {price}
              </MBookBtn>
            </MBottomBtnWrapper>
          </MContentWrapper>

          <ScrollDarkenOverlay ref={mobileOverlayRef} />
        </MHero>
      </MRoot>
    </>
  );
}