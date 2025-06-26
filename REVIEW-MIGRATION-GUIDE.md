# Data Migration Guide for Review System

If you're migrating from an older rating system to the new Firebase-backed review system, follow these steps:

## Migrating Trek Ratings

If you currently store trek ratings in a different format (star ratings without user reviews), you'll need to migrate that data to work with the new system.

### Step 1: Export Current Rating Data

```javascript
// Script to export current ratings
const exportCurrentRatings = async () => {
  const db = firebase.firestore();
  const treksSnapshot = await db.collection('treks').get();
  
  const ratingsData = [];
  treksSnapshot.forEach(doc => {
    const trek = doc.data();
    if (trek.rating) {
      ratingsData.push({
        trekId: doc.id,
        rating: trek.rating,
        reviews: trek.reviews || 0
      });
    }
  });
  
  console.log(JSON.stringify(ratingsData, null, 2));
  return ratingsData;
};
```

### Step 2: Create Anonymous Reviews

For each trek with ratings, create anonymous system reviews to match the previous rating:

```javascript
// Script to create anonymous reviews based on old ratings
const migrateRatings = async (ratingsData) => {
  const db = firebase.firestore();
  const batch = db.batch();
  
  for (const item of ratingsData) {
    // Create a number of reviews based on the previous review count
    const reviewCount = Math.min(item.reviews || 5, 10); // Cap at 10 reviews per trek
    
    for (let i = 0; i < reviewCount; i++) {
      // Calculate a rating around the average
      const variance = Math.random() * 1 - 0.5; // -0.5 to +0.5
      const rating = Math.min(Math.max(Math.round(item.rating + variance), 1), 5);
      
      const reviewRef = db.collection('reviews').doc();
      batch.set(reviewRef, {
        trekId: item.trekId,
        userId: 'system-migration',
        userName: 'Previous User',
        rating: rating,
        comment: 'Rating migrated from previous system.',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'published',
        helpful: 0,
        helpfulBy: []
      });
    }
  }
  
  await batch.commit();
  console.log(`Migration completed for ${ratingsData.length} treks.`);
};
```

### Step 3: Update Trek Documents

After migration, trigger a recalculation of trek ratings:

```javascript
// Script to update trek ratings based on new reviews
const updateTrekRatings = async (ratingsData) => {
  const functions = firebase.functions();
  const updateRatingsFn = functions.httpsCallable('updateAllTrekRatings');
  
  try {
    const result = await updateRatingsFn();
    console.log('Rating update completed:', result.data);
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
};
```

## Implementation Notes

1. Run these scripts carefully and in order
2. Back up your data before migration
3. Consider running in a test environment first
4. For large datasets, batch the operations to avoid timeouts

## Validating Migration

After migration, verify:

1. Each trek has the correct number of reviews
2. The average rating matches the previous rating
3. New reviews can be added and affect the rating properly

For assistance with migration, contact the development team.
