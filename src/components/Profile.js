import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import profileImg from '../assets/images/trek1.png'; // Placeholder

const Page = styled.div`
  background: #000;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
`;
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
`;
const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 40px;
`;
const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #FFD700;
`;
const Info = styled.div`
  flex: 1;
`;
const Name = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;
const Email = styled.div`
  color: #FFD700;
  font-size: 1.1rem;
  margin-bottom: 12px;
`;
const EditButton = styled.button`
  background: #FF4B1F;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.18s;
  &:hover { background: #d13a13; }
`;
const StatsGrid = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
`;
const StatCard = styled.div`
  background: #181828;
  border-radius: 16px;
  padding: 24px 32px;
  flex: 1 1 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
`;
const StatValue = styled.div`
  color: #FFD700;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 6px;
`;
const StatLabel = styled.div`
  color: #ccc;
  font-size: 1rem;
`;
const BadgesGrid = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
`;
const Badge = styled.div`
  background: #FFD700;
  color: #222;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const badges = ['🥾','🏔️','🌄','🎒','🏅'];

const Profile = () => (
  <Page>
    <Navbar active="profile" />
    <Container>
      <ProfileHeader>
        <Avatar src={profileImg} alt="Profile" />
        <Info>
          <Name>Jane Doe</Name>
          <Email>jane.doe@email.com</Email>
          <EditButton>Edit Profile</EditButton>
        </Info>
      </ProfileHeader>
      <StatsGrid>
        <StatCard>
          <StatValue>8</StatValue>
          <StatLabel>Treks</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>258 km</StatValue>
          <StatLabel>Total Distance</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>14,856 m</StatValue>
          <StatLabel>Elevation Gain</StatLabel>
        </StatCard>
      </StatsGrid>
      <h3 style={{color:'#FFD700', marginBottom:12}}>Badges</h3>
      <BadgesGrid>
        {badges.map((badge, idx) => (
          <Badge key={idx}>{badge}</Badge>
        ))}
      </BadgesGrid>
    </Container>
  </Page>
);

export default Profile; 