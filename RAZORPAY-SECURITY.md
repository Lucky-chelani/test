# Razorpay Security and Environment Variables

## ⚠️ Important Security Considerations

### Secret Key Handling

1. **Never expose your secret key in client-side code**
   - The key in `.env` marked as `REACT_APP_RAZORPAY_SECRET` should NEVER be accessed from browser code
   - React environment variables starting with `REACT_APP_` are embedded in your JavaScript bundle and are readable by anyone

2. **Correct Environment Variable Usage**
   - For client-side React: Only use `REACT_APP_RAZORPAY_KEY_ID` (public key)
   - For server-side only: Use `RAZORPAY_SECRET` (not prefixed with REACT_APP_)

### Proper Signature Verification

Razorpay payment signature verification must happen server-side:

1. **Firebase Cloud Functions (recommended)**
   ```javascript
   // In Cloud Function
   exports.verifyPayment = functions.https.onCall((data, context) => {
     const { orderId, paymentId, signature } = data;
     const secret = process.env.RAZORPAY_SECRET; // Set in Firebase environment
     
     const expectedSignature = crypto
       .createHmac('sha256', secret)
       .update(`${orderId}|${paymentId}`)
       .digest('hex');
     
     return { isValid: expectedSignature === signature };
   });
   
   // In React code (client)
   const verifyPayment = async (paymentDetails) => {
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
     const verifyFunc = firebase.functions().httpsCallable('verifyPayment');
     
     const result = await verifyFunc({
       orderId: razorpay_order_id,
       paymentId: razorpay_payment_id,
       signature: razorpay_signature
     });
     
     return result.data.isValid;
   };
   ```

2. **Custom Backend API**
   - Create an API endpoint that performs verification
   - Call this endpoint from your React app
   - Store secret key only in server environment variables

## Environment Files

### Development (.env.development)
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
```

### Production (.env.production)
```
REACT_APP_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
```

### Server Environment (Firebase Functions config)
```bash
firebase functions:config:set razorpay.key_id="your_key_id" razorpay.key_secret="your_secret_key"
```

## Security Checklist

- [ ] Secret key is only stored server-side
- [ ] Payment verification happens only server-side
- [ ] Only public key (KEY_ID) is used in browser code
- [ ] No signature generation happens in browser code
- [ ] Firebase security rules protect payment data
