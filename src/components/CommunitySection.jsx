import React from "react";
import "./CommunitySection.css";
import birdsImg from "../assets/images/birds.png";
import styled from "styled-components";

// Add styled components for better responsive control
const SectionContainer = styled.section`
  position: relative;
  padding: 80px 0 100px;
  background: #f7f9fc;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 0 80px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0 60px;
  }
`;

const BirdsImage = styled.img`
  position: absolute;
  top: 40px;
  right: 5%;
  width: 100px;
  height: auto;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 80px;
    top: 30px;
    right: 3%;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    top: 20px;
  }
  
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  text-align: center;
  color: #181828;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const SubHeading = styled.p`
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 50px;
  color: #555;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
  justify-content: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const communityRooms = [
  {
    group: "Himalayan Explorers",
    online: 28,
    users: [
      {
        initials: "JM",
        name: "James Mitchell",
        level: 12,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "Has anyone done the Annapurna Circuit in October? Looking for weather advice.",
      },
      {
        initials: "SL",
        name: "Sarah Lin",
        level: 24,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "October is perfect! Clear skies after the monsoon, but bring layers for the Thorong La pass.",
      },
    ],
    btnColor: "#295a30",
  },
  {
    group: "Patagonia Trekkers",
    online: 19,
    users: [
      {
        initials: "EV",
        name: "Elena Vega",
        level: 11,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "Just booked my W Trek for January! Anyone else going to be there?",
      },
      {
        initials: "DT",
        name: "Daniel Thompson",
        level: 9,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "I'll be there Jan 15-22! Would love to connect. Has anyone used the refugios?",
      },
    ],
    btnColor: "#295a30",
  },
];

export default function CommunitySection() {
  return (
    <SectionContainer className="community-section">
      <BirdsImage src={birdsImg} alt="birds" className="birds-img" />
      <ContentContainer className="community-content">
        <Heading className="community-heading">Join Our Community</Heading>
        <SubHeading className="community-subheading">
          Connect with fellow adventurers, share experiences, and plan your next expedition together.
        </SubHeading>
        <CardsContainer className="community-cards">
          {communityRooms.map((room, idx) => (
            <div className="community-card" key={room.group}>
              <div className="community-card-header">
                <span className="community-group">{room.group}</span>
                <span className="community-online">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginRight: 4}}>
                    <circle cx="10" cy="10" r="10" fill="#c8fad0"/>
                    <path d="M10 10c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-2.5C17 13.17 12.33 12 10 12z" fill="#2a8a34"/>
                  </svg>
                  <span style={{color:'#2a8a34', fontWeight:500}}>{room.online} online</span>
                </span>
              </div>
              <div className="community-users">
                {room.users.map((user, i) => (
                  <div className="community-user" key={user.name}>
                    <span className="user-avatar" style={{background:i===0?"#c0cdfa":"#e99ad7", color:i===0?"#295a4a":"#b0336e"}}>{user.initials}</span>
                    <div className="user-info">
                      <div className="user-name-row">
                        <span className="user-name">{user.name}</span>
                        <span className="user-level" style={{background:user.levelColor, color:user.levelTextColor}}>Level {user.level}</span>
                      </div>
                      <div className="user-msg">{user.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="join-room-btn" style={{background:room.btnColor}}>Join Room</button>
            </div>
          ))}
        </CardsContainer>
      </ContentContainer>
    </SectionContainer>
  );
}