import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where, getDoc } from "firebase/firestore";
import { initializeTreks } from "../utils/initializeTreks";
import { 
  FiTrash2, FiEdit3, FiSave, FiX, FiPlus, FiLogIn, FiUploadCloud, 
  FiImage, FiCalendar, FiMapPin, FiRefreshCw, FiAlertTriangle, 
  FiCheckCircle, FiShield, FiMoreVertical
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
  max-width: 1280px; margin: 40px auto; padding: 0 24px;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;
  border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px;
  
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 24px; }
  
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
  background: ${props => props.$primary ? '#fff' : 'rgba(255,255,255,0.03)'};
  color: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
  border: 1px solid ${props => props.$primary ? '#fff' : 'rgba(255,255,255,0.1)'};
  padding: 12px 20px; border-radius: 10px; font-weight: 700; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; white-space: nowrap;
  &:hover:not(:disabled) { transform: translateY(-2px); background: ${props => props.$primary ? '#f1f5f9' : 'rgba(255,255,255,0.08)'}; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ==========================================================================
   STYLED COMPONENTS - DATA GRID
   ========================================================================== */
const DataGrid = styled.div`
  background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;
`;

const GridHeader = styled.div`
  display: grid; grid-template-columns: 80px 2fr 1fr 1fr 1fr 100px;
  padding: 16px 24px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  @media (max-width: 900px) { display: none; }
`;

const GridRow = styled(motion.div)`
  display: grid; grid-template-columns: 80px 2fr 1fr 1fr 1fr 100px;
  padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.02); align-items: center; transition: 0.2s;
  &:hover { background: rgba(255,255,255,0.03); }
  @media (max-width: 900px) { 
    grid-template-columns: 80px 1fr; gap: 15px; padding: 20px;
    .desktop-only { display: none; }
    .action-cell { grid-column: 1 / -1; justify-content: flex-start; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
  }
`;

const ImageThumbnail = styled.div`
  width: 60px; height: 60px; border-radius: 10px; background-size: cover; background-position: center; background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1);
`;

const TitleCell = styled.div`
  h3 { margin: 0 0 4px 0; font-size: 1.05rem; color: #f8fafc; font-weight: 700; }
  span { font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 4px; }
`;

const Badge = styled.span`
  padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
  background: ${props => props.$level === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : props.$level === 'Moderate' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$level === 'Easy' ? '#10b981' : props.$level === 'Moderate' ? '#f59e0b' : '#ef4444'};
  border: 1px solid ${props => props.$level === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : props.$level === 'Moderate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const IconButton = styled.button`
  width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s;
  ${props => props.$variant === 'edit' && `background: rgba(255,255,255,0.05); color: #cbd5e1; &:hover { background: rgba(255,255,255,0.1); color: white; }`}
  ${props => props.$variant === 'delete' && `background: rgba(239, 68, 68, 0.1); color: #ef4444; &:hover { background: rgba(239, 68, 68, 0.2); }`}
`;

/* ==========================================================================
   STYLED COMPONENTS - MODAL FORM & TOASTS
   ========================================================================== */
const FormOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
  z-index: 1000; overflow-y: auto; padding: 40px 20px; display: flex; justify-content: center;
`;

const FormPanel = styled(motion.div)`
  background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; max-width: 900px;
  padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); height: fit-content;
  @media (max-width: 768px) { padding: 24px; }
`;

const Grid2Col = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 16px; }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  input, select, textarea { 
    width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-family: 'Inter', sans-serif; transition: 0.2s;
    &:focus { outline: none; border-color: #8b5cf6; background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
  }
  textarea { min-height: 120px; resize: vertical; }
`;

const ModuleContainer = styled.div`
  background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin-bottom: 24px;
  .module-title { display: flex; align-items: center; gap: 8px; color: #f8fafc; font-weight: 700; margin-bottom: 20px; font-size: 1.1rem; }
`;

const Toast = styled(motion.div)`
  position: fixed; bottom: 30px; right: 30px; background: ${props => props.$error ? '#ef4444' : '#10b981'}; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; gap: 12px; z-index: 2000; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  @media (max-width: 600px) { bottom: 20px; left: 20px; right: 20px; justify-content: center; }
`;

/* ==========================================================================
   LOGIN COMPONENT (Dark Mode)
   ========================================================================== */
const LoginWrapper = styled.div`
  max-width: 400px; margin: 100px auto; padding: 40px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
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
        <ActionBtn $primary type="submit" disabled={loading} style={{width: '100%', padding: '14px'}}>{loading ? 'Authenticating...' : <><FiLogIn /> Access Console</>}</ActionBtn>
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

  // Auth & Initialization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(false);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (ADMIN_EMAILS.includes(currentUser.email) || (userDoc.exists() && userDoc.data().role === 'admin')) {
          setUser(currentUser);
          fetchTreks();
          fetchOrganizers();
        } else {
          setUser(null);
          setLoginError("Access denied: You do not have 'admin' clearance.");
        }
      } else { setUser(null); }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchOrganizers = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "in", ["organizer", "admin"]));
      const snap = await getDocs(q);
      setOrganizers(snap.docs.map(d => ({ id: d.id, name: d.data().name, org: d.data().organizationDetails?.name || d.data().name, role: d.data().role })));
    } catch (error) { console.error('Error fetching organizers:', error); }
  };
  
  const fetchTreks = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "treks"));
      setTreks(snap.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
    } catch (err) { showNotification(`Sync Error: ${err.message}`, true); } finally { setLoading(false); }
  };

  // Form Handlers
  const resetForm = () => {
    setFormData({
      id: '', title: '', country: 'India', location: '', difficulty: 'Easy', days: 1, price: '', season: '', rating: 5.0, reviews: 0,
      image: '', imageUrls: [], coverIndex: 0, description: '', detailedDescription: '', itinerary: [], availableMonths: [], availableDates: [], organizerId: '', organizerName: ''
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
      availableDates: Array.isArray(trek.availableDates) ? trek.availableDates : []
    });
    setEditingTrek(trek.docId); setShowForm(true);
  };

  const handleInputChange = (e) => { setFormData(prev => ({ ...prev, [name]: value })); const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  // --- FAULT TOLERANT SAVE LOGIC (Strict Sanitization & Two-Phase Commit) ---
  const handleSafeSave = async (e) => {
    e.preventDefault(); // Intercept form submission

    // 1. Strict Validation
    if (!formData.title?.trim() || !formData.organizerId) {
      return showNotification("Title and Assigned Organizer are strictly required.", true);
    }

    setLoading(true);
    const trekId = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    let newPrimaryImageUrl = null;
    let newGalleryUrls = [];
    let finalImageUrls = Array.isArray(formData.imageUrls) ? [...formData.imageUrls] : [];

    try {
      // 2. PHASE ONE: Upload Images to Storage
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

      // 3. Strict Data Sanitization (Fault Tolerance against bad user input)
      const safeData = {
        ...formData,
        id: trekId,
        days: Math.max(1, parseInt(formData.days, 10) || 1), // Minimum 1 day
        price: Math.max(0, parseFloat(formData.price) || 0), // Strip text, default 0
        rating: Math.min(5, Math.max(0, parseFloat(formData.rating) || 5.0)), // Cap at 5.0
        reviews: Math.max(0, parseInt(formData.reviews, 10) || 0),
        image: newPrimaryImageUrl || formData.image,
        imageUrls: finalImageUrls,
        updatedAt: new Date().toISOString()
      };

      // 4. PHASE TWO: Save to Database
      if (editingTrek) {
        await updateDoc(doc(db, "treks", editingTrek), safeData);
        showNotification("Trek parameters updated successfully.");
      } else {
        await addDoc(collection(db, "treks"), safeData);
        showNotification("New trek deployed to database.");
      }

      fetchTreks();
      resetForm();
      setShowForm(false);

    } catch (error) {
      // 5. ROLLBACK: Database failed, so delete the images we just uploaded
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
      try { setLoading(true); await deleteDoc(doc(db, "treks", docId)); fetchTreks(); showNotification("Trek record erased."); } 
      catch (err) { showNotification(`Deletion failed: ${err.message}`, true); } 
      finally { setLoading(false); }
    }
  };

  const handleInitSamples = async () => {
    try { setLoading(true); const res = await initializeTreks(user); if (res.success) { showNotification("Sample treks deployed."); fetchTreks(); } else { showNotification(res.message, true); } } 
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
        
        {loading ? <p style={{padding: '24px', textAlign: 'center', color: '#64748b'}}>Syncing with database...</p> : treks.length === 0 ? <p style={{padding: '24px', textAlign: 'center', color: '#64748b'}}>No records found. Deploy a new trek to begin.</p> : (
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
                <div className="desktop-only" style={{fontFamily: 'Space Mono', color: '#cbd5e1'}}>₹{trek.price}</div>
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
            <FormPanel initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'white' }}>{editingTrek ? 'Modify Trek Parameters' : 'Initialize New Trek'}</h2>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem' }}><FiX /></button>
              </div>

              <form onSubmit={handleSafeSave}>
                <Grid2Col>
                  <FormGroup><label>Trek Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required /></FormGroup>
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
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <ImageThumbnail style={{ width: '100px', height: '100px', position: 'relative', backgroundImage: formData.image || imageFile ? `url(${imageFile ? URL.createObjectURL(imageFile) : getValidImageUrl(formData.image)})` : 'none' }}>
                      {!formData.image && !imageFile && <FiImage size={30} style={{margin: '35px', color: '#64748b'}} />}
                      
                      {/* The Restored Trash Button */}
                      {(formData.image || imageFile) && (
                        <button 
                          type="button" 
                          onClick={() => { setImageFile(null); setFormData(p => ({...p, image: ''})); }}
                          style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </ImageThumbnail>
                    <div style={{flex: 1}}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#8b5cf6', color: 'white', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>
                        <FiUploadCloud /> {isUploading ? 'Uploading to Server...' : 'Select Cover Image'}
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                           if(e.target.files[0] && e.target.files[0].size <= 5*1024*1024) setImageFile(e.target.files[0]);
                           else showNotification("File exceeds 5MB limit.", true);
                        }} />
                      </label>
                      <p style={{margin: '10px 0 0 0', fontSize: '0.8rem', color: '#64748b'}}>Max 5MB. JPG or PNG.</p>
                      {isUploading && <div style={{width: '100%', height: '4px', background: '#1e293b', marginTop: '10px', borderRadius: '4px', overflow: 'hidden'}}><div style={{width: `${uploadProgress}%`, height: '100%', background: '#10b981', transition: '0.3s'}}/></div>}
                    </div>
                  </div>
                </FormGroup>
                
                <FormGroup><label>Brief Summary</label><textarea name="description" value={formData.description} onChange={handleInputChange} required /></FormGroup>
                <FormGroup><label>Detailed Description</label><textarea name="detailedDescription" value={formData.detailedDescription} onChange={handleInputChange} style={{minHeight: '200px'}} placeholder="Full HTML or Markdown supported description..." /></FormGroup>
                
                <ModuleContainer>
                  <div className="module-title"><FiImage /> Digital Asset Gallery</div>
                  <MultipleImagesUploader onImagesChange={(imgs, idx) => setFormData(p => ({...p, imageUrls: imgs, coverIndex: idx}))} initialImages={formData.imageUrls} initialCoverIndex={formData.coverIndex} maxFiles={10} maxSize={5} />
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
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
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