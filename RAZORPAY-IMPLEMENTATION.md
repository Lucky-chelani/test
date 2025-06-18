# Razorpay Payment Integration for Trovia Treks

## Overview

This implementation integrates Razorpay payment gateway with the Trovia Treks application. The system uses Firebase as the backend and handles the complete payment flow from creating orders to processing and verifying payments.

## Implementation Details

### Directory Structure

```
src/
  services/
    payment/
      index.js          - Main payment service
      razorpay.js       - Razorpay-specific implementation
      verification.js   - Server-side verification helpers
      README.md         - Documentation
  utils/
    bookingService.js   - Booking management service
  components/
    BookingModal.js     - Modal for booking treks with payment
    PaymentTester.jsx   - Test component for Razorpay integration
functions/
  index.js              - Firebase Cloud Functions for server-side operations
  package.json          - Functions dependencies
```

### Key Features

1. **Client-Side Integration**
   - Dynamic loading of Razorpay SDK
   - Order creation and management
   - Payment processing
   - UI components for payment flow

2. **Server-Side Integration (Firebase)**
   - Secure payment verification
   - Order handling
   - Booking status updates

3. **Security Measures**
   - API keys stored in environment variables
   - Payment signatures verified on server-side
   - Secure data storage in Firestore

## How It Works

1. User selects a trek and clicks "Book Now"
2. BookingModal collects user and booking details
3. When user proceeds to payment:
   - A booking record is created in Firestore
   - Razorpay checkout is initialized
   - User completes payment in Razorpay UI
4. After payment:
   - Payment details are verified
   - Booking status is updated
   - User receives confirmation

## Testing

The integration includes a PaymentTester component accessible at `/payment-test` that allows testing the Razorpay integration without going through the entire booking flow.

## Deployment Steps

1. Deploy Firebase functions:
   ```
   cd functions
   npm install
   firebase deploy --only functions
   ```

2. Set up Razorpay API keys in Firebase:
   ```
   firebase functions:config:set razorpay.key_id="YOUR_KEY_ID" razorpay.key_secret="YOUR_SECRET_KEY"
   ```

3. Build and deploy the React app:
   ```
   npm run build
   firebase deploy --only hosting
   ```

## Documentation

For more details on the Razorpay integration, please refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
