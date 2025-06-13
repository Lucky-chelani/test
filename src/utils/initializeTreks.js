import { db } from '../firebase';

import { collection, addDoc, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';

// This script adds sample trek data to Firestore for testing and development
// It checks if data already exists to avoid duplicates

const sampleTreks = [
  {
    id: "bhrigu-lake",
    image: "https://images.unsplash.com/photo-1626968361222-291e74711449?q=80&w=1470&auto=format&fit=crop", // Using Unsplash image
    country: "India",
    difficulty: "Difficult",
    title: "Bhrigu Lake Trek",
    rating: 4.8,
    reviews: 124,
    days: 8,
    price: "3,850 Rupees",
    location: "Himachal Pradesh",
    season: "Aug-Sept", // Added season field
    description: "Located in the eastern Kullu Valley of Himachal Pradesh, the Bhrigu Lake Trek is a short and moderate trek with rewards that surpass expectations. The mesmerizing alpine meadows and pristine blue waters make this a must-experience adventure.",
  },  {
    id: "valley-of-flowers",
    image: "https://images.unsplash.com/photo-1575728252059-db43d03fc2de?q=80&w=1470&auto=format&fit=crop", // Using Unsplash image
    country: "India",
    difficulty: "Moderate",
    title: "Valley Of Flowers Trek",
    rating: 5.0,
    reviews: 98,
    days: 7,
    price: "8,250 Rupees",
    location: "Uttarakhand Himalayas",
    season: "Jul-Aug", 
    description: "The Valley of Flowers is a UNESCO World Heritage Site known for its meadows of endemic alpine flowers. Located in the Western Himalayas, it's a paradise for nature lovers and photographers alike.",
  },  {
    id: "hampta-pass",
    image: "https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?q=80&w=1470&auto=format&fit=crop", // Using Unsplash image
    country: "India",
    difficulty: "Moderate",
    title: "Hampta Pass Trek",
    rating: 4.2,
    reviews: 87,
    days: 6,
    price: "6,050 Rupees",
    location: "Himachal Pradesh",
    season: "Jun-Oct",
    description: "The Hampta Pass trek is a dramatic crossover trek that takes you from the lush green valleys of Kullu to the stark landscapes of Lahaul. Experience the best of both worlds on this incredible journey.",
  }
];

// Function to initialize treks in Firestore - only works for authenticated admins
export const initializeTreks = async (currentUser = null) => {
  try {
    console.log("Starting trek initialization process...");
    
    // Check if user is authenticated
    if (!currentUser) {
      console.error("Authentication required: No user provided");
      return {
        success: false,
        message: "Authentication required: You must be logged in as an admin to initialize treks."
      };
    }
    
    // You would typically check if the user is an admin here
    // This should match the admin check in TrekAdmin.jsx
    console.log(`User ${currentUser.email} attempting to initialize treks`);
    
    const treksCollection = collection(db, 'treks');
    
    // Try creating a test document first to check permissions
    try {
      console.log("Checking write permissions on treks collection...");
      const testDocRef = doc(db, 'treks', 'permission_test');
      await setDoc(testDocRef, { 
        test: true, 
        timestamp: new Date().toISOString(),
        createdBy: currentUser.email
      });
      
      // If successful, delete the test document
      await deleteDoc(testDocRef);
      console.log("Write permission confirmed");
    } catch (permError) {
      console.error("Permission check failed:", permError);
      return { 
        success: false, 
        error: permError, 
        message: `Permission denied: ${permError.message}. Please make sure you have admin privileges and that Firestore rules are correctly deployed.` 
      };
    }
    
    // Check if treks already exist to avoid duplicates
    for (const trek of sampleTreks) {
      try {
        const q = query(treksCollection, where("id", "==", trek.id));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Trek doesn't exist, add it to Firestore
          await addDoc(treksCollection, trek);
          console.log(`Added trek: ${trek.title}`);
        } else {
          console.log(`Trek already exists: ${trek.title}`);
        }
      } catch (trekError) {
        console.error(`Error processing trek ${trek.title}:`, trekError);
        // Continue with other treks even if one fails
      }
    }
    
    console.log('Trek initialization complete!');
    return { success: true };
  } catch (error) {
    console.error('Error initializing treks:', error);
    return { 
      success: false, 
      error,
      message: `Failed to initialize treks: ${error.message}. This might be due to insufficient permissions.`
    };
  }
};

// You can call this function from your admin area or development environment
// Example: import { initializeTreks } from './utils/initializeTreks';
// Then call: initializeTreks();
