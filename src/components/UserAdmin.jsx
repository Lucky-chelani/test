import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { 
  collection, query, getDocs, doc, getDoc, updateDoc, orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiRefreshCw, FiEdit3, FiCheck, FiX, FiArrowLeft, 
  FiShield, FiUser, FiActivity, FiAlertTriangle, FiInfo, 
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiMoreVertical, FiLock , FiUsers  , FiCheckCircle
} from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';

/* ==========================================================================
   GLOBAL STYLES & ANIMATIONS
   ========================================================================== */
const GlobalStyle = createGlobalStyle`
  body { 
    background: #02040a; 
    color: #e2e8f0; 
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }
`;

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const shimmer = keyframes`0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; }`;
const pulseGlow = keyframes`0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }`;

/* ==========================================================================
   STYLED COMPONENTS - LAYOUT & STRUCTURE
   ========================================================================== */
const PageLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 100px 24px;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
`;

const TitleBlock = styled.div`
  h1 { 
    font-size: 2.75rem; 
    font-weight: 900; 
    margin: 10px 0 5px 0; 
    background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
  }
  p { color: #64748b; font-size: 1.05rem; margin: 0; font-weight: 500; }
`;

const SecurityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  svg { animation: ${pulseGlow} 2s infinite; border-radius: 50%; }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 600px) { width: 100%; flex-wrap: wrap; }
`;

const Button = styled.button`
  background: ${props => props.$primary ? '#ffffff' : 'rgba(255, 255, 255, 0.03)'};
  color: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
  border: 1px solid ${props => props.$primary ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'};
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: ${props => props.$primary ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)'};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 600px) { flex: 1; }
`;

/* ==========================================================================
   STYLED COMPONENTS - STATS & CONTROLS
   ========================================================================== */
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(145deg, #0f172a 0%, #020617 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
    background: ${props => props.$color || '#8b5cf6'};
  }

  .stat-info {
    .label { color: #64748b; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .value { color: #ffffff; font-size: 2.5rem; font-weight: 900; margin-top: 4px; line-height: 1; }
  }
  .stat-icon {
    width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
    background: ${props => props.$bg || 'rgba(139, 92, 246, 0.1)'}; color: ${props => props.$color || '#8b5cf6'};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  background: rgba(15, 23, 42, 0.6);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 900px) { flex-direction: column; align-items: stretch; }
`;

const SearchInputBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 1.2rem; }
  
  input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 14px 16px 14px 48px;
    color: white;
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    
    &:focus { outline: none; border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
    &::placeholder { color: #475569; }
  }

  @media (max-width: 900px) { max-width: 100%; }
`;

const FilterPills = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  ::-webkit-scrollbar { height: 4px; }
`;

const Pill = styled.button`
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.15)' : 'transparent'};
  color: ${props => props.$active ? '#a78bfa' : '#64748b'};
  border: 1px solid ${props => props.$active ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover { background: rgba(139, 92, 246, 0.1); color: #e2e8f0; border-color: rgba(139, 92, 246, 0.2); }
`;

/* ==========================================================================
   STYLED COMPONENTS - LIST & CARDS
   ========================================================================== */
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UserRow = styled(motion.div)`
  background: ${props => props.$isMe ? 'rgba(139, 92, 246, 0.05)' : '#0a0f1e'};
  border: 1px solid ${props => props.$isMe ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 16px;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: 50px 2fr 1.5fr 1fr 120px;
  align-items: center;
  gap: 24px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.$isMe ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.15)'};
    background: ${props => props.$isMe ? 'rgba(139, 92, 246, 0.08)' : '#0f172a'};
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  /* 🚨 THE FIX: Hide the mobile row on laptop/desktop screens */
  .mobile-full {
    display: none;
  }

  @media (max-width: 1024px) { 
    grid-template-columns: 50px 1.5fr 1fr 120px; 
    .hide-tablet { display: none; } 
  }
  
  @media (max-width: 600px) { 
    grid-template-columns: 45px 1fr; 
    padding: 20px 16px;
    gap: 16px;
    .hide-mobile { display: none; } 
    
    /* Reveal the mobile row ONLY on phones */
    .mobile-full { 
      grid-column: 1 / -1; 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      border-top: 1px solid rgba(255,255,255,0.05); 
      padding-top: 16px; 
      margin-top: 8px; 
    }
  }
`;

const UserAvatar = styled.div`
  width: 50px; height: 50px; border-radius: 14px; overflow: hidden; background: #1e293b;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  img { width: 100%; height: 100%; object-fit: cover; }
  .initials { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #a78bfa; font-size: 1.2rem; background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05)); }
  @media (max-width: 600px) { width: 45px; height: 45px; }
`;

const UserIdentity = styled.div`
  min-width: 0; /* Prevents flex blowout */
  .name-block { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .name { font-weight: 700; font-size: 1.1rem; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .you-tag { font-size: 0.65rem; background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 50px; font-weight: 800; }
  .email { color: #64748b; font-size: 0.85rem; font-family: 'Space Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  .label { font-size: 0.7rem; color: #475569; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
  .value { font-size: 0.9rem; color: #cbd5e1; font-family: 'Space Mono', monospace; }
`;

const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${props => props.$role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : props.$role === 'organizer' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(148, 163, 184, 0.1)'};
  color: ${props => props.$role === 'admin' ? '#ef4444' : props.$role === 'organizer' ? '#3b82f6' : '#94a3b8'};
  border: 1px solid ${props => props.$role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : props.$role === 'organizer' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.2)'};
`;

const CustomSelect = styled.select`
  appearance: none;
  background: #1e293b;
  color: white;
  border: 1px solid #475569;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  width: 100%;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;

  &:focus { border-color: #8b5cf6; box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2); }
  option { background: #0f172a; }
`;

const ActionCell = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; transition: 0.2s;
  
  ${props => props.$variant === 'edit' && `background: rgba(255,255,255,0.05); color: #cbd5e1; &:hover { background: rgba(255,255,255,0.1); color: white; }`}
  ${props => props.$variant === 'save' && `background: rgba(16, 185, 129, 0.15); color: #10b981; &:hover { background: rgba(16, 185, 129, 0.25); }`}
  ${props => props.$variant === 'cancel' && `background: rgba(239, 68, 68, 0.15); color: #ef4444; &:hover { background: rgba(239, 68, 68, 0.25); }`}
  
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

/* ==========================================================================
   STYLED COMPONENTS - UTILITIES (Pagination, Modals, Skeletons)
   ========================================================================== */
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  background: rgba(15, 23, 42, 0.5);
  padding: 16px 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .info { color: #64748b; font-size: 0.9rem; font-weight: 500; span { color: white; font-weight: 700; } }

  @media (max-width: 768px) { flex-direction: column; gap: 16px; }
`;

const PageControls = styled.div`
  display: flex; gap: 6px;
  button {
    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.05); color: white;
    width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.2s; font-weight: 600; font-size: 0.9rem;
    &:hover:not(:disabled) { background: rgba(139, 92, 246, 0.2); border-color: rgba(139, 92, 246, 0.4); color: #a78bfa; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
    &.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }
  }
`;

const SkeletonRow = styled.div`
  height: 86px; border-radius: 16px; margin-bottom: 12px;
  background: #0a0f1e; border: 1px solid rgba(255,255,255,0.02);
  position: relative; overflow: hidden;
  &::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
    animation: ${shimmer} 2s infinite linear;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
`;

const ModalCard = styled(motion.div)`
  background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 32px;
  max-width: 450px; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,0.5); text-align: center;
  
  .icon-danger { width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px; }
  h3 { font-size: 1.5rem; margin: 0 0 12px 0; color: white; }
  p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px; }
  
  .btn-group { display: flex; gap: 12px; }
  .btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-weight: 600; cursor: pointer; }
  .btn-confirm { flex: 1; padding: 12px; background: #ef4444; border: none; border-radius: 10px; color: white; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
`;

const ToastContainer = styled(motion.div)`
  position: fixed; bottom: 30px; right: 30px; z-index: 1100;
  background: ${props => props.$type === 'error' ? '#ef4444' : '#10b981'};
  color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; font-size: 0.95rem;
  display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  @media (max-width: 600px) { bottom: 20px; right: 20px; left: 20px; justify-content: center; }
`;

/* ==========================================================================
   MAIN COMPONENT LOGIC
   ========================================================================== */
const UserAdmin = () => {
  const navigate = useNavigate();
  
  // Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [tempRole, setTempRole] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Overlay State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, targetUser: null, targetRole: '' });

  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'harsh68968@gmail.com', 'ayushmanpatel13@gmail.com'];

  // Auth Protection & Data Fetching
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/login'); return; }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const isDBAdmin = userDoc.exists() && userDoc.data().role === 'admin';
        const isMasterEmail = ADMIN_EMAILS.includes(user.email);

        if (isMasterEmail || isDBAdmin) {
          fetchUsers();
        } else {
          navigate('/'); // Strict booting
        }
      } catch (err) {
        showToast('Authentication Error', 'error');
        navigate('/');
      }
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const fetchedUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(fetchedUsers);
    } catch (err) {
      showToast('Failed to connect to secure database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 4000);
  };

  const getInitials = (name, email) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Action Handlers
  const triggerRoleUpdate = (user) => {
    if (user.id === auth.currentUser.uid) {
      showToast("Security Protocol: You cannot modify your own core permissions.", "error");
      setEditingId(null);
      return;
    }
    // If upgrading to admin or organizer, ask for confirmation
    if (tempRole === 'admin' || tempRole === 'organizer') {
      setConfirmModal({ isOpen: true, targetUser: user, targetRole: tempRole });
    } else {
      executeRoleUpdate(user.id, tempRole);
    }
  };

  const executeRoleUpdate = async (userId, newRole) => {
    setConfirmModal({ isOpen: false, targetUser: null, targetRole: '' });
    
    // Optimistic UI update
    const previousUsers = [...users];
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingId(null);

    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      showToast(`Access level successfully updated.`);
    } catch (err) {
      setUsers(previousUsers); // Revert on failure
      showToast("Permission Error: Firestore rejected the update.", "error");
    }
  };

  // Derived Data (Filtering & Pagination)
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.id.includes(searchTerm);
      const matchesRole = roleFilter === 'all' || (u.role || 'user') === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    orgs: users.filter(u => u.role === 'organizer').length
  }), [users]);

  // Pagination Math
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  // Ensure current page is valid after filtering
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [filteredUsers.length, totalPages, currentPage]);
  
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <PageLayout>
      <GlobalStyle />
      
      {/* 1. HEADER */}
      <HeaderContainer>
        <TitleBlock>
          <SecurityBadge><FiLock /> Server Secured</SecurityBadge>
          <h1>Command Center</h1>
          <p>Personnel Management & Authorization Protocol</p>
        </TitleBlock>
        <ActionButtonGroup>
          <Button onClick={fetchUsers}><FiRefreshCw /> Sync Data</Button>
          <Button $primary onClick={() => navigate('/admin')}><FiArrowLeft /> Admin Dashboard</Button>
        </ActionButtonGroup>
      </HeaderContainer>

      {/* 2. STATS GRID */}
      <StatsContainer>
        <StatCard $bg="rgba(56, 189, 248, 0.1)" $color="#38bdf8">
          <div className="stat-info">
            <div className="label">Total Personnel</div>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat-icon"><FiUsers /></div>
        </StatCard>
        <StatCard $bg="rgba(239, 68, 68, 0.1)" $color="#ef4444">
          <div className="stat-info">
            <div className="label">Administrators</div>
            <div className="value">{stats.admins}</div>
          </div>
          <div className="stat-icon"><FiShield /></div>
        </StatCard>
        <StatCard $bg="rgba(16, 185, 129, 0.1)" $color="#10b981">
          <div className="stat-info">
            <div className="label">Active Organizers</div>
            <div className="value">{stats.orgs}</div>
          </div>
          <div className="stat-icon"><FiActivity /></div>
        </StatCard>
      </StatsContainer>

      {/* 3. CONTROLS */}
      <ControlsContainer>
        <SearchInputBox>
          <FiSearch />
          <input 
            placeholder="Search by Name, Email, or UID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputBox>
        <FilterPills>
          <Pill $active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>All</Pill>
          <Pill $active={roleFilter === 'admin'} onClick={() => setRoleFilter('admin')}>Admins</Pill>
          <Pill $active={roleFilter === 'organizer'} onClick={() => setRoleFilter('organizer')}>Organizers</Pill>
          <Pill $active={roleFilter === 'user'} onClick={() => setRoleFilter('user')}>Explorers</Pill>
        </FilterPills>
      </ControlsContainer>

      {/* 4. USER LIST */}
      <ListContainer>
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Skeleton Loaders
            [...Array(5)].map((_, i) => <SkeletonRow key={`skel-${i}`} />)
          ) : currentUsers.length === 0 ? (
            // Empty State
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
              <FiInfo size={48} color="#475569" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>No Personnel Found</h3>
              <p style={{ color: '#64748b', margin: 0 }}>Try adjusting your search criteria or role filters.</p>
            </motion.div>
          ) : (
            // Actual Data Rows
            currentUsers.map((u, idx) => (
              <UserRow 
                key={u.id}
                $isMe={u.id === auth.currentUser.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                {/* Col 1: Avatar */}
                <UserAvatar>
                  {u.photoURL ? <img src={u.photoURL} alt="avatar" /> : <div className="initials">{getInitials(u.name, u.email)}</div>}
                </UserAvatar>

                {/* Col 2: Identity */}
                <UserIdentity>
                  <div className="name-block">
                    <span className="name">{u.name || "Unknown User"}</span>
                    {u.id === auth.currentUser.uid && <span className="you-tag">YOU</span>}
                  </div>
                  <div className="email">{u.email}</div>
                </UserIdentity>

                {/* Col 3: Role / Edit Role */}
                <div className="hide-mobile">
                  {editingId === u.id ? (
                    <CustomSelect value={tempRole} onChange={(e) => setTempRole(e.target.value)}>
                      <option value="user">Explorer</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Administrator</option>
                    </CustomSelect>
                  ) : (
                    <RoleBadge $role={u.role || 'user'}>
                      {u.role === 'admin' ? <FiShield /> : u.role === 'organizer' ? <FaMountain /> : <FiUser />}
                      {u.role || 'Explorer'}
                    </RoleBadge>
                  )}
                </div>

                {/* Col 4: Join Date */}
                <DetailBlock className="hide-tablet">
                  <span className="label">Joined</span>
                  <span className="value">{formatDate(u.createdAt)}</span>
                </DetailBlock>

                {/* Col 5: Actions (Desktop) */}
                <ActionCell className="hide-mobile">
                  {editingId === u.id ? (
                    <>
                      <IconButton $variant="save" onClick={() => triggerRoleUpdate(u)} title="Confirm"><FiCheck /></IconButton>
                      <IconButton $variant="cancel" onClick={() => setEditingId(null)} title="Cancel"><FiX /></IconButton>
                    </>
                  ) : (
                    <IconButton 
                      $variant="edit" 
                      onClick={() => { setEditingId(u.id); setTempRole(u.role || 'user'); }}
                      disabled={u.id === auth.currentUser.uid}
                      title="Modify Permissions"
                    >
                      <FiEdit3 />
                    </IconButton>
                  )}
                </ActionCell>

                {/* Mobile Specific Stack */}
                <div className="mobile-full">
                   {editingId === u.id ? (
                    <div style={{ flex: 1, marginRight: '10px' }}>
                      <CustomSelect value={tempRole} onChange={(e) => setTempRole(e.target.value)}>
                        <option value="user">Explorer</option><option value="organizer">Organizer</option><option value="admin">Admin</option>
                      </CustomSelect>
                    </div>
                  ) : (
                    <RoleBadge $role={u.role || 'user'}>
                      {u.role === 'admin' ? <FiShield /> : u.role === 'organizer' ? <FaMountain /> : <FiUser />} {u.role || 'Explorer'}
                    </RoleBadge>
                  )}
                  <ActionCell>
                    {editingId === u.id ? (
                      <><IconButton $variant="save" onClick={() => triggerRoleUpdate(u)}><FiCheck /></IconButton><IconButton $variant="cancel" onClick={() => setEditingId(null)}><FiX /></IconButton></>
                    ) : (
                      <IconButton $variant="edit" onClick={() => { setEditingId(u.id); setTempRole(u.role || 'user'); }} disabled={u.id === auth.currentUser.uid}><FiEdit3 /></IconButton>
                    )}
                  </ActionCell>
                </div>

              </UserRow>
            ))
          )}
        </AnimatePresence>
      </ListContainer>

      {/* 5. PAGINATION */}
      {!loading && filteredUsers.length > 0 && (
        <PaginationWrapper>
          <div className="info">
            Showing <span>{(currentPage - 1) * usersPerPage + 1}</span> to <span>{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of <span>{filteredUsers.length}</span> personnel
          </div>
          <PageControls>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><FiChevronsLeft /></button>
            <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}><FiChevronLeft /></button>
            
            {/* Dynamic Page Numbers */}
            {[...Array(totalPages)].map((_, i) => {
              // Only show 5 pages max around current page
              if (i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)) {
                return <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>;
              } else if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                return <button key={i} disabled style={{ background: 'transparent', border: 'none' }}>...</button>;
              }
              return null;
            })}

            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}><FiChevronRight /></button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><FiChevronsRight /></button>
          </PageControls>
        </PaginationWrapper>
      )}

      {/* 6. OVERLAYS & MODALS */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalCard initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="icon-danger"><FiAlertTriangle /></div>
              <h3>Elevate Privileges?</h3>
              <p>You are about to grant <strong>{confirmModal.targetRole.toUpperCase()}</strong> access to <strong>{confirmModal.targetUser?.name}</strong>. This grants them significant control over the Trovia platform. Are you sure?</p>
              <div className="btn-group">
                <button className="btn-cancel" onClick={() => { setConfirmModal({ isOpen: false }); setEditingId(null); }}>Abort</button>
                <button className="btn-confirm" onClick={() => executeRoleUpdate(confirmModal.targetUser.id, confirmModal.targetRole)}>Authorize Elevation</button>
              </div>
            </ModalCard>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.visible && (
          <ToastContainer $type={toast.type} initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}>
            {toast.type === 'error' ? <FiAlertTriangle size={20} /> : <FiCheckCircle size={20} />}
            {toast.message}
          </ToastContainer>
        )}
      </AnimatePresence>

    </PageLayout>
  );
};

export default UserAdmin;