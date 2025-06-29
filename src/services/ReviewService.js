import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  limit,
  Timestamp,
  setDoc
} from 'firebase/firestore';

/**
 * Service for managing trek reviews in Firebase
 */
class ReviewService {
  constructor() {
    this.reviewsCollection = 'reviews';
    this.treksCollection = 'treks';
    this.usersCollection = 'users';
  }

  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} - Result of the operation
   */
  async createReview(reviewData) {
    try {
      const { trekId, rating, comment } = reviewData;
      
      // Validate required fields
      if (!trekId) throw new Error('Trek ID is required');
      if (!rating || rating < 1 || rating > 5) throw new Error('Rating must be between 1-5');
      
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('You must be logged in to leave a review');
      
      // Check if user has already reviewed this trek
      const existingReview = await this.getUserReviewForTrek(currentUser.uid, trekId);
      if (existingReview) throw new Error('You have already reviewed this trek');
      
      // Try to find or create the trek
      console.log(`Checking or creating trek with ID: ${trekId}`);
      
      // First try with the original ID
      let trekRef = doc(db, this.treksCollection, trekId);
      let trekSnap = await getDoc(trekRef);
      
      if (!trekSnap.exists()) {
        // Trek doesn't exist, create a mock trek for testing purposes
        await this._createMockTrekIfNeeded(trekId);
      }
      
      // Get user data
      const userRef = doc(db, this.usersCollection, currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      
      // Create review document
      const reviewDoc = {
        trekId,
        userId: currentUser.uid,
        userName: userData.name || currentUser.displayName || 'Anonymous',
        userPhoto: userData.photoURL || currentUser.photoURL || null,
        rating: Number(rating),
        comment: comment || '',
        createdAt: serverTimestamp(),
        status: 'published', // 'pending', 'published', 'rejected'
        helpful: 0,
        helpfulBy: []
      };
      
      console.log('Creating review with data:', JSON.stringify({
        ...reviewDoc, 
        comment: reviewDoc.comment,
        commentLength: reviewDoc.comment?.length
      }));
      
      const reviewRef = await addDoc(collection(db, this.reviewsCollection), reviewDoc);
      
      // Update trek's average rating
      await this.updateTrekRating(trekId);
      
      return {
        success: true,
        id: reviewRef.id,
        message: 'Review submitted successfully'
      };
    } catch (error) {
      console.error('Error creating review:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit review'
      };
    }
  }

  /**
   * Get all reviews for a specific trek
   * @param {string} trekId - Trek ID
   * @param {number} limit - Maximum number of reviews to fetch
   * @returns {Promise<Array>} - Array of reviews
   */
  async getTrekReviews(trekId, reviewLimit = 10) {
    try {
      const q = query(
        collection(db, this.reviewsCollection),
        where('trekId', '==', trekId),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(reviewLimit)
      );
      
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const review = {
          id: doc.id,
          ...data,
          createdAt: this.formatTimestamp(data.createdAt)
        };
        console.log(`Review ${doc.id}:`, review);
        console.log(`Comment present:`, !!review.comment, 'Comment value:', review.comment);
        return review;
      });
      console.log(`Found ${reviews.length} reviews for trek ${trekId}`);
      return reviews;
    } catch (error) {
      console.error('Error fetching trek reviews:', error);
      return [];
    }
  }

  /**
   * Get review statistics for a trek
   * @param {string} trekId - Trek ID
   * @returns {Promise<Object>} - Review statistics
   */
  async getTrekReviewStats(trekId) {
    try {
      const reviews = await this.getTrekReviews(trekId, 1000); // Get all reviews for stats
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }
      
      // Calculate average rating
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / reviews.length;
      
      // Calculate rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(review => {
        if (distribution[review.rating] !== undefined) {
          distribution[review.rating]++;
        }
      });
      
      return {
        averageRating: parseFloat(average.toFixed(1)),
        totalReviews: reviews.length,
        ratingDistribution: distribution
      };
    } catch (error) {
      console.error('Error fetching trek review stats:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  }

  /**
   * Get a user's review for a specific trek
   * @param {string} userId - User ID
   * @param {string} trekId - Trek ID
   * @returns {Promise<Object|null>} - Review data or null
   */
  async getUserReviewForTrek(userId, trekId) {
    try {
      const q = query(
        collection(db, this.reviewsCollection),
        where('userId', '==', userId),
        where('trekId', '==', trekId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: this.formatTimestamp(doc.data().createdAt)
      };
    } catch (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
  }

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Result of the operation
   */
  async updateReview(reviewId, updateData) {
    try {
      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      const reviewSnap = await getDoc(reviewRef);
      
      if (!reviewSnap.exists()) throw new Error('Review not found');
      
      const reviewData = reviewSnap.data();
      const currentUser = auth.currentUser;
      
      // Check if user owns this review
      if (reviewData.userId !== currentUser.uid) throw new Error('You can only edit your own reviews');
      
      // Only allow updating rating and comment
      const validUpdates = {};
      if ('rating' in updateData) {
        const rating = Number(updateData.rating);
        if (rating < 1 || rating > 5) throw new Error('Rating must be between 1-5');
        validUpdates.rating = rating;
      }
      
      if ('comment' in updateData) {
        validUpdates.comment = updateData.comment || '';
      }
      
      // Add updated timestamp
      validUpdates.updatedAt = serverTimestamp();
      
      await updateDoc(reviewRef, validUpdates);
      
      // Update trek's average rating
      await this.updateTrekRating(reviewData.trekId);
      
      return {
        success: true,
        message: 'Review updated successfully'
      };
    } catch (error) {
      console.error('Error updating review:', error);
      return {
        success: false,
        message: error.message || 'Failed to update review'
      };
    }
  }

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise<Object>} - Result of the operation
   */
  async deleteReview(reviewId) {
    try {
      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      const reviewSnap = await getDoc(reviewRef);
      
      if (!reviewSnap.exists()) throw new Error('Review not found');
      
      const reviewData = reviewSnap.data();
      const currentUser = auth.currentUser;
      
      // Check if user owns this review
      if (reviewData.userId !== currentUser.uid) throw new Error('You can only delete your own reviews');
      
      // Store trek ID before deletion
      const trekId = reviewData.trekId;
      
      // Delete the review
      await deleteDoc(reviewRef);
      
      console.log(`Review ${reviewId} deleted from trek ${trekId}`);
      
      // Update trek's average rating after deletion
      await this.updateTrekRating(trekId);
      
      // Update trek's average rating
      await this.updateTrekRating(trekId);
      
      return {
        success: true,
        message: 'Review deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting review:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete review'
      };
    }
  }

  /**
   * Mark a review as helpful/unhelpful
   * @param {string} reviewId - Review ID
   * @param {boolean} isHelpful - Whether the review is helpful
   * @returns {Promise<Object>} - Result of the operation
   */
  async markReviewHelpful(reviewId, isHelpful = true) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('You must be logged in');
      
      const reviewRef = doc(db, this.reviewsCollection, reviewId);
      const reviewSnap = await getDoc(reviewRef);
      
      if (!reviewSnap.exists()) throw new Error('Review not found');
      
      const reviewData = reviewSnap.data();
      const helpfulBy = reviewData.helpfulBy || [];
      
      // Check if user already marked this review
      const userIndex = helpfulBy.indexOf(currentUser.uid);
      
      // User is marking as helpful
      if (isHelpful) {
        // If user hasn't marked this review yet
        if (userIndex === -1) {
          await updateDoc(reviewRef, {
            helpful: (reviewData.helpful || 0) + 1,
            helpfulBy: [...helpfulBy, currentUser.uid]
          });
          return { success: true, message: 'Marked as helpful' };
        }
        return { success: false, message: 'You already marked this review' };
      } 
      // User is unmarking as helpful
      else {
        // If user has marked this review
        if (userIndex !== -1) {
          helpfulBy.splice(userIndex, 1);
          await updateDoc(reviewRef, {
            helpful: Math.max(0, (reviewData.helpful || 0) - 1),
            helpfulBy: helpfulBy
          });
          return { success: true, message: 'Removed helpful mark' };
        }
        return { success: false, message: 'You haven\'t marked this review yet' };
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
      return {
        success: false,
        message: error.message || 'Failed to mark review'
      };
    }
  }

  /**
   * Update a trek's average rating
   * @param {string} trekId - Trek ID
   */
  async updateTrekRating(trekId) {
    try {
      const stats = await this.getTrekReviewStats(trekId);
      
      const trekRef = doc(db, this.treksCollection, trekId);
      await updateDoc(trekRef, {
        rating: stats.averageRating,
        reviewCount: stats.totalReviews,
        ratingUpdatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating trek rating:', error);
    }
  }

  /**
   * Format Firestore timestamp to a readable date string
   * @param {Timestamp} timestamp - Firestore timestamp
   * @returns {string} - Formatted date string
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown date';
    
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return this.getRelativeTime(date);
    }
    
    return 'Unknown date';
  }

  /**
   * Get relative time (e.g. "2 days ago")
   * @param {Date} date - Date object
   * @returns {string} - Relative time string
   */
  getRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  }

  /**
   * Create a mock trek if it doesn't exist (for development/testing only)
   * @param {string} trekId - The ID of the trek to create
   * @private
   */
  async _createMockTrekIfNeeded(trekId) {
    try {
      const trekRef = doc(db, this.treksCollection, trekId);
      const trekSnap = await getDoc(trekRef);
      
      if (!trekSnap.exists()) {
        console.log(`Creating mock trek with ID: ${trekId}`);
        
        // Create a mock trek for testing purposes
        await setDoc(trekRef, {
          title: `Trek ${trekId}`,
          description: 'This is a mock trek created for testing the review system',
          rating: 0,
          reviewCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log('Mock trek created successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating mock trek:', error);
      return false;
    }
  }
}

export default new ReviewService();
