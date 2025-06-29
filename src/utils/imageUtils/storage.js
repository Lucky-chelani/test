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
export const uploadImage = async (file, path, onProgress, metadata = {}) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }
  
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Add admin metadata for community image paths
    if (path.startsWith('community-images/')) {
      metadata = {
        ...metadata,
        adminUpload: 'true',
        contentType: file.type
      };
    }
    
    console.log(`Uploading to path: ${path} with metadata:`, metadata);
    
    // Upload file with progress tracking and metadata
    const uploadTask = uploadBytesResumable(storageRef, file, { 
      contentType: file.type,
      customMetadata: metadata 
    });
    
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
  if (!imageUrl) {
    console.log("No image URL provided to delete");
    return false;
  }
  
  if (!imageUrl.includes('firebasestorage')) {
    console.log("Not a Firebase Storage URL:", imageUrl);
    return false; // Skip if not a Firebase Storage URL
  }
  
  try {
    console.log("Deleting image from:", imageUrl);
    // Extract the storage path from the Firebase URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error, just return false to indicate failure
    return false;
  }
};

/**
 * Generate a unique storage path for a trek image
 * @param {string} trekId - The ID of the trek
 * @param {number} index - Optional index for multiple images
 * @returns {string} - A unique storage path
 */
export const getTrekImagePath = (trekId, index = 0) => {
  // Convert trekId to a simpler format to avoid path issues
  const sanitizedId = String(trekId)
    .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with hyphens
    .substring(0, 30);              // Limit length to avoid excessively long paths
    
  // Generate a unique filename that matches our storage rules
  const timestamp = Date.now();
  const uniqueId = `${sanitizedId}-${index}-${timestamp}`;
  
  // Make sure the path matches our storage rules
  return `trek-images/${uniqueId}`;
};

/**
 * Upload multiple trek images to Firebase Storage
 * @param {Array<File>} files - Array of file objects to upload
 * @param {string} trekId - ID of the trek
 * @param {Function} onProgress - Optional callback for overall progress updates
 * @param {Function} onFileProgress - Optional callback for individual file progress updates
 * @returns {Promise<Array<string>>} - Promise resolving to array of download URLs
 */
export const uploadMultipleImages = async (files, trekId, onProgress, onFileProgress) => {
  if (!files || !files.length) {
    return [];
  }
  
  try {
    const uploadPromises = files.map((file, index) => {
      const path = getTrekImagePath(trekId, index);
      
      // Add metadata for admin uploads
      const metadata = {
        contentType: file.type,
        trekId: trekId,
        imageIndex: index.toString()
      };
      
      return uploadImage(
        file, 
        path, 
        (progress) => {
          if (onFileProgress) {
            onFileProgress(index, progress);
          }
        },
        metadata
      );
    });
    
    // Track overall progress
    let completedUploads = 0;
    const totalUploads = files.length;
    
    const urls = await Promise.all(
      uploadPromises.map(promise => 
        promise.then(url => {
          completedUploads++;
          if (onProgress) {
            onProgress((completedUploads / totalUploads) * 100);
          }
          return url;
        })
      )
    );
    
    return urls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
};

/**
 * Generate a unique storage path for a community image
 * @param {string} communityId - The ID of the community
 * @returns {string} - A unique storage path
 */
export const getCommunityImagePath = (communityId) => {
  // Convert communityId to a simpler format to avoid path issues
  const sanitizedId = String(communityId)
    .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with hyphens
    .substring(0, 30);              // Limit length to avoid excessively long paths
    
  const timestamp = Date.now();
  console.log(`Generating community image path for ID: ${sanitizedId}`);
  return `community-images/${sanitizedId}-${timestamp}`;
};
