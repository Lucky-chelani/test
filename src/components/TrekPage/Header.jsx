import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import {
  FaMountain,
  FaArrowLeft,
  FaShare,
  FaHeart,
} from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useState, useEffect } from "react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    primary: "#f97316",
    primaryDark: "#ea580c",
    primaryLight: "#fb923c",
    bg: "#0a0a0a",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.15)",
    surface1: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.06)",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#475569",
    primaryBorder: "rgba(249, 115, 22, 0.3)",
    primaryGlow: "rgba(249, 115, 22, 0.15)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", pill: "50px" },
  transition: { 
    fast: "all 0.15s ease", 
    base: "all 0.25s ease",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.5);
  }
`;

const heartBeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1.1);
  }
`;

const iconPop = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  display: flex;
  align-items: center;
  transition: ${tokens.transition.base}, transform 0.4s ease, opacity 0.4s ease;
  
  /* Initial state: hidden (moved up and faded out) */
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;

  /* Show state: triggered by scrolling */
  ${({ $show }) =>
    $show &&
    css`
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    `}

  /* Desktop Styling */
  ${({ $scrolled }) =>
    $scrolled
      ? css`
          background-color: rgba(10, 10, 10, 0.85); /* Slightly darker for readability */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid ${tokens.colors.border};
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              ${tokens.colors.primary}40,
              ${tokens.colors.primary}80,
              ${tokens.colors.primary}40,
              transparent
            );
            background-size: 200% 100%;
            animation: ${shimmer} 3s linear infinite;
          }
        `
      : css`
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 10, 0.5) 0%,
            transparent 100%
          );
        `}

  /* Mobile override: completely transparent, layout changes */
  @media (max-width: 768px) {
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    box-shadow: none !important;
    height: auto;
    padding: calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px;
    
    &::after {
      display: none;
    }
  }
`;

const NavInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0;
    justify-content: space-between; /* Space out back and like buttons */
  }
`;

const NavBrand = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${tokens.colors.textPrimary};
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  transition: ${tokens.transition.spring};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  animation: ${fadeIn} 0.6s ease 0.2s both;
  position: relative;
  padding: 0.5rem 0;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${tokens.colors.primary};
    transform: translateX(2px);

    &::after {
      width: 100%;
    }

    svg {
      transform: rotate(-10deg) scale(1.1);
    }
  }

  svg {
    color: ${tokens.colors.primary};
    font-size: 1.25rem;
    flex-shrink: 0;
    transition: ${tokens.transition.spring};
    filter: drop-shadow(0 0 8px ${tokens.colors.primaryGlow});
  }

  /* Hide on mobile to match requirements */
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  animation: ${fadeIn} 0.6s ease 0.3s both;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavBreadcrumbItem = styled.span`
  color: ${tokens.colors.textSecondary};
  cursor: pointer;
  transition: ${tokens.transition.fast};
  position: relative;
  padding: 0.25rem 0;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: ${tokens.colors.primary};
    transition: width 0.2s ease;
  }

  &:hover {
    color: ${tokens.colors.primary};

    &::after {
      width: 100%;
    }
  }
`;

const NavBreadcrumbSep = styled.span`
  color: ${tokens.colors.textMuted};
  font-size: 0.75rem;
  opacity: 0.5;
`;

const NavBreadcrumbActive = styled.span`
  color: ${tokens.colors.primary};
  font-weight: 600;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: ${tokens.colors.primary};
    border-radius: 50%;
    box-shadow: 0 0 8px ${tokens.colors.primary};
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  animation: ${fadeIn} 0.6s ease 0.4s both;

  @media (max-width: 768px) {
    gap: 0;
    width: 100%;
    justify-content: space-between; /* Only back and heart remain */
  }
`;

const NavIconBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: ${tokens.radius.md};
  border: 1px solid ${tokens.colors.border};
  background: ${tokens.colors.surface1};
  color: ${tokens.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  font-size: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
    background: ${tokens.colors.primaryGlow};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);

    &::before {
      opacity: 1;
      animation: ${shimmer} 1.5s ease infinite;
    }

    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  svg {
    transition: ${tokens.transition.spring};
    z-index: 1;
  }

  ${({ $liked }) =>
    $liked &&
    css`
      color: ${tokens.colors.primary};
      border-color: ${tokens.colors.primaryBorder};
      background: ${tokens.colors.primaryGlow};
      box-shadow: 0 0 20px ${tokens.colors.primaryGlow};

      svg {
        animation: ${heartBeat} 0.6s ease;
        filter: drop-shadow(0 0 6px ${tokens.colors.primary});
      }
    `}

  /* Hide specific buttons on mobile if needed, but we control via render logic mostly */
  &.mobile-hide {
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* Specific mobile styling for the two remaining buttons */
  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    border-radius: 50%; /* Circle looks better standalone */
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: ${({ $liked }) => ($liked ? tokens.colors.primary : "white")};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    svg {
      font-size: 18px;
    }
  }

  @media (max-width: 380px) {
    width: 38px;
    height: 38px;
    svg { font-size: 16px; }
  }
`;

const NavCTA = styled.button`
  height: 42px;
  padding: 0 1.5rem;
  border-radius: ${tokens.radius.md};
  border: none;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primary} 0%,
    ${tokens.colors.primaryDark} 100%
  );
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  animation: ${pulseGlow} 3s ease-in-out infinite;

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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &::after {
    content: "";
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      135deg,
      ${tokens.colors.primaryLight},
      ${tokens.colors.primary},
      ${tokens.colors.primaryDark}
    );
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 768px) {
    display: none; /* Hide on mobile entirely, as hero has its own CTA */
  }
`;

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const Tooltip = styled.span`
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid ${tokens.colors.border};
  color: ${tokens.colors.textPrimary};
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.35rem 0.65rem;
  border-radius: ${tokens.radius.sm};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 100;

  &::before {
    content: "";
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: rgba(10, 10, 10, 0.95);
    border-left: 1px solid ${tokens.colors.border};
    border-top: 1px solid ${tokens.colors.border};
  }

  ${NavIconBtn}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
  
  @media (max-width: 768px) {
    display: none; /* Tooltips are tricky on touch screens */
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function Header({ 
  title, 
  scrolled, 
  isLiked, 
  onLike, 
  onShare, 
  onBook 
}) {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);

  // Logic to show Nav only after scrolling past 50vh
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Show nav if user has scrolled more than half the viewport height
          if (window.scrollY > window.innerHeight / 2) {
            setShowNav(true);
          } else {
            setShowNav(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check in case user reloads halfway down the page
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Nav $show={showNav} $scrolled={scrolled}>
      <NavInner>
        {/* Desktop-only items */}
        <NavBrand onClick={() => navigate("/")}>
          <FaMountain />
          {title}
        </NavBrand>

        <NavBreadcrumb>
          <NavBreadcrumbItem onClick={() => navigate("/")}>
            Home
          </NavBreadcrumbItem>
          <NavBreadcrumbSep>›</NavBreadcrumbSep>
          <NavBreadcrumbItem onClick={() => navigate("/treks")}>
            Treks
          </NavBreadcrumbItem>
          <NavBreadcrumbSep>›</NavBreadcrumbSep>
        </NavBreadcrumb>

        {/* Actions (Responsive) */}
        <NavActions>
          {/* Always visible (Mobile & Desktop) */}
          <NavIconBtn onClick={() => navigate(-1)}>
            <FaArrowLeft />
            <Tooltip>Go Back</Tooltip>
          </NavIconBtn>
          
          {/* Desktop only */}
          <NavIconBtn className="mobile-hide" onClick={onShare}>
            <FaShare />
            <Tooltip>Share Trek</Tooltip>
          </NavIconBtn>
          
          {/* Always visible (Mobile & Desktop) */}
          <NavIconBtn onClick={onLike} $liked={isLiked}>
            {isLiked ? <FaHeart /> : <FiHeart />}
            <Tooltip>{isLiked ? "Remove from Wishlist" : "Add to Wishlist"}</Tooltip>
          </NavIconBtn>
          
          {/* Desktop only */}
          <NavCTA onClick={onBook}>Book Now</NavCTA>
        </NavActions>
      </NavInner>
    </Nav>
  );
}