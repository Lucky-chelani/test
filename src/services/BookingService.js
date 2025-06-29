import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Service to handle booking-related operations
 */
class BookingService {
  constructor() {
    this.bookingsCollection = 'bookings';
    this.treksCollection = 'treks';
    this.usersCollection = 'users';
  }

  /**
   * Generate a trek name from trek ID if necessary
   * @param {string} trekId - Trek ID usually in kebab-case
   * @returns {string} - User-friendly trek name
   */
  formatTrekNameFromId(trekId) {
    if (!trekId) return 'Unknown Trek';
    
    // Special case handling for known trek IDs
    const specialCases = {
      'bhrigu-lake': 'Bhrigu Lake Trek',
      'hampta-pass': 'Hampta Pass Trek',
      'kedarkantha': 'Kedarkantha Trek'
    };
    
    if (specialCases[trekId]) {
      return specialCases[trekId];
    }
    
    // Otherwise, format kebab-case to Title Case
    return trekId
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get booking details by ID
   * @param {string} bookingId - The booking ID
   * @returns {Promise<Object>} - Booking details with trek information
   */
  async getBookingById(bookingId) {
    try {
      console.log(`Fetching booking with ID: ${bookingId}`);
      const bookingRef = doc(db, this.bookingsCollection, bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (!bookingSnap.exists()) {
        console.error(`Booking not found with ID: ${bookingId}`);
        throw new Error('Booking not found');
      }

      const bookingData = bookingSnap.data();
      console.log(`Booking data:`, bookingData);
      
      // Get trek details
      let trekData = null;
      if (bookingData.trekId) {
        console.log(`Fetching trek with ID: ${bookingData.trekId}`);
        
        // Special handling for known trek IDs that may not be proper documents
        if (bookingData.trekId === 'bhrigu-lake') {
          console.log(`Special case: Creating fallback data for bhrigu-lake`);
          trekData = {
            id: 'bhrigu-lake',
            title: 'Bhrigu Lake Trek',
            name: 'Bhrigu Lake Trek',
            location: 'Himachal Pradesh',
            difficulty: 'Moderate',
            duration: '4 days'
          };
        } else {
          const trekRef = doc(db, this.treksCollection, bookingData.trekId);
          const trekSnap = await getDoc(trekRef);
          if (trekSnap.exists()) {
            trekData = trekSnap.data();
            trekData.id = trekSnap.id; // Ensure ID is included
            
            // Make sure title field exists
            if (!trekData.title) {
              trekData.title = trekData.name || this.formatTrekNameFromId(bookingData.trekId);
            }
            console.log(`Trek data found:`, trekData);
          } else {
            console.warn(`Trek not found with ID: ${bookingData.trekId}`);
            // Create fallback data
            const trekName = bookingData.trekTitle || 
                           bookingData.trekName || 
                           this.formatTrekNameFromId(bookingData.trekId);
            
            trekData = {
              id: bookingData.trekId,
              title: trekName,
              name: trekName,
              location: bookingData.trekLocation || 'Unknown location'
            };
          }
        }
      } else if (bookingData.trekTitle || bookingData.trekName) {
        // If we have trek details directly in the booking
        const trekName = bookingData.trekTitle || bookingData.trekName;
        trekData = {
          title: trekName,
          name: trekName,
          location: bookingData.trekLocation || 'Unknown location',
          imageUrl: bookingData.trekImage || null
        };
        console.warn(`Using trek details directly from booking: ${trekData.title}`);
      } else {
        console.warn(`No trekId found in booking: ${bookingId}`);
        trekData = {
          title: 'Unknown Trek',
          name: 'Unknown Trek'
        };
      }
      
      const result = {
        id: bookingSnap.id,
        ...bookingData,
        createdAt: this.formatTimestamp(bookingData.createdAt),
        trek: trekData
      };
      
      console.log(`Final booking result:`, result);
      return result;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  /**
   * Get all bookings for the current user
   * @returns {Promise<Array>} - List of user's bookings with trek information
   */
  async getUserBookings() {
    try {
      console.log("getUserBookings - Started fetching user bookings");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("getUserBookings - No authenticated user found");
        throw new Error('User must be logged in to view bookings');
      }
      console.log(`getUserBookings - Fetching bookings for user: ${currentUser.uid}`);

      try {
        const q = query(
          collection(db, this.bookingsCollection),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        console.log(`getUserBookings - Found ${querySnapshot.docs.length} bookings`);
        
        const bookings = [];
        
        // For each booking, get the trek details
        for (const docSnapshot of querySnapshot.docs) {
          const booking = docSnapshot.data();
          console.log(`getUserBookings - Processing booking ${docSnapshot.id}:`, booking);
          console.log(`getUserBookings - Booking has trekId: ${booking.trekId ? 'Yes' : 'No'}`);
          
          if (booking.trekTitle) {
            console.log(`getUserBookings - Booking has direct trekTitle: ${booking.trekTitle}`);
          }
          
          if (booking.trekName) {
            console.log(`getUserBookings - Booking has direct trekName: ${booking.trekName}`);
          }
          
          // Get trek details
          let trekData = null;
          
          // Special handling for bhrigu-lake trek
          if (booking.trekId === 'bhrigu-lake') {
            console.log(`getUserBookings - Special case: Creating fallback data for bhrigu-lake`);
            trekData = {
              id: 'bhrigu-lake',
              title: 'Bhrigu Lake Trek',
              name: 'Bhrigu Lake Trek',
              location: 'Himachal Pradesh',
              difficulty: 'Moderate',
              duration: '4 days'
            };
          }
          // If booking already has trek information directly (not in a trek object)
          else if (booking.trekTitle || booking.trekName) {
            console.log(`getUserBookings - Using direct trek info from booking`);
            const trekName = booking.trekTitle || booking.trekName;
            trekData = {
              id: booking.trekId || 'unknown',
              title: trekName,
              name: trekName,
              imageUrl: booking.trekImage || null,
              location: booking.trekLocation || booking.location || null
            };
          }
          // Otherwise try to fetch trek from Firestore
          else if (booking.trekId) {
            try {
              const trekRef = doc(db, this.treksCollection, booking.trekId);
              const trekSnap = await getDoc(trekRef);
              if (trekSnap.exists()) {
                trekData = {
                  id: trekSnap.id,
                  ...trekSnap.data()
                };
                
                // Make sure title field exists
                if (!trekData.title) {
                  trekData.title = trekData.name || this.formatTrekNameFromId(booking.trekId);
                }
                
                console.log(`getUserBookings - Found trek data:`, trekData);
                console.log(`getUserBookings - Trek name fields: title=${trekData.title}, name=${trekData.name}`);
              } else {
                console.warn(`getUserBookings - Trek with ID ${booking.trekId} not found`);
                // Create fallback trek data with ID if no trek is found
                const trekName = this.formatTrekNameFromId(booking.trekId);
                trekData = {
                  id: booking.trekId,
                  title: trekName,
                  name: trekName,
                  imageUrl: booking.trekImage || null
                };
              }
            } catch (trekError) {
              console.warn(`getUserBookings - Failed to load trek details for booking ${docSnapshot.id}:`, trekError);
              // Continue with fallback trekData rather than failing the entire bookings fetch
              const trekName = this.formatTrekNameFromId(booking.trekId);
              trekData = {
                id: booking.trekId,
                title: trekName,
                name: trekName
              };
            }
          } else {
            // If no trekId, but we have other trek information
            if (booking.trekData) {
              console.log(`getUserBookings - Using trekData object from booking`);
              trekData = booking.trekData;
              
              // Make sure title field exists
              if (!trekData.title) {
                trekData.title = trekData.name || 'Unknown Trek';
              }
            } else {
              // Absolute fallback
              trekData = {
                title: 'Unknown Trek',
                name: 'Unknown Trek'
              };
            }
          }
          
          const bookingWithData = {
            id: docSnapshot.id,
            ...booking,
            createdAt: this.formatTimestamp(booking.createdAt),
            trek: trekData
          };
          
          console.log(`getUserBookings - Final booking object:`, bookingWithData);
          console.log(`getUserBookings - Trek title in final object: ${bookingWithData.trek?.title || bookingWithData.trekTitle || 'Not found'}`);
          bookings.push(bookingWithData);
        }
        
        console.log(`getUserBookings - Returning ${bookings.length} bookings`);
        return bookings;
      } catch (error) {
        // If the error is about missing an index, provide more helpful error message
        if (error.message && error.message.includes('index')) {
          console.error('Error fetching user bookings: Missing Firestore index. Please deploy the required index.', error);
          // Return an empty array rather than failing
          return [];
        }
        console.error('Error in inner try block of getUserBookings:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  /**
   * Format a Firestore timestamp to human-readable date
   * @param {Object} timestamp - Firestore timestamp
   * @returns {string} - Formatted date string
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown date';
    
    try {
      // If timestamp is already a string, return it
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      
      // If it's a Date object
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // If it's a Firestore timestamp
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // If it's a numeric timestamp (milliseconds since epoch)
      if (typeof timestamp === 'number') {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      return 'Invalid date format';
    } catch (error) {
      console.warn('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  }
}

export default new BookingService();
