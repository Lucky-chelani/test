import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadRazorpayScript } from '../services/payment/razorpay';
import { processPayment, handlePaymentSuccess, handlePaymentFailure } from '../services/payment';
import { auth } from '../firebase';

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
    
    // Basic validation
    if (!amount || parseInt(amount) <= 0 || !name || !email || !phone) {
      setMessage('Please fill in all fields with valid values.');
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
        numericPrice: parseInt(amount) || 100,
        price: `₹${parseInt(amount) || 100}`,
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
        startDate: new Date().toISOString().split('T')[0]
      };
      
      const result = await processPayment(mockTrek, mockBookingDetails);
      
      if (result.success) {
        setBookingId(result.orderId);
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
    // Set up handlers for Razorpay response
  useEffect(() => {
    const handleSuccess = async function(response) {
      try {
        setMessage('Processing payment verification...');
        
        // Handle successful payment
        if (bookingId) {
          await handlePaymentSuccess(bookingId, response);
          setMessage('Payment successful! Your test payment was completed.');
          setMessageType('success');
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
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in INR"
          />
        </FormGroup>
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
