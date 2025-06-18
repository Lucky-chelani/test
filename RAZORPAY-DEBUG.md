# Razorpay Integration Debugging Guide

This guide will help you troubleshoot common issues with the Razorpay payment integration.

## Common Error Messages and Solutions

### 1. `data:;base64,= Failed to load resource: net::ERR_INVALID_URL`

**Possible Causes:**
- Malformed URL or broken script loading
- An issue with how the Razorpay script is being dynamically added to the DOM
- Conflict with browser extensions or security settings

**Solutions:**
1. Use the RazorpayDebugger component to test script loading manually
2. Clear your browser cache and cookies
3. Try in incognito/private mode to eliminate extension conflicts
4. Add a small delay before initializing Razorpay after script load

### 2. `api.razorpay.com/v2/standard_checkout/preferences?key_id=...Failed to load resource: 400 Bad Request`

**Possible Causes:**
- Invalid or misconfigured Razorpay API key
- The key doesn't have permissions for the operations you're trying to perform
- Required parameters are missing from the request

**Solutions:**
1. Verify your API key in the `.env` file matches exactly with the one in your Razorpay dashboard
2. Check if you're using test or live keys consistently
3. Ensure the key has the necessary permissions in your Razorpay dashboard
4. Check if your script is attempting to use advanced features not available with your current plan

### 3. Canvas2D Warning

The warning about `willReadFrequently` is just a performance suggestion from the browser and doesn't affect functionality. It's coming from Razorpay's script and can be safely ignored.

## Using the RazorpayDebugger

The application includes a dedicated Razorpay debugging tool at `/razorpay-debugger`. This tool provides:

1. Environment variable checking (API key presence)
2. Script loading status and troubleshooting
3. Network connectivity tests to Razorpay domains
4. Basic integration testing
5. Detailed error reporting

To use:
1. Navigate to `/razorpay-debugger` in your application
2. Use the "Load with SDK" button to properly load the Razorpay script
3. If that fails, try the "Manual Script Load" option
4. Use "Test Connectivity" to check network access to Razorpay domains
5. If everything looks good, test the basic integration

## Network-Related Issues

If you're experiencing network-related issues:

1. Check your internet connection
2. Verify that your firewall or security software isn't blocking access to `*.razorpay.com` domains
3. If you're on a corporate network, check if proxy settings are affecting the connection
4. Test the application on different networks (e.g., mobile data vs. WiFi)
5. If you're using adblockers or privacy extensions, try disabling them temporarily

## Environment Variables

Ensure your `.env` file contains the correct Razorpay test key:

```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY_ID
```

The key should be visible in the Razorpay dashboard. Remember:
- Test keys start with `rzp_test_`
- Live keys start with `rzp_live_`
- Never expose your secret key in client-side code

## Debugging Order-Related Issues

If you're getting errors related to order IDs:

1. Verify the order exists in your Razorpay dashboard
2. Check that you're including the order ID in your payment options
3. Ensure the amount in the client matches the order amount exactly (in paise)
4. Make sure the order hasn't already been paid or expired

## Next Steps if Issues Persist

If you've tried all the above solutions and still encounter issues:

1. Check the Razorpay status page for any ongoing service disruptions
2. Review the Razorpay documentation for any recent changes or requirements
3. Contact Razorpay support with detailed error logs and screenshots
4. Consider implementing server-side order creation if you're currently creating orders client-side
