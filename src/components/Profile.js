import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from 'framer-motion';
import { FaEnvelope, FaBirthdayCake, FaEdit, FaSignOutAlt, FaMapMarkerAlt, FaMountain, FaClock, FaCrown, FaCompass } from 'react-icons/fa';
import profileImg from '../assets/images/trek1.png';
import mapPattern from '../assets/images/map-pattren.png';

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

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  padding-bottom: 100px; /* Added space for bottom navbar */

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
    width: 130px;
    height: 130px;
  }
`;

const Info = styled.div`
  flex: 1;
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
    font-size: 2.2rem;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
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
  
  svg {
    margin-right: 8px;
    color: #4CC9F0;
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
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 200px;
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
  
  @media (max-width: 480px) {
    width: 100%;
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
  
  svg {
    font-size: 1.2rem;
  }
  
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
  
  svg {
    font-size: 1.2rem;
  }
  
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
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
    width: 70px;
    height: 70px;
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
`;

// Badge data with added color gradients
const badges = [
  { emoji: '🥾', name: 'First Hike', gradient: 'linear-gradient(135deg, #4CC9F0, #06D6A0)' },
  { emoji: '🏔️', name: 'Mountain Climber', gradient: 'linear-gradient(135deg, #F72585, #B5179E)' },
  { emoji: '🌄', name: 'Sunrise Trekker', gradient: 'linear-gradient(135deg, #FFD166, #F79824)' },  { emoji: '🎒', name: 'Backpacker Pro', gradient: 'linear-gradient(135deg, #4361EE, #3A0CA3)' },
  { emoji: '🏅', name: 'Elite Trekker', gradient: 'linear-gradient(135deg, #FF6B6B, #FFD166)' }
];

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
            <ButtonGroup>              <EditButton onClick={() => navigate('/edit-profile')}>
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
        
        <SectionTitle>Recent Trek History</SectionTitle>
        <TrekHistory>
          <TrekList>
            {trekHistory.map((trek, idx) => (
              <TrekCard 
                key={trek.id}
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
        </TrekHistory>
        
        <BadgesSection>
          <SectionTitle>Achievements</SectionTitle>
          <BadgesGrid>
            {badges.map((badge, idx) => (
              <Badge 
                key={idx}
                style={{ background: badge.gradient }}
                whileHover={{ scale: 1.1, y: -5 }}
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

// Adding new Trek History component
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
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const TrekImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
`;

const TrekInfo = styled.div`
  flex: 1;
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

// Sample trek data
const trekHistory = [
  {
    id: 1,
    name: "Himalayan Expedition",
    date: "May 15, 2025",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    distance: "32 km",
    elevation: "1,450 m",
    duration: "2 days"
  },
  {
    id: 2,
    name: "Alpine Lake Trek",
    date: "April 3, 2025",
    image: "https://images.unsplash.com/photo-1455156218388-5e61b526818b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    distance: "18 km",
    elevation: "850 m",
    duration: "1 day"
  },
  {
    id: 3,
    name: "Rainforest Adventure",
    date: "February 22, 2025",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    distance: "26 km",
    elevation: "620 m",
    duration: "1.5 days"
  }
];
