import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiXCircle, FiTag, FiLoader } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CouponContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: ${props => props.theme.gradientLight || 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid ${props => props.theme.inputBorder || 'rgba(255, 255, 255, 0.2)'};
`;

const CouponHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
  color: ${props => props.theme.textColor || props.theme.mainColor || '#5390D9'};
  font-weight: 600;
`;

const CouponForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 2px solid ${props => props.theme.inputBorder || 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.theme.inputBackground || 'rgba(255, 255, 255, 0.07)'};
  border-radius: 8px;
  color: ${props => props.theme.inputText || '#111'};
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.mainColor || '#5390D9'};
    box-shadow: 0 0 0 2px rgba(83, 144, 217, 0.2);
    background: ${props => props.theme.inputBackground || '#ffffff'};
  }
  
  &::placeholder {
    color: ${props => props.theme.placeholderColor || 'rgba(255, 255, 255, 0.4)'};
  }
  
  &:hover:not(:focus) {
    border-color: ${props => props.theme.mainColor || '#5390D9'};
    transform: translateY(-1px);
  }
`;

const ApplyButton = styled.button`
  padding: 0 20px;
  background-color: ${props => props.theme.mainColor || '#5390D9'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
  
  &:hover {
    background-color: ${props => props.theme.hoverColor || '#3a7cc7'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
  }

  .spin {
    animation: ${rotate} 1s linear infinite;
  }
`;

const CouponMessage = styled.div`
  margin-top: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  background-color: ${props => 
    props.type === 'success' ? 'rgba(80, 200, 120, 0.2)' :
    props.type === 'error' ? 'rgba(255, 100, 100, 0.2)' : 'transparent'};
  border-left: 3px solid ${props => 
    props.type === 'success' ? '#4CAF50' :
    props.type === 'error' ? '#F44336' : 'transparent'};
  color: ${props => 
    props.type === 'success' ? '#A5D6A7' :
    props.type === 'error' ? '#EF9A9A' : '#fff'};
  display: ${props => props.message ? 'flex' : 'none'};
  align-items: center;
  gap: 10px;
`;

const DiscountInfo = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: ${props => props.theme.gradientLight || 'linear-gradient(135deg, rgba(83, 144, 217, 0.2), rgba(105, 106, 182, 0.2))'};
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DiscountValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
`;

const DiscountDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const CouponTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  margin-top: 10px;
`;

const CouponValidity = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 5px;
`;

const CouponSection = ({ orderTotal, onApplyCoupon, theme }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const couponRef = query(
        collection(db, 'coupons'), 
        where('code', '==', couponCode.trim().toUpperCase())
      );
      
      const couponSnapshot = await getDocs(couponRef);
      
      if (couponSnapshot.empty) {
        setError('Invalid coupon code');
        setActiveCoupon(null);
        if (onApplyCoupon) onApplyCoupon(null);
        return;
      }
      
      const couponData = {
        id: couponSnapshot.docs[0].id,
        ...couponSnapshot.docs[0].data()
      };
      
      // Convert Firestore timestamps to Date objects
      if (couponData.validFrom) {
        couponData.validFrom = couponData.validFrom.toDate();
      }
      if (couponData.validUntil) {
        couponData.validUntil = couponData.validUntil.toDate();
      }
      
      // Validate coupon status
      if (couponData.status === 'inactive') {
        setError('This coupon is inactive');
        setActiveCoupon(null);
        if (onApplyCoupon) onApplyCoupon(null);
        return;
      }
      
      // Validate dates
      const now = new Date();
      
      if (couponData.validFrom && now < couponData.validFrom) {
        setError(`This coupon is not valid yet. It will be active from ${couponData.validFrom.toLocaleDateString()}`);
        setActiveCoupon(null);
        if (onApplyCoupon) onApplyCoupon(null);
        return;
      }
      
      if (couponData.validUntil && now > couponData.validUntil) {
        setError(`This coupon has expired on ${couponData.validUntil.toLocaleDateString()}`);
        setActiveCoupon(null);
        if (onApplyCoupon) onApplyCoupon(null);
        return;
      }
      
      // Validate usage limit
      if (couponData.usageLimit && couponData.usageCount >= couponData.usageLimit) {
        setError('This coupon has reached its usage limit');
        setActiveCoupon(null);
        if (onApplyCoupon) onApplyCoupon(null);
        return;
      }
      
      // Validate minimum purchase
      if (couponData.minPurchase && orderTotal < couponData.minPurchase) {
        setError(`This coupon requires a minimum purchase of ₹${couponData.minPurchase}`);
        setActiveCoupon(null);
        if (onApplyCoupon) onApplyCoupon(null);
        return;
      }
      
      // Calculate discount
      let discountAmount = 0;
      
      if (couponData.discountType === 'percentage') {
        discountAmount = (orderTotal * couponData.discountValue) / 100;
        
        // Apply max discount if specified
        if (couponData.maxDiscount && discountAmount > couponData.maxDiscount) {
          discountAmount = couponData.maxDiscount;
        }
      } else {
        // Fixed discount
        discountAmount = couponData.discountValue;
        
        // Make sure discount doesn't exceed order total
        if (discountAmount > orderTotal) {
          discountAmount = orderTotal;
        }
      }
      
      // Set active coupon with calculated discount
      const activeCouponWithDiscount = {
        ...couponData,
        calculatedDiscount: discountAmount
      };
      
      setActiveCoupon(activeCouponWithDiscount);
      setSuccess('Coupon applied successfully!');
      
      // Notify parent component
      if (onApplyCoupon) {
        onApplyCoupon(activeCouponWithDiscount);
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError('Failed to apply coupon. Please try again.');
      setActiveCoupon(null);
      if (onApplyCoupon) onApplyCoupon(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setActiveCoupon(null);
    setError('');
    setSuccess('');
    
    // Notify parent component
    if (onApplyCoupon) {
      onApplyCoupon(null);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <CouponContainer theme={theme}>
      <CouponHeader theme={theme}>
        <FiTag size={20} />
        <h3>Have a coupon?</h3>
      </CouponHeader>
      
      {!activeCoupon ? (
        <>
          <CouponForm onSubmit={handleApplyCoupon}>
            <CouponInput
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              theme={theme}
            />
            <ApplyButton 
              type="submit" 
              disabled={loading || !couponCode.trim()} 
              theme={theme}
            >
              {loading ? <FiLoader className="spin" /> : 'Apply'}
            </ApplyButton>
          </CouponForm>
          
          {error && (
            <CouponMessage type="error" message={error}>
              <FiXCircle />
              {error}
            </CouponMessage>
          )}
        </>
      ) : (
        <DiscountInfo theme={theme}>
          <DiscountValue>
            {activeCoupon.discountType === 'percentage' 
              ? `${activeCoupon.discountValue}% OFF` 
              : `₹${activeCoupon.discountValue} OFF`}
          </DiscountValue>
          
          <DiscountDescription>
            {activeCoupon.description || `Coupon code ${activeCoupon.code} applied successfully.`}
          </DiscountDescription>
          
          <CouponValidity>
            {activeCoupon.validUntil 
              ? `Valid until ${formatDate(activeCoupon.validUntil)}` 
              : 'No expiration date'}
          </CouponValidity>
          
          <CouponTag>
            <FiTag size={14} />
            {activeCoupon.code}
          </CouponTag>
          
          <ApplyButton 
            onClick={handleRemoveCoupon} 
            theme={{
              mainColor: '#777',
              hoverColor: '#555'
            }}
            style={{ marginTop: '15px' }}
          >
            <FiXCircle />
            Remove
          </ApplyButton>
        </DiscountInfo>
      )}
      
      {success && !error && !activeCoupon && (
        <CouponMessage type="success" message={success}>
          <FiCheckCircle />
          {success}
        </CouponMessage>
      )}
    </CouponContainer>
  );
};

export default CouponSection;
