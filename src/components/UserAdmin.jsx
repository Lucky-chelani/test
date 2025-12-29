import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  orderBy,
  where
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  FiUsers, 
  FiEdit, 
  FiSave, 
  FiX, 
  FiCheck, 
  FiArrowLeft, 
  FiUser,
  FiShield,
  FiSearch,
  FiRefreshCw,
  FiAlertTriangle
} from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';

// Styled components for the user management interface
const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #fff;
  position: relative;
  z-index: 5;
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
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${props => props.primary ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' : 'rgba(255, 255, 255, 0.1)'};
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
    background: ${props => props.primary ? 'linear-gradient(135deg, #FF5252 0%, #FF6B6B 100%)' : 'rgba(255, 255, 255, 0.2)'};
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

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 6px;
  padding: 12px 12px 12px 40px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const UsersTable = styled.div`
  background: rgba(30, 40, 60, 0.7);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 2fr 1fr 140px;
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

const UserRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 2fr 1fr 140px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  transition: background 0.2s;
  position: relative;
  
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

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4361EE, #3A0CA3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  h3 {
    margin: 0 0 5px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  span {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const UserJoined = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
`;

const RoleCell = styled.div`
  position: relative;
  
  &.editing {
    z-index: 10;
  }
`;

const CurrentRole = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => {
    if (props.role === 'admin') return 'rgba(239, 68, 68, 0.15)';
    if (props.role === 'organizer') return 'rgba(59, 130, 246, 0.15)';
    return 'rgba(107, 114, 128, 0.15)';
  }};
  color: ${props => {
    if (props.role === 'admin') return '#EF4444';
    if (props.role === 'organizer') return '#3B82F6';
    return '#6B7280';
  }};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.85rem;
  font-weight: 500;
  max-width: 140px;
  
  svg {
    font-size: 0.9rem;
  }
`;

const RoleSelector = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(30, 41, 59, 0.98);
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 8px;
  z-index: 20;
  min-width: 150px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const RoleOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.selected {
    background: rgba(255, 107, 107, 0.2);
  }
  
  svg {
    color: ${props => {
      if (props.role === 'admin') return '#EF4444';
      if (props.role === 'organizer') return '#3B82F6';
      return '#6B7280';
    }};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.save) return 'rgba(16, 185, 129, 0.15)';
    if (props.edit) return 'rgba(59, 130, 246, 0.15)';
    if (props.cancel) return 'rgba(239, 68, 68, 0.15)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => {
    if (props.save) return '#10B981';
    if (props.edit) return '#3B82F6';
    if (props.cancel) return '#EF4444';
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
      if (props.save) return 'rgba(16, 185, 129, 0.25)';
      if (props.edit) return 'rgba(59, 130, 246, 0.25)';
      if (props.cancel) return 'rgba(239, 68, 68, 0.25)';
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

// Pagination components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.9rem;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Role icon renderer helper
const getRoleIcon = (role) => {
  switch(role) {
    case 'admin':
      return <FiShield />;
    case 'organizer':
      return <FaMountain />;
    default:
      return <FiUser />;
  }
};

// Main component
const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ text: '', error: false });
  const [user, setUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const [saving, setSaving] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  const navigate = useNavigate();  // Check authentication and admin role
  useEffect(() => {
    const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'harsh68968@gmail.com', 'ayushmanpatel13@gmail.com'];
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Always grant access to admin emails
        if (ADMIN_EMAILS.includes(currentUser.email)) {
          fetchUsers();
          return;
        }
        // Check if the user is an admin in Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            fetchUsers();
          } else {
            setMessage({
              text: 'Access denied. You need administrator privileges to access this page.',
              error: true
            });
            setLoading(false);
          }
        } catch (err) {
          console.error('Error checking user role:', err);
          setMessage({
            text: `Error checking user permissions: ${err.message}`,
            error: true
          });
          setLoading(false);
        }
      } else {
        setUser(null);
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all users from the users collection
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersList);
      setFilteredUsers(usersList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setMessage({
        text: `Error fetching users: ${err.message}`,
        error: true
      });
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(query) || 
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, users]);

  // Handle role edit
  const handleEditRole = (userId, currentRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole || 'user');
  };

  // Handle role selection
  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  // Handle role save
  const handleSaveRole = async (userId) => {
    try {
      setSaving(true);
      
      // Update user role in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: selectedRole });
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: selectedRole } : u
      ));
      
      setEditingUserId(null);
      setSaving(false);
      
      setMessage({
        text: `User role updated to ${selectedRole} successfully`,
        error: false
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', error: false });
      }, 3000);
    } catch (err) {
      console.error('Error updating user role:', err);
      setMessage({
        text: `Error updating role: ${err.message}`,
        error: true
      });
      setSaving(false);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // If loading
  if (loading) {
    return (
      <AdminContainer>
        <Header>
          <Title>User Management</Title>
        </Header>
        <p>Loading users...</p>
      </AdminContainer>
    );
  }
  
  // If error message and not loading
  if (message.error && !loading) {
    return (
      <AdminContainer>
        <Header>
          <Title>User Management</Title>
          <ButtonsContainer>
            <Button onClick={() => navigate('/admin')}>
              <FiArrowLeft /> Back to Admin
            </Button>
          </ButtonsContainer>
        </Header>
        
        <Message error>
          <FiAlertTriangle />
          {message.text}
        </Message>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Header>
        <Title>User Management</Title>
        <ButtonsContainer>
          <Button onClick={fetchUsers}>
            <FiRefreshCw /> Refresh
          </Button>
          <Button onClick={() => navigate('/admin')}>
            <FiArrowLeft /> Back to Admin
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
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <UsersTable>
        <TableHeader>
          <TableCell>Avatar</TableCell>
          <TableCell>User</TableCell>
          <TableCell className="hide-small">Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Actions</TableCell>
        </TableHeader>
        
        {currentUsers.map(user => (
          <UserRow key={user.id}>
            <TableCell>
              <UserAvatar>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name || 'User'} />
                ) : (
                  <DefaultAvatar>
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </DefaultAvatar>
                )}
              </UserAvatar>
            </TableCell>
            
            <TableCell>
              <UserInfo>
                <h3>{user.name || 'Unnamed User'}</h3>
                <UserJoined>Joined: {formatDate(user.createdAt)}</UserJoined>
              </UserInfo>
            </TableCell>
            
            <TableCell className="hide-small">
              {user.email}
            </TableCell>
            
            <TableCell>
              <RoleCell className={editingUserId === user.id ? 'editing' : ''}>
                {editingUserId === user.id ? (
                  <RoleSelector>
                    <RoleOption 
                      role="user"
                      className={selectedRole === 'user' ? 'selected' : ''}
                      onClick={() => handleSelectRole('user')}
                    >
                      <FiUser /> Regular User
                    </RoleOption>
                    <RoleOption 
                      role="organizer"
                      className={selectedRole === 'organizer' ? 'selected' : ''}
                      onClick={() => handleSelectRole('organizer')}
                    >
                      <FaMountain /> Organizer
                    </RoleOption>
                    <RoleOption 
                      role="admin"
                      className={selectedRole === 'admin' ? 'selected' : ''}
                      onClick={() => handleSelectRole('admin')}
                    >
                      <FiShield /> Administrator
                    </RoleOption>
                  </RoleSelector>
                ) : (
                  <CurrentRole role={user.role || 'user'}>
                    {getRoleIcon(user.role || 'user')}
                    {user.role === 'admin' ? 'Administrator' : 
                     user.role === 'organizer' ? 'Organizer' : 'Regular User'}
                  </CurrentRole>
                )}
              </RoleCell>
            </TableCell>
            
            <TableCell>
              <ActionsContainer>
                {editingUserId === user.id ? (
                  <>
                    <ActionButton 
                      save
                      title="Save changes"
                      onClick={() => handleSaveRole(user.id)}
                      disabled={saving}
                    >
                      <FiSave />
                    </ActionButton>
                    <ActionButton 
                      cancel
                      title="Cancel"
                      onClick={() => setEditingUserId(null)}
                      disabled={saving}
                    >
                      <FiX />
                    </ActionButton>
                  </>
                ) : (
                  <ActionButton 
                    edit
                    title="Edit role"
                    onClick={() => handleEditRole(user.id, user.role || 'user')}
                  >
                    <FiEdit />
                  </ActionButton>
                )}
              </ActionsContainer>
            </TableCell>
          </UserRow>
        ))}
      </UsersTable>
      
      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <PaginationContainer>
          <PaginationInfo>
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </PaginationInfo>
          
          <PaginationButtons>
            <PaginationButton 
              onClick={() => paginate(1)} 
              disabled={currentPage === 1}
            >
              First
            </PaginationButton>
            <PaginationButton 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
            <PaginationButton 
              onClick={() => paginate(totalPages)} 
              disabled={currentPage === totalPages}
            >
              Last
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      )}
    </AdminContainer>
  );
};

export default UserAdmin;
