import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, doc, getDocs, updateDoc, query, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiTrendingUp, FiStar, FiAward, FiCalendar, 
  FiShield, FiArrowLeft, FiLogOut, FiCheckCircle, FiAlertTriangle, FiRefreshCw,
  FiMapPin, FiActivity, FiLogIn, FiDatabase
} from "react-icons/fi";

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
const pulse = keyframes`0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; }`;

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

const ControlsBar = styled.div`
  display: flex; gap: 20px; margin-bottom: 24px; background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);
`;

const SearchBox = styled.div`
  position: relative; flex: 1;
  svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 1.2rem; }
  input {
    width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px 14px 48px; color: white; font-size: 1rem; font-family: 'Inter', sans-serif; transition: 0.2s;
    &:focus { outline: none; border-color: #8b5cf6; background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
    &::placeholder { color: #475569; }
  }
`;

/* ==========================================================================
   STYLED COMPONENTS - DATA GRID & TOGGLES
   ========================================================================== */
const DataGrid = styled.div`
  background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;
`;

const GridHeader = styled.div`
  display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 1fr;
  padding: 16px 24px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #64748b; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-align: center;
  .align-left { text-align: left; }
  @media (max-width: 1100px) { display: none; }
`;

const GridRow = styled(motion.div)`
  display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr 1fr;
  padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.02); align-items: center; transition: 0.2s;
  &:hover { background: rgba(255,255,255,0.03); }
  @media (max-width: 1100px) { 
    grid-template-columns: 1fr; gap: 20px; padding: 24px;
    .toggle-container { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
  }
`;

const TrekIdentity = styled.div`
  display: flex; align-items: center; gap: 16px;
  img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); }
  .info h3 { margin: 0 0 4px 0; font-size: 1.05rem; font-weight: 700; color: #f8fafc; }
  .info p { margin: 0; font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 4px; }
`;

const CyberToggle = styled.button`
  background: ${props => props.$active ? props.$color : 'rgba(0,0,0,0.3)'};
  border: 1px solid ${props => props.$active ? props.$color : 'rgba(255,255,255,0.1)'};
  width: 100%; max-width: 120px; margin: 0 auto; padding: 8px 12px; border-radius: 50px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  color: ${props => props.$active ? '#fff' : '#64748b'};
  font-size: 0.75rem; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$active ? `0 4px 15px ${props.$color}40` : 'none'};
  
  &:hover:not(:disabled) { transform: translateY(-2px); border-color: ${props => props.$color}; color: ${props => props.$active ? '#fff' : props.$color}; }
  &:disabled { opacity: 0.5; cursor: wait; transform: none; }
  svg { font-size: 1rem; }
  
  @media (max-width: 1100px) { width: auto; max-width: none; }
`;

/* ==========================================================================
   STYLED COMPONENTS - INFO & ALERTS
   ========================================================================== */
const LegendCard = styled.div`
  background: linear-gradient(145deg, #0f172a, #020617); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin-top: 40px;
  h3 { margin: 0 0 16px 0; font-size: 1.1rem; color: #f8fafc; display: flex; align-items: center; gap: 8px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .item { display: flex; flex-direction: column; gap: 4px; }
  .title { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; }
  .desc { font-size: 0.8rem; color: #64748b; line-height: 1.5; }
`;

const Toast = styled(motion.div)`
  position: fixed; bottom: 30px; right: 30px; background: ${props => props.$error ? '#ef4444' : '#10b981'}; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; gap: 12px; z-index: 2000; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  @media (max-width: 600px) { bottom: 20px; left: 20px; right: 20px; justify-content: center; }
`;

const LoginWrapper = styled.div`
  max-width: 400px; margin: 100px auto; padding: 40px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  h2 { text-align: center; margin: 0 0 30px 0; color: white; display: flex; align-items: center; justify-content: center; gap: 10px; }
  form { display: flex; flex-direction: column; gap: 20px; }
  input { width: 100%; padding: 14px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; &:focus { border-color: #8b5cf6; } }
`;

// THIS FIXES THE CRASH: Creating a properly styled component for the animated icon
const AnimatedDatabaseIcon = styled(FiDatabase)`
  animation: ${pulse} 1.5s infinite;
  font-size: 40px;
  color: #8b5cf6;
`;

const LoadingContainer = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center; height: 60vh;
  h2 { margin-top: 20px; color: #94a3b8; font-weight: 600; }
`;

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const TrekCategoryAdmin = () => {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); 
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState({ visible: false, text: '', error: false });
  const [loginError, setLoginError] = useState('');
  
  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'harsh68968@gmail.com', 'ayushmanpatel13@gmail.com'];

  // Auth Protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const isAdmin = userDoc.exists() && userDoc.data().role === 'admin';
          
          if (ADMIN_EMAILS.includes(currentUser.email) || isAdmin) {
            setUser(currentUser);
            fetchTreks();
          } else {
            await signOut(auth);
            setUser(null);
          }
        } catch (e) {
          console.error(e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const showNotification = (text, error = false) => {
    setToast({ visible: true, text, error });
    setTimeout(() => setToast({ visible: false, text: '', error: false }), 4000);
  };

  const fetchTreks = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'treks'));
      const data = snap.docs.filter(d => d.id !== "placeholder").map(d => ({
        docId: d.id, ...d.data(),
        featured: d.data().featured || false,
        recommended: d.data().recommended || false,
        popular: d.data().popular || false,
        upcoming: d.data().upcoming || false,
        trending: d.data().trending || false
      }));
      setTreks(data);
    } catch (err) { 
      showNotification(`Database sync failed: ${err.message}`, true); 
    } finally { 
      setLoading(false); 
    }
  };

  // Optimistic UI Update
  const toggleCategory = async (trekId, category) => {
    const lockKey = `${trekId}-${category}`;
    if (saving[lockKey]) return; 
    
    setSaving(prev => ({ ...prev, [lockKey]: true }));
    
    const trekIndex = treks.findIndex(t => t.docId === trekId);
    const originalTrek = treks[trekIndex];
    const newValue = !originalTrek[category];
    
    const updatedTreks = [...treks];
    updatedTreks[trekIndex] = { ...originalTrek, [category]: newValue };
    setTreks(updatedTreks);
    
    try {
      await updateDoc(doc(db, 'treks', trekId), { [category]: newValue });
      showNotification(`Matrix updated: ${newValue ? 'Enabled' : 'Disabled'} [${category.toUpperCase()}]`);
    } catch (error) {
      const revertedTreks = [...treks];
      revertedTreks[trekIndex] = originalTrek;
      setTreks(revertedTreks);
      showNotification("Protocol override failed. Rollback executed.", true);
    } finally {
      setSaving(prev => ({ ...prev, [lockKey]: false }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    if (!ADMIN_EMAILS.includes(email)) { 
      setLoginError("Unauthorized credentials."); 
      setAuthLoading(false); 
      return; 
    }
    
    try { 
      await signInWithEmailAndPassword(auth, email, password); 
    } catch (err) { 
      setLoginError("Authentication failed: " + err.message); 
      setAuthLoading(false); 
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      showNotification("Failed to disconnect.", true);
    }
  };

  const filteredTreks = treks.filter(t => !searchQuery || t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.location?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render State 1: Verifying Auth Token
  if (authLoading) {
    return (
      <AdminLayout>
        <GlobalStyle />
        <LoadingContainer>
          <AnimatedDatabaseIcon />
          <h2>Verifying Clearance...</h2>
        </LoadingContainer>
      </AdminLayout>
    );
  }

  // Render State 2: Login Fallback
  if (!user) {
    return (
      <LoginWrapper>
        <GlobalStyle />
        <h2><FiShield color="#8b5cf6" /> Admin Login</h2>
        {loginError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{loginError}</div>}
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Authorized Email" required />
          <input name="password" type="password" placeholder="Passphrase" required />
          <ActionBtn $primary type="submit" style={{width: '100%', padding: '14px', justifyContent: 'center'}}>Access Terminal</ActionBtn>
        </form>
      </LoginWrapper>
    );
  }

  // Render State 3: The Secure Dashboard
  return (
    <AdminLayout>
      <GlobalStyle />
      
      <Header>
        <div>
          <SecurityBadge><FiShield /> System Secured</SecurityBadge>
          <h1>Category Matrix</h1>
          <p>Toggle classification tags for immediate deployment to the frontend.</p>
        </div>
        <ButtonGroup>
          <ActionBtn onClick={() => navigate('/admin')}><FiArrowLeft /> Dashboard</ActionBtn>
          <ActionBtn onClick={fetchTreks}><FiRefreshCw /> Sync Status</ActionBtn>
          <ActionBtn $primary onClick={handleLogout}><FiLogOut /> Disconnect</ActionBtn>
        </ButtonGroup>
      </Header>
      
      <ControlsBar>
        <SearchBox>
          <FiSearch />
          <input type="text" placeholder="Scan assets by title or region..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </SearchBox>
      </ControlsBar>

      <DataGrid>
        <GridHeader>
          <div className="align-left">Trek Identity</div><div>Featured</div><div>Recommended</div><div>Popular</div><div>Upcoming</div><div>Trending</div>
        </GridHeader>
        
        {loading ? <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Scanning database...</p> : filteredTreks.length === 0 ? <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>No assets match your search criteria.</p> : (
          <AnimatePresence>
            {filteredTreks.map((trek, idx) => (
              <GridRow key={trek.docId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                
                <TrekIdentity>
                  <img src={trek.image || `https://ui-avatars.com/api/?name=${trek.title}`} alt="" />
                  <div className="info">
                    <h3>{trek.title}</h3>
                    <p><FiMapPin /> {trek.location} • {trek.difficulty}</p>
                  </div>
                </TrekIdentity>

                <div className="toggle-container">
                  <CyberToggle $color="#eab308" $active={trek.featured} disabled={saving[`${trek.docId}-featured`]} onClick={() => toggleCategory(trek.docId, 'featured')}>
                    <FiAward /> Featured
                  </CyberToggle>
                  <CyberToggle $color="#10b981" $active={trek.recommended} disabled={saving[`${trek.docId}-recommended`]} onClick={() => toggleCategory(trek.docId, 'recommended')}>
                    <FiStar /> Recommend
                  </CyberToggle>
                  <CyberToggle $color="#3b82f6" $active={trek.popular} disabled={saving[`${trek.docId}-popular`]} onClick={() => toggleCategory(trek.docId, 'popular')}>
                    <FiTrendingUp /> Popular
                  </CyberToggle>
                  <CyberToggle $color="#8b5cf6" $active={trek.upcoming} disabled={saving[`${trek.docId}-upcoming`]} onClick={() => toggleCategory(trek.docId, 'upcoming')}>
                    <FiCalendar /> Upcoming
                  </CyberToggle>
                  <CyberToggle $color="#f43f5e" $active={trek.trending} disabled={saving[`${trek.docId}-trending`]} onClick={() => toggleCategory(trek.docId, 'trending')}>
                    <FiActivity /> Trending
                  </CyberToggle>
                </div>

              </GridRow>
            ))}
          </AnimatePresence>
        )}
      </DataGrid>
      
      <LegendCard>
        <h3><FiShield color="#8b5cf6" /> Matrix Definitions</h3>
        <div className="grid">
          <div className="item"><div className="title" style={{color: '#eab308'}}><FiAward /> Featured</div><div className="desc">Hero section priority. High visibility placement.</div></div>
          <div className="item"><div className="title" style={{color: '#10b981'}}><FiStar /> Recommended</div><div className="desc">Trovia Staff picks based on exceptional safety and reviews.</div></div>
          <div className="item"><div className="title" style={{color: '#3b82f6'}}><FiTrendingUp /> Popular</div><div className="desc">Algorithmically proven high-booking volume assets.</div></div>
          <div className="item"><div className="title" style={{color: '#8b5cf6'}}><FiCalendar /> Upcoming</div><div className="desc">Pre-season marketing for limited capacity deployments.</div></div>
          <div className="item"><div className="title" style={{color: '#f43f5e'}}><FiActivity /> Trending</div><div className="desc">Viral assets experiencing rapid social engagement spikes.</div></div>
        </div>
      </LegendCard>

      <AnimatePresence>
        {toast.visible && (
          <Toast $error={toast.error} initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            {toast.error ? <FiAlertTriangle size={20} /> : <FiCheckCircle size={20} />} {toast.text}
          </Toast>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default TrekCategoryAdmin;