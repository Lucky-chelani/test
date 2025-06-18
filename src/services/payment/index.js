import { 
  loadRazorpayScript, 
  createRazorpayOrder, 
  initializeRazorpayPayment, 
  verifyAndCompletePayment,
  savePaymentFailureDetails
} from './razorpay';
import { debugRazorpayIntegration, validateFirestoreData } from './debugUtils';
import { auth, db } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Process payment for a trek booking
 * @param {Object} trekData - Trek details
 * @param {Object} bookingDetails - Booking details
 * @returns {Promise<Object>} - Payment result
 */
export const processPayment = async (trekData, bookingDetails) => {
  try {
    console.group('📊 Payment Processing');
    console.log('Trek Data:', trekData);
    console.log('Booking Details:', bookingDetails);
    
    // Debug Razorpay integration
    const debugInfo = debugRazorpayIntegration();
    if (!debugInfo.isRazorpayLoaded) {
      console.log('🔄 Razorpay not loaded, attempting to load...');
      
      // Attempt to load Razorpay script
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.');
      }
    }

    // Validate key existence
    if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
      console.error('❌ Razorpay Key ID is missing');
      throw new Error('Payment configuration error: API key not found');
    }

    // Get current user (or allow anonymous for testing)
    const user = auth.currentUser;
    const userId = user ? user.uid : 'anonymous-user';
    
    console.log('👤 User:', user ? `${user.displayName || user.email} (${user.uid})` : 'Anonymous');

    // Create order data with proper validation
    const orderData = {
      userId: userId,
      userEmail: user ? user.email : bookingDetails.email || 'anonymous@example.com',
      userName: user ? (user.displayName || bookingDetails.name || 'Guest User') : (bookingDetails.name || 'Guest User'),
      trekId: trekData?.id || 'test-trek',
      trekName: trekData?.name || 'Test Trek',
      amount: parseInt((trekData?.numericPrice || 100) * (bookingDetails?.participants || 1)),
      currency: 'INR',
      participants: bookingDetails?.participants || 1,
      startDate: bookingDetails?.startDate || new Date().toISOString().split('T')[0],
      contactNumber: bookingDetails?.contactNumber || '',
      specialRequests: bookingDetails?.specialRequests || '',
      bookingDate: new Date().toISOString()
    };

    // Ensure amount is valid (minimum 100 paise = ₹1)
    if (orderData.amount < 1) {
      console.warn('⚠️ Invalid amount, setting to minimum ₹100');
      orderData.amount = 100;
    }

    // Validate data before sending to Firestore
    const { fixedData } = validateFirestoreData(orderData);
    
    console.log('💾 Creating order with data:', fixedData);
    
    // Create a Razorpay order with validated data
    const order = await createRazorpayOrder(fixedData);
    
    console.log('📝 Order created:', order);

    // Configure Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: parseInt(order.amount),
      currency: "INR",
      name: 'Trovia Treks',
      description: `Booking for ${orderData.trekName}`,
      order_id: order.id,
      prefill: {
        name: orderData.userName,
        email: orderData.userEmail,
        contact: bookingDetails.contactNumber || ''
      },
      theme: {
        color: '#3399cc'
      }
    };
    
    console.log('🚀 Initializing payment with options:', options);
    console.groupEnd();

    // Initialize payment
    await initializeRazorpayPayment(options);

    // Return the order details
    return {
      orderId: order.id,
      amount: order.amount,
      success: true
    };
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    console.groupEnd();
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
};

/**
 * Handle successful payment
 * @param {string} bookingId - Booking ID
 * @param {Object} paymentResponse - Razorpay payment response
 * @returns {Promise<Object>} - Updated booking
 */
export const handlePaymentSuccess = async (bookingId, paymentResponse) => {
  try {
    const updatedBooking = await verifyAndCompletePayment(bookingId, paymentResponse);
      // Get user ID for the payment record
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    // Create a payment record
    const paymentRef = doc(db, 'payments', paymentResponse.razorpay_payment_id);
    await setDoc(paymentRef, {
      bookingId,
      userId, // Include user ID for permissions
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: paymentResponse.razorpay_order_id,
      signature: paymentResponse.razorpay_signature,
      status: 'completed',
      timestamp: serverTimestamp()
    });
    
    return updatedBooking;
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw new Error('Failed to complete payment');
  }
};

/**
 * Handle failed payment
 * @param {string} bookingId - Booking ID
 * @param {Object} error - Error details
 * @returns {Promise<void>}
 */
export const handlePaymentFailure = async (bookingId, error) => {
  await savePaymentFailureDetails(bookingId, {
    code: error.code || 'unknown',
    description: error.description || error.message || 'Unknown error',
    source: error.source || 'client',
    step: error.step || 'payment',
    timestamp: new Date().toISOString()
  });
};
