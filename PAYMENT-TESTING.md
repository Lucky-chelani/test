# Razorpay Integration Testing Guide

This guide explains how to test the Razorpay payment integration in your application.

## Error Fixes

The following issues have been fixed:

1. **Firebase Permission Error**
   - Added proper Firestore security rules for bookings and payments collections
   - Ensured userId is correctly included in all database operations
   - Added validation to prevent undefined values being sent to Firestore

2. **Razorpay Script Loading**
   - Enhanced script loading to be more reliable
   - Added checks to avoid duplicate script loading
   - Fixed handlers for payment success and failure

3. **Data Validation**
   - Added proper validation for all order data
   - Sanitized input to prevent Firebase errors

## Testing Options

### Option 1: Firebase Integration Test (Real)
- URL: `/payment-test`
- This test uses real Firebase operations
- Requires proper Firebase permissions
- Use this when you want to test the actual integration

### Option 2: Mock Payment Test (For Development)
- URL: `/mock-payment`
- This test bypasses Firebase operations
- Uses mock objects instead of real database operations
- Useful for UI testing and development
- No risk of affecting production data

## Implementation Details

- **Firestore Rules**: Updated to allow authenticated users to create and access their own booking and payment records
- **Debug Utilities**: Added for easier troubleshooting
- **Testing Components**: Created separate components for real and mock testing

## How to Deploy

1. Deploy updated Firestore rules:
   ```
   firebase deploy --only firestore:rules
   ```

2. Deploy Cloud Functions (if needed):
   ```
   firebase deploy --only functions
   ```

3. Deploy the updated web application:
   ```
   npm run build
   firebase deploy --only hosting
   ```

## Troubleshooting

If you encounter errors:

1. Check the browser console for specific error messages
2. Use the debug utilities to log more information
3. Check if you're logged in when testing the real integration
4. For development, prefer the mock test to avoid permission issues
