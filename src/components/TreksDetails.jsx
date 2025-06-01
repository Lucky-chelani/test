import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { 
  FiClock, FiMapPin, FiCalendar, FiStar, FiArrowRight, FiChevronRight, 
  FiUser, FiDollarSign, FiThermometer, FiMap, FiCamera, FiMessageCircle, 
  FiHeart, FiShare2, FiBookmark, FiCheck, FiChevronDown, FiChevronUp, FiLayers,
  FiInfo, FiUsers, FiShield
} from 'react-icons/fi';
import { FaMountain, FaRoute, FaHome, FaRunning, FaShieldAlt } from 'react-icons/fa';
import Navbar from "./Navbar";
import mapPattern from "../assets/images/map-pattren.png";
import trek1 from "../assets/images/photo1.jpeg";
import trek2 from "../assets/images/photo2.jpeg";
import trek3 from "../assets/images/photo3.jpeg";
import mapImage from "../assets/images/map-pattren.png";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-10px) rotate(1deg); }
`;
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

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Page Container
const Page = styled.div`
  background-color: #0a1a2f;
  position: relative;
  min-height: 100vh;
  color: #fff;
  padding-bottom: 100px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${mapPattern});
    background-size: 500px;
    background-repeat: repeat;
    opacity: 0.3;
    mix-blend-mode: luminosity;
    filter: brightness(1.5) contrast(1.2);
    z-index: 0;
    animation: breathe 20s infinite ease-in-out;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, 
      rgba(10, 26, 47, 0.6) 0%, 
      rgba(8, 22, 48, 0.85) 100%);
    z-index: 1;
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 120px 24px 0;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 100px 20px 0;
  }
`;

// Hero Section
const HeroSection = styled.section`
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  height: 480px;
  margin-bottom: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.7s ease-out;

  @media (max-width: 768px) {
    height: 350px;
    border-radius: 20px;
  }
`;

const HeroImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 10s ease;
  transform-origin: center;
  
  &:hover {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, 
      rgba(10, 26, 47, 0.8) 0%, 
      rgba(10, 26, 47, 0) 60%);
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 25px;
  left: 25px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    transform: rotate(180deg);
  }
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  max-width: 70%;
  z-index: 5;
  
  @media (max-width: 768px) {
    bottom: 30px;
    left: 25px;
    max-width: 90%;
  }
`;

const TrekTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 15px;
  color: white;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const TagsRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Tag = styled.span`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  svg {
    color: #80FFDB;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
`;

const DifficultyTag = styled(Tag)`
  background: linear-gradient(135deg, rgba(83, 144, 217, 0.8), rgba(116, 0, 184, 0.8));
  border: none;
  
  svg {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const HeroActions = styled.div`
  position: absolute;
  top: 25px;
  right: 25px;
  display: flex;
  gap: 10px;
  z-index: 5;
  
  @media (max-width: 480px) {
    top: 15px;
    right: 15px;
  }
`;

const ActionButton = styled.button`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

// Main Content Layout
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  animation: ${fadeIn} 0.7s ease-out 0.2s both;
`;

const Sidebar = styled.div`
  animation: ${fadeIn} 0.7s ease-out 0.4s both;
  
  @media (max-width: 992px) {
    order: -1;
  }
`;

// Section Components
const Section = styled.section`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 35px;
  margin-bottom: 30px;
  border: 1px solid rgba(128, 255, 219, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #80FFDB, #5390D9, #7400B8);
    border-radius: 2px 2px 0 0;
  }
  
  @media (max-width: 768px) {
    padding: 25px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #80FFDB;
  }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

// Overview Section
const OverviewContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const ItemIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(83, 144, 217, 0.2), rgba(116, 0, 184, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #80FFDB;
  font-size: 1.3rem;
  margin-bottom: 5px;
`;

const ItemLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ItemValue = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TrekDescription = styled.div`
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
  margin-bottom: 30px;
  
  p {
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Highlights = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px;
  background: rgba(128, 255, 219, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(128, 255, 219, 0.1);
    transform: translateX(5px);
  }
`;

const HighlightIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5390D9, #7400B8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const HighlightText = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
`;

// Itinerary Section
const ItineraryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ItineraryDay = styled.div`
  border: 1px solid rgba(128, 255, 219, 0.1);
  border-radius: 16px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  padding: 18px 25px;
  background: rgba(83, 144, 217, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(83, 144, 217, 0.15);
  }
  
  &.active {
    background: linear-gradient(90deg, rgba(83, 144, 217, 0.2), rgba(116, 0, 184, 0.2));
  }
`;

const DayTitle = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #5390D9, #7400B8);
    border-radius: 50%;
    font-size: 0.9rem;
  }
`;

const ToggleIcon = styled.div`
  color: #80FFDB;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  
  &.active {
    transform: rotate(180deg);
  }
`;

const DayContent = styled.div`
  padding: ${props => props.active ? "20px 25px" : "0 25px"};
  height: ${props => props.active ? "auto" : "0"};
  opacity: ${props => props.active ? "1" : "0"};
  overflow: hidden;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  
  ul {
    margin-top: 15px;
    padding-left: 20px;
    
    li {
      margin-bottom: 10px;
      position: relative;
      
      &::marker {
        color: #80FFDB;
      }
    }
  }
`;

// Map Section
const MapContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  height: 400px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MapOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(10, 26, 47, 0.6) 0%, rgba(10, 26, 47, 0) 50%);
`;

const ViewFullMapButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-3px);
  }
`;

// Gallery Section
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GalleryImage = styled.div`
  border-radius: 16px;
  overflow: hidden;
  height: 180px;
  position: relative;
  cursor: pointer;
  
  &:hover img {
    transform: scale(1.1);
  }
  
  &:hover::after {
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(10, 26, 47, 0.7) 0%, rgba(10, 26, 47, 0) 70%);
    transition: opacity 0.3s ease;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:first-child {
    grid-column: span 2;
    grid-row: span 2;
    height: auto;
  }
`;

const ViewAllPhotosButton = styled.button`
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }
`;

// Reviews Section
const ReviewStats = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const AverageRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
  .rating {
    font-size: 3rem;
    font-weight: 800;
    color: white;
  }
  
  .total {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .stars {
    display: flex;
    gap: 5px;
    color: #80FFDB;
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    
    .rating-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .stars {
    min-width: 80px;
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    
    svg {
      color: #80FFDB;
    }
  }
  
  .bar-container {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    background: linear-gradient(to right, #80FFDB, #5390D9);
    border-radius: 4px;
  }
  
  .count {
    min-width: 45px;
    text-align: right;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Reviewer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(128, 255, 219, 0.5);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .details {
    .name {
      font-weight: 600;
      font-size: 1.1rem;
      color: white;
      margin-bottom: 5px;
    }
    
    .date {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }
  }
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #80FFDB;
  font-size: 1.1rem;
`;

const ReviewContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  font-size: 1rem;
`;

const ViewAllReviewsButton = styled(ViewAllPhotosButton)`
  margin-top: 30px;
`;

// Booking Card
const BookingCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 30px;
  border: 1px solid rgba(128, 255, 219, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 100px;
  
  @media (max-width: 992px) {
    position: static;
  }
  
  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const BookingPrice = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
  
  .amount {
    font-size: 2.2rem;
    font-weight: 800;
    color: white;
    margin-right: 5px;
  }
  
  .period {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
  }
`;

const PriceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(128, 255, 219, 0.1);
  color: #80FFDB;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
  margin-bottom: 25px;
  
  svg {
    font-size: 1rem;
  }
`;

const DatePicker = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  
  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }
`;

const TravelersPicker = styled(DatePicker)``;

const PriceBreakdown = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  
  .label {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .value {
    font-weight: 600;
    color: white;
  }
  
  &.total {
    padding-top: 15px;
    margin-top: 15px;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    
    .label, .value {
      font-weight: 700;
      color: white;
      font-size: 1.1rem;
    }
  }
`;

const BookButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(83, 144, 217, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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
  
  svg {
    font-size: 1.3rem;
  }
`;

const InfoNote = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  background: rgba(128, 255, 219, 0.05);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  
  svg {
    color: #80FFDB;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

// Main Component
const TrekDetails = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(1);
  const { id } = useParams();
  
  // Sample data - in a real app, fetch this based on the ID
  const trek = {
    id: "bhrigu-lake",
    title: "Bhrigu Lake Trek",
    image: trek1,
    country: "India",
    location: "Himachal Pradesh",
    difficulty: "Moderate",
    rating: 4.8,
    reviewCount: 124,
    price: "₹12,500",
    duration: 6,
    maxAltitude: "14,100 ft",
    distance: "26 km",
    groupSize: "8-12",
    season: "May-October",
    startPoint: "Manali, Himachal Pradesh",
    endPoint: "Manali, Himachal Pradesh",
    description: `
      <p>The Bhrigu Lake Trek is one of the most picturesque and accessible high-altitude alpine lake treks in Himachal Pradesh. Named after the sage Bhrigu, this pristine lake sits at an elevation of 14,100 feet in the upper Kullu Valley.</p>
      
      <p>What makes this trek special is that it offers stunning views of snow-capped mountains, lush meadows, and dense forests in a relatively short duration, making it perfect for beginners and experienced trekkers alike. The trek starts from Gulaba, just 10 km from Manali, and takes you through beautiful oak and cedar forests before opening up to vast alpine meadows known locally as "thachi."</p>
      
      <p>The lake itself is believed to have religious significance as Maharishi Bhrigu is said to have meditated beside these waters. Depending on the season, you might find the lake in different avatars - from a frozen ice disc in early summer to a pristine blue lake surrounded by wildflowers in late summer.</p>
    `,
    highlights: [
      "Alpine lake at 14,100 feet with stunning views",
      "Beautiful meadows with seasonal wildflowers",
      "Panoramic Himalayan vistas including Hanuman Tibba",
      "Relatively short trek ideal for beginners",
      "Scenic forests and streams along the trail",
      "Camping under starlit skies"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive at Manali",
        description: "Arrive at Manali and check into your hotel. There will be an orientation session in the evening where you'll meet your trek leader and fellow trekkers. You'll get a briefing about the trek, be given a packing checklist, and have all your questions answered.",
        activities: [
          "Arrive in Manali (6,725 ft)",
          "Check into hotel and rest",
          "Evening orientation with trek leader",
          "Equipment and fitness check",
          "Overnight stay in Manali"
        ]
      },
      {
        day: 2,
        title: "Manali to Gulaba to Jonker Thatch",
        description: "After breakfast, we'll drive to Gulaba (around 10 km from Manali). From here, our trek begins as we hike through dense oak and pine forests. The trail gradually ascends to reach Jonker Thatch, a beautiful meadow where we'll set up camp for the night.",
        activities: [
          "Drive from Manali to Gulaba (30 minutes)",
          "Begin trek from Gulaba (10,500 ft)",
          "Trek through oak and pine forests",
          "Reach Jonker Thatch (11,200 ft) - 4 hours trek",
          "Set up camp and evening tea",
          "Dinner and overnight in tents"
        ]
      },
      {
        day: 3,
        title: "Jonker Thatch to Bhrigu Lake and back",
        description: "Today is the most challenging and rewarding day. We start early after breakfast and trek up to Bhrigu Lake. The trail passes through stunning meadows and rocky terrain. Upon reaching the lake, you'll have time to explore and soak in the breathtaking views before heading back to Jonker Thatch.",
        activities: [
          "Early breakfast and start by 7 AM",
          "Trek from Jonker Thatch to Bhrigu Lake (14,100 ft)",
          "Steep ascent through meadows and rocky patches",
          "Reach Bhrigu Lake by noon (5-6 hours trek)",
          "Spend time at the lake, photography, lunch",
          "Return to Jonker Thatch camp (3-4 hours)",
          "Evening tea, dinner and overnight in tents"
        ]
      },
      {
        day: 4,
        title: "Jonker Thatch to Gulaba and drive to Manali",
        description: "After breakfast, we'll trek back to Gulaba following the same route. The descent is easier and takes less time. From Gulaba, we'll drive back to Manali where the trek officially ends.",
        activities: [
          "Breakfast and camp wrap-up",
          "Trek down from Jonker Thatch to Gulaba",
          "Mostly downhill trek (3 hours)",
          "Drive back to Manali (30 minutes)",
          "Trek completion certificates",
          "Farewell lunch with the team"
        ]
      }
    ],
    reviews: [
      {
        name: "Priya Sharma",
        avatar: trek2,
        date: "August 15, 2023",
        rating: 5,
        content: "One of the best treks I've done in Himachal! The meadows before Bhrigu Lake were carpeted with wildflowers when we went in July. The lake itself was partially frozen and absolutely magical. Our guide Tenzing was extremely knowledgeable and made sure everyone was comfortable despite the altitude. Highly recommend!"
      },
      {
        name: "Rahul Verma",
        avatar: trek3,
        date: "June 22, 2023",
        rating: 4,
        content: "Great trek for beginners! The views are spectacular and worth every bit of effort. The lake was completely frozen when we visited in early June which was a unique experience. The camping arrangements were comfortable and the food was surprisingly good considering we were in the mountains. Only suggestion would be to provide better information about dealing with AMS beforehand."
      }
    ],
    ratingBreakdown: {
      5: 84,
      4: 26,
      3: 10,
      2: 3,
      1: 1
    }
  };
  
  // Calculate average rating
  const calculateAverage = () => {
    const total = Object.entries(trek.ratingBreakdown).reduce(
      (acc, [rating, count]) => acc + (Number(rating) * count), 0
    );
    const count = Object.values(trek.ratingBreakdown).reduce((a, b) => a + b, 0);
    return (total / count).toFixed(1);
  };
  
  const toggleItineraryDay = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Page>
      <Navbar active="explore" />
      
      {/* Floating decorative elements */}
      <FloatingElement size="150px" top="15%" left="5%" color="rgba(128, 255, 219, 0.05)" index="1" xMove="20px" yMove="30px" />
      <FloatingElement size="120px" top="30%" right="10%" color="rgba(83, 144, 217, 0.05)" index="2" xMove="-30px" yMove="20px" />
      <FloatingElement size="100px" bottom="20%" left="15%" color="rgba(116, 0, 184, 0.05)" index="3" xMove="15px" yMove="-25px" />
      <FloatingElement size="180px" bottom="10%" right="5%" color="rgba(128, 255, 219, 0.03)" index="4" xMove="-20px" yMove="-15px" />
      
      <Container>
        <HeroSection>
          <HeroImage image={trek.image} />
          
          <BackButton onClick={goBack}>
            <FiChevronRight /> Back
          </BackButton>
          
          <HeroContent>
            <TrekTitle>{trek.title}</TrekTitle>
            <TagsRow>
              <Tag><FiMapPin /> {trek.location}</Tag>
              <DifficultyTag><FaMountain /> {trek.difficulty}</DifficultyTag>
              <Tag>
                <FiStar />
                {trek.rating} ({trek.reviewCount} reviews)
              </Tag>
            </TagsRow>
          </HeroContent>
          
          <HeroActions>
            <ActionButton title="Share">
              <FiShare2 />
            </ActionButton>
            <ActionButton title="Save">
              <FiBookmark />
            </ActionButton>
            <ActionButton title="Like">
              <FiHeart />
            </ActionButton>
          </HeroActions>
        </HeroSection>
        
        <ContentGrid>
          <MainContent>
            <Section>
              <SectionTitle>
                <FiInfo /> Overview
              </SectionTitle>
              
              <OverviewContent>
                <OverviewItem>
                  <ItemIcon><FiClock /></ItemIcon>
                  <ItemLabel>Duration</ItemLabel>
                  <ItemValue>{trek.duration} Days</ItemValue>
                </OverviewItem>
                
<OverviewItem>
  <ItemIcon><FaMountain /></ItemIcon> {/* or use FaMountain if you prefer */}
  <ItemLabel>Max Altitude</ItemLabel>
  <ItemValue>{trek.maxAltitude}</ItemValue>
</OverviewItem>
                
                <OverviewItem>
                  <ItemIcon><FaRoute /></ItemIcon>
                  <ItemLabel>Distance</ItemLabel>
                  <ItemValue>{trek.distance}</ItemValue>
                </OverviewItem>
                
                <OverviewItem>
                  <ItemIcon><FiUsers /></ItemIcon>
                  <ItemLabel>Group Size</ItemLabel>
                  <ItemValue>{trek.groupSize}</ItemValue>
                </OverviewItem>
                
                <OverviewItem>
                  <ItemIcon><FiCalendar /></ItemIcon>
                  <ItemLabel>Best Season</ItemLabel>
                  <ItemValue>{trek.season}</ItemValue>
                </OverviewItem>
                
                <OverviewItem>
                  <ItemIcon><FiMapPin /></ItemIcon>
                  <ItemLabel>Start Point</ItemLabel>
                  <ItemValue>{trek.startPoint}</ItemValue>
                </OverviewItem>
              </OverviewContent>
              
              <TrekDescription dangerouslySetInnerHTML={{ __html: trek.description }} />
              
              <SectionTitle style={{ fontSize: '1.4rem' }}>
                <FiCheck /> Highlights
              </SectionTitle>
              
              <Highlights>
                {trek.highlights.map((highlight, idx) => (
                  <HighlightItem key={idx}>
                    <HighlightIcon>
                      <FiCheck />
                    </HighlightIcon>
                    <HighlightText>{highlight}</HighlightText>
                  </HighlightItem>
                ))}
              </Highlights>
            </Section>
            
            <Section>
              <SectionTitle>
                <FiLayers /> Day-by-Day Itinerary
              </SectionTitle>
              
              <ItineraryList>
                {trek.itinerary.map((day) => (
                  <ItineraryDay key={day.day}>
                    <DayHeader 
                      onClick={() => toggleItineraryDay(day.day)}
                      className={activeDay === day.day ? 'active' : ''}
                    >
                      <DayTitle>
                        <span>{day.day}</span> Day {day.day}: {day.title}
                      </DayTitle>
                      <ToggleIcon className={activeDay === day.day ? 'active' : ''}>
                        {activeDay === day.day ? <FiChevronUp /> : <FiChevronDown />}
                      </ToggleIcon>
                    </DayHeader>
                    
                    <DayContent active={activeDay === day.day}>
                      <p>{day.description}</p>
                      <ul>
                        {day.activities.map((activity, idx) => (
                          <li key={idx}>{activity}</li>
                        ))}
                      </ul>
                    </DayContent>
                  </ItineraryDay>
                ))}
              </ItineraryList>
            </Section>
            
            <Section>
              <SectionTitle>
                <FiMap /> Trek Route Map
              </SectionTitle>
              
              <MapContainer>
                <img src={mapImage} alt="Trek Route Map" />
                <MapOverlay />
                <ViewFullMapButton>
                  View Full Map <FiArrowRight />
                </ViewFullMapButton>
              </MapContainer>
            </Section>
            
            <Section>
              <SectionTitle>
                <FiCamera /> Photo Gallery
              </SectionTitle>
              
              <GalleryGrid>
                <GalleryImage>
                  <img src={trek1} alt="Trek view" />
                </GalleryImage>
                <GalleryImage>
                  <img src={trek2} alt="Trek view" />
                </GalleryImage>
                <GalleryImage>
                  <img src={trek3} alt="Trek view" />
                </GalleryImage>
                <GalleryImage>
                  <img src={trek1} alt="Trek view" />
                </GalleryImage>
                <GalleryImage>
                  <img src={trek2} alt="Trek view" />
                </GalleryImage>
              </GalleryGrid>
              
              <ViewAllPhotosButton>
                View All 24 Photos <FiArrowRight />
              </ViewAllPhotosButton>
            </Section>
            
            <Section>
              <SectionTitle>
                <FiMessageCircle /> Trekker Reviews
              </SectionTitle>
              
              <ReviewStats>
                <AverageRating>
                  <div className="rating-container">
                    <div className="rating">{calculateAverage()}</div>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} />
                      ))}
                    </div>
                  </div>
                  <div className="total">Based on {trek.reviewCount} reviews</div>
                </AverageRating>
                
                <RatingBars>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <RatingBar key={rating}>
                      <div className="stars">
                        {rating} <FiStar />
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${(trek.ratingBreakdown[rating] / trek.reviewCount) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="count">{trek.ratingBreakdown[rating]}</div>
                    </RatingBar>
                  ))}
                </RatingBars>
              </ReviewStats>
              
              <ReviewsList>
                {trek.reviews.map((review, idx) => (
                  <ReviewCard key={idx}>
                    <ReviewHeader>
                      <Reviewer>
                        <div className="avatar">
                          <img src={review.avatar} alt={review.name} />
                        </div>
                        <div className="details">
                          <div className="name">{review.name}</div>
                          <div className="date">{review.date}</div>
                        </div>
                      </Reviewer>
                      <ReviewRating>
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} style={{ color: i < review.rating ? '#80FFDB' : 'rgba(255,255,255,0.2)' }} />
                        ))}
                      </ReviewRating>
                    </ReviewHeader>
                    <ReviewContent>
                      {review.content}
                    </ReviewContent>
                  </ReviewCard>
                ))}
              </ReviewsList>
              
              <ViewAllReviewsButton>
                View All {trek.reviewCount} Reviews <FiArrowRight />
              </ViewAllReviewsButton>
            </Section>
          </MainContent>
          
          <Sidebar>
            <BookingCard>
              <BookingPrice>
                <div className="amount">{trek.price}</div>
                <div className="period">per person</div>
              </BookingPrice>
              
              <PriceTag>
                <FiDollarSign /> Lowest Price Guarantee
              </PriceTag>
              
              <DatePicker>
                <div className="label">
                  Start Date <FiCalendar />
                </div>
                <div className="value">Select Date</div>
              </DatePicker>
              
              <TravelersPicker>
                <div className="label">
                  Travelers <FiUser />
                </div>
                <div className="value">2 Adults</div>
              </TravelersPicker>
              
              <PriceBreakdown>
                <PriceRow>
                  <div className="label">₹12,500 × 2 travelers</div>
                  <div className="value">₹25,000</div>
                </PriceRow>
                
                <PriceRow>
                  <div className="label">GST (5%)</div>
                  <div className="value">₹1,250</div>
                </PriceRow>
                
                <PriceRow>
                  <div className="label">Service Charge</div>
                  <div className="value">₹750</div>
                </PriceRow>
                
                <PriceRow className="total">
                  <div className="label">Total</div>
                  <div className="value">₹27,000</div>
                </PriceRow>
              </PriceBreakdown>
              
              <BookButton>
                Book This Trek <FiArrowRight />
              </BookButton>
              
            <InfoNote>
  <FaShieldAlt />
  <div>Free cancellation up to 14 days before your trek date</div>
</InfoNote>
            </BookingCard>
          </Sidebar>
        </ContentGrid>
      </Container>
    </Page>
  );
};

export default TrekDetails;