import { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { 
  FaCompass, 
  FaChevronDown, 
  FaChevronUp, 
  FaQuoteLeft,
  FaBookOpen,
  FaInfoCircle,
  FaMapMarkedAlt
} from "react-icons/fa";
import { FiCopy, FiCheck, FiShare2 } from "react-icons/fi";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    bg: "#0a0a0a",
    bgCard: "#121212",
    bgElevated: "#1a1a1a",
    bgHover: "#1f1f1f",
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
    success: "#22c55e",
    successGlow: "rgba(34, 197, 94, 0.15)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", pill: "100px" },
  transition: {
    fast: "all 0.15s ease",
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
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
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(249, 115, 22, 0.2);
  }
`;

const expandIn = keyframes`
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 2000px;
  }
`;

const typewriter = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const bounceArrow = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
`;

const checkPop = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const SectionCard = styled.section`
  background: ${tokens.colors.bgCard};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.xl};
  padding: 2rem;
  animation: ${fadeUp} 0.6s ease-out both, ${glow} 4s ease-in-out infinite;
  transition: ${tokens.transition.base};
  position: relative;
  overflow: hidden;

  &::before {
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

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`;

const SectionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const SectionIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${tokens.radius.lg};
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 1.25rem;
  flex-shrink: 0;
  animation: ${float} 3s ease-in-out infinite;
  transition: ${tokens.transition.spring};
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  &:hover {
    transform: rotate(-10deg) scale(1.1);
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-family: "Sora", sans-serif;
  font-size: 1.375rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  letter-spacing: -0.01em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionSubtitle = styled.span`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.textMuted};
  font-size: 1rem;
  cursor: pointer;
  transition: ${tokens.transition.spring};

  &:hover {
    background: ${tokens.colors.primaryGlow};
    border-color: ${tokens.colors.primaryBorder};
    color: ${tokens.colors.primary};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  ${({ $success }) =>
    $success &&
    css`
      background: ${tokens.colors.successGlow};
      border-color: rgba(34, 197, 94, 0.3);
      color: ${tokens.colors.success};

      svg {
        animation: ${checkPop} 0.3s ease;
      }
    `}
`;

const ContentWrapper = styled.div`
  position: relative;
`;

const QuoteDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 3rem;
  color: ${tokens.colors.primary};
  opacity: 0.1;
  line-height: 1;
  transition: ${tokens.transition.base};

  ${SectionCard}:hover & {
    opacity: 0.2;
    transform: scale(1.1) rotate(-5deg);
  }
`;

const DescriptionText = styled.div`
  font-size: 1rem;
  color: ${tokens.colors.textSecondary};
  line-height: 1.85;
  padding-left: 2rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      to bottom,
      ${tokens.colors.primary},
      ${tokens.colors.primaryLight},
      ${tokens.colors.primaryDark}
    );
    border-radius: 3px;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  ${SectionCard}:hover &::before {
    opacity: 1;
  }

  p {
    margin-bottom: 1.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: 640px) {
    padding-left: 1.25rem;
    font-size: 0.9375rem;
  }
`;

const CollapsedOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${tokens.colors.bgCard}
  );
  pointer-events: none;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ExpandedContent = styled.div`
  animation: ${expandIn} 0.5s ease-out;
`;

const ReadMoreBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: linear-gradient(135deg, ${tokens.colors.glass}, ${tokens.colors.primaryGlow});
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.lg};
  color: ${tokens.colors.primary};
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  padding: 1rem 1.5rem;
  margin-top: 1.5rem;
  transition: ${tokens.transition.spring};
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
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 0.875rem;
    animation: ${bounceArrow} 1.5s ease-in-out infinite;
  }

  &:hover svg {
    animation: none;
    transform: ${({ $expanded }) => ($expanded ? "translateY(-2px)" : "translateY(2px)")};
  }
`;

const InfoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${tokens.colors.border};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${tokens.colors.glass};
  border: 1px solid ${tokens.colors.glassBorder};
  border-radius: ${tokens.radius.md};
  transition: ${tokens.transition.base};
  animation: ${fadeUp} 0.5s ease-out;
  animation-delay: ${({ $index }) => $index * 0.1}s;
  animation-fill-mode: both;

  &:hover {
    background: ${tokens.colors.primaryGlow};
    border-color: ${tokens.colors.primaryBorder};
    transform: translateY(-2px);
  }
`;

const InfoCardIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${tokens.radius.md};
  background: ${tokens.colors.primaryGlow};
  border: 1px solid ${tokens.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.primary};
  font-size: 0.9375rem;
  flex-shrink: 0;
  transition: ${tokens.transition.spring};

  ${InfoCard}:hover & {
    transform: rotate(-10deg) scale(1.1);
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
    color: white;
  }
`;

const InfoCardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoCardLabel = styled.div`
  font-size: 0.6875rem;
  color: ${tokens.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.125rem;
`;

const InfoCardValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};
`;

const WordCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  margin-top: 1rem;

  svg {
    color: ${tokens.colors.primary};
    font-size: 0.75rem;
  }
`;

const HighlightedWord = styled.span`
  color: ${tokens.colors.primary};
  font-weight: 600;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${tokens.colors.primaryGlow};
    border-radius: 1px;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const DESC_LIMIT = 280;

// ─── Helper Function ──────────────────────────────────────────────────────────
const highlightKeywords = (text, keywords = ["trek", "summit", "adventure", "experience", "breathtaking", "stunning", "beautiful", "amazing"]) => {
  if (!text) return text;
  
  let result = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword}s?)\\b`, "gi");
    result = result.replace(regex, `<highlight>$1</highlight>`);
  });
  
  return result;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Description({ description, detailedDescription }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  const content = detailedDescription || description || "";
  const needsExpand = content.length > DESC_LIMIT;
  const displayText = needsExpand && !expanded ? content.slice(0, DESC_LIMIT) + "…" : content;
  
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trek Overview",
          text: content.slice(0, 200) + "...",
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  // Parse content to highlight keywords
  const renderContent = (text) => {
    const parts = text.split(/(<highlight>.*?<\/highlight>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<highlight>")) {
        const word = part.replace(/<\/?highlight>/g, "");
        return <HighlightedWord key={index}>{word}</HighlightedWord>;
      }
      return part;
    });
  };

  const processedText = highlightKeywords(displayText);

  return (
    <SectionCard>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionIconBox>
            <FaCompass />
          </SectionIconBox>
          <SectionTitleWrapper>
            <SectionTitle>
              Overview
            </SectionTitle>
            <SectionSubtitle>
              {readingTime} min read • {wordCount} words
            </SectionSubtitle>
          </SectionTitleWrapper>
        </SectionHeaderLeft>

        <HeaderActions>
          <ActionButton
            onClick={handleCopy}
            $success={copied}
            title={copied ? "Copied!" : "Copy text"}
          >
            {copied ? <FiCheck /> : <FiCopy />}
          </ActionButton>
          <ActionButton onClick={handleShare} title="Share">
            <FiShare2 />
          </ActionButton>
        </HeaderActions>
      </SectionHeader>

      <ContentWrapper ref={contentRef}>
        <QuoteDecoration>
          <FaQuoteLeft />
        </QuoteDecoration>

        <DescriptionText>
          {expanded ? (
            <ExpandedContent>
              <p>{renderContent(processedText)}</p>
            </ExpandedContent>
          ) : (
            <p>{renderContent(processedText)}</p>
          )}
        </DescriptionText>

        <CollapsedOverlay $show={needsExpand && !expanded} />
      </ContentWrapper>

      {needsExpand && (
        <ReadMoreBtn onClick={() => setExpanded((p) => !p)} $expanded={expanded}>
          {expanded ? (
            <>
              <FaChevronUp /> Show Less
            </>
          ) : (
            <>
              <FaChevronDown /> Continue Reading
            </>
          )}
        </ReadMoreBtn>
      )}
    </SectionCard>
  );
}