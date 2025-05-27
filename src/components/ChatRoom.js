import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes,css } from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, updateDoc, where, deleteDoc, Timestamp, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import mapPattern from '../assets/images/map-pattren.png';
import user1 from '../assets/images/trek1.png'; // Placeholder

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 75, 31, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 75, 31, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 75, 31, 0.5); }
`;

const typing = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 80px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
    pointer-events: none;
  }
`;

const ChatContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: rgba(24, 24, 40, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: none;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  
  &:hover {
    color: #FF4B1F;
  }
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomName = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  
  &:after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #4ad991;
    border-radius: 50%;
    margin-left: 10px;
  }
`;

const RoomDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
`;

const MembersCount = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 6px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: rgba(24, 24, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
  border-bottom: none;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const MessageGroup = styled.div`
  margin-bottom: 20px;
`;

const MessageDate = styled.div`
  text-align: center;
  margin: 24px 0;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    z-index: -1;
  }
  
  span {
    background: rgba(24, 24, 40, 0.9);
    padding: 0 16px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
  }
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 16px;
  animation: ${slideIn} 0.3s ease-out forwards;
  flex-direction: ${props => props.isCurrentUser ? 'row-reverse' : 'row'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MessageAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: ${props => props.isCurrentUser ? '0' : '12px'};
  margin-left: ${props => props.isCurrentUser ? '12px' : '0'};
  border: 2px solid ${props => props.isCurrentUser ? 'rgba(255, 75, 31, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  
  ${props => props.isCurrentUser && css`
    animation: ${glow} 3s infinite ease-in-out;
  `}
`;

const MessageContent = styled.div`
  max-width: 80%;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
  justify-content: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
`;

const MessageSender = styled.div`
  font-weight: 600;
  margin-right: 8px;
  color: ${props => props.isCurrentUser ? '#FF9E1F' : 'inherit'};
`;

const MessageTime = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MessageText = styled.div`
  background: ${props => props.isCurrentUser ? 'linear-gradient(90deg, #FF4B1F, #FF9E1F)' : 'rgba(255, 255, 255, 0.05)'};
  padding: 12px 16px;
  border-radius: 12px;
  border-top-left-radius: ${props => props.isCurrentUser ? '12px' : '4px'};
  border-top-right-radius: ${props => props.isCurrentUser ? '4px' : '12px'};
  line-height: 1.5;
  word-wrap: break-word;
  color: ${props => props.isCurrentUser ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  text-align: ${props => props.isCurrentUser ? 'right' : 'left'};
  position: relative;
  
  ${props => props.isSending && css`
    &:after {
      content: '...';
      position: absolute;
      bottom: 5px;
      right: ${props.isCurrentUser ? '5px' : 'auto'};
      left: ${props.isCurrentUser ? 'auto' : '5px'};
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.2em;
      animation: ${typing} 1s infinite;
    }
  `}
`;

const EmptyMessagesState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 30px;
  text-align: center;
  
  svg {
    width: 60px;
    height: 60px;
    opacity: 0.3;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }
  
  p {
    color: rgba(255, 255, 255, 0.5);
    max-width: 400px;
    line-height: 1.5;
  }
`;

const InputContainer = styled.form`
  padding: 16px 24px;
  background: rgba(24, 24, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0 0 16px 16px;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 12px 20px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 75, 31, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(90deg, #FF4B1F, #FF9E1F);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 75, 31, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
  text-align: center;
  border-left: 4px solid #ff6b6b;
  animation: ${fadeIn} 0.3s ease-out forwards;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: #4ad991;
  border-radius: 50%;
  border: 2px solid rgba(24, 24, 40, 0.8);
`;

const UserActivity = styled.div`
  background: rgba(24, 24, 40, 0.6);
  border-radius: 16px;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 8px 0;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out forwards;
`;

// Helper to format dates
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
};

// Helper to format time
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState(location.state?.room || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Get room data if not provided in location state
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      
      try {
        if (!room) {
          const roomsCollection = collection(db, 'chatrooms');
          const roomsQuery = query(roomsCollection);
          const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
            const roomData = snapshot.docs
              .map(doc => ({...doc.data(), docId: doc.id}))
              .find(r => r.id === roomId);
              
            if (roomData) {
              setRoom(roomData);
            } else {
              setError(`Room "${roomId}" not found`);
            }
          });
          
          return () => unsubscribe();
        }
      } catch (err) {
        console.error('Error fetching room:', err);
        setError(`Failed to load room: ${err.message}`);
      }
    };
    
    fetchRoom();
  }, [roomId, room]);

   useEffect(() => {
    if (!roomId) return;
    
    const handleMessageCleanup = async () => {
      try {
        // Calculate timestamp from 8 hours ago
        const eightHoursAgo = new Date();
        eightHoursAgo.setHours(eightHoursAgo.getHours() - 8);
        const cutoffTimestamp = Timestamp.fromDate(eightHoursAgo);
        
        // Query for messages older than 8 hours
        const messagesRef = collection(db, `chatrooms/${roomId}/messages`);
        const oldMessagesQuery = query(
          messagesRef,
          where('timestamp', '<', cutoffTimestamp)
        );
        
        // Delete old messages
        const snapshot = await getDocs(oldMessagesQuery);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        console.log(`Deleted ${snapshot.docs.length} messages older than 8 hours`);
      } catch (err) {
        console.error('Error cleaning up old messages:', err);
      }
    };
        handleMessageCleanup();
    
    // Set interval to run cleanup every hour
    const cleanupInterval = setInterval(handleMessageCleanup, 60 * 60 * 1000);
    
    return () => clearInterval(cleanupInterval);
  }, [roomId]);
  
  // Fetch messages
  useEffect(() => {
    if (!roomId) return;
    
    const q = query(
      collection(db, `chatrooms/${roomId}/messages`),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      
      // Update message count in the room document
      if (room?.docId) {
        updateDoc(doc(db, 'chatrooms', room.docId), {
          messageCount: newMessages.length
        }).catch(err => console.error('Error updating message count:', err));
      }
    });
    
    return () => unsubscribe();
  }, [roomId, room]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, localMessages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || !auth.currentUser) return;
    
    // Add temporary local message for immediate feedback
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: newMessage.trim(),
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      userPhoto: auth.currentUser.photoURL || null,
      isLocal: true, // Mark as local/pending
      timestamp: new Date()
    };
    
    setLocalMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    try {
      // Send to Firestore
      await addDoc(collection(db, `chatrooms/${roomId}/messages`), {
        text: tempMessage.text,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp()
      });
      
      // Remove local message once it's saved
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setError('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
      
      // Remove failed message
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };
  
  // Group messages by date
  const allMessages = [...messages, ...localMessages];
  const groupedMessages = allMessages.reduce((groups, message) => {
    const date = message.timestamp ? 
      (message.isLocal ? 'Just now' : formatDate(message.timestamp)) : 
      'Just now';
      
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <Page>
      <Navbar active="community" />
      <ChatContainer>
        <ChatHeader>
          <BackButton onClick={() => navigate('/community')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          
          {room && (
            <>
              <RoomInfo>
                <RoomName>{room.name}</RoomName>
                <RoomDescription>{room.desc}</RoomDescription>
              </RoomInfo>
              
              <MembersCount>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 21C3 18 7 15 12 15C17 15 21 18 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {room.members?.length || 0} members
              </MembersCount>
            </>
          )}
        </ChatHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <MessagesContainer>
          {allMessages.length === 0 ? (
            <EmptyMessagesState>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No messages yet</h3>
              <p>Be the first to start a conversation in this community!</p>
            </EmptyMessagesState>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <MessageGroup key={date}>
                <MessageDate><span>{date}</span></MessageDate>
                
                {dateMessages.map((msg) => (
                  <Message key={msg.id} isCurrentUser={msg.userId === auth.currentUser?.uid}>
                    <MessageAvatar 
                      src={msg.userPhoto || user1} 
                      alt={msg.userName}
                      isCurrentUser={msg.userId === auth.currentUser?.uid}
                    />
                    <MessageContent>
                      <MessageHeader isCurrentUser={msg.userId === auth.currentUser?.uid}>
                        <MessageSender isCurrentUser={msg.userId === auth.currentUser?.uid}>
                          {msg.userName}
                        </MessageSender>
                        <MessageTime>
                          {msg.isLocal ? 'sending...' : (msg.timestamp ? formatTime(msg.timestamp) : 'processing...')}
                        </MessageTime>
                      </MessageHeader>
                      <MessageText 
                        isCurrentUser={msg.userId === auth.currentUser?.uid}
                        isSending={msg.isLocal}
                      >
                        {msg.text}
                      </MessageText>
                    </MessageContent>
                  </Message>
                ))}
              </MessageGroup>
            ))
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer onSubmit={handleSendMessage}>
          <MessageInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={auth.currentUser ? "Type your message..." : "Sign in to send messages"}
            disabled={loading || !auth.currentUser}
          />
          <SendButton type="submit" disabled={loading || !newMessage.trim() || !auth.currentUser}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </Page>
  );
};

export default ChatRoom;