import { db, auth } from '../firebase';
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { processPayment, handlePaymentSuccess, handlePaymentFailure } from '../services/payment';

/**
 * Save a booking to Firestore
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} - Booking document with ID
 */
export const saveBooking = async (bookingData) => {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to make a booking');
    }

    // Create booking in Firestore
    const bookingsRef = collection(db, 'bookings');
    const bookingDoc = await addDoc(bookingsRef, {
      ...bookingData,
      userId: user.uid,
      userEmail: user.email,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: bookingDoc.id,
      ...bookingData
    };
  } catch (error) {
    console.error('Error saving booking:', error);
    throw new Error('Failed to save booking');
  }
};

/**
 * Get bookings for the current user
 * @returns {Promise<Array>} - Array of booking objects
 */
export const getUserBookings = async () => {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to view bookings');
    }

    // Query bookings
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    // Process results
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw new Error('Failed to get bookings');
  }
};

/**
 * Get a specific booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} - Booking object
 */
export const getBookingById = async (bookingId) => {
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
    console.error('Error getting booking:', error);
    throw new Error('Failed to get booking');
  }
};

/**
 * Process payment for a trek booking
 * @param {Object} trekData - Trek details
 * @param {Object} bookingDetails - Booking details
 * @returns {Promise<Object>} - Payment result
 */
export const processBookingPayment = async (trekData, bookingDetails) => {
  try {
    const paymentResult = await processPayment(trekData, bookingDetails);
    return paymentResult;
  } catch (error) {
    console.error('Error processing booking payment:', error);
    throw new Error('Payment processing failed');
  }
};

/**
 * Handle Razorpay payment success
 * @param {string} bookingId - Booking ID
 * @param {Object} paymentResponse - Razorpay payment response
 * @returns {Promise<Object>} - Updated booking
 */
export const completeBookingPayment = async (bookingId, paymentResponse) => {
  try {
    const updatedBooking = await handlePaymentSuccess(bookingId, paymentResponse);
    return updatedBooking;
  } catch (error) {
    console.error('Error completing booking payment:', error);
    throw new Error('Failed to complete payment');
  }
};

/**
 * Handle Razorpay payment failure
 * @param {string} bookingId - Booking ID
 * @param {Object} error - Error details
 * @returns {Promise<void>}
 */
export const handleBookingPaymentFailure = async (bookingId, error) => {
  try {
    await handlePaymentFailure(bookingId, error);
  } catch (error) {
    console.error('Error handling booking payment failure:', error);
    throw new Error('Failed to handle payment failure');
  }
};
