// Firebase Storage utilities for image handling

/**
 * Get a valid image URL from a trek image path or provide a fallback
 * @param {string} imageUrl - The image URL or path
 * @returns {string} - A valid URL for display
 */
export const getValidImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === '') {
    // Return a default placeholder image if no image is provided
    return 'https://via.placeholder.com/800x600?text=Trek+Image+Coming+Soon';
  }
  
  // Handle Object URLs (used for previews)
  if (imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
  // Apply image optimization if needed
  return formatImageUrl(imageUrl);
};

/**
 * Format image URL for proper display depending on source
 * @param {string} imagePath - The image path from Firebase or other source
 * @returns {string} - Formatted URL ready for use in components
 */
export const formatImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Handle Firebase Storage URLs
  if (imagePath.includes('firebasestorage.googleapis.com')) {
    // Firebase URLs can be used directly, or we could add caching/optimization here
    return imagePath;
  }
  
  // Handle relative paths
  if (imagePath.startsWith('/')) {
    return window.location.origin + imagePath;
  }
  
  // Return the original URL for all other cases
  return imagePath;
};
