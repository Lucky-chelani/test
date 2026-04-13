import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FiChevronRight } from "react-icons/fi";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bg: "#0a0a0a",
    border: "rgba(255,255,255,0.07)",
    primary: "#f97316",
    textPrimary: "#F1F5F9",
    textMuted: "#64748b",
  },
  transition: { base: "all 0.25s ease" },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideHorizontal = keyframes`
  0%, 100% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const SectionNavWrapper = styled.div`
  position: sticky;
  top: 80px;
  z-index: 80;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${tokens.colors.border};
  transition: ${tokens.transition.base};

  &.scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    top: 70px;
  }
`;

const SectionNavContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0;

  @media (min-width: 1400px) {
    max-width: 1400px;
  }
`;

const SectionNavScroller = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: relative;
  cursor: ${({ $isScrollable }) => ($isScrollable ? 'grab' : 'default')};
  
  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: ${({ $isScrollable }) => ($isScrollable ? 'grabbing' : 'default')};
  }

  /* Scroll snap for mobile */
  @media (max-width: 768px) {
    scroll-snap-type: x proximity;
    scroll-padding-left: 1rem;
  }

  /* Fade gradient on right edge */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to left, rgba(10, 10, 10, 0.95), transparent);
    pointer-events: none;
    opacity: ${({ $showGradient }) => ($showGradient ? 1 : 0)};
    transition: opacity 0.3s ease;
    
    @media (max-width: 768px) {
      width: 20px;
    }
  }
`;

const SectionNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 1.5rem;
  min-width: max-content;

  @media (max-width: 1024px) {
    gap: 0.25rem;
    padding: 0 1.25rem;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.125rem;
  }
`;

const NavItem = styled.button`
  position: relative;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  color: ${({ $active }) => ($active ? tokens.colors.primary : tokens.colors.textMuted)};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  transition: ${tokens.transition.base};
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  flex-shrink: 0;

  &:hover {
    color: ${tokens.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${tokens.colors.primary};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (max-width: 1024px) {
    padding: 1.125rem 1.25rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 1rem;
    font-size: 0.75rem;
    scroll-snap-align: start;
    
    ${({ $active }) => $active && `
      background: rgba(249, 115, 22, 0.08);
      border-radius: 8px 8px 0 0;
    `}
  }

  @media (max-width: 480px) {
    padding: 0.875rem 0.875rem;
    font-size: 0.7rem;
  }
`;

const ScrollIndicator = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0 0.25rem;
    font-size: 0.7rem;
    color: ${tokens.colors.textMuted};
    gap: 0.5rem;
    animation: ${fadeIn} 0.3s ease;
    
    svg {
      width: 14px;
      height: 14px;
      animation: ${slideHorizontal} 1.5s ease-in-out infinite;
    }
  }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SectionNavigation({
  sections,
  activeSection,
  onNavigate,
  scrolled = false,
}) {
  const scrollerRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if content is scrollable
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const checkScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = scroller;
      const canScroll = scrollWidth > clientWidth;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      
      setIsScrollable(canScroll);
      setShowScrollIndicator(canScroll && !isAtEnd);
    };

    checkScroll();
    scroller.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });

    return () => {
      scroller.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Auto-scroll active section into view
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const activeButton = scroller.querySelector(`[data-section-nav="${activeSection}"]`);
    if (activeButton) {
      const scrollerRect = scroller.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      if (
        buttonRect.left < scrollerRect.left ||
        buttonRect.right > scrollerRect.right
      ) {
        const scrollLeft = activeButton.offsetLeft - scroller.offsetWidth / 2 + activeButton.offsetWidth / 2;
        scroller.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection]);

  // Mouse wheel horizontal scroll
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleWheel = (e) => {
      // Only handle horizontal scroll if content is scrollable
      if (!isScrollable) return;
      
      // Prevent default only if we're actually scrolling horizontally
      const { scrollWidth, clientWidth, scrollLeft } = scroller;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth;
      
      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
        e.preventDefault();
        scroller.scrollLeft += e.deltaY;
      }
    };

    scroller.addEventListener('wheel', handleWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', handleWheel);
  }, [isScrollable]);

  // Mouse drag to scroll
  const handleMouseDown = (e) => {
    if (!isScrollable) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollerRef.current.offsetLeft);
    setScrollLeft(scrollerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isScrollable) return;
    
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <SectionNavWrapper className={scrolled ? 'scrolled' : ''}>
      <SectionNavContainer>
        <SectionNavScroller
          ref={scrollerRef}
          $isScrollable={isScrollable}
          $showGradient={showScrollIndicator}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <SectionNav>
            {sections.map((section) => (
              <NavItem
                key={section.id}
                data-section-nav={section.id}
                $active={activeSection === section.id}
                onClick={() => onNavigate(section.id)}
              >
                {section.label}
              </NavItem>
            ))}
          </SectionNav>
        </SectionNavScroller>
        {showScrollIndicator && (
          <ScrollIndicator>
            <FiChevronRight />
            <span>Scroll for more</span>
          </ScrollIndicator>
        )}
      </SectionNavContainer>
    </SectionNavWrapper>
  );
}