// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOMQAssG1SUFsFb_dI-b1PBMvugOJfyBM",
  authDomain: "trovia-142e1.firebaseapp.com",
  projectId: "trovia-142e1",
  storageBucket: "trovia-142e1.firebasestorage.app",
  messagingSenderId: "548230347688",
  appId: "1:548230347688:web:a5b6949a82831d7af53b9d",
  measurementId: "G-MDT4526EYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

/**
 * Ensures a string is a valid Firestore document ID

* This is a critical utility that guarantees a valid ID in all cases
 * @param {any} id - The potential document ID
 * @returns {string} - A sanitized document ID or fallback ID if input is invalid
 */
const getSafeDocumentId = (id) => {
  // Handle null, undefined, or non-string values
  if (!id || typeof id !== 'string' || id.trim() === '') {
    // Generate a reliable fallback ID with timestamp for uniqueness
    return `fallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }
  
  // Replace invalid characters with underscores
  // Firestore IDs can't contain: ., /, [, ], #, * characters
  const safeId = id.replace(/[./#[\]* ]/g, '_');
  
  // Ensure ID isn't too long (Firestore has a 1500 byte limit)
  if (safeId.length > 100) {
    return safeId.substring(0, 100);
  }
  
  // Final safety check - should never happen but just in case
  if (!safeId || safeId.trim() === '') {
    return `emergency_fallback_${Date.now()}`;
  }
  
  return safeId;
};

// Helper function to ensure collections exist with error handling
const ensureCollectionExists = async (collectionName) => {
  try {
    // Try to get the collection
    const collectionRef = collection(db, collectionName);
    await getDocs(collectionRef);
    console.log(`Collection ${collectionName} exists`);
    return { success: true };
  } catch (error) {
    try {
      // If there's an error, create a placeholder document
      await setDoc(doc(db, collectionName, "placeholder"), {
        note: "This is a placeholder document to ensure the collection exists",
        created: new Date().toISOString()
      });
      console.log(`Created placeholder in ${collectionName} collection`);
      return { success: true };
    } catch (createError) {
      console.error(`Failed to create ${collectionName} collection:`, createError);
      return { 
        success: false, 
        error: createError,
        message: `Permission error: ${createError.message}. Please ensure you have proper Firestore permissions.` 
      };
    }
  }
};

// Ensure treks collection exists when app initializes
ensureCollectionExists("treks").catch(err => console.error("Failed to initialize treks collection:", err));

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, db, storage, functions, getSafeDocumentId, ensureCollectionExists };