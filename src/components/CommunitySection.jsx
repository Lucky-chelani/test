import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import birdsImg from "../assets/images/birds.png";
import mapPattern from "../assets/images/map-pattren.png";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 160, 91, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(66, 160, 91, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 160, 91, 0); }
`;

const typeAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const SectionContainer = styled.section`
  position: relative;
  padding: 100px 0 120px;
  background: linear-gradient(135deg, #f7faff 0%, #f0f5fc 100%);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${mapPattern});
    background-size: 800px;
    background-repeat: repeat;
    opacity: 0.04;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 70px 0 90px;
  }
  
  @media (max-width: 480px) {
    padding: 50px 0 70px;
  }
`;

const BirdsImage = styled.img`
  position: absolute;
  top: 40px;
  right: 5%;
  width: 120px;
  height: auto;
  z-index: 1;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  
  @media (max-width: 768px) {
    width: 90px;
    top: 30px;
    right: 3%;
  }
  
  @media (max-width: 480px) {
    width: 70px;
    top: 20px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const HeadingWrapper = styled.div`
  margin-bottom: 70px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    margin-bottom: 50px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 40px;
  }
`;

const Heading = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  color: #181828;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 6px;
    background: linear-gradient(90deg, #FFD2BF, #ffbfa3);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SubHeading = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 700px;
  margin: 30px auto 0;
  color: #555;
  line-height: 1.7;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-top: 25px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-top: 20px;
  }
`;

const SearchWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto 50px;
  animation: ${fadeIn} 0.6s ease-out 0.2s backwards;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  padding: 6px 6px 6px 20px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 8px 35px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 210, 191, 0.5);
    transform: translateY(-2px);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  font-size: 1.05rem;
  padding: 12px 0;
  color: #333;
  background: transparent;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #FFD2BF, #ffbfa3);
  color: #181828;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: linear-gradient(135deg, #ffbfa3, #FFA882);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 210, 191, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 15px;
  animation: ${fadeIn} 0.6s ease-out 0.3s backwards;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Tab = styled.button`
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: ${props => props.active ? '700' : '500'};
  color: ${props => props.active ? '#181828' : '#666'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 5px 20px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
  justify-content: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CommunityCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.6s ease-out ${props => 0.4 + props.index * 0.1}s backwards;
  position: relative;
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 210, 191, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props => props.btnColor || '#295a30'};
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 0.6;
  }
`;

const CardHeader = styled.div`
  padding: 25px 25px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const GroupName = styled.span`
  font-size: 1.3rem;
  font-weight: 800;
  color: #181828;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .group-icon {
    width: 26px;
    height: 26px;
    fill: ${props => props.btnColor || '#295a30'};
    opacity: 0.9;
  }
`;

const OnlineUsers = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f9f2;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #2a8a34;
  font-weight: 600;
  
  .online-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4aed88;
    display: inline-block;
    animation: ${pulse} 2s infinite;
  }
`;

const UsersContainer = styled.div`
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserItem = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  
  &:nth-child(2) {
    margin-left: 15px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bg || '#c0cdfa'};
  color: ${props => props.color || '#295a4a'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 2px solid white;
`;

const UserInfoWrapper = styled.div`
  flex: 1;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const UserName = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: #333;
`;

const UserLevel = styled.span`
  background: ${props => props.bg || '#c8fad0'};
  color: ${props => props.color || '#2a8a34'};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 10px;
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: #999;
  margin-left: auto;
`;

const MessageBubble = styled.div`
  background: ${props => props.isNew ? '#f8f9fa' : 'transparent'};
  border-radius: 12px;
  padding: ${props => props.isNew ? '10px 14px' : '0'};
  color: #444;
  line-height: 1.5;
  font-size: 0.95rem;
  position: relative;
  border-left: ${props => props.isNew ? '3px solid #ffbfa3' : '0'};
  animation: ${props => props.isNew ? typeAnimation : 'none'} 1.5s steps(40, end);
`;

const MessageStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #888;
  
  .status-icon {
    color: ${props => props.isLiked ? '#ff7e5f' : '#888'};
  }
  
  .likes {
    color: ${props => props.isLiked ? '#ff7e5f' : '#888'};
    font-weight: ${props => props.isLiked ? '600' : '400'};
  }
`;

const ActionButton = styled.button`
  margin: 5px 25px 25px;
  background: ${props => props.bg || '#295a30'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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
    transition: left 0.7s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const PopularTag = styled.div`
  position: absolute;
  top: 25px;
  right: -33px;
  background: linear-gradient(135deg, #FFD2BF, #ffbfa3);
  color: #181828;
  transform: rotate(45deg);
  padding: 6px 40px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
`;

const SeeMoreButton = styled.button`
  display: block;
  margin: 50px auto 0;
  background: transparent;
  border: 2px solid rgba(255, 210, 191, 0.6);
  color: #333;
  border-radius: 14px;
  padding: 14px 34px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out 0.7s backwards;
  
  &:hover {
    background: rgba(255, 210, 191, 0.1);
    border-color: rgba(255, 210, 191, 1);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const LoadingSkeletonCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  height: 350px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
    background-size: 300% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
`;

// Enhanced community data with more realistic details
const communityRooms = [
  {
    group: "Himalayan Explorers",
    icon: "mountain",
    online: 28,
    popular: true,
    users: [
      {
        initials: "JM",
        name: "James Mitchell",
        level: 12,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "Has anyone done the Annapurna Circuit in October? Looking for weather advice.",
        time: "2m ago",
        likes: 4,
      },
      {
        initials: "SL",
        name: "Sarah Lin",
        level: 24,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "October is perfect! Clear skies after the monsoon, but bring layers for the Thorong La pass.",
        time: "Just now",
        likes: 2,
        isNew: true,
      },
    ],
    btnColor: "#295a30",
    memberCount: 1243,
    tags: ["Hiking", "Nepal", "Mountaineering"]
  },
  {
    group: "Patagonia Trekkers",
    icon: "map",
    online: 19,
    users: [
      {
        initials: "EV",
        name: "Elena Vega",
        level: 11,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "Just booked my W Trek for January! Anyone else going to be there?",
        time: "5m ago",
        likes: 7,
      },
      {
        initials: "DT",
        name: "Daniel Thompson",
        level: 9,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "I'll be there Jan 15-22! Would love to connect. Has anyone used the refugios?",
        time: "1m ago",
        likes: 3,
        isNew: true,
      },
    ],
    btnColor: "#19647e",
    memberCount: 892,
    tags: ["Patagonia", "Chile", "Wildlife"]
  },
  {
    group: "Alpine Adventures",
    icon: "compass",
    online: 34,
    users: [
      {
        initials: "JS",
        name: "Julie Smith",
        level: 18,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "What's the best time to hike the Tour du Mont Blanc? I'm planning to go solo.",
        time: "12m ago",
        likes: 9,
      },
      {
        initials: "MA",
        name: "Mark Anderson",
        level: 31,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "July-August is ideal. I did it solo last year. Happy to share my itinerary!",
        time: "4m ago",
        likes: 5,
      },
    ],
    btnColor: "#4f518c",
    memberCount: 1562,
    tags: ["Alpine", "Europe", "Tour du Mont Blanc"]
  },
];

export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedMessages, setLikedMessages] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setLoading(true);
    // Simulating search request
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleLikeToggle = (roomIndex, userIndex) => {
    const key = `${roomIndex}-${userIndex}`;
    setLikedMessages({
      ...likedMessages,
      [key]: !likedMessages[key]
    });
  };

  // Render the appropriate icon based on the group type
  const renderGroupIcon = (iconType) => {
    switch(iconType) {
      case "mountain":
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <path d="M22.5,21H1.5L7.71,5.74a1,1,0,0,1,1.72,0L11.9,11.64,14.57,7.29a1,1,0,0,1,1.72,0Z" />
          </svg>
        );
      case "map":
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <path d="M20.12,11.5l-6.65-6.65a2,2,0,0,0-2.83,0L3.88,11.5A3,3,0,0,0,3,13.79V21a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V16a1,1,0,0,1,1-1h0a1,1,0,0,1,1,1v5a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V13.79A3,3,0,0,0,20.12,11.5Z" />
          </svg>
        );
      case "compass":
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      default:
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H13v3a1,1,0,0,1-2,0V13H8a1,1,0,0,1,0-2h3V8a1,1,0,0,1,2,0v3h3a1,1,0,0,1,0,2Z" />
          </svg>
        );
    }
  };

  return (
    <SectionContainer className="community-section">
      <BirdsImage src={birdsImg} alt="birds" className="birds-img" />
      <ContentContainer className="community-content">
        <HeadingWrapper>
          <Heading className="community-heading">Join Our Community</Heading>
          <SubHeading className="community-subheading">
            Connect with fellow adventurers, share experiences, and plan your next expedition together. 
            Our vibrant community is full of passionate travelers eager to share their knowledge.
          </SubHeading>
        </HeadingWrapper>
        
        <SearchWrapper>
          <SearchBar>
            <SearchInput 
              type="text" 
              placeholder="Search communities, topics, or locations..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </SearchButton>
          </SearchBar>
        </SearchWrapper>
        
        <TabsContainer>
          <Tab active={activeTab === "Popular"} onClick={() => setActiveTab("Popular")}>
            Popular
          </Tab>
          <Tab active={activeTab === "New"} onClick={() => setActiveTab("New")}>
            New
          </Tab>
          <Tab active={activeTab === "Active"} onClick={() => setActiveTab("Active")}>
            Most Active
          </Tab>
        </TabsContainer>
        
        <CardsContainer className="community-cards">
          {loading ? (
            // Show loading skeletons when searching
            Array(3).fill().map((_, i) => (
              <LoadingSkeletonCard key={i} />
            ))
          ) : (
            // Show community cards
            communityRooms.map((room, idx) => (
              <CommunityCard 
                key={room.group} 
                btnColor={room.btnColor}
                index={idx}
              >
                {room.popular && <PopularTag>Popular</PopularTag>}
                <CardHeader>
                  <GroupName btnColor={room.btnColor}>
                    {renderGroupIcon(room.icon)}
                    {room.group}
                  </GroupName>
                  <OnlineUsers>
                    <span className="online-dot"></span>
                    {room.online} online
                  </OnlineUsers>
                </CardHeader>
                <UsersContainer>
                  {room.users.map((user, i) => (
                    <UserItem key={user.name}>
                      <UserAvatar 
                        bg={i===0 ? "#c0cdfa" : "#e99ad7"} 
                        color={i===0 ? "#295a4a" : "#b0336e"}
                      >
                        {user.initials}
                      </UserAvatar>
                      <UserInfoWrapper>
                        <UserHeader>
                          <UserName>{user.name}</UserName>
                          <UserLevel bg={user.levelColor} color={user.levelTextColor}>
                            Level {user.level}
                          </UserLevel>
                          <MessageTime>{user.time}</MessageTime>
                        </UserHeader>
                        <MessageBubble isNew={user.isNew}>
                          {user.msg}
                        </MessageBubble>
                        <MessageStatus isLiked={likedMessages[`${idx}-${i}`]}>
                          <span 
                            className="status-icon" 
                            onClick={() => handleLikeToggle(idx, i)}
                            style={{cursor: 'pointer'}}
                          >
                            {likedMessages[`${idx}-${i}`] ? "♥" : "♡"}
                          </span>
                          <span className="likes">
                            {likedMessages[`${idx}-${i}`] ? user.likes + 1 : user.likes} likes
                          </span>
                          <span>•</span>
                          <span>Reply</span>
                        </MessageStatus>
                      </UserInfoWrapper>
                    </UserItem>
                  ))}
                </UsersContainer>
                <ActionButton bg={room.btnColor}>
                  Join Room
                </ActionButton>
              </CommunityCard>
            ))
          )}
        </CardsContainer>
        
        <SeeMoreButton>
          See More Communities
        </SeeMoreButton>
      </ContentContainer>
    </SectionContainer>
  );
}