import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import chatroomImg from '../assets/images/trek1.png';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, deleteDoc, getDocs, limit, startAfter } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initializeChatrooms } from '../utils/initializeChatrooms';
import { FiUsers, FiMessageCircle, FiX, FiPlus, FiChevronLeft, FiChevronRight, FiMapPin, FiArrowRight } from 'react-icons/fi';

// Helper function to handle image URLs validation
const getValidImageUrl = (url) => {
  return url && typeof url === 'string' ? url : chatroomImg;
};

// Define all the necessary animations
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

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Enhanced image overlay with better gradient
const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 20%, rgba(10, 26, 47, 0.4) 100%);
  z-index: 1;
  transition: opacity 0.3s ease;
`;

// --- RESPONSIVE LAYOUT COMPONENTS ---

const PageContainer = styled.div`
  min-height: 100vh;
  background: #000 url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  color: #fff;
  padding-top: 80px; /* Space for Navbar */
  padding-bottom: 100px; /* Space for Bottom Nav */
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.95) 100%);
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.8s ease-out;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    margin-bottom: 30px;
    h1 { font-size: 2rem; }
    p { font-size: 1rem; }
  }
`;

const Grid = styled.div`
  display: grid;
  /* RESPONSIVE GRID LOGIC */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Single column on mobile */
    gap: 20px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.2);
    
    img { transform: scale(1.1); }
  }
`;

const CardImageContainer = styled.div`
  height: 180px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
`;

const MemberBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #fff;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);

  svg { color: #4ad991; }
`;

const CardContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
`;

const CardDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px 0;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.02);
  }

  &:active { transform: scale(0.98); }
`;

const LoadMoreButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 14px 32px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// The community component with all fixed issues
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch chatrooms from Firestore with optimized pagination
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        setLoading(true);
        
        // Initialize default chatrooms if needed
        await initializeChatrooms();
        
        // Set up real-time listener with pagination
        const MESSAGES_PER_PAGE = 8;
        const chatroomsCollection = collection(db, 'chatrooms');
        const q = query(
          chatroomsCollection, 
          orderBy('createdAt', 'desc'),
          limit(MESSAGES_PER_PAGE)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          // Store the last visible document for pagination
          if (!snapshot.empty) {
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          } else {
            setHasMore(false);
          }
          
          const roomsData = snapshot.docs.map(doc => {
            const data = doc.data();
            // Calculate if room is new (created in last 24 hours)
            const isNew = data.createdAt && 
                        typeof data.createdAt.toDate === 'function' ? 
                        (new Date().getTime() - data.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000 :
                        false;
                        
            // Pre-calculate values to avoid recalculations during render
            return {
              ...data,
              isNew,
              docId: doc.id, 
              memberCount: data.members?.length || 0,
              messageCount: data.messageCount || 0,
              rating: data.rating || (4 + Math.random()).toFixed(1),
              reviews: data.reviews || Math.floor(Math.random() * 50) + 5,
              featured: data.featured || false,
              // Cache image URL
              cachedImageUrl: getValidImageUrl(data.img)
            };
          });
          
          setChatrooms(roomsData);
          setLoading(false);
        }, (error) => {
          console.error('Error in chatrooms snapshot:', error);
          setError('Failed to load communities. Please try again later.');
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching chatrooms:', err);
        setError('Failed to load communities. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchChatrooms();
  }, []);

  // Function to load more chatrooms
  const loadMoreChatrooms = async () => {
    if (!hasMore || isLoadingMore || !lastVisible) return;
    
    try {
      setIsLoadingMore(true);
      const MESSAGES_PER_PAGE = 8;
      
      const chatroomsCollection = collection(db, 'chatrooms');
      const q = query(
        chatroomsCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(MESSAGES_PER_PAGE)
      );
      
      const snapshot = await getDocs(q);
      
      // Check if we've reached the end
      if (snapshot.empty) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }
      
      // Update last visible for next page
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      
      // Process chatrooms the same way
      const newRooms = snapshot.docs.map(doc => {
        const data = doc.data();
        const isNew = data.createdAt && 
                    typeof data.createdAt.toDate === 'function' ? 
                    (new Date().getTime() - data.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000 :
                    false;
        
        return {
          ...data,
          isNew,
          docId: doc.id,
          memberCount: data.members?.length || 0,
          messageCount: data.messageCount || 0,
          rating: data.rating || (4 + Math.random()).toFixed(1),
          reviews: data.reviews || Math.floor(Math.random() * 50) + 5,
          featured: data.featured || false,
          cachedImageUrl: getValidImageUrl(data.img)
        };
      });
      
      // Add new rooms to existing ones
      setChatrooms(prev => [...prev, ...newRooms]);
      
    } catch (err) {
      console.error('Error loading more chatrooms:', err);
      setError('Failed to load more communities. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Enhanced handleJoinRoom function with better error handling
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
          throw new Error('Failed to create community');
        }
      }

      try {
        // Get current members
        const currentMembers = roomDoc.data()?.members || [];
        
        // Only add member if not already in the room
        if (!currentMembers.includes(auth.currentUser.uid)) {
          await updateDoc(roomRef, {
            members: arrayUnion(auth.currentUser.uid),
            memberCount: (roomDoc.data()?.memberCount || 0) + 1
          });
          console.log('Successfully joined community');
        } else {
          console.log('User already in community');
        }
      } catch (permissionError) {
        console.error('Permission error:', permissionError);
        
        // Navigate anyway - the user might already be a member or have view-only access
        navigate(`/chat/${room.id}`, { state: { room, viewOnly: true } });
        return;
      }

      // Navigate to chat screen with room ID
      navigate(`/chat/${room.id}`, { state: { room } });
      
    } catch (err) {
      console.error('Error joining room:', err);
      
      if (err.code === 'permission-denied') {
        setError('Access denied: You do not have permission to join this community.');
      } else {
        setError(`Failed to join community: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <HeaderSection>
          <h1>Adventure Communities</h1>
          <p>Connect with fellow travelers, share experiences, and plan your next journey together.</p>
        </HeaderSection>

        {loading && chatrooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
            Loading communities...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ff6b6b' }}>{error}</div>
        ) : (
          <>
            <Grid>
              {chatrooms.map((room) => (
                <Card key={room.docId}>
                  <CardImageContainer>
                    <ImageOverlay />
                    <img src={room.cachedImageUrl} alt={room.name} loading="lazy" />
                    <MemberBadge>
                      <FiUsers />
                      {room.memberCount || 0}
                    </MemberBadge>
                  </CardImageContainer>
                  
                  <CardContent>
                    <CardTitle>{room.name}</CardTitle>
                    <CardDesc>{room.desc || 'Join this community to share your trekking experiences and connect with others.'}</CardDesc>
                    
                    <JoinButton onClick={() => handleJoinRoom(room)}>
                      <span>Join Community</span>
                      <FiArrowRight />
                    </JoinButton>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {hasMore && (
              <LoadMoreButton 
                onClick={loadMoreChatrooms} 
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More Communities'}
              </LoadMoreButton>
            )}
          </>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Community;
