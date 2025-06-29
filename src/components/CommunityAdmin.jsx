import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from "firebase/firestore";
import { FiTrash, FiEdit, FiSave, FiX, FiCheckCircle, FiXCircle, FiLogIn, FiLogOut, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import CreateCommunityModal from "./CreateCommunityModal";

// Styled components for the admin interface
const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
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
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const CommunitiesTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 120px 120px 100px 100px;
  background: #f2f7ff;
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e4e9f2;
  
  @media (max-width: 1000px) {
    grid-template-columns: 40px 1fr 120px 120px 100px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    ${props => !props.alwaysShow && `
      margin-top: 6px;
      font-size: 0.9rem;
      color: #666;
    `}
  }
`;

const CommunityRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 120px 120px 100px 100px;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e9f2;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fbff;
  }
  
  @media (max-width: 1000px) {
    grid-template-columns: 40px 1fr 120px 120px 100px;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }
`;

const CommunityName = styled.div`
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CommunityNameMobile = styled.div`
  display: none;
  width: 100%;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    h3 {
      margin: 0;
      font-size: 1.1rem;
    }
  }
`;

const MobileCellLabel = styled.span`
  display: none;
  
  @media (max-width: 768px) {
    display: inline;
    font-weight: 600;
    margin-right: 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const IconButton = styled.button`
  background: ${props => props.danger ? '#fee2e2' : props.success ? '#dcfce7' : '#f3f4f6'};
  color: ${props => props.danger ? '#ef4444' : props.success ? '#22c55e' : '#6b7280'};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  
  &:hover {
    background: ${props => props.danger ? '#fecaca' : props.success ? '#bbf7d0' : '#e5e7eb'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    height: 44px;
  }
`;

const LoginForm = styled.form`
  max-width: 400px;
  margin: 100px auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  margin-top: 8px;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    margin-bottom: 20px;
  }
`;

const FeaturedToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  span {
    background: ${props => props.featured ? 'linear-gradient(135deg, #5390D9 0%, #7400B8 100%)' : '#f3f4f6'};
    color: ${props => props.featured ? 'white' : '#6b7280'};
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

const CommunityAdmin = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCommunities();
      } else {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const communitiesRef = collection(db, "chatrooms");
      const q = query(communitiesRef, orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      
      const communitiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        docId: doc.id,
        members: doc.data().members || [],
        featured: doc.data().featured || false
      }));
      
      setCommunities(communitiesData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError("Failed to load communities. Please try again.");
      setLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Invalid email or password");
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  const toggleFeaturedStatus = async (community) => {
    try {
      setSavingId(community.docId);
      const communityRef = doc(db, "chatrooms", community.docId);
      
      console.log(`Updating featured status for community: ${community.name} (ID: ${community.docId})`);
      
      await updateDoc(communityRef, {
        featured: !community.featured
      });
      
      // Update local state
      setCommunities(communities.map(c => 
        c.docId === community.docId ? {...c, featured: !c.featured} : c
      ));
      
      setSavingId(null);
      
      // Show success message
      setSuccessMessage(`Community "${community.name}" ${!community.featured ? 'added to' : 'removed from'} featured`);
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error("Error updating featured status:", err);
      setError(`Failed to update featured status: ${err.message}`);
      setSavingId(null);
    }
  };
  
  const deleteCommunity = async (communityId) => {
    if (!window.confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      return;
    }
    
    try {
      setSavingId(communityId);
      
      // We need to use the docId for Firestore operations
      const communityRef = doc(db, "chatrooms", communityId);
      console.log(`Attempting to delete community with ID: ${communityId}`);
      
      await deleteDoc(communityRef);
      console.log(`Community deleted successfully`);
      
      // Update local state - use both id and docId to ensure we filter correctly
      const deletedCommunity = communities.find(c => c.docId === communityId || c.id === communityId);
      setCommunities(communities.filter(c => c.docId !== communityId && c.id !== communityId));
      setSavingId(null);
      
      // Show success message
      setSuccessMessage(`Community "${deletedCommunity?.name || 'Unknown'}" was deleted`);
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error("Error deleting community:", err);
      setError(`Failed to delete community: ${err.message}`);
      setSavingId(null);
    }
  };
  
  const handleCommunityCreated = (newCommunity) => {
    // Add the new community to the state
    setCommunities([newCommunity, ...communities]);
    
    // Show success message
    setSuccessMessage(`Community "${newCommunity.name}" was created successfully`);
    setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
  };
  
  if (!user) {
    return (
      <LoginForm onSubmit={handleLogin}>
        <FormTitle>Admin Login</FormTitle>
        
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        
        <Button primary type="submit" disabled={loading} style={{ width: '100%' }}>
          <FiLogIn />
          {loading ? "Logging in..." : "Login"}
        </Button>
      </LoginForm>
    );
  }
  
  return (
    <AdminContainer>
      <Header>
        <Title>Community Admin</Title>
        <ButtonsContainer>
          <Button onClick={() => setShowCreateModal(true)} primary>
            <FiPlus />
            Create Community
          </Button>
          <Button onClick={fetchCommunities} disabled={loading}>
            <FiRefreshCw />
            Refresh
          </Button>
          <Button onClick={handleLogout}>
            <FiLogOut />
            Logout
          </Button>
        </ButtonsContainer>
      </Header>
      
      {error && (
        <div style={{
          background: '#fee2e2', 
          color: '#ef4444',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
          <span 
            style={{float: 'right', cursor: 'pointer'}} 
            onClick={() => setError(null)}
          >
            <FiX />
          </span>
        </div>
      )}
      
      {successMessage && (
        <div style={{
          background: '#dcfce7', 
          color: '#16a34a',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {successMessage}
          <span 
            style={{float: 'right', cursor: 'pointer'}} 
            onClick={() => setSuccessMessage("")}
          >
            <FiX />
          </span>
        </div>
      )}
      
      {/* Create Community Modal */}
      <CreateCommunityModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCommunityCreated}
      />
      
      <CommunitiesTable>
        <TableHeader>
          <Cell>#</Cell>
          <Cell>Name</Cell>
          <Cell>Members</Cell>
          <Cell>Featured</Cell>
          <Cell>Status</Cell>
          <Cell>Actions</Cell>
        </TableHeader>
        
        {loading ? (
          <CommunityRow>
            <Cell colSpan="6" style={{ gridColumn: "1 / -1", justifyContent: "center" }}>
              Loading communities...
            </Cell>
          </CommunityRow>
        ) : communities.length === 0 ? (
          <EmptyState>
            <h3>No Communities Found</h3>
            <p>There are no communities in the system yet.</p>
          </EmptyState>
        ) : (
          communities.map((community, index) => (
            <CommunityRow key={community.id}>
              <Cell alwaysShow>
                <CommunityNameMobile>
                  <h3>{community.name}</h3>
                  <ActionButtons>
                    <IconButton
                      success={community.featured}
                      onClick={() => toggleFeaturedStatus(community)}
                      disabled={savingId === community.id}
                      title={community.featured ? "Remove from featured" : "Add to featured"}
                    >
                      {community.featured ? <FiCheckCircle /> : <FiXCircle />}
                    </IconButton>
                    <IconButton
                      danger
                      onClick={() => deleteCommunity(community.docId)}
                      disabled={savingId === community.docId}
                      title="Delete community"
                    >
                      <FiTrash />
                    </IconButton>
                  </ActionButtons>
                </CommunityNameMobile>
                {index + 1}
              </Cell>
              <Cell>
                <CommunityName>{community.name}</CommunityName>
              </Cell>
              <Cell>
                <MobileCellLabel>Members:</MobileCellLabel>
                {community.members?.length || 0}
              </Cell>
              <Cell>
                <FeaturedToggle featured={community.featured}>
                  <span>{community.featured ? 'Featured' : 'Regular'}</span>
                </FeaturedToggle>
              </Cell>
              <Cell>
                <MobileCellLabel>Status:</MobileCellLabel>
                <span style={{ 
                  color: savingId === community.id ? '#f59e0b' : '#10b981', 
                  fontWeight: 500 
                }}>
                  {savingId === community.id ? 'Saving...' : 'Active'}
                </span>
              </Cell>
              <Cell>
                <ActionButtons>
                  <IconButton
                    success={community.featured}
                    onClick={() => toggleFeaturedStatus(community)}
                    disabled={savingId === community.id}
                    title={community.featured ? "Remove from featured" : "Add to featured"}
                  >
                    {community.featured ? <FiCheckCircle /> : <FiXCircle />}
                  </IconButton>
                  <IconButton
                    danger
                    onClick={() => deleteCommunity(community.docId)}
                    disabled={savingId === community.docId}
                    title="Delete community"
                  >
                    <FiTrash />
                  </IconButton>
                </ActionButtons>
              </Cell>
            </CommunityRow>
          ))
        )}
      </CommunitiesTable>
    </AdminContainer>
  );
};

export default CommunityAdmin;
