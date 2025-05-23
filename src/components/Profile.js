import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';
import profileImg from '../assets/images/trek1.png';
import mapPattern from '../assets/images/map-pattren.png'; // Import map pattern
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from 'framer-motion';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.05); opacity: 0.9; }
`;

const loading = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

// Styled Components
const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
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
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 50px;
  padding: 48px 40px;
  background: rgba(30, 30, 35, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
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
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 32px;
  }
  
  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffffff, #a0a0a0);
    z-index: -1;
    opacity: 0.5;
    animation: ${pulse} 4s infinite alternate;
  }
`;

const Avatar = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
`;

const Info = styled.div`
  flex: 1;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Name = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Email = styled.div`
  color: #e6e6e6;
  font-size: 1.1rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '✉️';
    margin-right: 8px;
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const DobText = styled.div`
  font-size: 1rem;
  color: #e6e6e6;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '🎂';
    margin-right: 8px;
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  border: none;
  border-radius: 16px;
  padding: 18px 26px;
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
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 14px 22px;
    font-size: 0.95rem;
  }
`;

const EditButton = styled(Button)`
  background: linear-gradient(to right, #4a4a4a, #707070);
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(to right, #d32f2f, #ff5252);
  color: #fff;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(211, 47, 47, 0.4);
  }
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin: 35px 0 20px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #ffffff, transparent);
    border-radius: 2px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: rgba(30, 30, 35, 0.8);
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
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  animation: ${float} 3s ease-in-out infinite;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BadgesSection = styled.div`
  background: rgba(30, 30, 35, 0.8);
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
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const BadgesGrid = styled.div`
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Badge = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff, #a0a0a0);
  color: #111;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
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
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 30px rgba(255, 255, 255, 0.15);
  }
`;

const BadgeTooltip = styled.div`
  position: absolute;
  bottom: -40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  ${Badge}:hover & {
    opacity: 1;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin-top: 100px;
  color: #ffffff;
  
  &:after {
    content: '...';
    display: inline-block;
    animation: ${loading} 1.5s infinite;
  }
`;

// Badge data
const badges = [
  { emoji: '🥾', name: 'First Hike' },
  { emoji: '🏔️', name: 'Mountain Climber' },
  { emoji: '🌄', name: 'Sunrise Trekker' },
  { emoji: '🎒', name: 'Backpacker Pro' },
  { emoji: '🏅', name: 'Elite Trekker' }
];

const Profile = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setAuthUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("No such user document in Firestore!");
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
        <Navbar active="profile" />
        <Container>
          <LoadingText>Loading your profile</LoadingText>
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

  return (
    <Page>
      <Navbar active="profile" />
      <Container>
        <ProfileHeader>
          <AvatarContainer>
            <Avatar src={avatarUrl} alt="Profile" />
          </AvatarContainer>
          <Info>
            <Name>{displayName}</Name>
            <Email>{displayEmail}</Email>
            {userData?.dob && <DobText>Date of Birth: {displayDob}</DobText>}
            <ButtonGroup>
              <EditButton onClick={() => alert('Edit profile functionality to be implemented!')}>
                Edit Profile
              </EditButton>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
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
            <StatValue>8</StatValue>
            <StatLabel>Treks</StatLabel>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatValue>258 km</StatValue>
            <StatLabel>Total Distance</StatLabel>
          </StatCard>
          <StatCard
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatValue>14,856 m</StatValue>
            <StatLabel>Elevation Gain</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <BadgesSection>
          <SectionTitle>Achievements</SectionTitle>
          <BadgesGrid>
            {badges.map((badge, idx) => (
              <Badge 
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                {badge.emoji}
                <BadgeTooltip>{badge.name}</BadgeTooltip>
              </Badge>
            ))}
          </BadgesGrid>
        </BadgesSection>
      </Container>
    </Page>
  );
};

export default Profile;