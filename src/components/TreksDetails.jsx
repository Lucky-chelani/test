import React, { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FiClock, FiMapPin, FiCalendar, FiUsers, FiArrowLeft, FiStar, FiCheck, FiX, 
  FiCamera, FiShare2, FiHeart, FiInfo, FiChevronRight, FiChevronDown, FiCompass, 
  FiBookmark, FiDownload, FiPhone, FiMail, FiArrowRight, FiShield, FiMap, FiTarget, 
  FiSun, FiCloud, FiDroplet, FiThermometer, FiMinimize2, FiMaximize2, FiWind, FiImage,
  FiArrowUp, FiHome, FiChevronLeft } from 'react-icons/fi';
import ImageCarousel from './ImageCarousel';
import { FaMountain, FaLeaf, FaWater, FaSnowflake, FaCompass, FaRoute, FaFlag, 
  FaMoneyBillWave, FaShieldAlt, FaMapMarkedAlt, FaRegCalendarAlt, FaRegClock, 
  FaLayerGroup, FaImage, FaRegImages, FaCampground, FaHiking, FaChevronRight, 
  FaQuoteRight, FaStar, FaMapMarkerAlt, FaBinoculars, FaTreeAlt, FaTree, FaCloudSun, 
  FaCloudRain, FaCloudMoon, FaTent, FaFire, FaComment, FaMedal, FaRunning,
  FaMountain as FaMtnSolid, FaLocationArrow, FaUmbrellaBeach, FaRegSnowflake, 
  FaOpencart, FaShoppingBasket, FaShoppingCart, FaAward, FaBuffer } from 'react-icons/fa';
import { BsArrowUpRight } from 'react-icons/bs';
import { FiAlertTriangle } from 'react-icons/fi';
import { getValidImageUrl } from "../utils/images";
import BookingModal from "./BookingModal";
import { saveBooking } from "../utils/bookingService";
import OrganizerCard from "./OrganizerCard";
import Reviews from "./Reviews";

// Global font import for Inter font
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInSlow = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInFast = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInLeftSlow = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-40px);
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRightSlow = keyframes`
  0% {
    opacity: 0;
    transform: translateX(40px);
  }
  30% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
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

const scaleInBounce = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  70% {
    opacity: 1;
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

const shimmerLight = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const floatSmall = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const rotateSlowly = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.4);
  }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const revealWidth = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const revealScale = keyframes`
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const dash = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

const slideFromBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const parallaxScroll = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-80px); }
`;

const wavyPath = keyframes`
  0% { d: path('M0,96 C200,100 300,20 500,100 C700,180 800,100 1000,100 L1000,200 L0,200 Z'); }
  50% { d: path('M0,100 C200,180 300,100 500,20 C700,100 800,180 1000,100 L1000,200 L0,200 Z'); }
  100% { d: path('M0,96 C200,100 300,20 500,100 C700,180 800,100 1000,100 L1000,200 L0,200 Z'); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const drawCircle = keyframes`
  from {
    stroke-dashoffset: 283;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

// Animation timing utilities
const staggeredAnimation = (delay = 0) => css`
  opacity: 0;
  animation: ${fadeIn} 0.7s ease forwards;
  animation-delay: ${delay}s;
`;

// Redefining the core components with modern immersive design
// MODERN DESIGN STYLED COMPONENTS

// Animations
const shimmerEffect = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const parallaxMove = keyframes`
  0% { transform: translateY(0) scale(1.05); }
  100% { transform: translateY(-80px) scale(1.05); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

// Modern page container with your website's aesthetic
const ModernPageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #0f3460 70%, #1a1a2e 100%);
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #e2e8f0;
  z-index: 1;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(90, 112, 183, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(66, 160, 75, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 210, 191, 0.04) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A70B7' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    pointer-events: none;
    z-index: 1;
  }
`;

// Modern header with your website's glass-morphism aesthetic
const ModernHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.isScrolled 
    ? 'rgba(10, 10, 26, 0.95)' 
    : 'linear-gradient(180deg, rgba(10, 10, 26, 0.8) 0%, rgba(10, 10, 26, 0.4) 100%)'};
  backdrop-filter: blur(20px);
  padding: ${props => props.isScrolled ? '0.8rem 0' : '1.5rem 0'};
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${props => props.isScrolled ? '0 4px 32px rgba(0, 0, 0, 0.3)' : 'none'};
  border-bottom: ${props => props.isScrolled ? '1px solid rgba(90, 112, 183, 0.2)' : 'none'};
  transform: translateZ(0);
  will-change: transform, background, box-shadow, padding;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 210, 191, 0.3), transparent);
    opacity: ${props => props.isScrolled ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.isScrolled ? '0.7rem 0' : '1.25rem 0'};
  }
`;

const HeaderInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 991px) {
    padding: 0 1.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackBtn = styled.button`
  background: ${props => props.isScrolled ? 'rgba(90, 112, 183, 0.12)' : 'rgba(255, 255, 255, 0.16)'};
  border: 1px solid ${props => props.isScrolled ? 'rgba(90, 112, 183, 0.2)' : 'rgba(255, 255, 255, 0.12)'};
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.isScrolled ? '#5A70B7' : 'white'};
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-3px);
    background: ${props => props.isScrolled ? 'rgba(90, 112, 183, 0.18)' : 'rgba(255, 255, 255, 0.25)'};
    box-shadow: 0 8px 25px rgba(90, 112, 183, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTrekTitle = styled.h1`
  color: ${props => props.isScrolled ? '#ffffff' : 'white'};
  font-size: ${props => props.isScrolled ? '1.1rem' : '1.3rem'};
  font-weight: 700;
  margin: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  text-shadow: ${props => props.isScrolled ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.15)'};
  background: ${props => props.isScrolled ? 'linear-gradient(135deg, #ffffff 0%, #FFD2BF 100%)' : 'none'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: ${props => props.isScrolled ? 'transparent' : 'white'};
  background-clip: text;
  
  @media (max-width: 991px) {
    font-size: ${props => props.isScrolled ? '1rem' : '1.2rem'};
    max-width: 230px;
  }
  
  @media (max-width: 576px) {
    font-size: ${props => props.isScrolled ? '0.95rem' : '1.1rem'};
    max-width: 180px;
  }
`;

const HeaderTrekSubtitle = styled.div`
  color: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)'};
  font-size: ${props => props.isScrolled ? '0.8rem' : '0.85rem'};
  font-weight: 500;
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  text-shadow: ${props => props.isScrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
  
  svg {
    opacity: 0.9;
  }
  
  @media (max-width: 991px) {
    font-size: ${props => props.isScrolled ? '0.75rem' : '0.8rem'};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionBtn = styled.button`
  background: ${props => props.isScrolled ? 'rgba(90, 112, 183, 0.08)' : 'rgba(255, 255, 255, 0.16)'};
  border: ${props => props.isScrolled ? '1px solid rgba(90, 112, 183, 0.2)' : '1px solid rgba(255, 255, 255, 0.12)'};
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${props => props.isScrolled ? '#5A70B7' : 'white'};
  backdrop-filter: blur(10px);
  font-size: 1.05rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  
  &:hover {
    background: ${props => props.isScrolled ? 'rgba(90, 112, 183, 0.15)' : 'rgba(255, 255, 255, 0.25)'};
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(90, 112, 183, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 576px) {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }
`;

const BookNowBtn = styled.button`
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 100%);
  color: white;
  border: none;
  height: 42px;
  padding: 0 1.6rem;
  border-radius: 21px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 8px 20px rgba(66, 160, 75, 0.25);
  margin-left: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(66, 160, 75, 0.35);
    background: linear-gradient(135deg, #358A3D 0%, #42A04B 100%);
    
    &:before {
      transform: translateX(100%);
    }
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
    z-index: 2;
  }
  
  span {
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Modern Hero Section with Parallax Effect
const ModernHero = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  
  @media (max-width: 768px) {
    min-height: 600px;
    height: 90vh;
  }
  
  @media (max-width: 576px) {
    min-height: 550px;
  }
`;

const HeroParallax = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 115%;
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  transition: transform 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const HeroImgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.1);
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s ease;
  filter: ${props => props.isLoading ? 'blur(30px) brightness(1.1)' : 'blur(0px)'};
  will-change: transform;
  
  &.loaded {
    transform: scale(1.03);
    animation: ${floatAnimation} 15s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(15, 15, 35, 0.65) 0%,
      rgba(15, 15, 35, 0.45) 40%,
      rgba(15, 15, 35, 0.75) 80%,
      rgba(15, 15, 35, 0.9) 100%
    );
    z-index: 2;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(167, 139, 250, 0.1) 0%,
      rgba(139, 92, 246, 0.05) 50%,
      rgba(124, 58, 237, 0.08) 100%
    );
    z-index: 1;
  }
  
  .hero-img-legacy {
    width: 100%;
    height: 100%;
    background-image: url(${props => props.image || 'https://via.placeholder.com/800x600?text=Trek+Image+Coming+Soon'});
    background-size: cover;
    background-position: center;
  }
`;

const HeroVignette = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.6);
  pointer-events: none;
`;

const HeroWave = styled.div`
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 180px;
  z-index: 3;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%230f0f23" fill-opacity="1" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,208C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>');
  background-size: cover;
  background-position: center;
  transform: translateY(1px);
  filter: drop-shadow(0px -10px 15px rgba(0, 0, 0, 0.05));
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: linear-gradient(to bottom, rgba(249, 250, 252, 0), rgba(249, 250, 252, 0.8));
    z-index: -1;
  }
`;

const HeroContentWrapper = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2.5rem;
  margin-top: 7vh;
  
  @media (max-width: 991px) {
    padding: 0 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
    margin-top: 4vh;
  }
`;

const LocationTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.75rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: 0.3s;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  
  svg {
    color: #22c55e;
    font-size: 1.25rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    
    svg {
      font-size: 1.15rem;
    }
  }
`;

const HeroBadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.variant === 'primary' ? 'rgba(90, 112, 183, 0.85)' : 
    props.variant === 'secondary' ? 'rgba(66, 160, 75, 0.85)' : 
    props.variant === 'orange' ? 'rgba(255, 210, 191, 0.85)' : 
    'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.variant === 'orange' ? '#1a1a2e' : 'white'};
  padding: 0.6rem 1.3rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: ${props => 0.4 + (props.index * 0.1)}s;
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  svg {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1.1rem;
    font-size: 0.8rem;
    
    svg {
      font-size: 1rem;
    }
  }
`;

const HeroHeading = styled.h1`
  color: white;
  font-size: 5rem;
  font-weight: 800;
  margin: 0 0 1.75rem 0;
  max-width: 1000px;
  line-height: 1.05;
  letter-spacing: -1px;
  opacity: 0;
  animation: ${fadeInLeft} 0.9s forwards;
  animation-delay: 0.5s;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 25px rgba(90, 112, 183, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #FFD2BF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  span {
    color: #42A04B;
    position: relative;
    display: inline-block;
    -webkit-text-fill-color: #42A04B;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 15px;
      left: 0;
      width: 100%;
      height: 12px;
      background: rgba(66, 160, 75, 0.25);
      z-index: -1;
      border-radius: 10px;
    }
  }
  
  @media (max-width: 1200px) {
    font-size: 4.25rem;
  }
  
  @media (max-width: 991px) {
    font-size: 3.5rem;
    letter-spacing: -0.5px;
    
    span::after {
      height: 10px;
      bottom: 10px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
    margin-bottom: 1.5rem;
    
    span::after {
      height: 8px;
      bottom: 8px;
    }
  }
  
  @media (max-width: 576px) {
    font-size: 2.25rem;
    
    span::after {
      height: 6px;
      bottom: 6px;
    }
  }
`;

const HeroDesc = styled.p`
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.35rem;
  font-weight: 400;
  margin: 0 0 2.5rem 0;
  max-width: 650px;
  line-height: 1.6;
  opacity: 0;
  animation: ${fadeInLeft} 0.9s forwards;
  animation-delay: 0.7s;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 991px) {
    font-size: 1.25rem;
    margin-bottom: 2.25rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 1.75rem;
    line-height: 1.5;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${fadeInUp} 0.8s forwards;
  animation-delay: 0.9s;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-bottom: 2.5rem;
  }
`;

const HeroPrimaryBtn = styled.button`
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 100%);
  color: white;
  border: none;
  height: 54px;
  padding: 0 2.25rem;
  border-radius: 27px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(66, 160, 75, 0.35);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(66, 160, 75, 0.4);
    background: linear-gradient(135deg, #358A3D 0%, #42A04B 100%);
    
    &:before {
      transform: translateX(100%);
    }
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    font-size: 1.2rem;
    z-index: 2;
    transition: transform 0.3s ease;
  }
  
  span {
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 50px;
    font-size: 1rem;
  }
`;

const HeroSecondaryBtn = styled.button`
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 54px;
  padding: 0 2.25rem;
  border-radius: 27px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    
    svg {
      transform: translateY(-2px);
    }
  }
  
  svg {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 50px;
    font-size: 1rem;
  }
`;

const HeroStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: 1.1s;
  
  @media (max-width: 991px) {
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// StatCard needs to be defined before StatIcon since StatIcon references StatCard
const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  padding: 1.75rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(${props => props.colorRgb || '90, 112, 183'}, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.color || '#5A70B7'};
    opacity: 0.8;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(${props => props.colorRgb || '90, 112, 183'}, 0.08) 0%, 
      rgba(${props => props.colorRgb || '90, 112, 183'}, 0) 20%);
    z-index: 0;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(${props => props.colorRgb || '90, 112, 183'}, 0.15),
                0 8px 16px rgba(${props => props.colorRgb || '90, 112, 183'}, 0.08);
    background: rgba(30, 41, 59, 0.8);
    
    &:after {
      opacity: 1;
    }
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.color || '#5A70B7'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  position: relative;
  box-shadow: 0 8px 15px rgba(${props => props.colorRgb || '90, 112, 183'}, 0.25);
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.25) 0%, 
      rgba(255, 255, 255, 0) 70%);
    border-radius: inherit;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    top: 12px;
    left: 12px;
  }
  
  svg {
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2));
    transition: all 0.4s ease;
  }
  
  ${StatCard}:hover & {
    transform: scale(1.1) rotate(-5deg);
    box-shadow: 0 12px 20px rgba(${props => props.colorRgb || '90, 112, 183'}, 0.3);
    
    svg {
      transform: scale(1.1);
    }
  }
  
  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 1.15rem;
    border-radius: 12px;
    
    &:after {
      width: 6px;
      height: 6px;
      top: 10px;
      left: 10px;
    }
  }
`;

const StatText = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 0.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.15rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`;

// Modern content area
const ModernContent = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 4rem 0 6rem;
  z-index: 5;
  box-shadow: 0 -50px 100px -20px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(167, 139, 250, 0), 
      rgba(167, 139, 250, 0.2) 30%, 
      rgba(167, 139, 250, 0.2) 70%, 
      rgba(167, 139, 250, 0)
    );
  }
  
  @media (max-width: 768px) {
    padding: 3rem 0 5rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2.5rem;
  
  @media (max-width: 991px) {
    padding: 0 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -80px;
    left: 0;
    width: 2px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(167, 139, 250, 0), rgba(167, 139, 250, 0.3));
    border-radius: 10px;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -80px;
    right: 380px;
    width: 2px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(34, 197, 94, 0), rgba(34, 197, 94, 0.3));
    border-radius: 10px;
    
    @media (max-width: 1200px) {
      right: 320px;
    }
    
    @media (max-width: 991px) {
      display: none;
    }
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }
  
  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    
    &:before {
      display: none;
    }
  }
`;

const MainContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: -40px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(34, 197, 94, 0), 
      rgba(34, 197, 94, 0.1) 10%, 
      rgba(34, 197, 94, 0.2) 50%,
      rgba(34, 197, 94, 0.1) 90%,
      rgba(34, 197, 94, 0)
    );
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

// Section Styles
const Section = styled.section`
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2), 0 1.5px 8px rgba(90, 112, 183, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2.5rem;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #5A70B7, #42A04B, #FFD2BF);
    opacity: 0;
    transform: scaleX(0.3);
    transform-origin: center;
    transition: all 0.4s ease;
    border-radius: 4px 4px 0 0;
  }
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25), 0 5px 15px rgba(90, 112, 183, 0.2);
    transform: translateY(-5px);
    background: rgba(30, 41, 59, 0.7);
    
    &:before {
      opacity: 1;
      transform: scaleX(1);
    }
  }
`;

const SectionHeader = styled.div`
  padding: 2.25rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 2.5rem;
    right: 2.5rem;
    height: 1px;
    background: linear-gradient(to right,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0.15) 80%,
      rgba(255, 255, 255, 0.1)
    );
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 1.75rem 1.5rem;
    
    &:after {
      left: 1.5rem;
      right: 1.5rem;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #FFD2BF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  &:before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50%;
    width: 4px;
    height: 28px;
    background: #42A04B;
    border-radius: 2px;
    transform: translateY(-50%);
    opacity: 0.8;
  }
  
  svg {
    color: #5A70B7;
    filter: drop-shadow(0px 2px 4px rgba(90, 112, 183, 0.3));
    font-size: 1.4em;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    &:before {
      height: 22px;
      left: -12px;
    }
  }
`;

const SectionBody = styled.div`
  padding: 2.5rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 5%;
    right: 5%;
    height: 1px;
    background: linear-gradient(to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.05) 20%,
      rgba(255, 255, 255, 0.05) 80%,
      rgba(255, 255, 255, 0)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${Section}:hover &:before {
    opacity: 1;
  }
  
  p {
    color: #cbd5e1;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
  }
  
  ul, ol {
    color: #cbd5e1;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    
    li {
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.75rem 1.5rem;
    
    p {
      font-size: 1rem;
      margin-bottom: 1.25rem;
    }
  }
`;

// Quick Stats Section
const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  transform: translateY(-60px);
  margin-bottom: -30px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.05) 20%,
      rgba(0, 0, 0, 0.05) 80%,
      rgba(0, 0, 0, 0)
    );
  }
  
  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
    transform: translateY(-40px);
    margin-bottom: -20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    transform: translateY(-20px);
    margin-bottom: -10px;
  }
`;

// Detailed Description Components
const DetailedDescription = styled.div`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 1rem;
  
  p {
    margin-bottom: 1rem;
    text-align: justify;
    color: rgba(255, 255, 255, 0.85);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AvailableMonths = styled.div`
  p {
    margin-bottom: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Month = styled.div`
  padding: 12px;
  text-align: center;
  background: ${props => props.isAvailable ? 'rgba(66, 160, 75, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 8px;
  font-weight: ${props => props.isAvailable ? '600' : 'normal'};
  color: ${props => props.isAvailable ? '#42A04B' : 'rgba(255, 255, 255, 0.6)'};
  border: 1px solid ${props => props.isAvailable ? 'rgba(66, 160, 75, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
`;

// Timeline Components
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  padding-left: 2rem;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 9px;
    height: 100%;
    width: 2px;
    background: rgba(90, 112, 183, 0.3);
  }
  
  @media (max-width: 768px) {
    padding-left: 1.5rem;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: -2rem;
    top: 0.5rem;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #5A70B7;
    background: rgba(30, 41, 59, 0.9);
    
    @media (max-width: 768px) {
      left: -1.5rem;
      width: 16px;
      height: 16px;
    }
  }
  
  &:hover:before {
    background: #5A70B7;
  }
`;

const TimelineContent = styled.div`
  background: rgba(30, 41, 59, 0.7);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(30, 41, 59, 0.9);
    transform: translateY(-2px);
  }
`;

const TimelineTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
`;

const TimelineDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
`;

const TimelineLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
`;

const TimelineDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const TimelineDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    color: rgba(255, 255, 255, 0.6);
  }
`;

// Gallery Components
const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryImage = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  padding-bottom: 70%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.07);
    box-shadow: 0 8px 32px rgba(90,112,183,0.18);
    z-index: 2;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover:after {
    opacity: 1;
  }
`;

// Features Components
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    background: rgba(30, 41, 59, 0.8);
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.included ? 'rgba(66, 160, 75, 0.15)' : 'rgba(255, 87, 87, 0.15)'};
  color: ${props => props.included ? '#42A04B' : '#FF5757'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  font-size: 1rem;
  color: ${props => props.included ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};
  line-height: 1.4;
  ${props => props.included ? '' : 'text-decoration: line-through;'}
`;

// Reviews Components
const ReviewsSummary = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const RatingBig = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 1.5rem;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const RatingNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: #5A70B7;
  line-height: 1;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 3px;
  margin: 0.75rem 0;
`;

const RatingText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const RatingBreakdown = styled.div`
  flex: 1;
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    background: rgba(30, 41, 59, 0.8);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReviewerAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5A70B7 0%, #42A04B 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ReviewerDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewerName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
`;

const ReviewDate = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 3px;
`;

const ReviewText = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
`;

// Sidebar
const Sidebar = styled.aside`
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  
  @media (max-width: 991px) {
    order: -1;
    margin-bottom: 2rem;
  }
`;

const BookingCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(90, 112, 183, 0.2), 0 2px 8px rgba(66, 160, 75, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 100px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);
  
  &:before {
    content: '';
    position: absolute;
    top: -15px;
    left: 20px;
    right: 20px;
    height: 15px;
    background: linear-gradient(to right,
      rgba(66, 160, 75, 0) 0%,
      rgba(66, 160, 75, 0.2) 50%,
      rgba(66, 160, 75, 0) 100%
    );
    border-radius: 50%;
    filter: blur(5px);
  }
  
  &:hover {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 5px 20px rgba(90, 112, 183, 0.3);
    background: rgba(30, 41, 59, 0.9);
  }
`;

const BookingHeader = styled.div`
  background: linear-gradient(135deg, #5A70B7 0%, #42A04B 100%);
  padding: 2.25rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -10%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 1;
    animation: ${pulseAnimation} 8s infinite alternate;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -10%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 1;
    animation: ${pulseAnimation} 12s infinite alternate-reverse;
  }
  
  &:before, &:after {
    mix-blend-mode: overlay;
  }
  
  background-image: 
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
    radial-gradient(circle at 20% 150%, rgba(255, 210, 191, 0.12) 0%, rgba(255, 210, 191, 0) 60%);
`;

const PriceTag = styled.div`
  position: relative;
  z-index: 2;
`;

const Price = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  display: flex;
  align-items: flex-start;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: -10px;
    top: 55%;
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 2px;
    transform: translateY(-50%) translateX(-100%);
  }
  
  &:after {
    content: '';
    position: absolute;
    right: -10px;
    top: 55%;
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 2px;
    transform: translateY(-50%) translateX(100%);
  }
  
  span {
    font-size: 1rem;
    font-weight: 400;
    margin-left: 0.5rem;
    opacity: 0.9;
    margin-top: 0.75rem;
    text-shadow: none;
  }
  
  @media (max-width: 576px) {
    font-size: 3rem;
    
    &:before, &:after {
      width: 30px;
      height: 3px;
    }
  }
`;

const PriceCaption = styled.div`
  color: #ffffff;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const BookingBody = styled.div`
  padding: 2rem;
`;

const BookingDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #a78bfa;
    font-size: 0.95rem;
  }
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #e2e8f0;
`;

// BigStat components
const BigStatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const BigStatLabel = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const BookingButton = styled.button`
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.25);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    box-shadow: 0 12px 25px rgba(167, 139, 250, 0.35);
    
    &:before {
      transform: translateX(100%);
    }
    
    svg {
      transform: translateX(5px);
    }
  }
  
  svg {
    font-size: 1.3rem;
    transition: transform 0.3s ease;
    z-index: 2;
  }
`;

const BookingActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const BookingActionButton = styled.button`
  flex: 1;
  height: 46px;
  background: rgba(167, 139, 250, 0.1);
  color: #a78bfa;
  border: none;
  border-radius: 23px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(167, 139, 250, 0.2);
    transform: translateY(-3px);
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

// --- LOADING & ERROR COMPONENTS ---
const ModernLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
  background-image: linear-gradient(
    to bottom,
    rgba(167, 139, 250, 0.05) 0%,
    rgba(167, 139, 250, 0.01) 100%
  );
`;
const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;
const LoadingLogo = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
`;
const LoadingMessage = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #5A70B7, #42A04B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
const LoadingBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(90, 112, 183, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;
const LoadingProgress = styled.div`
  height: 100%;
  width: 30%;
  background: linear-gradient(to right, #5A70B7, #42A04B);
  border-radius: 4px;
  animation: ${shimmerEffect} 1.5s infinite;
  background-size: 200% 100%;
`;
const LoadingHint = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 280px;
  line-height: 1.5;
`;
const ModernErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 500px;
  padding: 3rem;
  text-align: center;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorIconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  color: #a78bfa;
`;

const ErrorHeading = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
`;

const ErrorText = styled.p`
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
  line-height: 1.7;
`;

const ErrorDescription = styled.div`
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 2.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(15, 15, 35, 0.6);
  border-radius: 8px;
  display: inline-block;
`;

const ErrorCodeBlock = styled.span`
  font-family: monospace;
  color: #a78bfa;
  font-weight: 600;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1.5rem;
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

const ErrorPrimaryButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(135deg, #358A3D 0%, #42A04B 100%);
    transform: translateY(-2px);
  }
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const ErrorSecondaryButton = styled.button`
  padding: 0.75rem 2rem;
  background: rgba(30, 41, 59, 0.6);
  color: #5A70B7;
  border: 1px solid rgba(90, 112, 183, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(30, 41, 59, 0.8);
    transform: translateY(-2px);
  }
  @media (max-width: 576px) {
    width: 100%;
  }
`;
// --- END LOADING & ERROR COMPONENTS ---

// --- UI IMPROVEMENTS START ---
// 1. Add subtle animated overlay to Hero section
const AnimatedOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 3;
  background: linear-gradient(120deg, rgba(90,112,183,0.08) 0%, rgba(66,160,75,0.10) 100%);
  animation: ${gradientMove} 8s ease-in-out infinite;
  opacity: 0.7;
`;
// --- UI IMPROVEMENTS END ---

// --- GALLERY MODAL STYLES START ---
const galleryModal = `
  .gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .gallery-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .gallery-modal-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .gallery-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-size: 24px;
    z-index: 10;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .gallery-close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .gallery-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-size: 32px;
    z-index: 10;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .gallery-nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  .gallery-prev-btn {
    left: 20px;
  }

  .gallery-next-btn {
    right: 20px;
  }

  .gallery-image-container {
    position: relative;
    width: 90%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .gallery-main-image {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.4s ease;
  }

  .gallery-main-image.active {
    opacity: 1;
    transform: scale(1);
  }

  .gallery-counter {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(10px);
    z-index: 10;
  }

  .gallery-thumbnails {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    max-width: 90%;
    overflow-x: auto;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    scrollbar-width: none;
    -ms-overflow-style: none;
    z-index: 10;
  }

  .gallery-thumbnails::-webkit-scrollbar {
    display: none;
  }

  .gallery-thumbnail {
    background: none;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    overflow: hidden;
    width: 60px;
    height: 60px;
  }

  .gallery-thumbnail:hover {
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  .gallery-thumbnail.active {
    border-color: #4ECDC4;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  }

  .gallery-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .gallery-modal-content {
      padding: 10px;
    }

    .gallery-image-container {
      width: 95%;
      height: 70%;
    }

    .gallery-nav-btn {
      width: 50px;
      height: 50px;
      font-size: 24px;
    }

    .gallery-prev-btn {
      left: 10px;
    }

    .gallery-next-btn {
      right: 10px;
    }

    .gallery-close-btn {
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .gallery-counter {
      bottom: 90px;
      font-size: 12px;
      padding: 6px 12px;
    }

    .gallery-thumbnails {
      bottom: 10px;
      max-width: 95%;
      padding: 8px;
    }

    .gallery-thumbnail {
      width: 50px;
      height: 50px;
    }
  }
`;

// Apply gallery modal styles globally
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = galleryModal;
  document.head.appendChild(styleSheet);
}
// --- GALLERY MODAL STYLES END ---

// Modern Page Component
export default function TrekDetails() {  
  const { id } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackData, setFallbackData] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const parallaxRef = useRef(null);
  const heroRef = useRef(null);
  
  // Check authentication status - this must be called before any conditional returns
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update navigation bar
      if (window.scrollY > 80) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
      
      // Handle parallax effect
      if (parallaxRef.current && heroRef.current) {
        const scrollPos = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        if (scrollPos <= heroHeight) {
          const parallaxValue = scrollPos * 0.4;
          parallaxRef.current.style.transform = `translateY(${parallaxValue}px)`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
    // Preload trek images
  useEffect(() => {
    if (trek || fallbackData) {
      console.log("Trek details - image data:", trek?.imageUrls, trek?.image);
      
      // First check for multiple images - make sure we have valid URLs
      const imageUrls = Array.isArray(trek?.imageUrls) 
        ? trek.imageUrls.filter(url => url && typeof url === 'string')
        : [];
      
      // Fall back to single image if no imageUrls array
      const singleImgSrc = trek?.image || fallbackData?.image;
      
      if (imageUrls.length > 0) {
        // Preload first image (cover image)
        const coverImg = new Image();
        coverImg.src = getValidImageUrl(imageUrls[0]);
        coverImg.onload = () => setImageLoaded(true);
        
        // Preload other images in the background
        imageUrls.slice(1).forEach(url => {
          const img = new Image();
          img.src = getValidImageUrl(url);
        });
        
        // Fall back to setting imageLoaded after a timeout
        const timer = setTimeout(() => setImageLoaded(true), 3000);
        return () => clearTimeout(timer);
      } else if (singleImgSrc) {
        // Legacy single image handling
        const img = new Image();
        img.src = getValidImageUrl(singleImgSrc);
        img.onload = () => setImageLoaded(true);
        
        const timer = setTimeout(() => setImageLoaded(true), 3000);
        return () => clearTimeout(timer);
      } else {
        // If there's no image source, just mark as loaded
        setImageLoaded(true);
      }
    }
  }, [trek, fallbackData]);
  
  // Create fallback data based on ID
  const createFallbackTrek = useCallback(() => {
    const fallbackName = id.replace(/-/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      id: id,
      title: fallbackName,
      image: `https://source.unsplash.com/1600x900/?mountains,trek,${id.replace(/-/g, '+')}`,
      description: `Experience the beautiful ${fallbackName} trek with stunning views and challenging paths. This adventure will take you through diverse landscapes and provide unforgettable memories.`,
      days: Math.floor(Math.random() * 8) + 3,
      difficulty: ["Easy", "Moderate", "Difficult"][Math.floor(Math.random() * 3)],
      location: "Mountain Region",
      country: "Nepal",
      season: "Year-round",
      price: `₹${(Math.floor(Math.random() * 9000) + 3000)}`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 10,
      capacity: `${Math.floor(Math.random() * 15) + 5}`,
      altitude: `${Math.floor(Math.random() * 4000) + 1000}m`,
    };
  }, [id]);
  
  // Initialize fallback data
  useEffect(() => {
    setFallbackData(createFallbackTrek());
  }, [createFallbackTrek]);// Create sample reviews
  const generateSampleReviews = useCallback((trekTitle) => {
    const reviewTexts = [
      `Amazing experience! ${trekTitle} exceeded all my expectations. The guides were knowledgeable and the views were breathtaking.`,
      `${trekTitle} was the highlight of our vacation. Challenging at times but absolutely worth every step. Would highly recommend!`,
      `Beautiful trek through diverse landscapes. The organization was perfect and everything went smoothly.`,
      `Good trek overall. Some parts were more difficult than advertised, but the scenery made up for it.`,
      `Unforgettable journey through ${trekTitle}. The local food and camping spots were fantastic. Can't wait to come back!`
    ];
    
    const names = ["John D.", "Sarah M.", "Michael T.", "Emily R.", "David L."];
    const dates = ["2 months ago", "3 weeks ago", "5 months ago", "1 month ago", "2 weeks ago"];
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `rev-${i}`,
      author: names[i],
      date: dates[i],
      rating: 4 + (i % 2),
      text: reviewTexts[i]
    }));
  }, []);
  
  // Fetch trek data from Firebase with fallback options
  useEffect(() => {
    console.log("TrekDetails: Fetching trek with ID:", id);
    let isMounted = true;
    
    const loadingTimeout = setTimeout(() => {
      if (loading && isMounted) {
        console.log("Trek loading timeout - using fallback data");
        if (fallbackData) {
          setTrek(fallbackData);
          setLoading(false);
        }
      }
    }, 8000);
    
    const fetchTrekData = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        const trekRef = doc(db, "treks", id);
        const trekSnap = await getDoc(trekRef);
        
        if (!isMounted) return;
        
        if (trekSnap.exists()) {
          const trekData = { id: trekSnap.id, ...trekSnap.data() };
          
          try {
            trekData.reviewsData = generateSampleReviews(trekData.title);
            
            const reviewsQuery = query(collection(db, "reviews"), where("trekId", "==", id));
            const reviewsSnap = await getDocs(reviewsQuery);
            
            if (!reviewsSnap.empty) {
              const reviewsData = reviewsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              trekData.reviewsData = reviewsData;
            }
          } catch (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
          }
          
          if (isMounted) {
            clearTimeout(loadingTimeout);
            setTrek(trekData);
            setLoading(false);
          }
        } else {
          try {
            const treksRef = collection(db, "treks");
            const q = query(treksRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);
            
            if (!isMounted) return;
            
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              const trekData = { id: doc.id, ...doc.data() };
              trekData.reviewsData = generateSampleReviews(trekData.title);
              
              clearTimeout(loadingTimeout);
              setTrek(trekData);
              setLoading(false);
            } else {
              const treksSnapshot = await getDocs(treksRef);
              
              if (!isMounted) return;
              
              if (!treksSnapshot.empty) {
                let foundTrek = null;
                
                treksSnapshot.forEach((doc) => {
                  const data = doc.data();
                  
                  if (doc.id === id || data.id === id || 
                      (data.title && data.title.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase())) {
                    foundTrek = { id: doc.id, ...data };
                  }
                });
                
                if (foundTrek) {
                  foundTrek.reviewsData = generateSampleReviews(foundTrek.title);
                  clearTimeout(loadingTimeout);
                  setTrek(foundTrek);
                  setLoading(false);
                } else {
                  console.log("No matching trek found, using fallback data");
                  clearTimeout(loadingTimeout);
                  setTrek(fallbackData);
                  setLoading(false);
                }
              } else {
                clearTimeout(loadingTimeout);
                setTrek(fallbackData);
                setLoading(false);
              }
            }
          } catch (error) {
            console.error("Error in trek search:", error);
            if (isMounted) {
              clearTimeout(loadingTimeout);
              setTrek(fallbackData);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching trek:", err);
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setTrek(fallbackData);
          setLoading(false);
          setError("Could not load trek details. Please try again later.");
        }
      }
    };
    
    fetchTrekData();
    
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [id, fallbackData, generateSampleReviews]); // Removed loading from dependencies to prevent infinite loop
    
  // Create sample itinerary based on days
  const generateItinerary = useCallback((days, title) => {
    const activities = [
      "Start with an early morning hike through mountain trails",
      "Explore local landmarks and scenic viewpoints",
      "Trek through diverse mountain paths with stunning views",
      "Visit natural hot springs and mountain villages",
      "Cross suspension bridges over deep valleys",
      "Camp beside crystal clear alpine lakes",
      "Reach panoramic viewpoints at high altitudes",
      "Descend through ancient forest trails",
      "Discover hidden waterfalls and wildlife",
      "Visit traditional villages and return to base"
    ];
    
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? `Begin the ${title} adventure` : 
             i === days - 1 ? "Final day and return journey" :
             `Day ${i + 1}: Mountain exploration`,
      description: activities[i % activities.length]
    }));
  }, []);
  
  // Generate highlights
  const generateHighlights = useCallback((title) => [
    `Spectacular views from ${title} peaks`,
    "Diverse mountain flora and wildlife",
    "Expert guides and safety equipment",
    "Comfortable mountain accommodations",
    "Cultural immersion with local communities",
    "Authentic mountain cuisine",
    "Photography opportunities",
    "Adventure activities and exploration"
  ], []);

  // Generate included items
  const getIncludedItems = useCallback(() => [
    "Professional mountain guide",
    "All accommodation during trek",
    "Meals as per itinerary",
    "Transportation during trek",
    "Entry fees and permits",
    "Safety equipment provided",
    "First aid and emergency support",
    "Trekking insurance coverage"
  ], []);

  // Generate excluded items
  const getExcludedItems = useCallback(() => [
    "International flights",
    "Personal travel insurance",
    "Personal expenses and tips",
    "Alcoholic beverages",
    "Personal equipment rental",
    "Emergency evacuation costs"
  ], []);
  
  // Determine appropriate icon for season
  const getSeasonIcon = (season) => {
    if (!season) return <FaLeaf />;
    
    const s = season.toLowerCase();
    if (s.includes("winter") || s.includes("snow")) return <FaSnowflake />;
    if (s.includes("summer")) return <FaMountain />;
    if (s.includes("spring")) return <FaLeaf />;
    if (s.includes("monsoon") || s.includes("rain")) return <FaWater />;    return <FaLeaf />;
  };  
  
  // Format price if needed  
  const formatPrice = (price) => {
    if (!price) return "₹0";
    if (typeof price === "number") return `₹${price}`;
    if (typeof price === "string") {
      // Replace dollar sign with rupee symbol if present, or add rupee symbol if not
      const formattedPrice = price.replace(/^\$/, "");
      return formattedPrice.startsWith("₹") ? formattedPrice : `₹${formattedPrice}`;
    }
    return "₹0";
  };
  
  // Get numeric price for calculations
  const getNumericPrice = (price) => {
    if (!price) return 0;
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      // Remove both dollar and rupee symbols as well as any commas
      const numericPrice = parseFloat(price.replace(/^[$₹]/, "").replace(/,/g, ""));
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };
  
  // Function to handle share button click
  const handleShareButtonClick = () => {
    if (navigator.share) {
      navigator.share({
        title: trekTitle,
        text: 'Check out this amazing trek!',
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };
  
  // Gallery modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Function to handle gallery image click
  const handleGalleryImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryModalOpen(true);
  };
  
  // Function to navigate to previous image
  const goToPreviousImage = () => {
    const images = trek?.imageUrls?.filter(url => url && typeof url === 'string') || [];
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  // Function to navigate to next image
  const goToNextImage = () => {
    const images = trek?.imageUrls?.filter(url => url && typeof url === 'string') || [];
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGalleryModalOpen) {
        if (e.key === 'ArrowLeft') {
          goToPreviousImage();
        } else if (e.key === 'ArrowRight') {
          goToNextImage();
        } else if (e.key === 'Escape') {
          setIsGalleryModalOpen(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryModalOpen]);
  
  // Handle touch/swipe navigation
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPreviousImage();
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <ModernLoadingContainer>
        <LoadingWrapper>
          <LoadingLogo>
            <FaMountain size={48} />
          </LoadingLogo>
          <LoadingMessage>Loading Trek Details...</LoadingMessage>
          <LoadingBar>
            <LoadingProgress />
          </LoadingBar>
          <LoadingHint>Preparing your adventure...</LoadingHint>
        </LoadingWrapper>
      </ModernLoadingContainer>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <ModernErrorContainer>
        <ErrorContent>
          <ErrorIconWrapper>
            <FiAlertTriangle size={60} />
          </ErrorIconWrapper>
          <ErrorHeading>Oops! Something went wrong</ErrorHeading>
          <ErrorText>{error}</ErrorText>
          <ErrorDescription>
            We're having trouble loading this trek. Please try again later.
          </ErrorDescription>
          <ErrorActions>
            <ErrorPrimaryButton onClick={() => navigate('/')}>
              Return to Home
            </ErrorPrimaryButton>
            <ErrorSecondaryButton onClick={() => window.location.reload()}>
              Try Again
            </ErrorSecondaryButton>
          </ErrorActions>
        </ErrorContent>
      </ModernErrorContainer>
    );
  }

  if (error && !fallbackData) {
    return (
      <ModernPageContainer>
        <ModernErrorContainer>
          <ErrorContent>
            <ErrorIconWrapper>⛰️</ErrorIconWrapper>
            <ErrorHeading>Trek Not Found</ErrorHeading>
            <ErrorText>
              We couldn't find the adventure you're looking for. It might be taking a different path or the trail has moved.
            </ErrorText>
            <ErrorDescription>
              Error Code: <ErrorCodeBlock>404 - Not Found</ErrorCodeBlock>
            </ErrorDescription>
            <ErrorActions>
              <ErrorPrimaryButton onClick={() => navigate(-1)}>Go Back</ErrorPrimaryButton>
              <ErrorSecondaryButton onClick={() => window.location.reload()}>
                Try Again
              </ErrorSecondaryButton>
            </ErrorActions>
          </ErrorContent>
        </ModernErrorContainer>
      </ModernPageContainer>
    );
  }
  // Create fallback values for missing data
  const trekTitle = trek?.title || "Mountain Trek";
  const trekDescription = trek?.description || "Experience this amazing mountain trek through beautiful landscapes. This adventure will take you through diverse terrains and offer unforgettable views.";
  const trekImage = getValidImageUrl(trek?.image);
  const trekDays = trek?.days || 1;
  const trekPrice = formatPrice(trek?.price);
  
  // Organizer information
  const organizerId = trek?.organizerId || null;
  const organizerName = trek?.organizerName || null;
  const organizerVerified = trek?.organizerVerified || false;
  const organizerDescription = trek?.organizerDescription || 'Experienced trek organizer providing amazing trekking experiences.';
  const organizerExperience = trek?.organizerExperience || '3+ years';
  
  // Debug image loading
  console.log("Trek image path:", trek?.image);
  console.log("Processed trek image URL:", trekImage);
  const trekDifficulty = trek?.difficulty || "Moderate";
  const trekLocation = trek?.location || "Mountain Region";
  const trekSeason = trek?.season || "Year-round";
  const trekCountry = trek?.country || "Nepal";
  const trekRating = trek?.rating || 5;
  const trekReviews = trek?.reviews || 0;
  const trekCapacity = trek?.capacity || "10";
  const trekAltitude = trek?.altitude || "3,000m";
  
  // Generate itinerary if not available
  const itinerary = trek?.itinerary || generateItinerary(trekDays, trekTitle);
  
  // Generate highlights if not available
  const highlights = trek?.highlights || generateHighlights(trekTitle);
  
  // Included/excluded items
  const included = trek?.included || getIncludedItems();
  const excluded = trek?.excluded || getExcludedItems();
  
  // Reviews data
  const reviewsData = trek?.reviewsData || generateSampleReviews(trekTitle);
    // Function to handle successful booking
  const handleBookingSuccess = async (bookingData) => {
    try {
      if (!authUser) {
        console.error("No authenticated user found");
        return;
      }
      
      // Get the proper trek title/name - ensure it's never missing
      const trekName = trek?.title || trek?.name || id.replace(/-/g, ' ')
        .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
      console.log(`Saving booking for trek: ${trekName} (ID: ${trek.id || id})`);
      
      // Save booking to Firestore with complete trek data
      const completeBookingData = {
        ...bookingData,
        userId: authUser.uid,
        userEmail: authUser.email,
        userDisplayName: authUser.displayName,
        
        // Trek details - ensure these are always properly set
        trekId: trek.id || id,
        trekName: trekName, // Ensure consistent name is used
        trekTitle: trekName, // Set both fields for consistency
        trekImage: trekImage,
        
        // Formatted trek details for display
        trekDays: trekDays,
        trekPrice: trekPrice,
        trekLocation: trekLocation,
        trekDifficulty: trek.difficulty,
        trekCountry: trek.country,
        trekSeason: trek.season,
        trekCapacity: trek.capacity,
        trekAltitude: trek.altitude,
        
        // Additional booking metadata
        bookingTimestamp: new Date().toISOString(),
        bookingPlatform: 'web',
      };
      
      // Remove any properties that are undefined to prevent Firestore errors
      Object.keys(completeBookingData).forEach(key => {
        if (completeBookingData[key] === undefined) {
          delete completeBookingData[key];
        }
      });
      
      const savedBooking = await saveBooking(completeBookingData);
      
      console.log("Booking saved successfully:", savedBooking);
      
      // Navigate to the booking confirmation page
      navigate(`/booking-confirmation/${savedBooking.id}`);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };
  
  // Function to handle booking button click
  const handleBookButtonClick = () => {
    if (!authUser) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { redirectTo: `/treks/${id}` } });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  return (
    <ModernPageContainer>
      {/* Navigation */}
      <ModernHeader isScrolled={navScrolled}>
        <HeaderInner>
          <HeaderLeft>
            <BackBtn isScrolled={navScrolled} onClick={() => navigate(-1)} aria-label="Go back">
              <FiArrowLeft />
            </BackBtn>
            <HeaderTitle>
              <HeaderTrekTitle isScrolled={navScrolled}>{trekTitle}</HeaderTrekTitle>
              <HeaderTrekSubtitle isScrolled={navScrolled}>
                Experience the beauty of nature and challenge your limits on this amazing adventure
              </HeaderTrekSubtitle>
            </HeaderTitle>
          </HeaderLeft>
          <HeaderRight>
            <ActionBtn isScrolled={navScrolled} aria-label="Share" onClick={handleShareButtonClick}>
              <FiShare2 />
            </ActionBtn>
            <ActionBtn isScrolled={navScrolled} aria-label="Save">
              <FiHeart />
            </ActionBtn>
          </HeaderRight>
        </HeaderInner>
      </ModernHeader>

      {/* Hero Section */}
      <ModernHero>
        <HeroParallax ref={parallaxRef}>
          <HeroImgWrapper 
            image={trekImage} 
            className={imageLoaded ? 'loaded' : ''}
            isLoading={!imageLoaded}
          >
            {/* Use ImageCarousel if multiple images exist, otherwise fall back to legacy single image */}
            {trek && Array.isArray(trek.imageUrls) && trek.imageUrls.filter(url => url && typeof url === 'string').length > 0 ? (
              <>
                <ImageCarousel 
                  images={trek.imageUrls.filter(url => url && typeof url === 'string')} 
                  initialIndex={Math.min(trek.coverIndex || 0, trek.imageUrls.filter(url => url && typeof url === 'string').length - 1)}
                  autoplay={true}
                  interval={6000}
                />
                {console.log("Rendering ImageCarousel with images:", trek.imageUrls.filter(url => url && typeof url === 'string'))}
              </>
            ) : trek?.image ? (
              <div className="hero-img-legacy" />
            ) : (
              <div className="hero-img-fallback">No images available</div>
            )}
          </HeroImgWrapper>
        </HeroParallax>
        <AnimatedOverlay />
        <HeroVignette />
        <HeroWave />
        <HeroContentWrapper>
          <LocationTag>
            <FiMapPin />
            {trekLocation}, {trekCountry}
          </LocationTag>
          
          <HeroBadgesContainer>
            <HeroBadge variant="primary" index={0}>
              <FaMountain />
              {trekDifficulty}
            </HeroBadge>
            <HeroBadge variant="secondary" index={1}>
              <FiClock />
              {trekDays} {trekDays === 1 ? 'Day' : 'Days'}
            </HeroBadge>
            <HeroBadge variant="orange" index={2}>
              {getSeasonIcon(trekSeason)}
              {trekSeason}
            </HeroBadge>
          </HeroBadgesContainer>
          
          <HeroHeading>
            <span>{trekTitle}</span>
          </HeroHeading>
          
          <HeroDesc>
            {trekDescription}
          </HeroDesc>
          
          <HeroActions>
            <HeroPrimaryBtn onClick={handleBookButtonClick}>
              Book This Trek
              <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
            </HeroPrimaryBtn>
          </HeroActions>
        </HeroContentWrapper>
      </ModernHero>
      
      {/* Content */}
      <ModernContent>
        <ContentContainer>
          <TwoColumnLayout>
            <MainContentArea style={{gap:'3.5rem'}}>
              {/* Stats */}
              <QuickStats>
                <StatCard color="var(--primary-color)" colorRgb="90, 112, 183">
                  <StatIcon color="var(--primary-color)" colorRgb="90, 112, 183">
                    <FiClock />
                  </StatIcon>
                  <StatText>
                    <BigStatValue>{trekDays}</BigStatValue>
                    <BigStatLabel>{trekDays === 1 ? 'Day' : 'Days'}</BigStatLabel>
                  </StatText>
                </StatCard>
                <StatCard color="var(--secondary-color)" colorRgb="66, 160, 75">
                  <StatIcon color="var(--secondary-color)" colorRgb="66, 160, 75">
                    <FaMountain />
                  </StatIcon>
                  <StatText>
                    <BigStatValue>{trekAltitude}</BigStatValue>
                    <BigStatLabel>Max Altitude</BigStatLabel>
                  </StatText>
                </StatCard>
                <StatCard color="#F8903F" colorRgb="248, 144, 63">
                  <StatIcon color="#F8903F" colorRgb="248, 144, 63">
                    <FiUsers />
                  </StatIcon>
                  <StatText>
                    <BigStatValue>{trekCapacity}</BigStatValue>
                    <BigStatLabel>Group Size</BigStatLabel>
                  </StatText>
                </StatCard>
                <StatCard color="#E879F9" colorRgb="232, 121, 249">
                  <StatIcon color="#E879F9" colorRgb="232, 121, 249">
                    <FiStar />
                  </StatIcon>
                  <StatText>
                    <BigStatValue>{trekRating}</BigStatValue>
                    <BigStatLabel>Rating</BigStatLabel>
                  </StatText>
                </StatCard>              </QuickStats>

              {/* Organizer Information */}
              {organizerId && organizerName && (
                <Section>
                  <SectionHeader>
                    <SectionTitle>
                      <FaMountain />
                      Trek Organizer
                    </SectionTitle>
                  </SectionHeader>                  <SectionBody>
                    {/* Debug check to ensure organizerId exists */}
                    {!organizerId && console.warn('Trek is missing organizerId')}
                    <OrganizerCard 
                      name={organizerName || "Trek Organizer"}
                      id={organizerId}
                      trekCount={trek?.organizerTrekCount || 1}
                      verified={organizerVerified}
                      description={organizerDescription}
                      experience={organizerExperience}
                      inTrekDetails={true}
                    />
                  </SectionBody>
                </Section>
              )}

              {/* Highlights Section */}
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FiStar />
                    Highlights
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  <ul style={{paddingLeft: '0'}}>
                    {highlights.map((highlight, idx) => (
                      <li key={idx} style={{display:'flex',alignItems:'center',marginBottom:'1rem',listStyle:'none'}}>
                        <span style={{marginRight:'0.7rem',color:'var(--secondary-color)',fontSize:'1.2em'}}><FiStar /></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </SectionBody>
              </Section>

              {/* Detailed Description Section */}
              {trek.detailedDescription && (
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FiInfo />
                    Detailed Description
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  <DetailedDescription>
                    {trek.detailedDescription.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && <p key={idx}>{paragraph}</p>
                    ))}
                  </DetailedDescription>
                </SectionBody>
              </Section>
              )}

              {/* Available Months Section */}
              {trek.availableMonths && trek.availableMonths.length > 0 && (
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FiCalendar />
                    Best Time to Visit
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  <AvailableMonths>
                    {(() => {
                      const monthNames = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ];
                      return (
                        <>
                          <p>This trek is best experienced during the following months:</p>
                          <MonthsGrid>
                            {monthNames.map((month, idx) => (
                              <Month key={idx} isAvailable={trek.availableMonths.includes(idx)}>
                                {month}
                              </Month>
                            ))}
                          </MonthsGrid>
                        </>
                      );
                    })()}
                  </AvailableMonths>
                </SectionBody>
              </Section>
              )}

              {/* Itinerary Section */}
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FiMap />
                    Itinerary
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  <Timeline>
                    {itinerary.map((item, idx) => (
                      <TimelineItem key={idx}>
                        <TimelineContent>
                          <TimelineTitle>
                            <span>{item.title}</span>
                            {item.location && (
                              <TimelineLocation>
                                <FiMapPin size={14} />
                                {item.location}
                              </TimelineLocation>
                            )}
                          </TimelineTitle>
                          <TimelineDescription>{item.description}</TimelineDescription>
                          
                          {/* Additional itinerary details */}
                          {(item.distance || item.elevation || item.accommodation) && (
                            <TimelineDetails>
                              {item.distance && (
                                <TimelineDetail>
                                  <FiCompass size={14} />
                                  Distance: {item.distance} km
                                </TimelineDetail>
                              )}
                              {item.elevation && (
                                <TimelineDetail>
                                  <FiArrowUp size={14} />
                                  Elevation: {item.elevation} m
                                </TimelineDetail>
                              )}
                              {item.accommodation && (
                                <TimelineDetail>
                                  <FiHome size={14} />
                                  Stay: {item.accommodation}
                                </TimelineDetail>
                              )}
                            </TimelineDetails>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </SectionBody>
              </Section>

              {/* Included/Excluded Section */}
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FiCheck />
                    What's Included
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  <FeaturesGrid>
                    {included.map((item, idx) => (
                      <FeatureItem key={idx}>
                        <FeatureIcon included>
                          <FiCheck />
                        </FeatureIcon>
                        <FeatureText included>{item}</FeatureText>
                      </FeatureItem>
                    ))}
                    {excluded.map((item, idx) => (
                      <FeatureItem key={`ex-${idx}`}>
                        <FeatureIcon included={false}>
                          <FiX />
                        </FeatureIcon>
                        <FeatureText included={false}>{item}</FeatureText>
                      </FeatureItem>
                    ))}
                  </FeaturesGrid>
                </SectionBody>
              </Section>

              {/* Gallery Section */}
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FaRegImages />
                    Photo Gallery
                    
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  <Gallery>
                    {trek && Array.isArray(trek.imageUrls) && trek.imageUrls.filter(url => url && typeof url === 'string').map((img, idx) => (
                      <GalleryImage 
                        key={idx} 
                        src={getValidImageUrl(img)} 
                        onClick={() => handleGalleryImageClick(idx)}
                      />
                    ))}
                  </Gallery>
                </SectionBody>
              </Section>

              {/* Reviews Section */}
              <Section>
                <SectionHeader>
                  <SectionTitle>
                    <FiStar />
                    Reviews
                  </SectionTitle>
                </SectionHeader>
                <SectionBody>
                  {/* Using the Firebase-backed Reviews component */}
                  <Reviews trekId={String(id)} />
                </SectionBody>
              </Section>
            </MainContentArea>          {/* Sidebar */}
            <Sidebar>
              <BookingCard>
                <BookingHeader>                  <PriceTag>
                    <Price>
                      {trekPrice} <span>per person</span>
                    </Price>
                    <PriceCaption>
                      Based on {trekDays} {trekDays === 1 ? 'day' : 'days'}
                    </PriceCaption>
                  </PriceTag>
                </BookingHeader>
                
                <BookingBody>
                  <BookingDetailsGrid>
                    <DetailItem>
                      <DetailLabel>
                        <FiCalendar />
                        Duration
                      </DetailLabel>
                      <DetailValue>{trekDays} {trekDays === 1 ? 'Day' : 'Days'}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>
                        <FiMapPin />
                        Location
                      </DetailLabel>
                      <DetailValue>{trekLocation}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>
                        <FaMountain />
                        Difficulty
                      </DetailLabel>
                      <DetailValue>{trekDifficulty}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>
                        <FiUsers />
                        Group Size
                      </DetailLabel>
                      <DetailValue>Max {trekCapacity}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>
                        {getSeasonIcon(trekSeason)}
                        Season
                      </DetailLabel>
                      <DetailValue>{trekSeason}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem>
                      <DetailLabel>
                        <FaMapMarkedAlt />
                        Max Altitude
                      </DetailLabel>
                      <DetailValue>{trekAltitude}</DetailValue>
                    </DetailItem>
                  </BookingDetailsGrid>
                    <BookNowBtn onClick={handleBookButtonClick}>
                    Book This Trek
                    <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
                  </BookNowBtn>
                </BookingBody>
              </BookingCard>
                {/* Add Organizer Card */}
              {trek?.organizerId && trek?.organizerName && (
                <OrganizerCard 
                  name={trek.organizerName}
                  id={trek.organizerId}
                  trekCount={trek.organizerTrekCount || 1}
                  verified={trek.organizerVerified || false}
                  description={trek.organizerDescription || 'Experienced trek organizer providing amazing trekking experiences.'}
                  experience={trek.organizerExperience || '3+ years'}
                  inTrekDetails={true}
                />
              )}
            </Sidebar>
          </TwoColumnLayout>
        </ContentContainer>
      </ModernContent>

      {/* Booking Modal */}      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        trek={{
          ...trek,
          numericPrice: getNumericPrice(trek?.price) // Add numeric price for calculations
        }}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div 
          className="gallery-modal"
          onClick={() => setIsGalleryModalOpen(false)}
        >
          <div className="gallery-modal-overlay" />
          <div className="gallery-modal-content">
            {/* Close button */}
            <button 
              className="gallery-close-btn"
              onClick={() => setIsGalleryModalOpen(false)}
              aria-label="Close gallery"
            >
              <FiX size={24} />
            </button>
            
            {/* Navigation buttons */}
            <button 
              className="gallery-nav-btn gallery-prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
              aria-label="Previous image"
            >
              <FiChevronLeft size={32} />
            </button>
            
            <button 
              className="gallery-nav-btn gallery-next-btn"
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              aria-label="Next image"
            >
              <FiChevronRight size={32} />
            </button>
            
            {/* Main image */}
            <div 
              className="gallery-image-container"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {trek?.imageUrls?.filter(url => url && typeof url === 'string').map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${trek.title} - ${index + 1}`}
                  className={`gallery-main-image ${index === currentImageIndex ? 'active' : ''}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
            
            {/* Image counter */}
            <div className="gallery-counter">
              {currentImageIndex + 1} / {trek?.imageUrls?.filter(url => url && typeof url === 'string').length || 0}
            </div>
            
            {/* Thumbnail strip */}
            <div className="gallery-thumbnails">
              {trek?.imageUrls?.filter(url => url && typeof url === 'string').map((imageUrl, index) => (
                <button
                  key={index}
                  className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </ModernPageContainer>
  );
}