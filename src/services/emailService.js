import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

/**
 * Email service for sending booking confirmation emails
 */
export class EmailService {
  constructor() {
    // Get the callable function for sending emails
    this.sendBookingConfirmationEmail = httpsCallable(functions, 'sendBookingConfirmationEmail');
  }

  /**
   * Send booking confirmation email
   * @param {Object} bookingData - Booking details
   * @param {Object} trekData - Trek details
   * @returns {Promise<boolean>} - Success status
   */
  async sendConfirmationEmail(bookingData, trekData) {
    try {
      console.log('📧 Sending booking confirmation email...');
      console.log('🔍 Input data validation:');
      console.log('  - Booking data:', bookingData);
      console.log('  - Trek data:', trekData);
      
      // Validate input data
      if (!bookingData) {
        console.error('❌ No booking data provided');
        return false;
      }
      
      if (!trekData) {
        console.error('❌ No trek data provided');
        return false;
      }
      
      // Prepare email data
      const emailData = {
        booking: {
          id: bookingData.id || bookingData.bookingId,
          name: bookingData.name,
          email: bookingData.email || bookingData.userEmail,
          contactNumber: bookingData.contactNumber,
          startDate: bookingData.startDate,
          participants: bookingData.participants || 1,
          totalAmount: bookingData.totalAmount || bookingData.amount,
          paymentId: bookingData.paymentId,
          status: bookingData.status,
          paymentStatus: bookingData.paymentStatus,
          specialRequests: bookingData.specialRequests,
          discountAmount: bookingData.discountAmount || 0,
          createdAt: bookingData.createdAt || new Date().toISOString()
        },
        trek: {
          title: trekData.title || trekData.name,
          location: trekData.location,
          duration: trekData.duration,
          difficulty: trekData.difficulty,
          imageUrl: trekData.imageUrl || trekData.image,
          description: trekData.description
        }
      };

      console.log('📤 Prepared email data for Firebase function:');
      console.log('  - Booking ID:', emailData.booking.id);
      console.log('  - Booking email:', emailData.booking.email);
      console.log('  - Trek title:', emailData.trek.title);
      console.log('  - Full email data:', JSON.stringify(emailData, null, 2));

      // Call the Firebase Cloud Function
      const result = await this.sendBookingConfirmationEmail(emailData);
      
      if (result.data.success) {
        console.log('✅ Email sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send email:', result.data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending confirmation email:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        details: error.details
      });
      return false;
    }
  }

  /**
   * Send payment failure email
   * @param {Object} bookingData - Booking details
   * @param {Object} trekData - Trek details  
   * @param {string} errorMessage - Error message
   * @returns {Promise<boolean>} - Success status
   */
  async sendPaymentFailureEmail(bookingData, trekData, errorMessage) {
    try {
      console.log('📧 Sending payment failure email...');
      
      const emailData = {
        booking: {
          id: bookingData.id || bookingData.bookingId,
          name: bookingData.name,
          email: bookingData.email || bookingData.userEmail,
          contactNumber: bookingData.contactNumber,
          startDate: bookingData.startDate,
          participants: bookingData.participants || 1,
          totalAmount: bookingData.totalAmount || bookingData.amount,
          errorMessage: errorMessage
        },
        trek: {
          title: trekData.title || trekData.name,
          location: trekData.location,
          duration: trekData.duration
        }
      };

      // You can add a separate function for payment failure emails
      // For now, we'll use a flag in the confirmation email function
      emailData.isFailureEmail = true;

      const result = await this.sendBookingConfirmationEmail(emailData);
      
      if (result.data.success) {
        console.log('✅ Payment failure email sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send payment failure email:', result.data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending payment failure email:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
export default emailService;
