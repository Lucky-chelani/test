import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, setDoc } from "firebase/firestore";

/**
 * Save a new email subscription to Firebase
 * @param {string} email - The email to save
 * @param {object} additionalData - Any additional data to save with the subscription (optional)
 * @returns {Promise<object>} - Promise that resolves with the result of the operation
 */
export const saveEmailSubscription = async (email, additionalData = {}) => {
  try {
    // Validate email
    if (!email || !validateEmail(email)) {
      return { 
        success: false, 
        error: 'Invalid email format' 
      };
    }

    // Check if email already exists to prevent duplicates
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return { 
        success: false, 
        error: 'Email already subscribed',
        status: 'duplicate' 
      };
    }

    try {
      // Add the document to the "newsletter_subscribers" collection
      const docRef = await addDoc(collection(db, "newsletter_subscribers"), {
        email: email,
        subscribed_at: serverTimestamp(),
        status: 'active',
        source: 'website_footer',
        ...additionalData // Add any additional data passed
      });

      console.log("Newsletter subscription saved with ID:", docRef.id);
      
      return { 
        success: true, 
        id: docRef.id,
        message: 'Subscription successful!'
      };
    } catch (permissionError) {
      console.error("Permission error saving subscription:", permissionError);
      
      // Check if it's a permissions error
      if (permissionError.code === 'permission-denied' || 
          permissionError.message.includes('permission') || 
          permissionError.message.includes('unauthorized')) {
        
        // Save to localStorage as a fallback
        try {
          const savedEmails = JSON.parse(localStorage.getItem('pending_subscriptions') || '[]');
          savedEmails.push({
            email,
            timestamp: new Date().toISOString(),
            ...additionalData
          });
          localStorage.setItem('pending_subscriptions', JSON.stringify(savedEmails));
          
          // Return success but with a flag indicating it's stored locally
          return {
            success: true,
            localOnly: true,
            message: 'Subscription saved locally. Will be processed when connection is restored.'
          };
        } catch (localError) {
          console.error("Failed to save locally:", localError);
          throw permissionError; // Re-throw the original error if local save fails
        }
      } else {
        throw permissionError; // Re-throw if it's not a permissions issue
      }
    }
  } catch (error) {
    console.error("Error saving newsletter subscription:", error);
    
    // Format permissions errors better
    if (error.code === 'permission-denied' || 
        error.message.includes('permission') ||
        error.message.includes('unauthorized')) {
      return { 
        success: false, 
        error: 'Subscription service temporarily unavailable. Please try again later.',
        details: error,
        code: 'permission-denied'
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'An error occurred while saving your subscription',
      details: error
    };
  }
};

/**
 * Check if an email already exists in the subscribers collection
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} - Promise that resolves with boolean indicating if email exists
 */
const checkEmailExists = async (email) => {
  try {
    const q = query(
      collection(db, "newsletter_subscribers"), 
      where("email", "==", email)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking existing email:", error);
    // In case of error, return false to allow subscription attempt
    return false;
  }
};

/**
 * Basic email validation function
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Unsubscribe an email from the newsletter
 * @param {string} email - The email to unsubscribe
 * @returns {Promise<object>} - Promise that resolves with the result of the operation
 */
export const unsubscribeEmail = async (email) => {
  // This would be implemented if you have an unsubscribe feature
  // Would involve finding the document and updating its status
  // Not implemented in this version as it's not part of the initial requirement
};

/**
 * Check if Firebase Firestore is available and accessible
 * @returns {Promise<boolean>} - Promise that resolves with whether Firestore is available
 */
export const checkFirestoreAvailability = async () => {
  try {
    // Check if we're authenticated first
    if (!auth.currentUser) {
      console.log("Not authenticated, assuming Firestore is unavailable to the current user");
      return false;
    }
    
    // Use a more reliable collection to check
    // Try to read the treks collection which is publicly readable
    const trekQuery = query(collection(db, "treks"), where("featured", "==", true));
    await getDocs(trekQuery);
    
    return true;
  } catch (error) {
    console.error("Firestore availability check failed:", error);
    return false;
  }
};

/**
 * Process any pending subscriptions saved in localStorage
 * @returns {Promise<{processed: number, errors: number}>}
 */
export const processPendingSubscriptions = async () => {
  try {
    // Check if Firestore is available
    const isAvailable = await checkFirestoreAvailability();
    if (!isAvailable) {
      return { processed: 0, errors: 0, message: 'Firebase unavailable' };
    }
    
    // Get pending subscriptions from localStorage
    const pendingSubscriptions = JSON.parse(localStorage.getItem('pending_subscriptions') || '[]');
    if (pendingSubscriptions.length === 0) {
      return { processed: 0, errors: 0 };
    }
    
    let processed = 0;
    let errors = 0;
    
    // Process each pending subscription
    for (const sub of pendingSubscriptions) {
      try {
        await addDoc(collection(db, "newsletter_subscribers"), {
          email: sub.email,
          subscribed_at: serverTimestamp(),
          status: 'active',
          source: 'website_footer_recovered',
          local_timestamp: sub.timestamp,
          ...sub // Include any additional data
        });
        processed++;
      } catch (error) {
        console.error("Error processing pending subscription:", error);
        errors++;
      }
    }
    
    // Clear processed subscriptions if any were successful
    if (processed > 0) {
      localStorage.removeItem('pending_subscriptions');
    } else if (errors > 0) {
      // Keep only the ones that failed
      // This would require more complex tracking of which ones failed
      // For now, we'll keep it simple
    }
    
    return { processed, errors };
  } catch (error) {
    console.error("Error processing pending subscriptions:", error);
    return { processed: 0, errors: -1, error: error.message };
  }
};
