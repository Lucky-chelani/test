import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import chatroomImg from '../assets/images/trek1.png'; // Placeholder, replace with real images
import user1 from '../assets/images/trek1.png'; // Placeholder
import user2 from '../assets/images/trek1.png'; // Placeholder
import user3 from '../assets/images/trek1.png'; // Placeholder
import Navbar from './Navbar';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initializeChatrooms } from '../utils/initializeChatrooms';

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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
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
  height: 100%;
`;
const ChatroomImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  margin-bottom: 12px;
`;
const ChatroomContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const ChatroomDescription = styled.p`
  flex-grow: 1;
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
  margin-top: auto;
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

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  padding: 12px;
  font-size: 1rem;
  resize: none;
  margin-top: 16px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  background: #FF4B1F;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.18s;
  &:hover { background: #d13a13; }
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin: 12px 0;
  text-align: center;
`;

const Community = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Initialize chatrooms when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        const success = await initializeChatrooms();
        if (!success) {
          setError('Failed to initialize chatrooms. Please try again later.');
        }
      } catch (err) {
        console.error('Error in initialization:', err);
        setError('Failed to initialize chatrooms. Please try again later.');
      }
    };
    init();
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for messages in selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const q = query(
      collection(db, `chatrooms/${selectedRoom.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  const handleJoinRoom = async (room) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Attempting to join room:', room.id);
      
      const roomRef = doc(db, 'chatrooms', room.id);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        console.log('Room does not exist, reinitializing...');
        await initializeChatrooms();
        const recheckDoc = await getDoc(roomRef);
        if (!recheckDoc.exists()) {
          throw new Error('Failed to create chatroom');
        }
      }

      // Get current members
      const currentMembers = roomDoc.data()?.members || [];
      
      // Only add member if not already in the room
      if (!currentMembers.includes(auth.currentUser.uid)) {
        await updateDoc(roomRef, {
          members: arrayUnion(auth.currentUser.uid)
        });
        console.log('Successfully joined room');
      } else {
        console.log('User already in room');
      }

      setSelectedRoom(room);
      setError('');
    } catch (err) {
      console.error('Error joining room:', err);
      setError(`Failed to join room: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !auth.currentUser) return;

    try {
      setLoading(true);
      await addDoc(collection(db, `chatrooms/${selectedRoom.id}/messages`), {
        text: newMessage.trim(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
      setError('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const chatrooms = [
    { id: 'himalayan', name: 'Himalayan Explorers', desc: 'Talk all things Himalayas!', img: chatroomImg },
    { id: 'patagonia', name: 'Patagonia Trekkers', desc: 'Share Patagonia tips and plans.', img: chatroomImg },
    { id: 'sahyadri', name: 'Sahyadri Hikers', desc: 'Connect with local hikers.', img: chatroomImg },
    { id: 'alpine', name: 'Alpine Adventurers', desc: 'For lovers of the Alps.', img: chatroomImg },
  ];

  return (
    <Page>
      <Navbar active="community" />
      <Container>
        <Section>
          <SectionTitle>Join a Chatroom</SectionTitle>
          <ChatroomGrid>
            {chatrooms.map((room) => (
              <ChatroomCard key={room.id}>
                <ChatroomImage src={room.img} alt={room.name} />
                <h3 style={{marginBottom:4}}>{room.name}</h3>
                <ChatroomDescription>{room.desc}</ChatroomDescription>
                <JoinButton 
                  onClick={() => handleJoinRoom(room)}
                  disabled={loading || (selectedRoom && selectedRoom.id === room.id)}
                >
                  {selectedRoom && selectedRoom.id === room.id ? 'Joined' : 'Join'}
                </JoinButton>
              </ChatroomCard>
            ))}
          </ChatroomGrid>
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {selectedRoom && (
          <Section>
            <SectionTitle>Live Chat - {selectedRoom.name}</SectionTitle>
            <LiveConversations>
              {messages.map((msg) => (
                <Message key={msg.id}>
                  <MessageAvatar 
                    src={msg.userPhoto || user1} 
                    alt={msg.userName} 
                  />
                  <MessageContent>
                    <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                      {msg.userName}
                    </div>
                    {msg.text}
                  </MessageContent>
                </Message>
              ))}
              <div ref={messagesEndRef} />
              
              <form onSubmit={handleSendMessage}>
                <MessageInput
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <SendButton type="submit" disabled={loading || !newMessage.trim()}>
                  {loading ? 'Sending...' : 'Send Message'}
                </SendButton>
              </form>
            </LiveConversations>
          </Section>
        )}

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
};

export default Community; 
