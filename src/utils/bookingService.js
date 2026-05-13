import { db, auth } from '../firebase';
import { collection, addDoc, doc, setDoc, updateDoc, getDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

/**
 * Save a booking to Firestore with full participant details
 * @param {Object} bookingData - Booking details including participants array
 * @returns {Promise<Object>} - Booking document with ID
 */
export const saveBooking = async (bookingData) => {
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to make a booking');
    }
    
    // Clean up any undefined values to prevent Firestore errors
    const cleanedBookingData = {};
    
    Object.keys(bookingData).forEach(key => {
      if (bookingData[key] !== undefined) {
        cleanedBookingData[key] = bookingData[key];
      }
    });

    if ((!cleanedBookingData.trekName || !cleanedBookingData.trekTitle) && cleanedBookingData.trekId) {
      const trekName = cleanedBookingData.trekId
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      if (!cleanedBookingData.trekName) cleanedBookingData.trekName = trekName;
      if (!cleanedBookingData.trekTitle) cleanedBookingData.trekTitle = trekName;
    }
    
    if (cleanedBookingData.trekName === "Test Trek" && cleanedBookingData.trekId) {
      const correctedName = cleanedBookingData.trekId
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      cleanedBookingData.trekName = correctedName;
      cleanedBookingData.trekTitle = correctedName;
    }

    if (!cleanedBookingData.participants || !Array.isArray(cleanedBookingData.participants)) {
      cleanedBookingData.participants = [{
        participantId: 'p1',
        name: cleanedBookingData.name || cleanedBookingData.userName || 'Unknown',
        email: cleanedBookingData.email || cleanedBookingData.userEmail || '',
        age: cleanedBookingData.age || '',
        emergencyContact: cleanedBookingData.emergencyContact || cleanedBookingData.contactNumber || '',
        isPrimaryBooker: true
      }];
    }

    if (cleanedBookingData.participants && Array.isArray(cleanedBookingData.participants)) {
      cleanedBookingData.totalParticipants = cleanedBookingData.participants.length;
    }

    if (!cleanedBookingData.primaryBooker) {
      cleanedBookingData.primaryBooker = {
        uid: user.uid,
        name: cleanedBookingData.name || cleanedBookingData.userName || user.displayName || '',
        email: cleanedBookingData.email || cleanedBookingData.userEmail || user.email || '',
        contactNumber: cleanedBookingData.contactNumber || cleanedBookingData.phoneNumber || ''
      };
    }

    const bookingsRef = collection(db, 'bookings');
    const bookingDoc = await addDoc(bookingsRef, {
      ...cleanedBookingData,
      userId: user.uid,
      userEmail: user.email,
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: bookingDoc.id,
      ...cleanedBookingData
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
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to view bookings');
    }

    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

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

/* ==========================================================================
   RAZORPAY INTEGRATION (Fixes the Redirect and Organizer Bug)
   ========================================================================== */

/**
 * Process payment for a trek booking
 */
export const processBookingPayment = async (trekData, bookingDetails) => {
  try {
    // 1. Create a unique booking ID
    const bookingId = `order_${Date.now()}`;

    // 2. Extract API Key safely
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || import.meta.env?.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey) {
      throw new Error("Razorpay API Key is missing from your .env file");
    }

    // 3. Save the pending booking to Firebase immediately to lock in the Organizer!
    await setDoc(doc(db, 'bookings', bookingId), {
      ...bookingDetails,
      id: bookingId,
      organizerId: bookingDetails.organizerId || trekData.organizerId || trekData.createdBy || null,
      organizerName: bookingDetails.organizerName || trekData.organizerName || trekData.authorName || 'Unassigned',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 4. Open Razorpay Checkout Modal
    const options = {
      key: razorpayKey,
      amount: Math.round(bookingDetails.amount * 100), // Paise
      currency: "INR",
      name: "Trovia Adventures",
      description: `Payment for ${trekData.name}`,
      handler: function (response) {
        // THIS IS THE FIX: This triggers the redirect in BookingPage!
        if (typeof window.onRazorpaySuccess === 'function') {
          window.onRazorpaySuccess({
            ...response,
            bookingId: bookingId
          });
        }
      },
      prefill: {
        name: bookingDetails.primaryBooker?.name || "",
        email: bookingDetails.primaryBooker?.email || "",
        contact: bookingDetails.primaryBooker?.contactNumber || "",
      },
      theme: { color: "#FF6B35" }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      if (typeof window.onRazorpayFailure === 'function') {
        window.onRazorpayFailure(response.error);
      }
    });
    
    rzp.open();

    // Tell the BookingPage that initialization was successful
    return { success: true, orderId: bookingId };

  } catch (error) {
    console.error('Error initiating payment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle Razorpay payment success - Updates DB to Confirmed
 */
export const completeBookingPayment = async (bookingId, paymentResponse) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentId: paymentResponse.razorpay_payment_id || 'N/A',
      updatedAt: serverTimestamp()
    });

    const snap = await getDoc(bookingRef);
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Error completing booking payment:', error);
    throw new Error('Failed to complete payment');
  }
};

/**
 * Handle Razorpay payment failure
 */
export const handleBookingPaymentFailure = async (bookingId, error) => {
  try {
    if (bookingId) {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'failed',
        paymentStatus: 'failed',
        errorReason: error?.description || 'Unknown error',
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error handling booking payment failure:', error);
  }
};