import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiX, FiCalendar, FiUser, FiPhone, FiMessageSquare, FiCreditCard, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { processBookingPayment, completeBookingPayment, handleBookingPaymentFailure } from '../utils/bookingService';
import { loadRazorpayScript } from '../services/payment/razorpay';
import { auth } from '../firebase';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: ${scaleIn} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TrekInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const TrekImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
`;

const TrekDetails = styled.div`
  flex: 1;
`;

const TrekName = styled.h3`
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const TrekLocation = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.95rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #666;
  }
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  outline: none;

  &:focus {
    border-color: #3399cc;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  outline: none;
  background: white;

  &:focus {
    border-color: #3399cc;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  outline: none;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: #3399cc;
  }
`;

const PriceSummary = styled.div`
  margin-top: 1rem;
  background: #f9f9f9;
  padding: 1.25rem;
  border-radius: 8px;
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1rem;
`;

const PriceTotal = styled(PriceItem)`
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-weight: 700;
  font-size: 1.2rem;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 1;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  border: none;
  color: #444;

  &:hover {
    background: #e0e0e0;
  }
`;

const ProceedButton = styled(Button)`
  background: #3399cc;
  border: none;
  color: white;
  min-width: 140px;

  &:hover {
    background: #2388bb;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #a0a0a0;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaymentButton = styled(ProceedButton)`
  background: #5cb85c;

  &:hover {
    background: #4cae4c;
  }
`;

const ErrorMessage = styled.div`
  color: #d9534f;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LoadingIndicator = styled.div`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Main Component
const BookingModal = ({ isOpen, onClose, trek, onBookingSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: '',
    participants: 1,
    name: '',
    email: '',
    contactNumber: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Get the number of days from the start of the current month to create a minimum date
  const today = new Date();
  const minBookingDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  useEffect(() => {
    const getCurrentUser = async () => {
      if (auth.currentUser) {
        setFormData(prevData => ({
          ...prevData, 
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
        }));
      }
    };
    
    if (isOpen) {
      getCurrentUser();
      
      // Load Razorpay script when modal opens
      loadRazorpayScript().catch(err => {
        console.error("Failed to load Razorpay script:", err);
        setPaymentError("Failed to load payment gateway. Please try again.");
      });
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep(2);
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = trek?.numericPrice || parseInt(trek?.price?.replace(/[^0-9]/g, '')) || 0;
    return basePrice * formData.participants;
  };

  const handlePaymentProcess = async () => {
    try {
      setIsProcessingPayment(true);
      setPaymentError(null);
      
      // Process payment through Razorpay
      const paymentResult = await processBookingPayment(trek, {
        ...formData,
        amount: calculateTotalPrice()
      });
      
      if (paymentResult.success) {
        setBookingId(paymentResult.orderId);
        
        // Razorpay will open its payment window automatically
        // We'll handle success in a callback from Razorpay
      } else {
        setPaymentError(paymentResult.error || "Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setIsProcessingPayment(true);
      
      // Verify and complete the payment
      await completeBookingPayment(bookingId, response);
      
      // Show success message
      setPaymentSuccess(true);
      
      // Notify parent component
      if (onBookingSuccess) {
        onBookingSuccess(bookingId);
      }
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        // Reset form state
        setStep(1);
        setFormData({
          startDate: '',
          participants: 1,
          name: '',
          email: '',
          contactNumber: '',
          specialRequests: ''
        });
        setPaymentSuccess(false);
        setBookingId(null);
      }, 3000);
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentError(error.message || "Failed to verify payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentFailure = async (error) => {
    try {
      if (bookingId) {
        await handleBookingPaymentFailure(bookingId, error);
      }
      setPaymentError(error.description || error.message || "Payment failed");
    } catch (err) {
      console.error("Error handling payment failure:", err);
      setPaymentError("Payment failed: " + (error.description || error.message || "Unknown error"));
    }
  };
  // Set up global handlers for Razorpay response
  useEffect(() => {
    // Setting up global handlers for Razorpay
    window.onRazorpaySuccess = function(response) {
      handlePaymentSuccess(response);
    };

    window.onRazorpayFailure = function(response) {
      handlePaymentFailure(response);
    };
    
    // Cleanup function to remove handlers when component unmounts
    return () => {
      window.onRazorpaySuccess = null;
      window.onRazorpayFailure = null;
    };
  }, [bookingId]); // Re-establish handlers if bookingId changes

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{step === 1 ? 'Book Your Trek' : 'Payment Details'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {/* Trek Information */}
          <TrekInfo>
            <TrekImage src={trek?.image} alt={trek?.name} />
            <TrekDetails>
              <TrekName>{trek?.name}</TrekName>
              <TrekLocation>{trek?.location}</TrekLocation>
            </TrekDetails>
          </TrekInfo>
          
          {/* Booking Form - Step 1 */}
          {step === 1 && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <FiCalendar />
                  Start Date
                </Label>
                <Input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={minBookingDate}
                />
                {errors.startDate && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.startDate}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiUser />
                  Number of Participants
                </Label>
                <Select 
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiUser />
                  Full Name
                </Label>
                <Input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.name}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiUser />
                  Email
                </Label>
                <Input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.email}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiPhone />
                  Contact Number
                </Label>
                <Input 
                  type="tel" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
                {errors.contactNumber && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.contactNumber}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiMessageSquare />
                  Special Requests (Optional)
                </Label>
                <Textarea 
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requirements or requests"
                />
              </FormGroup>
            </Form>
          )}
          
          {/* Payment Section - Step 2 */}
          {step === 2 && (
            <>
              <PriceSummary>
                <PriceItem>
                  <span>Trek Fee</span>
                  <span>₹{trek?.numericPrice} x {formData.participants}</span>
                </PriceItem>
                <PriceTotal>
                  <span>Total</span>
                  <span>₹{calculateTotalPrice()}</span>
                </PriceTotal>
              </PriceSummary>
              
              {/* Payment Status Messages */}
              {paymentError && (
                <ErrorMessage>
                  <FiAlertCircle size={20} />
                  {paymentError}
                </ErrorMessage>
              )}
              
              {paymentSuccess && (
                <SuccessMessage>
                  <FiCheck size={20} />
                  Payment successful! Your booking is confirmed.
                </SuccessMessage>
              )}
            </>
          )}
        </ModalBody>
        
        <ModalFooter>
          {step === 1 ? (
            <>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <ProceedButton type="button" onClick={handleSubmit}>
                Continue to Payment
              </ProceedButton>
            </>
          ) : (
            <>
              <CancelButton type="button" onClick={() => setStep(1)}>
                Back
              </CancelButton>
              <PaymentButton 
                type="button" 
                onClick={handlePaymentProcess}
                disabled={isProcessingPayment || paymentSuccess}
              >
                {isProcessingPayment ? (
                  <LoadingIndicator />
                ) : paymentSuccess ? (
                  <>
                    <FiCheck />
                    Paid
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    Pay Now
                  </>
                )}
              </PaymentButton>
            </>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BookingModal;
