import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaFileAlt, FaPhone } from 'react-icons/fa';
import BookingService from '../services/BookingService';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const checkDrawAnimation = keyframes`
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const successPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(22, 160, 133, 0.7);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(22, 160, 133, 0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const rotateGradient = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const moveBackground = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const floatParticle = keyframes`
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(-10px) translateX(-15px);
  }
`;

const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  position: relative;
  min-height: 100vh;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(22, 160, 133, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(76, 201, 240, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(123, 104, 238, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 25%, #2d1b3d 50%, #1a1f2e 75%, #0a0e1a 100%);
    background-size: 100% 100%, 100% 100%, 100% 100%, 400% 400%;
    animation: ${moveBackground} 20s ease infinite;
    z-index: -3;
  }
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(76, 201, 240, 0.2), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(22, 160, 133, 0.3), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.05), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(123, 104, 238, 0.2), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: ${floatParticle} 8s ease-in-out infinite;
    z-index: -2;
  }
`;

const BackgroundOrb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(40px);
  z-index: -1;
  animation: ${breathe} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(22, 160, 133, 0.2) 0%, transparent 70%);
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 60%;
    right: 15%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(76, 201, 240, 0.15) 0%, transparent 70%);
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(123, 104, 238, 0.18) 0%, transparent 70%);
    animation-delay: 4s;
  }
  
  @media (max-width: 768px) {
    &:nth-child(1) {
      width: 150px;
      height: 150px;
    }
    
    &:nth-child(2) {
      width: 120px;
      height: 120px;
    }
    
    &:nth-child(3) {
      width: 100px;
      height: 100px;
    }
  }
`;

const FloatingShape = styled.div`
  position: fixed;
  z-index: -1;
  opacity: 0.6;
  
  &:nth-child(1) {
    top: 15%;
    right: 20%;
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, rgba(22, 160, 133, 0.3), rgba(76, 201, 240, 0.2));
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: ${rotateGradient} 15s linear infinite, ${float} 6s ease-in-out infinite;
  }
  
  &:nth-child(2) {
    bottom: 30%;
    right: 10%;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, rgba(123, 104, 238, 0.4), rgba(76, 201, 240, 0.3));
    border-radius: 50% 20% 80% 40%;
    animation: ${rotateGradient} 20s linear infinite reverse, ${float} 8s ease-in-out infinite;
    animation-delay: 3s;
  }
  
  &:nth-child(3) {
    top: 50%;
    left: 5%;
    width: 35px;
    height: 35px;
    background: linear-gradient(225deg, rgba(22, 160, 133, 0.5), rgba(123, 104, 238, 0.3));
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    animation: ${rotateGradient} 12s linear infinite, ${float} 7s ease-in-out infinite;
    animation-delay: 1.5s;
  }
`;

const MainCard = styled.div`
  background: linear-gradient(135deg, rgba(25, 28, 35, 0.98) 0%, rgba(40, 44, 55, 0.95) 100%);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 0 50px rgba(22, 160, 133, 0.1);
  color: #fff;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #16a085, #4CC9F0, #7B68EE, #16a085);
    background-size: 300% 100%;
    animation: ${shimmer} 3s infinite linear;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(22, 160, 133, 0.03) 0%, transparent 70%);
    animation: ${rotateGradient} 30s linear infinite;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    border-radius: 20px;
    margin: 20px 10px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 30px 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, #16a085, #4CC9F0);
    border-radius: 1px;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #16a085 0%, #4CC9F0 50%, #7B68EE 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${slideInFromLeft} 0.8s ease-out 0.2s both;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CheckIcon = styled(FaCheckCircle)`
  font-size: 6rem;
  color: #16a085;
  margin-bottom: 25px;
  animation: ${scaleIn} 0.6s ease-out 0.4s both, ${successPulse} 2s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(22, 160, 133, 0.3));
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    border: 2px solid rgba(22, 160, 133, 0.3);
    border-radius: 50%;
    animation: ${successPulse} 3s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 4.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  animation: ${slideInFromRight} 0.8s ease-out 0.3s both;
  font-weight: 500;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BookingId = styled.div`
  font-size: 1.5rem;
  padding: 16px 28px;
  background: linear-gradient(135deg, rgba(22, 160, 133, 0.2) 0%, rgba(76, 201, 240, 0.2) 100%);
  border: 2px solid rgba(22, 160, 133, 0.3);
  border-radius: 16px;
  margin: 25px auto;
  display: inline-block;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  animation: ${fadeIn} 0.8s ease-out 0.5s both;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 2s infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 12px 20px;
    letter-spacing: 2px;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 40px 40px;
  
  @media (max-width: 768px) {
    padding: 0 20px 30px;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideUp} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #16a085, #4CC9F0, #7B68EE);
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    margin-bottom: 25px;
    border-radius: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  font-weight: 600;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  svg {
    margin-right: 12px;
    color: #4CC9F0;
    filter: drop-shadow(0 0 8px rgba(76, 201, 240, 0.3));
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const DetailItem = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.4;
`;

const TrekImageContainer = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  margin: 25px 0;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(22, 160, 133, 0.1), rgba(76, 201, 240, 0.1));
    z-index: 1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    height: 200px;
    border-radius: 16px;
    margin: 20px 0;
  }
`;

const TrekImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.08);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
  }
`;

const Button = styled.button`
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, #16a085 0%, #1abc9c 100%)' 
    : 'transparent'};
  color: white;
  border: ${props => props.$primary 
    ? 'none' 
    : '2px solid rgba(255, 255, 255, 0.3)'};
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 180px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.$primary 
      ? 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)' 
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'};
    transition: left 0.6s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: ${props => props.$primary 
      ? '0 10px 25px rgba(22, 160, 133, 0.4)' 
      : '0 10px 25px rgba(255, 255, 255, 0.1)'};
    
    &::before {
      left: 0;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 24px;
    font-size: 1rem;
  }
`;

const GeometricPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  opacity: 0.03;
  background-image: 
    linear-gradient(45deg, rgba(22, 160, 133, 0.1) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(76, 201, 240, 0.1) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(123, 104, 238, 0.1) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(22, 160, 133, 0.05) 75%);
  background-size: 60px 60px;
  background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
  animation: ${moveBackground} 40s linear infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #4CC9F0;
  border-top-color: #16a085;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(192, 57, 43, 0.2) 100%);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-left: 4px solid #e74c3c;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 30px;
  color: white;
  font-size: 1.1rem;
  line-height: 1.5;
  animation: ${slideUp} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #e74c3c, #c0392b);
  }
`;

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError('Please log in to view booking details.');
          setLoading(false);
          return;
        }

        // Fetch booking data
        const bookingData = await BookingService.getBookingById(bookingId);
        
        // Fetch user profile data
        let userProfileData = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            userProfileData = userDoc.data();
          }
        } catch (userError) {
          console.warn('Could not fetch user profile:', userError);
        }

        // Combine auth user data with profile data
        const combinedUserData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          phoneNumber: currentUser.phoneNumber,
          ...userProfileData // Profile data overrides auth data
        };
        
        // Enhanced booking data with user info
        const enhancedBookingData = {
          ...bookingData,
          // Add user data to booking for display, but keep original booking data priority
          userInfo: combinedUserData,
          // Override ONLY if booking doesn't have the data
          userName: bookingData.name || bookingData.userName || combinedUserData.name || combinedUserData.displayName || combinedUserData.firstName,
          userEmail: bookingData.email || bookingData.userEmail || combinedUserData.email || currentUser.email,
          userPhone: bookingData.contactNumber || bookingData.phoneNumber || bookingData.phone || combinedUserData.phoneNumber || combinedUserData.phone || combinedUserData.contactNumber,
          userAge: bookingData.age || combinedUserData.age,
          userGender: bookingData.gender || combinedUserData.gender
        };
        

        setBooking(enhancedBookingData);
        setUserData(combinedUserData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Could not retrieve booking details. Please try again later.');
        setLoading(false);
      }
    };
    
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);
  
  const handleViewProfile = () => {
    navigate('/profile');
  };
  
  const handleExplore = () => {
    navigate('/explore');
  };

  if (loading) {
    return (
      <>
        <GeometricPattern />
        <BackgroundOrb />
        <BackgroundOrb />
        <BackgroundOrb />
        <FloatingShape />
        <FloatingShape />
        <FloatingShape />
        
        <Container>
          <MainCard>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Loading your booking details...</LoadingText>
            </LoadingContainer>
          </MainCard>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <GeometricPattern />
        <BackgroundOrb />
        <BackgroundOrb />
        <BackgroundOrb />
        <FloatingShape />
        <FloatingShape />
        <FloatingShape />
        
        <Container>
          <MainCard>
            <ContentWrapper>
              <ErrorMessage>{error}</ErrorMessage>
              <ButtonContainer>
                <Button onClick={handleViewProfile}>Go to Profile</Button>
                <Button $primary onClick={handleExplore}>Explore Treks</Button>
              </ButtonContainer>
            </ContentWrapper>
          </MainCard>
        </Container>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <GeometricPattern />
        <BackgroundOrb />
        <BackgroundOrb />
        <BackgroundOrb />
        <FloatingShape />
        <FloatingShape />
        <FloatingShape />
        
        <Container>
          <MainCard>
            <ContentWrapper>
              <ErrorMessage>Booking not found. Please check the booking ID.</ErrorMessage>
              <ButtonContainer>
                <Button onClick={handleViewProfile}>Go to Profile</Button>
                <Button $primary onClick={handleExplore}>Explore Treks</Button>
              </ButtonContainer>
            </ContentWrapper>
          </MainCard>
        </Container>
      </>
    );
  }

  return (
    <>
      <GeometricPattern />
      <BackgroundOrb />
      <BackgroundOrb />
      <BackgroundOrb />
      <FloatingShape />
      <FloatingShape />
      <FloatingShape />
      
      <Container>
        <MainCard>
          <Header>
            <CheckIcon />
            <Title>Booking Confirmed!</Title>
            <Subtitle>Your adventure is all set and ready to go!</Subtitle>
            <BookingId>{booking.id}</BookingId>
          </Header>

          <ContentWrapper>
          {booking.trek && (
            <Section>
              <SectionTitle>
                <FaMapMarkerAlt /> Trek Details
              </SectionTitle>
              
              {booking.trek.imageUrl && (
                <TrekImageContainer>
                  <TrekImage src={booking.trek.imageUrl} alt={booking.trek.title} />
                </TrekImageContainer>
              )}
              
              <DetailsGrid>
                <DetailItem>
                  <DetailLabel>Trek Name</DetailLabel>
                  <DetailValue>{booking.trek.title || 'Not specified'}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Location</DetailLabel>
                  <DetailValue>{booking.trek.location || 'Not specified'}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Duration</DetailLabel>
                  <DetailValue>{booking.trek.duration || 'Not specified'}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Difficulty</DetailLabel>
                  <DetailValue>{booking.trek.difficulty || 'Not specified'}</DetailValue>
                </DetailItem>
              </DetailsGrid>
            </Section>
          )}

          <Section>
            <SectionTitle>
              <FaCalendarAlt /> Booking Details
            </SectionTitle>
            
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Start Date</DetailLabel>
                <DetailValue>
                  {(() => {
                    const startDate = booking.startDate || 
                                     booking.trekDate || 
                                     booking.dateOfTrek || 
                                     booking.date || 
                                     booking.trekStartDate;
                    
                    if (!startDate) return 'Not specified';
                    
                    // Handle different date formats
                    try {
                      if (typeof startDate === 'string') {
                        return new Date(startDate).toLocaleDateString();
                      } else if (startDate.toDate) {
                        // Firestore timestamp
                        return startDate.toDate().toLocaleDateString();
                      } else if (startDate instanceof Date) {
                        return startDate.toLocaleDateString();
                      } else {
                        return startDate.toString();
                      }
                    } catch (error) {
                      console.error('Error formatting start date:', error);
                      return startDate.toString();
                    }
                  })()}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Participants</DetailLabel>
                <DetailValue>
                  {booking.participants || 
                   booking.numberOfParticipants || 
                   booking.participantCount || 
                   booking.people || 
                   1} person(s)
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Booking Date</DetailLabel>
                <DetailValue>
                  {booking.createdAt ? 
                    (typeof booking.createdAt === 'string' ? 
                      new Date(booking.createdAt).toLocaleDateString() : 
                      booking.createdAt.toDate ? 
                        booking.createdAt.toDate().toLocaleDateString() :
                        booking.createdAt.toLocaleDateString()
                    ) : 
                    booking.bookingDate || 
                    booking.timestamp || 
                    'Not specified'
                  }
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue style={{ color: (booking.status === 'confirmed' || booking.paymentStatus === 'completed') ? '#16a085' : '#f39c12' }}>
                  {booking.status ? 
                    booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 
                    booking.paymentStatus ? 
                      booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) :
                      'Pending'}
                </DetailValue>
              </DetailItem>
            </DetailsGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FaUsers /> Your Information
            </SectionTitle>
            
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Name</DetailLabel>
                <DetailValue>
                  {/* Priority: booking data first, then user data */}
                  {booking.name || 
                   booking.userName || 
                   booking.userInfo?.name || 
                   booking.userInfo?.displayName || 
                   booking.userInfo?.firstName ||
                   userData?.name ||
                   userData?.displayName ||
                   userData?.firstName ||
                   'Not provided'}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>
                  {/* Priority: booking data first, then user data */}
                  {booking.email || 
                   booking.userEmail || 
                   booking.userInfo?.email || 
                   userData?.email ||
                   'Not provided'}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Contact Number</DetailLabel>
                <DetailValue>
                  {(() => {
                    // First, check for phone number in booking data
                    const bookingPhoneFields = [
                      booking.contactNumber,
                      booking.phoneNumber,
                      booking.phone,
                      booking.userPhone
                    ];
                    
                    // Then check user profile data (Firebase user data)
                    const userPhoneFields = [
                      booking.userInfo?.phone,
                      booking.userInfo?.phoneNumber,
                      booking.userInfo?.contactNumber,
                      userData?.phone,
                      userData?.phoneNumber,
                      userData?.contactNumber,
                      userData?.mobile,
                      userData?.cellphone,
                      // Also check Firebase Auth phone number
                      auth.currentUser?.phoneNumber
                    ];
                    
                    // Check booking data first (highest priority)
                    for (const phone of bookingPhoneFields) {
                      if (phone && phone !== null && phone !== undefined && phone !== '') {
                        const phoneStr = phone.toString().trim();
                        if (phoneStr !== '' && phoneStr !== 'undefined' && phoneStr !== 'null' && phoneStr !== '0') {
                          return phoneStr;
                        }
                      }
                    }
                    
                    // If not found in booking, check user profile data
                    for (const phone of userPhoneFields) {
                      if (phone && phone !== null && phone !== undefined && phone !== '') {
                        const phoneStr = phone.toString().trim();
                        if (phoneStr !== '' && phoneStr !== 'undefined' && phoneStr !== 'null' && phoneStr !== '0') {
                          return phoneStr;
                        }
                      }
                    }
                    
                    return (
                      <div style={{ color: '#f39c12' }}>
                        <div>Not provided</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.8 }}>
                          Please update your profile to add a phone number
                        </div>
                      </div>
                    );
                  })()}
                </DetailValue>
              </DetailItem>
              
              {/* Age if available */}
              {(booking.age || booking.userAge || booking.userInfo?.age || userData?.age) && (
                <DetailItem>
                  <DetailLabel>Age</DetailLabel>
                  <DetailValue>
                    {booking.age || booking.userAge || booking.userInfo?.age || userData?.age}
                  </DetailValue>
                </DetailItem>
              )}
              
              {/* Gender if available */}
              {(booking.gender || booking.userGender || booking.userInfo?.gender || userData?.gender) && (
                <DetailItem>
                  <DetailLabel>Gender</DetailLabel>
                  <DetailValue>
                    {booking.gender || booking.userGender || booking.userInfo?.gender || userData?.gender}
                  </DetailValue>
                </DetailItem>
              )}
            </DetailsGrid>
          </Section>

          {(booking.emergencyName || booking.emergencyContact || booking.emergencyPhone) && (
            <Section>
              <SectionTitle>
                <FaPhone /> Emergency Contact
              </SectionTitle>
              
              <DetailsGrid>
                {(booking.emergencyName) && (
                  <DetailItem>
                    <DetailLabel>Emergency Contact Name</DetailLabel>
                    <DetailValue>
                      {booking.emergencyName || 'Not provided'}
                    </DetailValue>
                  </DetailItem>
                )}
                
                {(booking.emergencyContact || booking.emergencyPhone) && (
                  <DetailItem>
                    <DetailLabel>Emergency Contact Number</DetailLabel>
                    <DetailValue>
                      {booking.emergencyContact || 
                       booking.emergencyPhone || 
                       'Not provided'}
                    </DetailValue>
                  </DetailItem>
                )}
              </DetailsGrid>
            </Section>
          )}

          {(booking.totalAmount || booking.amount || booking.price) && (
            <Section>
              <SectionTitle>
                <FaMoneyBillWave /> Payment Details
              </SectionTitle>
              
              <DetailsGrid>
                <DetailItem>
                  <DetailLabel>Amount Paid</DetailLabel>
                  <DetailValue>
                    ₹{(booking.totalAmount || 
                       booking.amount || 
                       booking.price || 
                       booking.finalAmount ||
                       0).toFixed ? 
                       (booking.totalAmount || booking.amount || booking.price || booking.finalAmount).toFixed(2) :
                       (booking.totalAmount || booking.amount || booking.price || booking.finalAmount || 0)
                    }
                  </DetailValue>
                </DetailItem>
                
                {(booking.discountAmount > 0 || booking.discount > 0) && (
                  <DetailItem>
                    <DetailLabel>Discount Applied</DetailLabel>
                    <DetailValue>
                      ₹{((booking.discountAmount || booking.discount || 0).toFixed ? 
                         (booking.discountAmount || booking.discount).toFixed(2) :
                         (booking.discountAmount || booking.discount || 0)
                       )}
                    </DetailValue>
                  </DetailItem>
                )}
                
                {(booking.paymentId || booking.transactionId || booking.razorpayPaymentId) && (
                  <DetailItem>
                    <DetailLabel>Payment ID</DetailLabel>
                    <DetailValue>
                      {booking.paymentId || 
                       booking.transactionId || 
                       booking.razorpayPaymentId ||
                       'Not available'}
                    </DetailValue>
                  </DetailItem>
                )}
                
                <DetailItem>
                  <DetailLabel>Payment Status</DetailLabel>
                  <DetailValue style={{ 
                    color: (booking.paymentStatus === 'completed' || 
                           booking.paymentStatus === 'success' ||
                           booking.status === 'confirmed') ? '#16a085' : '#f39c12' 
                  }}>
                    {booking.paymentStatus ? 
                      booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 
                      booking.status === 'confirmed' ? 'Completed' :
                      'Processing'}
                  </DetailValue>
                </DetailItem>
              </DetailsGrid>
            </Section>
          )}

          {booking.specialRequests && (
            <Section>
              <SectionTitle>
                <FaFileAlt /> Special Requests
              </SectionTitle>
              
              <DetailItem style={{ gridColumn: '1 / -1' }}>
                <DetailValue>{booking.specialRequests}</DetailValue>
              </DetailItem>
            </Section>
          )}

          <ButtonContainer>
            <Button onClick={handleViewProfile}>View All Bookings</Button>
            <Button $primary onClick={handleExplore}>Explore More Treks</Button>
          </ButtonContainer>
        </ContentWrapper>
      </MainCard>
    </Container>
    </>
  );
};

export default BookingConfirmation;
