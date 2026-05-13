import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { 
  FiSearch, FiArrowLeft, FiAlertCircle, FiLoader, FiCalendar, 
  FiUser, FiCheckCircle, FiTrendingUp, FiDollarSign, FiCheck
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
  max-width: 1280px; margin: 0 auto; padding: 40px 24px; min-height: 100vh;
  @media (max-width: 768px) { padding: 24px 16px; }
`;

const TopNav = styled.div`
  margin-bottom: 24px; display: flex; align-items: center; gap: 16px;
`;

const BackBtn = styled(Link)`
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; background: white; border: 1px solid #e2e8f0;
  border-radius: 8px; color: #475569; transition: all 0.2s ease;
  &:hover { background: #f8fafc; color: #0f172a; }
  @media (max-width: 768px) { width: 36px; height: 36px; }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem; font-weight: 700; color: #0f172a; margin: 0;
  @media (max-width: 768px) { font-size: 1.5rem; }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const MetricCard = styled.div`
  background: white; border-radius: 12px; padding: 20px;
  border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex; align-items: center; gap: 16px;
`;

const MetricIcon = styled.div`
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
  background: ${props => props.$bg || '#f1f5f9'};
  color: ${props => props.$color || '#475569'};
`;

const MetricInfo = styled.div`
  display: flex; flex-direction: column;
  span { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  strong { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 4px; }
`;

const ControlBar = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  gap: 16px; flex-wrap: wrap; background: white; padding: 16px 20px;
  border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  @media (max-width: 850px) { flex-direction: column; align-items: stretch; }
`;

const SearchBox = styled.div`
  position: relative; flex: 1; max-width: 350px;
  @media (max-width: 850px) { max-width: 100%; }
  svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
  input {
    width: 100%; padding: 10px 14px 10px 40px; border-radius: 8px;
    border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none; box-sizing: border-box;
    &:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
  }
`;

const FilterGroup = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 8px 12px; border-radius: 8px; border: 1px solid ${props => props.$active ? '#0f172a' : '#cbd5e1'};
  font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; 
  display: flex; align-items: center; gap: 6px;
  background: ${props => props.$active ? '#0f172a' : 'white'};
  color: ${props => props.$active ? 'white' : '#475569'};
  white-space: nowrap; flex: 1; justify-content: center;
  &:hover { background: ${props => props.$active ? '#0f172a' : '#f8fafc'}; }
`;

const TableContainer = styled.div`
  background: white; border-radius: 12px; border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; text-align: left; min-width: 800px;
`;

const Th = styled.th`
  padding: 16px 20px; font-size: 0.75rem; font-weight: 600; color: #64748b;
  text-transform: uppercase; border-bottom: 1px solid #e2e8f0;
  background: #f8fafc; white-space: nowrap;
`;

const Td = styled.td`
  padding: 16px 20px; font-size: 0.9rem; color: #334155;
  border-bottom: 1px solid #f1f5f9; vertical-align: middle;
  white-space: nowrap;
`;

const Tr = styled(motion.tr)`
  &:hover { background: #f8fafc; }
  &:last-child td { border-bottom: none; }
`;

const Badge = styled.span`
  display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px;
  font-size: 0.75rem; font-weight: 600; text-transform: capitalize;
  background: ${props => props.$bg || '#f1f5f9'};
  color: ${props => props.$color || '#475569'};
  border: 1px solid ${props => props.$border || 'transparent'};
`;

/* --- ACTION BUTTONS --- */
const ActionGroup = styled.div`
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
`;

const ActionBtn = styled(Link)`
  padding: 6px 12px; background: white; color: #0f172a; border-radius: 6px;
  font-weight: 500; font-size: 0.8rem; text-decoration: none; transition: all 0.2s;
  border: 1px solid #cbd5e1; display: inline-flex; align-items: center; justify-content: center;
  &:hover { background: #f1f5f9; border-color: #94a3b8; }
`;

const CompleteBtn = styled.button`
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 6px; border: none;
  background: #dcfce7; color: #16a34a; cursor: pointer; transition: all 0.2s;
  &:hover:not(:disabled) { background: #bbf7d0; transform: scale(1.05); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StateContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 20px; color: #64748b; text-align: center; background: white;
  border-radius: 12px; border: 1px solid #e2e8f0;
  svg { font-size: 3rem; margin-bottom: 16px; color: #cbd5e1; }
`;

const Spinner = styled(FiLoader)`
  animation: spin 1s linear infinite; color: #0ea5e9;
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

/* ==========================================================================
   HELPERS
   ========================================================================== */
const safeFormatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  try {
    if (dateVal.seconds) return new Date(dateVal.seconds * 1000).toLocaleDateString();
    if (dateVal.toDate) return dateVal.toDate().toLocaleDateString();
    return new Date(dateVal).toLocaleDateString();
  } catch { return 'Invalid Date'; }
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

const getStatusStyles = (status) => {
  const s = String(status).toLowerCase();
  if (s === 'trekking') return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
  if (s === 'confirmed' || s === 'success' || s === 'completed') return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
  if (s === 'pending') return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
  return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
};

const safeStr = (val) => (val ? String(val) : '');

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Track which booking is currently being assigned
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (err) {
        if (err.message && err.message.includes('index')) {
          try {
            const fallbackSnapshot = await getDocs(collection(db, 'bookings'));
            const fallbackData = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fallbackData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setBookings(fallbackData);
          } catch (fallbackErr) {
            setError("Failed to load bookings.");
          }
        } else {
          setError("Failed to load bookings.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Handle Quick Assignment from the Table
  const handleQuickAssign = async (bookingId) => {
    const orgName = window.prompt("Enter Organizer Name to assign this booking:");
    
    // If user cancels the prompt or leaves it blank, do nothing.
    if (!orgName || orgName.trim() === "") return;
    
    try {
      setProcessingId(bookingId);
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { organizerName: orgName.trim() });
      
      // Instantly update the UI so it moves to "Assigned"
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, organizerName: orgName.trim() } : b));
    } catch (err) {
      alert(`Failed to assign organizer: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const totalBookings = bookings.length;
  const unassignedCount = bookings.filter(b => !b.organizerName && !b.organizerId).length;
  const assignedCount = totalBookings - unassignedCount;
  
  const totalRevenue = bookings.reduce((sum, b) => {
    return sum + (Number(b.totalAmount) || Number(b.subtotal) || 0);
  }, 0);

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const idMatch = safeStr(b.id).toLowerCase().includes(term);
    const trekMatch = safeStr(b.trekName).toLowerCase().includes(term);
    const userMatch = safeStr(b.name).toLowerCase().includes(term) || safeStr(b.primaryBooker?.name).toLowerCase().includes(term);
    const orgMatch = safeStr(b.organizerName).toLowerCase().includes(term) || safeStr(b.organizerId).toLowerCase().includes(term);
    
    const matchesSearch = idMatch || trekMatch || userMatch || orgMatch;
    const isAssigned = Boolean(b.organizerName || b.organizerId);
    
    if (filter === 'unassigned' && isAssigned) return false;
    if (filter === 'assigned' && !isAssigned) return false;

    return matchesSearch;
  });

  return (
    <PageLayout>
      <GlobalStyle />
      
      <TopNav>
        <BackBtn to="/admin"><FiArrowLeft size={18} /></BackBtn>
        <PageTitle>Booking Management</PageTitle>
      </TopNav>

      <MetricsGrid>
        <MetricCard>
          <MetricIcon $bg="#e0f2fe" $color="#0ea5e9"><FiTrendingUp /></MetricIcon>
          <MetricInfo>
            <span>Total Bookings</span>
            <strong>{totalBookings}</strong>
          </MetricInfo>
        </MetricCard>
        <MetricCard>
          <MetricIcon $bg="#fef3c7" $color="#d97706"><FiAlertCircle /></MetricIcon>
          <MetricInfo>
            <span>Unassigned</span>
            <strong>{unassignedCount}</strong>
          </MetricInfo>
        </MetricCard>
        <MetricCard>
          <MetricIcon $bg="#dcfce7" $color="#16a34a"><FiDollarSign /></MetricIcon>
          <MetricInfo>
            <span>Total Value</span>
            <strong>{formatCurrency(totalRevenue)}</strong>
          </MetricInfo>
        </MetricCard>
      </MetricsGrid>

      <ControlBar>
        <SearchBox>
          <FiSearch size={16} />
          <input 
            type="text" 
            placeholder="Search by ID, User, Trek or Organizer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <FilterGroup>
          <FilterBtn $active={filter === 'all'} onClick={() => setFilter('all')}>
            All ({totalBookings})
          </FilterBtn>
          <FilterBtn $active={filter === 'unassigned'} onClick={() => setFilter('unassigned')}>
            Needs Assignment ({unassignedCount})
          </FilterBtn>
          <FilterBtn $active={filter === 'assigned'} onClick={() => setFilter('assigned')}>
            Assigned ({assignedCount})
          </FilterBtn>
        </FilterGroup>
      </ControlBar>

      <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, marginBottom: '16px' }}>
        Showing {filteredBookings.length} Record(s)
      </div>

      {loading ? (
        <StateContainer>
          <Spinner size={40} />
          <h3 style={{marginTop: '16px', color: '#0f172a'}}>Retrieving Bookings...</h3>
        </StateContainer>
      ) : error ? (
        <StateContainer>
          <FiAlertCircle color="#ef4444" />
          <h3 style={{ color: '#ef4444', margin: '16px 0 8px' }}>Connection Failed</h3>
          <p>{error}</p>
        </StateContainer>
      ) : filteredBookings.length === 0 ? (
        <StateContainer>
          <FiCalendar />
          <h3 style={{ color: '#0f172a', margin: '16px 0 8px' }}>No Bookings Found</h3>
        </StateContainer>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>ID & Date</Th>
                <Th>Trek & Organizer</Th>
                <Th>Primary Booker</Th>
                <Th>Status</Th>
                <Th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredBookings.map((booking) => {
                  const bookerName = booking.name || booking.primaryBooker?.name || 'N/A';
                  const currentStatus = String(booking.status || booking.paymentStatus || 'Pending').toLowerCase();
                  const statusStyles = getStatusStyles(currentStatus);
                  
                  // Check if this booking has an organizer
                  const isAssigned = Boolean(booking.organizerName || booking.organizerId);
                  const safeId = safeStr(booking.id);
                  
                  if (!safeId) return null;

                  return (
                    <Tr 
                      key={safeId} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* ID & Date */}
                      <Td>
                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          {safeId.slice(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {safeFormatDate(booking.createdAt)}
                        </div>
                      </Td>

                      {/* Trek & Organizer */}
                      <Td>
                        <div style={{ fontWeight: 600, color: '#0ea5e9', marginBottom: '4px' }}>
                          {booking.trekName || 'Unknown Trek'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                          <strong>Org:</strong> {isAssigned ? booking.organizerName : <span style={{color: '#ef4444'}}>Unassigned</span>}
                        </div>
                      </Td>

                      {/* Customer */}
                      <Td>
                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{bookerName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                          <FiUser size={12} /> {booking.totalParticipants || booking.participants?.length || 1} Pax
                        </div>
                      </Td>

                      {/* Status */}
                      <Td>
                        <Badge $bg={statusStyles.bg} $color={statusStyles.color} $border={statusStyles.border}>
                          {booking.status || booking.paymentStatus || 'Pending'}
                        </Badge>
                      </Td>

                      {/* Actions */}
                      <Td>
                        <ActionGroup>
                          {/* Checkmark Quick Assign Button (Only shows if NOT assigned) */}
                          {!isAssigned && (
                            <CompleteBtn 
                              title="Quick Assign Organizer"
                              onClick={() => handleQuickAssign(safeId)}
                              disabled={processingId === safeId}
                            >
                              {processingId === safeId ? <Spinner style={{width: '16px', height: '16px', color: '#16a34a'}} /> : <FiCheck size={16} />}
                            </CompleteBtn>
                          )}
                          
                          {/* Detail Button */}
                          <ActionBtn to={`/admin/bookings/${safeId}`}>
                            Detail
                          </ActionBtn>
                        </ActionGroup>
                      </Td>
                    </Tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </Table>
        </TableContainer>
      )}
    </PageLayout>
  );
};

export default AdminBookings;