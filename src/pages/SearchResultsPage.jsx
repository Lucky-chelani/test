import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FiSearch, FiX, FiFilter, FiMapPin, FiChevronDown, FiChevronUp, FiClock, FiCalendar, FiUsers, FiHeart, FiChevronRight } from 'react-icons/fi';
import { FaMountain, FaSnowflake, FaSun, FaLeaf, FaCloudRain } from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getValidImageUrl } from '../utils/images';
import { useSearch } from '../context/SearchContext';
import Footer from '../components/Footer';
import mapPattern from '../assets/images/map-pattren.png';
import mountainBg from '../assets/images/mountain-bg.png';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 15px rgba(128, 255, 219, 0.3)); }
  50% { filter: drop-shadow(0 0 25px rgba(128, 255, 219, 0.5)); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const mountainRise = keyframes`
  from { transform: translateY(30px); opacity: 0.3; }
  to { transform: translateY(0); opacity: 1; }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

// Main Container
const SearchPageContainer = styled.div`
  min-height: 100vh;
  background-color: #080812;
  color: #fff;
  padding-top: 90px;
  padding-bottom: 60px;
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 250px;
    background: linear-gradient(to bottom, rgba(10, 10, 40, 0.8) 0%, rgba(10, 10, 40, 0) 100%);
    pointer-events: none;
    z-index: 3;
  }
`;

const MapPatternBackground = styled.div`
  position: fixed;
  inset: 0;
  opacity: 0.08; 
  background: url(${mapPattern});
  background-size: 600px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 0;
  animation: ${breathe} 20s infinite ease-in-out;
`;

const MountainBackground = styled.div`
  position: fixed;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 30%;
  background: url(${mountainBg});
  background-size: cover;
  background-position: center bottom;
  opacity: 0.3;
  pointer-events: none;
  z-index: 1;
  animation: ${mountainRise} 2s ease-out forwards;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top right, 
    rgba(10, 10, 40, 0.7) 0%, 
    rgba(0, 0, 0, 0.9) 100%);
  z-index: 1;
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media (max-width: 768px) {
    padding: 0 24px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

const SearchHeader = styled.div`
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      transparent 0%, 
      rgba(128, 255, 219, 0.3) 20%, 
      rgba(128, 255, 219, 0.8) 50%, 
      rgba(128, 255, 219, 0.3) 80%, 
      transparent 100%);
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #ffffff 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 15px;
  
  &:before {
    content: '🏔️';
    font-size: 2.5rem;
    -webkit-text-fill-color: initial;
    animation: ${float} 3s infinite ease-in-out;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    
    &:before {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    
    &:before {
      font-size: 1.5rem;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  line-height: 1.6;
  margin-top: 10px;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SearchBarContainer = styled.div`
  margin: 30px 0;
  max-width: 800px;
  width: 100%;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
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
  padding: 18px 60px 18px 25px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 480px) {
    padding: 16px 50px 16px 20px;
    font-size: 1rem;
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
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
  }
  
  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
  }
`;

const ClearButton = styled(IconButton)`
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

const FilterButton = styled(IconButton)`
  right: 115px;
  background: ${props => props.active ? 'rgba(128, 255, 219, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  font-size: 1rem;
  
  &:hover {
    background: rgba(128, 255, 219, 0.3);
  }
  
  @media (max-width: 480px) {
    right: 95px;
  }
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(250px, 1fr) 3fr;
  gap: 30px;
  align-items: start;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FilterPanelWrapper = styled.div`
  position: sticky;
  top: 120px;
  height: fit-content;
  
  @media (max-width: 992px) {
    position: relative;
    top: 0;
    ${props => !props.isOpen && `
      display: none;
    `}
  }
`;

const MobileFilterToggle = styled.button`
  display: none;
  width: 100%;
  padding: 15px;
  background: rgba(83, 144, 217, 0.2);
  border: 1px solid rgba(83, 144, 217, 0.3);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(83, 144, 217, 0.3);
  }
  
  @media (max-width: 992px) {
    display: flex;
  }
`;

const FilterPanel = styled.div`
  background: rgba(10, 10, 40, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(128, 255, 219, 0.1);
  overflow: hidden;
  animation: ${fadeInLeft} 0.5s ease-out forwards;
`;

const FilterContent = styled.div`
  padding: 25px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const FilterHeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  
  svg {
    color: rgba(128, 255, 219, 0.8);
  }
`;

const ResetFilters = styled.button`
  background: transparent;
  border: none;
  color: rgba(128, 255, 219, 0.8);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  padding: 5px;
  
  &:hover {
    color: rgba(128, 255, 219, 1);
    text-decoration: underline;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 25px;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  
  svg {
    color: rgba(128, 255, 219, 0.8);
  }
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const FilterOption = styled.button`
  padding: 8px 15px;
  border-radius: 20px;
  background: ${props => props.active ? 'rgba(128, 255, 219, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? 'rgba(128, 255, 219, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 0.9rem;
  }
  
  &:hover {
    background: rgba(128, 255, 219, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeInRight} 0.5s ease-out forwards;
`;

const SearchResultsContainer = styled.div`
  background: rgba(20, 20, 40, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(128, 255, 219, 0.1);
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

const ResultsHeader = styled.div`
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const ResultsCount = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  
  span {
    color: #fff;
    font-weight: 600;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SortLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: rgba(128, 255, 219, 0.8);
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  outline: none;
  flex-grow: 1;
  
  option {
    background: #111;
    color: white;
  }
`;

const ResultsContent = styled.div`
  padding: 25px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TrekCard = styled.div`
  background: rgba(20, 20, 40, 0.6);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.4s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.1}s;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(128, 255, 219, 0.3);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(83, 144, 217, 0) 0%, 
      rgba(83, 144, 217, 0.8) 50%, 
      rgba(83, 144, 217, 0) 100%);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.4s ease;
  }
  
  &:hover:after {
    transform: scaleX(1);
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
  transition: transform 0.5s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0) 50%
    );
    z-index: 1;
  }
  
  ${TrekCard}:hover & {
    transform: scale(1.05);
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  color: ${props => props.favorite ? '#FF5370' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: ${props => props.favorite ? 'scale(1.1)' : 'translateY(-3px)'};
  }
  
  ${props => props.favorite && css`
    animation: ${pulse} 0.5s ease;
  `}
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2), 
    rgba(0, 0, 0, 0.7)
  );
  z-index: 1;
`;

const TrekTags = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 70px;
  display: flex;
  gap: 8px;
  z-index: 10;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  gap: 6px;
  
  svg {
    flex-shrink: 0;
    font-size: 1rem;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-2px);
  }
`;

const DifficultyTag = styled(Tag)`
  background: #FF5722;
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
`;

const LocationTag = styled(Tag)`
  background: #2196F3;
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
`;

const TrekInfo = styled.div`
  padding: 20px;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TrekTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #fff;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background: linear-gradient(to right, rgba(128, 255, 219, 0.8), transparent);
    margin-top: 8px;
  }
`;

const TrekDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const TrekFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 15px 0;
`;

const TrekFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  
  svg {
    color: rgba(128, 255, 219, 0.8);
    font-size: 1rem;
  }
`;

const TrekMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MetaGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const MetaLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  
  svg {
    font-size: 1rem;
    color: rgba(128, 255, 219, 0.8);
  }
`;

const Price = styled.div`
  font-weight: 700;
  font-size: 1.3rem;
  background: linear-gradient(to right, #5390D9, #80FFD9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  &:after {
    content: 'per person';
    font-size: 0.75rem;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.5);
    -webkit-text-fill-color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ViewButton = styled.button`
  grid-column: 1 / -1;
  padding: 12px;
  background: linear-gradient(135deg, rgba(83, 144, 217, 0.2) 0%, rgba(128, 255, 219, 0.2) 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(83, 144, 217, 0.5), rgba(128, 255, 219, 0.5));
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    
    &:before {
      opacity: 1;
    }
    
    svg {
      transform: translateX(3px);
    }
  }
  
  svg {
    transition: transform 0.3s;
  }
`;

// Similar Treks Section
const SimilarTreksSection = styled.div`
  margin-top: 40px;
  animation: ${fadeIn} 0.6s ease-out;
  background: rgba(20, 20, 40, 0.4);
  border-radius: 15px;
  border: 1px solid rgba(128, 255, 219, 0.1);
  padding: 25px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: rgba(128, 255, 219, 0.8);
  }
`;

const ViewAll = styled.a`
  color: rgba(83, 144, 217, 0.8);
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  background: rgba(83, 144, 217, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  
  &:hover {
    color: rgba(83, 144, 217, 1);
    background: rgba(83, 144, 217, 0.2);
    transform: translateY(-3px);
  }
`;

const SimilarTreksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
`;

const SimilarTrekCard = styled.div`
  height: 100%;
  background: rgba(30, 30, 50, 0.5);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.4s ease-out;
  animation-delay: ${props => props.index * 0.1}s;
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(128, 255, 219, 0.3);
  }
`;

const SimilarTrekImage = styled.div`
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  }
`;

const SimilarTrekContent = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const SimilarTrekTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.4;
`;

const SimilarTrekMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NoResultsContainer = styled.div`
  padding: 80px 30px;
  text-align: center;
  background: rgba(20, 20, 40, 0.6);
  border-radius: 15px;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -150px;
    left: -150px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(128, 255, 219, 0.1) 0%, rgba(128, 255, 219, 0) 70%);
    opacity: 0.5;
    z-index: 0;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -150px;
    right: -150px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(83, 144, 217, 0.1) 0%, rgba(83, 144, 217, 0) 70%);
    opacity: 0.5;
    z-index: 0;
  }
`;

const MountainIcon = styled.div`
  margin-bottom: 20px;
  position: relative;
  height: 120px;
  width: 100%;
  
  &:before {
    content: '🏔️';
    font-size: 5rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.7;
    animation: ${float} 3s infinite ease-in-out;
  }
  
  &:after {
    content: '🔍';
    font-size: 2.5rem;
    position: absolute;
    left: calc(50% + 30px);
    bottom: 20px;
    transform: rotate(-20deg);
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

const NoResultsTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
`;

const NoResultsText = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const ResetButton = styled.button`
  padding: 14px 28px;
  background: rgba(83, 144, 217, 0.2);
  border: 1px solid rgba(83, 144, 217, 0.3);
  border-radius: 30px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: rgba(83, 144, 217, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SuggestedQueries = styled.div`
  margin: 30px auto 0;
  max-width: 600px;
  position: relative;
  z-index: 1;
`;

const SuggestedTitle = styled.h4`
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const QueryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const QueryTag = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

// LoadingIndicator component for when results are loading
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 0;
  background: rgba(20, 20, 40, 0.6);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MountainLoadingWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  animation: ${float} 3s infinite ease-in-out;
`;

const MountainLoading = styled.div`
  width: 120px;
  height: 120px;
  background: url(${mapPattern});
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,23H2L12,3L22,23z"/></svg>');
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  background-size: 400%;
  animation: ${shimmer} 3s linear infinite;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, 
      rgba(128, 255, 219, 0.5), 
      rgba(128, 255, 219, 0) 80%);
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,23H2L12,3L22,23z"/></svg>');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    animation: ${glow} 2s infinite ease-in-out;
  }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 20px;
  
  span {
    display: inline-block;
    animation: ${pulse} 1.5s infinite ease-in-out;
    animation-delay: ${props => props.index * 0.1}s;
  }
`;

const LoadingHint = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
`;

const ShimmerCard = styled.div`
  background: rgba(20, 20, 40, 0.6);
  border-radius: 16px;
  overflow: hidden;
  height: 380px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(90deg,
      rgba(255, 255, 255, 0.05) 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0.05) 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 220px;
    left: 20px;
    right: 20px;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
  }
`;

const ShimmerContent = styled.div`
  padding: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  &:before {
    content: '';
    position: absolute;
    top: 40px;
    left: 20px;
    right: 20px;
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 60px;
    left: 20px;
    right: 60px;
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
`;

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { searchQuery, updateSearchQuery, searchTreks } = useSearch();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [treks, setTreks] = useState([]);
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [similarTreks, setSimilarTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const resultsContainerRef = useRef(null);
  
  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [groupSizeFilter, setGroupSizeFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('default');
  const [showFilters, setShowFilters] = useState(window.innerWidth > 992);
  
  // Suggested queries for no results
  const suggestedQueries = [
    'Himalayan Treks', 
    'Beginner Friendly', 
    'Winter Treks',
    'Weekend Getaways',
    'Family Treks',
    'Mountain Lakes'
  ];
  
  // Loading text animation
  const loadingText = "Finding perfect treks for you...";
  
  // Fetch treks on component mount
  useEffect(() => {
    const fetchTreks = async () => {
      if (!searchQuery.trim()) {
        navigate('/explore');
        return;
      }
      
      try {
        setLoading(true);
        const treksCollection = collection(db, "treks");
        
        const treksSnapshot = await getDocs(treksCollection);
        const treksData = treksSnapshot.docs
          .filter(doc => doc.id !== "placeholder" && doc.data().title)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        
        // Get user favorites from localStorage (in a real app, this would come from a database)
        const savedFavorites = JSON.parse(localStorage.getItem('trekFavorites') || '[]');
        setFavorites(savedFavorites);
        
        setTreks(treksData);
        const results = searchTreks(treksData, searchQuery);
        setFilteredTreks(results);
        
        // Generate similar treks based on current search results
        if (results.length > 0) {
          // Find treks with similar difficulty or location
          const mainResult = results[0];
          const similar = treksData.filter(trek => 
            trek.id !== mainResult.id && 
            (trek.difficulty === mainResult.difficulty || 
             trek.location === mainResult.location ||
             trek.country === mainResult.country)
          ).slice(0, 5);
          
          setSimilarTreks(similar);
        }
      } catch (err) {
        console.error("Error fetching treks for search:", err);
        setError("Failed to load search results. Please try again later.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1200); // Add small delay for a smoother loading experience
      }
    };
    
    fetchTreks();
  }, [searchQuery, navigate, searchTreks]);
  
  // Handle window resize for responsive filter panel
  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth > 992);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Apply filters when filter state or search query changes
  useEffect(() => {
    if (treks.length > 0) {
      let results = searchTreks(treks, localSearchQuery || searchQuery);
      
      // Apply difficulty filter if not 'all'
      if (difficultyFilter !== 'all') {
        results = results.filter(trek => 
          trek.difficulty && trek.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
        );
      }
      
      // Apply duration filter
      if (durationFilter !== 'all') {
        results = results.filter(trek => {
          const duration = trek.duration || (trek.days ? parseInt(trek.days) : 0);
          if (durationFilter === 'short') return duration <= 3;
          if (durationFilter === 'medium') return duration > 3 && duration <= 7;
          if (durationFilter === 'long') return duration > 7;
          return true;
        });
      }
      
      // Apply season filter
      if (seasonFilter !== 'all') {
        results = results.filter(trek => 
          trek.season && trek.season.toLowerCase().includes(seasonFilter.toLowerCase())
        );
      }
      
      // Apply group size filter
      if (groupSizeFilter !== 'all') {
        results = results.filter(trek => {
          const groupSize = trek.groupSize || '';
          if (groupSizeFilter === 'small' && groupSize.includes('small')) return true;
          if (groupSizeFilter === 'medium' && (groupSize.includes('8-12') || groupSize.includes('medium'))) return true;
          if (groupSizeFilter === 'large' && (parseInt(groupSize) > 12 || groupSize.includes('large'))) return true;
          return false;
        });
      }
      
      // Apply sorting
      if (priceSort === 'low-to-high') {
        results = [...results].sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : (a.price || 0);
          const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : (b.price || 0);
          return priceA - priceB;
        });
      } else if (priceSort === 'high-to-low') {
        results = [...results].sort((a, b) => {
          const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : (a.price || 0);
          const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : (b.price || 0);
          return priceB - priceA;
        });
      } else if (priceSort === 'duration-short') {
        results = [...results].sort((a, b) => {
          const durationA = a.duration || (a.days ? parseInt(a.days) : 0);
          const durationB = b.duration || (b.days ? parseInt(b.days) : 0);
          return durationA - durationB;
        });
      } else if (priceSort === 'duration-long') {
        results = [...results].sort((a, b) => {
          const durationA = a.duration || (a.days ? parseInt(a.days) : 0);
          const durationB = b.duration || (b.days ? parseInt(b.days) : 0);
          return durationB - durationA;
        });
      }
      
      setFilteredTreks(results);
    }
  }, [treks, searchQuery, localSearchQuery, difficultyFilter, durationFilter, seasonFilter, groupSizeFilter, priceSort, searchTreks]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchQuery(localSearchQuery);
    // No need to navigate since we're already on the search page
  };
  
  const handleClear = () => {
    setLocalSearchQuery('');
    updateSearchQuery('');
    navigate('/explore');
  };
  
  const handleTrekClick = (trekId) => {
    navigate(`/trek/${trekId}`);
  };
  
  const toggleFilterPanel = () => {
    setShowFilters(!showFilters);
    setFilterPanelOpen(!filterPanelOpen);
  };
  
  const resetFilters = () => {
    setDifficultyFilter('all');
    setDurationFilter('all');
    setSeasonFilter('all');
    setGroupSizeFilter('all');
    setPriceSort('default');
  };
  
  const handleSuggestedQuery = (query) => {
    setLocalSearchQuery(query);
    updateSearchQuery(query);
  };
  
  const toggleFavorite = (trekId) => {
    // Update local state
    if (favorites.includes(trekId)) {
      setFavorites(favorites.filter(id => id !== trekId));
      localStorage.setItem('trekFavorites', JSON.stringify(favorites.filter(id => id !== trekId)));
    } else {
      setFavorites([...favorites, trekId]);
      localStorage.setItem('trekFavorites', JSON.stringify([...favorites, trekId]));
    }
    
    // In a real app, you would also update this in your database
  };
  
  const getSeasonIcon = (season) => {
    if (!season) return <FaLeaf />;
    season = season.toLowerCase();
    if (season.includes('winter')) return <FaSnowflake />;
    if (season.includes('summer')) return <FaSun />;
    if (season.includes('spring')) return <FaLeaf />;
    if (season.includes('monsoon')) return <FaCloudRain />;
    if (season.includes('autumn')) return <FaLeaf />;
    return <FaLeaf />;
  };
    return (
    <SearchPageContainer>
      <MapPatternBackground />
      <MountainBackground />
      <Overlay />
      <Container>
        <SearchHeader>
          <Title>Trek Search Results</Title>
          <Subtitle>
            Discover your perfect adventure from our selection of handpicked treks
          </Subtitle>
        </SearchHeader>
        
        <SearchBarContainer>
          <form onSubmit={handleSearchSubmit}>
            <SearchInputWrapper>
              <FilterButton 
                type="button"
                onClick={toggleFilterPanel}
                aria-label="Filter results"
                active={filterPanelOpen}
              >
                <FiFilter />
              </FilterButton>
              {(localSearchQuery || searchQuery) && (
                <ClearButton 
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <FiX />
                </ClearButton>
              )}
              <SearchInputField
                type="text"
                placeholder="Search for treks by name, location, difficulty..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
              <IconButton type="submit" aria-label="Search">
                <FiSearch />
              </IconButton>
            </SearchInputWrapper>
          </form>
        </SearchBarContainer>
        
        <ContentLayout>
          {/* FILTER PANEL */}
          <FilterPanelWrapper isOpen={showFilters}>
            <FilterPanel>
              <FilterContent>
                <FilterHeader>
                  <FilterHeaderTitle>
                    <FiFilter /> Filters
                  </FilterHeaderTitle>
                  <ResetFilters onClick={resetFilters}>
                    Reset All
                  </ResetFilters>
                </FilterHeader>
                
                <FilterGroup index={0}>
                  <FilterTitle>
                    <FaMountain /> Difficulty Level
                  </FilterTitle>
                  <FilterOptions>
                    <FilterOption 
                      active={difficultyFilter === 'all'}
                      onClick={() => setDifficultyFilter('all')}
                    >
                      All
                    </FilterOption>
                    <FilterOption 
                      active={difficultyFilter === 'easy'}
                      onClick={() => setDifficultyFilter('easy')}
                    >
                      <span role="img" aria-label="Easy">🟢</span> Easy
                    </FilterOption>
                    <FilterOption 
                      active={difficultyFilter === 'moderate'}
                      onClick={() => setDifficultyFilter('moderate')}
                    >
                      <span role="img" aria-label="Moderate">🟠</span> Moderate
                    </FilterOption>
                    <FilterOption 
                      active={difficultyFilter === 'difficult'}
                      onClick={() => setDifficultyFilter('difficult')}
                    >
                      <span role="img" aria-label="Difficult">🔴</span> Difficult
                    </FilterOption>
                    <FilterOption 
                      active={difficultyFilter === 'extreme'}
                      onClick={() => setDifficultyFilter('extreme')}
                    >
                      <span role="img" aria-label="Extreme">⚫</span> Extreme
                    </FilterOption>
                  </FilterOptions>
                </FilterGroup>
                
                <FilterGroup index={1}>
                  <FilterTitle>
                    <FiClock /> Duration
                  </FilterTitle>
                  <FilterOptions>
                    <FilterOption 
                      active={durationFilter === 'all'}
                      onClick={() => setDurationFilter('all')}
                    >
                      All
                    </FilterOption>
                    <FilterOption 
                      active={durationFilter === 'short'}
                      onClick={() => setDurationFilter('short')}
                    >
                      1-3 Days
                    </FilterOption>
                    <FilterOption 
                      active={durationFilter === 'medium'}
                      onClick={() => setDurationFilter('medium')}
                    >
                      4-7 Days
                    </FilterOption>
                    <FilterOption 
                      active={durationFilter === 'long'}
                      onClick={() => setDurationFilter('long')}
                    >
                      8+ Days
                    </FilterOption>
                  </FilterOptions>
                </FilterGroup>
                
                <FilterGroup index={2}>
                  <FilterTitle>
                    <FiCalendar /> Season
                  </FilterTitle>
                  <FilterOptions>
                    <FilterOption 
                      active={seasonFilter === 'all'}
                      onClick={() => setSeasonFilter('all')}
                    >
                      All Seasons
                    </FilterOption>
                    <FilterOption 
                      active={seasonFilter === 'summer'}
                      onClick={() => setSeasonFilter('summer')}
                    >
                      <FaSun /> Summer
                    </FilterOption>
                    <FilterOption 
                      active={seasonFilter === 'winter'}
                      onClick={() => setSeasonFilter('winter')}
                    >
                      <FaSnowflake /> Winter
                    </FilterOption>
                    <FilterOption 
                      active={seasonFilter === 'spring'}
                      onClick={() => setSeasonFilter('spring')}
                    >
                      <FaLeaf /> Spring
                    </FilterOption>
                    <FilterOption 
                      active={seasonFilter === 'autumn'}
                      onClick={() => setSeasonFilter('autumn')}
                    >
                      <FaLeaf /> Autumn
                    </FilterOption>
                  </FilterOptions>
                </FilterGroup>
                
                <FilterGroup index={3}>
                  <FilterTitle>
                    <FiUsers /> Group Size
                  </FilterTitle>
                  <FilterOptions>
                    <FilterOption 
                      active={groupSizeFilter === 'all'}
                      onClick={() => setGroupSizeFilter('all')}
                    >
                      Any Size
                    </FilterOption>
                    <FilterOption 
                      active={groupSizeFilter === 'small'}
                      onClick={() => setGroupSizeFilter('small')}
                    >
                      Small (2-7)
                    </FilterOption>
                    <FilterOption 
                      active={groupSizeFilter === 'medium'}
                      onClick={() => setGroupSizeFilter('medium')}
                    >
                      Medium (8-12)
                    </FilterOption>
                    <FilterOption 
                      active={groupSizeFilter === 'large'}
                      onClick={() => setGroupSizeFilter('large')}
                    >
                      Large (12+)
                    </FilterOption>
                  </FilterOptions>
                </FilterGroup>
              </FilterContent>
            </FilterPanel>
          </FilterPanelWrapper>
          
          {/* MAIN CONTENT */}
          <MainContent ref={resultsContainerRef}>
            <MobileFilterToggle onClick={toggleFilterPanel}>
              <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'} {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </MobileFilterToggle>
            
            <SearchResultsContainer>
              {loading ? (
                <LoadingContainer>
                  <MountainLoadingWrapper>
                    <MountainLoading />
                  </MountainLoadingWrapper>
                  <LoadingText>
                    {loadingText.split('').map((char, i) => (
                      <span key={i} style={{animationDelay: `${i * 0.05}s`}}>{char}</span>
                    ))}
                  </LoadingText>
                  <LoadingHint>
                    Discovering trails, summits, and breathtaking views just for you...
                  </LoadingHint>
                  <ResultsGrid style={{marginTop: '40px'}}>
                    {[1, 2, 3, 4].map((_, i) => (
                      <ShimmerCard key={i}>
                        <ShimmerContent />
                      </ShimmerCard>
                    ))}
                  </ResultsGrid>
                </LoadingContainer>
              ) : error ? (
                <NoResultsContainer>
                  <MountainIcon />
                  <NoResultsTitle>Oops, something went wrong</NoResultsTitle>
                  <NoResultsText>{error}</NoResultsText>
                  <ResetButton onClick={() => navigate('/explore')}>
                    <FiSearch /> Go to Explore
                  </ResetButton>
                </NoResultsContainer>
              ) : filteredTreks.length === 0 ? (
                <NoResultsContainer>
                  <MountainIcon />
                  <NoResultsTitle>No treks found</NoResultsTitle>
                  <NoResultsText>
                    We couldn't find any treks matching "{searchQuery}" and your selected filters.
                    Try adjusting your search terms or removing some filters.
                  </NoResultsText>
                  <ResetButton onClick={handleClear}>
                    <FiX /> Clear Search
                  </ResetButton>
                  
                  <SuggestedQueries>
                    <SuggestedTitle>Popular searches you might like</SuggestedTitle>
                    <QueryTags>
                      {suggestedQueries.map((query, idx) => (
                        <QueryTag key={idx} onClick={() => handleSuggestedQuery(query)}>
                          {query}
                        </QueryTag>
                      ))}
                    </QueryTags>
                  </SuggestedQueries>
                </NoResultsContainer>
              ) : (
                <>
                  <ResultsHeader>
                    <ResultsInfo>
                      <ResultsCount>
                        Found <span>{filteredTreks.length}</span> {filteredTreks.length === 1 ? 'trek' : 'treks'} for "<span>{searchQuery}</span>"
                      </ResultsCount>
                      
                      <SortContainer>
                        <SortLabel>
                          <BiSort /> Sort
                        </SortLabel>
                        <SortSelect 
                          value={priceSort}
                          onChange={(e) => setPriceSort(e.target.value)}
                        >
                          <option value="default">Featured</option>
                          <option value="low-to-high">Price: Low to High</option>
                          <option value="high-to-low">Price: High to Low</option>
                          <option value="duration-short">Duration: Shortest First</option>
                          <option value="duration-long">Duration: Longest First</option>
                        </SortSelect>
                      </SortContainer>
                    </ResultsInfo>
                  </ResultsHeader>
                  
                  <ResultsContent>
                    <ResultsGrid>
                      {filteredTreks.map((trek, idx) => (
                        <TrekCard key={trek.id || idx} index={idx}>
                          <TrekImageWrapper>
                            <TrekImage style={{backgroundImage: `url(${getValidImageUrl(trek.image)})`}} />
                            <ImageOverlay />
                            <FavoriteButton 
                              favorite={favorites.includes(trek.id)} 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(trek.id);
                              }}
                              aria-label={favorites.includes(trek.id) ? "Remove from favorites" : "Add to favorites"}
                              title={favorites.includes(trek.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <FiHeart fill={favorites.includes(trek.id) ? "#FF5370" : "transparent"} />
                            </FavoriteButton>
                            <TrekTags>
                              <LocationTag><FiMapPin /> {trek.country || trek.location || "India"}</LocationTag>
                              <DifficultyTag><FaMountain /> {trek.difficulty || "Moderate"}</DifficultyTag>
                            </TrekTags>
                          </TrekImageWrapper>
                          
                          <TrekInfo>
                            <TrekTitle>{trek.title}</TrekTitle>
                            <TrekDescription>
                              {trek.description 
                                ? `${trek.description.substring(0, 100).replace(/<\/?[^>]+(>|$)/g, '')}${trek.description.length > 100 ? '...' : ''}` 
                                : "Experience this amazing trek through breathtaking landscapes and stunning views."}
                            </TrekDescription>
                            
                            <TrekFeatures>
                              <TrekFeature>
                                <FiClock /> {trek.duration || trek.days || Math.floor(Math.random() * 7) + 2} Days
                              </TrekFeature>
                              <TrekFeature>
                                {getSeasonIcon(trek.season)} {trek.season || "Year-round"}
                              </TrekFeature>
                              <TrekFeature>
                                <FiUsers /> {trek.groupSize || "8-12 people"}
                              </TrekFeature>
                            </TrekFeatures>
                            
                            <TrekMeta>
                              <MetaGroup>
                                <MetaLabel>Maximum Altitude</MetaLabel>
                                <MetaItem>
                                  {trek.maxAltitude || Math.floor(Math.random() * 5000 + 8000) + " ft"}
                                </MetaItem>
                              </MetaGroup>
                              <Price>
                                {trek.price || `₹${Math.floor(Math.random() * 10000) + 5000}`}
                              </Price>
                            </TrekMeta>
                            
                            <ViewButton onClick={() => handleTrekClick(trek.id)}>
                              View Details <FiChevronRight />
                            </ViewButton>
                          </TrekInfo>
                        </TrekCard>
                      ))}
                    </ResultsGrid>
                  </ResultsContent>
                </>
              )}
            </SearchResultsContainer>
              {/* SIMILAR TREKS SECTION */}
            {!loading && !error && filteredTreks.length > 0 && similarTreks.length > 0 && (
              <SimilarTreksSection>
                <SectionHeader>
                  <SectionTitle>
                    <FaMountain /> Similar Treks You Might Like
                  </SectionTitle>
                  <ViewAll onClick={() => navigate('/explore')}>
                    Explore More <FiChevronRight />
                  </ViewAll>
                </SectionHeader>
                
                <SimilarTreksGrid>
                  {similarTreks.map((trek, idx) => (
                    <SimilarTrekCard 
                      key={idx} 
                      index={idx}
                      onClick={() => handleTrekClick(trek.id)}
                    >
                      <SimilarTrekImage style={{backgroundImage: `url(${getValidImageUrl(trek.image)})`}} />
                      <SimilarTrekContent>
                        <SimilarTrekTitle>{trek.title}</SimilarTrekTitle>
                        <SimilarTrekMeta>
                          <span><FaMountain style={{marginRight: '5px', fontSize: '0.8rem'}} /> {trek.difficulty || "Moderate"}</span>
                          <span>{trek.price || `₹${Math.floor(Math.random() * 10000) + 5000}`}</span>
                        </SimilarTrekMeta>
                      </SimilarTrekContent>
                    </SimilarTrekCard>
                  ))}
                </SimilarTreksGrid>
              </SimilarTreksSection>
            )}
          </MainContent>
        </ContentLayout>
      </Container>
      <Footer />
    </SearchPageContainer>
  );
};

export default SearchResultsPage;
