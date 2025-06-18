// Debug version of the payment service for testing purposes
// This version bypasses Firebase security rules by using mock data

import { loadRazorpayScript } from './razorpay';

/**
 * Mock Razorpay order creation (for testing only)
 * @param {Object} orderData - Order details 
 * @returns {Promise<Object>} Mock order details
 */
const createMockOrder = async (orderData) => {
  console.log('Creating mock order with data:', orderData);
  
  // Generate a random order ID
  const orderId = 'order_' + Math.random().toString(36).substring(2, 15);
  
  // Return a mock order object
  return {
    id: orderId,
    entity: 'order',
    amount: orderData.amount * 100, // Convert to paise
    amount_paid: 0,
    amount_due: orderData.amount * 100,
    currency: orderData.currency || 'INR',
    receipt: orderData.receipt || orderId,
    status: 'created',
    created_at: Date.now(),
    notes: orderData.notes || {}
  };
};

/**
 * Process payment using mock services (for testing)
 * @param {Object} trekData - Trek details
 * @param {Object} bookingDetails - Booking details
 * @returns {Promise<Object>} - Payment result
 */
export const processTestPayment = async (trekData, bookingDetails) => {
  try {
    console.log('DEBUG MODE: Processing test payment');
    
    // Load Razorpay script
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Create mock order data
    const orderData = {
      userId: 'test-user-id',
      userEmail: bookingDetails.email || 'test@example.com',
      userName: bookingDetails.name || 'Test User',
      trekId: trekData.id || 'test-trek-id',
      trekName: trekData.name || 'Test Trek',
      amount: (trekData.numericPrice || 100) * (bookingDetails.participants || 1),
      currency: 'INR',
      participants: bookingDetails.participants || 1,
      startDate: bookingDetails.startDate || new Date().toISOString().split('T')[0],
      contactNumber: bookingDetails.contactNumber || '1234567890',
      specialRequests: bookingDetails.specialRequests || '',
      bookingDate: new Date().toISOString()
    };
    
    // Create a mock order
    const order = await createMockOrder(orderData);
    
    // Configure Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: 'Trovia Treks (TEST)',
      description: `TEST Booking for ${trekData.name || 'Trek'}`,
      order_id: order.id,
      prefill: {
        name: bookingDetails.name || 'Test User',
        email: bookingDetails.email || 'test@example.com',
        contact: bookingDetails.contactNumber || '1234567890'
      },
      notes: {
        trekId: trekData.id || 'test-trek-id',
        bookingId: order.id,
        userId: 'test-user-id',
        participants: bookingDetails.participants || 1,
        isTestMode: true
      },
      theme: {
        color: '#3399cc'
      },
      handler: function(response) {
        console.log('TEST MODE: Payment successful', response);
        if (typeof window.onRazorpaySuccess === 'function') {
          window.onRazorpaySuccess(response);
        }
        return response;
      }
    };
    
    // Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function(response) {
      console.log('TEST MODE: Payment failed', response);
      if (typeof window.onRazorpayFailure === 'function') {
        window.onRazorpayFailure(response.error);
      }
    });
    
    rzp.open();
    
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      isTestMode: true
    };
  } catch (error) {
    console.error('TEST MODE: Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed',
      isTestMode: true
    };
  }
};

/**
 * Handle successful test payment
 * @param {string} bookingId - Booking ID
 * @param {Object} paymentResponse - Razorpay payment response
 * @returns {Promise<Object>} - Mock updated booking
 */
export const handleTestPaymentSuccess = async (bookingId, paymentResponse) => {
  console.log('DEBUG MODE: Handling test payment success', { bookingId, paymentResponse });
  
  // Return mock booking data
  return {
    id: bookingId,
    paymentId: paymentResponse.razorpay_payment_id,
    paymentOrderId: paymentResponse.razorpay_order_id,
    paymentSignature: paymentResponse.razorpay_signature,
    paymentStatus: 'completed',
    status: 'confirmed',
    updatedAt: new Date().toISOString(),
    isTestMode: true
  };
};

/**
 * Handle failed test payment
 * @param {string} bookingId - Booking ID
 * @param {Object} error - Error details
 * @returns {Promise<void>}
 */
export const handleTestPaymentFailure = async (bookingId, error) => {
  console.log('DEBUG MODE: Handling test payment failure', { bookingId, error });
  // Nothing to do in test mode, just log the error
};
