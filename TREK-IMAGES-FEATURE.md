# Multiple Trek Images Feature Documentation

## Overview

This feature enhances trek pages with multiple image uploads and an image gallery display. Administrators and trek organizers can now:

1. Upload multiple trek images (up to 10 per trek)
2. Select a cover image
3. View a beautiful auto-swiping image gallery on trek detail pages

## Components

### 1. MultipleImagesUploader

Located at `src/components/MultipleImagesUploader.jsx`, this component provides a user interface for:

- Uploading multiple images
- Selecting a cover image
- Previewing uploaded images
- Removing images
- Drag & drop image upload support

### 2. ImageCarousel

Located at `src/components/ImageCarousel.jsx`, this component creates an auto-swiping image gallery with:

- Automatic image rotation
- Manual navigation controls (prev/next buttons)
- Dot indicators showing current image
- Smooth transitions between images

## Firestore Data Structure

Trek documents now include these additional fields:

```javascript
{
  // Existing fields...
  image: "https://...", // Legacy field - points to cover image
  
  // New fields
  imageUrls: ["https://...", "https://...", "https://..."], // Array of all image URLs
  coverIndex: 0 // Index of the cover image in the imageUrls array
}
```

## Implementation Details

### 1. Image Upload

- Images are uploaded to Firebase Storage using the `uploadMultipleImages` utility
- Each image gets stored in the `trek-images/{trekId}-{index}-{timestamp}` path
- Images include metadata: trekId, imageIndex, contentType

### 2. Creating/Editing Treks

- OrganizerAddTrek.jsx and OrganizerEditTrek.jsx both use MultipleImagesUploader
- Users can add up to 10 images per trek
- Default cover image is the first uploaded image unless changed
- Existing images are preserved when editing

### 3. Trek Detail Display

- TreksDetails.jsx shows an auto-swiping image carousel at the top
- Smooth transition between images with navigation controls
- Mobile-responsive design

## Usage

### For Administrators/Organizers:

1. Create or edit a trek
2. Upload images using the MultipleImagesUploader
3. Select your cover image by clicking the star icon
4. Save the trek

### For Users:

- View the auto-swiping image gallery on trek detail pages
- Navigate manually using arrow controls or dots
- See the cover image highlighted in search results

## Backward Compatibility

The system maintains backward compatibility with treks created before this feature:

- Treks with only a single `image` field will display that image
- When editing legacy treks, the single image is converted to the new format
