import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import chatroomImg from '../assets/images/trek1.png';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, deleteDoc, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initializeChatrooms } from '../utils/initializeChatrooms';
import { FiUsers, FiMessageCircle, FiX, FiPlus, FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';
// Import the image utilities if available in your project
// import { getValidImageUrl } from "../utils/images";

// Helper function to handle image URLs validation
const getValidImageUrl = (url) => {
  return url && typeof url === 'string' ? url : chatroomImg;
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Enhanced Section with better styling similar to FeaturedTreks
const Page = styled.section`
  position: relative;
  min-height: 700px;
  padding: 100px 0 120px 0;
  background-color: #0a1a2f;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 70px 0 90px 0;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 50px 0 70px 0;
  }
`;

// Enhanced map pattern with higher opacity and blend mode similar to FeaturedTreks
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

const Container = styled.div`
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
  }
`;

const Section = styled.section`
  margin-bottom: 60px;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

// Enhanced heading with modern gradient similar to FeaturedTreks
const SectionTitle = styled.h2`
  color: #fff;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

// Improved underline with animation similar to FeaturedTreks
const Underline = styled.div`
  width: 80px;
  height: 6px;
  background: linear-gradient(to right, #5390D9, #7400B8);
  border-radius: 6px;
  margin: 0 auto 24px auto;
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
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
  margin-bottom: 60px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`;

// Modernized empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: rgba(24, 24, 40, 0.3);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(128, 255, 219, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: radial-gradient(circle at center, 
      rgba(128, 255, 219, 0.05) 0%, 
      rgba(83, 144, 217, 0.05) 50%, 
      rgba(116, 0, 184, 0.05) 100%);
    z-index: -1;
    animation: ${float} 15s infinite ease-in-out;
  }
  
  h3 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 32px;
    font-size: 1.1rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

// Updated button with new gradient
const CreateFirstButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(83, 144, 217, 0.4);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(83, 144, 217, 0.5);
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

// Enhanced scroll container with better scrolling similar to FeaturedTreks
const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 30px;
  max-width: calc(100vw - 40px);
  margin-left: auto;
  margin-right: auto;
`;

// Enhanced card container with better scrolling similar to FeaturedTreks
const ChatroomListContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 30px 20px 50px 20px;
  margin: 0 10px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  scroll-snap-type: x proximity;
  overscroll-behavior-x: contain;
  will-change: scroll-position;
  gap: 30px; /* Fixed gap between cards */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
  
  /* Optimized for smoother scrolling */
  @media (max-width: 768px) {
    gap: 20px;
    padding: 30px 10px 40px 10px;
  }
  > * {
    scroll-snap-align: start;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 20px 5px 40px 5px;
  }
`;

const ChatroomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

// Enhanced navigation buttons similar to FeaturedTreks
const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(83, 144, 217, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
  will-change: transform, background-color;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(83, 144, 217, 1);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
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
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: -15px;
  
  @media (max-width: 768px) {
    left: 5px;
  }
  
  @media (max-width: 480px) {
    left: 5px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: -15px;
  
  @media (max-width: 768px) {
    right: 5px;
  }
  
  @media (max-width: 480px) {
    right: 5px;
  }
`;

// Enhanced scroll indicators similar to FeaturedTreks
const ScrollIndicatorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
`;

const ScrollIndicator = styled.div`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 10px;
  background: ${props => props.active ? 
    'linear-gradient(to right, #5390D9, #7400B8)' : 
    'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  box-shadow: ${props => props.active ? 
    '0 2px 8px rgba(83, 144, 217, 0.3)' : 
    '0 1px 3px rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    transform: ${props => props.active ? 'scale(1.1)' : 'scale(1.2)'};
    background: ${props => props.active ? 
      'linear-gradient(to right, #5390D9, #7400B8)' : 
      'rgba(255, 255, 255, 0.4)'};
  }
`;

// Card with original appearance but with featured enhancements
const ChatroomCard = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.featured ? 
    '0 10px 25px rgba(83, 144, 217, 0.4), 0 0 0 2px rgba(83, 144, 217, 0.2)' : 
    '0 10px 20px rgba(0, 0, 0, 0.1)'};
  width: 340px;
  min-width: 340px;
  flex-shrink: 0;
  margin: 0; /* Remove margin and use gap instead */
  transition: all 0.3s ease;
  cursor: pointer;
  scroll-snap-align: start;
  
  ${props => props.featured && `
    position: relative;
    z-index: 2;
    background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    border: 2px solid transparent;
  `}
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.featured ? 
      '0 15px 30px rgba(83, 144, 217, 0.5), 0 0 0 3px rgba(83, 144, 217, 0.3)' : 
      '0 15px 30px rgba(0, 0, 0, 0.15)'};
  }
    @media (max-width: 1200px) {
    width: 320px;
    min-width: 320px;
  }
  
  @media (max-width: 1000px) {
    width: 300px;
    min-width: 300px;
  }
      
  @media (max-width: 768px) {
    width: 280px;
    min-width: 280px;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  @media (max-width: 480px) {
    width: 260px;
    min-width: 260px;
    flex: 0 0 auto;
  }
  
  ${props => props.isNew && css`
    &:after {
      content: 'NEW';
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(90deg, #5390D9, #7400B8);
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(83, 144, 217, 0.4);
      animation: ${pulse} 2s infinite ease-in-out;
      z-index: 10;
    }
  `}
  
  ${props => props.isFeatured && css`
    border: 2px solid gold;
    box-shadow: 0 15px 35px rgba(255, 215, 0, 0.3);
    
    &:before {
      content: 'FEATURED';
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(90deg, #FFD700, #FFA500);
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
      animation: ${pulse} 2s infinite ease-in-out;
      z-index: 10;
    }
    
    &:hover {
      box-shadow: 0 20px 40px rgba(255, 215, 0, 0.4);
    }
  `}
`;

const CreatorBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: #80FFDB;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  z-index: 10;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 75, 75, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 75, 75, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 75, 75, 0.4);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
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
  transition: transform 0.3s ease;
  will-change: transform;
  background-image: url(${props => props.src});
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
    pointer-events: none;
  }
  
  @media (min-width: 769px) {
    ${ChatroomCard}:hover & {
      transform: scale(1.05);
    }
  }
`;

// Enhanced image overlay similar to FeaturedTreks
const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(10, 26, 47, 0.5) 100%);
  z-index: 1;
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 2;
`;

const Tag = styled.span`
  background: #F7FAFF;
  color: #181828;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 6px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  svg {
    color: #666;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 14px;
  }
`;

const LocationTag = styled(Tag)`
  background: rgba(128, 255, 219, 0.2);
  border: 1px solid rgba(128, 255, 219, 0.3);
  
  svg {
    color: #5390D9;
  }
  
  /* Only animate on non-mobile devices */
  @media (min-width: 769px) {
    animation: ${floatAnimation} 5s infinite ease-in-out;
  }
`;

const MembersTag = styled(Tag)`
  background: linear-gradient(to right, #5390D9, #7400B8);
  color: white;
  font-weight: 700;
  
  svg {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const ChatroomContent = styled.div`
  padding: 28px 25px;
  background: rgba(255, 255, 255, 0.97);
  color: #111;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
  }
  
  @media (max-width: 768px) {
    padding: 22px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

const ChatroomName = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #181828;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
  line-height: 1.3;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ChatroomDescription = styled.p`
  color: #444;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
  font-size: 0.95rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #444;
  font-size: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  
  svg {
    color: #5390D9;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 16px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const MemberCount = styled.div`
  color: #181828;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  
  span {
    font-size: 0.9rem;
    color: #777;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    
    span {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    justify-content: center;
    
    span {
      font-size: 0.75rem;
    }
  }
`;

// Enhanced view button with simplified animations similar to FeaturedTreks
const JoinButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 36px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(83, 144, 217, 0.3);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
  will-change: transform;
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-2px);
  }
      
  &:active {
    transform: translateY(0);
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: linear-gradient(135deg, #3a4a63 0%, #2a294d 100%);
    box-shadow: none;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
    min-width: 120px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 0.9rem;
    min-width: unset;
  }
`;

// Enhanced error message
const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin: 12px 0;
  text-align: center;
  border-left: 4px solid #ff6b6b;
  animation: ${fadeIn} 0.3s ease-out forwards;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
`;

// Enhanced success message
const SuccessMessage = styled.div`
  color: #4ad991;
  background: rgba(74, 217, 145, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin: 12px 0;
  text-align: center;
  border-left: 4px solid #4ad991;
  animation: ${fadeIn} 0.3s ease-out forwards;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(74, 217, 145, 0.2);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
  min-height: 300px; 
  flex-direction: column;
  color: white;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid rgba(128, 255, 219, 0.3);
  border-top-color: #5390D9;
  animation: spin 1.5s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
`;

const LoadingGrid = styled.div`
  display: flex;
  gap: 30px;
  overflow-x: hidden;
  padding: 30px 15px 50px 15px;
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 20px 5px 40px 5px;
  }
`;

// Enhanced skeleton with subtle animation
const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  min-width: 380px;
  height: 450px;
  position: relative;
  border: 1px solid rgba(128, 255, 219, 0.1);
  flex-shrink: 0;
  
  @media (max-width: 1200px) {
    min-width: 340px;
  }
  
  @media (max-width: 1000px) {
    min-width: 300px;
  }
  
  @media (max-width: 768px) {
    min-width: 80%;
    max-width: 80%;
  }
  
  @media (max-width: 480px) {
    min-width: 90%;
    max-width: 90%;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.03), 
      rgba(255, 255, 255, 0.08), 
      rgba(255, 255, 255, 0.03)
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite linear;
  }
  
  &:before {
    content: '';
    position: absolute;
    height: 220px;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(83, 144, 217, 0.1);
    z-index: 1;
  }
`;

// Enhanced floating action button
const CreateRoomButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 6px 25px rgba(83, 144, 217, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
  
  &:hover {
    transform: scale(1.1) rotate(180deg);
    box-shadow: 0 8px 30px rgba(83, 144, 217, 0.6);
  }
  
  &:active {
    transform: scale(1.05) rotate(180deg);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

// Enhanced modal
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 26, 47, 0.9);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

// Enhanced modal content
const ModalContent = styled.div`
  background: linear-gradient(145deg, rgba(24, 24, 40, 0.9), rgba(10, 26, 47, 0.9));
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(128, 255, 219, 0.1);
  animation: ${fadeIn} 0.4s ease-out forwards;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, 
      rgba(128, 255, 219, 0.03) 0%, 
      rgba(83, 144, 217, 0.03) 50%, 
      rgba(116, 0, 184, 0.03) 100%);
    z-index: 0;
    animation: ${float} 20s infinite ease-in-out;
    pointer-events: none;
  }
`;

const ModalTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 30px;
  color: white;
  position: relative;
  background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

// Enhanced form inputs
const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(128, 255, 219, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(83, 144, 217, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(128, 255, 219, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(83, 144, 217, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
`;

// Enhanced cancel button
const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

// Enhanced create button
const CreateButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(83, 144, 217, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(83, 144, 217, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: linear-gradient(135deg, #3a4a63 0%, #2a294d 100%);
    box-shadow: none;
    transform: none;
  }
`;

// Confirmation modal for deletion
const ConfirmModal = styled(Modal)``;

const ConfirmModalContent = styled(ModalContent)`
  max-width: 450px;
`;

const ConfirmTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: white;
  position: relative;
  font-weight: 700;
  
  &::before {
    content: '⚠️';
    margin-right: 10px;
    font-size: 1.5rem;
  }
`;

const ConfirmText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  line-height: 1.6;
  font-size: 1.05rem;
  
  span {
    color: #ff6b6b;
    font-weight: 600;
  }
`;

const ConfirmButtonGroup = styled(ButtonGroup)`
  justify-content: space-between;
`;

const CancelDeleteButton = styled(CancelButton)`
  flex: 1;
`;

// Enhanced delete button
const ConfirmDeleteButton = styled.button`
  background: linear-gradient(90deg, #ff5e5e, #ff3a3a);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(255, 58, 58, 0.3);
  flex: 1;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(90deg, #ff3a3a, #ff2020);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 58, 58, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// Floating decoration elements
const FloatingElement = styled.div`
  position: absolute;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  background: ${props => props.color || 'rgba(128, 255, 219, 0.1)'};
  border-radius: 50%;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  z-index: 0;
  filter: blur(5px);
  animation: float-${props => props.index} 15s infinite ease-in-out;
  pointer-events: none;
  
  @keyframes float-${props => props.index} {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(${props => props.xMove || '10px'}, ${props => props.yMove || '10px'}) rotate(5deg); }
    50% { transform: translate(${props => props.xMove2 || '0'}, ${props => props.yMove2 || '20px'}) rotate(10deg); }
    75% { transform: translate(${props => props.xMove3 || '-10px'}, ${props => props.yMove3 || '10px'}) rotate(5deg); }
  }
`;

// Header styling for Communities page
const Header = styled.div`
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 5px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 5px;
  }
`;

const PageTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 15px;
  background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 20px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Community = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    desc: '',
    img: chatroomImg // default image
  });
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  // Fetch chatrooms from Firestore
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        setLoading(true);
        
        // Initialize default chatrooms if needed
        await initializeChatrooms();
        
        // Set up real-time listener for chatrooms
        const chatroomsCollection = collection(db, 'chatrooms');
        const q = query(chatroomsCollection, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const roomsData = snapshot.docs.map(doc => {
            const data = doc.data();
            // Calculate if room is new (created in last 24 hours)
            const isNew = data.createdAt && 
                        typeof data.createdAt.toDate === 'function' ? 
                        (new Date().getTime() - data.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000 :
                        false;
            return {
              ...data,
              isNew,
              docId: doc.id, // Store the Firestore document ID for deletion              // Add some additional data
              memberCount: data.members?.length || 0,
              messageCount: data.messageCount || 0,
              rating: data.rating || (4 + Math.random()).toFixed(1), // Sample rating or existing
              reviews: data.reviews || Math.floor(Math.random() * 50) + 5, // Sample review count or existing
              featured: data.featured || false // Check if community is featured
            };
          });
          
          setChatrooms(roomsData);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching chatrooms:', err);
        setError('Failed to load communities. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchChatrooms();
  }, []);
  
  // Optimized scrolling with requestAnimationFrame similar to FeaturedTreks
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
            Math.floor(progress * chatrooms.length),
            chatrooms.length - 1
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
      const scrollTo = (index / (chatrooms.length - 1)) * totalWidth;
      
      scrollRef.current.style.scrollBehavior = 'smooth';
      scrollRef.current.scrollLeft = scrollTo;
      
      setActiveIndex(index);
      setTimeout(() => setIsScrolling(false), 300);
    }
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
            Math.floor(progress * chatrooms.length),
            chatrooms.length - 1
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
    }
  }, [activeIndex, isScrolling, chatrooms.length]);
  // Enhanced handleJoinRoom function
  const handleJoinRoom = async (room) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Attempting to join room:', room);
      
      // Use the docId for Firestore operations, not the custom id
      const roomRef = doc(db, 'chatrooms', room.docId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        console.log('Room does not exist, reinitializing...');
        await initializeChatrooms();
        const recheckDoc = await getDoc(roomRef);
        if (!recheckDoc.exists()) {
          throw new Error('Failed to create community');
        }
      }

      // Get current members
      const currentMembers = roomDoc.data()?.members || [];
      
      // Only add member if not already in the room
      if (!currentMembers.includes(auth.currentUser.uid)) {
        await updateDoc(roomRef, {
          members: arrayUnion(auth.currentUser.uid),
          memberCount: (roomDoc.data()?.memberCount || 0) + 1
        });
        console.log('Successfully joined community');
      } else {
        console.log('User already in community');
      }

      // Navigate to chat screen with room ID
      navigate(`/chat/${room.id}`, { state: { room } });
      
    } catch (err) {
      console.error('Error joining room:', err);
      setError(`Failed to join community: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateRoom = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!newRoomData.name.trim() || !newRoomData.desc.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create room ID from name
      const roomId = newRoomData.name.toLowerCase().replace(/\s+/g, '-');
      
      // Sample data for the enhanced UI
      const location = "Global";
      const rating = (4 + Math.random()).toFixed(1);
      const reviews = Math.floor(Math.random() * 10) + 5;
      
      // Add room to Firestore
      const docRef = await addDoc(collection(db, 'chatrooms'), {
        id: roomId,
        name: newRoomData.name,
        desc: newRoomData.desc,
        img: newRoomData.img,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        members: [auth.currentUser.uid],
        memberCount: 1,
        messageCount: 0,
        location: location,
        rating: rating,
        reviews: reviews
      });
      
      setShowCreateModal(false);
      setNewRoomData({ name: '', desc: '', img: chatroomImg });
      setSuccess('Community created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      // Navigate to the new chat room
      navigate(`/chat/${roomId}`, { 
        state: { 
          room: { 
            id: roomId, 
            name: newRoomData.name, 
            desc: newRoomData.desc, 
            img: newRoomData.img,
            docId: docRef.id
          } 
        } 
      });
      
    } catch (err) {
      console.error('Error creating room:', err);
      setError(`Failed to create community: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRoom = (room, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteRoom = async () => {
    if (!roomToDelete || !auth.currentUser) return;
    
    try {
      setLoading(true);
      
      // Delete the room document
      await deleteDoc(doc(db, 'chatrooms', roomToDelete.docId));
      
      setShowDeleteModal(false);
      setRoomToDelete(null);
      setSuccess('Community deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting room:', err);
      setError(`Failed to delete community: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Page>
      {/* Enhanced Map Pattern */}
      <MapPatternBackground />
      <Overlay />
        <Container>
        <Header>
          <PageTitle>Trek Communities</PageTitle>          <PageSubtitle>
            Join discussions, share experiences, and connect with fellow trekking enthusiasts around the world.
          </PageSubtitle>
        </Header>
        
        {!loading && chatrooms.some(room => room.featured) && (
          <Section>
            <SectionTitle>Featured Communities</SectionTitle>
            <Underline />
            <Subtitle>Our hand-picked selection of the best trekking communities</Subtitle>
            
            <ChatroomGrid>
              {chatrooms
                .filter(room => room.featured)
                .map((room) => (
                  <ChatroomCard 
                    key={room.id} 
                    isNew={room.isNew} 
                    featured={room.featured} 
                    onClick={() => handleJoinRoom(room)}
                  >
                    {room.createdBy === auth.currentUser?.uid && (
                      <>
                        <CreatorBadge>Creator</CreatorBadge>
                        <DeleteButton onClick={(e) => handleDeleteRoom(room, e)}>
                          <FiX />
                        </DeleteButton>
                      </>
                    )}
                    {room.featured && (
                      <FeaturedBadge>Featured</FeaturedBadge>
                    )}
                    <TrekImageWrapper>
                      <TrekImage src={getValidImageUrl(room.img)} />
                      <ImageOverlay />
                      <TrekTags>
                        <LocationTag><FiMapPin /> {room.location || "Global"}</LocationTag>
                        <MembersTag><FiUsers /> {room.memberCount} members</MembersTag>
                      </TrekTags>
                    </TrekImageWrapper>
                    <ChatroomContent>
                      <ChatroomName>{room.name}</ChatroomName>
                      <InfoRow>
                        <InfoItem>
                          <FiUsers />
                          <span>{room.memberCount} members</span>
                        </InfoItem>
                        <InfoItem>
                          <FiMessageCircle />
                          <span>{room.messageCount} messages</span>
                        </InfoItem>
                      </InfoRow>
                      <ChatroomDescription>{room.desc}</ChatroomDescription>
                      <RatingRow>
                        <div style={{ display: 'flex' }}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: '#5390D9' }}>★</span>
                          ))}
                        </div>
                        <span>{room.rating} <span style={{ color: '#777', fontSize: '0.9rem' }}>({room.reviews} reviews)</span></span>
                      </RatingRow>
                      <ActionRow>
                        <MemberCount>{room.memberCount} <span>members</span></MemberCount>
                        <JoinButton disabled={loading}>
                          Join Community
                          <FiArrowRight />
                        </JoinButton>
                      </ActionRow>
                    </ChatroomContent>
                  </ChatroomCard>
                ))}
            </ChatroomGrid>
          </Section>
        )}
        
        <Section>
          <SectionTitle>Explore Trek Communities</SectionTitle>
          <Underline />
          <Subtitle>Join trekking communities around the world, share your adventures, and connect with fellow trekkers!</Subtitle>
            {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Loading communities...</LoadingText>
            </LoadingContainer>
          ) : chatrooms.length === 0 ? (
            <EmptyState>
              <h3>No Communities Yet</h3>
              <p>Be the first to create a trekking community where explorers can share tips, routes, and stories!</p>
              <CreateFirstButton onClick={() => setShowCreateModal(true)}>
                Create Your Community
              </CreateFirstButton>
            </EmptyState>
          ) : (
            <>
              <ScrollContainer>
                <PrevButton 
                  onClick={() => handleScroll('left')}
                  disabled={activeIndex === 0 || isScrolling}
                  aria-label="Previous communities"
                >
                  <FiChevronLeft />
                </PrevButton>
                
                <ChatroomListContainer ref={scrollRef}>
                  {chatrooms.map((room) => (
                    <ChatroomCard key={room.id} isNew={room.isNew} featured={room.featured} onClick={() => handleJoinRoom(room)}>
                      {room.createdBy === auth.currentUser?.uid && (
                        <>
                          <CreatorBadge>Creator</CreatorBadge>
                          <DeleteButton onClick={(e) => handleDeleteRoom(room, e)}>
                            <FiX />
                          </DeleteButton>
                        </>
                      )}
                      {room.featured && (
                        <FeaturedBadge>Featured</FeaturedBadge>
                      )}
                      <TrekImageWrapper>
                        <TrekImage src={getValidImageUrl(room.img)} />
                        <ImageOverlay />
                        <TrekTags>
                          <LocationTag><FiMapPin /> {room.location || "Global"}</LocationTag>
                          <MembersTag><FiUsers /> {room.memberCount} members</MembersTag>
                        </TrekTags>
                      </TrekImageWrapper>
                      <ChatroomContent>
                        <ChatroomName>{room.name}</ChatroomName>
                        <InfoRow>
                          <InfoItem>
                            <FiUsers />
                            <span>{room.memberCount} members</span>
                          </InfoItem>
                          <InfoItem>
                            <FiMessageCircle />
                            <span>{room.messageCount} messages</span>
                          </InfoItem>
                        </InfoRow>
                        <ChatroomDescription>{room.desc}</ChatroomDescription>
                        <RatingRow>
                          <div style={{ display: 'flex' }}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: '#5390D9' }}>★</span>
                            ))}
                          </div>
                          <span>{room.rating} <span style={{ color: '#777', fontSize: '0.9rem' }}>({room.reviews} reviews)</span></span>
                        </RatingRow>
                        <ActionRow>
                          <MemberCount>{room.memberCount} <span>members</span></MemberCount>
                          <JoinButton disabled={loading}>
                            Join Community
                            <FiArrowRight />
                          </JoinButton>
                        </ActionRow>
                      </ChatroomContent>
                    </ChatroomCard>
                  ))}
                </ChatroomListContainer>
                
                <NextButton 
                  onClick={() => handleScroll('right')}
                  disabled={activeIndex === chatrooms.length - 1 || isScrolling}
                  aria-label="Next communities"
                >
                  <FiChevronRight />
                </NextButton>
              </ScrollContainer>
              
              <ScrollIndicatorContainer>
                {chatrooms.map((_, idx) => (
                  <ScrollIndicator 
                    key={idx} 
                    active={idx === activeIndex}
                    onClick={() => handleIndicatorClick(idx)}
                    aria-label={`Go to community ${idx + 1}`}
                  />
                ))}
              </ScrollIndicatorContainer>
            </>
          )}
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <CreateRoomButton onClick={() => setShowCreateModal(true)}>
          <FiPlus />
        </CreateRoomButton>
        
        <Modal show={showCreateModal}>
          <ModalContent>
            <ModalTitle>Create New Community</ModalTitle>
            
            <FormGroup>
              <Label>Community Name</Label>
              <Input 
                type="text" 
                value={newRoomData.name}
                onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})}
                placeholder="e.g., Andes Explorers"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea 
                value={newRoomData.desc}
                onChange={(e) => setNewRoomData({...newRoomData, desc: e.target.value})}
                placeholder="Describe what this community is about..."
              />
            </FormGroup>
            
            <ButtonGroup>
              <CancelButton onClick={() => setShowCreateModal(false)}>Cancel</CancelButton>
              <CreateButton 
                onClick={handleCreateRoom}
                disabled={loading || !newRoomData.name.trim() || !newRoomData.desc.trim()}
              >
                {loading ? 'Creating...' : 'Create Community'}
              </CreateButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
        
        <ConfirmModal show={showDeleteModal}>
          <ConfirmModalContent>
            <ConfirmTitle>Delete Community?</ConfirmTitle>
            <ConfirmText>
              Are you sure you want to delete the community "<span>{roomToDelete?.name}</span>"? 
              This action cannot be undone and all messages will be permanently deleted.
            </ConfirmText>
            
            <ConfirmButtonGroup>
              <CancelDeleteButton onClick={() => setShowDeleteModal(false)}>
                Cancel
              </CancelDeleteButton>
              <ConfirmDeleteButton 
                onClick={confirmDeleteRoom}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Community'}
              </ConfirmDeleteButton>
            </ConfirmButtonGroup>
          </ConfirmModalContent>
        </ConfirmModal>
      </Container>
    </Page>
  );
};

export default Community;
