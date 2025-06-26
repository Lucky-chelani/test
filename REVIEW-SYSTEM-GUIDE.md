# Trek Review System Guide

The Trek Review System allows users to submit, view, edit, and delete reviews for individual treks. Each trek has its own set of reviews and an overall rating calculated as an average of all reviews.

## Features

- **Per-Trek Reviews**: Reviews are associated with specific treks
- **User-Specific Reviews**: Users can submit only one review per trek
- **Rating System**: 1-5 star rating with comments
- **Review Statistics**: Average rating and distribution of ratings
- **Review Management**: Users can edit or delete their own reviews
- **Helpful Votes**: Users can mark reviews as helpful

## Implementation Details

### Components

1. **Reviews.jsx**: Main component that orchestrates the review system
2. **ReviewForm.jsx**: Form for creating and editing reviews
3. **ReviewCard.jsx**: Displays individual review with user info, rating, and comment
4. **ReviewStats.jsx**: Displays review statistics and rating distribution
5. **ReviewService.js**: Service for handling Firebase operations related to reviews

### Firebase Integration

- **Firestore Collection**: Reviews are stored in a 'reviews' collection
- **Security Rules**: Rules are set to ensure only authenticated users can submit reviews and users can only edit/delete their own reviews
- **Cloud Functions**: Automatic update of trek ratings when reviews are added, edited, or deleted

## Usage

### Adding a Review

1. Navigate to a trek details page
2. If logged in, click "Write a Review" button
3. Select a star rating (1-5) and optionally add a comment
4. Click "Submit Review"

### Editing a Review

1. Navigate to a trek details page where you've previously submitted a review
2. Find your review under "Your Review"
3. Click the "Edit" button
4. Update your rating or comment
5. Click "Update Review"

### Deleting a Review

1. Navigate to a trek details page where you've previously submitted a review
2. Find your review under "Your Review"
3. Click the "Delete" button
4. Confirm deletion when prompted

## Firestore Schema

### Review Document

```javascript
{
  id: 'generated-id',           // Document ID
  trekId: 'trek-id',            // Reference to trek
  userId: 'user-id',            // Reference to user
  userName: 'User Name',        // Display name of user
  userPhoto: 'url',             // Optional URL to user's photo
  rating: 4,                    // Numeric rating 1-5
  comment: 'Great trek!',       // Optional text review
  createdAt: timestamp,         // Date review was created
  updatedAt: timestamp,         // Date review was last updated
  status: 'published',          // 'published', 'pending', 'rejected'
  helpful: 2,                   // Number of helpful votes
  helpfulBy: ['user-id-1', 'user-id-2']  // Users who marked this review as helpful
}
```

## Firebase Security Rules

```
match /reviews/{reviewId} {
  // Anyone can read reviews
  allow read: if true;
  
  // Only authenticated users can create reviews
  allow create: if request.auth != null && 
    // Ensure user is setting their own userId
    request.resource.data.userId == request.auth.uid &&
    // Validate required fields
    request.resource.data.trekId is string &&
    request.resource.data.rating is number && 
    request.resource.data.rating >= 1 && 
    request.resource.data.rating <= 5;
  
  // Users can only edit/delete their own reviews
  allow update, delete: if request.auth != null && 
    resource.data.userId == request.auth.uid;
    
  // Allow marking reviews as helpful
  allow update: if request.auth != null &&
    // Only allow updates to the helpful and helpfulBy fields
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['helpful', 'helpfulBy']);
}
```

## Cloud Functions

The system uses Firebase Cloud Functions to keep trek ratings up-to-date:

- `onReviewCreate`: Updates trek rating when a new review is created
- `onReviewUpdate`: Updates trek rating when a review's rating changes
- `onReviewDelete`: Updates trek rating when a review is deleted

These functions automatically calculate the average rating from all published reviews and update the trek document.

## Further Development

- **Admin Moderation**: Add functionality for admins to approve/reject reviews
- **Reply to Reviews**: Allow trek organizers to respond to reviews
- **Photos in Reviews**: Enable users to upload photos with their reviews
- **Filter/Sort**: Add options to filter and sort reviews by rating, date, etc.
- **Verified Purchase**: Mark reviews from users who have booked the trek
