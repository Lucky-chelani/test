// Firebase storage utilities for images

import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The file object to upload
 * @param {string} path - Storage path where image should be saved
 * @param {Function} onProgress - Optional callback for progress updates
 * @returns {Promise<string>} - Promise resolving to download URL of uploaded file
 */
export const uploadImage = async (file, path, onProgress) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }
  
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload file with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Return a promise that resolves with the download URL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Handle errors with more specific information
          console.error("Upload error:", error.code, error.message);
          
          if (error.code === 'storage/unauthorized') {
            reject(new Error("Permission denied: You don't have permission to upload to this location. Please check if you're logged in and have the proper permissions."));
          } else {
            reject(error);
          }
        },
        async () => {
          try {
            // Upload completed, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (urlError) {
            reject(urlError);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error setting up upload:", error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The full URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('firebasestorage')) {
    return; // Skip if not a Firebase Storage URL
  }
  
  try {
    // Extract the storage path from the Firebase URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

/**
 * Generate a unique storage path for a trek image
 * @param {string} trekId - The ID of the trek
 * @returns {string} - A unique storage path
 */
export const getTrekImagePath = (trekId) => {
  // Convert trekId to a simpler format to avoid path issues
  const sanitizedId = String(trekId)
    .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with hyphens
    .substring(0, 30);              // Limit length to avoid excessively long paths
    
  return `trek-images/${sanitizedId}-${Date.now()}`;
};
