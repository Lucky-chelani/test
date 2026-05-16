import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from "firebase/firestore";
import { initializeTreks } from "../utils/initializeTreks";
import { 
  FiTrash2, FiEdit3, FiSave, FiX, FiPlus, FiLogIn, FiUploadCloud, 
  FiImage, FiCalendar, FiMapPin, FiRefreshCw, FiAlertTriangle, 
  FiCheckCircle, FiShield 
} from 'react-icons/fi';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { uploadImage, deleteImage, getTrekImagePath, getValidImageUrl, uploadMultipleImages } from "../utils/images";
import { motion, AnimatePresence } from 'framer-motion';

// External Components
import MultipleImagesUploader from './MultipleImagesUploader';
import ItineraryManager from './ItineraryManager';
import MonthAvailability from './MonthAvailability';
import DateAvailabilitySelector from './DateAvailabilitySelector';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   GLOBAL STYLES & ANIMATIONS
   ========================================================================== */
const GlobalStyle = createGlobalStyle`
  body { background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
`;

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

/* ==========================================================================
   STYLED COMPONENTS - LAYOUT
   ========================================================================== */
const AdminLayout = styled.div`
  max-width: 1280px; margin: 40px auto; padding: 0 24px;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;
  border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 24px;
  
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 24px; }
  
  h1 { font-size: 2.5rem; font-weight: 900; margin: 12px 0 6px 0; background: linear-gradient(135deg, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
  p { color: #64748b; margin: 0; font-weight: 500; font-size: 1.05rem; }
`;

const SecurityBadge = styled.div`
  display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2); padding: 6px 14px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 0 15px rgba(16,185,129,0.05);
`;

const ButtonGroup = styled.div`
  display: flex; gap: 12px; flex-wrap: wrap;
  @media (max-width: 600px) { width: 100%; button { flex: 1; justify-content: center; } }
`;

const ActionBtn = styled.button`
  background: ${props => props.$primary ? '#ffffff' : 'rgba(255,255,255,0.03)'};
  color: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
  border: 1px solid ${props => props.$primary ? '#ffffff' : 'rgba(255,255,255,0.1)'};
  padding: 12px 20px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap;
  
  &:hover:not(:disabled) { 
    transform: translateY(-2px); 
    background: ${props => props.$primary ? '#f1f5f9' : 'rgba(255,255,255,0.08)'}; 
    box-shadow: ${props => props.$primary ? '0 10px 25px rgba(255,255,255,0.15)' : '0 10px 20px rgba(0,0,0,0.2)'}; 
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

/* ==========================================================================
   STYLED COMPONENTS - DATA GRID
   ========================================================================== */
const DataGrid = styled.div`
  background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
`;

const GridHeader = styled.div`
  display: grid; grid-template-columns: 80px 2fr 1fr 1fr 1fr 100px;
  padding: 18px 24px; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  @media (max-width: 900px) { display: none; }
`;

const GridRow = styled(motion.div)`
  display: grid; grid-template-columns: 80px 2fr 1fr 1fr 1fr 100px;
  padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.03); align-items: center; transition: background 0.2s ease;
  &:hover { background: rgba(255,255,255,0.04); }
  @media (max-width: 900px) { 
    grid-template-columns: 80px 1fr; gap: 15px; padding: 20px;
    .desktop-only { display: none; }
    .action-cell { grid-column: 1 / -1; justify-content: flex-start; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
  }
`;

const ImageThumbnail = styled.div`
  width: 64px; height: 64px; border-radius: 12px; background-size: cover; background-position: center; background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const TitleCell = styled.div`
  h3 { margin: 0 0 6px 0; font-size: 1.1rem; color: #f8fafc; font-weight: 700; }
  span { font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
`;

const Badge = styled.span`
  padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
  background: ${props => props.$level === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : props.$level === 'Moderate' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$level === 'Easy' ? '#10b981' : props.$level === 'Moderate' ? '#f59e0b' : '#ef4444'};
  border: 1px solid ${props => props.$level === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : props.$level === 'Moderate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const IconButton = styled.button`
  width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s;
  ${props => props.$variant === 'edit' && `background: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.05); &:hover { background: rgba(255,255,255,0.1); color: white; border-color: rgba(255,255,255,0.1); }`}
  ${props => props.$variant === 'delete' && `background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.1); &:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.2); }`}
`;

/* ==========================================================================
   STYLED COMPONENTS - MODAL FORM & TOASTS
   ========================================================================== */
const FormOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(12px);
  z-index: 1000; overflow-y: auto; padding: 40px 20px; display: flex; justify-content: center;
`;

const FormPanel = styled(motion.div)`
  background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; max-width: 900px;
  padding: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); height: fit-content;
  @media (max-width: 768px) { padding: 24px; }
`;

const Grid2Col = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 16px; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; margin-bottom: 8px; color: #cbd5e1; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  input, select, textarea { 
    width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-family: 'Inter', sans-serif; transition: all 0.2s;
    font-size: 0.95rem;
    &:focus { outline: none; border-color: #8b5cf6; background: rgba(139,92,246,0.05); box-shadow: 0 0 0 4px rgba(139,92,246,0.15); }
    /* PREVENT iOS AUTO-ZOOM */
    @media (max-width: 768px) { font-size: 16px; }
  }
  textarea { min-height: 120px; resize: vertical; }
  select option { background: #0f172a; color: white; }
`;

const ModuleContainer = styled.div`
  background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; margin-bottom: 24px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
  .module-title { display: flex; align-items: center; gap: 8px; color: #f8fafc; font-weight: 700; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; }
`;

const Toast = styled(motion.div)`
  position: fixed; bottom: 30px; right: 30px; background: ${props => props.$error ? '#ef4444' : '#10b981'}; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; gap: 12px; z-index: 2000; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  @media (max-width: 600px) { bottom: 20px; left: 20px; right: 20px; justify-content: center; }
`;

/* ==========================================================================
   LOGIN COMPONENT
   ========================================================================== */
const LoginWrapper = styled.div`
  max-width: 400px; margin: 100px auto; padding: 40px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  h2 { text-align: center; margin-bottom: 30px; color: white; }
`;

const AdminLogin = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return (
    <LoginWrapper>
      <GlobalStyle />
      <h2><FiShield style={{color: '#8b5cf6', marginRight: '10px'}} /> Secure Authentication</h2>
      {error && <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
        <FormGroup><label>Authorized Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></FormGroup>
        <FormGroup><label>Passphrase</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></FormGroup>
        <ActionBtn $primary type="submit" disabled={loading} style={{width: '100%', padding: '14px', marginTop: '10px'}}>{loading ? 'Authenticating...' : <><FiLogIn /> Access Console</>}</ActionBtn>
      </form>
    </LoginWrapper>
  );
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const TrekAdmin = () => {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrek, setEditingTrek] = useState(null);
  const [toast, setToast] = useState({ visible: false, text: '', error: false });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [organizers, setOrganizers] = useState([]);
  
  const [formData, setFormData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'harsh68968@gmail.com', 'ayushmanpatel13@gmail.com'];

  // Auth & Fast Initialization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid)).catch(() => null);
          const isAuthorized = ADMIN_EMAILS.includes(currentUser.email) || (userDoc && userDoc.exists() && userDoc.data().role === 'admin');

          if (isAuthorized) {
            setUser(currentUser);
            fetchAllData(); 
          } else {
            setUser(null);
            setLoginError("Access denied: You do not have 'admin' clearance.");
          }
        } catch (err) {
          setLoginError("Verification failed. Please try again.");
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

  const handleLogin = async (email, password) => {
    try {
      setAuthLoading(true); setLoginError("");
      if (!ADMIN_EMAILS.includes(email)) { setLoginError("Unrecognized administrator email."); setAuthLoading(false); return; }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) { setLoginError(error.message); setAuthLoading(false); }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [treksRes, orgsRes] = await Promise.allSettled([
        getDocs(collection(db, "treks")),
        getDocs(query(collection(db, "users"), where("role", "in", ["organizer", "admin"])))
      ]);

      if (treksRes.status === 'fulfilled') {
        setTreks(treksRes.value.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
      } else {
        showNotification("Failed to load trek database.", true);
      }

      if (orgsRes.status === 'fulfilled') {
        setOrganizers(orgsRes.value.docs.map(d => ({ 
          id: d.id, 
          name: d.data().name, 
          org: d.data().organizationDetails?.name || d.data().name, 
          role: d.data().role 
        })));
      }
    } catch (err) {
      showNotification(`Sync Error: ${err.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '', title: '', country: 'India', location: '', difficulty: 'Easy', days: 1, price: '', season: '', rating: 5.0, reviews: 0,
      image: '', imageUrls: [], coverIndex: 0, description: '', detailedDescription: '', itinerary: [], availableMonths: [], availableDates: [], organizerId: '', organizerName: '',
      highlights: '', included: '', excluded: '' 
    });
    setEditingTrek(null); setImageFile(null); setUploadProgress(0); setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleAddNewClick = () => { resetForm(); setShowForm(true); };
  
  const handleEditTrek = (trek) => {
    setFormData({
      ...trek,
      imageUrls: Array.isArray(trek.imageUrls) ? trek.imageUrls : [],
      itinerary: Array.isArray(trek.itinerary) ? trek.itinerary : [],
      availableMonths: Array.isArray(trek.availableMonths) ? trek.availableMonths : [],
      availableDates: Array.isArray(trek.availableDates) ? trek.availableDates : [],
      highlights: Array.isArray(trek.highlights) ? trek.highlights.join('\n') : (trek.highlights || ''),
      included: Array.isArray(trek.included) ? trek.included.join('\n') : (trek.included || ''),
      excluded: Array.isArray(trek.excluded) ? trek.excluded.join('\n') : (trek.excluded || '')
    });
    setEditingTrek(trek.docId); setShowForm(true);
  };

  // Safe input mapping
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Strict Sanitization & Two-Phase Commit
  const handleSafeSave = async (e) => {
    e.preventDefault(); 

    if (!formData.title?.trim() || !formData.organizerId) {
      return showNotification("Title and Assigned Organizer are strictly required.", true);
    }

    setLoading(true);
    const trekId = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    let newPrimaryImageUrl = null;
    let newGalleryUrls = [];
    let finalImageUrls = Array.isArray(formData.imageUrls) ? [...formData.imageUrls] : [];

    try {
      if (imageFile) {
        setIsUploading(true);
        newPrimaryImageUrl = await uploadImage(imageFile, getTrekImagePath(trekId), setUploadProgress);
      }

      const newFiles = finalImageUrls.filter(img => img instanceof File || (img && img.file instanceof File)).map(img => img instanceof File ? img : img.file);
      
      if (newFiles.length > 0) {
        setIsUploading(true);
        newGalleryUrls = await uploadMultipleImages(newFiles, trekId, setUploadProgress);
        finalImageUrls = finalImageUrls.map(img => {
          if (typeof img === 'string') return img;
          const idx = newFiles.findIndex(f => f === (img instanceof File ? img : img.file));
          return idx >= 0 ? newGalleryUrls[idx] : img;
        });
      }

      // Safe Array Parsing Function
      const parseTextToArray = (text) => {
        if (!text) return [];
        return text.split('\n').map(i => i.trim()).filter(i => i !== '');
      };

      const safeData = {
        ...formData,
        id: trekId,
        days: Math.max(1, parseInt(formData.days, 10) || 1), 
        price: Math.max(0, parseFloat(formData.price) || 0), 
        rating: Math.min(5, Math.max(0, parseFloat(formData.rating) || 5.0)), 
        reviews: Math.max(0, parseInt(formData.reviews, 10) || 0),
        image: newPrimaryImageUrl || formData.image || '',
        imageUrls: finalImageUrls,
        coverIndex: formData.coverIndex !== undefined ? formData.coverIndex : 0, 
        highlights: parseTextToArray(formData.highlights),
        included: parseTextToArray(formData.included),
        excluded: parseTextToArray(formData.excluded),
        updatedAt: new Date().toISOString()
      };

      if (editingTrek) {
        await updateDoc(doc(db, "treks", editingTrek), safeData);
        showNotification("Trek parameters updated successfully.");
      } else {
        await addDoc(collection(db, "treks"), safeData);
        showNotification("New trek deployed to database.");
      }

      fetchAllData();
      resetForm();
      setShowForm(false);

    } catch (error) {
      console.error("Database save failed. Rolling back images...");
      if (newPrimaryImageUrl) await deleteImage(newPrimaryImageUrl).catch(e => console.error(e));
      if (newGalleryUrls.length > 0) await Promise.all(newGalleryUrls.map(url => deleteImage(url).catch(e => console.error(e))));
      
      showNotification(`Database error: ${error.message}`, true);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };
  
  const executeDelete = async (docId) => {
    if (window.confirm("WARNING: This will permanently delete this trek from the database. Proceed?")) {
      try { setLoading(true); await deleteDoc(doc(db, "treks", docId)); fetchAllData(); showNotification("Trek record erased."); } 
      catch (err) { showNotification(`Deletion failed: ${err.message}`, true); } 
      finally { setLoading(false); }
    }
  };

  const handleInitSamples = async () => {
    try { setLoading(true); const res = await initializeTreks(user); if (res.success) { showNotification("Sample treks deployed."); fetchAllData(); } else { showNotification(res.message, true); } } 
    catch (err) { showNotification(err.message, true); } finally { setLoading(false); }
  };

  if (authLoading) return <AdminLayout><h2>Initializing Secure Console...</h2></AdminLayout>;
  if (!user) return <AdminLogin onLogin={handleLogin} loading={authLoading} error={loginError} />;
  
  return (
    <AdminLayout>
      <GlobalStyle />
      
      <Header>
        <div>
          <SecurityBadge><FiShield /> System Secured</SecurityBadge>
          <h1>Trek Operations</h1>
          <p>Database Management & Protocol Deployment</p>
        </div>
        <ButtonGroup>
          <ActionBtn onClick={handleInitSamples}><FiRefreshCw /> Init Samples</ActionBtn>
          <ActionBtn onClick={() => navigate('/admin/trek-categories')}><FiMapPin /> Categories</ActionBtn>
          <ActionBtn onClick={() => signOut(auth)}><FiLogIn style={{transform: 'rotate(180deg)'}} /> Disconnect</ActionBtn>
          <ActionBtn $primary onClick={handleAddNewClick}><FiPlus /> Deploy Trek</ActionBtn>
        </ButtonGroup>
      </Header>
      
      <DataGrid>
        <GridHeader>
          <div>Asset</div><div>Trek Identity</div><div>Difficulty</div><div>Duration</div><div>Base Price</div><div>Actions</div>
        </GridHeader>
        
        {loading ? <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Syncing with database...</p> : treks.length === 0 ? <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>No records found. Deploy a new trek to begin.</p> : (
          treks.map((trek) => (
            <GridRow key={trek.docId}>
              <div>
                <ImageThumbnail style={{ backgroundImage: `url(${getValidImageUrl(trek.image)})` }} /></div>
                <TitleCell>
                  <h3>{trek.title}</h3>
                  <span><FiMapPin size={12} /> {trek.location}</span>
                </TitleCell>
                <div className="desktop-only"><Badge $level={trek.difficulty}>{trek.difficulty}</Badge></div>
                <div className="desktop-only" style={{color: '#94a3b8'}}>{trek.days} Days</div>
                <div className="desktop-only" style={{fontFamily: 'Space Mono', color: '#cbd5e1', fontWeight: 'bold'}}>₹{trek.price}</div>
                <div className="action-cell" style={{ display: 'flex', gap: '8px' }}>
                  <IconButton $variant="edit" onClick={() => handleEditTrek(trek)} title="Modify Data"><FiEdit3 /></IconButton>
                  <IconButton $variant="delete" onClick={() => executeDelete(trek.docId)} title="Erase Record"><FiTrash2 /></IconButton>
              </div>
            </GridRow>
          ))
        )}
      </DataGrid>
      
      <AnimatePresence>
        {showForm && (
          <FormOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FormPanel initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '35px', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>{editingTrek ? 'Modify Trek Parameters' : 'Initialize New Trek'}</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '1.5rem', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1'; }}><FiX /></button>
              </div>

              <form onSubmit={handleSafeSave}>
                <Grid2Col>
                  <FormGroup><label>Trek Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Everest Base Camp" /></FormGroup>
                  <FormGroup><label>URL Slug (Optional)</label><input type="text" name="id" value={formData.id} onChange={handleInputChange} placeholder="auto-generated-from-title" /></FormGroup>
                </Grid2Col>
                
                <Grid2Col>
                  <FormGroup>
                    <label>Assigned Organizer *</label>
                    <select name="organizerId" value={formData.organizerId || ''} onChange={(e) => {
                      const org = organizers.find(o => o.id === e.target.value);
                      setFormData(prev => ({ ...prev, organizerId: e.target.value, organizerName: org ? org.org : '' }));
                    }} required>
                      <option value="">Select Protocol Owner...</option>
                      {organizers.map(org => <option key={org.id} value={org.id}>{org.org} {org.role === 'admin' ? '(Admin)' : ''}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup><label>Country</label><input type="text" name="country" value={formData.country} onChange={handleInputChange} required /></FormGroup>
                </Grid2Col>
                
                <Grid2Col>
                  <FormGroup><label>Location Region</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required /></FormGroup>
                  <FormGroup>
                    <label>Difficulty Rating</label>
                    <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} required>
                      <option value="Easy">Easy (Green)</option><option value="Moderate">Moderate (Amber)</option><option value="Difficult">Difficult (Red)</option><option value="Extreme">Extreme (Black)</option>
                    </select>
                  </FormGroup>
                </Grid2Col>
                
                <Grid2Col>
                  <FormGroup><label>Duration (Days)</label><input type="number" name="days" min="1" value={formData.days} onChange={handleInputChange} required /></FormGroup>
                  <FormGroup><label>Base Price (₹)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g. 3850" /></FormGroup>
                </Grid2Col>
                
                <Grid2Col>
                  <FormGroup><label>Best Season</label><input type="text" name="season" value={formData.season} onChange={handleInputChange} placeholder="e.g. Jun-Aug" /></FormGroup>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    <FormGroup><label>Rating (0-5)</label><input type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={handleInputChange} /></FormGroup>
                    <FormGroup><label>Reviews</label><input type="number" name="reviews" min="0" value={formData.reviews} onChange={handleInputChange} /></FormGroup>
                  </div>
                </Grid2Col>

                <FormGroup>
                  <label>Primary Database Image</label>
                  {/* BEAUTIFUL DRAG AND DROP PRIMARY UPLOADER */}
                  <div 
                    onClick={() => { if(fileInputRef.current) fileInputRef.current.click(); }}
                    style={{ 
                      display: 'flex', gap: '24px', alignItems: 'center', background: 'rgba(0,0,0,0.25)', 
                      padding: '24px', borderRadius: '20px', border: '2px dashed rgba(255,255,255,0.1)', 
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.25)'; }}
                  >
                    <ImageThumbnail style={{ width: '120px', height: '120px', position: 'relative', backgroundImage: formData.image || imageFile ? `url(${imageFile ? URL.createObjectURL(imageFile) : getValidImageUrl(formData.image)})` : 'none', borderRadius: '16px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                      {!formData.image && !imageFile && <FiImage size={40} style={{margin: '40px', color: '#64748b'}} />}
                      
                      {(formData.image || imageFile) && (
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setImageFile(null); setFormData(p => ({...p, image: ''})); }}
                          style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.4)', transition: '0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <FiX size={18} />
                        </button>
                      )}
                    </ImageThumbnail>
                    <div style={{flex: 1}}>
                      <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontSize: '1.1rem' }}>
                        {isUploading ? 'Uploading to Server...' : 'Click to select Primary Image'}
                      </h3>
                      <p style={{margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500}}>Max 10MB limit. High resolution JPG or PNG recommended.</p>
                      
                      {/* Hidden Input managed safely by the div click handler */}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        onChange={(e) => {
                           if(e.target.files[0] && e.target.files[0].size <= 10*1024*1024) setImageFile(e.target.files[0]);
                           else showNotification("File exceeds 10MB limit.", true);
                        }} 
                      />
                      
                      {isUploading && (
                        <div style={{width: '100%', height: '6px', background: '#1e293b', marginTop: '16px', borderRadius: '6px', overflow: 'hidden'}}>
                          <div style={{width: `${uploadProgress}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease'}}/>
                        </div>
                      )}
                    </div>
                  </div>
                </FormGroup>
                
                <FormGroup><label>Brief Summary</label><textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="A short, catchy overview of the trek..." /></FormGroup>
                <FormGroup><label>Detailed Description</label><textarea name="detailedDescription" value={formData.detailedDescription} onChange={handleInputChange} style={{minHeight: '200px'}} placeholder="Full HTML or Markdown supported description..." /></FormGroup>

                <ModuleContainer>
                  <div className="module-title">Key Information (Enter 1 item per line)</div>
                  <Grid2Col>
                    <FormGroup>
                      <label>Highlights</label>
                      <textarea name="highlights" value={formData.highlights || ''} onChange={handleInputChange} placeholder="Breathtaking mountain views&#10;Expert local guides&#10;Comfortable basecamps..." style={{minHeight: '120px'}} />
                    </FormGroup>
                    <FormGroup>
                      <label>What's Included</label>
                      <textarea name="included" value={formData.included || ''} onChange={handleInputChange} placeholder="All meals (Breakfast, Lunch, Dinner)&#10;Tents and sleeping bags&#10;Permits..." style={{minHeight: '120px'}} />
                    </FormGroup>
                  </Grid2Col>
                  <FormGroup style={{marginBottom: 0}}>
                    <label>What's Excluded</label>
                    <textarea name="excluded" value={formData.excluded || ''} onChange={handleInputChange} placeholder="Personal trekking gear&#10;Travel insurance&#10;Flights..." style={{minHeight: '80px'}} />
                  </FormGroup>
                </ModuleContainer>
                
                <ModuleContainer>
                  <div className="module-title"><FiImage /> Digital Asset Gallery</div>
                  {/* 10MB LIMIT APPLIED TO GALLERY */}
                  <MultipleImagesUploader onImagesChange={(imgs, idx) => setFormData(p => ({...p, imageUrls: imgs, coverIndex: idx}))} initialImages={formData.imageUrls} initialCoverIndex={formData.coverIndex} maxFiles={10} maxSize={10} />
                </ModuleContainer>
                
                <Grid2Col>
                  <ModuleContainer>
                    <div className="module-title"><FiCalendar /> Month Availability</div>
                    <MonthAvailability availableMonths={formData.availableMonths} onChange={m => setFormData(p => ({...p, availableMonths: m}))} />
                  </ModuleContainer>
                  <ModuleContainer>
                    <div className="module-title"><FiCalendar /> Specific Dates</div>
                    <DateAvailabilitySelector selectedDates={formData.availableDates} onChange={d => setFormData(p => ({...p, availableDates: d}))} label="Active Deployment Dates" minDate={new Date().toISOString().split('T')[0]} maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]} />
                  </ModuleContainer>
                </Grid2Col>
                
                <ModuleContainer style={{marginBottom: '0'}}>
                  <div className="module-title"><FiMapPin /> Itinerary Mapping</div>
                  <ItineraryManager itinerary={formData.itinerary} onChange={i => setFormData(p => ({...p, itinerary: i}))} />
                </ModuleContainer>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
                  <ActionBtn type="button" onClick={() => setShowForm(false)}>Abort Deployment</ActionBtn>
                  <ActionBtn type="submit" $primary disabled={loading || isUploading}>
                    <FiSave /> {loading || isUploading ? 'Processing...' : (editingTrek ? 'Update Trek Data' : 'Commit to Database')}
                  </ActionBtn>
                </div>
              </form>
            </FormPanel>
          </FormOverlay>
        )}
      </AnimatePresence>

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

export default TrekAdmin;