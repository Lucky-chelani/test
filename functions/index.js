const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.verifyPayment = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      // Check method
      if (request.method !== 'POST') {
        return response.status(400).json({
          success: false,
          message: 'Only POST requests are allowed'
        });
      }
      
      // Get payment details from request body
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = request.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
        return response.status(400).json({
          success: false,
          message: 'Missing required payment parameters'
        });
      }

      // Get the secret key from environment variables
      const secret = functions.config().razorpay.key_secret;
      
      // Create a signature based on order_id and payment_id
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      
      // Compare the signatures
      if (generatedSignature !== razorpay_signature) {
        // Payment verification failed
        return response.status(400).json({
          success: false,
          message: 'Payment signature verification failed'
        });
      }
      
      // Get the booking from Firestore
      const bookingRef = admin.firestore().collection('bookings').doc(bookingId);
      const bookingSnap = await bookingRef.get();
      
      if (!bookingSnap.exists) {
        return response.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      
      // Update booking with payment details
      await bookingRef.update({
        paymentId: razorpay_payment_id,
        paymentOrderId: razorpay_order_id,
        paymentSignature: razorpay_signature,
        paymentStatus: 'completed',
        status: 'confirmed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Create a payment record
      await admin.firestore().collection('payments').doc(razorpay_payment_id).set({
        bookingId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        status: 'completed',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Return success response
      return response.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      return response.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
});

exports.createOrder = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      // Check method
      if (request.method !== 'POST') {
        return response.status(400).json({
          success: false,
          message: 'Only POST requests are allowed'
        });
      }
        // Get order details from request body
      const { amount, currency, receipt, notes, userId } = request.body;
      
      if (!amount || !currency) {
        return response.status(400).json({
          success: false,
          message: 'Missing required order parameters'
        });
      }

      // In a real implementation, you would make an API call to Razorpay here
      // Since we can't make external API calls directly in this demo,
      // we'll just create a booking record in Firestore
      // Make sure we have a userId for security rules
      
      if (!userId) {
        return response.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const bookingsRef = admin.firestore().collection('bookings');
      const bookingData = {
        ...request.body,
        status: 'pending',
        paymentStatus: 'pending',
        userId, // Ensure userId is included for security rules
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const bookingDoc = await bookingsRef.add(bookingData);
      
      // Return a simulated Razorpay order response
      return response.status(200).json({
        id: bookingDoc.id,
        entity: 'order',
        amount,
        amount_paid: 0,
        amount_due: amount,
        currency,
        receipt: receipt || bookingDoc.id,
        status: 'created',
        notes: notes || {}
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return response.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
});
