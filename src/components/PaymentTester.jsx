import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadRazorpayScript } from '../services/payment/razorpay';
import { processPayment, handlePaymentSuccess, handlePaymentFailure } from '../services/payment';
import { auth } from '../firebase';
import CouponSection from './CouponSection';

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #3399cc;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2388bb;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  margin-top: 20px;
  
  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
`;

const PaymentTester = () => {
  const [amount, setAmount] = useState('100');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  
  // Coupon related states
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [originalAmount, setOriginalAmount] = useState('100');
  const [discountAmount, setDiscountAmount] = useState(0);
    // Handle coupon application
  const handleApplyCoupon = (coupon) => {
    if (coupon) {
      setActiveCoupon(coupon);
      setDiscountAmount(coupon.calculatedDiscount);
      
      // Update the amount after discount
      const newAmount = Math.max(parseFloat(originalAmount) - coupon.calculatedDiscount, 0).toFixed(2);
      setAmount(newAmount);
      
      setMessage(`Coupon applied! You saved ₹${coupon.calculatedDiscount}`);
      setMessageType('success');
    } else {
      setActiveCoupon(null);
      setDiscountAmount(0);
      setAmount(originalAmount);
      setMessage(null);
    }
  };
  
  // Update original amount whenever amount changes from input
  useEffect(() => {
    if (!activeCoupon) {
      setOriginalAmount(amount);
    }
  }, [amount, activeCoupon]);
  
  useEffect(() => {
    // Load Razorpay script when component mounts
    const loadScript = async () => {
      const isLoaded = await loadRazorpayScript();
      setIsRazorpayLoaded(isLoaded);
      if (!isLoaded) {
        setMessage('Failed to load payment gateway. Please try again later.');
        setMessageType('error');
      }
    };
    
    loadScript();
    
    // Auto-fill user data if logged in
    if (auth.currentUser) {
      setName(auth.currentUser.displayName || '');
      setEmail(auth.currentUser.email || '');
    }
  }, []);
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isRazorpayLoaded) {
      setMessage('Payment gateway not loaded. Please refresh the page and try again.');
      setMessageType('error');
      return;
    }
    
    // Enhanced validation
    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount greater than 0.');
      setMessageType('error');
      return;
    }
    
    if (!name || !email || !phone) {
      setMessage('Please fill in all personal information fields.');
      setMessageType('error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }
    
    // Phone validation - simple check for now
    if (phone.length < 10) {
      setMessage('Please enter a valid phone number.');
      setMessageType('error');
      return;
    }
    
    setIsProcessing(true);
    setMessage('Processing payment request...');
    setMessageType('');
    
    try {      // Create mock trek data for testing - ensure all required fields exist
      const mockTrek = {
        id: 'test-trek-123',
        name: 'Test Trek',
        location: 'Test Location',
        numericPrice: parseInt(originalAmount) || 100,
        price: `₹${parseInt(originalAmount) || 100}`,
        image: '/m.png',
        duration: '1 day',
        difficulty: 'Easy',
        capacity: 10
      };
      
      // Create mock booking details
      const mockBookingDetails = {
        name,
        email,
        contactNumber: phone,
        participants: 1,
        startDate: new Date().toISOString().split('T')[0],
        // Include coupon information if available
        coupon: activeCoupon ? {
          id: activeCoupon.id,
          code: activeCoupon.code,
          discount: discountAmount,
          discountType: activeCoupon.discountType,
          originalAmount: parseFloat(originalAmount),
          finalAmount: parseFloat(amount)
        } : null
      };
        // Validate coupon one more time before proceeding
      if (activeCoupon) {
        // Check if coupon is still valid (in case it expired during session)
        const couponValidationMessage = validateCouponBeforePayment();
        
        if (couponValidationMessage) {
          setMessage(couponValidationMessage);
          setMessageType('error');
          setIsProcessing(false);
          return;
        }
      }
      
      const result = await processPayment(mockTrek, mockBookingDetails);
      
      if (result.success) {
        setBookingId(result.orderId);
        
        // If we have a coupon, store it in session to show in the receipt later
        if (activeCoupon) {
          try {
            sessionStorage.setItem('lastAppliedCoupon', JSON.stringify({
              code: activeCoupon.code,
              discount: discountAmount,
              originalAmount: parseFloat(originalAmount),
              finalAmount: parseFloat(amount)
            }));
          } catch (err) {
            // Ignore session storage errors
            console.log('Could not save coupon to session:', err);
          }
        }
        
        setMessage('Payment window opened. Complete the payment process in the Razorpay window.');
      } else {
        setMessage(`Payment initialization failed: ${result.error}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Payment test error:', error);
      setMessage(`Error: ${error.message || 'Unknown error occurred'}`);
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Validate coupon before proceeding with payment
  const validateCouponBeforePayment = () => {
    if (!activeCoupon) return null;
    
    // Check if the discount amount makes sense
    if (discountAmount <= 0) {
      return 'Invalid coupon discount amount. Please remove and reapply the coupon.';
    }
    
    // Check if discount is greater than original amount
    if (discountAmount >= parseFloat(originalAmount)) {
      return 'Discount amount cannot be greater than or equal to the original amount.';
    }
    
    // Check if the final amount makes sense
    if (parseFloat(amount) < 0 || isNaN(parseFloat(amount))) {
      return 'Invalid final amount after discount. Please remove and reapply the coupon.';
    }
    
    return null; // No validation error
  };
  // Set up handlers for Razorpay response
  useEffect(() => {
    const handleSuccess = async function(response) {
      try {
        setMessage('Processing payment verification...');
        
        // Handle successful payment
        if (bookingId) {        // If we have a coupon and it's valid, make sure the coupon data is included in the response
        if (activeCoupon) {
          if (!response.coupon) {
            response.coupon = {
              id: activeCoupon.id,
              code: activeCoupon.code,
              discount: discountAmount,
              discountType: activeCoupon.discountType,
              originalAmount: parseFloat(originalAmount),
              finalAmount: parseFloat(amount)
            };
          }
        }
          
          const result = await handlePaymentSuccess(bookingId, response);
          
          // Create a detailed success message with receipt info
          let successMessage = 'Payment successful! Your test payment was completed.';
          if (activeCoupon) {
            successMessage += `\n\nAmount: ₹${originalAmount}\nDiscount (${activeCoupon.code}): -₹${discountAmount.toFixed(2)}\nFinal Amount: ₹${amount}`;
          }
          
          setMessage(successMessage);
          setMessageType('success');
          
          // Clear the coupon after successful payment
          setActiveCoupon(null);
          setDiscountAmount(0);
          setAmount(originalAmount);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setMessage(`Payment verification failed: ${error.message || 'Unknown error'}`);
        setMessageType('error');
      }
    };
    
    const handleFailure = async function(error) {
      try {
        // Handle payment failure
        if (bookingId) {
          await handlePaymentFailure(bookingId, error);
        }
        
        setMessage(`Payment failed: ${error.description || error.message || 'Unknown error'}`);
        setMessageType('error');
      } catch (err) {
        console.error('Error handling payment failure:', err);
        setMessage(`Payment failed: ${error.description || error.message || 'Unknown error'}`);
        setMessageType('error');
      }
    };
  
    // Setting up global handlers for Razorpay
    window.onRazorpaySuccess = handleSuccess;
    window.onRazorpayFailure = handleFailure;
    
    // Cleanup function
    return () => {
      window.onRazorpaySuccess = null;
      window.onRazorpayFailure = null;
    };
  }, [bookingId]); // Re-establish handlers if bookingId changes
    return (
    <Container>
      <Title>Razorpay Payment Test</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Amount (INR)</Label>
          <Input 
            type="number" 
            min="1" 
            value={originalAmount} 
            onChange={(e) => {
              const newAmount = e.target.value;
              setOriginalAmount(newAmount);
              
              // If there's an active coupon, recalculate the discount
              if (activeCoupon) {
                let discount = 0;
                if (activeCoupon.discountType === 'percentage') {
                  discount = (parseFloat(newAmount) * activeCoupon.discountValue / 100);
                  if (activeCoupon.maxDiscount && discount > activeCoupon.maxDiscount) {
                    discount = activeCoupon.maxDiscount;
                  }
                } else {
                  discount = activeCoupon.discountValue;
                  if (discount > parseFloat(newAmount)) {
                    discount = parseFloat(newAmount);
                  }
                }
                
                setDiscountAmount(discount);
                setAmount(Math.max(parseFloat(newAmount) - discount, 0).toFixed(2));
              } else {
                setAmount(newAmount);
              }
            }}
            placeholder="Enter amount in INR"
          />
        </FormGroup>
        
        {/* Display the coupon section */}
        <CouponSection 
          orderTotal={parseFloat(originalAmount)} 
          onApplyCoupon={handleApplyCoupon}
          theme={{ 
            mainColor: '#3399cc', 
            hoverColor: '#2388bb',
            gradientLight: 'linear-gradient(135deg, rgba(51, 153, 204, 0.1), rgba(33, 122, 168, 0.1))'
          }}
        />
          {/* Display price breakdown if discount is applied */}
        {activeCoupon && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontWeight: 'bold' }}>Receipt Preview</span>
              <span style={{ 
                fontSize: '12px', 
                background: '#e6f7ff', 
                color: '#0066cc', 
                padding: '3px 8px',
                borderRadius: '50px',
                display: 'inline-block' 
              }}>
                Coupon Applied
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Original amount:</span>
              <span>₹{originalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#2e7d32' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>Discount ({activeCoupon.code}):</span>
                <span style={{ 
                  fontSize: '11px', 
                  background: '#e8f5e9', 
                  color: '#2e7d32', 
                  padding: '2px 6px',
                  borderRadius: '50px',
                  display: 'inline-block' 
                }}>
                  {activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}%` : 'Fixed'}
                </span>
              </span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ddd' }}>
              <span>Final amount:</span>
              <span style={{ fontSize: '1.1em', color: '#0066cc' }}>₹{amount}</span>
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
              This discount will be applied when you complete the payment
            </div>
          </div>
        )}
        
        <FormGroup>
          <Label>Name</Label>
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormGroup>
        <FormGroup>
          <Label>Phone</Label>
          <Input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </FormGroup>
        <Button 
          type="submit" 
          disabled={isProcessing || !isRazorpayLoaded}
        >
          {isProcessing ? 'Processing...' : 'Test Payment'}
        </Button>
      </Form>
      {message && (
        <Message className={messageType}>
          {message}
        </Message>
      )}
    </Container>
  );
};

export default PaymentTester;
