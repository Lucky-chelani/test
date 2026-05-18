import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  FiArrowLeft, FiAlertCircle, FiLoader, FiCalendar, FiUser, 
  FiMapPin, FiCreditCard, FiCheckCircle, FiClock, FiPhone, FiMail,
  FiBriefcase, FiSave, FiEdit2, FiX, FiUsers, FiCheck
} from 'react-icons/fi';

/* ==========================================================================
   GLOBAL STYLES - PLAIN ENTERPRISE THEME
   ========================================================================== */
const GlobalStyle = createGlobalStyle`
  body { 
    background-color: #f1f5f9; 
    color: #0f172a; 
    font-family: 'Inter', -apple-system, sans-serif; 
    margin: 0; 
  }
`;

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */
const PageLayout = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 40px 24px; min-height: 100vh;
`;

const TopNav = styled.div`
  margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-wrap: wrap;
`;

const NavLeft = styled.div`display: flex; align-items: center; gap: 16px;`;

const BackBtn = styled(Link)`
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; background: white; border: 1px solid #e2e8f0;
  border-radius: 8px; color: #475569; transition: all 0.2s ease;
  &:hover { background: #f8fafc; color: #0f172a; }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem; font-weight: 700; color: #0f172a; margin: 0;
  display: flex; align-items: center; gap: 12px;
`;

const IdBadge = styled.span`
  font-size: 0.9rem; font-family: 'Courier New', monospace; font-weight: 600;
  background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 6px;
`;

const TopActions = styled.div`
  display: flex; gap: 12px;
`;

const ConfirmBtn = styled.button`
  padding: 10px 16px; background: #10b981; color: white; 
  border-radius: 8px; border: none; cursor: pointer;
  font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 8px;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  &:hover { background: #059669; }
  &:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Card = styled(motion.div)`
  background: white; border-radius: 12px; border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 20px; border-bottom: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; gap: 10px; font-weight: 600; color: #1e293b;
  svg { color: #0ea5e9; font-size: 1.1rem; }
`;

const CardBody = styled.div`padding: 20px;`;

const DetailRow = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 12px 0; border-bottom: 1px dashed #e2e8f0;
  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
`;

const DetailLabel = styled.div`
  font-size: 0.85rem; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 6px;
`;

const DetailValue = styled.div`
  font-size: 0.95rem; color: #0f172a; font-weight: 600; text-align: right; max-width: 60%; word-break: break-word;
`;

const Badge = styled.span`
  display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px;
  font-size: 0.75rem; font-weight: 600; text-transform: capitalize;
  background: ${props => props.$bg || '#f1f5f9'}; 
  color: ${props => props.$color || '#475569'};
  border: 1px solid ${props => props.$border || 'transparent'};
`;

/* --- Assignment Specific Styles --- */
const AssignmentCard = styled(Card)`
  grid-column: 1 / -1; 
  border: 2px solid ${props => props.$assigned ? '#bbf7d0' : '#fde68a'};
  background: ${props => props.$assigned ? '#f0fdf4' : '#fffbeb'};
`;

const AssignmentHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 12px; }
`;

const AssignmentStatus = styled.div`
  display: flex; align-items: center; gap: 8px; font-size: 1.1rem; font-weight: 700;
  color: ${props => props.$assigned ? '#166534' : '#92400e'};
  svg { font-size: 1.4rem; }
`;

const FormGroup = styled.div`
  display: flex; gap: 16px; margin-bottom: 16px;
  @media (max-width: 600px) { flex-direction: column; }
`;

const InputWrap = styled.div`
  flex: 1; display: flex; flex-direction: column; gap: 6px;
  label { font-size: 0.8rem; font-weight: 600; color: #475569; }
  input {
    padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1;
    font-size: 0.95rem; outline: none; transition: border 0.2s; background: white;
    &:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
  }
`;

const ActionBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px;
  font-weight: 600; font-size: 0.85rem; border: 1px solid ${props => props.$primary ? 'transparent' : '#cbd5e1'}; 
  cursor: pointer; transition: all 0.2s;
  background: ${props => props.$primary ? '#0ea5e9' : 'white'};
  color: ${props => props.$primary ? 'white' : '#475569'};
  &:hover { background: ${props => props.$primary ? '#0284c7' : '#f8fafc'}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const StateContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 20px; color: #64748b; text-align: center; background: white;
  border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 20px;
`;

const Spinner = styled(FiLoader)`
  animation: spin 1s linear infinite; font-size: ${props => props.size || 24}px; color: #0ea5e9;
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

/* ==========================================================================
   HELPERS (Fault Tolerance)
   ========================================================================== */
const safeDate = (val) => {
  if (!val) return 'N/A';
  try {
    if (val.seconds) return new Date(val.seconds * 1000).toLocaleString();
    if (val.toDate) return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  } catch { return 'Invalid Date'; }
};

const formatCurrency = (amt) => {
  if (amt == null || isNaN(amt)) return '₹0';
  return `₹${Number(amt).toLocaleString('en-IN')}`;
};

const safeStr = (val) => (val ? String(val) : '');

const getStatusStyles = (status) => {
  const s = safeStr(status).toLowerCase();
  if (s === 'trekking') return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
  if (s === 'confirmed' || s === 'success' || s === 'completed') return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
  if (s === 'pending') return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
  return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form States - Defaults will instantly populate from DB
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [savingOrg, setSavingOrg] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'bookings', id);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          const data = snap.data();
          setBooking({ id: snap.id, ...data });
          
          // Pre-populate editing fields with default database values immediately
          setOrgName(data.organizerName || '');
          setOrgId(data.organizerId || '');
        } else {
          setError('Booking not found in database.');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve booking.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Handle Organizer Assignment Saving (If admin decides to edit the default)
  const handleSaveAssignment = async () => {
    try {
      setSavingOrg(true);
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, {
        organizerName: orgName.trim(),
        organizerId: orgId.trim()
      });
      // Update local state instantly
      setBooking(prev => ({
        ...prev,
        organizerName: orgName.trim(),
        organizerId: orgId.trim()
      }));
      setIsEditingOrg(false);
    } catch (err) {
      alert(`Failed to save assignment: ${err.message}`);
    } finally {
      setSavingOrg(false);
    }
  };

  // Handle Setting to "Trekking"
  const handleSetTrekking = async () => {
    if (!window.confirm("Are you sure you want to set the status to 'Trekking'?")) return;
    
    try {
      setUpdatingStatus(true);
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { status: 'trekking' });
      
      // Update local state instantly
      setBooking(prev => ({ ...prev, status: 'trekking' }));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <PageLayout><StateContainer><Spinner size={48} /><h3>Loading Details...</h3></StateContainer></PageLayout>;
  if (error || !booking) return <PageLayout><StateContainer><FiAlertCircle size={48} color="#ef4444" /><h3>Error</h3><p>{error}</p><BackBtn to="/admin/bookings"><FiArrowLeft/></BackBtn></StateContainer></PageLayout>;

  // Derived Logic: Will automatically be TRUE if booking was made with an organizer
  const isAssigned = !!booking.organizerName || !!booking.organizerId;
  const isTrekking = safeStr(booking.status).toLowerCase() === 'trekking';
  const statusStyles = getStatusStyles(booking.status || booking.paymentStatus || 'Pending');

  return (
    <PageLayout>
      <GlobalStyle />
      
      <TopNav>
        <NavLeft>
          <BackBtn to="/admin/bookings"><FiArrowLeft size={18} /></BackBtn>
          <PageTitle>Booking <IdBadge>#{booking.id.slice(0, 8).toUpperCase()}</IdBadge></PageTitle>
        </NavLeft>

        <TopActions>
          {isAssigned && !isTrekking && (
            <ConfirmBtn onClick={handleSetTrekking} disabled={updatingStatus}>
              {updatingStatus ? <Spinner size={16} style={{color: 'white'}} /> : <FiCheck size={16} />}
              Set Status to Trekking
            </ConfirmBtn>
          )}
        </TopActions>
      </TopNav>

      <Grid>
        {/* ─── ORGANIZER TRACKING & ASSIGNMENT CARD ─── */}
        <AssignmentCard $assigned={isAssigned} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <CardBody>
            <AssignmentHeader>
              <AssignmentStatus $assigned={isAssigned}>
                {isAssigned ? <><FiCheckCircle /> Assigned to Organizer</> : <><FiAlertCircle /> Action Required: Unassigned</>}
              </AssignmentStatus>
              {!isEditingOrg && (
                <ActionBtn onClick={() => setIsEditingOrg(true)}>
                  <FiEdit2 /> Update Assignment
                </ActionBtn>
              )}
            </AssignmentHeader>

            <AnimatePresence mode="wait">
              {isEditingOrg ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <FormGroup>
                    <InputWrap>
                      <label>Organizer Name</label>
                      <input 
                        value={orgName} 
                        onChange={(e) => setOrgName(e.target.value)} 
                        placeholder="e.g. Himalayan Trekkers"
                      />
                    </InputWrap>
                    <InputWrap>
                      <label>Organizer ID (From DB)</label>
                      <input 
                        value={orgId} 
                        onChange={(e) => setOrgId(e.target.value)} 
                        placeholder="e.g. Uid123456..."
                      />
                    </InputWrap>
                  </FormGroup>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <ActionBtn onClick={() => { 
                      setIsEditingOrg(false); 
                      setOrgName(booking.organizerName || ''); 
                      setOrgId(booking.organizerId || ''); 
                    }} disabled={savingOrg}>
                      Cancel
                    </ActionBtn>
                    <ActionBtn $primary onClick={handleSaveAssignment} disabled={savingOrg}>
                      {savingOrg ? <Spinner size={14} style={{color: 'white'}} /> : <FiSave />} Save Details
                    </ActionBtn>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '40px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Organizer Name</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>
                      {booking.organizerName || <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Not provided</span>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Organizer System ID</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                      {booking.organizerId || <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Not provided</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardBody>
        </AssignmentCard>

        {/* ─── TREK & SCHEDULE DETAILS ─── */}
        <Card initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <CardHeader><FiMapPin /> Trek Overview</CardHeader>
          <CardBody>
            <DetailRow>
              <DetailLabel>Trek Name</DetailLabel>
              <DetailValue style={{color: '#0ea5e9'}}>{booking.trekName || 'Unknown Trek'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Start Date</DetailLabel>
              <DetailValue>{safeDate(booking.startDate || booking.trekDate)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Participants</DetailLabel>
              <DetailValue>{booking.totalParticipants || booking.participants?.length || 1} People</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Booking Created</DetailLabel>
              <DetailValue>{safeDate(booking.createdAt)}</DetailValue>
            </DetailRow>
          </CardBody>
        </Card>

        {/* ─── PAYMENT DETAILS ─── */}
        <Card initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CardHeader><FiCreditCard /> Financials</CardHeader>
          <CardBody>
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>
                <Badge $bg={statusStyles.bg} $color={statusStyles.color} $border={statusStyles.border}>
                  {booking.status || booking.paymentStatus || 'Pending'}
                </Badge>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Total Cost</DetailLabel>
              <DetailValue>{formatCurrency(booking.totalAmount || booking.subtotal)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel style={{color: '#10b981'}}>Upfront Paid (Online)</DetailLabel>
              <DetailValue style={{color: '#10b981'}}>{formatCurrency(booking.upfrontAmount)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel style={{color: '#f59e0b'}}>Due to Organizer</DetailLabel>
              <DetailValue style={{color: '#f59e0b'}}>{formatCurrency(booking.remainingAmount)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment ID</DetailLabel>
              <DetailValue style={{fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b'}}>{booking.paymentId || booking.razorpay_payment_id || 'N/A'}</DetailValue>
            </DetailRow>
          </CardBody>
        </Card>

        {/* ─── PRIMARY BOOKER DETAILS ─── */}
        <Card initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ gridColumn: '1 / -1' }}>
          <CardHeader><FiUser /> Customer Information (Primary Booker)</CardHeader>
          <CardBody>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <DetailRow style={{borderBottom: 'none', padding: 0}}>
                  <DetailLabel><FiUser/> Name</DetailLabel>
                  <DetailValue>{booking.name || booking.primaryBooker?.name || 'N/A'}</DetailValue>
                </DetailRow>
                <DetailRow style={{borderBottom: 'none', padding: 0}}>
                  <DetailLabel><FiMail/> Email</DetailLabel>
                  <DetailValue>{booking.email || booking.primaryBooker?.email || 'N/A'}</DetailValue>
                </DetailRow>
                <DetailRow style={{borderBottom: 'none', padding: 0}}>
                  <DetailLabel><FiPhone/> Contact</DetailLabel>
                  <DetailValue>{booking.contactNumber || booking.primaryBooker?.contactNumber || 'N/A'}</DetailValue>
                </DetailRow>
                <DetailRow style={{borderBottom: 'none', padding: 0}}>
                  <DetailLabel><FiBriefcase/> User ID</DetailLabel>
                  <DetailValue style={{fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b'}}>{booking.userId || booking.primaryBooker?.uid || 'Guest'}</DetailValue>
                </DetailRow>
             </div>
          </CardBody>
        </Card>

        {/* ─── PARTICIPANT LIST ─── */}
        {booking.participants && booking.participants.length > 0 && (
          <Card initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ gridColumn: '1 / -1' }}>
            <CardHeader><FiUsers /> All Participants ({booking.participants.length})</CardHeader>
            <CardBody style={{ padding: 0, overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                      <th style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                      <th style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                      <th style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>Age</th>
                      <th style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.participants.map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                        <td style={{ padding: '16px 20px', fontWeight: 500, color: '#0f172a' }}>
                          {p.name || 'N/A'} 
                          {p.isPrimaryBooker && <Badge $bg="#e0f2fe" $color="#0284c7" style={{padding:'2px 6px', fontSize:'0.6rem', marginLeft:'8px'}}>Primary</Badge>}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>{p.email || '—'}</td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>{p.age || '—'}</td>
                        <td style={{ padding: '16px 20px', color: '#475569' }}>{p.emergencyContact || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </CardBody>
          </Card>
        )}
      </Grid>
    </PageLayout>
  );
};

export default AdminBookingDetail;