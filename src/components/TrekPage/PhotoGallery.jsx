import { useMemo, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";
import { FaCamera, FaImages, FaExpand, FaPlay } from "react-icons/fa";
import { FiZoomIn, FiArrowRight, FiMaximize2 } from "react-icons/fi";
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
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(249, 115, 22, 0.4);
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

const expandPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
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
    padding: 3rem 0;
    margin: 2rem 0;
  }
`;

const GalleryContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 1.25rem;
  }
`;

const GalleryHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3.5rem;
`;

const EyebrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
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
`;

const GalleryTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
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
`;

const GallerySubtitle = styled.p`
  font-size: 1rem;
  color: ${tokens.colors.textMuted};
  font-style: italic;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
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
`;

const DemoLabel = styled.span`
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  background: rgba(249, 115, 22, 0.3);
  border-radius: 4px;
  margin-left: 0.25rem;
`;

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
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 1rem;
  }
`;

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

  @media (max-width: 640px) {
    grid-column: span 1;
    grid-row: auto;
    min-height: 220px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
    }
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

const QuickStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid ${tokens.colors.border};

  @media (max-width: 640px) {
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: ${slideUp} 0.5s ease-out;
  animation-delay: ${({ $index }) => $index * 0.1}s;
  animation-fill-mode: both;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${tokens.radius.lg};
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1.25rem;
  transition: ${tokens.transition.spring};

  &:hover {
    transform: scale(1.1) rotate(-5deg);
    background: linear-gradient(
      135deg,
      ${tokens.colors.primary},
      ${tokens.colors.primaryDark}
    );
    color: white;
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 640px) {
    font-size: 0.625rem;
  }
`;

// ─── Fallback Images ──────────────────────────────────────────────────────────
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhotoGallery({ images = [], title, onImageClick }) {
  const [loadedImages, setLoadedImages] = useState({});

  // Check if we have real images from backend
  const hasRealImages = useMemo(() => {
    return images && Array.isArray(images) && images.filter(Boolean).length > 0;
  }, [images]);

  // Prepare gallery images - use real images or fallbacks
  const galleryImages = useMemo(() => {
    const validImages = images.filter(Boolean);

    // If we have real images, use them
    if (validImages.length > 0) {
      // If we have fewer than 5, pad with existing images (not fallbacks)
      const result = [...validImages];
      while (result.length < 5 && validImages.length > 0) {
        result.push(validImages[result.length % validImages.length]);
      }
      return result.slice(0, 5);
    }

    // No real images - use fallbacks (demo mode)
    return FALLBACK_IMAGES.slice(0, 5);
  }, [images]);

  // Get actual image count for display
  const actualImageCount = useMemo(() => {
    const validImages = images.filter(Boolean);
    return validImages.length;
  }, [images]);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Safe click handler - only works if we have real images
  const handleImageClick = useCallback(
    (index) => {
      if (!hasRealImages) {
        // Don't trigger modal for demo images
        console.log("Demo mode: No images to view");
        return;
      }

      if (typeof onImageClick === "function") {
        // Ensure index is within bounds of actual images
        const safeIndex = Math.min(index, actualImageCount - 1);
        onImageClick(safeIndex >= 0 ? safeIndex : 0);
      }
    },
    [hasRealImages, onImageClick, actualImageCount]
  );

  // Safe fullscreen click handler
  const handleFullscreenClick = useCallback(
    (e, index) => {
      e.stopPropagation();

      if (!hasRealImages) {
        // Don't trigger modal for demo images
        return;
      }

      handleImageClick(index);
    },
    [hasRealImages, handleImageClick]
  );

  // Don't render if no images at all (even fallbacks)
  if (galleryImages.length === 0) return null;

  const displayCount = hasRealImages ? actualImageCount : 5;
  const showMoreOverlay = hasRealImages && actualImageCount > 5;

  return (
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

        <GalleryGrid variants={containerVariants} $count={galleryImages.length}>
          {galleryImages.map((img, i) => {
            const isDemo = !hasRealImages;
            const canClick = hasRealImages && i < actualImageCount;

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

                  {/* Badge - Featured or Demo */}
                  {i === 0 && (
                    isDemo ? (
                      <DemoBadge>Sample Image</DemoBadge>
                    ) : (
                      <FeaturedBadge>
                        <FaPlay /> Featured
                      </FeaturedBadge>
                    )
                  )}

                  {/* Fullscreen Button */}
                  <FullscreenButton
                    onClick={(e) => handleFullscreenClick(e, i)}
                    title={canClick ? "View fullscreen" : "Sample image"}
                    aria-label={canClick ? "View fullscreen" : "Sample image"}
                    $disabled={!canClick}
                  >
                    <FiMaximize2 />
                  </FullscreenButton>

                  {/* More Photos Overlay or Info */}
                  {i === 4 && showMoreOverlay ? (
                    <MorePhotosOverlay>
                      <MoreCount>+{actualImageCount - 5}</MoreCount>
                      <MoreLabel>More Photos</MoreLabel>
                      <ViewAllButton
                        onClick={(e) => handleFullscreenClick(e, i)}
                      >
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

        <QuickStats>
          <StatItem $index={0}>
            <StatIcon>
              <FaCamera />
            </StatIcon>
            <StatValue>{hasRealImages ? actualImageCount : "—"}</StatValue>
            <StatLabel>Photos</StatLabel>
          </StatItem>
          <StatItem $index={1}>
            <StatIcon>
              <FaImages />
            </StatIcon>
            <StatValue>{hasRealImages ? "HD" : "Demo"}</StatValue>
            <StatLabel>Quality</StatLabel>
          </StatItem>
          <StatItem $index={2}>
            <StatIcon>
              <FaExpand />
            </StatIcon>
            <StatValue>{hasRealImages ? "4K" : "—"}</StatValue>
            <StatLabel>Resolution</StatLabel>
          </StatItem>
        </QuickStats>
      </GalleryContainer>
    </GallerySection>
  );
}