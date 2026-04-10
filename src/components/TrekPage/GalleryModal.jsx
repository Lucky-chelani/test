import { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn, FiDownload, FiShare2, FiMaximize2 } from "react-icons/fi";
import { FaPlay, FaPause, FaExpand } from "react-icons/fa";
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
    overlay: "rgba(0, 0, 0, 0.95)",
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
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(249, 115, 22, 0.5);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const progressFill = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: ${tokens.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(0, 0, 0, 0.5) 100%
    );
    pointer-events: none;
  }
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  z-index: 10;
  animation: ${slideDown} 0.4s ease-out;
`;

const TopBarLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ImageTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};
  margin: 0;
`;

const ImageSubtitle = styled.span`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.125rem;
  transition: ${tokens.transition.spring};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${tokens.colors.primaryGlow};
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
    transform: scale(1.1);

    &::before {
      opacity: 1;
      animation: ${shimmer} 1s ease;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CloseBtn = styled(ActionBtn)`
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);

  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.5);
    color: #ef4444;
  }
`;

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $dir }) => ($dir === "prev" ? "left: 1.5rem;" : "right: 1.5rem;")}
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: ${tokens.transition.spring};
  z-index: 10;
  animation: ${({ $dir }) => ($dir === "prev" ? slideInLeft : slideInRight)} 0.4s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  &::before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
    border-color: transparent;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 30px rgba(249, 115, 22, 0.4);

    &::before {
      opacity: 1;
      animation: ${glow} 1.5s ease-in-out infinite;
    }
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    ${({ $dir }) => ($dir === "prev" ? "left: 0.75rem;" : "right: 0.75rem;")}
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  max-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${scaleIn} 0.4s ease-out;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.xl};
  overflow: hidden;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.9);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid ${tokens.colors.glassBorder};
    border-radius: ${tokens.radius.xl};
    pointer-events: none;
    z-index: 1;
  }
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: ${tokens.radius.xl};
  animation: ${({ $direction }) =>
    $direction === "next"
      ? css`${slideInRight} 0.3s ease-out`
      : $direction === "prev"
        ? css`${slideInLeft} 0.3s ease-out`
        : css`${scaleIn} 0.3s ease-out`};
  transition: transform 0.3s ease;
  cursor: zoom-in;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageLoader = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${tokens.colors.bgCard};
  border-radius: ${tokens.radius.xl};

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

const ZoomHint = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radius.pill};
  color: ${tokens.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0;
  transform: translateY(10px);
  transition: ${tokens.transition.base};
  z-index: 2;

  ${ImageWrapper}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  svg {
    font-size: 0.875rem;
    color: ${tokens.colors.primary};
  }
`;

const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  z-index: 10;
  animation: ${slideUp} 0.4s ease-out;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProgressTrack = styled.div`
  flex: 1;
  max-width: 300px;
  height: 3px;
  background: ${tokens.colors.glassBorder};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
  border-radius: 2px;
  transition: width 0.3s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 6px;
    background: ${tokens.colors.primaryLight};
    border-radius: 50%;
    transform: translateY(-1.5px);
    box-shadow: 0 0 10px ${tokens.colors.primary};
  }
`;

const CounterBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.primary};
  animation: ${pulse} 2s ease-in-out infinite;

  span {
    color: ${tokens.colors.textPrimary};
  }
`;

const ThumbnailsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ThumbnailsTrack = styled.div`
  display: flex;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radius.lg};
  backdrop-filter: blur(10px);
  max-width: 90vw;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Thumbnail = styled.button`
  position: relative;
  width: 56px;
  height: 42px;
  border-radius: ${tokens.radius.sm};
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  transition: ${tokens.transition.spring};
  animation: ${scaleIn} 0.3s ease-out;
  animation-delay: ${({ $index }) => $index * 0.03}s;
  animation-fill-mode: both;

  ${({ $active }) =>
    $active
      ? css`
          border-color: ${tokens.colors.primary};
          transform: scale(1.15);
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);

          &::before {
            content: "";
            position: absolute;
            inset: -4px;
            border: 2px solid ${tokens.colors.primary};
            border-radius: ${tokens.radius.md};
            animation: ${glow} 2s ease-in-out infinite;
          }
        `
      : css`
          opacity: 0.5;

          &:hover {
            opacity: 1;
            transform: scale(1.1);
            border-color: ${tokens.colors.primaryBorder};
          }
        `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2px;
  opacity: 0;
  transition: ${tokens.transition.fast};

  ${Thumbnail}:hover & {
    opacity: 1;
  }

  span {
    font-size: 0.5rem;
    font-weight: 600;
    color: white;
  }
`;

const KeyboardHints = styled.div`
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    display: none;
  }
`;

const KeyHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  color: ${tokens.colors.textMuted};
`;

const KeyBadge = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.625rem;
  color: ${tokens.colors.textSecondary};
`;

const AutoPlayBtn = styled(ActionBtn)`
  ${({ $playing }) =>
    $playing &&
    css`
      background: ${tokens.colors.primaryGlow};
      border-color: ${tokens.colors.primaryBorder};
      color: ${tokens.colors.primary};
    `}
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GalleryModal({
  isOpen,
  images = [],
  currentIndex,
  onClose,
  onNavigate,
  title,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === "ArrowLeft") {
        setSlideDirection("prev");
        onNavigate("prev");
      }
      if (e.key === "ArrowRight") {
        setSlideDirection("next");
        onNavigate("next");
      }
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onNavigate, onClose]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return;

    const interval = setInterval(() => {
      setSlideDirection("next");
      onNavigate("next");
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isOpen, onNavigate]);

  // Reset loading state on image change
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  // Handle navigation with direction
  const handleNavigate = useCallback(
    (direction) => {
      if (typeof direction === "number") {
        setSlideDirection(direction > currentIndex ? "next" : "prev");
        onNavigate(direction);
      } else {
        setSlideDirection(direction);
        onNavigate(direction);
      }
    },
    [currentIndex, onNavigate]
  );

  // Lock body scroll when modal is open
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

  if (!isOpen || images.length === 0) return null;

  const progress = ((currentIndex + 1) / images.length) * 100;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Top Bar */}
        <TopBar>
          <TopBarLeft>
            <ImageTitle>{title || "Gallery"}</ImageTitle>
            <ImageSubtitle>
              Image {currentIndex + 1} of {images.length}
            </ImageSubtitle>
          </TopBarLeft>

          <TopBarRight>
            <AutoPlayBtn
              $playing={isAutoPlaying}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              title={isAutoPlaying ? "Pause slideshow" : "Start slideshow"}
            >
              {isAutoPlaying ? <FaPause /> : <FaPlay />}
            </AutoPlayBtn>
            <ActionBtn title="Fullscreen">
              <FaExpand />
            </ActionBtn>
            <ActionBtn title="Share">
              <FiShare2 />
            </ActionBtn>
            <ActionBtn title="Download">
              <FiDownload />
            </ActionBtn>
            <CloseBtn onClick={onClose} title="Close (Esc)">
              <FiX />
            </CloseBtn>
          </TopBarRight>
        </TopBar>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <NavBtn $dir="prev" onClick={() => handleNavigate("prev")}>
              <FiChevronLeft />
            </NavBtn>
            <NavBtn $dir="next" onClick={() => handleNavigate("next")}>
              <FiChevronRight />
            </NavBtn>
          </>
        )}

        {/* Main Image */}
        <ImageContainer>
          <ImageWrapper>
            {isLoading && <ImageLoader />}
            <MainImage
              key={currentIndex}
              src={getValidImageUrl(images[currentIndex])}
              alt={`${title || "Image"} ${currentIndex + 1}`}
              $direction={slideDirection}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
            <ZoomHint>
              <FiZoomIn /> Click to zoom
            </ZoomHint>
          </ImageWrapper>
        </ImageContainer>

        {/* Bottom Bar */}
        <BottomBar>
          {/* Progress */}
          <ProgressWrapper>
            <CounterBadge>
              <span>{currentIndex + 1}</span> / {images.length}
            </CounterBadge>
            <ProgressTrack>
              <ProgressFill $progress={progress} />
            </ProgressTrack>
          </ProgressWrapper>

          {/* Thumbnails */}
          {images.length > 1 && (
            <ThumbnailsWrapper>
              <ThumbnailsTrack>
                {images.map((url, i) => (
                  <Thumbnail
                    key={i}
                    $active={i === currentIndex}
                    $index={i}
                    onClick={() => handleNavigate(i)}
                  >
                    <img src={getValidImageUrl(url)} alt="" />
                    <ThumbnailOverlay>
                      <span>{i + 1}</span>
                    </ThumbnailOverlay>
                  </Thumbnail>
                ))}
              </ThumbnailsTrack>
            </ThumbnailsWrapper>
          )}
        </BottomBar>

        {/* Keyboard Hints */}
        <KeyboardHints>
          <KeyHint>
            <KeyBadge>←</KeyBadge>
            <KeyBadge>→</KeyBadge>
            Navigate
          </KeyHint>
          <KeyHint>
            <KeyBadge>ESC</KeyBadge>
            Close
          </KeyHint>
        </KeyboardHints>
      </ModalContent>
    </ModalOverlay>
  );
}