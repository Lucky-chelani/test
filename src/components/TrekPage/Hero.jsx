import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaMountain, FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
  radius: { pill: "100px", card: "20px", button: "14px" },
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

const TitleBlock = styled.div`
  text-align: center;
  padding: 3rem 1rem 0;
  animation: ${fadeUp} 0.8s ease 0.35s both;
  display: flex;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 2.5rem 1rem 0;
  }

  @media (max-width: 640px) {
    padding: 2rem 1rem 0;
  }
`;

const MainTitle = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.015em;
  margin: 0;
  max-width: 700px;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 1024px) {
    max-width: 600px;
  }

  @media (max-width: 640px) {
    font-size: clamp(1.75rem, 7vw, 2.4rem);
    max-width: 90%;
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
  margin: 0 0 1.25rem;
  max-width: 260px;
  
  /* Add these lines to truncate long text */
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Show only 4 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

const ScrollDarkenOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 50; 
  pointer-events: none; 
  background-color: rgba(0, 0, 0, 0); 
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
  transition: opacity 1.2s ease-in-out, transform 8s ease-out;
`;

const MContentOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.9) 100%);
`;

const MContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px calc(110px + env(safe-area-inset-bottom, 0px)) 20px;
  animation: ${mFadeUp} 0.65s ease 0.15s both;
  width: 100%;
`;

const MTitleArea = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding-top: 2rem;
  width: 100%;

  @media (max-width: 380px) {
    padding-top: 1.5rem;
  }
`;

const MTrekName = styled.h1`
  font-family: ${tokens.font.display};
  font-size: clamp(1.75rem, 7vw, 2.25rem);
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.015em;
  margin: 0 auto 8px;
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.8);
  text-align: center;
  max-width: 340px;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 380px) {
    max-width: 280px;
    font-size: clamp(1.5rem, 6.5vw, 2rem);
  }
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
  font-size: clamp(2.4rem, 8vw, 3rem); 
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
  padding: 0.5rem 1.25rem; 
  background: rgba(255,255,255,0.06); 
  border: 1px solid rgba(255,255,255,0.25); 
  border-radius: ${tokens.radius.pill};
  font-size: 0.9rem;
  font-weight: 400; 
  color: white;
  backdrop-filter: blur(12px);

  svg {
    font-size: 0.9rem;
    color: ${tokens.color.iconOrange};
  }
`;

const MDescription = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem; 
  line-height: 1.5;
  margin: 0 0 2.2rem;
  max-width: 95%;
  font-weight: 400; 
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  animation: ${fadeUp} 1s ease 0.6s both;

  /* Limits to exactly 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Guarantee it fits on small phones */
  @media (max-height: 700px) {
    -webkit-line-clamp: 2; 
    margin: 0 0 1.5rem;
  }
`;

const MBottomBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  animation: ${fadeUp} 1.1s ease 0.7s both;
`;

const MBookBtn = styled.button`
  width: 100%;
  max-width: 340px; 
  height: 56px; 
  background: ${tokens.color.btnOrange};
  border: none;
  border-radius: ${tokens.radius.button};
  color: white; 
  font-family: ${tokens.font.body};
  font-size: 1.1rem;
  font-weight: 800; 
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

// =============================================================================
// FALLBACK DATA (Only used if the Organizer uploaded absolutely 0 images)
// =============================================================================
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
];

const CAROUSEL_INTERVAL = 5000; 

// =============================================================================
// COMPONENT
// =============================================================================
export default function Hero({
  title = "Annapurna Base Camp Trek",
  description = "Journey to the heart of the Annapurna Sanctuary with breathtaking views of the Himalayas.",
  heroImage = null,
  carouselImages = null,
  onBookNow = () => {},
  price = "₹15,999",
  days = 7,
  location = "Nepal",
  country = "Himalayas",
  difficulty = "Moderate",
  altitude = "4,130m",
}) {
  // ── Carousel State ─────────────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  
  // ── REFS for Scroll Animation ──────────────────────────────────────────────
  const desktopOverlayRef = useRef(null);
  const mobileOverlayRef = useRef(null);

  // ── Build image array (STRICT FIREBASE PRIORITY) ───────────────────────────
  const slideImages = (() => {
    // 1. If organizer uploaded a gallery, use the gallery!
    if (carouselImages && carouselImages.length > 0) return carouselImages;
    // 2. If they only uploaded a primary cover, use that!
    if (heroImage) return [heroImage];
    // 3. If they uploaded absolutely nothing, use fallbacks.
    return FALLBACK_IMAGES;
  })();

  // ── Scroll listener with requestAnimationFrame for performance ─────────────
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
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

        {slideImages.length > 1 && (
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
        )}

        <ScrollDarkenOverlay ref={desktopOverlayRef} />
      </Root>

      {/* ====================================================================
          MOBILE LAYOUT
      ==================================================================== */}
      <MRoot>
        <MHero>
          {/* MOBILE NOW CYCLES THROUGH ALL FIREBASE IMAGES */}
          {slideImages.map((src, index) => (
            <MBackgroundImage 
              key={index}
              src={src} 
              alt={`${title} - slide ${index + 1}`}
              style={{
                opacity: index === activeSlide ? 1 : 0,
                zIndex: index === activeSlide ? 1 : 0,
                transform: index === activeSlide ? 'scale(1)' : 'scale(1.06)'
              }}
            />
          ))}
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