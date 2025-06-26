import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 25px;
  font-size: 28px;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    box-shadow: 0 0 0 2px rgba(83, 144, 217, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    box-shadow: 0 0 0 2px rgba(83, 144, 217, 0.2);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.color || '#5390D9'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.hoverColor || '#3a7cc7'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const CouponTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #f0f0f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f4fa;
  }
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
`;

const ActionButton = styled.button`
  padding: 8px;
  background-color: ${props => props.color};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: ${props => 
    props.status === 'active' ? '#4CAF50' : 
    props.status === 'expired' ? '#F44336' : 
    props.status === 'inactive' ? '#9e9e9e' : '#FF9800'
  };
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 5px;
  margin-bottom: 15px;
  border-left: 4px solid #c62828;
`;

const SuccessMessage = styled.div`
  padding: 12px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 5px;
  margin-bottom: 15px;
  border-left: 4px solid #2e7d32;
`;

const CouponAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // New coupon form
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
  
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      // First check if the user is authenticated
      if (!auth.currentUser) {
        setError('Please sign in to manage coupons');
        setLoading(false);
        return;
      }
      
      const couponsRef = collection(db, 'coupons');
      const couponsSnapshot = await getDocs(couponsRef);
      const couponsList = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate()
      }));
      setCoupons(couponsList);
      
      // Clear any previous errors if successful
      setError('');
    } catch (err) {
      console.error('Error fetching coupons:', err);
      
      if (err.code === 'permission-denied' || err.message.includes('permission')) {
        setError('You do not have permission to manage coupons. Please contact an administrator.');
      } else {
        setError('Failed to fetch coupons. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const validateCouponData = () => {
    if (!couponCode.trim()) return 'Coupon code is required';
    if (isNaN(discountValue) || Number(discountValue) <= 0) return 'Valid discount value is required';
    if (discountType === 'percentage' && Number(discountValue) > 100) return 'Percentage cannot exceed 100%';
    if (validFrom && validUntil && new Date(validFrom) > new Date(validUntil)) return 'Valid from date must be before valid until date';
    if (minPurchase && (isNaN(minPurchase) || Number(minPurchase) < 0)) return 'Minimum purchase must be a valid number';
    if (maxDiscount && (isNaN(maxDiscount) || Number(maxDiscount) <= 0)) return 'Maximum discount must be a valid number';
    if (usageLimit && (isNaN(usageLimit) || Number(usageLimit) <= 0)) return 'Usage limit must be a valid number';
    return null;
  };
  
  const handleAddCoupon = async () => {
    const validationError = validateCouponData();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if code already exists
      const checkQuery = query(collection(db, 'coupons'), where('code', '==', couponCode.trim().toUpperCase()));
      const existingCoupons = await getDocs(checkQuery);
      
      if (!existingCoupons.empty && !editingId) {
        setError('This coupon code already exists!');
        setLoading(false);
        return;
      }
      
      // Prepare coupon data
      const couponData = {
        code: couponCode.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minPurchase: minPurchase ? Number(minPurchase) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        validFrom: validFrom ? Timestamp.fromDate(new Date(validFrom)) : null,
        validUntil: validUntil ? Timestamp.fromDate(new Date(validUntil)) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        usageCount: editingId ? undefined : 0,
        description,
        status,
        updatedAt: Timestamp.now(),
        createdAt: editingId ? undefined : Timestamp.now()
      };
      
      if (editingId) {
        // Update existing coupon
        await updateDoc(doc(db, 'coupons', editingId), couponData);
        setSuccess('Coupon updated successfully!');
      } else {
        // Add new coupon
        await addDoc(collection(db, 'coupons'), couponData);
        setSuccess('Coupon added successfully!');
      }
      
      // Reset form
      resetForm();
      fetchCoupons();
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError('Failed to save coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setSuccess('Coupon deleted successfully!');
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setError('Failed to delete coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (coupon) => {
    setCouponCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMinPurchase(coupon.minPurchase?.toString() || '');
    setMaxDiscount(coupon.maxDiscount?.toString() || '');
    setValidFrom(coupon.validFrom ? formatDateForInput(coupon.validFrom) : '');
    setValidUntil(coupon.validUntil ? formatDateForInput(coupon.validUntil) : '');
    setUsageLimit(coupon.usageLimit?.toString() || '');
    setDescription(coupon.description || '');
    setStatus(coupon.status);
    setEditingId(coupon.id);
  };
  
  const resetForm = () => {
    setCouponCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinPurchase('');
    setMaxDiscount('');
    setValidFrom('');
    setValidUntil('');
    setUsageLimit('');
    setDescription('');
    setStatus('active');
    setEditingId(null);
  };
  
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  const formatDateForDisplay = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };
  
  const getCouponStatus = (coupon) => {
    const now = new Date();
    
    if (coupon.status === 'inactive') {
      return 'inactive';
    }
    
    if (coupon.validUntil && now > new Date(coupon.validUntil)) {
      return 'expired';
    }
    
    if (coupon.validFrom && now < new Date(coupon.validFrom)) {
      return 'scheduled';
    }
    
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return 'depleted';
    }
    
    return 'active';
  };
  return (
    <Container>
      <Header>{editingId ? 'Edit Coupon' : 'Create New Coupon'}</Header>
      
      {error && (
        <ErrorMessage>
          {error}
          {error.includes('permission') && (
            <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
              To fix this issue:
              <ul style={{ margin: '8px 0 0 20px' }}>
                <li>Make sure you are signed in as an administrator</li>
                <li>Verify your Firestore security rules are set up correctly</li>
                <li>Try refreshing the page or signing out and signing back in</li>
              </ul>
            </div>
          )}
        </ErrorMessage>
      )}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <FormGroup>
        <Label>Coupon Code*</Label>
        <Input 
          type="text" 
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="e.g. SUMMER20" 
        />
      </FormGroup>
      
      <InputGroup>
        <FormGroup>
          <Label>Discount Type*</Label>
          <Select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Discount Value*</Label>
          <Input
            type="number"
            min="0"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={discountType === 'percentage' ? "e.g. 20" : "e.g. 500"}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Min Purchase</Label>
          <Input
            type="number"
            min="0"
            value={minPurchase}
            onChange={(e) => setMinPurchase(e.target.value)}
            placeholder="e.g. 1000"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Max Discount</Label>
          <Input
            type="number"
            min="0"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            placeholder="e.g. 2000"
          />
        </FormGroup>
      </InputGroup>
      
      <InputGroup>
        <FormGroup>
          <Label>Valid From</Label>
          <Input
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Valid Until</Label>
          <Input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Usage Limit</Label>
          <Input
            type="number"
            min="1"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="e.g. 100"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FormGroup>
      </InputGroup>
      
      <FormGroup>
        <Label>Description</Label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Summer sale discount"
        />
      </FormGroup>
      
      <ButtonGroup>
        <Button 
          onClick={handleAddCoupon}
          disabled={loading}
        >
          {editingId ? <FiSave /> : <FiPlus />}
          {editingId ? 'Update Coupon' : 'Add Coupon'}
        </Button>
        
        {editingId && (
          <Button 
            color="#64748b" 
            hoverColor="#475569" 
            onClick={resetForm}
          >
            <FiX />
            Cancel
          </Button>
        )}
      </ButtonGroup>
      
      <Header>All Coupons</Header>
      <CouponTable>
        <TableHead>
          <tr>
            <TableHeader>Code</TableHeader>
            <TableHeader>Discount</TableHeader>
            <TableHeader>Validity</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Usage</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {coupons.map(coupon => (
            <TableRow key={coupon.id}>
              <TableCell>
                <strong>{coupon.code}</strong>
                {coupon.description && <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>{coupon.description}</p>}
              </TableCell>
              <TableCell>
                {discountType === 'percentage' 
                  ? `${coupon.discountValue}%` 
                  : `₹${coupon.discountValue}`}
                  
                {coupon.minPurchase && <div style={{ fontSize: '14px' }}>Min: ₹{coupon.minPurchase}</div>}
                {coupon.maxDiscount && <div style={{ fontSize: '14px' }}>Max: ₹{coupon.maxDiscount}</div>}
              </TableCell>
              <TableCell>
                {coupon.validFrom ? formatDateForDisplay(coupon.validFrom) : 'Any time'} 
                {' - '}
                {coupon.validUntil ? formatDateForDisplay(coupon.validUntil) : 'No expiry'}
              </TableCell>
              <TableCell>
                <StatusBadge status={getCouponStatus(coupon)}>
                  {getCouponStatus(coupon).charAt(0).toUpperCase() + getCouponStatus(coupon).slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                {coupon.usageCount || 0} 
                {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                <div style={{ fontSize: '14px' }}>
                  {coupon.usageLimit 
                    ? `${Math.round((coupon.usageCount || 0) / coupon.usageLimit * 100)}%`
                    : '∞'}
                </div>
              </TableCell>
              <TableCell>
                <ActionButton 
                  color="#4285F4"
                  onClick={() => handleEdit(coupon)}
                >
                  <FiEdit />
                </ActionButton>
                <ActionButton 
                  color="#F44336"
                  onClick={() => handleDelete(coupon.id)}
                >
                  <FiTrash2 />
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>
                No coupons found. Add your first coupon above!
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </CouponTable>
    </Container>
  );
};

export default CouponAdmin;
