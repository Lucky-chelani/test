import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes,css } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import chatroomImg from '../assets/images/trek1.png';
import user1 from '../assets/images/trek1.png';
import Navbar from './Navbar';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, deleteDoc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initializeChatrooms } from '../utils/initializeChatrooms';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  position: relative;
  z-index: 1;
`;

const Section = styled.section`
  margin-bottom: 60px;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #FF4B1F, #FF9E1F);
    border-radius: 2px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(24, 24, 40, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h3 {
    font-size: 1.6rem;
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  p {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 24px;
  }
`;

const CreateFirstButton = styled.button`
  background: linear-gradient(90deg, #FF4B1F, #FF9E1F);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: linear-gradient(90deg, #FF3B1F, #FF8E1F);
    box-shadow: 0 4px 15px rgba(255, 75, 31, 0.4);
    transform: translateY(-2px);
  }
`;

const ChatroomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
`;

const ChatroomCard = styled.div`
  background: rgba(24, 24, 40, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    border-color: rgba(255, 75, 31, 0.3);
  }
  
  ${props => props.isNew && css`
    &:after {
      content: 'NEW';
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(90deg, #FF4B1F, #FF9E1F);
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(255, 75, 31, 0.4);
      animation: ${pulse} 2s infinite ease-in-out;
    }
  `}
`;

const CreatorBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #FF9E1F;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 158, 31, 0.3);
  z-index: 5;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 75, 75, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 75, 75, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 75, 75, 0.4);
    transform: rotate(90deg);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ChatroomImage = styled.div`
  width: 100%;
  height: 160px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(24, 24, 40, 1) 0%, rgba(24, 24, 40, 0) 100%);
  }
`;

const ChatroomContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
`;

const ChatroomName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
`;

const ChatroomDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
`;

const ChatroomMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  
  svg {
    margin-right: 6px;
  }
`;

const JoinButton = styled.button`
  background: linear-gradient(90deg, #FF4B1F, #FF9E1F);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  
  &:hover {
    background: linear-gradient(90deg, #FF3B1F, #FF8E1F);
    box-shadow: 0 4px 15px rgba(255, 75, 31, 0.4);
  }
  
  &:disabled {
    background: #3a3a4c;
    cursor: not-allowed;
    box-shadow: none;
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

const SuccessMessage = styled.div`
  color: #4ad991;
  background: rgba(74, 217, 145, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
  text-align: center;
  border-left: 4px solid #4ad991;
  animation: ${fadeIn} 0.3s ease-out forwards;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
`;

const SkeletonCard = styled.div`
  background: rgba(24, 24, 40, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  overflow: hidden;
  height: 380px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.03), 
      rgba(255, 255, 255, 0.08), 
      rgba(255, 255, 255, 0.03)
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const CreateRoomButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF4B1F, #FF9E1F);
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 20px rgba(255, 75, 31, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(255, 75, 31, 0.6);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #181828;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.3s ease-out forwards;
`;

const ModalTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FF4B1F;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #FF4B1F;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(90deg, #FF4B1F, #FF9E1F);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(90deg, #FF3B1F, #FF8E1F);
    box-shadow: 0 4px 12px rgba(255, 75, 31, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Confirmation modal for deletion
const ConfirmModal = styled(Modal)``;

const ConfirmModalContent = styled(ModalContent)`
  max-width: 400px;
`;

const ConfirmTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 16px;
  color: white;
`;

const ConfirmText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.5;
`;

const ConfirmButtonGroup = styled(ButtonGroup)`
  justify-content: center;
`;

const CancelDeleteButton = styled(CancelButton)``;

const ConfirmDeleteButton = styled.button`
  background: linear-gradient(90deg, #ff5e5e, #ff3a3a);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(90deg, #ff3a3a, #ff2020);
    box-shadow: 0 4px 12px rgba(255, 58, 58, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Community = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    desc: '',
    img: chatroomImg // default image
  });
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch chatrooms from Firestore
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        setLoading(true);
        
        // Initialize default chatrooms if needed
        await initializeChatrooms();
        
        // Set up real-time listener for chatrooms
        const chatroomsCollection = collection(db, 'chatrooms');
        const q = query(chatroomsCollection, orderBy('createdAt', 'desc'));
        
const unsubscribe = onSnapshot(q, (snapshot) => {
  const roomsData = snapshot.docs.map(doc => {
    const data = doc.data();
    // Calculate if room is new (created in last 24 hours)
    const isNew = data.createdAt && 
                typeof data.createdAt.toDate === 'function' ? 
                (new Date().getTime() - data.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000 :
                false;
    return {
      ...data,
      isNew,
      docId: doc.id // Store the Firestore document ID for deletion
    };
  });
  
  setChatrooms(roomsData);
  setLoading(false);
});
        
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching chatrooms:', err);
        setError('Failed to load chatrooms. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchChatrooms();
  }, []);

// Update the handleJoinRoom function
const handleJoinRoom = async (room) => {
  if (!auth.currentUser) {
    navigate('/login');
    return;
  }

  try {
    setLoading(true);
    setError('');
    console.log('Attempting to join room:', room);
    
    // Use the docId for Firestore operations, not the custom id
    const roomRef = doc(db, 'chatrooms', room.docId);
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

    // Navigate to chat screen with room ID
    navigate(`/chat/${room.id}`, { state: { room } });
    
  } catch (err) {
    console.error('Error joining room:', err);
    setError(`Failed to join room: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleCreateRoom = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!newRoomData.name.trim() || !newRoomData.desc.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create room ID from name
      const roomId = newRoomData.name.toLowerCase().replace(/\s+/g, '-');
      
      // Add room to Firestore
      const docRef = await addDoc(collection(db, 'chatrooms'), {
        id: roomId,
        name: newRoomData.name,
        desc: newRoomData.desc,
        img: newRoomData.img,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        members: [auth.currentUser.uid]
      });
      
      setShowCreateModal(false);
      setNewRoomData({ name: '', desc: '', img: chatroomImg });
      setSuccess('Community created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      // Navigate to the new chat room
      navigate(`/chat/${roomId}`, { 
        state: { 
          room: { 
            id: roomId, 
            name: newRoomData.name, 
            desc: newRoomData.desc, 
            img: newRoomData.img,
            docId: docRef.id
          } 
        } 
      });
      
    } catch (err) {
      console.error('Error creating room:', err);
      setError(`Failed to create room: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRoom = (room, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteRoom = async () => {
    if (!roomToDelete || !auth.currentUser) return;
    
    try {
      setLoading(true);
      
      // Delete the room document
      await deleteDoc(doc(db, 'chatrooms', roomToDelete.docId));
      
      setShowDeleteModal(false);
      setRoomToDelete(null);
      setSuccess('Community deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting room:', err);
      setError(`Failed to delete room: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Navbar active="community" />
      <Container>
        <Section>
          <SectionTitle>Explore Trek Communities</SectionTitle>
          
          {loading ? (
            <LoadingGrid>
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </LoadingGrid>
          ) : chatrooms.length === 0 ? (
            <EmptyState>
              <h3>No Communities Yet</h3>
              <p>Be the first to create a trekking community!</p>
              <CreateFirstButton onClick={() => setShowCreateModal(true)}>
                Create Your Community
              </CreateFirstButton>
            </EmptyState>
          ) : (
            <ChatroomGrid>
              {chatrooms.map((room) => (
                <ChatroomCard key={room.id} isNew={room.isNew}>
                  {room.createdBy === auth.currentUser?.uid && (
                    <>
                      <CreatorBadge>Creator</CreatorBadge>
                      <DeleteButton onClick={(e) => handleDeleteRoom(room, e)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </DeleteButton>
                    </>
                  )}
                  <ChatroomImage src={room.img} />
                  <ChatroomContent>
                    <ChatroomName>{room.name}</ChatroomName>
                    <ChatroomMeta>
                      <MetaItem>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M3 21C3 18 7 15 12 15C17 15 21 18 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {room.members?.length || 0} members
                      </MetaItem>
                      <MetaItem>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {room.messageCount || 0} messages
                      </MetaItem>
                    </ChatroomMeta>
                    <ChatroomDescription>{room.desc}</ChatroomDescription>
                    <JoinButton 
                      onClick={() => handleJoinRoom(room)}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Join Community'}
                    </JoinButton>
                  </ChatroomContent>
                </ChatroomCard>
              ))}
            </ChatroomGrid>
          )}
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <CreateRoomButton onClick={() => setShowCreateModal(true)}>+</CreateRoomButton>
        
        <Modal show={showCreateModal}>
          <ModalContent>
            <ModalTitle>Create New Community</ModalTitle>
            
            <FormGroup>
              <Label>Community Name</Label>
              <Input 
                type="text" 
                value={newRoomData.name}
                onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})}
                placeholder="e.g., Andes Explorers"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea 
                value={newRoomData.desc}
                onChange={(e) => setNewRoomData({...newRoomData, desc: e.target.value})}
                placeholder="Describe what this community is about..."
              />
            </FormGroup>
            
            <ButtonGroup>
              <CancelButton onClick={() => setShowCreateModal(false)}>Cancel</CancelButton>
              <CreateButton 
                onClick={handleCreateRoom}
                disabled={loading || !newRoomData.name.trim() || !newRoomData.desc.trim()}
              >
                {loading ? 'Creating...' : 'Create Community'}
              </CreateButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
        
        <ConfirmModal show={showDeleteModal}>
          <ConfirmModalContent>
            <ConfirmTitle>Delete Community?</ConfirmTitle>
            <ConfirmText>
              Are you sure you want to delete the community "{roomToDelete?.name}"? 
              This action cannot be undone and all messages will be permanently deleted.
            </ConfirmText>
            
            <ConfirmButtonGroup>
              <CancelDeleteButton onClick={() => setShowDeleteModal(false)}>
                Cancel
              </CancelDeleteButton>
              <ConfirmDeleteButton 
                onClick={confirmDeleteRoom}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </ConfirmDeleteButton>
            </ConfirmButtonGroup>
          </ConfirmModalContent>
        </ConfirmModal>
      </Container>
    </Page>
  );
};

export default Community;