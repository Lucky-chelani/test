import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from 'framer-motion';
import { FaEnvelope, FaBirthdayCake, FaEdit, FaSignOutAlt, FaMapMarkerAlt, FaMountain, FaClock, FaCrown, FaCompass, FaTicketAlt, FaChevronRight, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';
import BookingService from '../services/BookingService';
import profileImg from '../assets/images/trek1.png';
import mapPattern from '../assets/images/map-pattren.png';

// --- Animations (Kept Exactly as is) ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.05); opacity: 0.9; }
`;

const loading = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Styled Components (Responsive Fixes Applied) ---

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  background-attachment: fixed; /* Keeps background steady on mobile scroll */
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 100px;
  overflow-x: hidden; /* Fixes horizontal scrollbar issues */
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(20, 30, 48, 0.92) 0%, rgba(0, 0, 0, 0.85) 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 480px) {
    padding: 20px 16px 80px 16px; /* Optimized padding for small screens */
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 50px;
  padding: 48px 40px;
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B, #FFD166, #4CC9F0);
    background-size: 300% 100%;
    animation: ${buttonFlare} 6s infinite ease-in-out;
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 24px;
    gap: 20px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0; /* Prevents avatar from getting squashed */
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4CC9F0, #FF6B6B);
    z-index: -1;
    opacity: 0.6;
    animation: ${pulse} 4s infinite alternate;
  }
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const Info = styled.div`
  flex: 1;
  width: 100%; /* Ensures children can take full width */
  min-width: 0; /* Critical for text truncation in flex children */
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Name = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 14px;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
  animation: ${float} 3s ease-in-out infinite;
  position: relative;
  display: inline-block;
  
  /* Text Truncation Logic */
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    white-space: normal; /* Allow wrapping on mobile */
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const Email = styled.div`
  color: #e6e6e6;
  font-size: 1.1rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  
  /* Text Truncation */
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  svg {
    margin-right: 8px;
    color: #4CC9F0;
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 1rem;
  }
`;

const DobText = styled.div`
  font-size: 1rem;
  color: #e6e6e6;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: #FF6B6B;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap; /* Allows wrapping on medium screens */
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin: 20px auto 0;
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    transform: translateY(-2px);
    &::before { left: 100%; }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 14px 22px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    width: 100%; /* Full width on mobile */
  }
`;

const EditButton = styled(Button)`
  background: linear-gradient(to right, #4CC9F0, #4361EE);
  color: #fff;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(76, 201, 240, 0.4);
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(to right, #d32f2f, #ff5252);
  color: #fff;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(211, 47, 47, 0.4);
  }
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.6rem;
  margin: 40px 0 25px;
  position: relative;
  display: inline-block;
  padding-left: 15px;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #4CC9F0, #FF6B6B);
    border-radius: 2px;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #ffffff, transparent);
    border-radius: 2px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Force 1 column on small phones */
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
    opacity: 0.8;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(76, 201, 240, 0.05), transparent);
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.3),
      0 4px 20px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const StatValue = styled.div`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  animation: ${float} 3s ease-in-out infinite;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  
  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    margin: 8px auto 0;
    border-radius: 1px;
  }
`;

// --- HISTORY & BOOKINGS ---

const TrekHistory = styled.div`
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 30px;
  margin-top: 40px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const TrekList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TrekCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  @media (max-width: 550px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const TrekImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  
  @media (max-width: 550px) {
    width: 100%;
    height: 140px;
  }
`;

const TrekInfo = styled.div`
  flex: 1;
  width: 100%;
`;

const TrekName = styled.h4`
  margin: 0 0 5px;
  font-size: 1.1rem;
  color: #ffffff;
`;

const TrekDate = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TrekStats = styled.div`
  display: flex;
  gap: 15px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  flex-wrap: wrap; /* Important for small screens */
  
  span {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 5px;
      color: #4CC9F0;
    }
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

// Bookings Section Styled Components
const BookingsSection = styled(TrekHistory)`
  /* Reuses TrekHistory styles */
`;

const BookingsList = styled(TrekList)``;

const BookingCard = styled(TrekCard)`
  padding: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const BookingImage = styled(TrekImage)`
  width: 100px;
  height: 75px;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 160px;
  }
`;

const BookingInfo = styled(TrekInfo)``;
const BookingTitle = styled(TrekName)``;
const BookingDate = styled(TrekDate)` margin-bottom: 8px; `;
const BookingDetails = styled(TrekStats)``;

const BookingStatus = styled.div`
  background: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed': return 'rgba(39, 174, 96, 0.3)';
      case 'pending': return 'rgba(241, 196, 15, 0.3)';
      case 'cancelled': return 'rgba(231, 76, 60, 0.3)';
      default: return 'rgba(41, 128, 185, 0.3)';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed': return '#2ecc71';
      case 'pending': return '#f1c40f';
      case 'cancelled': return '#e74c3c';
      default: return '#3498db';
    }
  }};
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: inline-block;
  margin-top: 10px;
`;

const ViewDetailsButton = styled.button`
  background: linear-gradient(135deg, #4CC9F0, #06D6A0);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 201, 240, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(76, 201, 240, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(76, 201, 240, 0.3);
  }
  
  @media (max-width: 768px) {
    margin-top: 10px;
    width: 100%;
    justify-content: center;
  }
`;

const BookingActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

// --- BADGES ---

const BadgesSection = styled.div`
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 30px;
  margin-top: 30px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
    opacity: 0.8;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, rgba(76, 201, 240, 0.05), transparent);
    pointer-events: none;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const BadgesGrid = styled.div`
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const Badge = styled(motion.div)`
  background: linear-gradient(135deg, #4CC9F0, #FF6B6B);
  color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(76, 201, 240, 0.3);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    pointer-events: none;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.1) translateY(-5px);
    box-shadow: 0 12px 30px rgba(76, 201, 240, 0.3), 0 0 20px rgba(255, 107, 107, 0.4);
    
    &:after {
      opacity: 1;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
    }
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
`;

const BadgeTooltip = styled.div`
  position: absolute;
  bottom: -45px;
  background: rgba(10, 15, 25, 0.95);
  color: white;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 5px rgba(76, 201, 240, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(10px);
  z-index: 5;
  
  ${Badge}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const RoleText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.9rem;
  color: #ddd;
  
  svg {
    color: ${props => props.roleColor || '#4CC9F0'};
  }
  
  span {
    display: inline-block;
    background: ${props => props.roleGradient || 'linear-gradient(135deg, #4CC9F0, #06D6A0)'};
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
  margin-top: 100px;
  color: #ffffff;
  font-weight: 500;
  
  &::before {
    content: '';
    width: 50px;
    height: 50px;
    border: 3px solid rgba(76, 201, 240, 0.3);
    border-top: 3px solid #4CC9F0;
    border-radius: 50%;
    margin-bottom: 20px;
    animation: ${rotate} 1s linear infinite;
  }
  
  .loading-dots {
    display: inline-block;
    &::after {
      content: '...';
      display: inline-block;
      animation: ${loading} 1.5s infinite;
    }
  }
`;

const LoadingBookingsIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
  
  &::after {
    content: '';
    width: 25px;
    height: 25px;
    border: 2px solid rgba(76, 201, 240, 0.3);
    border-top: 2px solid #4CC9F0;
    border-radius: 50%;
    margin-left: 10px;
    animation: ${rotate} 1s linear infinite;
  }
`;

// Role configuration
const roleConfig = {
  admin: { 
    label: 'Administrator',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF9E80)',
    icon: FaCrown,
    color: '#FF6B6B'
  },
  organizer: { 
    label: 'Trek Organizer', 
    gradient: 'linear-gradient(135deg, #4361EE, #3A0CA3)',
    icon: FaMountain,
    color: '#4361EE'
  },
  user: { 
    label: 'Explorer',
    gradient: 'linear-gradient(135deg, #4CC9F0, #06D6A0)',
    icon: FaCompass,
    color: '#4CC9F0'
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setAuthUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("No such user document in Firestore!");
            // Set basic user data to prevent errors
            setUserData({
              name: currentUser.displayName || 'User',
              email: currentUser.email,
              role: 'user'
            });
          }
          
          // Fetch user bookings
          setLoadingBookings(true);
          try {
            const userBookings = await BookingService.getUserBookings();
            setBookings(userBookings);
          } catch (error) {
            console.error("Error fetching user bookings:", error);
          } finally {
            setLoadingBookings(false);
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      } else {
        setAuthUser(null);
        setUserData(null);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  if (loading) {
    return (
      <Page>
        <Container>
          <LoadingText>
            Loading your profile
            <span className="loading-dots"></span>
          </LoadingText>
        </Container>
      </Page>
    );
  }

  if (!authUser) {
    return null; 
  }

  const displayName = userData?.name || authUser.displayName || 'User Name';
  const displayEmail = authUser.email || 'No email provided';
  const displayDob = userData?.dob || 'Not set';
  const avatarUrl = authUser.photoURL || profileImg;
  const userRole = userData?.role || 'user';
  const roleInfo = roleConfig[userRole] || roleConfig.user;

  return (
    <Page>
      <Container>
        <ProfileHeader>
          <AvatarContainer>
            <Avatar src={avatarUrl} alt="Profile" />
          </AvatarContainer>
          <Info>
            <Name>{displayName}</Name>
            <Email>
              <FaEnvelope /> {displayEmail}
            </Email>
            {userData?.dob && <DobText>
              <FaBirthdayCake /> Date of Birth: {displayDob}
            </DobText>}
            {/* Display user role with appropriate styling */}
            {userData?.role && (
              <RoleText 
                roleGradient={roleConfig[userData.role]?.gradient}
                roleColor={roleConfig[userData.role]?.color}
              >
                {roleConfig[userData.role]?.icon && React.createElement(roleConfig[userData.role].icon)}
                <span>{roleConfig[userData.role]?.label || 'Explorer'}</span>
              </RoleText>
            )}
            <ButtonGroup>              
              <EditButton onClick={() => navigate('/edit-profile')}>
                <FaEdit /> Edit Profile
              </EditButton>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </LogoutButton>
            </ButtonGroup>
          </Info>
        </ProfileHeader>
        
        <SectionTitle>Your Trekking Stats</SectionTitle>
        <StatsGrid>
          <StatCard 
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatValue>{userData?.stats?.treks || '0'}</StatValue>
            <StatLabel>Treks</StatLabel>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatValue>{userData?.stats?.distance || '0 km'}</StatValue>
            <StatLabel>Total Distance</StatLabel>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatValue>{userData?.stats?.elevation || '0 m'}</StatValue>
            <StatLabel>Elevation Gain</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <SectionTitle>Recent Trek History</SectionTitle>
        <TrekHistory>
          {userData?.trekHistory && userData.trekHistory.length > 0 ? (
            <TrekList>
              {userData.trekHistory.map((trek, idx) => (
                <TrekCard 
                  key={trek.id || idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <TrekImage src={trek.image} alt={trek.name} />
                  <TrekInfo>
                    <TrekName>{trek.name}</TrekName>
                    <TrekDate>{trek.date}</TrekDate>
                  </TrekInfo>
                  <TrekStats>
                    <span><FaMapMarkerAlt /> {trek.distance}</span>
                    <span><FaMountain /> {trek.elevation}</span>
                    <span><FaClock /> {trek.duration}</span>
                  </TrekStats>
                </TrekCard>
              ))}
            </TrekList>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.7)' }}>
              No trek history available yet.
            </div>
          )}
        </TrekHistory>
        
        <BadgesSection>
          <SectionTitle>Achievements</SectionTitle>
          <BadgesGrid>
            {userData?.badges && userData.badges.length > 0 ? (
              userData.badges.map((badge, idx) => (
                <Badge 
                  key={idx}
                  style={{ background: badge.gradient || 'linear-gradient(135deg, #4CC9F0, #06D6A0)' }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {badge.emoji}
                  <BadgeTooltip>{badge.name}</BadgeTooltip>
                </Badge>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.7)', width: '100%' }}>
                No achievements earned yet. Start trekking to earn badges!
              </div>
            )}
          </BadgesGrid>
        </BadgesSection>

        {/* Bookings Section */}
        <BookingsSection>
          <SectionTitle>Your Bookings</SectionTitle>
          {loadingBookings ? (
            <LoadingBookingsIndicator>
              Loading your bookings
              <span className="loading-dots"></span>
            </LoadingBookingsIndicator>
          ) : (
            <BookingsList>
              {bookings.length > 0 ? (
                bookings.map((booking, idx) => (
                  <BookingCard 
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <BookingImage 
                      src={booking.trek?.imageUrl || booking.trekImage || profileImg} 
                      alt={(booking.trek?.title || booking.trekTitle || 'Trek Image')} 
                    />
                    <BookingInfo>
                      <BookingTitle>
                        {booking.trek?.title || booking.trek?.name || 
                         booking.trekTitle || booking.trekName || 
                         booking.trekData?.title || booking.trekData?.name ||
                         (booking.trekId && booking.trekId.replace(/-/g, ' ')
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')) || 
                         'Unknown Trek'}
                      </BookingTitle>
                      <BookingDate>Booked on: {booking.createdAt}</BookingDate>
                      <BookingDetails>
                        {(booking.participants || booking.participantCount) && (
                          <span><FaUsers /> {booking.participants || booking.participantCount || 1} {(booking.participants || booking.participantCount) === 1 ? 'Person' : 'People'}</span>
                        )}
                        {(booking.bookingDate || booking.startDate) && (
                          <span><FaCalendarAlt /> {booking.bookingDate || booking.startDate}</span>
                        )}
                        {booking.amount && (
                          <span><FaMoneyBillWave /> ₹{booking.amount}</span>
                        )}
                        {(booking.trek?.location || booking.trekLocation) && (
                          <span><FaMapMarkerAlt /> {booking.trek?.location || booking.trekLocation}</span>
                        )}
                      </BookingDetails>
                      <BookingStatus status={booking.status || 'confirmed'}>
                        {booking.status || 'Confirmed'}
                      </BookingStatus>
                    </BookingInfo>
                    <BookingActions>
                      <ViewDetailsButton onClick={() => navigate(`/booking-confirmation/${booking.id}`)}>
                        <FaFileAlt /> View Details
                      </ViewDetailsButton>
                    </BookingActions>
                  </BookingCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.7)' }}>
                  No bookings found. Start exploring treks and book your adventures!
                </div>
              )}
            </BookingsList>
          )}
        </BookingsSection>
      </Container>
    </Page>
  );
};

export default Profile;