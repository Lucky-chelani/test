import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion, 
  where, 
  getDocs, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import user1 from '../assets/images/user1.jpg';
import mapPattern from '../assets/images/pattern.png';

// Animations
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 75, 31, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 75, 31, 0.8);
  }
`;

const typing = keyframes`
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-10px);
  }
`;

// This file now exports the improved ChatRoom component

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
  height: calc(100vh - 140px); /* Adjusted to account for bottom navbar */
  min-height: 600px;
  
  @media (max-width: 768px) {
    padding: 10px;
    height: calc(100vh - 160px); /* More space for mobile */
  }
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
  min-height: 300px; /* Ensure minimum height */
  max-height: calc(100vh - 320px); /* Prevent overflow */
  
  @media (max-width: 768px) {
    padding: 16px;
    max-height: calc(100vh - 280px);
  }
  
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

const MessageExpiration = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
  text-align: right;
  font-style: italic;
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
  background: rgba(24, 24, 40, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 16px 16px;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out forwards;
  position: sticky;
  bottom: 0;
  z-index: 10;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    border-radius: 0 0 12px 12px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 14px 20px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 75, 31, 0.7);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(255, 75, 31, 0.2);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    font-size: 16px; /* Prevent zoom on mobile */
    padding: 12px 18px;
    
    /* Prevent keyboard from hiding on mobile */
    &:focus {
      -webkit-user-select: text;
      user-select: text;
    }
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #FF4B1F 0%, #FF9E1F 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 75, 31, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 6px 25px rgba(255, 75, 31, 0.5);
  }
  
  &:active:not(:disabled) {
    transform: scale(1.05) translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(255, 75, 31, 0.2);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    margin-left: 10px;
    
    /* Prevent button from stealing focus on mobile */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
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

const NotificationBanner = styled.div`
  background: rgba(58, 102, 219, 0.15);
  border: 2px solid rgba(58, 102, 219, 0.3);
  padding: 16px 20px;
  border-radius: 12px;
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.5s ease-out;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

// Format date for message groups
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp.toDate ? timestamp.toDate() : timestamp;
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Calculate remaining time before message expiration
const getExpirationTimeLeft = (expiresAt) => {
  if (!expiresAt || !expiresAt.toDate) return null;
  
  const now = new Date();
  const expDate = expiresAt.toDate();
  const diffMs = expDate - now;
  
  if (diffMs <= 0) return "Expiring soon...";
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `Expires in ${hours}h ${minutes}m`;
  } else {
    return `Expires in ${minutes} minutes`;
  }
};

// Format time for individual messages
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Using the improved ChatRoom component for better mobile keyboard handling
const ChatRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, room: initialRoom } = location.state || {};
  
  const [room, setRoom] = useState(initialRoom);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isUserMember, setIsUserMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  
  // Redirect if no room data
  if (!roomId) {
    return <Navigate to="/community" replace />;
  }
  
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
              
              // Check if current user is a member of this room
              if (auth.currentUser && roomData.members) {
                setIsUserMember(roomData.members.includes(auth.currentUser.uid));
              } else {
                setIsUserMember(false);
              }
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
  }, [roomId, room]);   useEffect(() => {
    if (!roomId) return;
      const handleMessageCleanup = async () => {
      try {
        // Calculate current timestamp
        const now = new Date();
        const currentTimestamp = Timestamp.fromDate(now);
        
        // Query for messages where expiresAt has passed OR messages older than 8 hours
        const messagesRef = collection(db, `chatrooms/${roomId}/messages`);
        
        // First try to get messages with expiresAt field that have expired
        const expiredMessagesQuery = query(
          messagesRef,
          where('expiresAt', '<', currentTimestamp)
        );
        
        // Also get messages without expiresAt field but older than 8 hours
        const eightHoursAgo = new Date();
        eightHoursAgo.setHours(eightHoursAgo.getHours() - 8);
        const cutoffTimestamp = Timestamp.fromDate(eightHoursAgo);
        
        const oldMessagesQuery = query(
          messagesRef,
          where('timestamp', '<', cutoffTimestamp)
        );
          // Delete expired messages based on expiresAt field
        const expiredSnapshot = await getDocs(expiredMessagesQuery);
        const expiredPromises = expiredSnapshot.docs.map(doc => deleteDoc(doc.ref));
        
        // Delete old messages based on timestamp
        const oldSnapshot = await getDocs(oldMessagesQuery);
        const oldPromises = oldSnapshot.docs.map(doc => deleteDoc(doc.ref));
        
        // Combine and execute all delete operations
        await Promise.all([...expiredPromises, ...oldPromises]);
        
        const totalDeleted = expiredSnapshot.docs.length + oldSnapshot.docs.length;
        
        if (totalDeleted > 0) {
          console.log(`Deleted ${totalDeleted} messages (${expiredSnapshot.docs.length} expired + ${oldSnapshot.docs.length} old)`);
          
          // Update message count in the room document after deletion
          if (room?.docId) {
            // Get current message count
            const currentMessagesQuery = query(
              collection(db, `chatrooms/${roomId}/messages`)
            );
            const currentSnapshot = await getDocs(currentMessagesQuery);
            
            updateDoc(doc(db, 'chatrooms', room.docId), {
              messageCount: currentSnapshot.size
            }).catch(err => console.error('Error updating message count after cleanup:', err));
          }
        }
      } catch (err) {
        console.error('Error cleaning up old messages:', err);
      }
    };
    
    // Run cleanup immediately when entering the room
    handleMessageCleanup();
    
    // Set interval to run cleanup every hour
    const cleanupInterval = setInterval(handleMessageCleanup, 60 * 60 * 1000);
    
    return () => clearInterval(cleanupInterval);
  }, [roomId, room]);
  
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
    
    // Check if user is logged in
    if (!auth.currentUser) {
      setError('Please sign in to send messages');
      return;
    }
    
    // Check if message is not empty
    if (!newMessage.trim() || !roomId) return;
    
    // Check if user is a member before attempting to send
    if (!isUserMember) {
      setError('You need to join this community before sending messages');
      return;
    }
    
    // Store the message to send
    const messageToSend = newMessage.trim();
    
    // Clear input immediately and maintain focus for mobile
    setNewMessage('');
    
    // Add temporary local message for immediate feedback
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageToSend,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      userPhoto: auth.currentUser.photoURL || null,
      isLocal: true, // Mark as local/pending
      timestamp: new Date()
    };
    
    setLocalMessages(prev => [...prev, tempMessage]);
      try {
      // Calculate expiration time (8 hours from now)
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 8);
      
      // Send to Firestore
      await addDoc(collection(db, `chatrooms/${roomId}/messages`), {
        text: messageToSend,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expirationTime), // Add expiration timestamp
        ttl: '8 hours' // Add readable TTL for UI purposes
      });
        // Remove local message once it's saved
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setError('');
      
      // Keep focus on input for mobile keyboard after successful send
      if (messageInputRef.current && window.innerWidth <= 768) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          messageInputRef.current.focus();
          // Scroll input into view if needed
          messageInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Specifically handle permission errors with clearer message
      if (err.code === 'permission-denied' || err.message.includes('permission') || err.message.includes('insufficient')) {
        setError('You don\'t have permission to send messages in this community. You may need to join first.');
      } else {
        setError('Failed to send message. Please try again.');
      }
      
      // Remove failed message
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };
  
  // New function to handle sending message without losing focus
  const handleSendClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent button from taking focus on mobile
    if (messageInputRef.current && window.innerWidth <= 768) {
      messageInputRef.current.focus();
    }
    
    handleSendMessage(e);
  };
  
  // New function to handle joining a room
  const handleJoinRoom = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!room || !room.docId) {
      setError('Cannot join room - room information is missing');
      return;
    }

    try {
      setJoining(true);
      
      // Add user to the members array
      const roomRef = doc(db, 'chatrooms', room.docId);
      await updateDoc(roomRef, {
        members: arrayUnion(auth.currentUser.uid)
      });
      
      // Update local state
      setIsUserMember(true);
      setRoom(prev => ({
        ...prev,
        members: [...(prev.members || []), auth.currentUser.uid]
      }));
      
      setError(''); // Clear any errors
    } catch (err) {
      console.error('Error joining room:', err);
      
      if (err.code === 'permission-denied') {
        setError('You don\'t have permission to join this community.');
      } else {
        setError(`Failed to join community: ${err.message}`);
      }
    } finally {
      setJoining(false);
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
      {/* Removed Navbar - using BottomNavbar from App.js */}
      <ChatContainer>
        <ChatHeader>
          <BackButton onClick={() => navigate('/community')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </BackButton>
          
          {room && (
            <>              <RoomInfo>
                <RoomName>{room.name}</RoomName>
                <RoomDescription>{room.desc}</RoomDescription>
              </RoomInfo>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {!isUserMember && auth.currentUser && (
                  <SendButton 
                    onClick={handleJoinRoom} 
                    disabled={joining} 
                    style={{ background: 'linear-gradient(90deg, #3a66db, #2752bb)' }}
                  >
                    {joining ? 'Joining...' : 'Join Community'}
                  </SendButton>
                )}
                
                <MembersCount>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 21C3 18 7 15 12 15C17 15 21 18 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {room.members?.length || 0} members
                </MembersCount>
              </div>
            </>
          )}
        </ChatHeader>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {auth.currentUser && !isUserMember && !error && (
          <NotificationBanner>
            <span>🚀 Join this community to participate in the conversation</span>
            <SendButton 
              onClick={handleJoinRoom} 
              disabled={joining} 
              style={{ 
                background: 'linear-gradient(135deg, #3a66db 0%, #2752bb 100%)',
                padding: '8px 16px',
                minWidth: 'auto',
                borderRadius: '20px',
                height: '36px',
                width: 'auto'
              }}
            >
              {joining ? 'Joining...' : 'Join Now'}
            </SendButton>
          </NotificationBanner>
        )}
        
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
                      </MessageText>                      {msg.expiresAt && (
                        <MessageExpiration>
                          {getExpirationTimeLeft(msg.expiresAt)}
                        </MessageExpiration>
                      )}
                    </MessageContent>
                  </Message>
                ))}
              </MessageGroup>
            ))
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        {/* Fixed Input Container */}
        <InputContainer onSubmit={handleSendMessage}>
          {!auth.currentUser ? (
            // User is not logged in
            <>
              <MessageInput
                disabled={true}
                placeholder="Sign in to send messages"
              />
              <SendButton type="button" disabled={true}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SendButton>
            </>
          ) : !isUserMember ? (
            // User is logged in but not a member
            <>
              <MessageInput
                disabled={true}
                placeholder="Join this community to send messages"
              />
              <SendButton 
                type="button" 
                onClick={handleJoinRoom}
                disabled={joining}
                style={{ background: 'linear-gradient(90deg, #3a66db, #2752bb)' }}
              >
                {joining ? '...' : 'Join'}
              </SendButton>
            </>
          ) : (
            // User is logged in and a member
            <>
              <MessageInput
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                onBlur={(e) => {
                  // Prevent blur on mobile when tapping send button
                  if (window.innerWidth <= 768) {
                    e.preventDefault();
                    setTimeout(() => {
                      if (messageInputRef.current) {
                        messageInputRef.current.focus();
                      }
                    }, 100);
                  }
                }}
              />
              <SendButton 
                type="button" 
                onClick={handleSendClick}
                disabled={loading || !newMessage.trim()}
                onMouseDown={(e) => {
                  // Prevent button from taking focus on mobile
                  if (window.innerWidth <= 768) {
                    e.preventDefault();
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SendButton>
            </>
          )}
        </InputContainer>
      </ChatContainer>
    </Page>
  );
};

export default ChatRoom;
