import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaCalendarAlt, FaSun, FaSnowflake, FaLeaf, FaCloudRain, FaCheck } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

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
    surface1: "rgba(255,255,255,0.03)",
    surface2: "rgba(255,255,255,0.06)",
    success: "#22c55e",
    successGlow: "rgba(34, 197, 94, 0.15)",
    winter: "#60a5fa",
    spring: "#4ade80",
    summer: "#fbbf24",
    autumn: "#f97316",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "20px", pill: "100px" },
  transition: {
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.15s ease",
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

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
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
`;

const SectionSubtitle = styled.span`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
`;

const SeasonBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25));
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.pill};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.primary};
  animation: ${pulse} 2s ease-in-out infinite;

  svg {
    font-size: 0.875rem;
  }
`;

const SeasonInfoCard = styled.div`
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    ${tokens.colors.surface1},
    ${tokens.colors.surface2}
  );
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.lg};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: ${tokens.transition.base};

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    background: linear-gradient(
      135deg,
      ${tokens.colors.primaryGlow},
      rgba(249, 115, 22, 0.08)
    );
  }
`;

const SeasonIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${tokens.radius.lg};
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
  transition: ${tokens.transition.spring};

  ${SeasonInfoCard}:hover & {
    transform: rotate(-10deg) scale(1.1);
  }
`;

const SeasonContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SeasonLabel = styled.div`
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.25rem;
`;

const SeasonValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  
  span {
    color: ${tokens.colors.primary};
  }
`;

const SeasonDescription = styled.p`
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  margin: 0.5rem 0 0;
  line-height: 1.5;
`;

const MonthsWrapper = styled.div`
  position: relative;
`;

const MonthsLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MonthsTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.colors.textSecondary};
`;

const ActiveCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: ${tokens.colors.primary};
  font-weight: 600;

  svg {
    font-size: 0.75rem;
  }
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MonthChip = styled.div`
  position: relative;
  padding: 0.875rem 0.5rem;
  border-radius: ${tokens.radius.md};
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid;
  cursor: pointer;
  overflow: hidden;
  animation: ${scaleIn} 0.4s ease-out both;
  animation-delay: ${({ $index }) => $index * 0.03}s;
  transition: ${tokens.transition.spring};

  background: ${({ $active }) =>
    $active
      ? `linear-gradient(135deg, ${tokens.colors.primaryGlow}, rgba(249, 115, 22, 0.25))`
      : tokens.colors.surface1};
  border-color: ${({ $active }) =>
    $active ? tokens.colors.primary : tokens.colors.border};
  color: ${({ $active }) =>
    $active ? tokens.colors.primary : tokens.colors.textMuted};

  ${({ $active }) =>
    $active &&
    css`
      box-shadow: 0 0 20px ${tokens.colors.primaryGlow},
        inset 0 0 20px ${tokens.colors.primaryGlow};
    `}

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: ${tokens.colors.primaryGlow};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    border-color: ${tokens.colors.primary};
    color: ${tokens.colors.primary};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);

    &::before {
      width: 150%;
      height: 150%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

const MonthName = styled.span`
  position: relative;
  z-index: 1;
  display: block;
`;

const MonthWeatherIcon = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: ${({ $color }) => $color || tokens.colors.textMuted};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: ${tokens.transition.base};
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${tokens.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.5rem;
  animation: ${checkPop} 0.3s ease-out;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
  z-index: 2;
`;

const SeasonLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${tokens.colors.border};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${tokens.colors.textMuted};

  svg {
    font-size: 0.875rem;
  }
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const SeasonTextCard = styled.div`
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${tokens.colors.primaryGlow},
    rgba(249, 115, 22, 0.08)
  );
  border: 1px solid ${tokens.colors.primaryBorder};
  border-radius: ${tokens.radius.lg};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      rgba(249, 115, 22, 0.1) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const SeasonTextIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 30px rgba(249, 115, 22, 0.4);
  animation: ${float} 3s ease-in-out infinite;
`;

const SeasonTextValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${tokens.colors.textPrimary};
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;

  span {
    background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.primaryLight});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SeasonTextLabel = styled.p`
  font-size: 0.9375rem;
  color: ${tokens.colors.textMuted};
  margin: 0;
  position: relative;
  z-index: 1;
`;

const TipCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: ${tokens.colors.surface1};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.radius.md};
  margin-top: 1.25rem;
  font-size: 0.8125rem;
  color: ${tokens.colors.textMuted};
  line-height: 1.6;
  transition: ${tokens.transition.base};

  &:hover {
    border-color: ${tokens.colors.primaryBorder};
    background: ${tokens.colors.primaryGlow};
  }

  svg {
    color: ${tokens.colors.primary};
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS_DATA = [
  { name: "Jan", season: "Winter", icon: FaSnowflake, color: tokens.colors.winter },
  { name: "Feb", season: "Winter", icon: FaSnowflake, color: tokens.colors.winter },
  { name: "Mar", season: "Spring", icon: FaLeaf, color: tokens.colors.spring },
  { name: "Apr", season: "Spring", icon: FaLeaf, color: tokens.colors.spring },
  { name: "May", season: "Spring", icon: FaLeaf, color: tokens.colors.spring },
  { name: "Jun", season: "Summer", icon: FaSun, color: tokens.colors.summer },
  { name: "Jul", season: "Summer", icon: FaSun, color: tokens.colors.summer },
  { name: "Aug", season: "Summer", icon: FaSun, color: tokens.colors.summer },
  { name: "Sep", season: "Autumn", icon: FaLeaf, color: tokens.colors.autumn },
  { name: "Oct", season: "Autumn", icon: FaLeaf, color: tokens.colors.autumn },
  { name: "Nov", season: "Autumn", icon: FaLeaf, color: tokens.colors.autumn },
  { name: "Dec", season: "Winter", icon: FaSnowflake, color: tokens.colors.winter },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getSeasonIcon = (season) => {
  if (!season) return FaCalendarAlt;
  const s = season.toLowerCase();
  if (s.includes("winter") || s.includes("dec") || s.includes("jan") || s.includes("feb")) return FaSnowflake;
  if (s.includes("summer") || s.includes("jun") || s.includes("jul") || s.includes("aug")) return FaSun;
  if (s.includes("monsoon") || s.includes("rain")) return FaCloudRain;
  if (s.includes("autumn") || s.includes("fall") || s.includes("sep") || s.includes("oct")) return FaLeaf;
  if (s.includes("spring") || s.includes("mar") || s.includes("apr") || s.includes("may")) return FaLeaf;
  return FaCalendarAlt;
};

const getSeasonDescription = (season) => {
  if (!season) return "";
  const s = season.toLowerCase();
  if (s.includes("winter")) return "Perfect for snow lovers and winter trekking enthusiasts";
  if (s.includes("summer")) return "Ideal weather with clear skies and pleasant temperatures";
  if (s.includes("monsoon")) return "Lush green landscapes but expect some rainfall";
  if (s.includes("autumn") || s.includes("fall")) return "Beautiful foliage with comfortable temperatures";
  if (s.includes("spring")) return "Blooming flowers and moderate weather conditions";
  return "Best conditions for this trek experience";
};

// Normalize month name for comparison
const normalizeMonth = (monthStr) => {
  if (!monthStr || typeof monthStr !== "string") return "";
  return monthStr.trim().toLowerCase().slice(0, 3);
};

// Check if a month is active based on availableMonths array
const isMonthActive = (monthName, availableMonths) => {
  if (!availableMonths || !Array.isArray(availableMonths) || availableMonths.length === 0) {
    return false;
  }
  
  const normalizedMonth = normalizeMonth(monthName);
  return availableMonths.some((am) => normalizeMonth(am) === normalizedMonth);
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BestTimeToVisit({ season, availableMonths = [] }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Don't render if no data
  if (!season && (!availableMonths || availableMonths.length === 0)) return null;

  // Check if availableMonths has actual data
  const hasMonthsData = availableMonths && Array.isArray(availableMonths) && availableMonths.length > 0;

  // Calculate active months count from database
  const activeMonthsCount = hasMonthsData
    ? MONTHS_DATA.filter((month) => isMonthActive(month.name, availableMonths)).length
    : 0;

  const SeasonIconComponent = getSeasonIcon(season);

  return (
    <SectionCard>
      <SectionHeader>
        <SectionHeaderLeft>
          <SectionIconBox>
            <FaCalendarAlt />
          </SectionIconBox>
          <SectionTitleWrapper>
            <SectionTitle>Best Time to Visit</SectionTitle>
            <SectionSubtitle>Plan your perfect adventure</SectionSubtitle>
          </SectionTitleWrapper>
        </SectionHeaderLeft>

      </SectionHeader>

      {hasMonthsData ? (
        <>
          {season && (
            <SeasonInfoCard>
              <SeasonIcon>
                <SeasonIconComponent />
              </SeasonIcon>
              <SeasonContent>
                <SeasonLabel>Recommended Season</SeasonLabel>
                <SeasonValue>
                  <span>{season}</span>
                </SeasonValue>
                <SeasonDescription>{getSeasonDescription(season)}</SeasonDescription>
              </SeasonContent>
            </SeasonInfoCard>
          )}

          <MonthsWrapper>
            <MonthsLabel>
              <MonthsTitle>Available Months</MonthsTitle>
              <ActiveCount>
                <FaCheck />
                {activeMonthsCount} of 12 months
              </ActiveCount>
            </MonthsLabel>

            <MonthsGrid>
              {MONTHS_DATA.map((month, index) => {
                const isActive = isMonthActive(month.name, availableMonths);
                const WeatherIcon = month.icon;

                return (
                  <MonthChip
                    key={month.name}
                    $active={isActive}
                    $index={index}
                    onMouseEnter={() => setHoveredMonth(month.name)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {isActive && (
                      <CheckIcon>
                        <FaCheck />
                      </CheckIcon>
                    )}
                    <MonthName>{month.name}</MonthName>
                    <MonthWeatherIcon $color={month.color} $active={isActive}>
                      <WeatherIcon />
                    </MonthWeatherIcon>
                  </MonthChip>
                );
              })}
            </MonthsGrid>
          </MonthsWrapper>

          <SeasonLegend>
            <LegendItem>
              <LegendDot $color={tokens.colors.winter} />
              <FaSnowflake style={{ color: tokens.colors.winter }} />
              Winter
            </LegendItem>
            <LegendItem>
              <LegendDot $color={tokens.colors.spring} />
              <FaLeaf style={{ color: tokens.colors.spring }} />
              Spring
            </LegendItem>
            <LegendItem>
              <LegendDot $color={tokens.colors.summer} />
              <FaSun style={{ color: tokens.colors.summer }} />
              Summer
            </LegendItem>
            <LegendItem>
              <LegendDot $color={tokens.colors.autumn} />
              <FaLeaf style={{ color: tokens.colors.autumn }} />
              Autumn
            </LegendItem>
          </SeasonLegend>

          <TipCard>
            <FiInfo />
            <span>
              <strong style={{ color: tokens.colors.textPrimary }}>Pro tip:</strong> Book at least 2-3 weeks in advance during peak season months for the best availability and rates.
            </span>
          </TipCard>
        </>
      ) : (
        <SeasonTextCard>
          <SeasonTextIcon>
            <SeasonIconComponent />
          </SeasonTextIcon>
          <SeasonTextValue>
            <span>{season}</span>
          </SeasonTextValue>
          <SeasonTextLabel>{getSeasonDescription(season)}</SeasonTextLabel>
        </SeasonTextCard>
      )}
    </SectionCard>
  );
}