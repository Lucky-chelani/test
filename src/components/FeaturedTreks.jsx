import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import mapPattern from "../assets/images/map-pattren.png";
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin, FiCalendar, FiArrowRight, FiSearch } from 'react-icons/fi';
import { FaMountain, FaStar } from 'react-icons/fa';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getValidImageUrl } from "../utils/images";
import { useSearch } from "../context/SearchContext";
// import { MetaRow, MetaItem, TrekRating } from "./TrekCardComponents";

// Define these components directly in this file as fallback
const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const metaShimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e0e0e0;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.07);
  padding: 14px 20px;
  border-radius: 14px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  flex-grow: 1;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(76, 111, 255, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #64B5F6, #1976D2);
    opacity: 0.6;
    transition: all 0.3s ease;
  }
  
  /* Add gradient shimmer on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(76, 111, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.09);
    transform: translateY(-4px) translateX(2px);
    box-shadow: 0 12px 25px rgba(76, 111, 255, 0.25);
    border-color: rgba(76, 111, 255, 0.3);
    
    &::before {
      opacity: 1;
      animation: ${metaShimmer} 2s infinite;
    }
    
    &::after {
      opacity: 1;
      height: 100%;
      width: 6px;
      background: linear-gradient(to bottom, #64B5F6, #1976D2, #0D47A1);
    }
  }
  
  svg {
    color: #64B5F6;
    min-width: 16px;
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
  }
  
  &:hover svg {
    color: #90CAF9;
    transform: scale(1.1) translateY(-2px);
  }
  
  span {
    font-weight: 600;
    letter-spacing: 0.2px;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    gap: 8px;
    padding: 10px 16px;
  }
`;

const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 16px 0 8px 0;
  color: #eee;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(255, 255, 255, 0.02), 
      rgba(255, 193, 7, 0.2), 
      rgba(255, 255, 255, 0.02));
  }
  
  svg {
    color: #FFC107;
    font-size: 1.1rem;
  }
  
  .reviews {
    opacity: 0.8;
    font-size: 0.9rem;
    margin-left: 5px;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid rgba(255, 193, 7, 0.15);
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15));
      transform: translateY(-1px);
    }
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

// Enhanced navigation buttons
const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(128, 255, 219, 0.1);
  border: 1px solid rgba(128, 255, 219, 0.3);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  will-change: transform, background-color;
  
  /* Removed backdrop-filter for better performance */
  
  &:hover {
    background: rgba(128, 255, 219, 0.2);
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
  left: -27px;
  
  @media (max-width: 768px) {
    left: -15px;
  }
  
  @media (max-width: 480px) {
    left: -10px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: -27px;
  
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

// Premium card with enhanced dark modern design and 3D effect
const TrekCard = styled.div`
  background: linear-gradient(135deg, #121212 30%, #1a1f35 100%);
  border-radius: 16px;
  overflow: hidden;
  min-width: 450px; /* Increased card width */
  box-shadow: 0 15px 35px rgba(76, 111, 255, 0.25);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  flex-shrink: 0;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  animation: ${fadeIn} 0.6s ease-out;
  transform-style: preserve-3d;
  transform-origin: center center;
  
  @media (min-width: 769px) {
    &:hover {
      transform: translateY(-10px) perspective(1200px) rotateY(5deg) rotateX(-2deg);
      box-shadow: 0 20px 40px rgba(76, 111, 255, 0.35), -5px 20px 20px rgba(76, 111, 255, 0.1);
      border-color: rgba(76, 111, 255, 0.2);
    }
  }
  
  @media (max-width: 1200px) {
    min-width: 420px;
  }
  
  @media (max-width: 1000px) {
    min-width: 380px;
  }
      
  @media (max-width: 768px) {
    min-width: 85%;
    max-width: 85%;
  }
  
  @media (max-width: 480px) {
    min-width: 90%;
    max-width: 90%;
  }
`;

const TrekImageWrapper = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
`;

const TrekImage = styled.div`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.6s cubic-bezier(0.33, 1, 0.68, 1);
  filter: saturate(1.1) contrast(1.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.9) 100%
    );
    z-index: 1;
    transition: opacity 0.6s ease;
  }
  
  @media (min-width: 769px) {
    ${TrekCard}:hover & {
      transform: scale(1.08);
      filter: saturate(1.3) contrast(1.15) brightness(1.1);
      
      &::before {
        opacity: 0.8;
      }
    }
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
  z-index: 2;
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
`;

const InfoBadge = styled.div`
  background: rgba(33, 150, 243, 0.25);
  border: 1px solid rgba(33, 150, 243, 0.4);
  border-radius: 12px;
  padding: 10px 18px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.25);
  transition: all 0.3s ease;
  flex-grow: 1;
  justify-content: center;
  
  &:hover {
    background: rgba(33, 150, 243, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(33, 150, 243, 0.35);
  }
  
  svg {
    color: #81D4FA;
    font-size: 1.2rem;
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
  gap: 12px;
  z-index: 10;
  flex-wrap: wrap;
  animation: fadeIn 0.5s ease-out;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  gap: 6px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  svg {
    flex-shrink: 0;
    font-size: 1.2rem;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

// Modern glass-effect difficulty tag
const DifficultyTag = styled(Tag)`
  background: rgba(255, 87, 34, 0.2);
  color: white;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.25);
  border: 1px solid rgba(255, 87, 34, 0.4);
  min-width: 90px;
  justify-content: center;
  
  svg {
    color: #FF8A65;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    min-width: 80px;
    font-size: 0.8rem;
  }
`;

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

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const Price = styled.div`
  color: #333;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  
  span {
    font-size: 0.95rem;
    color: #888;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    span {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    justify-content: center;
    
    span {
      font-size: 0.85rem;
    }
  }
`;

// Star rating components with animation
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
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 10px 0 5px 0;
  font-size: 0.9rem;
  color: #fff;
`;

const buttonHover = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const arrowAnimation = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(4px); }
  100% { transform: translateX(0); }
`;

const ViewButton = styled.button`
  background: linear-gradient(135deg, #5390D9, #4C6FFF, #5E60CE, #4C6FFF);
  background-size: 300% 300%;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px 30px;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(76, 111, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 160px;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 20px;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: 0.5s;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px; 
    padding: 2px;
    background: linear-gradient(135deg, #7FC8F8, #4C6FFF);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    animation: ${buttonHover} 3s ease infinite;
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(76, 111, 255, 0.5);
  }
      
  &:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 5px 15px rgba(76, 111, 255, 0.3);
  }
  
  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
    font-size: 1.3rem;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  &:hover svg {
    transform: translateX(6px);
    animation: ${arrowAnimation} 1.5s ease infinite;
  }
  
  @media (max-width: 768px) {
    padding: 14px 25px;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 22px;
    font-size: 0.95rem;
  }
`;

// Enhanced scroll indicators
const ScrollIndicatorContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  color: #b0b0b0;
  font-size: 1.05rem;
  margin: 14px 0;
  letter-spacing: 0.3px;
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

// Treks will be fetched from Firebase

export default function FeaturedTreks() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [treks, setTreks] = useState([]);
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
  }, [activeIndex, isScrolling, treks.length]);
  return (
    <Section>
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
            {treks.map((trek, idx) => (
              <TrekCard key={idx}>
                <TrekImageWrapper>
                  <TrekImage style={{backgroundImage: `url(${getValidImageUrl(trek.image)})`}} />
                  <ImageOverlay />
                  <TrekTags>
                    <LocationTag><FiMapPin /> {trek.location || trek.country || "Location"}</LocationTag>
                    <DifficultyTag><FaMountain /> {trek.difficulty || "Easy"}</DifficultyTag>
                  </TrekTags>                  <TrekTitle>{trek.title}</TrekTitle>
                  {(trek.organizerName || trek.organizer) && (
                    <OrganizerRow>
                      <OrganizerIcon>
                        <FaMountain />
                      </OrganizerIcon>
                      <OrganizerText>
                        Organized by <OrganizerName>{trek.organizerName || trek.organizer}</OrganizerName>
                      </OrganizerText>
                    </OrganizerRow>
                  )}
                </TrekImageWrapper>                <TrekInfo>
                  <MetaRow>
                    <MetaItem>
                      <FiClock />
                      <span>{trek.days} Days</span>
                    </MetaItem>
                    <MetaItem>
                      <FiMapPin />
                      <span>{trek.location || trek.country || "Location"}</span>
                    </MetaItem>
                  </MetaRow>
                  
                  <MetaRow>
                    <SeasonBadge>
                      <FiCalendar />
                      <span>{trek.season || trek.month || "Year-round"}</span>
                    </SeasonBadge>
                  </MetaRow>
                  
                  {trek.rating && (
                    <TrekRating>
                      <StarContainer>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i}>
                            <FaStar style={{ opacity: i < Math.floor(trek.rating) ? 1 : 0.3 }} />
                          </Star>
                        ))}
                      </StarContainer>
                      <span>{trek.rating}</span>
                      {trek.reviews && <ReviewCount>({trek.reviews} reviews)</ReviewCount>}
                    </TrekRating>
                  )}
                  
                  <PriceTag>
                    <span>₹</span>{trek.price || "4,999"}
                  </PriceTag>
                  
                  <ActionRow>
                    <ViewButton onClick={() => navigateToTrekDetails(trek.id)}>
                      View Trek <FiArrowRight />
                    </ViewButton>
                  </ActionRow>
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
  padding: 28px 24px;
  background: linear-gradient(135deg, #121212 30%, #1a1f35 100%);
  color: #ffffff;
  position: relative;
  z-index: 3;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(76, 111, 255, 0.3), transparent);
  }
  
  /* Subtle background pattern */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    background-image: 
      linear-gradient(30deg, rgba(76, 111, 255, 0.3) 12%, transparent 12.5%, transparent 87%, rgba(76, 111, 255, 0.3) 87.5%, rgba(76, 111, 255, 0.3)),
      linear-gradient(150deg, rgba(76, 111, 255, 0.3) 12%, transparent 12.5%, transparent 87%, rgba(76, 111, 255, 0.3) 87.5%, rgba(76, 111, 255, 0.3)),
      linear-gradient(30deg, rgba(76, 111, 255, 0.3) 12%, transparent 12.5%, transparent 87%, rgba(76, 111, 255, 0.3) 87.5%, rgba(76, 111, 255, 0.3)),
      linear-gradient(150deg, rgba(76, 111, 255, 0.3) 12%, transparent 12.5%, transparent 87%, rgba(76, 111, 255, 0.3) 87.5%, rgba(76, 111, 255, 0.3)),
      linear-gradient(60deg, rgba(76, 111, 255, 0.2) 25%, transparent 25.5%, transparent 75%, rgba(76, 111, 255, 0.2) 75%, rgba(76, 111, 255, 0.2)),
      linear-gradient(60deg, rgba(76, 111, 255, 0.2) 25%, transparent 25.5%, transparent 75%, rgba(76, 111, 255, 0.2) 75%, rgba(76, 111, 255, 0.2));
    background-size: 80px 140px;
    background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
    z-index: -1;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 28px 22px;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 18px;
    gap: 14px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  line-height: 1.3;
  position: absolute;
  bottom: 60px;
  left: 20px;
  right: 20px;
  z-index: 5;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    bottom: 58px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    bottom: 58px;
  }
`;

const OrganizerRow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(to top, 
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.8) 50%, 
    rgba(0, 0, 0, 0) 100%);
  z-index: 5;
  height: 40px;
`;

const OrganizerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.9rem;
  color: #4CC9F0;
  background: rgba(76, 201, 240, 0.15);
  border-radius: 50%;
  padding: 4px;
`;

const OrganizerText = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const OrganizerName = styled.span`
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 3px;
`;

// Add a month/season indicator component for the trek card
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
    padding: 6px 10px;
    font-size: 0.8rem;
    right: 12px;
    top: 12px;
  }
`;

const MonthIndicator = SeasonBadge;

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