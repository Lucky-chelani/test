import styled, { keyframes } from "styled-components";
import { FaWhatsapp } from "react-icons/fa";

// ── Pulse ring animation ──────────────────────────────────────────────────────
const pulseRing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const pulseRingDelay = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  70% {
    transform: scale(1.7);
    opacity: 0;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
`;

const floatBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

// ── Wrapper positions the button + rings ──────────────────────────────────────
const WAWrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    bottom: 5.5rem;
    right: 1.25rem;
  }
`;

// ── Pulse rings (behind the button) ──────────────────────────────────────────
const PulseRing = styled.span`
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(37, 211, 102, 0.35);
  animation: ${pulseRing} 2.5s ease-out infinite;

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
  }
`;

const PulseRing2 = styled(PulseRing)`
  background: rgba(37, 211, 102, 0.2);
  animation: ${pulseRingDelay} 2.5s ease-out 0.5s infinite;
`;

// ── The actual WhatsApp button ────────────────────────────────────────────────
const FloatingWA = styled.a`
  position: relative;
  z-index: 1;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #25d366, #128c5e);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.625rem;
  text-decoration: none;
  box-shadow: 
    0 8px 24px rgba(37, 211, 102, 0.45),
    0 0 0 2px rgba(37, 211, 102, 0.15);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${floatBounce} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.12);
    box-shadow:
      0 12px 32px rgba(37, 211, 102, 0.6),
      0 0 0 4px rgba(37, 211, 102, 0.2);
    animation-play-state: paused;
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
    font-size: 1.375rem;
  }
`;

// ── Tooltip label ─────────────────────────────────────────────────────────────
const WALabel = styled.span`
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateY(-50%) translateX(6px);

  &::after {
    content: "";
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: rgba(10, 10, 10, 0.9);
    border-right: 1px solid rgba(255,255,255,0.08);
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  ${WAWrapper}:hover & {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function WhatsAppButton({ href, title = "Chat on WhatsApp" }) {
  return (
    <WAWrapper>
      {/* Animated pulse rings behind button */}
      <PulseRing />
      <PulseRing2 />

      <FloatingWA
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
      >
        <FaWhatsapp />
      </FloatingWA>

      {/* Tooltip on hover */}
      <WALabel>Chat with us</WALabel>
    </WAWrapper>
  );
}