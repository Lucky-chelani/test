# Razorpay Payment Integration

This folder contains the implementation of Razorpay payment gateway integration for Trovia Treks application.

## Setup

1. Make sure you have Razorpay API keys in your `.env` file:
   ```
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   REACT_APP_RAZORPAY_SECRET=YOUR_SECRET_KEY
   ```

2. For Firebase Cloud Functions:
   - Set up Firebase CLI if you haven't already:
     ```
     npm install -g firebase-tools
     ```
   
   - Login to Firebase:
     ```
     firebase login
     ```
   
   - Set environment variables for Firebase Functions:
     ```
     firebase functions:config:set razorpay.key_id="YOUR_RAZORPAY_KEY_ID" razorpay.key_secret="YOUR_RAZORPAY_KEY_SECRET"
     ```

   - Deploy the functions:
     ```
     firebase deploy --only functions
     ```

## Usage

The payment service provides the following functionality:

1. **Loading Razorpay SDK**: Dynamically loads the Razorpay JavaScript SDK
2. **Creating Orders**: Creates payment records in Firebase and initializes Razorpay orders
3. **Processing Payments**: Handles the payment flow with Razorpay
4. **Verifying Payments**: Verifies payment signatures and updates booking statuses

## Files

- `index.js` - Main payment service with high-level payment functions
- `razorpay.js` - Specific implementation for Razorpay integration
- `verification.js` - Server-side signature verification (to be used in Firebase Functions)

## Integration

The payment service is integrated with the booking flow in the `BookingModal` component.

## Security Notes

- Never expose your Razorpay secret key on the client side
- Always verify payment signatures on the server side
- Use Firebase Cloud Functions for secure server-side operations
