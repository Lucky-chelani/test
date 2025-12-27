import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import mapPattern from "../assets/images/map-pattren.png";
// Import required icons for the new card design
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiSearch, FiUsers, FiHeart, FiStar, FiUser } from 'react-icons/fi';
import { FaMountain, FaStar } from 'react-icons/fa';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getValidImageUrl } from "../utils/images";
import { useSearch } from "../context/SearchContext";
// Import tag and organizer components
import { 
  TagsContainer, 
  Tag, 
  OrganizerRow, 
  OrganizerIcon, 
  OrganizerText, 
  OrganizerName 
} from './TagComponents';

// Using the components imported from TagComponents.js

// Using TagsContainer and Tag components from TagComponents.js

const PriceTag = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  
  span {
    font-size: 14px;
    margin-right: 1px;
    font-weight: 400;
    opacity: 0.8;
  }
`;

// Adding required fonts for premium trek card design
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;
// import { MetaRow, MetaItem, TrekRating } from "./TrekCardComponents";

// Define these components directly in this file as fallback
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a1a1aa;
  font-size: 13px;
  font-weight: 400;
  
  svg {
    color: #7c3aed;
    font-size: 14px;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`;

const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e4e4e7;
  font-size: 13px;
  font-weight: 500;
  margin: 4px 0;
  
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
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Section = styled.section`
  position: relative;
  min-height: 800px;
  padding: 120px 0 140px 0;
  background-color: #080808; /* Darker background to match cards */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  @media (max-width: 768px) {
    padding: 90px 0 110px 0;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 60px 0 90px 0;
  }
`;

// Enhanced map pattern with higher opacity and blend mode
const MapPatternBackground = styled.div`
  position: absolute;
  inset: 0;
  background: url(${mapPattern});
  background-size: 500px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 2;
  opacity: 0.2;
  will-change: transform;
  
  /* Removed mix-blend-mode and filter for better performance */
  
  /* Only animate on non-mobile devices */
  @media (min-width: 769px) {
    animation: breathe 20s infinite ease-in-out;
    
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(92, 188, 226, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%);
    z-index: 1;
  }
`;

// Lighter overlay to make map pattern more visible
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, 
    rgba(10, 26, 47, 0.6) 0%, 
    rgba(8, 22, 48, 0.85) 100%);
  z-index: 1;
  pointer-events: none;
`;

const SectionContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  padding: 0 50px;
  
  @media (max-width: 768px) {
    padding: 0 30px;
  }
  
  @media (max-width: 480px) {
    padding: 0 20px;
    /* Add safe area support */
    padding-left: max(20px, env(safe-area-inset-left)); 
    padding-right: max(20px, env(safe-area-inset-right));
  }
`;

// Enhanced heading with bold gradient and larger size
const Heading = styled.h2`
  color: #fff;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(to right, #ffffff 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 3.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

// Improved underline with animation and increased size
const Underline = styled.div`
  width: 120px;
  height: 8px;
  background: linear-gradient(to right, #5390D9, #7400B8);
  border-radius: 8px;
  margin: 0 auto 30px auto;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
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

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  letter-spacing: 0.5px;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 30px;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 25px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0 50px 0 20px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(128, 255, 219, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchIconContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const SearchResultsInfo = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 20px;
  font-style: italic;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 30px;
`;

// Enhanced card container with better scrolling
const TrekListContainer = styled.div`
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding: 30px 15px 50px 15px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  will-change: scroll-position;
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
  
  /* Optimized for smoother scrolling */
  > * {
    scroll-snap-align: start;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 20px 5px 40px 5px;
  }
`;

const navButtonPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(76, 111, 255, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(76, 111, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 111, 255, 0); }
`;

// Enhanced navigation buttons
const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(76, 111, 255, 0.2), rgba(128, 255, 219, 0.15));
  border: 1px solid rgba(76, 111, 255, 0.3);
  color: white;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25), 0 0 0 rgba(76, 111, 255, 0.4);
  will-change: transform, background-color;
  overflow: hidden;
  
  svg {
    transition: transform 0.3s ease;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(76, 111, 255, 0.4) 0%, rgba(76, 111, 255, 0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
  }
  
  &:hover {
    background: linear-gradient(145deg, rgba(76, 111, 255, 0.3), rgba(128, 255, 219, 0.2));
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 10px 25px rgba(76, 111, 255, 0.3);
    animation: ${css`${navButtonPulse} 1.5s infinite`};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(128, 255, 219, 0.05);
    box-shadow: none;
    animation: none;
  }
    @media (max-width: 768px) {
    display: none; /* Hide arrows on tablet/mobile where swiping is natural */
  }
`;

const PrevButton = styled(NavigationButton)`
  left: -70px; 
  
  @media (max-width: 1300px) {
    left: -20px; /* Bring it back in on smaller laptops */
  }
  svg {
    margin-left: -2px;
  }
  
  &:hover svg {
    transform: translateX(-3px);
  }
  
  @media (max-width: 768px) {
    left: -15px;
  }
  
  @media (max-width: 480px) {
    left: -10px;
  }
`;

const NextButton = styled(NavigationButton)`
  /* Change -30px to -60px or -70px to push it further out */
  right: -70px;

  @media (max-width: 1300px) {
    right: -20px; /* Bring it back in on smaller laptops */
  }
  svg {
    margin-right: -2px;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
  
  @media (max-width: 768px) {
    right: -15px;
  }
  
  @media (max-width: 480px) {
    right: -10px;
  }
`;

// Define 3D card hover effect
const cardHover = keyframes`
  0% { transform: perspective(1200px) rotateY(0) rotateX(0); }
  50% { transform: perspective(1200px) rotateY(5deg) rotateX(-2deg); }
  100% { transform: perspective(1200px) rotateY(0) rotateX(0); }
`;

// Adding dynamic glow effect animation
const glowEffect = keyframes`
  0% { box-shadow: 0 0 15px rgba(76, 111, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(76, 111, 255, 0.5); }
  100% { box-shadow: 0 0 15px rgba(76, 111, 255, 0.3); }
`;

// Add card hover lift animation
const cardLift = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-15px); }
`;

// Card shine animation
const cardShine = keyframes`
  0% { background-position: 200% 50%; }
  100% { background-position: -200% 50%; }
`;

const TrekCard = styled.div`
  background: rgba(13, 15, 20, 0.85); /* Slightly transparent */
  backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  min-width: 320px; /* Adjusted to more reasonable width */
  max-width: 360px; /* Set max width for consistent appearance */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
  animation: ${fadeIn} 0.6s ease-out;
  font-family: 'Inter', sans-serif;
  
  position: relative;
  background: #0d0f14;
  background-clip: padding-box;
  border: 1px solid transparent;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    margin: -1px;
    border-radius: inherit;
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 1200px) {
    min-width: 300px;
  }
  
  @media (max-width: 1000px) {
    min-width: 280px;
  }
      
  @media (max-width: 768px) {
    min-width: 85%;
    max-width: 85%;
  }
  
  @media (max-width: 480px) {
    min-width: 85%;
    max-width: 85%;
  }
`;

const imageZoom = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
`;

const imageShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
`;

const TrekImage = styled.div`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.6s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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

const overlayReveal = keyframes`
  from { opacity: 0.7; }
  to { opacity: 1; }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const DifficultyTag = styled.div`
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

const TrekTags = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
`;

// We'll keep this for backward compatibility but rename it
const BackwardsCompatTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  gap: 4px;
  
  svg {
    font-size: 1rem;
  }
`;

const LocationTag = styled(Tag)`
  background: rgba(124, 58, 237, 0.9);
  color: white;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  color: #ccc;
  font-size: 0.95rem;
  flex-wrap: wrap;
  align-items: center;
  
  &:last-of-type {
    margin-bottom: 20px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
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

// Components have been moved to the top of the file to fix ESLint errors

// Add missing components for ESLint errors
const StarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.div`
  margin-right: 2px;
`;

const ReviewCount = styled.span`
  font-size: 0.85rem;
  opacity: 0.8;
  margin-left: 4px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

// Scroll indicator components
const ScrollIndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
`;

const ScrollIndicator = styled.div`
  width: 30px;
  height: 5px;
  border-radius: 5px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

// Premium Trek Card Component - clean, elegant design following specifications
const PremiumTrekCard = styled.div`
  width: 100%;
  max-width: 320px;
  border-radius: 16px;
  background-color: #0d0f14;
  color: white;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 360px) {
    max-width: 100%;
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  height: 220px;
  width: 100%;
  overflow: hidden;
`;

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
  
  ${PremiumTrekCard}:hover & {
    transform: scale(1.05);
  }
`;

const DifficultyBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(124, 58, 237, 0.9);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  z-index: 2;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const PremiumTrekTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
`;

const MetaDataRow = styled.div`
  display: flex;
  align-items: center;
  color: #a1a1aa;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 12px;
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
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #7c3aed;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #8b5cf6;
    transform: translateY(-2px);
  }
`;

// Clean, premium trek card component following design specifications


// Treks will be fetched from Firebase

export default function FeaturedTreks() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [treks, setTreks] = useState([]);
  
  // Include the global fonts
  useEffect(() => {
    // Add any font initialization logic here if needed
  }, []);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchValue, setLocalSearchValue] = useState('');
  const { searchQuery, updateSearchQuery, searchTreks } = useSearch();

  // Fetch treks from Firebase when component mounts
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        
        // Check if the treks collection exists
        const treksCollection = collection(db, "treks");
        
        try {
          const treksSnapshot = await getDocs(treksCollection);
          const treksData = treksSnapshot.docs
            .filter(doc => doc.id !== "placeholder" && doc.data().title) // Filter out placeholder docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
          
          if (treksData.length === 0) {
            console.log("No treks found. Admin needs to add treks.");
          }
          
          setTreks(treksData);
        } catch (fetchError) {
          console.error("Error fetching trek documents:", fetchError);
          setError("Unable to load treks. The trek data might not be initialized yet. Please contact the administrator.");
        }
      } catch (err) {
        console.error("Error fetching treks:", err);
        setError("Failed to load treks. Please try again later or contact support.");
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  // Optimized scrolling with requestAnimationFrame
  const handleScroll = (direction) => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      const { scrollLeft, clientWidth } = scrollRef.current;
      const cardWidth = clientWidth / 2; // Scroll by half a view width
      
      const scrollTo = direction === 'left' 
        ? scrollLeft - cardWidth
        : scrollLeft + cardWidth;
      
      // Use standard scrollTo for smoother scrolling
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.scrollLeft = scrollTo;
      
      setTimeout(() => {
        if (scrollRef.current) {
          const totalWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          const progress = Math.min(Math.max(scrollRef.current.scrollLeft / totalWidth, 0), 1);
          const newIndex = Math.min(
            Math.floor(progress * treks.length),
            treks.length - 1
          );
          setActiveIndex(newIndex);
          setIsScrolling(false);
        }
      }, 300); // Reduced timeout for better responsiveness
    }
  };

  const handleIndicatorClick = (index) => {
    if (scrollRef.current && !isScrolling) {
      setIsScrolling(true);
      const totalWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const scrollTo = (index / (treks.length - 1)) * totalWidth;
      
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.scrollLeft = scrollTo;
      
      setActiveIndex(index);
      setTimeout(() => setIsScrolling(false), 300);
    }
  };
  
  const navigateToTrekDetails = (trekId) => {
    navigate(`/trek/${trekId}`);
  };

  // Optimized scroll event handler with debounce effect
  useEffect(() => {
    let scrollTimeout;
    
    const handleScrollUpdate = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        if (scrollRef.current && !isScrolling) {
          const totalWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          const progress = Math.min(Math.max(scrollRef.current.scrollLeft / totalWidth, 0), 1);
          const newIndex = Math.min(
            Math.floor(progress * treks.length),
            treks.length - 1
          );
          
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        }
      }, 50);
    };

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScrollUpdate, { passive: true });
      return () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        ref.removeEventListener('scroll', handleScrollUpdate);
      };
    }  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isScrolling, treks.length]);  return (
    <Section>
      <GlobalFonts />
      {/* Enhanced Map Pattern */}
      <MapPatternBackground />
      <Overlay />
      
      {/* Removed decorative floating elements */}
      
      <SectionContent>
        <Heading>Featured Treks</Heading>
        <Underline />
        <Subtitle>Discover breathtaking adventures, from mountain peaks to hidden valleys. Perfect for explorers of all levels!</Subtitle>
        
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px', 
            flexDirection: 'column',
            color: 'white',
            gap: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '5px solid rgba(128, 255, 219, 0.3)',
              borderTopColor: '#5390D9',
              animation: 'spin 1.5s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
            <p style={{ fontSize: '1.2rem' }}>Loading treks...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        ) : treks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px 20px' 
          }}>
            <p>No treks found. Please check back later!</p>          </div>        ) : (
          <>
          <ScrollContainer>
            <PrevButton 
              onClick={() => handleScroll('left')}
              disabled={activeIndex === 0 || isScrolling}
              aria-label="Previous treks"
            >
              <FiChevronLeft />
            </PrevButton>
              <TrekListContainer ref={scrollRef}>
              
              {/* Dynamic Cards from Database - Updated to match SearchResultsPage design */}
              {treks.map((trek, idx) => (
                <TrekCard key={idx} onClick={() => navigateToTrekDetails(trek.id)}>
                  <TrekImageWrapper>
                    <TrekImage style={{backgroundImage: `url(${getValidImageUrl(trek.image)})`}} />
                    <DifficultyTag>{trek.difficulty || "Easy"}</DifficultyTag>
                    
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
                  
                  <TrekInfo>
                    <TrekTitle>{trek.title}</TrekTitle>
                    <TrekLocation>
                      <FiMapPin />
                      {trek.location || trek.country || "Location"}
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
                          {trek.days || 1} days
                        </TrekDetail>
                        <TrekDetail>
                          <FiUsers />
                          {trek.capacity || '8-12'}
                        </TrekDetail>
                        <TrekDetail>
                          <FiCalendar />
                          {trek.season || 'All seasons'}
                        </TrekDetail>
                      </TrekDetails>
                      
                      {trek.rating && (
                        <TrekRating>
                          <FiStar />
                          {trek.rating}
                          <span className="reviews">({trek.reviews || 0})</span>
                        </TrekRating>
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
                  </TrekInfo>
                </TrekCard>
              ))}
            </TrekListContainer>
          
          <NextButton 
            onClick={() => handleScroll('right')}
            disabled={activeIndex === treks.length - 1 || isScrolling}
            aria-label="Next treks"
          >
            <FiChevronRight />
          </NextButton>        </ScrollContainer>
        
        <ScrollIndicatorContainer>
          {treks.map((_, idx) => (
            <ScrollIndicator 
              key={idx} 
              active={idx === activeIndex}
              onClick={() => handleIndicatorClick(idx)}
              aria-label={`Go to trek ${idx + 1}`}
            />
          ))}
        </ScrollIndicatorContainer>
      </>
      )}
      </SectionContent>
    </Section>
  );
}

const TrekInfo = styled.div`
  padding: 20px;
  background: #0d0f14;
  color: #ffffff;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.2;
  color: #ffffff;
`;

// Simplified SeasonBadge component
const SeasonBadge = styled(MetaItem)`
  svg {
    color: #7c3aed;
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