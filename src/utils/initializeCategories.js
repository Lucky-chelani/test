import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, query, limit } from 'firebase/firestore';

/**
 * Initialize categories in Firestore if they don't exist
 * @returns {Promise<Array>} Array of category objects
 */
export const initializeCategories = async () => {
  try {
    console.log('Checking for existing categories...');
    const categoriesCollection = collection(db, 'categories');
    const categoriesQuery = query(categoriesCollection, limit(10)); // Limit to improve performance
    const categoriesSnapshot = await getDocs(categoriesQuery);
    
    // Only initialize if categories collection is empty
    if (categoriesSnapshot.empty) {
      console.log('No categories found. Initializing default trek categories...');
      
      const defaultCategories = [
      {
        id: 'mountain',
        name: 'Mountain Trek',
        description: 'Treks focusing on mountains and peaks',
        icon: 'mountain'
      },
      {
        id: 'forest',
        name: 'Forest Trek',
        description: 'Treks through lush forests and woods',
        icon: 'tree'
      },
      {
        id: 'waterfall',
        name: 'Waterfall Trek',
        description: 'Treks featuring beautiful waterfalls',
        icon: 'water'
      },
      {
        id: 'valley',
        name: 'Valley Trek',
        description: 'Treks across scenic valleys',
        icon: 'landscape'
      },
      {
        id: 'hill-station',
        name: 'Hill Station',
        description: 'Treks to popular hill stations',
        icon: 'mountains'
      },
      {
        id: 'adventure',
        name: 'Adventure Trek',
        description: 'Challenging treks for adventure seekers',
        icon: 'hiking'
      },
      {
        id: 'beginner',
        name: 'Beginner Trek',
        description: 'Easy treks suitable for beginners',
        icon: 'walking'
      },
      {
        id: 'family',
        name: 'Family Trek',
        description: 'Treks suitable for families with children',
        icon: 'users'
      }
    ];
    
    // Add all categories in parallel
    await Promise.all(
      defaultCategories.map(category => 
        setDoc(doc(db, 'categories', category.id), category)
      )
    );
    
    console.log('Trek categories initialized successfully.');
    return defaultCategories;
  }    // Return existing categories
    console.log(`Found ${categoriesSnapshot.docs.length} existing categories`);
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error initializing categories:', error);
    throw new Error(`Failed to load or initialize categories: ${error.message}`);
  }
};

export default initializeCategories;
