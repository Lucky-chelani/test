import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  getDoc 
} from "firebase/firestore";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  FiCheck, 
  FiX, 
  FiSave, 
  FiLogIn, 
  FiSearch, 
  FiTrendingUp, 
  FiStar, 
  FiAward, 
  FiCalendar 
} from "react-icons/fi";

// Styled components for the admin interface
const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
  
  @media (max-width: 768px) {
    margin: 40px auto;
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    margin: 30px auto;
    padding: 0 12px;
  }
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
  font-size: 2.5rem;
  color: #333;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 12px 18px;
  background: ${props => props.primary ? '#5390D9' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#333'};
  border: 1px solid ${props => props.primary ? '#5390D9' : '#ddd'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#4a81c4' : '#f9f9f9'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    box-shadow: 0 0 0 2px rgba(83, 144, 217, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const TreksTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr repeat(4, 100px);
  background: #f2f7ff;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e4e9f2;
  
  @media (max-width: 1000px) {
    grid-template-columns: 80px 1fr repeat(2, 100px);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TrekRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr repeat(4, 100px);
  padding: 15px 20px;
  border-bottom: 1px solid #e4e9f2;
  align-items: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafc;
  }
  
  @media (max-width: 1000px) {
    grid-template-columns: 80px 1fr repeat(2, 100px);
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
`;

const TrekImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-color: #e9ecef;
`;

const TrekInfo = styled.div`
  @media (max-width: 768px) {
    margin: 10px 0;
    width: 100%;
  }
`;

const TrekTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #222;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const TrekLocation = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
`;

const CategoryToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    margin-top: 10px;
    justify-content: flex-start;
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? props.activeColor || '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid ${props => props.active ? props.activeColor || '#4CAF50' : '#ddd'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? props.activeColor || '#4CAF50' : '#f5f5f5'};
    border-color: ${props => props.active ? props.activeColor || '#4CAF50' : '#ccc'};
  }

  @media (max-width: 768px) {
    margin-right: 10px;
  }
`;

const CategoryLabel = styled.div`
  display: none;
  margin-left: 10px;
  font-size: 0.9rem;
  color: #333;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CategoryMobileLabels = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
`;

const CategoryChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.color || '#e9ecef'};
  color: white;
  gap: 5px;
`;

const Message = styled.div`
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: ${props => props.error ? '#fee2e2' : '#ecfdf5'};
  color: ${props => props.error ? '#b91c1c' : '#065f46'};
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    flex-shrink: 0;
  }
`;

const LoginForm = styled.form`
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
`;

const NoTreksMessage = styled.div`
  padding: 30px 20px;
  text-align: center;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  
  svg {
    font-size: 2rem;
    color: #ccc;
  }
`;

// Login Component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful
    } catch (error) {
      setError('Login failed: ' + error.message);
      console.error("Login error:", error);
    }
    
    setLoading(false);
  };

  return (
    <LoginForm onSubmit={handleSubmit}>
      <LoginTitle>Admin Login</LoginTitle>
      
      {error && (
        <Message error>{error}</Message>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
          required
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        primary
        disabled={loading}
        style={{ width: '100%' }}
      >
        <FiLogIn />
        {loading ? 'Logging in...' : 'Login to Admin Panel'}
      </Button>
    </LoginForm>
  );
};

const TrekCategoryAdmin = () => {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', error: false });
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState({});
  
  // Admin emails that are allowed access
  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'harsh68968@gmail.com', 'youremail@example.com'];
  
  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        // User is authenticated and is an admin
        setUser(currentUser);
        fetchTreks();
      } else if (currentUser) {
        // User is authenticated but not an admin
        signOut(auth);
        setUser(null);
        setMessage({
          text: "You don't have admin privileges. Please contact the administrator.",
          error: true
        });
      } else {
        // No user is authenticated
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch all treks
  const fetchTreks = async () => {
    try {
      setLoading(true);
      const treksCollection = collection(db, 'treks');
      const treksSnapshot = await getDocs(treksCollection);
      
      const treksData = treksSnapshot.docs
        .filter(doc => doc.id !== "placeholder")
        .map(doc => ({
          id: doc.id,
          docId: doc.id,  // Store Firebase doc ID
          ...doc.data(),
          featured: doc.data().featured || false,
          recommended: doc.data().recommended || false,
          popular: doc.data().popular || false,
          upcoming: doc.data().upcoming || false,
          trending: doc.data().trending || false
        }));
      
      setTreks(treksData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching treks:", error);
      setMessage({
        text: "Error fetching treks: " + error.message,
        error: true
      });
      setLoading(false);
    }
  };
  
  // Toggle a category for a trek
  const toggleCategory = async (trekId, category) => {
    // Find the trek in our state
    const trekIndex = treks.findIndex(trek => trek.docId === trekId);
    if (trekIndex === -1) return;
    
    const trek = treks[trekIndex];
    const newValue = !trek[category];
    
    // Update local state first for immediate UI feedback
    const updatedTreks = [...treks];
    updatedTreks[trekIndex] = {
      ...trek,
      [category]: newValue
    };
    setTreks(updatedTreks);
    
    // Set this trek as saving
    setSaving(prev => ({ ...prev, [trekId + category]: true }));
    
    try {
      // Update in Firebase
      const trekRef = doc(db, 'treks', trekId);
      await updateDoc(trekRef, {
        [category]: newValue
      });
      
      setMessage({
        text: `${trek.title} ${newValue ? 'added to' : 'removed from'} ${category} category`,
        error: false
      });
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', error: false });
      }, 3000);
    } catch (error) {
      console.error("Error updating trek category:", error);
      // Revert the local state on error
      setTreks(prevTreks => {
        const revertedTreks = [...prevTreks];
        revertedTreks[trekIndex] = trek;
        return revertedTreks;
      });
      setMessage({
        text: "Failed to update category: " + error.message,
        error: true
      });
    } finally {
      // Remove saving state
      setSaving(prev => ({ ...prev, [trekId + category]: false }));
    }
  };
  
  // Filter treks based on search query
  const filteredTreks = treks.filter(trek => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      trek.title?.toLowerCase().includes(query) ||
      trek.location?.toLowerCase().includes(query) ||
      trek.country?.toLowerCase().includes(query) ||
      trek.difficulty?.toLowerCase().includes(query)
    );
  });
  
  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  
  // If not logged in, show login form
  if (!user) {
    return <Login />;
  }
  
  return (
    <AdminContainer>
      <Header>
        <Title>Trek Categories Admin</Title>
        <ButtonsContainer>
          <Button onClick={fetchTreks}>
            Refresh Treks
          </Button>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </ButtonsContainer>
      </Header>
      
      {message.text && (
        <Message error={message.error}>
          {message.error ? <FiX /> : <FiCheck />}
          {message.text}
        </Message>
      )}
      
      <SearchContainer>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        <SearchInput 
          type="text" 
          placeholder="Search treks by title, location, or difficulty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      {loading ? (
        <TreksTable>
          <TableHeader>
            <div>Image</div>
            <div>Trek Details</div>
            <div>Featured</div>
            <div>Recommended</div>
            <div>Popular</div>
            <div>Upcoming</div>
          </TableHeader>
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            Loading treks...
          </div>
        </TreksTable>
      ) : filteredTreks.length > 0 ? (
        <TreksTable>
          <TableHeader>
            <div>Image</div>
            <div>Trek Details</div>
            <div>Featured</div>
            <div>Recommended</div>
            <div>Popular</div>
            <div>Upcoming</div>
          </TableHeader>
          
          {filteredTreks.map((trek) => (
            <TrekRow key={trek.docId}>
              <TrekImage style={{ backgroundImage: `url(${trek.image})` }} />
              
              <TrekInfo>
                <TrekTitle>{trek.title}</TrekTitle>
                <TrekLocation>{trek.location} • {trek.difficulty}</TrekLocation>
                
                <CategoryMobileLabels>
                  {trek.featured && (
                    <CategoryChip color="#FFD700">
                      <FiAward /> Featured
                    </CategoryChip>
                  )}
                  {trek.recommended && (
                    <CategoryChip color="#4CAF50">
                      <FiStar /> Recommended
                    </CategoryChip>
                  )}
                  {trek.popular && (
                    <CategoryChip color="#2196F3">
                      <FiTrendingUp /> Popular
                    </CategoryChip>
                  )}
                  {trek.upcoming && (
                    <CategoryChip color="#9C27B0">
                      <FiCalendar /> Upcoming
                    </CategoryChip>
                  )}
                </CategoryMobileLabels>
              </TrekInfo>
              
              <CategoryToggle>
                <ToggleButton 
                  active={trek.featured}
                  activeColor="#FFD700"
                  onClick={() => toggleCategory(trek.docId, 'featured')}
                  disabled={saving[trek.docId + 'featured']}
                >
                  <FiAward />
                </ToggleButton>
                <CategoryLabel>Featured</CategoryLabel>
              </CategoryToggle>
              
              <CategoryToggle>
                <ToggleButton 
                  active={trek.recommended}
                  activeColor="#4CAF50"
                  onClick={() => toggleCategory(trek.docId, 'recommended')}
                  disabled={saving[trek.docId + 'recommended']}
                >
                  <FiStar />
                </ToggleButton>
                <CategoryLabel>Recommended</CategoryLabel>
              </CategoryToggle>
              
              <CategoryToggle>
                <ToggleButton 
                  active={trek.popular}
                  activeColor="#2196F3"
                  onClick={() => toggleCategory(trek.docId, 'popular')}
                  disabled={saving[trek.docId + 'popular']}
                >
                  <FiTrendingUp />
                </ToggleButton>
                <CategoryLabel>Popular</CategoryLabel>
              </CategoryToggle>
              
              <CategoryToggle>
                <ToggleButton 
                  active={trek.upcoming}
                  activeColor="#9C27B0"
                  onClick={() => toggleCategory(trek.docId, 'upcoming')}
                  disabled={saving[trek.docId + 'upcoming']}
                >
                  <FiCalendar />
                </ToggleButton>
                <CategoryLabel>Upcoming</CategoryLabel>
              </CategoryToggle>
            </TrekRow>
          ))}
        </TreksTable>
      ) : (
        <TreksTable>
          <NoTreksMessage>
            <FiSearch size={30} />
            {searchQuery ? (
              <>
                <h3>No matching treks found</h3>
                <p>Try changing your search query</p>
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </>
            ) : (
              <>
                <h3>No treks found</h3>
                <p>Add some treks first using the Trek Admin</p>
              </>
            )}
          </NoTreksMessage>
        </TreksTable>
      )}
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
        <h3 style={{ marginTop: 0 }}>Trek Category Definitions</h3>
        <ul>
          <li><strong>Featured:</strong> Highlighted prominently on the website with special styling.</li>
          <li><strong>Recommended:</strong> Treks we recommend because of their high ratings or unique experience.</li>
          <li><strong>Popular:</strong> Treks with high booking numbers or many positive reviews.</li>
          <li><strong>Upcoming:</strong> Treks that will be available in upcoming seasons or have limited-time offers.</li>
          <li><strong>Trending:</strong> Treks that are gaining popularity rapidly or being shared a lot on social media.</li>
        </ul>
      </div>
    </AdminContainer>
  );
};

export default TrekCategoryAdmin;
