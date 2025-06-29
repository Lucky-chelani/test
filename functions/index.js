const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');

admin.initializeApp();

// Email configuration (you'll need to set these in Firebase config)
const createEmailTransporter = () => {
  try {
    console.log('🔧 Creating email transporter...');
    
    const emailUser = functions.config().email?.user || process.env.EMAIL_USER;
    const emailPassword = functions.config().email?.password || process.env.EMAIL_PASSWORD;
    
    console.log('Email user configured:', emailUser ? '✅ Yes' : '❌ No');
    console.log('Email password configured:', emailPassword ? '✅ Yes' : '❌ No');
    
    if (!emailUser || !emailPassword) {
      console.error('❌ Email credentials not configured');
      throw new Error('Email credentials not configured. Please set email.user and email.password in Firebase config');
    }
    
    // For Gmail (you can also use other providers like SendGrid, AWS SES, etc.)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });
    
    console.log('✅ Email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    throw error;
  }
};

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

// Review-related functions
exports.onReviewCreate = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snapshot, context) => {
    try {
      // Get review data
      const reviewData = snapshot.data();
      const { trekId } = reviewData;
      
      // If trekId is missing, don't proceed
      if (!trekId) return null;
      
      // Update trek rating
      return await updateTrekRating(trekId);
    } catch (error) {
      console.error('Error in onReviewCreate:', error);
      return null;
    }
  });

exports.onReviewUpdate = functions.firestore
  .document('reviews/{reviewId}')
  .onUpdate(async (change, context) => {
    try {
      // Get before and after data
      const beforeData = change.before.data();
      const afterData = change.after.data();
      
      // Only proceed if rating changed
      if (beforeData.rating === afterData.rating) {
        return null;
      }
      
      // Update trek rating
      return await updateTrekRating(afterData.trekId);
    } catch (error) {
      console.error('Error in onReviewUpdate:', error);
      return null;
    }
  });

exports.onReviewDelete = functions.firestore
  .document('reviews/{reviewId}')
  .onDelete(async (snapshot, context) => {
    try {
      // Get review data
      const reviewData = snapshot.data();
      const { trekId } = reviewData;
      
      // If trekId is missing, don't proceed
      if (!trekId) return null;
      
      // Update trek rating
      return await updateTrekRating(trekId);
    } catch (error) {
      console.error('Error in onReviewDelete:', error);
      return null;
    }
  });

/**
 * Calculate average rating and update trek document
 * @param {string} trekId - Trek ID
 */
async function updateTrekRating(trekId) {
  // Reference to the firestore
  const db = admin.firestore();
  
  // Get all published reviews for this trek
  const reviewsQuery = await db.collection('reviews')
    .where('trekId', '==', trekId)
    .where('status', '==', 'published')
    .get();
  
  // Calculate average rating
  let totalRating = 0;
  let reviewCount = reviewsQuery.size;
  
  // If no reviews, set rating to 0
  if (reviewCount === 0) {
    return await db.collection('treks').doc(trekId).update({
      rating: 0,
      reviewCount: 0,
      ratingUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  
  // Sum up all ratings
  reviewsQuery.forEach(doc => {
    totalRating += doc.data().rating;
  });
  
  // Calculate average
  const averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
  
  // Update trek document
  return await db.collection('treks').doc(trekId).update({
    rating: averageRating,
    reviewCount: reviewCount,
    ratingUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

// Email sending function
exports.sendBookingConfirmationEmail = functions.https.onCall(async (data, context) => {
  try {
    console.log('📧 Email function called with data:', JSON.stringify(data, null, 2));
    
    // Note: We're not requiring authentication for email sending since it's called after successful payment
    // If you want to add authentication back, uncomment the lines below:
    // if (!context.auth) {
    //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    // }

    const { booking, trek, isFailureEmail } = data;
    
    // More detailed validation with logging
    console.log('🔍 Validating email data...');
    console.log('Booking data:', booking);
    console.log('Trek data:', trek);
    
    if (!booking) {
      console.error('❌ No booking data provided');
      throw new functions.https.HttpsError('invalid-argument', 'Missing booking data');
    }
    
    if (!booking.email) {
      console.error('❌ No email in booking data:', booking);
      throw new functions.https.HttpsError('invalid-argument', 'Missing booking email');
    }
    
    if (!trek) {
      console.error('❌ No trek data provided');
      throw new functions.https.HttpsError('invalid-argument', 'Missing trek data');
    }
    
    if (!trek.title) {
      console.error('❌ No trek title provided:', trek);
      throw new functions.https.HttpsError('invalid-argument', 'Missing trek title');
    }
    
    console.log('✅ Data validation passed');

    // Create email transporter
    console.log('🔧 Creating email transporter...');
    const transporter = createEmailTransporter();
    
    // Generate email content based on type
    console.log('📝 Generating email content...');
    const emailContent = isFailureEmail 
      ? generatePaymentFailureEmailContent(booking, trek)
      : generateBookingConfirmationEmailContent(booking, trek);

    // Email options
    const fromEmail = functions.config().email?.user || process.env.EMAIL_USER || 'noreply@trovilatreks.com';
    console.log('📧 Email will be sent from:', fromEmail);
    console.log('📧 Email will be sent to:', booking.email);
    
    const mailOptions = {
      from: {
        name: 'Trovia Treks',
        address: fromEmail
      },
      to: booking.email,
      subject: isFailureEmail 
        ? `Payment Failed - ${trek.title} Booking` 
        : `Booking Confirmed - ${trek.title} Adventure`,
      html: emailContent,
      // Add a text version for better compatibility
      text: isFailureEmail
        ? `Your payment for ${trek.title} booking failed. Please contact us for assistance.`
        : `Your booking for ${trek.title} has been confirmed! Booking ID: ${booking.id}`
    };

    console.log('📤 Sending email...');
    
    // Send email with better error handling
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ ${isFailureEmail ? 'Payment failure' : 'Confirmation'} email sent successfully to:`, booking.email);
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      throw new functions.https.HttpsError('internal', 'Failed to send email: ' + emailError.message);
    }
    
    // Log email activity in Firestore for tracking
    try {
      await admin.firestore().collection('emailLogs').add({
        bookingId: booking.id,
        email: booking.email,
        type: isFailureEmail ? 'payment_failure' : 'booking_confirmation',
        trekTitle: trek.title,
        status: 'sent',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('📝 Email activity logged to Firestore');
    } catch (logError) {
      console.error('⚠️ Failed to log email activity:', logError);
      // Don't fail the function if logging fails
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // Log failed email attempt
    try {
      await admin.firestore().collection('emailLogs').add({
        bookingId: data?.booking?.id || 'unknown',
        email: data?.booking?.email || 'unknown',
        type: data?.isFailureEmail ? 'payment_failure' : 'booking_confirmation',
        status: 'failed',
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }

    throw new functions.https.HttpsError('internal', 'Failed to send email', error.message);
  }
});

/**
 * Generate booking confirmation email HTML content
 */
function generateBookingConfirmationEmailContent(booking, trek) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container { 
          background: white; 
          border-radius: 12px; 
          padding: 30px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          background: linear-gradient(135deg, #3399cc, #00b4db); 
          color: white; 
          padding: 25px; 
          border-radius: 8px; 
          margin-bottom: 30px;
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: bold;
        }
        .booking-id { 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center; 
          margin: 20px 0; 
          border-left: 4px solid #3399cc;
        }
        .booking-id strong { 
          font-size: 18px; 
          color: #3399cc;
        }
        .section { 
          margin: 25px 0; 
          padding: 20px; 
          border: 1px solid #e9ecef; 
          border-radius: 8px;
          background: #fbfcfd;
        }
        .section h3 { 
          color: #3399cc; 
          margin-bottom: 15px; 
          font-size: 18px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 8px;
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 10px 0; 
          padding: 8px 0;
        }
        .detail-row:not(:last-child) {
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label { 
          font-weight: bold; 
          color: #666;
        }
        .detail-value { 
          color: #333;
        }
        .trek-image { 
          width: 100%; 
          max-width: 200px; 
          height: 120px; 
          object-fit: cover; 
          border-radius: 8px; 
          margin: 15px auto; 
          display: block;
        }
        .total-amount { 
          background: linear-gradient(135deg, #3399cc, #00b4db); 
          color: white; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center; 
          font-size: 20px; 
          font-weight: bold;
          margin: 20px 0;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          background: #f8f9fa; 
          border-radius: 8px; 
          margin-top: 30px;
        }
        .contact-info { 
          background: #e8f4f8; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0;
        }
        .success-icon {
          color: #28a745;
          font-size: 48px;
          margin-bottom: 15px;
        }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .container { padding: 20px; }
          .detail-row { flex-direction: column; }
          .detail-label { margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>Booking Confirmed!</h1>
          <p>Your adventure is all set and ready to go!</p>
        </div>

        <div class="booking-id">
          <strong>Booking ID: ${booking.id}</strong>
          <p>Please save this ID for your records</p>
        </div>

        <div class="section">
          <h3>🏔️ Trek Details</h3>
          ${trek.imageUrl ? `<img src="${trek.imageUrl}" alt="${trek.title}" class="trek-image">` : ''}
          <div class="detail-row">
            <span class="detail-label">Trek Name:</span>
            <span class="detail-value">${trek.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${trek.location || 'Not specified'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">${trek.duration || 'Not specified'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Difficulty:</span>
            <span class="detail-value">${trek.difficulty || 'Not specified'}</span>
          </div>
        </div>

        <div class="section">
          <h3>📅 Booking Information</h3>
          <div class="detail-row">
            <span class="detail-label">Participant Name:</span>
            <span class="detail-value">${booking.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${booking.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Contact Number:</span>
            <span class="detail-value">${booking.contactNumber || 'Not provided'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Start Date:</span>
            <span class="detail-value">${formatDate(booking.startDate)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Number of Participants:</span>
            <span class="detail-value">${booking.participants} person(s)</span>
          </div>
          ${booking.specialRequests ? `
          <div class="detail-row">
            <span class="detail-label">Special Requests:</span>
            <span class="detail-value">${booking.specialRequests}</span>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <h3>💳 Payment Details</h3>
          <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value">${formatCurrency(booking.totalAmount)}</span>
          </div>
          ${booking.discountAmount > 0 ? `
          <div class="detail-row">
            <span class="detail-label">Discount Applied:</span>
            <span class="detail-value">-${formatCurrency(booking.discountAmount)}</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Payment Status:</span>
            <span class="detail-value" style="color: #28a745; font-weight: bold;">✅ Completed</span>
          </div>
          ${booking.paymentId ? `
          <div class="detail-row">
            <span class="detail-label">Payment ID:</span>
            <span class="detail-value">${booking.paymentId}</span>
          </div>
          ` : ''}
        </div>

        <div class="total-amount">
          Total Paid: ${formatCurrency(booking.totalAmount)}
        </div>

        <div class="contact-info">
          <h3>📞 Need Help?</h3>
          <p>If you have any questions about your booking, please contact us:</p>
          <p><strong>Email:</strong> trovia.in@gmail.com</p>
          <p><strong>Phone:</strong> +91 8989986204</p>
          <p><strong>WhatsApp:</strong> +91 8989986204</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing Trovia Treks!</strong></p>
          <p>We're excited to have you on this adventure. Please arrive 30 minutes early on your trek date.</p>
          <p style="font-size: 12px; color: #666;">
            This is an automated email. Please do not reply to this email address.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate payment failure email HTML content
 */
function generatePaymentFailureEmailContent(booking, trek) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container { 
          background: white; 
          border-radius: 12px; 
          padding: 30px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          background: linear-gradient(135deg, #dc3545, #c82333); 
          color: white; 
          padding: 25px; 
          border-radius: 8px; 
          margin-bottom: 30px;
        }
        .error-icon {
          color: #fff;
          font-size: 48px;
          margin-bottom: 15px;
        }
        .retry-button {
          display: inline-block;
          background: linear-gradient(135deg, #3399cc, #00b4db);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .section { 
          margin: 25px 0; 
          padding: 20px; 
          border: 1px solid #e9ecef; 
          border-radius: 8px;
          background: #fbfcfd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="error-icon">❌</div>
          <h1>Payment Failed</h1>
          <p>We encountered an issue processing your payment</p>
        </div>

        <div class="section">
          <h3>🏔️ Trek Details</h3>
          <p><strong>Trek:</strong> ${trek.title}</p>
          <p><strong>Location:</strong> ${trek.location || 'Not specified'}</p>
          <p><strong>Duration:</strong> ${trek.duration || 'Not specified'}</p>
        </div>

        <div class="section">
          <h3>📋 Booking Information</h3>
          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Participants:</strong> ${booking.participants}</p>
          <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
        </div>

        <div class="section">
          <h3>⚠️ What happened?</h3>
          <p>Your payment could not be processed due to: ${booking.errorMessage || 'Technical issue'}</p>
          <p>Don't worry! Your booking details are saved and you can try again.</p>
        </div>

        <div class="section">
          <h3>🔄 Next Steps</h3>
          <p>1. Check your payment method details</p>
          <p>2. Ensure you have sufficient funds</p>
          <p>3. Try booking again or contact our support team</p>
          
          <a href="https://yourwebsite.com/explore" class="retry-button">Try Booking Again</a>
        </div>

        <div class="section">
          <h3>📞 Need Help?</h3>
          <p><strong>Email:</strong> support@trovilatreks.com</p>
          <p><strong>Phone:</strong> +91 9876543210</p>
          <p>Our support team is here to help you complete your booking!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
