import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { db, auth } from "../firebase";
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy
} from "firebase/firestore";
import { 
  FiTrash2, FiCheckCircle, FiXCircle, FiLogIn, FiLogOut, FiPlus, 
  FiRefreshCw, FiShield, FiUsers, FiAward, FiX
} from 'react-icons/fi';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from 'framer-motion';
import CreateCommunityModal from "./CreateCommunityModal";

/* ==========================================================================
   GLOBAL STYLES & ANIMATIONS
   ========================================================================== */
const GlobalStyle = createGlobalStyle`
  body { background: #02040a; color: #e2e8f0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
`;

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); }`;

/* ==========================================================================
   STYLED COMPONENTS - LAYOUT
   ========================================================================== */
const AdminLayout = styled.div`
  max-width: 1280px; margin: 40px auto; padding: 0 24px 100px 24px;
  animation: ${fadeInUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px;
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 20px; }
  
  h1 { font-size: 2.5rem; font-weight: 900; margin: 10px 0 5px 0; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  p { color: #64748b; margin: 0; font-weight: 500; font-size: 1.05rem; }
`;

const SecurityBadge = styled.div`
  display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2); padding: 6px 14px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;
`;

const ButtonGroup = styled.div`
  display: flex; gap: 12px; flex-wrap: wrap;
  @media (max-width: 600px) { width: 100%; button { flex: 1; justify-content: center; } }
`;

const ActionBtn = styled.button`
  background: ${props => props.$primary ? '#ffffff' : 'rgba(255, 255, 255, 0.03)'};
  color: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
  border: 1px solid ${props => props.$primary ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'};
  padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; white-space: nowrap;
  
  &:hover:not(:disabled) { transform: translateY(-2px); background: ${props => props.$primary ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)'}; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

/* ==========================================================================
   STYLED COMPONENTS - DATA GRID
   ========================================================================== */
const DataGrid = styled.div`
  background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;
`;

const GridHeader = styled.div`
  display: grid; grid-template-columns: 50px 3fr 1fr 1.5fr 100px;
  padding: 16px 24px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #64748b; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
  .center { text-align: center; }
  @media (max-width: 900px) { display: none; }
`;

const GridRow = styled(motion.div)`
  display: grid; grid-template-columns: 50px 3fr 1fr 1.5fr 100px;
  padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.02); align-items: center; transition: 0.2s;
  &:hover { background: rgba(255,255,255,0.03); }
  
  .index { color: #475569; font-weight: 800; font-family: 'Space Mono', monospace; }
  .title { font-size: 1.05rem; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 10px; }
  .members { color: #94a3b8; font-family: 'Space Mono', monospace; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
  .center { display: flex; justify-content: center; align-items: center; }
  
  @media (max-width: 900px) { 
    grid-template-columns: 1fr; gap: 15px; padding: 24px;
    .index { display: none; }
    .desktop-hide { display: block; font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
    .center { justify-content: flex-start; }
    .action-cell { display: flex; gap: 10px; margin-top: 10px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
  }
`;

const CyberToggle = styled.button`
  background: ${props => props.$active ? '#eab308' : 'rgba(0,0,0,0.3)'};
  border: 1px solid ${props => props.$active ? '#eab308' : 'rgba(255,255,255,0.1)'};
  width: 100%; max-width: 140px; padding: 8px 12px; border-radius: 50px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  color: ${props => props.$active ? '#000' : '#64748b'};
  font-size: 0.75rem; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
  box-shadow: ${props => props.$active ? `0 4px 15px rgba(234, 179, 8, 0.4)` : 'none'};
  
  &:hover:not(:disabled) { transform: translateY(-2px); border-color: #eab308; color: ${props => props.$active ? '#000' : '#eab308'}; }
  &:active:not(:disabled) { transform: scale(0.95); }
  &:disabled { opacity: 0.5; cursor: wait; transform: none; }
`;

const IconButton = styled.button`
  width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s;
  background: rgba(239, 68, 68, 0.1); color: #ef4444; 
  &:hover { background: rgba(239, 68, 68, 0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ==========================================================================
   STYLED COMPONENTS - ALERTS & LOGIN
   ========================================================================== */
const AlertBox = styled(motion.div)`
  background: ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.$error ? '#ef4444' : '#10b981'};
  border: 1px solid ${props => props.$error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
  padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;
`;

const LoginWrapper = styled.div`
  max-width: 400px; margin: 100px auto; padding: 40px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  h2 { text-align: center; margin: 0 0 30px 0; color: white; display: flex; align-items: center; justify-content: center; gap: 10px; }
  form { display: flex; flex-direction: column; gap: 20px; }
  input { width: 100%; padding: 14px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; &:focus { border-color: #8b5cf6; } }
`;

/* ==========================================================================
   MAIN COMPONENT (USER'S EXACT LOGIC PRESERVED)
   ========================================================================== */
const CommunityAdmin = () => {
  // --- USER'S EXACT STATE ---
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

  // --- USER'S EXACT USE EFFECT ---
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

  // --- USER'S EXACT FETCH FUNCTION ---
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
  
  // --- USER'S EXACT LOGIN FUNCTION ---
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
  
  // --- USER'S EXACT LOGOUT FUNCTION ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  // --- USER'S EXACT TOGGLE FUNCTION ---
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
  
  // --- USER'S EXACT DELETE FUNCTION ---
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
  
  // --- USER'S EXACT CREATE FUNCTION ---
  const handleCommunityCreated = (newCommunity) => {
    // Add the new community to the state
    setCommunities([newCommunity, ...communities]);
    
    // Show success message
    setSuccessMessage(`Community "${newCommunity.name}" was created successfully`);
    setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
  };
  
  // --- RENDER LOGIN (Old Logic, New UI) ---
  if (!user) {
    return (
      <LoginWrapper>
        <GlobalStyle />
        <h2><FiShield color="#8b5cf6" /> Admin Login</h2>
        {loginError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label style={{display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold'}}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 'bold'}}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <ActionBtn $primary type="submit" disabled={loading} style={{width: '100%', padding: '14px', justifyContent: 'center'}}>
            <FiLogIn /> {loading ? "Logging in..." : "Login"}
          </ActionBtn>
        </form>
      </LoginWrapper>
    );
  }
  
  // --- RENDER DASHBOARD (Old Logic, New UI) ---
  return (
    <AdminLayout>
      <GlobalStyle />
      
      <Header>
        <div>
          <SecurityBadge><FiShield /> System Secured</SecurityBadge>
          <h1>Community Admin</h1>
          <p>Manage public chatrooms and communication hubs.</p>
        </div>
        <ButtonGroup>
          <ActionBtn onClick={() => setShowCreateModal(true)} $primary>
            <FiPlus /> Deploy Hub
          </ActionBtn>
          <ActionBtn onClick={fetchCommunities} disabled={loading}>
            <FiRefreshCw /> Sync Data
          </ActionBtn>
          <ActionBtn onClick={handleLogout}>
            <FiLogOut /> Disconnect
          </ActionBtn>
        </ButtonGroup>
      </Header>
      
      <AnimatePresence>
        {error && (
          <AlertBox $error initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><FiXCircle size={20} /> {error}</div>
            <FiX style={{cursor: 'pointer'}} onClick={() => setError(null)} />
          </AlertBox>
        )}
        
        {successMessage && (
          <AlertBox initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><FiCheckCircle size={20} /> {successMessage}</div>
            <FiX style={{cursor: 'pointer'}} onClick={() => setSuccessMessage("")} />
          </AlertBox>
        )}
      </AnimatePresence>
      
      <CreateCommunityModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCommunityCreated}
      />
      
      <DataGrid>
        <GridHeader>
          <div className="index">#</div>
          <div>Community Name</div>
          <div>Members</div>
          <div className="center">Featured Status</div>
          <div className="center">Actions</div>
        </GridHeader>
        
        {loading ? (
          <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Scanning database...</p>
        ) : communities.length === 0 ? (
          <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>No communities established.</p>
        ) : (
          communities.map((community, index) => (
            <GridRow key={community.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              
              <div className="index">{index + 1}</div>
              
              <div className="title"><FiUsers color="#8b5cf6" /> {community.name}</div>
              
              <div className="members">
                <div className="desktop-hide" style={{display: 'none'}}>Members: </div>
                {community.members?.length || 0} Active
              </div>
              
              <div className="center">
                <CyberToggle 
                  $active={community.featured} 
                  disabled={savingId === community.docId} 
                  onClick={() => toggleFeaturedStatus(community)} // YOUR EXACT FUNCTION CALL
                >
                  <FiAward /> {community.featured ? 'Featured' : 'Standard'}
                </CyberToggle>
              </div>
              
              <div className="center action-cell">
                <IconButton 
                  disabled={savingId === community.docId} 
                  onClick={() => deleteCommunity(community.docId)} // YOUR EXACT FUNCTION CALL
                  title="Erase Community"
                >
                  <FiTrash2 />
                </IconButton>
              </div>

            </GridRow>
          ))
        )}
      </DataGrid>
    </AdminLayout>
  );
};

export default CommunityAdmin;