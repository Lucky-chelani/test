import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  deleteDoc,
  // updateDoc, - removing unused import
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FiEdit, 
  FiTrash, 
  FiPlus, 
  FiArrowLeft, 
  FiCheck, 
  FiX, 
  FiEye, 
  FiInfo,
  FiAlertTriangle,
  FiMap,
  FiCalendar,
  FiFlag
} from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';
import mapPattern from '../assets/images/map-pattren.png';

// Styled components for the organizer interface
const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 100px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(20, 30, 48, 0.92) 0%, rgba(0, 0, 0, 0.85) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 2;
  color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    
    /* ADD THIS: Allow wrapping if text is too long */
    flex-wrap: wrap; 
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${props => props.$primary ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: ${props => props.$primary ? 'linear-gradient(135deg, #FF5252 0%, #FF6B6B 100%)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const TreksTable = styled.div`
  background: rgba(30, 40, 60, 0.7);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  color: #fff;
  
  svg {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

const Message = styled.div`
  background: ${props => props.error ? 'rgba(255, 87, 87, 0.2)' : 'rgba(76, 175, 80, 0.2)'};
  border-left: 4px solid ${props => props.error ? '#FF5757' : '#4CAF50'};
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    flex-shrink: 0;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0.7;
  }
  
  h3 {
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  p {
    max-width: 500px;
    margin-bottom: 20px;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1fr 1fr 120px;
  padding: 15px 20px;
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: 800px) {
    grid-template-columns: 80px 2fr 1fr 120px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 60px 2fr 120px;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  
  &:nth-child(1) {
    justify-content: center;
  }
  
  @media (max-width: 800px) {
    &.hide-mobile {
      display: none;
    }
  }
  
  @media (max-width: 600px) {
    &.hide-small {
      display: none;
    }
  }
`;

const TrekRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1fr 1fr 120px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 800px) {
    grid-template-columns: 80px 2fr 1fr 120px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 60px 2fr 120px;
  }
`;

const TrekImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
  }
`;

const TrekTitle = styled.div`
  display: flex;
  flex-direction: column;
  
  h3 {
    margin: 0 0 5px;
    font-weight: 600;
  }
  
  span {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.$edit) return 'rgba(67, 97, 238, 0.15)';
    if (props.$delete) return 'rgba(255, 107, 107, 0.15)';
    if (props.$view) return 'rgba(76, 201, 240, 0.15)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => {
    if (props.$edit) return '#4361EE';
    if (props.$delete) return '#FF6B6B';
    if (props.$view) return '#4CC9F0';
    return '#fff';
  }};
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => {
      if (props.edit) return 'rgba(67, 97, 238, 0.25)';
      if (props.delete) return 'rgba(255, 107, 107, 0.25)';
      if (props.view) return 'rgba(76, 201, 240, 0.25)';
      return 'rgba(255, 255, 255, 0.2)';
    }};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(30, 40, 60, 0.7);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  
  .icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background: ${props => props.$iconBg || 'rgba(255, 107, 107, 0.2)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$iconColor || '#FF6B6B'};
    font-size: 1.5rem;
  }
  
  .content {
    flex: 1;
    
    h3 {
      font-size: 1.8rem;
      margin: 0 0 5px 0;
      font-weight: 700;
    }
    
    p {
      margin: 0;
      opacity: 0.7;
      font-size: 0.9rem;
    }
  }
`;

const OrgInfoBanner = styled.div`
  background: rgba(67, 97, 238, 0.15);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(67, 97, 238, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  
  .org-details {
    flex: 1;
    
    h2 {
      margin: 0 0 5px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    p {
      margin: 0;
      opacity: 0.8;
    }
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    
    .org-details h2 {
      justify-content: center;
    }
  }
`;

const VerifiedBadge = styled.span`
  background: rgba(76, 201, 240, 0.2);
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 0.75rem;
  color: #4CC9F0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  svg {
    font-size: 0.9rem;
  }
`;

// Main component
const OrganizerTreks = () => {
  const [user, setUser] = useState(null); // Restored - needed for auth state
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [orgDetails, setOrgDetails] = useState(null);
  const [stats, setStats] = useState({
    totalTreks: 0,
    activeTreks: 0,
    upcomingTreks: 0,
    completedTreks: 0
  });
  const [message, setMessage] = useState({ text: '', error: false });
  const navigate = useNavigate();

  // Check authentication and authorization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if the user is an organizer or admin
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          setUserRole(role);
          
          if (role === 'organizer' || role === 'admin') {
            // Fetch organization details
            try {
              const orgDoc = await getDoc(doc(db, 'organizations', currentUser.uid));
              if (orgDoc.exists()) {
                setOrgDetails(orgDoc.data());
              } else if (userData.organizationDetails) {
                // If organization document doesn't exist but user has organization details
                setOrgDetails({
                  name: userData.organizationDetails.name,
                  description: userData.organizationDetails.description,
                  verified: userData.organizationDetails.verified || false,
                  ...userData.organizationDetails
                });
              }
            } catch (err) {
              console.error('Error fetching organization details:', err);
            }
            
            // Fetch treks
            fetchTreks(currentUser.uid, role);
          } else {
            setError('You do not have permission to access this page.');
            setLoading(false);
          }
        } else {
          setError('User profile not found.');
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserRole('');
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  // Fetch treks created by the organizer
  const fetchTreks = async (userId, role) => {
    try {
      setLoading(true);
      
      // Create query based on role
      let trekQuery;
      if (role === 'admin') {
        // Admins can see all treks
        trekQuery = query(
          collection(db, 'treks'),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Organizers can only see their own treks
        trekQuery = query(
          collection(db, 'treks'),
          where('organizerId', '==', userId),
          orderBy('updatedAt', 'desc')
        );
      }
      
      const treksSnapshot = await getDocs(trekQuery);
      const treksList = treksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Calculate statistics
      const now = new Date();
      const activeTreks = treksList.filter(trek => 
        trek.status === 'active' || !trek.status
      );
      
      const upcomingTreks = treksList.filter(trek => 
        trek.startDate && new Date(trek.startDate) > now
      );
      
      const completedTreks = treksList.filter(trek => 
        trek.status === 'completed' || 
        (trek.endDate && new Date(trek.endDate) < now)
      );
      
      setStats({
        totalTreks: treksList.length,
        activeTreks: activeTreks.length,
        upcomingTreks: upcomingTreks.length,
        completedTreks: completedTreks.length
      });
      
      setTreks(treksList);
      setLoading(false);    } catch (err) {
      console.error('Error fetching treks:', err);
      
      // Check if this is an index error
      if (err.message && err.message.includes('index')) {
        // Extract the index creation URL if present
        const indexUrlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
        const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
        
        setError(
          `Missing Firestore index needed for trek queries. ${
            indexUrl 
              ? `Please ask an administrator to create the required index.` 
              : 'Contact your administrator to create the required Firestore index.'
          }`
        );
        
        // Log the URL for admin use
        if (indexUrl) {
          console.log('Index creation URL:', indexUrl);
        }
      } else {
        setError(`Error fetching treks: ${err.message}`);
      }
      
      setLoading(false);
    }
  };

  // Handle create new trek
  const handleCreateTrek = () => {
    navigate('/organizer/add-trek');
  };

  // Handle edit trek
  const handleEditTrek = (trekId) => {
    navigate(`/organizer/edit-trek/${trekId}`);
  };

  // Handle delete trek
  const handleDeleteTrek = async (trekId) => {
    if (!window.confirm('Are you sure you want to delete this trek? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'treks', trekId));
      setTreks(treks.filter(trek => trek.id !== trekId));
      setMessage({
        text: 'Trek deleted successfully',
        error: false
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', error: false });
      }, 3000);
    } catch (err) {
      console.error('Error deleting trek:', err);
      setMessage({
        text: `Error deleting trek: ${err.message}`,
        error: true
      });
    }
  };

  // Handle view trek
  const handleViewTrek = (trekId) => {
    navigate(`/treks/${trekId}`);
  };

  // If loading
  if (loading) {
    return (
      <Page>
        <Container>
          <Header>
            <Title>My Listed Treks</Title>
          </Header>
          
          <LoadingContainer>
            <div>Loading your treks...</div>
          </LoadingContainer>
        </Container>
      </Page>
    );
  }

  // If error
  if (error) {
    return (
      <Page>
        <Container>
          <Header>
            <Title>My Listed Treks</Title>
          </Header>
          
          <Message error>
            <FiAlertTriangle />
            {error}
          </Message>
          
          <Button onClick={() => navigate('/profile')}>
            <FiArrowLeft /> Go to Profile
          </Button>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>{userRole === 'admin' ? 'All Listed Treks' : 'My Listed Treks'}</Title>
          
          <ButtonsContainer>
            <Button onClick={() => navigate('/profile')}>
              <FiArrowLeft /> Back to Profile
            </Button>
            <Button $primary onClick={handleCreateTrek}>
              <FiPlus /> Add New Trek
            </Button>
          </ButtonsContainer>
        </Header>
        
        {message.text && (
          <Message error={message.error}>
            {message.error ? <FiX /> : <FiCheck />}
            {message.text}
          </Message>
        )}
        
        {orgDetails && (
          <OrgInfoBanner>
            <div className="org-details">
              <h2>
                <FaMountain />
                {orgDetails.name}
                {orgDetails.verified && (
                  <VerifiedBadge>
                    <FiCheck /> Verified
                  </VerifiedBadge>
                )}
              </h2>
              
              <p>
                {orgDetails.description || 'No organization description available. Update your profile to add details about your organization.'}
              </p>
            </div>
            
            <Button onClick={() => navigate('/profile')}>
              <FiEdit /> Edit Profile
            </Button>
          </OrgInfoBanner>
        )}
        
        <StatsContainer>          <StatCard $iconBg="rgba(67, 97, 238, 0.2)" $iconColor="#4361EE">
            <div className="icon">
              <FiMap />
            </div>
            
            <div className="content">
              <h3>{stats.totalTreks}</h3>
              <p>Total Treks</p>
            </div>
          </StatCard>
            <StatCard $iconBg="rgba(76, 201, 240, 0.2)" $iconColor="#4CC9F0">
            <div className="icon">
              <FiCheck />
            </div>
            
            <div className="content">
              <h3>{stats.activeTreks}</h3>
              <p>Active Treks</p>
            </div>
          </StatCard>
            <StatCard $iconBg="rgba(247, 152, 36, 0.2)" $iconColor="#F79824">
            <div className="icon">
              <FiCalendar />
            </div>
            
            <div className="content">
              <h3>{stats.upcomingTreks}</h3>
              <p>Upcoming Treks</p>
            </div>
          </StatCard>
            <StatCard $iconBg="rgba(76, 175, 80, 0.2)" $iconColor="#4CAF50">
            <div className="icon">
              <FiFlag />
            </div>
            
            <div className="content">
              <h3>{stats.completedTreks}</h3>
              <p>Completed Treks</p>
            </div>
          </StatCard>
        </StatsContainer>
        
        <TreksTable>
          {treks.length === 0 ? (
            <EmptyState>
              <FiInfo />
              <h3>No treks found</h3>
              <p>You haven't listed any treks yet. Click the "Add New Trek" button to create your first trek listing.</p>              <Button $primary onClick={handleCreateTrek}>
                <FiPlus /> Add New Trek
              </Button>
            </EmptyState>
          ) : (
            <>
              <TableHeader>
                <TableCell>Image</TableCell>
                <TableCell>Trek Name</TableCell>
                <TableCell className="hide-small">Location</TableCell>
                <TableCell className="hide-mobile">Difficulty</TableCell>
                <TableCell className="hide-mobile">Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableHeader>
              
              {treks.map(trek => (
                <TrekRow key={trek.id}>
                  <TableCell>
                    <TrekImage>
                      <img src={trek.image || 'https://via.placeholder.com/150'} alt={trek.title} />
                    </TrekImage>
                  </TableCell>
                  
                  <TableCell>
                    <TrekTitle>
                      <h3>{trek.title}</h3>
                      <span>{trek.days} days</span>
                    </TrekTitle>
                  </TableCell>
                  
                  <TableCell className="hide-small">
                    {trek.location}
                  </TableCell>
                  
                  <TableCell className="hide-mobile">
                    {trek.difficulty}
                  </TableCell>
                    <TableCell className="hide-mobile">
                    ₹{trek.price || '0'}
                  </TableCell>
                  
                  <TableCell>
                    <ActionButtons>                      <ActionButton $view title="View Trek" onClick={() => handleViewTrek(trek.id)}>
                        <FiEye />
                      </ActionButton>
                      <ActionButton $edit title="Edit Trek" onClick={() => handleEditTrek(trek.id)}>
                        <FiEdit />
                      </ActionButton>
                      <ActionButton $delete title="Delete Trek" onClick={() => handleDeleteTrek(trek.id)}>
                        <FiTrash />
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TrekRow>
              ))}
            </>
          )}
        </TreksTable>
      </Container>
    </Page>
  );
};

export default OrganizerTreks;
