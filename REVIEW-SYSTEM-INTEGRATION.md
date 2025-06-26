# Review System Integration Guide

## Overview

This document provides instructions to integrate the new review system into the TreksDetails.jsx component of your trekking application.

## Files Created

1. **ReviewService.js** - Backend service to manage reviews in Firebase
2. **ReviewForm.jsx** - Component for submitting and editing reviews
3. **ReviewCard.jsx** - Component to display individual reviews
4. **ReviewStats.jsx** - Component to display ratings statistics
5. **Reviews.jsx** - Main component that combines all review components

## Integration Steps

### Step 1: Import the Reviews Component

In TreksDetails.jsx, add this import:

```jsx
import Reviews from './Reviews';
```

### Step 2: Add Reviews Section to Your Trek Details Page

Find an appropriate section in TreksDetails.jsx where you want to display reviews. A good place would be after the trek description and details, but before related treks.

```jsx
{/* Reviews Section */}
<Section>
  <SectionHeader>
    <SectionTitle>Reviews</SectionTitle>
  </SectionHeader>
  <SectionBody>
    <Reviews trekId={id} />
  </SectionBody>
</Section>
```

### Step 3: Update Firebase Security Rules

Make sure your Firestore security rules allow users to read and write reviews:

```
// Allow authenticated users to create reviews
match /reviews/{reviewId} {
  allow read;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

### Step 4: Update Trek Schema

The review system will automatically update trek documents with review statistics. Ensure your trek schema includes these fields:

- `rating` (number) - Average star rating
- `reviewCount` (number) - Total number of reviews
- `ratingUpdatedAt` (timestamp) - When the rating was last updated

### Step 5: Create Database Indexes

For optimal performance, create these Firestore indexes:

1. Collection: reviews
   - Fields to index: trekId (Ascending), createdAt (Descending)

2. Collection: reviews
   - Fields to index: userId (Ascending), trekId (Ascending)

## Usage Instructions

### Displaying Review Statistics

The review system will automatically manage review statistics. To display the average rating in your trek listings, use:

```jsx
<div className="trek-rating">
  <FaStar /> {trek.rating || 0} ({trek.reviewCount || 0})
</div>
```

### Sorting Treks by Rating

You can use the review statistics to sort treks by rating:

```javascript
const sortedTreks = treks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
```

## Features Included

- Star ratings (1-5 stars)
- Detailed review comments
- Review statistics with visual distribution
- Users can edit and delete their own reviews
- "Helpful" voting system
- Real-time rating updates

## Note on Data Migration

If you already have ratings stored in a different format, you may need to migrate that data to work with this new system.

## Contact

For any questions or assistance with this integration, please contact the development team.
