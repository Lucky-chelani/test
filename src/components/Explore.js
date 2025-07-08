// filepath: c:\Users\DELL\Documents\Coders\test\src\components\Explore.js
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import trek1 from '../assets/images/trek1.png';
import Footer from './Footer';
import groupImg from '../assets/images/trek1.png';
import eventImg from '../assets/images/trek1.png';
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiUsers, FiInfo, FiTrendingUp, FiAward, FiSearch, FiX, FiHeart, FiStar, FiUser } from 'react-icons/fi';
import { FaMountain, FaStar, FaSnowflake, FaSun, FaLeaf, FaCloudRain } from 'react-icons/fa';
import { RiCommunityFill } from 'react-icons/ri';
import { MdEventAvailable } from 'react-icons/md';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useSearch } from '../context/SearchContext';
import { ActionButton, EventButton, BadgeTag } from './ExploreComponents';
import { TagsContainer, Tag, OrganizerRow, OrganizerIcon, OrganizerText, OrganizerName } from './TagComponents';

// Adding required fonts for premium trek card design
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;

// Premium card components for reusability
const MetaDataRow = styled.div`
  display: flex;
  align-items: center;
  color: #a1a1aa;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 8px;
`;

const MetaDataDot = styled.span`
  margin: 0 6px;
  opacity: 0.6;
`;

const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e4e4e7;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  
  svg {
    color: #fbbf24;
    font-size: 14px;
  }
  
  span.reviews {
    color: #a1a1aa;
    font-weight: 400;
    font-size: 12px;
    margin-left: 2px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PremiumPriceTag = styled.div`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  
  .currency {
    font-size: 14px;
    font-weight: 400;
    margin-right: 1px;
  }
  
  .unit {
    font-size: 12px;
    color: #a1a1aa;
    margin-left: 2px;
    font-weight: 400;
  }
`;

const ViewButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(to right, #f97316, #7c3aed);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const starPulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

// Main Container Components
const ExploreSection = styled.section`
  position: relative;
  background: #080812;
  min-height: 100vh;
  color: #fff;
  padding: 100px 0 0 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 70px 0 0 0;
  }
`;

const MapPatternBackground = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1; 
  background: url(${mapPattern});
  background-size: 600px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 0;
  animation: ${breathe} 15s infinite ease-in-out;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, 
    rgba(10, 10, 40, 0.7) 0%, 
    rgba(0, 0, 0, 0.95) 100%);
  z-index: 1;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 24px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

// Title Components

// Search Components
const SearchBarContainer = styled.div`
  margin: 20px auto 40px auto;
  max-width: 600px;
  width: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 90%;
    margin: 10px auto 30px auto;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 5px 25px rgba(128, 255, 219, 0.3);
  }
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: 16px 60px 16px 25px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 14px 50px 14px 20px;
    font-size: 0.95rem;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(128, 255, 219, 0.3);
    color: white;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }
`;

const ClearButton = styled(SearchButton)`
  right: 60px;
  background: transparent;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 480px) {
    right: 50px;
  }
`;

const SearchResultsHeader = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding: 0 10px;
  font-style: italic;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;
const SectionTitleContainer = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 0.6rem;
  background: linear-gradient(to right, #fff 0%, #bbb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1024px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SectionUnderline = styled.div`
  width: 80px;
  height: 6px;
  background: linear-gradient(to right, #FFD2BF, #ffbfa3);
  border-radius: 6px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

// Slider Components
const SliderWrapper = styled.div`
  position: relative;
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 3rem;
  }
`;

const TreksSlider = styled.div`
  display: flex;
  gap: 30px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 30px 10px;
  margin: 0 -10px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  perspective: 1000px;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 25px 5px;
  }
  
  @media (max-width: 480px) {
    gap: 15px;
    padding: 20px 5px;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const LeftArrowButton = styled(ArrowButton)`
  left: -25px;
  
  @media (max-width: 768px) {
    left: -15px;
  }
  
  @media (max-width: 480px) {
    left: -10px;
  }
`;

const RightArrowButton = styled(ArrowButton)`
  right: -25px;
  
  @media (max-width: 768px) {
    right: -15px;
  }
  
  @media (max-width: 480px) {
    right: -10px;
  }
`;

// Card Components
// Using the GlobalFonts component declared above

// Premium Trek Card - Updated to match SearchResultsPage design
const TrekCard = styled.div`
  background: #0d0f14;
  border-radius: 16px;
  overflow: hidden;
  width: 320px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  animation: ${fadeIn} 0.6s ease-out;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 1200px) {
    width: 300px;
  }
  
  @media (max-width: 1000px) {
    width: 280px;
  }
      
  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
  }
  
  @media (max-width: 480px) {
    width: 85%;
    max-width: 320px;
  }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
`;

const TrekImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.6s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }
  
  ${TrekCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.7) 70%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, 
      rgba(18, 18, 18, 0) 40%, 
      rgba(18, 18, 18, 0.8) 80%, 
      rgba(18, 18, 18, 1) 100%);
    z-index: -1;
  }
  
  ${TrekCard}:hover & {
    opacity: 1;
  }
`;

// Using tag and organizer components from TagComponents.js

const SeasonBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.7), rgba(255, 193, 7, 0.7));
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.25);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  
  svg {
    color: rgba(255, 255, 255, 0.95);
    font-size: 1rem;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 16px rgba(255, 193, 7, 0.35);
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.8), rgba(255, 193, 7, 0.8));
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 14px;
  }
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 100px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  z-index: 10;
  animation: fadeIn 0.5s ease-out;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const pulsate = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

const PriceTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: linear-gradient(135deg, #43A047, #2E7D32);
  color: #fff;
  font-weight: 800;
  font-size: 1.4rem;
  padding: 16px 28px;
  border-radius: 14px;
  border: 1px solid rgba(76, 175, 80, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  margin: 12px 0;
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: 0.5s;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px; 
    padding: 2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(76, 175, 80, 0.6));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  span {
    font-size: 1.1rem;
    font-weight: 600;
    margin-right: 2px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  &:hover {
    background: linear-gradient(135deg, #2E7D32, #388E3C);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 30px rgba(76, 175, 80, 0.5);
    animation: ${pulsate} 2s infinite;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 14px 24px;
  }
`;

const DifficultyTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #7c3aed;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
`;

const GroupTag = styled(Tag)`
  background: rgba(103, 58, 183, 0.25);
  color: #E1BEE7;
  border: 1px solid rgba(103, 58, 183, 0.4);
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 6px 15px rgba(103, 58, 183, 0.3);
  
  svg {
    color: #B39DDB;
    font-size: 1.2rem;
  }
  
  &:hover {
    background: rgba(103, 58, 183, 0.35);
    border-color: rgba(103, 58, 183, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(103, 58, 183, 0.4);
  }
`;

const EventTag = styled(Tag)`
  background: rgba(255, 152, 0, 0.25);
  color: #FFE0B2;
  border: 1px solid rgba(255, 152, 0, 0.4);
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 6px 15px rgba(255, 152, 0, 0.3);
  
  svg {
    color: #FFB74D;
    font-size: 1.2rem;
  }
  
  &:hover {
    background: rgba(255, 152, 0, 0.35);
    border-color: rgba(255, 152, 0, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.4);
  }
`;

const TrekInfo = styled.div`
  padding: 0 16px;
  color: #ffffff;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
    @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.2;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const TrekLocation = styled.p`
  color: #a1a1aa;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 400;
`;

const TrekOrganizer = styled.div`
  color: #94a3b8;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
  
  .organizer-label {
    color: #64748b;
    font-weight: 500;
  }
  
  .organizer-name {
    color: #e2e8f0;
    font-weight: 500;
  }
  
  .verified-badge {
    color: #4ade80;
    font-size: 14px;
    margin-left: 2px;
  }
  
  svg {
    color: #7c3aed;
    font-size: 14px;
  }
`;

const TrekMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const TrekDetails = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
  color: #a1a1aa;
  flex-wrap: wrap;
`;

const TrekDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
  
  svg {
    color: #64B5F6;
    font-size: 1.1rem;
  }
`;

const TrekRatingNew = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e4e4e7;
  font-size: 13px;
  font-weight: 500;
  
  svg {
    color: #fbbf24;
    font-size: 14px;
  }
  
  .reviews {
    color: #a1a1aa;
    font-weight: 400;
    font-size: 12px;
    margin-left: 2px;
  }
`;

const TrekPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  
  .currency {
    font-size: 14px;
    font-weight: 400;
    margin-right: 1px;
  }
  
  .unit {
    font-size: 12px;
    color: #a1a1aa;
    margin-left: 2px;
    font-weight: 400;
  }
`;

const TrekDescription = styled.p`
  color: #a1a1aa;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TrekFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;

const ViewTrekButton = styled.button`
  flex: 1;
  height: 38px;
  padding: 0 18px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #8b5cf6;
    transform: translateY(-2px);
  }
`;

const FavoriteButton = styled.button`
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: scale(1.1);
  }
  
  svg {
    font-size: 16px;
  }
`;

const TrekBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(124, 58, 237, 0.9);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  z-index: 10;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const TrekContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

// Loading Placeholder Component
const LoadingCard = styled(TrekCard)`
  background: rgba(255, 255, 255, 0.05);
  min-height: 450px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0), 
      rgba(255, 255, 255, 0.1), 
      rgba(255, 255, 255, 0)
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
`;

// Error state for treks
const ErrorState = styled.div`
  padding: 20px;
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 12px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  width: 80%;
  max-width: 600px;
  margin: 0 auto 40px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  button {
    background: linear-gradient(135deg, #ff5252, #ff1744);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    margin-top: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #ff5252;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(255, 0, 0, 0.3);
    }
  }
`;

// Empty state component
const EmptyState = styled.div`
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  width: 80%;
  max-width: 600px;
  margin: 0 auto 40px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  button {
    background: linear-gradient(135deg, #FFD2BF 0%, #ffbfa3 100%);
    color: #333;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(255, 210, 191, 0.4);
    }
  }
`;

// Sample data for active groups and events (would come from backend in full app)
const activeGroups = [
  { name: 'Himalayan Trekkers', members: 250 },
  { name: 'Weekend Wanderers', members: 180 },
  { name: 'Mountain Enthusiasts', members: 320 },
  { name: 'Adventure Seekers', members: 210 }
];

const upcomingEvents = [
  { name: 'Trekking Summit 2023', date: 'Oct 15' },
  { name: 'Gear Workshop', date: 'Nov 5' },
  { name: 'Photo Exhibition', date: 'Oct 28' },
  { name: 'Travel Meetup', date: 'Dec 10' }
];

const Explore = () => {
  const navigate = useNavigate();
  const [recommendedTreks, setRecommendedTreks] = useState([]);
  const [popularTreks, setPopularTreks] = useState([]);
  const [upcomingTreks, setUpcomingTreks] = useState([]);
  const [trendingTreks, setTrendingTreks] = useState([]);
  const [filteredRecommendedTreks, setFilteredRecommendedTreks] = useState([]);
  const [filteredPopularTreks, setFilteredPopularTreks] = useState([]);
  const [filteredUpcomingTreks, setFilteredUpcomingTreks] = useState([]);
  const [filteredTrendingTreks, setFilteredTrendingTreks] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, updateSearchQuery, searchTreks } = useSearch();

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        const treksCollection = collection(db, "treks");
        
        // Fetch all treks
        const treksSnapshot = await getDocs(treksCollection);
        const treksData = treksSnapshot.docs
          .filter(doc => doc.id !== "placeholder" && doc.data().title)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            featured: doc.data().featured || false,
            image: doc.data().image || trek1, // Default image if none provided
          }));

        // Filter treks by categories
        setRecommendedTreks(
          treksData.filter(trek => trek.recommended || trek.rating >= 4.8)
        );
        
        setPopularTreks(
          treksData.filter(trek => trek.popular || trek.reviews >= 100)
        );
        
        setUpcomingTreks(
          treksData.filter(trek => trek.upcoming || trek.season === "Upcoming")
        );
          setTrendingTreks(
          treksData.filter(trek => trek.trending || trek.rating >= 4.5)
        );
        
        // Set filtered treks to be the same as all treks initially
        setFilteredRecommendedTreks(treksData.filter(trek => trek.recommended || trek.rating >= 4.8));
        setFilteredPopularTreks(treksData.filter(trek => trek.popular || trek.reviews >= 100));
        setFilteredUpcomingTreks(treksData.filter(trek => trek.upcoming || trek.season === "Upcoming"));
        setFilteredTrendingTreks(treksData.filter(trek => trek.trending || trek.rating >= 4.5));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching treks:", err);
        setError("Failed to load treks. Please try again later.");
        setLoading(false);
      }
    };

    fetchTreks();  }, []);

  // Handle search functionality
  useEffect(() => {
    const query = localSearchQuery || searchQuery;
    
    if (!query) {
      // If no search query, show all treks
      setFilteredRecommendedTreks(recommendedTreks);
      setFilteredPopularTreks(popularTreks);
      setFilteredUpcomingTreks(upcomingTreks);
      setFilteredTrendingTreks(trendingTreks);
    } else {
      // Filter treks based on search query
      setFilteredRecommendedTreks(searchTreks(recommendedTreks, query));
      setFilteredPopularTreks(searchTreks(popularTreks, query));
      setFilteredUpcomingTreks(searchTreks(upcomingTreks, query));
      setFilteredTrendingTreks(searchTreks(trendingTreks, query));
    }
  }, [
    recommendedTreks, 
    popularTreks, 
    upcomingTreks, 
    trendingTreks, 
    searchQuery, 
    localSearchQuery, 
    searchTreks
  ]);
    // Handle local search
  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
  };
  
  // Clear search
  const clearSearch = () => {
    setLocalSearchQuery('');
    updateSearchQuery('');
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      updateSearchQuery(localSearchQuery);
      navigate('/search-results');
    }
  };

  const renderTrekSection = (sectionTitle, treks, sectionId) => {
    if (loading) {
      return (
        <>
          <SectionTitleContainer>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SectionUnderline />
          </SectionTitleContainer>
          <SliderWrapper>
            {[1,2,3].map((_, idx) => (
              <LoadingCard key={idx} />
            ))}
          </SliderWrapper>
        </>
      );
    }

    if (error) {
      return (
        <>
          <SectionTitleContainer>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SectionUnderline />
          </SectionTitleContainer>
          <ErrorState>
            <h3>Error Loading Treks</h3>
            <p>{error}</p>
          </ErrorState>
        </>
      );
    }

    if (treks.length === 0) {
      return (
        <>
          <SectionTitleContainer>
            <SectionTitle>{sectionTitle}</SectionTitle>
            <SectionUnderline />
          </SectionTitleContainer>
          <EmptyState>
            <h3>No Treks Available</h3>
            <p>Check back later for exciting new treks!</p>
          </EmptyState>
        </>
      );
    }

    return (
      <>
        <SectionTitleContainer>
          <SectionTitle>{sectionTitle}</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer>
          <SliderWithArrows data={treks} sectionId={sectionId}>
          {treks.map((trek, idx) => (
            <TrekCard key={idx} onClick={() => navigate(`/trek/${trek.id || trek.title.toLowerCase().replace(/\s+/g, '-')}`)}>
              <TrekImageWrapper>
                <TrekImage style={{ backgroundImage: `url(${trek.image})` }} />
                <TrekBadge>
                  {trek.difficulty || 'Moderate'}
                </TrekBadge>
                
                {/* Add organizer info overlay */}
                {trek.organizerName && (
                  <OrganizerRow>
                    <OrganizerIcon>
                      <FiUser />
                    </OrganizerIcon>
                    <OrganizerText>
                      By <OrganizerName>{trek.organizerName}</OrganizerName>
                      {trek.organizerVerified && <span style={{ color: '#4ade80', marginLeft: '4px' }}>✓</span>}
                    </OrganizerText>
                  </OrganizerRow>
                )}
              </TrekImageWrapper>
              
              <TrekContent>
                <TrekTitle>{trek.title}</TrekTitle>
                <TrekLocation>
                  <FiMapPin />
                  {trek.location || trek.state || "India"}
                </TrekLocation>
                
                {/* Organized By Field */}
                {trek.organizerName && (
                  <TrekOrganizer>
                    <FiUser />
                    <span className="organizer-label">Organized by</span>
                    <span className="organizer-name">{trek.organizerName}</span>
                    {trek.organizerVerified && <span className="verified-badge">✓</span>}
                  </TrekOrganizer>
                )}
                
                <TrekMeta>
                  <TrekDetails>
                    <TrekDetail>
                      <FiClock />
                      {trek.days || Math.floor(Math.random() * 7) + 2} days
                    </TrekDetail>
                    <TrekDetail>
                      <FiUsers />
                      {trek.capacity || '8-12'}
                    </TrekDetail>
                    <TrekDetail>
                      {getSeasonIcon(trek.season)}
                      {trek.season || trek.month || 'All seasons'}
                    </TrekDetail>
                  </TrekDetails>
                  
                  {trek.rating && (
                    <TrekRatingNew>
                      <FiStar />
                      {trek.rating || (4 + Math.random()).toFixed(1)}
                      <span className="reviews">({trek.reviews || Math.floor(Math.random() * 100) + 50})</span>
                    </TrekRatingNew>
                  )}
                </TrekMeta>
                
                <TrekPrice>
                  <span className="currency">₹</span>
                  {typeof trek.price === 'string' ? trek.price.replace('₹', '') : trek.price || '4,999'}
                  <span className="unit">/person</span>
                </TrekPrice>
                
                <TrekDescription>
                  {trek.description || 'Experience this amazing trek with breathtaking views and unforgettable memories.'}
                </TrekDescription>
                
                <TrekFooter>
                  <ViewTrekButton>
                    View Details
                  </ViewTrekButton>
                  <FavoriteButton>
                    <FiHeart />
                  </FavoriteButton>
                </TrekFooter>
              </TrekContent>
            </TrekCard>
          ))}
        </SliderWithArrows>
      </>
    );  
  };

  // Enhanced Slider Component
  function SliderWithArrows({ children, data = [], sectionId }) {
    // Ensure data is an array even if null/undefined is passed
    const safeData = Array.isArray(data) ? data : [];
    
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const handleScroll = (direction) => {
      if (sliderRef.current && !isScrolling) {
        setIsScrolling(true);
        const { scrollLeft, clientWidth } = sliderRef.current;
        const scrollTo = direction === 'left' 
          ? scrollLeft - clientWidth / 1.5
          : scrollLeft + clientWidth / 1.5;
        
        sliderRef.current.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });

        setTimeout(() => {
          if (sliderRef.current) {
            const newIndex = Math.round(sliderRef.current.scrollLeft / (sliderRef.current.scrollWidth / safeData.length));
            setActiveIndex(Math.min(Math.max(newIndex, 0), safeData.length - 1));
            setIsScrolling(false);
          }
        }, 500);
      }
    };

    const handleIndicatorClick = (index) => {
      if (sliderRef.current && !isScrolling) {
        setIsScrolling(true);
        const cardWidth = sliderRef.current.scrollWidth / safeData.length;
        const scrollTo = cardWidth * index;
        
        sliderRef.current.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
        
        setActiveIndex(index);
        setTimeout(() => setIsScrolling(false), 500);
      }
    };

    // Listen for scroll events to update active index
    useEffect(() => {
      const handleScrollUpdate = () => {
        if (sliderRef.current && !isScrolling) {
          const { scrollLeft, scrollWidth } = sliderRef.current;
          const cardWidth = scrollWidth / safeData.length;
          const newIndex = Math.round(scrollLeft / cardWidth);
          
          if (newIndex !== activeIndex) {
            setActiveIndex(Math.min(Math.max(newIndex, 0), safeData.length - 1));
          }
        }
      };

      const ref = sliderRef.current;
      if (ref) {
        ref.addEventListener('scroll', handleScrollUpdate);
        return () => {
          // Ensure ref still exists when removing the listener
          if (ref) {
            ref.removeEventListener('scroll', handleScrollUpdate);
          }
        };
      }
    }, [activeIndex, isScrolling, safeData.length]);

    return (
      <SliderWrapper>
        <LeftArrowButton 
          onClick={() => handleScroll('left')}
          disabled={activeIndex === 0 || isScrolling}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </LeftArrowButton>
        
        <TreksSlider ref={sliderRef} id={sectionId}>
          {children}
        </TreksSlider>
        
        <RightArrowButton 
          onClick={() => handleScroll('right')}
          disabled={activeIndex === safeData.length - 1 || isScrolling}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </RightArrowButton>
        
        <ScrollIndicatorContainer>
          {safeData.map((_, idx) => (
            <ScrollIndicator 
              key={idx} 
              $active={idx === activeIndex}
              onClick={() => handleIndicatorClick(idx)}
            />
          ))}
        </ScrollIndicatorContainer>
      </SliderWrapper>
    );
  }
  return (
    <ExploreSection>
      <GlobalFonts />
      <MapPatternBackground />
      <Overlay /><Container>
        {/* Search Bar */}
        <SearchBarContainer>
          <form onSubmit={handleSearchSubmit}>
            <SearchInputWrapper>
              <SearchInputField
                type="text"
                placeholder="Search for treks by name, location, difficulty..."
                value={localSearchQuery || searchQuery}
                onChange={handleSearch}
              />
              {(localSearchQuery || searchQuery) && (
                <ClearButton onClick={clearSearch} aria-label="Clear search">
                  <FiX />
                </ClearButton>
              )}
              <SearchButton aria-label="Search" type="submit">
                <FiSearch />
              </SearchButton>
            </SearchInputWrapper>
          </form>
        </SearchBarContainer>
        
        {(localSearchQuery || searchQuery) && (
          <SearchResultsHeader>
            {filteredRecommendedTreks.length + filteredPopularTreks.length + 
             filteredUpcomingTreks.length + filteredTrendingTreks.length === 0 
              ? "No treks match your search. Try a different keyword." 
              : `Found treks matching "${localSearchQuery || searchQuery}"`}
          </SearchResultsHeader>
        )}
        
        {/* Render Trek Sections with filtered treks */}
        {renderTrekSection("Recommended Treks", filteredRecommendedTreks, "recommended-treks")}
        {renderTrekSection("Popular Treks", filteredPopularTreks, "popular-treks")}
        {renderTrekSection("Upcoming Treks", filteredUpcomingTreks, "upcoming-treks")}
        {renderTrekSection("Trending Treks", filteredTrendingTreks, "trending-treks")}
        
        {/* Active Groups Section */}
        {/* <SectionTitleContainer>
          <SectionTitle>Active Groups</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer> */}
          {/* <SliderWithArrows data={activeGroups} sectionId="active-groups">
          {activeGroups.map((group, idx) => (            <TrekCard key={idx} style={{
              background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.2), rgba(81, 45, 168, 0.4))',
              border: '1px solid rgba(103, 58, 183, 0.3)',
              boxShadow: '0 15px 35px rgba(76, 111, 255, 0.3)'
            }}>
              <TrekImageWrapper style={{ height: '250px', borderBottom: '1px solid rgba(103, 58, 183, 0.2)' }}>
                <TrekImage style={{ backgroundImage: `url(${groupImg})` }} />
                <TrekTags>
                  <GroupTag><RiCommunityFill /> Community</GroupTag>
                </TrekTags>
                <BadgeTag style={{
                  background: 'linear-gradient(135deg, #9575CD, #673AB7)',
                  boxShadow: '0 6px 15px rgba(103, 58, 183, 0.4)'
                }}>80 XP</BadgeTag>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{group.name}</TrekTitle>
                <TrekLocation>
                  <FiUsers />
                  {group.members} active members
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiCalendar />
                    Weekly Meetups
                  </MetaItem>
                  <Difficulty>
                    <FiInfo />
                    Open to Join
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FaStar />
                  <span>4.9</span>
                  <span className="reviews">(32 reviews)</span>
                </TrekRating>
                <ActionButton as={Link} to="/signup">
                  Join Group <FiArrowRight />
                </ActionButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows> */}
        

        {/* <SectionTitleContainer>
          <SectionTitle>Upcoming Events</SectionTitle>
          <SectionUnderline />
        </SectionTitleContainer> */}
          {/* <SliderWithArrows data={upcomingEvents} sectionId="upcoming-events">
          {upcomingEvents.map((event, idx) => (            <TrekCard key={idx} style={{
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(245, 124, 0, 0.4))',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              boxShadow: '0 15px 35px rgba(76, 111, 255, 0.3)'
            }}>
              <TrekImageWrapper style={{ height: '250px', borderBottom: '1px solid rgba(255, 152, 0, 0.2)' }}>
                <TrekImage style={{ backgroundImage: `url(${eventImg})` }} />
                <TrekTags>
                  <EventTag><MdEventAvailable /> Event</EventTag>
                </TrekTags>
                <BadgeTag style={{
                  background: 'linear-gradient(135deg, #FFB74D, #FF9800)',
                  boxShadow: '0 6px 15px rgba(255, 152, 0, 0.4)'
                }}>{event.date}</BadgeTag>
              </TrekImageWrapper>
              
              <TrekInfo>
                <TrekTitle>{event.name}</TrekTitle>
                <TrekLocation>
                  <FiMapPin />
                  Online & In-person
                </TrekLocation>
                <MetaRow>
                  <MetaItem>
                    <FiClock />
                    Registration Open
                  </MetaItem>
                  <Difficulty>
                    <FiInfo />
                    Limited Spots
                  </Difficulty>
                </MetaRow>
                <TrekRating>
                  <FiUsers />
                  <span>58</span>
                  <span className="reviews">people attending</span>
                </TrekRating>
                <EventButton as={Link} to="/signup">
                  Register Now <FiArrowRight />
                </EventButton>
              </TrekInfo>
            </TrekCard>
          ))}
        </SliderWithArrows> */}
      </Container>
      <Footer />
    </ExploreSection>
  );
};

const LocationTag = styled(Tag)`
  background: rgba(33, 150, 243, 0.2);
  color: white;
  border: 1px solid rgba(33, 150, 243, 0.4);
  border-radius: 50px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.25);
  min-width: 90px;
  justify-content: center;
  
  svg {
    color: white;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    min-width: 80px;
    font-size: 0.8rem;
  }
`;

export default Explore;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  color: #FFC107;
  font-size: 1.1rem;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 87, 34, 0.1));
  padding: 8px 14px;
  border-radius: 30px;
  margin-right: 8px;
  border: 1px solid rgba(255, 193, 7, 0.2);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 87, 34, 0.15));
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 193, 7, 0.25);
  }
`;

const Star = styled.span`
  color: #FFC107;
  margin-right: 4px;
  font-size: 1.1rem;
  line-height: 1;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFD54F;
    animation: ${starPulse} 0.8s ease infinite;
  }
`;

const ReviewCount = styled.span`
  color: #aaa;
  font-weight: 400;
  font-size: 0.9rem;
  margin-left: 5px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`;


const ScrollIndicatorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const ScrollIndicator = styled.div`
  width: ${props => props.$active ? '24px' : '8px'};
  height: 8px;
  border-radius: 10px;
  background: ${props => props.$active ? 
    'linear-gradient(to right, #5390D9, #7400B8)' : 
    'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.$active ? 
    '0 2px 8px rgba(83, 144, 217, 0.3)' : 
    '0 1px 3px rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    transform: ${props => props.active ? 'scale(1.1)' : 'scale(1.2)'};
    background: ${props => props.active ? 
      'linear-gradient(to right, #5390D9, #7400B8)' : 
      'rgba(255, 255, 255, 0.4)'};
  }
`;

// Utility function to get season icon
const getSeasonIcon = (season) => {
  if (!season) return <FaLeaf />;
  const s = season.toLowerCase();
  if (s.includes('winter') || s.includes('dec') || s.includes('jan') || s.includes('feb'))
    return <FaSnowflake />;
  if (s.includes('summer') || s.includes('jun') || s.includes('jul') || s.includes('aug'))
    return <FaSun />;
  if (s.includes('monsoon') || s.includes('rain'))
    return <FaCloudRain />;
  return <FaLeaf />;
};