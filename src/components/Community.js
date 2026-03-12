import React, { useState, useEffect } from 'react';
import chatroomImg from '../assets/images/trek1.png';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, getDoc, getDocs, limit, startAfter } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initializeChatrooms } from '../utils/initializeChatrooms';
import { FiUsers, FiMessageCircle, FiX, FiPlus, FiArrowRight, FiLock } from 'react-icons/fi';
import ImageOverlay from './ImageOverlay';
import CreateCommunityModal from './CreateCommunityModal';
import { CommunitySEO } from './SEO/SEOHelmet';
import { CommunityRichSnippet } from './SEO/SEOUtils';
import { 
  Page, PageContainer, Header, HeaderTitle, HeaderSubtitle, HeadingIconContainer,
  CardsContainer, Card, CardImageContainer, CardImage, CardContent, CardHeader,
  CardTitle, CardDescription, CardFooter, CardStat, CardRating, NewLabel,
  FeaturedLabel, CreateButton, JoinButton, LoadMoreButton, CardSkeleton,
  ErrorMessage, SuccessMessage, EmptyState, StarIcon
} from './CommunityStyled';



// Helper function to handle image URLs validation
const getValidImageUrl = (url) => {
  return url && typeof url === 'string' ? url : chatroomImg;
};

// The community component with all fixed issues
const Community = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navigate = useNavigate();

  // Check if current user is an admin
  // Fetch chatrooms from Firestore with optimized pagination
  useEffect(() => {
    // Only fetch chatrooms if user is authenticated
    if (!isAuthenticated || isAuthChecking) {
      return;
    }

    setLoading(true);
    
    // Set up real-time listener IMMEDIATELY
    const MESSAGES_PER_PAGE = 8;
    const chatroomsCollection = collection(db, 'chatrooms');
    const q = query(
      chatroomsCollection, 
      orderBy('createdAt', 'desc'),
      limit(MESSAGES_PER_PAGE)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // If the database is completely empty, initialize it in the background!
      // Once it finishes, this snapshot listener will automatically fire again.
      if (snapshot.empty) {
        initializeChatrooms().catch(console.error);
        setHasMore(false);
      } else {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
      
      const roomsData = snapshot.docs.map(doc => {
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
      
      setChatrooms(roomsData);
      setLoading(false); // Instantly turn off loading when data arrives
    }, (error) => {
      console.error('Error in chatrooms snapshot:', error);
      setError('Failed to load communities. Please try again later.');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [isAuthenticated, isAuthChecking]);

  // Add authentication state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthChecking(false);
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  
  // Fetch chatrooms from Firestore with optimized pagination
  useEffect(() => {
    // Only fetch chatrooms if user is authenticated
    if (!isAuthenticated || isAuthChecking) {
      return;
    }

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
  }, [isAuthenticated, isAuthChecking]);

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
      
      // Use the docId for Firestore operations, not the custom id
      const roomRef = doc(db, 'chatrooms', room.docId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        await initializeChatrooms();
        const recheckDoc = await getDoc(roomRef);
        if (!recheckDoc.exists()) {
          throw new Error('Failed to create community');
        }
      }

      // Get current members
      const currentData = roomDoc.data();
      const currentMembers = currentData?.members || [];
      
      // Only add member if not already in the room
      if (!currentMembers.includes(auth.currentUser.uid)) {
        await updateDoc(roomRef, {
          members: arrayUnion(auth.currentUser.uid),
          memberCount: (currentData?.memberCount || 0) + 1
        });
      }

      // Navigate to chat screen with room ID
      navigate(`/chat/${room.id}`, { state: { room } });
      
    } catch (err) {
      console.error('Error joining room:', err);
      
      if (err.code === 'permission-denied') {
        setError('Access denied: You do not have permission to join this community. Trying view-only mode...');
        // Still try to navigate in view-only mode
        setTimeout(() => {
          navigate(`/chat/${room.id}`, { 
            state: { 
              room: {
                ...room,
                viewOnly: true,
                permissionError: 'View-only access due to permission restrictions'
              } 
            } 
          });
        }, 2000);
      } else if (err.code === 'unavailable') {
        setError('Community service is temporarily unavailable. Please try again later.');
      } else if (err.code === 'not-found') {
        setError('This community no longer exists.');
      } else {
        setError(`Failed to join community: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <CommunitySEO />
      
      <Page>
        <PageContainer>
          {/* 1. Header loads INSTANTLY, no matter what */}
          <Header>
            <HeaderTitle>
              <HeadingIconContainer>
                <FiMessageCircle size={28} />
              </HeadingIconContainer>
              <div>
                <h1>Communities</h1>
                <HeaderSubtitle>Connect with like-minded trekkers from around the world</HeaderSubtitle>
              </div>
            </HeaderTitle>
            
            {isAdmin ? (
              <CreateButton onClick={() => setShowCreateModal(true)}>
                <FiPlus size={18} />
                <span>Create Community</span>
              </CreateButton>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem' }}>
                <FiLock size={16} />
                <span>Communities are managed by admins</span>
              </div>
            )}
          </Header>

          {error && (
            <ErrorMessage>
              <FiX onClick={() => setError('')} />
              {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <FiX onClick={() => setSuccess('')} />
              {success}
            </SuccessMessage>
          )}

          <CardsContainer>
            {/* 2. Show Skeletons if Auth is checking OR data is loading */}
            {(loading || isAuthChecking) ? (
              Array(8).fill().map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : chatrooms.length === 0 ? (
              <EmptyState>
                <FiMessageCircle size={60} opacity={0.4} />
                <h3>No communities found</h3>
                {isAdmin ? (
                  <>
                    <p>You can create a new community or manage communities in the admin panel</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                      <CreateButton onClick={() => setShowCreateModal(true)}>
                        <FiPlus size={18} />
                        <span>Create Community</span>
                      </CreateButton>
                      <CreateButton onClick={() => navigate('/admin/communities')} style={{ background: '#4a5568', borderColor: '#4a5568' }}>
                        <FiLock size={18} />
                        <span>Admin Panel</span>
                      </CreateButton>
                    </div>
                  </>
                ) : (
                  <p>Communities will appear here once created by administrators</p>
                )}
              </EmptyState>
            ) : (
              chatrooms.map((room) => (
                <div key={room.id || room.docId}>
                  <CommunityRichSnippet community={room} />
                  <Card onClick={() => handleJoinRoom(room)}>
                    <CardImageContainer>
                      <CardImage 
                        src={room.cachedImageUrl} 
                        alt={`${room.name} - Join trekking community on Trovia`}
                        loading="lazy"
                      />
                      <ImageOverlay />
                      {room.isNew && <NewLabel>NEW</NewLabel>}
                      {room.featured && <FeaturedLabel>FEATURED</FeaturedLabel>}
                    </CardImageContainer>
                    
                    <CardContent>
                      <CardHeader>
                        <CardTitle>{room.name}</CardTitle>
                        <CardRating>
                          <StarIcon className="star" /> 
                          <span>{room.rating}</span>
                          <small>({room.reviews})</small>
                        </CardRating>
                      </CardHeader>
                      
                      <CardDescription>{room.desc || room.description || "Join this trekking community to connect with other adventure enthusiasts."}</CardDescription>
                      
                      <CardFooter>
                        <CardStat>
                          <FiUsers size={14} />
                          <span>{room.memberCount} {room.memberCount === 1 ? 'member' : 'members'}</span>
                        </CardStat>
                        <CardStat>
                          <FiMessageCircle size={14} />
                          <span>{room.messageCount || 0} {(room.messageCount || 0) === 1 ? 'message' : 'messages'}</span>
                        </CardStat>
                      </CardFooter>
                      
                      <JoinButton>
                        <span>Join Chat</span>
                        <FiArrowRight size={16} />
                      </JoinButton>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </CardsContainer>

          {!loading && !isAuthChecking && chatrooms.length > 0 && hasMore && (
            <LoadMoreButton onClick={loadMoreChatrooms} disabled={isLoadingMore}>
              {isLoadingMore ? 'Loading...' : 'Load More Communities'}
            </LoadMoreButton>
          )}

          {isAdmin && showCreateModal && (
            <CreateCommunityModal 
              isOpen={showCreateModal} 
              onClose={() => setShowCreateModal(false)} 
              onSuccess={(newCommunity) => {
                setSuccess(`Community "${newCommunity.name}" has been created successfully!`);
                setChatrooms(prevRooms => [{
                    ...newCommunity, isNew: true, memberCount: 0, messageCount: 0, cachedImageUrl: getValidImageUrl(newCommunity.img)
                  }, ...prevRooms]);
              }}
              onError={(msg) => setError(msg)}
            />
          )}
        </PageContainer>
      </Page>
    </>
  );
};

export default Community;