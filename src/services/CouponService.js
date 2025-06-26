import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  increment,
  Timestamp
} from 'firebase/firestore';

/**
 * Service for coupon-related operations
 */
export const CouponService = {
  /**
   * Create a new coupon
   * @param {Object} couponData - The coupon data
   * @returns {Promise<Object>} The created coupon with ID
   */
  createCoupon: async (couponData) => {
    try {
      // Convert dates to Firestore timestamps if provided
      if (couponData.validFrom) {
        couponData.validFrom = Timestamp.fromDate(new Date(couponData.validFrom));
      }
      if (couponData.validUntil) {
        couponData.validUntil = Timestamp.fromDate(new Date(couponData.validUntil));
      }

      couponData.code = couponData.code.trim().toUpperCase();
      couponData.usageCount = 0;
      couponData.createdAt = Timestamp.now();
      couponData.updatedAt = Timestamp.now();

      const couponRef = await addDoc(collection(db, 'coupons'), couponData);
      return { id: couponRef.id, ...couponData };
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  /**
   * Get all coupons
   * @returns {Promise<Array>} Array of coupons
   */
  getAllCoupons: async () => {
    try {
      const couponsSnapshot = await getDocs(collection(db, 'coupons'));
      return couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        validFrom: doc.data().validFrom?.toDate(),
        validUntil: doc.data().validUntil?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error('Error getting coupons:', error);
      throw error;
    }
  },

  /**
   * Get coupon by ID
   * @param {string} id - The coupon ID
   * @returns {Promise<Object|null>} The coupon or null if not found
   */
  getCouponById: async (id) => {
    try {
      const couponSnapshot = await getDoc(doc(db, 'coupons', id));
      if (!couponSnapshot.exists()) {
        return null;
      }
      const couponData = couponSnapshot.data();
      return {
        id: couponSnapshot.id,
        ...couponData,
        validFrom: couponData.validFrom?.toDate(),
        validUntil: couponData.validUntil?.toDate(),
        createdAt: couponData.createdAt?.toDate(),
        updatedAt: couponData.updatedAt?.toDate(),
      };
    } catch (error) {
      console.error('Error getting coupon:', error);
      throw error;
    }
  },

  /**
   * Get coupon by code
   * @param {string} code - The coupon code
   * @returns {Promise<Object|null>} The coupon or null if not found
   */
  getCouponByCode: async (code) => {
    try {
      const normalizedCode = code.trim().toUpperCase();
      const q = query(collection(db, 'coupons'), where('code', '==', normalizedCode));
      const couponSnapshot = await getDocs(q);
      
      if (couponSnapshot.empty) {
        return null;
      }
      
      const couponDoc = couponSnapshot.docs[0];
      const couponData = couponDoc.data();
      
      return {
        id: couponDoc.id,
        ...couponData,
        validFrom: couponData.validFrom?.toDate(),
        validUntil: couponData.validUntil?.toDate(),
        createdAt: couponData.createdAt?.toDate(),
        updatedAt: couponData.updatedAt?.toDate(),
      };
    } catch (error) {
      console.error('Error getting coupon by code:', error);
      throw error;
    }
  },

  /**
   * Update an existing coupon
   * @param {string} id - The coupon ID
   * @param {Object} couponData - The updated coupon data
   * @returns {Promise<void>}
   */
  updateCoupon: async (id, couponData) => {
    try {
      // Convert dates to Firestore timestamps if provided
      if (couponData.validFrom) {
        couponData.validFrom = couponData.validFrom instanceof Date 
          ? Timestamp.fromDate(couponData.validFrom)
          : Timestamp.fromDate(new Date(couponData.validFrom));
      }
      if (couponData.validUntil) {
        couponData.validUntil = couponData.validUntil instanceof Date
          ? Timestamp.fromDate(couponData.validUntil)
          : Timestamp.fromDate(new Date(couponData.validUntil));
      }

      if (couponData.code) {
        couponData.code = couponData.code.trim().toUpperCase();
      }
      
      couponData.updatedAt = Timestamp.now();
      
      await updateDoc(doc(db, 'coupons', id), couponData);
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  /**
   * Delete a coupon
   * @param {string} id - The coupon ID
   * @returns {Promise<void>}
   */
  deleteCoupon: async (id) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  /**
   * Validate a coupon for a specific order amount
   * @param {string} code - The coupon code
   * @param {number} orderAmount - The total order amount
   * @returns {Promise<Object>} The validation result
   */
  validateCoupon: async (code, orderAmount) => {
    try {
      const coupon = await CouponService.getCouponByCode(code);
      
      if (!coupon) {
        return { valid: false, message: 'Invalid coupon code' };
      }
      
      // Check if coupon is active
      if (coupon.status !== 'active') {
        return { valid: false, message: 'This coupon is inactive' };
      }
      
      // Check valid dates
      const now = new Date();
      if (coupon.validFrom && now < coupon.validFrom) {
        return { 
          valid: false, 
          message: `This coupon is not valid yet. It will be active from ${coupon.validFrom.toLocaleDateString()}`
        };
      }
      
      if (coupon.validUntil && now > coupon.validUntil) {
        return { 
          valid: false, 
          message: `This coupon has expired on ${coupon.validUntil.toLocaleDateString()}`
        };
      }
      
      // Check usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return { valid: false, message: 'This coupon has reached its usage limit' };
      }
      
      // Check minimum purchase
      if (coupon.minPurchase && orderAmount < coupon.minPurchase) {
        return { 
          valid: false, 
          message: `This coupon requires a minimum purchase of ₹${coupon.minPurchase}`
        };
      }
      
      // Calculate discount
      let discountAmount = 0;
      
      if (coupon.discountType === 'percentage') {
        discountAmount = (orderAmount * coupon.discountValue) / 100;
        // Apply max discount if specified
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        // Fixed discount
        discountAmount = coupon.discountValue;
        // Make sure discount doesn't exceed order amount
        if (discountAmount > orderAmount) {
          discountAmount = orderAmount;
        }
      }
      
      return {
        valid: true,
        coupon: {
          ...coupon,
          calculatedDiscount: discountAmount
        }
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, message: 'Failed to validate coupon' };
    }
  },

  /**
   * Apply a coupon (increment usage count)
   * @param {string} couponId - The coupon ID
   * @returns {Promise<void>}
   */
  applyCoupon: async (couponId) => {
    try {
      await updateDoc(doc(db, 'coupons', couponId), {
        usageCount: increment(1),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },
};

export default CouponService;
