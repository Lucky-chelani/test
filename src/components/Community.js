import React from 'react';
import styled from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import chatroomImg from '../assets/images/trek1.png'; // Placeholder, replace with real images
import user1 from '../assets/images/trek1.png'; // Placeholder
import user2 from '../assets/images/trek1.png'; // Placeholder
import user3 from '../assets/images/trek1.png'; // Placeholder
import Navbar from './Navbar';

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
`;
const Section = styled.section`
  margin-bottom: 48px;
`;
const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
`;
const ChatroomGrid = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;
const ChatroomCard = styled.div`
  background: #181828;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 24px 32px;
  min-width: 260px;
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ChatroomImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  margin-bottom: 12px;
`;
const JoinButton = styled.button`
  background: #FF4B1F;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 18px;
  transition: background 0.18s;
  &:hover { background: #d13a13; }
`;
const LiveConversations = styled.div`
  background: #181828;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 24px 32px;
  margin-bottom: 32px;
`;
const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
`;
const MessageAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;
const MessageContent = styled.div`
  background: #23233a;
  border-radius: 12px;
  padding: 12px 18px;
  color: #fff;
  font-size: 1rem;
`;
const LeaderboardGrid = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;
const LeaderboardCard = styled.div`
  background: #181828;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 24px 32px;
  min-width: 220px;
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const LeaderAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;
const ShareBox = styled.div`
  background: #181828;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ShareInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  border-radius: 10px;
  border: none;
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 18px;
  resize: vertical;
`;
const ShareButton = styled.button`
  background: #FF4B1F;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.18s;
  &:hover { background: #d13a13; }
`;

const chatrooms = [
  { name: 'Himalayan Explorers', desc: 'Talk all things Himalayas!', img: chatroomImg },
  { name: 'Patagonia Trekkers', desc: 'Share Patagonia tips and plans.', img: chatroomImg },
  { name: 'Sahyadri Hikers', desc: 'Connect with local hikers.', img: chatroomImg },
  { name: 'Alpine Adventurers', desc: 'For lovers of the Alps.', img: chatroomImg },
];
const messages = [
  { user: 'JM', text: 'Anyone done the Annapurna Circuit in October?', img: user1 },
  { user: 'SL', text: 'October is perfect! Clear skies after the monsoon.', img: user2 },
  { user: 'EV', text: 'Just booked my W Trek for January!', img: user3 },
];
const leaderboard = [
  { name: 'James Mitchell', points: 1200, img: user1 },
  { name: 'Sarah Lin', points: 1100, img: user2 },
  { name: 'Elena Vega', points: 950, img: user3 },
];

const Community = () => (
  <Page>
    <Navbar active="community" />
    <Container>
      <Section>
        <SectionTitle>Join a Chatroom</SectionTitle>
        <ChatroomGrid>
          {chatrooms.map((room, idx) => (
            <ChatroomCard key={idx}>
              <ChatroomImage src={room.img} alt={room.name} />
              <h3 style={{marginBottom:4}}>{room.name}</h3>
              <p style={{color:'#ccc', marginBottom:8}}>{room.desc}</p>
              <JoinButton>Join</JoinButton>
            </ChatroomCard>
          ))}
        </ChatroomGrid>
      </Section>
      <Section>
        <SectionTitle>Live Conversations</SectionTitle>
        <LiveConversations>
          {messages.map((msg, idx) => (
            <Message key={idx}>
              <MessageAvatar src={msg.img} alt={msg.user} />
              <MessageContent>{msg.text}</MessageContent>
            </Message>
          ))}
        </LiveConversations>
      </Section>
      <Section>
        <SectionTitle>Leaderboard</SectionTitle>
        <LeaderboardGrid>
          {leaderboard.map((user, idx) => (
            <LeaderboardCard key={idx}>
              <LeaderAvatar src={user.img} alt={user.name} />
              <div style={{marginTop:4, fontWeight:600, fontSize:'1.1rem'}}>{user.name}</div>
              <div style={{color:'#FFD700', fontWeight:700, fontSize:'1.2rem', marginTop:6}}>{user.points} pts</div>
            </LeaderboardCard>
          ))}
        </LeaderboardGrid>
      </Section>
      <Section>
        <SectionTitle>Share your trek story</SectionTitle>
        <ShareBox>
          <ShareInput placeholder="Share your adventure, tips, or ask a question..." />
          <ShareButton>Share Story</ShareButton>
        </ShareBox>
      </Section>
    </Container>
  </Page>
);

export default Community; 