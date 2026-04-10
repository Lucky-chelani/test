import styled, { keyframes } from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const colors = {
  bgCard: "#121212",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.12)",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  success: "#22c55e",
  danger: "#EF4444",
  successGlow: "rgba(34, 197, 94, 0.1)",
  dangerGlow: "rgba(239, 68, 68, 0.1)",
  successBorder: "rgba(34, 197, 94, 0.25)",
  dangerBorder: "rgba(239, 68, 68, 0.25)",
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  animation: ${fadeUp} 0.6s ease-out both;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const StatusCard = styled.div`
  background: ${colors.bgCard};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* Colored top accent line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $type }) =>
      $type === "included" ? colors.success : colors.danger};
    opacity: 0.8;
  }

  &:hover {
    border-color: ${({ $type }) =>
      $type === "included" ? colors.successBorder : colors.dangerBorder};
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${colors.border};
`;

const IconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;

  background: ${({ $type }) =>
    $type === "included" ? colors.successGlow : colors.dangerGlow};
  color: ${({ $type }) =>
    $type === "included" ? colors.success : colors.danger};
  border: 1px solid
    ${({ $type }) =>
      $type === "included" ? colors.successBorder : colors.dangerBorder};
`;

const CardTitle = styled.h3`
  font-family: "Sora", sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  letter-spacing: -0.01em;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: ${colors.textSecondary};
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 0.15rem;
    font-size: 0.85rem;
    color: ${({ $type }) =>
      $type === "included" ? colors.success : colors.danger};
  }
`;

export default function IncludedExcluded({ included = [], excluded = [] }) {
  if ((!included || included.length === 0) && (!excluded || excluded.length === 0)) return null;

  return (
    <Wrapper>
      {included && included.length > 0 && (
        <StatusCard $type="included">
          <CardHeader>
            <IconBox $type="included">
              <FaCheckCircle />
            </IconBox>
            <CardTitle>What’s Included</CardTitle>
          </CardHeader>
          <ItemList>
            {included.map((item, i) => (
              <ItemRow key={i} $type="included">
                <FaCheckCircle /> {item}
              </ItemRow>
            ))}
          </ItemList>
        </StatusCard>
      )}

      {excluded && excluded.length > 0 && (
        <StatusCard $type="excluded">
          <CardHeader>
            <IconBox $type="excluded">
              <FaTimesCircle />
            </IconBox>
            <CardTitle>Not Included</CardTitle>
          </CardHeader>
          <ItemList>
            {excluded.map((item, i) => (
              <ItemRow key={i} $type="excluded">
                <FaTimesCircle /> {item}
              </ItemRow>
            ))}
          </ItemList>
        </StatusCard>
      )}
    </Wrapper>
  );
}