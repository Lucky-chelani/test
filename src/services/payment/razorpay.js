import { db } from '../../firebase';
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Razorpay API key from environment variables
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;

// Loading state tracking
let isLoadingScript = false;
let loadPromise = null;

/**
 * Load the Razorpay SDK dynamically
 * @returns {Promise<boolean>} - Whether the script loaded successfully
 */
export const loadRazorpayScript = () => {
  // If already loading, return the existing promise to prevent multiple load attempts
  if (isLoadingScript && loadPromise) {
    return loadPromise;
  }
  
  // If Razorpay is already loaded, return immediately
  if (window.Razorpay) {
    console.log('Razorpay SDK already loaded');
    return Promise.resolve(true);
  }
  
  // Set loading state
  isLoadingScript = true;
  
  // Create and store the promise
  loadPromise = new Promise((resolve) => {
    // Clean up any existing script to avoid conflicts
    const existingScript = document.getElementById('razorpay-checkout-js');
    if (existingScript) {
      console.log('Removing existing Razorpay script');
      existingScript.remove();
    }
    
    // Create and add the script
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully');
      isLoadingScript = false;
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Razorpay SDK:', error);
      isLoadingScript = false;
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
  
  return loadPromise;
};

/**
 * Create a Razorpay order in Firebase
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} - Order details with ID
 */
export const createRazorpayOrder = async (orderData) => {
  try {
    console.log('Creating Razorpay order with data:', orderData);
    
    // Create a booking record in Firestore first
    const bookingsRef = collection(db, 'bookings');
    
    // Sanitize the data to ensure no undefined values are sent to Firestore
    const sanitizedOrderData = Object.keys(orderData).reduce((acc, key) => {
      // Only include defined values
      if (orderData[key] !== undefined && orderData[key] !== null) {
        acc[key] = orderData[key];
      }
      return acc;
    }, {});
    
    // Make sure all required fields have values
    const requiredFields = {
      userId: sanitizedOrderData.userId || 'anonymous',
      trekName: sanitizedOrderData.trekName || 'Unknown Trek',
      amount: sanitizedOrderData.amount || 0,
      currency: sanitizedOrderData.currency || 'INR',
      participants: sanitizedOrderData.participants || 1,
    };
    
    const bookingData = {
      ...sanitizedOrderData,
      ...requiredFields,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const bookingDoc = await addDoc(bookingsRef, bookingData);
    
    // Return the booking information with the ID
    return {
      id: bookingDoc.id,
      ...bookingData,
      amount: orderData.amount * 100, // Convert to smallest currency unit (paise)
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Initialize Razorpay payment
 * @param {Object} options - Payment options
 * @returns {Promise<Object>} - Payment result
 */
export const initializeRazorpayPayment = (options) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if Razorpay SDK is loaded
      if (!window.Razorpay) {
        console.error('Razorpay SDK not loaded');
        reject(new Error('Razorpay SDK not loaded. Please refresh the page and try again.'));
        return;
      }
      
      // Validate required fields
      const requiredFields = ['key', 'amount', 'currency'];
      for (const field of requiredFields) {
        if (!options[field]) {
          console.error(`Missing required field: ${field}`);
          reject(new Error(`Missing required field: ${field}`));
          return;
        }
      }
      
      // Ensure we have a valid amount (minimum 100 paise = ₹1)
      if (options.amount < 100) {
        console.warn('Amount is less than minimum (100 paise), setting to minimum');
        options.amount = 100;
      }
      
      // Clean up options object to prevent errors
      const cleanOptions = {
        key: options.key,
        amount: parseInt(options.amount),
        currency: options.currency || 'INR',
        name: options.name || 'Trovia Treks',
        description: options.description || '',
        handler: function(response) {
          console.log('Razorpay payment successful:', response);
          // Call the global handler if available, or just resolve with the response
          if (typeof window.onRazorpaySuccess === 'function') {
            window.onRazorpaySuccess(response);
          }
          resolve(response);
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            reject(new Error('Payment canceled by user'));
          }
        },
        prefill: {
          name: options.prefill?.name || '',
          email: options.prefill?.email || '',
          contact: options.prefill?.contact || ''
        },
        notes: options.notes || {},
        theme: options.theme || { color: '#3399cc' }
      };
      
      // Add order_id only if it exists (valid orders)
      if (options.order_id) {
        cleanOptions.order_id = options.order_id;
      }
      
      console.log('Initializing Razorpay with options:', cleanOptions);
      
      try {
        const rzp = new window.Razorpay(cleanOptions);
        
        rzp.on('payment.failed', function(response) {
          console.error('Razorpay payment failed:', response.error);
          if (typeof window.onRazorpayFailure === 'function') {
            window.onRazorpayFailure(response.error);
          }
          reject(response.error);
        });
        
        // Open the payment modal
        rzp.open();
        
        // Resolve with the rzp instance when the payment window is opened
        resolve(rzp);
      } catch (rzpError) {
        console.error('Error creating Razorpay instance:', rzpError);
        reject(rzpError);
      }
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      reject(error);
    }
  });
};

/**
 * Verify and complete a Razorpay payment
 * @param {string} bookingId - Booking ID
 * @param {Object} paymentDetails - Payment details from Razorpay
 * @returns {Promise<Object>} - Updated booking
 */
export const verifyAndCompletePayment = async (bookingId, paymentDetails) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      throw new Error('Booking not found');
    }
    
    // Update the booking with payment details
    await updateDoc(bookingRef, {
      paymentId: paymentDetails.razorpay_payment_id,
      paymentOrderId: paymentDetails.razorpay_order_id,
      paymentSignature: paymentDetails.razorpay_signature,
      paymentStatus: 'completed',
      status: 'confirmed',
      updatedAt: serverTimestamp()
    });
    
    // Get the updated booking
    const updatedBookingSnap = await getDoc(bookingRef);
    return {
      id: updatedBookingSnap.id,
      ...updatedBookingSnap.data()
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
};

/**
 * Save payment failure details
 * @param {string} bookingId - Booking ID
 * @param {Object} errorDetails - Error details
 * @returns {Promise<void>}
 */
export const savePaymentFailureDetails = async (bookingId, errorDetails) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      paymentStatus: 'failed',
      paymentError: errorDetails,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving payment failure:', error);
    throw new Error('Failed to save payment failure details');
  }
};

/**
 * Get payment details for a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} - Booking details
 */
export const getPaymentDetails = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      throw new Error('Booking not found');
    }
    
    return {
      id: bookingSnap.id,
      ...bookingSnap.data()
    };
  } catch (error) {
    console.error('Error getting payment details:', error);
    throw new Error('Failed to get payment details');
  }
};
