import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, where, Timestamp, getDocs, arrayUnion } from 'firebase/firestore';
import mapPattern from '../assets/images/map-pattren.png';
import user1 from '../assets/images/trek1.png'; // Placeholder

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmerEffect = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;





// Enhanced visuals for the chat page
const Page = styled.div`
  background: #060F1B url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  color: #fff;
  padding-top: 80px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(10, 26, 47, 0.4) 0%, rgba(10, 26, 47, 0.9) 100%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding-top: 0; // Remove top padding on mobile for full screen
  }
`;

const ChatContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(15, 24, 42, 0.85);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  position: relative;
  z-index: 1;
  
  height: calc(100vh - 100px);

  @media (max-width: 768px) {
    /* Use dvh for mobile to account for address bars */
    height: 100dvh; 
    
    /* Fallback for older browsers */
    height: -webkit-fill-available;
    
    border-radius: 0;
    margin: 0;
    max-width: 100%;
    position: fixed; /* Keep fixed */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
`;

const ChatHeader = styled.div`
  padding: 15px 25px;
  background: rgba(10, 17, 30, 0.9);
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  gap: 15px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomName = styled.h2`
  margin: 0 0 5px 0;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(to right, #80FFDB, #5390D9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const RoomDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
  position: relative;
  
  @media (max-width: 768px) {
    /* Ensures content doesn't shift when keyboard appears */
    height: 0;
    flex: 1 1 auto;
  }
  
  -webkit-overflow-scrolling: touch;

  overflow-x: hidden; 
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const DateDivider = styled.div`
  text-align: center;
  margin: 15px 0;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
`;

const DateLabel = styled.span`
  background: rgba(15, 24, 42, 0.8);
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 2;
`;

const ChatForm = styled.form`
  display: flex;
  padding: 20px;
  background: rgba(10, 17, 30, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 15px;
  align-items: center;
  position: relative;
  z-index: 5;
  
  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    width: 100%;
    
    /* CRITICAL FIX: Adds padding so the home bar doesn't cover the input */
    padding-bottom: calc(15px + env(safe-area-inset-bottom)); 
    background: rgba(10, 17, 30, 1); /* Make background solid on mobile to hide content behind it */
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  
  @media (max-width: 768px) {
    /* Better handling of input on mobile */
    padding: 12px 16px;
    font-size: 16px; /* Prevents iOS zoom on input focus */
    -webkit-appearance: none; /* Remove iOS default styling */
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px rgba(128, 255, 219, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(83, 144, 217, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

// Improved message component with better visual design
const MessageWrapper = styled.div`
  display: flex;
  flex-direction: ${props => props.$isCurrentUser ? 'row-reverse' : 'row'};
  align-items: flex-start;
  gap: 12px;
  margin: 8px 0;
  max-width: 80%;
  align-self: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  
  ${props => props.$isLocal && css`
    opacity: 0.7;
  `}
  
  ${props => props.$sendFailed && css`
    opacity: 0.6;
  `}
  
  /* Special visual indicator for sending state to improve UX */
  ${props => props.$isSending && css`
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      right: ${props.$isCurrentUser ? '40px' : 'auto'};
      left: ${props.$isCurrentUser ? 'auto' : '40px'};
      width: 24px;
      height: 2px;
      background: linear-gradient(to right, 
        rgba(255, 255, 255, 0) 0%, 
        rgba(255, 255, 255, 0.9) 50%, 
        rgba(255, 255, 255, 0) 100%);
      border-radius: 1px;
      animation: ${shimmerEffect} 1.5s infinite linear;
    }
  `}
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${props => props.src || user1});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  border: 2px solid ${props => props.$isCurrentUser ? 'rgba(128, 255, 219, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${props => props.$isCurrentUser ? 
      'linear-gradient(135deg, rgba(128, 255, 219, 0.2), rgba(83, 144, 217, 0.2))' : 
      'none'};
    z-index: -1;
  }
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const MessageBubble = styled.div`
  background: ${props => props.$isCurrentUser ? 
    'linear-gradient(135deg, rgba(83, 144, 217, 0.9), rgba(116, 0, 184, 0.8))' : 
    'rgba(255, 255, 255, 0.1)'};
  color: white;
  padding: 12px 18px;
  border-radius: 18px;
  border-top-right-radius: ${props => props.$isCurrentUser ? '4px' : '18px'};
  border-top-left-radius: ${props => !props.$isCurrentUser ? '4px' : '18px'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid ${props => props.$isCurrentUser ? 
    'rgba(128, 255, 219, 0.3)' : 
    'rgba(255, 255, 255, 0.1)'};
  
  /* Subtle animation for sending state */
  ${props => props.$isLocal && props.$sending && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      animation: ${shimmerEffect} 2s infinite;
    }
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.$isCurrentUser ? 
      'linear-gradient(to right, rgba(128, 255, 219, 0.6), rgba(83, 144, 217, 0.6))' : 
      'rgba(255, 255, 255, 0.2)'};
  }
  
  ${props => props.$sendFailed && css`
    border: 1px solid rgba(255, 75, 75, 0.5);
    
    &::before {
      background: linear-gradient(to right, rgba(255, 75, 75, 0.6), rgba(255, 100, 100, 0.6));
    }
  `}
  
  ${props => props.$isLocal && !props.$sendFailed && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    }
  `}
`;

const MessageText = styled.div`
  /* Change word-break to overflow-wrap for better support */
  overflow-wrap: anywhere; 
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
  margin-top: 4px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  gap: 8px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.$isCurrentUser ? 'rgba(128, 255, 219, 0.8)' : 'rgba(255, 255, 255, 0.7)'};
`;

const MessageTimeText = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;

const MessageStatus = styled.div`
  position: absolute;
  bottom: -18px;
  right: ${props => props.$isCurrentUser ? '10px' : 'auto'};
  left: ${props => !props.$isCurrentUser ? '10px' : 'auto'};
  font-size: 0.7rem;
  color: #ff6b6b;
  animation: ${fadeIn} 0.3s ease-out;
  background: rgba(255, 75, 75, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 75, 75, 0.1);
  border-left: 3px solid #ff6b6b;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 0.9rem;
  animation: ${fadeIn} 0.3s ease;
`;

const InfoMessage = styled.div`
  text-align: center;
  padding: 10px;
  margin: 10px auto;
  border-radius: 20px;
  background: rgba(83, 144, 217, 0.1);
  border: 1px solid rgba(83, 144, 217, 0.3);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  max-width: 80%;
  animation: ${fadeIn} 0.5s ease;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin: auto;
  
  svg {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    max-width: 400px;
    line-height: 1.6;
  }
`;
// 1. The small preview bar that appears ABOVE the input when replying
const ReplyPreviewContainer = styled.div`
  padding: 12px 20px;
  background: rgba(15, 24, 42, 0.95);
  border-top: 1px solid rgba(128, 255, 219, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
  z-index: 4; /* Below ChatForm */
`;

const ReplyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.85rem;
  
  strong {
    color: #80FFDB;
  }
  
  span {
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
`;

const CancelReplyButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    color: #ff6b6b;
    background: rgba(255, 255, 255, 0.1);
  }
`;

// 2. The visual "Quote" inside a sent message bubble
const QuotedMessage = styled.div`
  margin-bottom: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid ${props => props.$isCurrentUser ? 'rgba(255, 255, 255, 0.5)' : '#80FFDB'};
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  
  strong {
    display: block;
    color: ${props => props.$isCurrentUser ? 'rgba(255, 255, 255, 0.9)' : '#80FFDB'};
    font-size: 0.75rem;
    margin-bottom: 2px;
  }
  
  span {
    color: rgba(255, 255, 255, 0.7);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// 3. The Reply Button (to be placed in MessageMeta)
const ReplyButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  cursor: pointer;
  padding: 0 5px;
  margin-left: 8px;
  transition: color 0.2s;
  
  &:hover {
    color: #80FFDB;
    text-decoration: underline;
  }
`;

// Format date for display
const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;
  
  // If today
  if (diff < oneDay && date.getDate() === now.getDate()) {
    return 'Today';
  }
  
  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && 
      date.getMonth() === yesterday.getMonth() && 
      date.getFullYear() === yesterday.getFullYear()) {
    return 'Yesterday';
  }
  
  // Otherwise, return the date
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

// Format time for display
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { room } = location.state || {};
  const messageContainerRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [roomDocId, setRoomDocId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [isUserMember, setIsUserMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // Add this near your other useState hooks
  const [replyingTo, setReplyingTo] = useState(null);

  // Handle keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      // On mobile, when keyboard opens, the window height decreases
      // We can detect this by checking if the window height is significantly smaller than the screen height
      const isKeyboard = window.innerHeight < window.screen.height * 0.75;
      setIsKeyboardVisible(isKeyboard);
      
      // When keyboard appears, scroll to bottom after a small delay
      if (isKeyboard) {
        setTimeout(() => {
          scrollToBottom(true); // Force scroll
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Improved scroll to bottom function
  const scrollToBottom = (force = false) => {
    if (messageContainerRef.current) {
      const scrollContainer = messageContainerRef.current;
      
      // Check if we're already near the bottom or if force=true
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
      
      if (isNearBottom || force) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
      }
    }
  };

  // Scroll to bottom when messages change or keyboard status changes
  useEffect(() => {
    scrollToBottom(true);
  }, [messages, localMessages, isKeyboardVisible]);
  
  // Fetch room data and set up message listener
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        navigate('/community');
        return;
      }
      
      try {
        setLoading(true);
        // First, find the room document ID by its custom ID
        const roomsQuery = query(collection(db, 'chatrooms'), where('id', '==', roomId));
        const roomSnapshot = await getDocs(roomsQuery);
        
        if (roomSnapshot.empty) {
          setError("Community not found");
          setLoading(false);
          return;
        }
        
        const roomDoc = roomSnapshot.docs[0];
        const roomDocData = roomDoc.data();
        setRoomDocId(roomDoc.id);
        setRoomData(roomDocData);
        
        // Check if current user is a member
        const isMember = auth.currentUser && 
          roomDocData.members && 
          roomDocData.members.includes(auth.currentUser.uid);
        setIsUserMember(isMember);
          // Set up message listener with error handling
        const messagesQuery = query(
          collection(db, 'chatrooms', roomDoc.id, 'messages'), 
          orderBy('timestamp', 'asc')
        );
        
        // Unsubscribe from previous listener if any
        let unsubscribe;
        try {
          unsubscribe = onSnapshot(
            messagesQuery, 
            (snapshot) => {
              // Process only non-empty snapshots with changes
              if (!snapshot.empty) {
                const messageData = snapshot.docs.map(doc => {
                  const data = doc.data();
                  
                  // Process the server data
                  const processedData = {
                    ...data,
                    id: doc.id,
                    // Convert server timestamp to JS Date if it exists
                    timestamp: data.timestamp ? 
                      (typeof data.timestamp.toDate === 'function' ? data.timestamp.toDate() : data.timestamp) : 
                      new Date()
                  };
                  
                  // If this message has a clientMessageId, check if we have a local pending message to remove
                  if (data.clientMessageId) {
                    // Schedule removal of any matching local message
                    setTimeout(() => {
                      setLocalMessages(prev => 
                        prev.filter(msg => msg.id !== data.clientMessageId)
                      );
                    }, 100);
                  }
                  
                  return processedData;
                });
                
                // Set the messages from server
                setMessages(messageData);
              }
              setLoading(false);
            },
            (err) => {
              console.error("Error in messages listener:", err);
              if (err.code === 'permission-denied') {
                setError("You don't have permission to view messages in this community");
                // Update membership status since we don't have permission
                setIsUserMember(false);
              } else {
                setError("Error loading messages: " + err.message);
              }
              setLoading(false);
            }
          );
        } catch (err) {
          console.error("Error setting up message listener:", err);
          setError("Error connecting to chat: " + err.message);
          setLoading(false);
        }
        
        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching chatroom:", err);
        setError("Error loading community: " + err.message);
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId, navigate]);
  // Enhanced message handling
  // Enhanced message submission with better handling of local/server message duplication
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    
    if (!newMessage.trim() || !auth.currentUser) {
      if (!auth.currentUser) {
        setError('Please sign in to send messages');
      }
      return;
    }
    
    // Check if user is a member
    if (!isUserMember) {
      setError('You need to join this community before sending messages');
      return;
    }
    
    // Get the message text and clear input immediately to prevent duplicate sends
    const messageText = newMessage.trim();
    setNewMessage('');
    
    // Create a client-side message ID that includes both a timestamp and content hash
    // This helps with deduplication and message tracking
    const now = new Date();
    const contentHash = messageText.split('').reduce((acc, char) => 
      (acc * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0).toString(16).substring(0, 8);
    const localMessageId = `local-${now.getTime()}-${contentHash}`;
    
    // Add temporary local message for immediate feedback
    const tempMessage = {
      id: localMessageId,
      text: messageText,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      userPhoto: auth.currentUser.photoURL || null,
      isLocal: true, // Mark as local/pending
      timestamp: now,
      sending: true, // Flag to show sending state
      sentTime: now.getTime() // Keep track of when this was sent for cleanup
    };
    
    // Add to local messages
    setLocalMessages(prev => [...prev, tempMessage]);
    
    try {
      // Calculate expiration time (8 hours from now)
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 8);
      
      // Send to Firestore
      await addDoc(collection(db, `chatrooms/${roomDocId}/messages`), {
        text: messageText,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expirationTime), // Add expiration timestamp
        ttl: '8 hours', // Add readable TTL for UI purposes
        clientMessageId: localMessageId // Include client ID to help with deduplication
      });
      
      const messagePayload = {
        text: messageText,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expirationTime),
        ttl: '8 hours',
        clientMessageId: localMessageId,
        // ADD THIS BLOCK:
        replyTo: replyingTo ? {
          id: replyingTo.id,
          userName: replyingTo.userName,
          text: replyingTo.text // Store the text for preview
        } : null
      };

      await addDoc(collection(db, `chatrooms/${roomDocId}/messages`), messagePayload);

      // Clear the reply state after sending
      setReplyingTo(null);
      // After successful send, remove the local message - but give it a slight delay
      // to allow Firebase to sync the new message first
      setTimeout(() => {
        setLocalMessages(prev => prev.filter(msg => msg.id !== localMessageId));
      }, 500); // Short delay to allow Firebase to sync
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Show different error messages based on error type
      if (err.code === 'permission-denied') {
        setError('You do not have permission to send messages in this community. Please join first.');
        // Update isUserMember to reflect reality
        setIsUserMember(false);
      } else if (err.code === 'unavailable') {
        setError('Network issue. Message saved locally and will be sent when connection is restored.');
        // Keep the local message for retry
        return;
      } else {
        setError(`Failed to send message: ${err.message}. Please try again.`);
      }
      
      // Update local message to show failure
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? {...msg, sendFailed: true, errorMessage: err.message} 
            : msg
        )
      );
    }
  };
    // Join the community with enhanced error handling
  const handleJoinCommunity = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      
      // Add user to community members
      await updateDoc(doc(db, 'chatrooms', roomDocId), {
        members: arrayUnion(auth.currentUser.uid),
        memberCount: (roomData?.memberCount || 0) + 1
      });
      
      // Update local state
      setIsUserMember(true);
      setError('');
      setInfoMessage('You have successfully joined this community!');
      
      // Update the roomData state
      setRoomData(prev => ({
        ...prev,
        members: [...(prev.members || []), auth.currentUser.uid],
        memberCount: (prev.memberCount || 0) + 1
      }));
      
      setTimeout(() => setInfoMessage(''), 5000); // Clear the message after 5 seconds
      
    } catch (err) {
      console.error("Error joining community:", err);
      if (err.code === 'permission-denied') {
        setError("You don't have permission to join this community. It may be restricted to specific users.");
      } else {
        setError("Failed to join community: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
    // Enhanced deduplication - check for duplicate content to avoid showing the same message twice
  // First, add all server messages
  const messageMap = new Map();
  const contentTimeMap = new Map(); // To track message content+user combinations
  
  // Add Firebase messages first (they take precedence over local messages)
  messages.forEach(message => {
    messageMap.set(message.id, message);
    
    // Create a unique key using user ID, message content and approximate time
    const timeWindow = Math.floor((message.timestamp?.getTime() || 0) / 10000); // Group by 10-second windows
    const contentKey = `${message.userId}-${message.text}-${timeWindow}`;
    contentTimeMap.set(contentKey, message.id);
  });
  
  // Then add local messages only if they don't exist in Firebase messages with similar content/time
  localMessages.forEach(message => {
    // Don't add local message if exact ID match exists (shouldn't happen, but just in case)
    if (messageMap.has(message.id)) {
      return;
    }
    
    // Check if a similar message (same user, same content, similar time) exists in Firebase messages
    const timeWindow = Math.floor((message.timestamp?.getTime() || 0) / 10000);
    const contentKey = `${message.userId}-${message.text}-${timeWindow}`;
    
    // Only add if no similar message exists from server
    if (!contentTimeMap.has(contentKey)) {
      messageMap.set(message.id, message);
    }
  });
  
  // Convert map back to array and sort by timestamp
  const allMessages = Array.from(messageMap.values())
    .sort((a, b) => {
      // Handle missing timestamps as the newest
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  
  // Now group by date
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
  
  // Cleanup stale local messages (those that never got a server response)
  useEffect(() => {
    if (localMessages.length === 0) return;
    
    // Check for any local messages that have been around too long (over 30 seconds)
    const now = Date.now();
    const staleTimeout = 30000; // 30 seconds
    
    const newLocalMessages = localMessages.filter(msg => {
      // Keep messages that are less than 30 seconds old
      return !msg.sentTime || now - msg.sentTime < staleTimeout;
    });
    
    // If we removed any stale messages, update state
    if (newLocalMessages.length !== localMessages.length) {
      setLocalMessages(newLocalMessages);
    }
    
    // Run this check every 10 seconds
    const cleanupInterval = setInterval(() => {
      setLocalMessages(prev => {
        const currentTime = Date.now();
        return prev.filter(msg => !msg.sentTime || currentTime - msg.sentTime < staleTimeout);
      });
    }, 10000);
    
    return () => clearInterval(cleanupInterval);
  }, [localMessages]);
  
  return (
    <Page>
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
              
              {/* Join button if not a member */}
              {!isUserMember && (
                <SendButton onClick={handleJoinCommunity}>
                  Join Community
                </SendButton>
              )}
            </>
          )}
        </ChatHeader>
        
        <MessageContainer ref={messageContainerRef}>          {loading ? (
            <InfoMessage>Loading messages...</InfoMessage>
          ) : error && messages.length === 0 ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : infoMessage ? (
            <InfoMessage>
              {infoMessage}
            </InfoMessage>
          ) : messages.length === 0 && localMessages.length === 0 ? (
            <EmptyState>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>No Messages Yet</h3>
              <p>Be the first to start a conversation in this community!</p>
            </EmptyState>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <React.Fragment key={date}>
                <DateDivider>
                  <DateLabel>{date}</DateLabel>
                </DateDivider>
                
                {dateMessages.map((message) => {
                  const isCurrentUser = auth.currentUser && message.userId === auth.currentUser.uid;
                  
                  return (                    <MessageWrapper 
                      key={message.id} 
                      $isCurrentUser={isCurrentUser}
                      $isLocal={message.isLocal}
                      $sendFailed={message.sendFailed}
                      $isSending={message.isLocal && message.sending}
                    >                      <Avatar
                        src={message.userPhoto}
                        $isCurrentUser={isCurrentUser}
                      />
                      
                      <MessageContent>                        <MessageBubble 
                          $isCurrentUser={isCurrentUser}
                          $isLocal={message.isLocal}
                          $sendFailed={message.sendFailed}
                          $sending={message.sending}
                        >
                          <MessageText>{message.text}</MessageText>
                        </MessageBubble>
                          <MessageMeta $isCurrentUser={isCurrentUser}>                          <UserName $isCurrentUser={isCurrentUser}>{message.userName}</UserName>
                          <MessageTimeText>
                            {message.isLocal && message.sending ? 'Sending...' : formatTime(message.timestamp)}
                          </MessageTimeText>
                        </MessageMeta>
                        
                        {message.sendFailed && (                          <MessageStatus $isCurrentUser={isCurrentUser}>
                            Failed to send
                          </MessageStatus>
                        )}
                      </MessageContent>
                    </MessageWrapper>
                  );
                })}
              </React.Fragment>
            ))
          )}
          
          {error && messages.length > 0 && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
          
          {!isUserMember && !loading && messages.length > 0 && (
            <InfoMessage>
              Join this community to participate in the conversation
            </InfoMessage>
          )}
        </MessageContainer>
        
        <ChatForm onSubmit={handleSendMessage}>
          <MessageInput
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isUserMember ? "Type a message..." : "Join this community to send messages"}
            disabled={!isUserMember || loading}
          />
          
          <SendButton 
            type="submit"
            disabled={!newMessage.trim() || !isUserMember || loading}
          >
            Send
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </SendButton>
        </ChatForm>
      </ChatContainer>
    </Page>
  );
};

export default ChatRoom;