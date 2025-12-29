import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FiGrid, 
  FiCalendar, 
  FiUsers, 
  FiTrendingUp,
  FiMap,
  FiPlusCircle,
  FiEdit,
  FiList,
  FiLogOut,
  FiSettings,
  FiAlertTriangle
} from 'react-icons/fi';
import { FaMountain, FaRoute } from 'react-icons/fa';

// Styled components for the organizer dashboard
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #111827 0%, #0F172A 100%);
  color: #ffffff;
  padding: 80px 0 80px 0;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const DashboardHeader = styled.div`
  margin-bottom: 30px;
`;

const OrganizerWelcome = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OrganizerIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background: linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
  
  svg {
    font-size: 28px;
    color: white;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const OrganizerInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 5px 0;
  background: linear-gradient(135deg, #7DD8F8 0%, #4CC9F0 50%, #4361EE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubTitle = styled.p`
  font-size: 1.1rem;
  color: #cbd5e1;
  margin: 0;
  max-width: 600px;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    background: rgba(30, 41, 59, 0.9);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.bgColor || 'rgba(67, 97, 238, 0.2)'};
  color: ${props => props.color || '#4361EE'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  svg {
    font-size: 24px;
  }
`;

const StatValue = styled.span`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #ffffff;
`;

const StatLabel = styled.span`
  font-size: 0.95rem;
  color: #94a3b8;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ActionCard = styled(Link)`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ActionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: ${props => props.bgColor || 'rgba(67, 97, 238, 0.15)'};
  color: ${props => props.color || '#4361EE'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    font-size: 24px;
  }
`;

const ActionText = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
`;

const ActionDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #94a3b8;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 86, 86, 0.15);
  border-left: 4px solid #FF5656;
  color: #ffd0d0;
  padding: 20px;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 700px;
  margin: 30px auto;
  
  svg {
    font-size: 1.5rem;
    color: #FF5656;
    flex-shrink: 0;
  }
`;

const OrganizerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    activeTrails: 0,
    bookings: 0,
    revenue: 0,
    upcoming: 0
  });
  const [organizerName, setOrganizerName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {          // Check if user is an organizer or admin
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.role === 'organizer' || userData.role === 'admin') {
              // Set organizer name
              setOrganizerName(userData.organizationDetails?.name || userData.displayName || 'Trek Organizer');
              
              // Fetch stats
              fetchOrganizerStats(currentUser.uid);
            } else {
              setError('You do not have organizer privileges to access this page.');
              setLoading(false);
            }
          } else {
            setError('User profile not found.');
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching organizer data:", err);
          setError('Failed to load organizer data.');
          setLoading(false);
        }
      } else {
        setUser(null);
        navigate('/organizer-trek-login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  const fetchOrganizerStats = async (organizerId) => {
    try {
      // Fetch active treks
      const treksQuery = query(
        collection(db, 'treks'),
        where('organizerId', '==', organizerId),
        where('status', '==', 'active')
      );
      const treksSnapshot = await getDocs(treksQuery);
      const activeTreks = treksSnapshot.size;
      
      // Fetch upcoming treks
      const now = new Date();
      const upcomingQuery = query(
        collection(db, 'treks'),
        where('organizerId', '==', organizerId),
        where('startDate', '>', now)
      );
      const upcomingSnapshot = await getDocs(upcomingQuery);
      const upcomingTreks = upcomingSnapshot.size;
      
      // Fetch bookings
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('organizerId', '==', organizerId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsCount = bookingsSnapshot.size;
      
      // Calculate revenue
      let totalRevenue = 0;
      bookingsSnapshot.forEach(doc => {
        const booking = doc.data();
        if (booking.status === 'confirmed' && booking.amount) {
          totalRevenue += Number(booking.amount);
        }
      });
      
      setStats({
        activeTrails: activeTreks,
        bookings: bookingsCount,
        revenue: totalRevenue,
        upcoming: upcomingTreks
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError('Failed to load organizer statistics.');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <FaMountain size={40} style={{ marginBottom: 20, opacity: 0.7 }} />
          <h2>Loading your organizer dashboard...</h2>
        </LoadingContainer>
      </DashboardContainer>
    );
  }
  
  if (error) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <ErrorMessage>
            <FiAlertTriangle />
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>Access Error</h3>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          </ErrorMessage>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link to="/" style={{ color: '#4CC9F0', textDecoration: 'none' }}>Return to Homepage</Link>
          </div>
        </DashboardContent>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardHeader>
          <OrganizerWelcome>
            <OrganizerIcon>
              <FaMountain />
            </OrganizerIcon>
            <OrganizerInfo>
              <Title>Welcome, {organizerName}</Title>
              <SubTitle>Manage your treks, bookings and track your performance from this dashboard</SubTitle>
            </OrganizerInfo>
          </OrganizerWelcome>
          
          <QuickStats>
            <StatCard>
              <StatIcon bgColor="rgba(76, 201, 240, 0.2)" color="#4CC9F0">
                <FiMap />
              </StatIcon>
              <StatValue>{stats.activeTrails}</StatValue>
              <StatLabel>Active Treks</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon bgColor="rgba(247, 152, 36, 0.2)" color="#F79824">
                <FiCalendar />
              </StatIcon>
              <StatValue>{stats.upcoming}</StatValue>
              <StatLabel>Upcoming Treks</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon bgColor="rgba(67, 97, 238, 0.2)" color="#4361EE">
                <FiUsers />
              </StatIcon>
              <StatValue>{stats.bookings}</StatValue>
              <StatLabel>Total Bookings</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon bgColor="rgba(76, 175, 80, 0.2)" color="#4CAF50">
                <FiTrendingUp />
              </StatIcon>
              <StatValue>${stats.revenue.toLocaleString()}</StatValue>
              <StatLabel>Total Revenue</StatLabel>
            </StatCard>
          </QuickStats>
          
          <ActionGrid>
            <ActionCard to="/organizer/treks">
              <ActionIcon bgColor="rgba(76, 201, 240, 0.15)" color="#4CC9F0">
                <FiList />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Manage Treks</ActionTitle>
                <ActionDescription>View, edit and manage your listed treks</ActionDescription>
              </ActionText>
            </ActionCard>
            
            <ActionCard to="/organizer/add-trek">
              <ActionIcon bgColor="rgba(76, 175, 80, 0.15)" color="#4CAF50">
                <FiPlusCircle />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Add New Trek</ActionTitle>
                <ActionDescription>Create and list a new trek experience</ActionDescription>
              </ActionText>
            </ActionCard>
            
            <ActionCard to="/organizer/bookings">
              <ActionIcon bgColor="rgba(247, 152, 36, 0.15)" color="#F79824">
                <FiCalendar />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Manage Bookings</ActionTitle>
                <ActionDescription>View and manage customer bookings</ActionDescription>
              </ActionText>
            </ActionCard>
            
            <ActionCard to="/organizer/profile">
              <ActionIcon bgColor="rgba(238, 67, 124, 0.15)" color="#EE437C">
                <FiEdit />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Organization Profile</ActionTitle>
                <ActionDescription>Update your organization details</ActionDescription>
              </ActionText>
            </ActionCard>
            
            <ActionCard to="/organizer/settings">
              <ActionIcon bgColor="rgba(255, 255, 255, 0.1)" color="#ffffff">
                <FiSettings />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Account Settings</ActionTitle>
                <ActionDescription>Manage account settings and preferences</ActionDescription>
              </ActionText>
            </ActionCard>
            
            <ActionCard to="#" onClick={(e) => { e.preventDefault(); auth.signOut(); }}>
              <ActionIcon bgColor="rgba(255, 86, 86, 0.15)" color="#FF5656">
                <FiLogOut />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Sign Out</ActionTitle>
                <ActionDescription>Log out from your organizer account</ActionDescription>
              </ActionText>
            </ActionCard>
          </ActionGrid>
        </DashboardHeader>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default OrganizerDashboard;
