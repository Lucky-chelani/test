# Trek Images Feature Documentation

This document outlines the implementation of the multiple images feature for treks, allowing organizers to upload and manage multiple images, select a cover photo, specify available months for booking, and provide detailed day-by-day itinerary.

## Features Overview

1. **Multiple Images Upload**
   - Organizers can upload multiple images for each trek
   - Choose a cover photo from the uploaded images
   - Images are displayed in an auto-swiping carousel on trek details page

2. **Trek Availability by Month**
   - Specify which months the trek is available for booking
   - Booking modal restricts date selection to available months
   - Visual calendar display showing available months in trek details

3. **Day-by-Day Itinerary**
   - Create a detailed day-by-day itinerary for each trek
   - Each day can have a title, description, activities, and locations

4. **Detailed Description**
   - Extended description field for comprehensive trek information
   - Supports multi-paragraph formatting

## Data Structure

The trek object in Firestore has been extended with the following fields:

```javascript
{
  // Existing fields
  name: String,
  location: String,
  description: String,
  price: Number,
  imageUrl: String,  // Still maintained for backward compatibility
  // ...other existing fields
  
  // New fields
  imageUrls: Array<String>,  // Array of image URLs
  coverIndex: Number,        // Index of the cover image in imageUrls array
  availableMonths: Array<Number>,  // Months when trek is available (0-11, Jan=0)
  detailedDescription: String,  // Extended description with richer content
  itinerary: Array<{          // Day-by-day itinerary
    title: String,
    description: String,
    activities: Array<String>,
    location: String
  }>
}
```

## Components

1. **MultipleImagesUploader**
   - Handles uploading multiple images
   - Allows selecting a cover image
   - Provides preview thumbnails
   
2. **ImageCarousel**
   - Displays trek images in an auto-swiping carousel
   - Provides navigation controls
   - Falls back to single image display for older treks
   
3. **MonthAvailability**
   - Visual selector for available months
   - Used in trek creation and editing forms
   
4. **ItineraryManager**
   - Interface for creating and managing day-by-day itinerary
   - Used in trek creation and editing forms

## Security Rules

Updated Firebase Storage rules to ensure only authenticated admins and organizers can upload trek images:

```
match /trek-images/{trekId}/{fileName} {
  allow read: if true;
  allow write: if request.auth != null && 
    (request.auth.token.email in ['admin@example.com'] ||
     exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
     (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'organizer' || 
      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'));
}
```

Firestore rules ensure only admins and organizers can create/update trek information.

## Usage Instructions

### For Organizers

1. **Creating a New Trek**
   - Fill out the basic trek information
   - Upload multiple images using the image uploader
   - Click on an image to set it as the cover image
   - Add detailed description
   - Select which months the trek is available
   - Create a day-by-day itinerary

2. **Editing an Existing Trek**
   - All the same options as creation are available
   - Previously uploaded images can be removed or rearranged
   - Cover image can be changed

### For Users

1. **Viewing Trek Details**
   - Swipe through all trek images in the carousel
   - See detailed description and day-by-day itinerary
   - View which months the trek is available

2. **Booking a Trek**
   - Can only select dates within available months
   - Will see warning if attempting to book outside available months
