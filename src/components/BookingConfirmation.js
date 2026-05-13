import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiMapPin, FiCalendar, FiUsers, FiCreditCard,
  FiFileText, FiPhone, FiArrowLeft, FiShare2,
  FiShield, FiAlertCircle, FiUser, FiClock, FiInfo, FiChevronRight
} from 'react-icons/fi';
import BookingService from '../services/BookingService';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Fallback for map pattern if not found
import mapPattern from '../assets/images/map-pattren.png'; 

// ─────────────────────────────────────────────
// TOKENS (Premium Theme)
// ─────────────────────────────────────────────
const theme = {
  // Colors
  bg: "#050505",
  bgCard: "rgba(18, 18, 18, 0.6)",
  bgElevated: "rgba(30, 30, 30, 0.6)",
  primary: "#f97316",
  primaryDark: "#ea580c",
  primaryGlow: "rgba(249, 115, 22, 0.25)",
  secondaryGlow: "rgba(34, 197, 94, 0.15)", // Greenish glow for success
  success: "#22c55e",
  successDark: "#16a34a",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(249, 115, 22, 0.3)",
  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#64748b",
  glass: "rgba(255,255,255,0.03)",
  
  // FIXED: Added missing properties back
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "100px" },
  transition: { base: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" },
  shadows: { 
    card: "0 8px 32px rgba(0,0,0,0.4)",
    glow: "0 0 20px rgba(249, 115, 22, 0.2)"
  }
};

// ─────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  60%  { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;
const successRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
  70%  { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
`;
const orbFloat1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
`;
const orbFloat2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 40px) scale(1.2); }
  66% { transform: translate(20px, -20px) scale(0.8); }
`;

// ─── Framer Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

// ─────────────────────────────────────────────
// LAYOUT & AMBIENCE
// ─────────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${theme.bg};
  background-image: linear-gradient(to bottom, rgba(5,5,5,0.85), rgba(5,5,5,1)), url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  color: ${theme.textPrimary};
  font-family: 'Inter', -apple-system, sans-serif;
  padding-bottom: 130px;
  position: relative;
  overflow-x: hidden;
`;

const AmbientOrb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
`;

const OrbPrimary = styled(AmbientOrb)`
  top: -10%; left: -5%;
  width: 40vw; height: 40vw;
  background: ${theme.primaryGlow};
  animation: ${orbFloat1} 15s ease-in-out infinite;
`;

const OrbSuccess = styled(AmbientOrb)`
  bottom: 10%; right: -10%;
  width: 50vw; height: 50vw;
  background: ${theme.secondaryGlow};
  animation: ${orbFloat2} 18s ease-in-out infinite;
`;

// ─────────────────────────────────────────────
// TOP BAR (Glassmorphism)
// ─────────────────────────────────────────────
const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid ${theme.border};
  box-shadow: 0 4px 30px rgba(0,0,0,0.5);
`;

const TopBarInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  @media (max-width: 480px) { padding: 0.75rem 1rem; }
`;

const BackBtn = styled.button`
  width: 42px; height: 42px;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  background: ${theme.glass};
  color: ${theme.textPrimary};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.25s ease;
  flex-shrink: 0;
  &:hover {
    background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark});
    border-color: ${theme.primary};
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(249,115,22,0.3);
  }
  &:active { transform: scale(0.97); }
`;

const TopBarContent = styled.div`
  flex: 1; min-width: 0; display: flex; flex-direction: column;
`;

const TopBarLabel = styled.div`
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.12em; color: ${theme.success}; line-height: 1;
  margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.35rem;
`;

const TopBarTitle = styled.h1`
  font-size: 1.3rem; font-weight: 800; color: ${theme.textPrimary};
  margin: 0; line-height: 1.2;
`;

const TopBarTitleAccent = styled.span`
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
  background-clip: text; -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TopBarRight = styled.div`
  display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
`;

const IconBtn = styled.button`
  width: 40px; height: 40px; border-radius: 12px;
  border: 1px solid ${theme.border}; background: ${theme.glass};
  color: ${theme.textSecondary}; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { color: ${theme.primary}; border-color: ${theme.primary}; background: rgba(249,115,22,0.1); }
`;

const PageBody = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  position: relative;
  z-index: 10;
  @media (max-width: 768px) { padding: 1.5rem 1rem; }
`;

// ─────────────────────────────────────────────
// SUCCESS HERO
// ─────────────────────────────────────────────
const SuccessHero = styled(motion.div)`
  text-align: center;
  padding: 3rem 1rem;
`;

const SuccessCircle = styled.div`
  width: 90px; height: 90px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16803d);
  display: flex; align-items: center; justify-content: center;
  color: white; margin: 0 auto 1.5rem;
  animation: ${popIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1), ${successRing} 2.5s ease-out infinite 1s;
  box-shadow: 0 8px 32px rgba(34,197,94,0.4);
  svg { font-size: 2.5rem; }
`;

const SuccessTitle = styled.h1`
  font-size: 2.2rem; font-weight: 800; color: ${theme.textPrimary};
  letter-spacing: -0.02em; margin: 0 0 0.75rem;
  @media (max-width: 480px) { font-size: 1.75rem; }
`;

const SuccessSubtitle = styled.p`
  font-size: 1.1rem; color: ${theme.textSecondary}; margin: 0 0 1.5rem; line-height: 1.6;
`;

const BookingIdPill = styled.div`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3);
  border-radius: 100px; font-family: 'Courier New', monospace;
  font-size: 0.95rem; font-weight: 700; color: ${theme.primary};
  letter-spacing: 0.05em; position: relative; overflow: hidden;
  box-shadow: 0 4px 15px rgba(249,115,22,0.15);
  &::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    animation: ${shimmer} 2.5s infinite;
  }
`;

// ─────────────────────────────────────────────
// PAYMENT STATUS BANNER
// ─────────────────────────────────────────────
const PayStatusBanner = styled(motion.div)`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const PayStatusItem = styled.div`
  padding: 1.25rem 1.5rem; border-radius: 16px;
  border: 1px solid ${p => p.$success ? 'rgba(34,197,94,0.3)' : theme.border};
  background: ${p => p.$success ? 'rgba(34,197,94,0.08)' : theme.bgCard};
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
`;

const PayStatusLabel = styled.div`
  font-size: 0.75rem; font-weight: 700; color: ${theme.textSecondary};
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;
  display: flex; align-items: center; gap: 0.4rem;
  svg { font-size: 0.9rem; color: ${p => p.$success ? theme.success : theme.primary}; }
`;

const PayStatusValue = styled.div`
  font-size: 1.5rem; font-weight: 800;
  color: ${p => p.$success ? theme.success : theme.textPrimary};
  line-height: 1; margin-bottom: 0.4rem;
`;

const PayStatusNote = styled.div`
  font-size: 0.8rem; color: ${theme.textMuted}; line-height: 1.4;
`;

// ─────────────────────────────────────────────
// CARDS (Glassmorphism)
// ─────────────────────────────────────────────
const Card = styled(motion.div)`
  background: ${theme.bgCard}; 
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${theme.border}; 
  border-radius: ${theme.radius.xl};
  overflow: hidden; margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: all 0.3s ease;
  &:hover { 
    border-color: ${theme.borderHover}; 
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
  }
`;

const CardHead = styled.div`
  padding: 1.25rem 1.5rem; border-bottom: 1px solid ${theme.border};
  display: flex; align-items: center; gap: 0.875rem; position: relative;
  background: rgba(255,255,255,0.02);
`;

const CardIconWrap = styled.div`
  width: 38px; height: 38px; border-radius: 10px;
  background: rgba(249,115,22,0.15); color: ${theme.primary};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  border: 1px solid rgba(249,115,22,0.2);
`;

const CardTitle = styled.h3`
  font-size: 1.1rem; font-weight: 700; color: ${theme.textPrimary}; margin: 0;
  font-family: 'Sora', sans-serif;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  @media (max-width: 480px) { padding: 1.25rem; }
`;

// ─────────────────────────────────────────────
// DETAIL GRID
// ─────────────────────────────────────────────
const DetailGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const DetailItem = styled.div`
  padding: 1rem; background: ${theme.glass};
  border: 1px solid ${theme.border}; border-radius: 12px; transition: all 0.2s ease;
  &:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); }
`;

const DetailLabel = styled.div`
  font-size: 0.75rem; font-weight: 600; color: ${theme.textMuted};
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;
`;

const DetailValue = styled.div`
  font-size: 1rem; font-weight: 600; color: ${theme.textPrimary};
  line-height: 1.4; word-break: break-word;
`;

// ─────────────────────────────────────────────
// TREK IMAGE
// ─────────────────────────────────────────────
const TrekImageWrap = styled.div`
  border-radius: 16px; overflow: hidden; height: 240px;
  margin-bottom: 1.5rem; position: relative; border: 1px solid ${theme.border};
  @media (max-width: 480px) { height: 180px; }
`;

const TrekImage = styled.img`
  width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;
  &:hover { transform: scale(1.05); }
`;

const TrekImageOverlay = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
`;

// ─────────────────────────────────────────────
// PARTICIPANT CARDS
// ─────────────────────────────────────────────
const ParticipantGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const ParticipantCard = styled.div`
  padding: 1.25rem; background: ${p => p.$primary ? 'rgba(249,115,22,0.05)' : theme.glass};
  border: 1px solid ${p => p.$primary ? 'rgba(249,115,22,0.3)' : theme.border};
  border-radius: 14px; position: relative; transition: all 0.2s ease;
  &:hover { background: rgba(255,255,255,0.05); transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
`;

const PrimaryBadge = styled.span`
  position: absolute; top: 0.75rem; right: 0.75rem;
  background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark});
  color: white; font-size: 0.65rem; font-weight: 700;
  padding: 0.25rem 0.6rem; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(249,115,22,0.3);
`;

const ParticipantNum = styled.div`
  font-size: 0.75rem; font-weight: 600; color: ${theme.textMuted};
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;
`;

const ParticipantName = styled.div`
  font-size: 1.1rem; font-weight: 700; color: ${theme.textPrimary};
  margin-bottom: 0.75rem; padding-right: ${p => p.$hasBadge ? '4.5rem' : 0};
`;

const ParticipantDetail = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.85rem; color: ${theme.textSecondary}; margin-bottom: 0.4rem;
  word-break: break-word;
  &:last-child { margin-bottom: 0; }
  svg { flex-shrink: 0; font-size: 0.9rem; color: ${theme.primary}; }
`;

// ─────────────────────────────────────────────
// PAYMENT SPLIT
// ─────────────────────────────────────────────
const SplitCard = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const SplitItem = styled.div`
  padding: 1.25rem;
  background: ${p => p.$paid ? 'rgba(34,197,94,0.08)' : theme.glass};
  border: 1px solid ${p => p.$paid ? 'rgba(34,197,94,0.3)' : theme.border};
  border-radius: 14px;
`;

const SplitPercent = styled.div`
  font-size: 1.75rem; font-weight: 800; font-family: 'Sora', sans-serif;
  color: ${p => p.$paid ? theme.success : theme.textSecondary};
  line-height: 1; margin-bottom: 0.35rem;
`;

const SplitLabel = styled.div`
  font-size: 0.8rem; color: ${theme.textMuted}; line-height: 1.4; margin-bottom: 0.5rem;
`;

const SplitAmount = styled.div`
  font-size: 1.1rem; font-weight: 700;
  color: ${p => p.$paid ? theme.success : theme.textPrimary};
`;

const SplitStatus = styled.span`
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.6rem;
  border-radius: 20px; margin-top: 0.6rem;
  background: ${p => p.$paid ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)'};
  color: ${p => p.$paid ? theme.success : theme.textMuted};
  border: 1px solid ${p => p.$paid ? 'rgba(34,197,94,0.3)' : theme.border};
`;

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
const StatusBadge = styled.span`
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.85rem; border-radius: 20px;
  font-size: 0.8rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase;
  background: ${p => p.$type === 'success' ? 'rgba(34,197,94,0.15)' : p.$type === 'warning' ? 'rgba(249,115,22,0.15)' : theme.glass};
  color: ${p => p.$type === 'success' ? theme.success : p.$type === 'warning' ? theme.primary : theme.textMuted};
  border: 1px solid ${p => p.$type === 'success' ? 'rgba(34,197,94,0.3)' : p.$type === 'warning' ? 'rgba(249,115,22,0.3)' : theme.border};
`;

// ─────────────────────────────────────────────
// TRUST NOTE
// ─────────────────────────────────────────────
const TrustNote = styled(motion.div)`
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 1rem 1.25rem; background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px;
  font-size: 0.85rem; color: ${theme.textSecondary}; line-height: 1.6;
  margin-bottom: 0.5rem; backdrop-filter: blur(8px);
`;

// ─────────────────────────────────────────────
// ★ PREMIUM COMPACT FOOTER
// ─────────────────────────────────────────────
const ConfirmFooter = styled.div`
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  background: rgba(5,5,5,0.85);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid ${theme.border};
  box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
  padding: 1rem 1.5rem; display: flex; justify-content: center;
  @media (max-width: 480px) { padding: 0.875rem 1rem; }
`;

const ConfirmFooterInner = styled.div`
  display: flex; align-items: center; gap: 1.5rem;
  background: ${theme.glass}; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 0.75rem 1rem 0.75rem 1.5rem;
  width: 100%; max-width: 760px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  @media (max-width: 640px) {
    flex-direction: column; gap: 0.875rem; padding: 1rem;
    border-radius: 16px; 
  }
`;

const ConfirmFooterInfo = styled.div`
  flex: 1; min-width: 0;
  @media (max-width: 640px) { width: 100%; text-align: center; }
`;

const ConfirmFooterTitle = styled.div`
  font-size: 0.75rem; font-weight: 700; color: ${theme.textMuted};
  margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.08em;
`;

const ConfirmFooterId = styled.div`
  font-size: 0.95rem; font-weight: 700; color: ${theme.textPrimary};
  font-family: 'Courier New', monospace; letter-spacing: 0.05em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const ConfirmFooterDivider = styled.div`
  width: 1px; height: 40px; background: rgba(255,255,255,0.1); flex-shrink: 0;
  @media (max-width: 640px) { display: none; }
`;

const ConfirmFooterBtns = styled.div`
  display: flex; gap: 0.75rem; flex-shrink: 0;
  @media (max-width: 640px) { width: 100%; }
`;

const BtnConfirmSecondary = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem 1.5rem; border-radius: 12px;
  border: 1px solid ${theme.border}; background: ${theme.glass};
  color: ${theme.textSecondary}; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
  &:hover { background: rgba(255,255,255,0.08); border-color: ${theme.textPrimary}; color: ${theme.textPrimary}; }
  @media (max-width: 640px) { flex: 1; padding: 0.875rem 1rem; }
`;

const BtnConfirmPrimary = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem 1.75rem; border-radius: 12px; border: none;
  background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark});
  color: white; font-size: 0.95rem; font-weight: 700;
  cursor: pointer; transition: all 0.25s ease; white-space: nowrap;
  box-shadow: 0 4px 20px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(249,115,22,0.5); }
  &:active { transform: translateY(0); }
  @media (max-width: 640px) { flex: 1; padding: 0.875rem 1rem; }
`;

// ─────────────────────────────────────────────
// LOADING / ERROR
// ─────────────────────────────────────────────
const FullCenter = styled.div`
  min-height: 100vh; background: ${theme.bg}; display: flex; align-items: center;
  justify-content: center; flex-direction: column; gap: 1.5rem; text-align: center; padding: 2rem;
`;

const BigSpinner = styled.div`
  width: 56px; height: 56px; border: 4px solid rgba(249,115,22,0.1);
  border-top-color: ${theme.primary}; border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ─────────────────────────────────────────────
// ★ FAULT TOLERANCE HELPERS
// ─────────────────────────────────────────────
const safeNum = (val, fallback = 0) => {
  if (val === null || val === undefined || isNaN(val)) return fallback;
  return Number(val);
};

const safeStr = (val, fallback = '—') => {
  if (typeof val === 'string' && val.trim().length > 0) return val;
  if (typeof val === 'number') return String(val);
  return fallback;
};

const safeDate = (val) => {
  if (!val) return 'Date not specified';
  try {
    if (typeof val === 'string') {
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (val.toDate) return val.toDate().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (val instanceof Date) return val.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return String(val);
  } catch { return String(val); }
};

const getParticipantCount = (booking) => {
  if (Array.isArray(booking?.participants)) return booking.participants.length;
  if (booking?.totalParticipants) return safeNum(booking.totalParticipants, 1);
  if (booking?.numberOfParticipants) return safeNum(booking.numberOfParticipants, 1);
  return 1;
};

const getStatus = (booking) => {
  const s = safeStr(booking?.status).toLowerCase();
  const p = safeStr(booking?.paymentStatus).toLowerCase();
  if (s === 'confirmed' || p === 'completed' || p === 'success') return 'success';
  if (s === 'pending' || p === 'pending') return 'warning';
  return 'default';
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (!auth.currentUser) {
          setError('Please log in to view booking details.');
          setLoading(false);
          return;
        }
        
        const data = await BookingService.getBookingById(bookingId);
        
        if (!data) {
          setError('Booking not found in our records.');
          setLoading(false);
          return;
        }

        let profile = {};
        try {
          const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (snap.exists()) profile = snap.data();
        } catch (e) {
          console.warn('Could not fetch user profile, using auth defaults.', e);
        }

        const combined = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          ...profile
        };

        setBooking({
          ...data,
          userInfo: combined,
          userName: safeStr(data.name) !== '—' ? data.name : safeStr(data.userName) !== '—' ? data.userName : safeStr(combined.name) !== '—' ? combined.name : safeStr(combined.displayName, ''),
          userEmail: safeStr(data.email) !== '—' ? data.email : safeStr(data.userEmail) !== '—' ? data.userEmail : safeStr(combined.email, ''),
          userPhone: safeStr(data.contactNumber) !== '—' ? data.contactNumber : safeStr(data.phoneNumber) !== '—' ? data.phoneNumber : safeStr(combined.phone) !== '—' ? combined.phone : safeStr(combined.contactNumber, ''),
        });
      } catch (e) {
        console.error("Booking retrieval error:", e);
        setError('Could not retrieve booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Trek Booking',
        text: `Booking ID: ${bookingId}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // ── Guards ──
  if (loading) return (
    <FullCenter>
      <BigSpinner />
      <p style={{ color: theme.textSecondary, fontSize: '1rem', fontWeight: 500 }}>Loading your adventure…</p>
    </FullCenter>
  );

  if (error || !booking) return (
    <PageWrapper>
      <TopBar>
        <TopBarInner>
          <BackBtn onClick={() => navigate(-1)}><FiArrowLeft size={20} /></BackBtn>
          <TopBarContent>
            <TopBarLabel>Booking</TopBarLabel>
            <TopBarTitle>Not <TopBarTitleAccent>Found</TopBarTitleAccent></TopBarTitle>
          </TopBarContent>
        </TopBarInner>
      </TopBar>
      <FullCenter>
        <FiAlertCircle size={56} color={theme.primary} style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.4))' }} />
        <h2 style={{ color: theme.textPrimary, fontSize: '1.5rem', fontWeight: 800 }}>
          {error || 'Booking not found'}
        </h2>
        <p style={{ color: theme.textSecondary, fontSize: '1rem', maxWidth: '400px' }}>
          We couldn't locate the details for this booking ID. Please check the link or explore our available treks.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <BtnConfirmSecondary onClick={() => navigate('/profile')}>My Profile</BtnConfirmSecondary>
          <BtnConfirmPrimary onClick={() => navigate('/explore')}>Explore Treks</BtnConfirmPrimary>
        </div>
      </FullCenter>
    </PageWrapper>
  );

  // ─────────────────────────────────────────────
  // ★ SAFE CALCULATIONS
  // ─────────────────────────────────────────────
  const participantCount = getParticipantCount(booking);
  const statusType = getStatus(booking);
  const startDate = booking.startDate || booking.trekDate || booking.date;
  const pricePerPerson = safeNum(booking.pricePerPerson);
  const couponData = booking.coupon || null;
  const discountApplied = safeNum(booking.discount) || safeNum(booking.discountAmount);

  const fullTrekCost = (() => {
    if (safeNum(booking.totalAmount) > safeNum(booking.upfrontAmount)) return safeNum(booking.totalAmount);
    if (safeNum(booking.subtotal)) return Math.max(safeNum(booking.subtotal) - discountApplied, 0);
    if (pricePerPerson > 0) return Math.max((pricePerPerson * participantCount) - discountApplied, 0);
    return safeNum(booking.totalAmount);
  })();

  const upfrontPaid = safeNum(booking.upfrontAmount) || safeNum(booking.paidAmount) || safeNum(booking.amountPaid) || Math.ceil(fullTrekCost * 0.20);
  const remaining = safeNum(booking.remainingAmount) || safeNum(booking.balanceAmount) || safeNum(booking.amountDue) || Math.max(fullTrekCost - upfrontPaid, 0);
  const subtotalAmount = safeNum(booking.subtotal) || (pricePerPerson * participantCount) || fullTrekCost;

  const safeTrek = booking.trek || {}; // Defensive fallback if trek details are missing
  const safeParticipants = Array.isArray(booking.participants) ? booking.participants : [];

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <PageWrapper>
      <OrbPrimary />
      <OrbSuccess />

      <TopBar>
        <TopBarInner>
          <BackBtn onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </BackBtn>
          <TopBarContent>
            <TopBarLabel>
              <FiCheckCircle size={12} />
              Adventure Confirmed
            </TopBarLabel>
            <TopBarTitle>
              Booking <TopBarTitleAccent>Confirmed!</TopBarTitleAccent>
            </TopBarTitle>
          </TopBarContent>
          <TopBarRight>
            <IconBtn onClick={handleShare} title="Share">
              <FiShare2 size={18} />
            </IconBtn>
          </TopBarRight>
        </TopBarInner>
      </TopBar>

      <PageBody
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SuccessHero variants={itemVariants}>
          <SuccessCircle><FiCheckCircle /></SuccessCircle>
          <SuccessTitle>Booking Confirmed! 🎉</SuccessTitle>
          <SuccessSubtitle>
            Your adventure is locked in. We've sent a confirmation to{' '}
            <span style={{color: theme.textPrimary, fontWeight: 600}}>{safeStr(booking.userEmail, 'your email')}</span>.
          </SuccessSubtitle>
          <BookingIdPill>
            <FiFileText size={16} />{bookingId}
          </BookingIdPill>
        </SuccessHero>

        <PayStatusBanner variants={itemVariants}>
          <PayStatusItem $success>
            <PayStatusLabel><FiCheckCircle size={14} />Paid Online (20%)</PayStatusLabel>
            <PayStatusValue $success>₹{upfrontPaid.toLocaleString('en-IN')}</PayStatusValue>
            <PayStatusNote>Deposit via Razorpay · Confirmed</PayStatusNote>
          </PayStatusItem>
          <PayStatusItem>
            <PayStatusLabel><FiInfo size={14} />Pay to Organizer (80%)</PayStatusLabel>
            <PayStatusValue>₹{remaining.toLocaleString('en-IN')}</PayStatusValue>
            <PayStatusNote>Remaining balance · Due on trek day</PayStatusNote>
          </PayStatusItem>
        </PayStatusBanner>

        <Card variants={itemVariants}>
          <CardHead>
            <CardIconWrap><FiMapPin size={18} /></CardIconWrap>
            <CardTitle>Trek Details</CardTitle>
          </CardHead>
          <CardBody>
            {safeTrek.imageUrl && (
              <TrekImageWrap>
                <TrekImage src={safeTrek.imageUrl} alt={safeStr(safeTrek.title, 'Trek Image')} />
                <TrekImageOverlay />
              </TrekImageWrap>
            )}
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Trek Name</DetailLabel>
                <DetailValue>{safeStr(safeTrek.title) !== '—' ? safeTrek.title : safeStr(safeTrek.name, 'Adventure Trek')}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Location</DetailLabel>
                <DetailValue>{safeStr(safeTrek.location)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Duration</DetailLabel>
                <DetailValue>{safeStr(safeTrek.duration)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Difficulty</DetailLabel>
                <DetailValue>{safeStr(safeTrek.difficulty)}</DetailValue>
              </DetailItem>
            </DetailGrid>
          </CardBody>
        </Card>

        <Card variants={itemVariants}>
          <CardHead>
            <CardIconWrap><FiCalendar size={18} /></CardIconWrap>
            <CardTitle>Booking Details</CardTitle>
          </CardHead>
          <CardBody>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Start Date</DetailLabel>
                <DetailValue>{safeDate(startDate)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Participants</DetailLabel>
                <DetailValue>{participantCount} person(s)</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Booked On</DetailLabel>
                <DetailValue>{safeDate(booking.createdAt)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <StatusBadge $type={statusType}>
                    {statusType === 'success' && <FiCheckCircle size={12} />}
                    {safeStr(booking.status, 'Pending').charAt(0).toUpperCase() + safeStr(booking.status, 'Pending').slice(1)}
                  </StatusBadge>
                </DetailValue>
              </DetailItem>
            </DetailGrid>
          </CardBody>
        </Card>

        <Card variants={itemVariants}>
          <CardHead>
            <CardIconWrap><FiUsers size={18} /></CardIconWrap>
            <CardTitle>Participants ({participantCount})</CardTitle>
          </CardHead>
          <CardBody>
            {safeParticipants.length > 0 ? (
              <ParticipantGrid>
                {safeParticipants.map((p, i) => (
                  <ParticipantCard key={p.participantId || i} $primary={p.isPrimaryBooker}>
                    {p.isPrimaryBooker && <PrimaryBadge>Primary</PrimaryBadge>}
                    <ParticipantNum>Participant {i + 1}</ParticipantNum>
                    <ParticipantName $hasBadge={p.isPrimaryBooker}>
                      {safeStr(p.name, `Participant ${i + 1}`)}
                    </ParticipantName>
                    {p.email && (
                      <ParticipantDetail>
                        <FiUser /> {p.email}
                      </ParticipantDetail>
                    )}
                    {p.age && (
                      <ParticipantDetail>
                        <FiClock /> Age: {p.age}
                      </ParticipantDetail>
                    )}
                    {p.emergencyContact && (
                      <ParticipantDetail>
                        <FiPhone /> Emergency: {p.emergencyContact}
                      </ParticipantDetail>
                    )}
                  </ParticipantCard>
                ))}
              </ParticipantGrid>
            ) : (
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Participants</DetailLabel>
                  <DetailValue>{participantCount} person(s)</DetailValue>
                </DetailItem>
                {booking.userName && (
                  <DetailItem>
                    <DetailLabel>Primary Booker</DetailLabel>
                    <DetailValue>{booking.userName}</DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            )}
          </CardBody>
        </Card>

        {fullTrekCost > 0 && (
          <Card variants={itemVariants}>
            <CardHead>
              <CardIconWrap><FiCreditCard size={18} /></CardIconWrap>
              <CardTitle>Payment Breakdown</CardTitle>
            </CardHead>
            <CardBody>
              <SplitCard>
                <SplitItem $paid>
                  <SplitPercent $paid>20%</SplitPercent>
                  <SplitLabel>Paid online<br />Booking deposit</SplitLabel>
                  <SplitAmount $paid>₹{upfrontPaid.toLocaleString('en-IN')}</SplitAmount>
                  <SplitStatus $paid>
                    <FiCheckCircle size={12} />Paid via Razorpay
                  </SplitStatus>
                </SplitItem>
                <SplitItem>
                  <SplitPercent>80%</SplitPercent>
                  <SplitLabel>Pay to organizer<br />On trek day</SplitLabel>
                  <SplitAmount>₹{remaining.toLocaleString('en-IN')}</SplitAmount>
                  <SplitStatus>
                    <FiInfo size={12} />Due to organizer
                  </SplitStatus>
                </SplitItem>
              </SplitCard>

              <DetailGrid>
                {pricePerPerson > 0 && (
                  <DetailItem>
                    <DetailLabel>Price per Person</DetailLabel>
                    <DetailValue>₹{pricePerPerson.toLocaleString('en-IN')}</DetailValue>
                  </DetailItem>
                )}
                {participantCount > 1 && subtotalAmount > 0 && (
                  <DetailItem>
                    <DetailLabel>Subtotal ({participantCount} people)</DetailLabel>
                    <DetailValue>₹{subtotalAmount.toLocaleString('en-IN')}</DetailValue>
                  </DetailItem>
                )}
                {discountApplied > 0 && (
                  <DetailItem>
                    <DetailLabel>
                      Discount {couponData?.code ? `(${couponData.code})` : 'Applied'}
                    </DetailLabel>
                    <DetailValue style={{ color: theme.success }}>
                      −₹{discountApplied.toLocaleString('en-IN')}
                    </DetailValue>
                  </DetailItem>
                )}
                <DetailItem>
                  <DetailLabel>Total Trek Cost</DetailLabel>
                  <DetailValue style={{ fontWeight: 800, fontSize: '1.1rem', color: theme.primary }}>
                    ₹{fullTrekCost.toLocaleString('en-IN')}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Paid Online (20%)</DetailLabel>
                  <DetailValue style={{ color: theme.success }}>
                    ₹{upfrontPaid.toLocaleString('en-IN')}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Balance to Organizer (80%)</DetailLabel>
                  <DetailValue>₹{remaining.toLocaleString('en-IN')}</DetailValue>
                </DetailItem>
                {(booking.paymentId || booking.transactionId || booking.razorpayPaymentId) && (
                  <DetailItem>
                    <DetailLabel>Payment ID</DetailLabel>
                    <DetailValue style={{ fontSize: '0.85rem', fontFamily: 'Courier New, monospace' }}>
                      {booking.paymentId || booking.transactionId || booking.razorpayPaymentId}
                    </DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            </CardBody>
          </Card>
        )}

        {(booking.emergencyName || booking.emergencyContact || booking.emergencyPhone) && (
          <Card variants={itemVariants}>
            <CardHead>
              <CardIconWrap><FiPhone size={18} /></CardIconWrap>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHead>
            <CardBody>
              <DetailGrid>
                {booking.emergencyName && (
                  <DetailItem>
                    <DetailLabel>Name</DetailLabel>
                    <DetailValue>{booking.emergencyName}</DetailValue>
                  </DetailItem>
                )}
                {(booking.emergencyContact || booking.emergencyPhone) && (
                  <DetailItem>
                    <DetailLabel>Contact Number</DetailLabel>
                    <DetailValue>
                      {booking.emergencyContact || booking.emergencyPhone}
                    </DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            </CardBody>
          </Card>
        )}

        {booking.specialRequests && (
          <Card variants={itemVariants}>
            <CardHead>
              <CardIconWrap><FiFileText size={18} /></CardIconWrap>
              <CardTitle>Special Requests</CardTitle>
            </CardHead>
            <CardBody>
              <p style={{ color: theme.textSecondary, fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                {booking.specialRequests}
              </p>
            </CardBody>
          </Card>
        )}

        <TrustNote variants={itemVariants}>
          <FiShield size={18} style={{ color: theme.success, flexShrink: 0, marginTop: '2px' }} />
          <span>
            Your 20% deposit (<strong>₹{upfrontPaid.toLocaleString('en-IN')}</strong>) has been securely
            processed via Razorpay. The remaining 80% (<strong>₹{remaining.toLocaleString('en-IN')}</strong>)
            is payable directly to the trek organizer on your trek day.
          </span>
        </TrustNote>

      </PageBody>

      <ConfirmFooter>
        <ConfirmFooterInner>
          <ConfirmFooterInfo>
            <ConfirmFooterTitle>Booking Reference</ConfirmFooterTitle>
            <ConfirmFooterId>
              {bookingId?.length > 20 ? `${bookingId.substring(0, 20)}…` : bookingId}
            </ConfirmFooterId>
          </ConfirmFooterInfo>
          <ConfirmFooterDivider />
          <ConfirmFooterBtns>
            <BtnConfirmSecondary onClick={() => navigate('/profile')}>
              <FiFileText size={16} /> My Bookings
            </BtnConfirmSecondary>
            <BtnConfirmPrimary onClick={() => navigate('/explore')}>
              Explore Treks <FiChevronRight size={18} />
            </BtnConfirmPrimary>
          </ConfirmFooterBtns>
        </ConfirmFooterInner>
      </ConfirmFooter>

    </PageWrapper>
  );
};

export default BookingConfirmation;