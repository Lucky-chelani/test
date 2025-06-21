import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Fetch organizer details from Firestore to enrich trek data
 * @param {string} organizerId - The ID of the organizer
 * @returns {Promise<Object>} - Organizer details object
 */
export const fetchOrganizerDetails = async (organizerId) => {
  try {
    if (!organizerId) {
      throw new Error('No organizer ID provided');
    }
    
    const organizerDoc = await getDoc(doc(db, 'users', organizerId));
    
    if (!organizerDoc.exists()) {
      throw new Error(`Organizer with ID ${organizerId} not found`);
    }
    
    const organizerData = organizerDoc.data();
    
    // Try to get organization details if they exist
    let organizationDetails = null;
    try {
      const orgDoc = await getDoc(doc(db, 'organizations', organizerId));
      if (orgDoc.exists()) {
        organizationDetails = orgDoc.data();
      }
    } catch (error) {
      console.warn('Error fetching organization details:', error);
      // Continue without organization details
    }
    
    return {
      organizerId,
      organizerName: organizerData.name || organizerData.displayName || 'Trek Organizer',
      organizerEmail: organizerData.email || '',
      organizerVerified: organizerData.verified || 
        (organizerData.organizationDetails && organizerData.organizationDetails.verified) || 
        (organizationDetails && organizationDetails.verified) || 
        false,
      organizerDescription: (organizerData.organizationDetails && organizerData.organizationDetails.description) || 
        (organizationDetails && organizationDetails.description) || 
        organizerData.bio || 
        'Experienced trek organizer providing amazing trekking experiences.',
      organizerExperience: (organizerData.organizationDetails && organizerData.organizationDetails.experience) || 
        (organizationDetails && organizationDetails.experience) || 
        '1+ years'
    };
  } catch (error) {
    console.error('Error fetching organizer details:', error);
    // Return fallback data if we can't get organizer details
    return {
      organizerId,
      organizerName: 'Trek Organizer',
      organizerVerified: false,
      organizerDescription: 'Experienced trek organizer providing amazing trekking experiences.',
      organizerExperience: '1+ years'
    };
  }
};

/**
 * Create trek data object from form data with enhanced organizer details
 * @param {Object} formData - The form data for the trek
 * @param {Object} user - The current user object
 * @param {string} imageUrl - The URL for the trek image
 * @param {Array} categories - Array of available categories
 * @returns {Promise<Object>} - Complete trek data object
 */
export const prepareTrekData = async (formData, user, imageUrl, categories) => {
  // Get category name for the selected category
  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const categoryName = selectedCategory ? selectedCategory.name : '';
  
  // Get organizer details
  const organizerDetails = await fetchOrganizerDetails(user.uid);
  
  // Create trek data with all necessary fields
  return {
    ...formData,
    days: Number(formData.days || 1),
    rating: Number(formData.rating || 4.0),
    price: Number(formData.price || 0),
    reviews: Number(formData.reviews || 0),
    image: imageUrl,
    ...organizerDetails, // Add all organizer details
    categoryName: categoryName, // Add category name for easy display
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  };
};
