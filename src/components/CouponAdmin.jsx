import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { FiPlus, FiTrash2, FiEdit3, FiSave, FiX, FiRefreshCw, FiTag, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
   STYLED COMPONENTS - FORM EDITOR
   ========================================================================== */
const EditorCard = styled.div`
  background: linear-gradient(145deg, #0f172a, #020617); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 32px; margin-bottom: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  h2 { margin: 0 0 24px 0; color: white; display: flex; align-items: center; gap: 10px; font-size: 1.25rem; }
`;

const InputGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;
`;

const FormGroup = styled.div`
  label { display: block; margin-bottom: 8px; color: #94a3b8; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  input, select { 
    width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-family: 'Space Mono', monospace; transition: 0.2s;
    &:focus { outline: none; border-color: #8b5cf6; background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
    &::placeholder { color: #475569; }
  }
  select { font-family: 'Inter', sans-serif; cursor: pointer; }
  select option { background: #0f172a; }
`;

/* ==========================================================================
   STYLED COMPONENTS - DATA GRID
   ========================================================================== */
const DataGrid = styled.div`
  background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden;
`;

const GridHeader = styled.div`
  display: grid; grid-template-columns: 2fr 1.5fr 2fr 1.5fr 1fr 100px;
  padding: 16px 24px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #64748b; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
  @media (max-width: 1000px) { display: none; }
`;

const GridRow = styled(motion.div)`
  display: grid; grid-template-columns: 2fr 1.5fr 2fr 1.5fr 1fr 100px;
  padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.02); align-items: center; transition: 0.2s;
  &:hover { background: rgba(255,255,255,0.03); }
  
  .code-block { font-family: 'Space Mono', monospace; font-weight: 700; color: #f8fafc; font-size: 1.1rem; }
  .desc { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
  .data-text { color: #cbd5e1; font-size: 0.9rem; }
  .sub-text { font-size: 0.75rem; color: #64748b; }
  
  @media (max-width: 1000px) { 
    grid-template-columns: 1fr; gap: 12px; padding: 20px;
    .desktop-hide { display: block; font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
    .action-cell { display: flex; gap: 10px; margin-top: 10px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
  background: ${props => props.$status === 'active' ? 'rgba(16, 185, 129, 0.1)' : props.$status === 'expired' ? 'rgba(239, 68, 68, 0.1)' : props.$status === 'inactive' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => props.$status === 'active' ? '#10b981' : props.$status === 'expired' ? '#ef4444' : props.$status === 'inactive' ? '#94a3b8' : '#f59e0b'};
  border: 1px solid ${props => props.$status === 'active' ? 'rgba(16, 185, 129, 0.2)' : props.$status === 'expired' ? 'rgba(239, 68, 68, 0.2)' : props.$status === 'inactive' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
`;

const IconButton = styled.button`
  width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s;
  ${props => props.$variant === 'edit' && `background: rgba(255,255,255,0.05); color: #cbd5e1; &:hover { background: rgba(255,255,255,0.1); color: white; }`}
  ${props => props.$variant === 'delete' && `background: rgba(239, 68, 68, 0.1); color: #ef4444; &:hover { background: rgba(239, 68, 68, 0.2); }`}
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Toast = styled(motion.div)`
  position: fixed; bottom: 30px; right: 30px; background: ${props => props.$error ? '#ef4444' : '#10b981'}; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; gap: 12px; z-index: 2000; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
`;

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const CouponAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ visible: false, text: '', error: false });
  
  // Form State
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showNotification = (text, error = false) => {
    setToast({ visible: true, text, error });
    setTimeout(() => setToast({ visible: false, text: '', error: false }), 4000);
  };
  
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) return showNotification('Authentication required.', true);
      
      const snap = await getDocs(collection(db, 'coupons'));
      const list = snap.docs.map(doc => ({
        id: doc.id, ...doc.data(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate()
      }));
      setCoupons(list);
    } catch (err) {
      if (err.code === 'permission-denied') showNotification('Access denied. Administrator clearance required.', true);
      else showNotification('Failed to sync database.', true);
    } finally {
      setLoading(false);
    }
  };
  
  const validateData = () => {
    if (!couponCode.trim()) return 'Coupon code is strictly required.';
    if (isNaN(discountValue) || Number(discountValue) <= 0) return 'Valid discount metric required.';
    if (discountType === 'percentage' && Number(discountValue) > 100) return 'Percentage metrics cannot exceed 100%.';
    if (validFrom && validUntil && new Date(validFrom) > new Date(validUntil)) return 'Chronological error: Start date exceeds End date.';
    return null;
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    const validationError = validateData();
    if (validationError) return showNotification(validationError, true);
    
    setLoading(true);
    try {
      // Duplication Check
      const checkQuery = query(collection(db, 'coupons'), where('code', '==', couponCode.trim().toUpperCase()));
      const existing = await getDocs(checkQuery);
      if (!existing.empty && !editingId) return showNotification('Coupon code already exists in database.', true);
      
      // THE REAL FIX: Build the payload without ANY undefined variables
      const payload = {
        code: couponCode.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minPurchase: minPurchase ? Number(minPurchase) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        validFrom: validFrom ? Timestamp.fromDate(new Date(validFrom + 'T00:00:00')) : null,
        validUntil: validUntil ? Timestamp.fromDate(new Date(validUntil + 'T23:59:59')) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        description,
        status: status || 'active', 
        updatedAt: Timestamp.now()
      };

      // ONLY add these fields if it is a brand new coupon
      if (!editingId) {
        payload.usageCount = 0;
        payload.createdAt = Timestamp.now();
      }
      
      if (editingId) {
        await updateDoc(doc(db, 'coupons', editingId), payload);
        showNotification('Coupon record updated.');
      } else {
        await addDoc(collection(db, 'coupons'), payload);
        showNotification('New coupon deployed.');
      }
      
      resetForm();
      fetchCoupons();
    } catch (err) {
      showNotification(`Deployment failed: ${err.message}`, true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Erase this coupon from the database?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'coupons', id));
      showNotification('Coupon record erased.');
      fetchCoupons();
    } catch (err) { showNotification('Deletion failed.', true); } 
    finally { setLoading(false); }
  };
  
  const handleEdit = (coupon) => {
    setCouponCode(coupon.code); 
    setDiscountType(coupon.discountType); 
    setDiscountValue(coupon.discountValue.toString());
    setMinPurchase(coupon.minPurchase?.toString() || ''); 
    setMaxDiscount(coupon.maxDiscount?.toString() || '');
    
    // THE FIX: Prevent UTC timezone shifting the date backward by 1 day
    const getLocalFormat = (dateObj) => {
      if (!dateObj) return '';
      const d = new Date(dateObj);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    };

    setValidFrom(getLocalFormat(coupon.validFrom));
    setValidUntil(getLocalFormat(coupon.validUntil));
    setUsageLimit(coupon.usageLimit?.toString() || ''); 
    setDescription(coupon.description || '');
    setStatus(coupon.status || 'active'); 
    setEditingId(coupon.id);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const resetForm = () => {
    setCouponCode(''); setDiscountType('percentage'); setDiscountValue(''); setMinPurchase(''); setMaxDiscount('');
    setValidFrom(''); setValidUntil(''); setUsageLimit(''); setDescription(''); setStatus('active'); setEditingId(null);
  };
  
  // Display Logic Helpers
  const formatDisplayDate = (date) => date ? new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Indefinite';
  
  const getStatus = (coupon) => {
    const now = new Date();
    if (coupon.status === 'inactive') return 'inactive';
    if (coupon.validUntil && now > new Date(coupon.validUntil)) return 'expired';
    if (coupon.validFrom && now < new Date(coupon.validFrom)) return 'scheduled';
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return 'depleted';
    return 'active';
  };

  return (
    <AdminLayout>
      <GlobalStyle />
      
      <Header>
        <div>
          <SecurityBadge><FiTag /> Pricing Control</SecurityBadge>
          <h1>Coupon Admin</h1>
          <p>Deploy promotional codes and pricing logic.</p>
        </div>
        <ButtonGroup>
          <ActionBtn onClick={fetchCoupons} disabled={loading}><FiRefreshCw /> Sync Status</ActionBtn>
        </ButtonGroup>
      </Header>
      
      {/* FORM EDITOR */}
      <EditorCard>
        <h2>{editingId ? <><FiEdit3 color="#8b5cf6" /> Modify Coupon Parameters</> : <><FiPlus color="#10b981" /> Initialize New Coupon</>}</h2>
        <form onSubmit={handleSave}>
          <InputGrid>
            <FormGroup><label>Coupon Code *</label><input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="e.g. SUMMER24" required /></FormGroup>
            <FormGroup>
              <label>Discount Metric *</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Flat Rate (₹)</option>
              </select>
            </FormGroup>
            <FormGroup><label>Value *</label><input type="number" min="0" step="any" value={discountValue} onChange={e => setDiscountValue(e.target.value)} required placeholder={discountType === 'percentage' ? "e.g. 20" : "e.g. 500"} /></FormGroup>
          </InputGrid>
          
          <InputGrid>
            <FormGroup><label>Min Purchase (₹)</label><input type="number" min="0" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} placeholder="e.g. 1000" /></FormGroup>
            <FormGroup><label>Max Discount Cap (₹)</label><input type="number" min="0" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} placeholder="e.g. 2000" /></FormGroup>
            <FormGroup><label>Usage Limit (Global)</label><input type="number" min="1" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} placeholder="e.g. 100" /></FormGroup>
          </InputGrid>

          <InputGrid>
            <FormGroup><label>Activation Date</label><input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} /></FormGroup>
            <FormGroup><label>Expiration Date</label><input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} /></FormGroup>
            <FormGroup>
              <label>Manual Override Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">Active (Live)</option>
                <option value="inactive">Inactive (Paused)</option>
              </select>
            </FormGroup>
          </InputGrid>

          <FormGroup><label>Internal Notes / Description</label><input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Influencer marketing campaign" style={{fontFamily: 'Inter'}} /></FormGroup>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '24px' }}>
            {editingId && <ActionBtn type="button" onClick={resetForm}><FiX /> Cancel Edit</ActionBtn>}
            <ActionBtn $primary type="submit" disabled={loading}><FiSave /> {editingId ? 'Update Record' : 'Deploy Coupon'}</ActionBtn>
          </div>
        </form>
      </EditorCard>
      
      {/* DATA GRID */}
      <DataGrid>
        <GridHeader>
          <div className="align-left">Access Code</div><div>Logic</div><div>Validity Window</div><div>Usage Stats</div><div>Status</div><div>Actions</div>
        </GridHeader>
        
        {loading && coupons.length === 0 ? <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Scanning database...</p> : coupons.length === 0 ? <p style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>No coupons deployed.</p> : (
          coupons.map(coupon => (
            <GridRow key={coupon.id}>
              
              <div>
                <div className="desktop-hide" style={{display: 'none'}}>Code</div>
                <div className="code-block">{coupon.code}</div>
                {coupon.description && <div className="desc">{coupon.description}</div>}
              </div>
              
              <div>
                <div className="desktop-hide" style={{display: 'none'}}>Logic</div>
                <div className="data-text" style={{fontWeight: 700, color: '#8b5cf6'}}>
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                </div>
                {coupon.minPurchase && <div className="sub-text">Min spend: ₹{coupon.minPurchase}</div>}
                {coupon.maxDiscount && <div className="sub-text">Max cap: ₹{coupon.maxDiscount}</div>}
              </div>
              
              <div>
                <div className="desktop-hide" style={{display: 'none'}}>Validity Window</div>
                <div className="data-text" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><FiClock size={12}/> {formatDisplayDate(coupon.validFrom)}</div>
                <div className="sub-text" style={{marginLeft: '18px'}}>to {formatDisplayDate(coupon.validUntil)}</div>
              </div>

              <div>
                <div className="desktop-hide" style={{display: 'none'}}>Usage Stats</div>
                <div className="data-text">{coupon.usageCount || 0} Uses</div>
                <div className="sub-text">{coupon.usageLimit ? `Cap: ${coupon.usageLimit}` : 'Unlimited'}</div>
              </div>
              
              <div>
                <div className="desktop-hide" style={{display: 'none'}}>Status</div>
                <StatusBadge $status={getStatus(coupon)}>{getStatus(coupon)}</StatusBadge>
              </div>
              
              <div className="action-cell" style={{ display: 'flex', gap: '8px' }}>
                <IconButton $variant="edit" onClick={() => handleEdit(coupon)} title="Modify Rules"><FiEdit3 /></IconButton>
                <IconButton $variant="delete" onClick={() => handleDelete(coupon.id)} title="Erase Record"><FiTrash2 /></IconButton>
              </div>

            </GridRow>
          ))
        )}
      </DataGrid>

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

export default CouponAdmin;