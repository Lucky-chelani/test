import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiXCircle, FiTag, FiLoader } from 'react-icons/fi';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;


const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CouponContainer = styled.div`
  background: ${({ theme }) => theme?.background || '#e8c1b030'};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme?.borderColor || '#e0e0e0'};
  margin-bottom: 20px;
`;

const CouponInputSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme?.mainColor || '#4CAF50'}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme?.mainColor || '#4CAF50'};
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CouponLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme?.textColor || '#333'};
`;

const CouponForm = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 2px solid ${({ theme }) => theme?.borderColor || '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 1.5px;
  font-weight: 600;
  text-transform: uppercase;
  outline: none;
  transition: border-color 0.3s ease;
  background: ${({ theme }) => theme?.inputBg || '#f9f9f9'};
  color: ${({ theme }) => theme?.textColor || '#333'};

  &:focus {
    border-color: ${({ theme }) => theme?.mainColor || '#4CAF50'};
  }

  &::placeholder {
    font-weight: 400;
    letter-spacing: 0.5px;
    color: #aaa;
  }
`;

const ApplyButton = styled.button`
  padding: 10px 24px;
  background: ${({ theme }) => theme?.mainColor || '#4CAF50'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme?.hoverColor || '#43A047'};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
`;

const AppliedCouponSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme?.mainColor || '#4CAF50'}10;
  border: 1px dashed ${({ theme }) => theme?.mainColor || '#4CAF50'};
  border-radius: 10px;
`;

const SuccessIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme?.mainColor || '#4CAF50'}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme?.mainColor || '#4CAF50'};
  flex-shrink: 0;
`;

const CouponInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CouponCodeTag = styled.span`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${({ theme }) => theme?.mainColor || '#4CAF50'};
  text-transform: uppercase;
`;

const SaveAmount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme?.mainColor || '#4CAF50'};
`;

const CouponMeta = styled.span`
  font-size: 12px;
  color: #888;
  line-height: 1.4;
`;

const RemoveLink = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: #e74c3c15;
    text-decoration: underline;
  }
`;

const CouponMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-top: 10px;
  background: ${({ type }) => type === 'error' ? '#fde8e8' : '#e8f5e9'};
  color: ${({ type }) => type === 'error' ? '#e74c3c' : '#2e7d32'};
`;



const CouponHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
  color: ${props => props.theme.textColor || props.theme.mainColor || '#5390D9'};
  font-weight: 600;
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
  color: #000000;
  margin-bottom: 5px;
`;

const DiscountDescription = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const CouponTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #000000;
  font-size: 13px;
  margin-top: 10px;
`;

const CouponValidity = styled.div`
  font-size: 13px;
  color: rgba(6, 5, 5, 0.6);
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
    {!activeCoupon ? (
      <CouponInputSection>
        <IconWrapper>
          <FiTag size={22} />
        </IconWrapper>
        
        <ContentWrapper>
          <CouponLabel>Apply Coupon</CouponLabel>
          
          <CouponForm onSubmit={handleApplyCoupon}>
            <CouponInput
              type="text"
              placeholder="Enter code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              theme={theme}
            />
            <ApplyButton 
              type="submit" 
              disabled={loading || !couponCode.trim()} 
              theme={theme}
            >
              {loading ? <FiLoader className="spin" size={18} /> : 'Apply'}
            </ApplyButton>
          </CouponForm>
          
          {error && (
            <ErrorText>
              <FiXCircle size={14} /> {error}
            </ErrorText>
          )}
        </ContentWrapper>
      </CouponInputSection>
    ) : (
      <AppliedCouponSection theme={theme}>
        <SuccessIconWrapper>
          <FiCheckCircle size={24} />
        </SuccessIconWrapper>
        
        <CouponInfo>
          <CouponCodeTag>{activeCoupon.code}</CouponCodeTag>
          
          <SaveAmount theme={theme}>
            You save {activeCoupon.discountType === 'percentage' 
              ? `${activeCoupon.discountValue}%` 
              : `₹${activeCoupon.discountValue}`}
          </SaveAmount>
          
          <CouponMeta>
            {activeCoupon.description}
            {activeCoupon.validUntil && (
              <> • Expires {formatDate(activeCoupon.validUntil)}</>
            )}
          </CouponMeta>
        </CouponInfo>
        
        <RemoveLink onClick={handleRemoveCoupon}>
          Remove
        </RemoveLink>
      </AppliedCouponSection>
    )}
  </CouponContainer>
);
};

export default CouponSection;
