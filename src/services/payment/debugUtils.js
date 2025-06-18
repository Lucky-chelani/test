// Debug utility for Razorpay integration

/**
 * Logs Razorpay integration details to console
 * @returns {Object} - Debug information
 */
export const debugRazorpayIntegration = () => {
  console.group('🔍 Razorpay Integration Debug Info');
  
  // Check if Razorpay script is loaded
  const isRazorpayLoaded = typeof window.Razorpay !== 'undefined';
  console.log('✅ Razorpay Script Loaded:', isRazorpayLoaded);
  
  // Check environment variables
  const hasKeyId = !!process.env.REACT_APP_RAZORPAY_KEY_ID;
  console.log('✅ Razorpay Key ID Present:', hasKeyId);
  
  // Log key ID for debug (first 4 chars only)
  if (hasKeyId) {
    const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
    const keyPrefix = keyId.substring(0, 4);
    const isTestKey = keyId.startsWith('rzp_test_');
    console.log(`✅ Key Type: ${isTestKey ? 'Test' : 'Live'} (starts with ${keyPrefix}...)`);
  }
  
  // Check DOM for script tag
  const scriptElement = document.getElementById('razorpay-checkout-js');
  console.log('✅ Script Element in DOM:', !!scriptElement);
  
  // Check network state
  console.log('✅ Browser Online:', navigator.onLine);
  
  // Check if we have any pending Razorpay resources
  const pendingResources = performance.getEntriesByType('resource')
    .filter(resource => resource.name.includes('razorpay.com'))
    .filter(resource => !resource.responseEnd);
  console.log('✅ Pending Razorpay Resources:', pendingResources.length ? pendingResources : 'None');
  
  // Analyze loaded resources
  const razorpayResources = performance.getEntriesByType('resource')
    .filter(resource => resource.name.includes('razorpay.com'));
  
  if (razorpayResources.length > 0) {
    const failed = razorpayResources.filter(r => r.responseStatus >= 400 || r.duration > 5000);
    if (failed.length > 0) {
      console.warn('⚠️ Problematic Razorpay Resources:', failed);
    } else {
      console.log('✅ Razorpay Resources OK:', razorpayResources.length);
    }
  } else {
    console.log('✅ No Razorpay Resources Loaded Yet');
  }
  
  // Log browser info
  console.log('✅ Browser:', navigator.userAgent);
  
  console.groupEnd();
  
  return {
    isRazorpayLoaded,
    hasKeyId,
    hasScriptElement: !!scriptElement,
    userAgent: navigator.userAgent,
    isOnline: navigator.onLine,
    keyType: hasKeyId ? (process.env.REACT_APP_RAZORPAY_KEY_ID.startsWith('rzp_test_') ? 'test' : 'live') : 'unknown',
    pendingRequests: pendingResources.length
  };
};

/**
 * Validates object for Firestore compatibility
 * @param {Object} data - Data object to validate
 * @returns {Object} - Object with validation results
 */
export const validateFirestoreData = (data) => {
  console.group('🔍 Firestore Data Validation');
  
  const issues = [];
  const fixedData = {};
  
  // Check for undefined values
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value === undefined) {
      issues.push(`Field '${key}' has undefined value`);
      // Don't include undefined values in fixed data
    } else if (value === null) {
      issues.push(`Field '${key}' has null value`);
      fixedData[key] = null; // null is acceptable in Firestore
    } else if (value instanceof Date) {
      fixedData[key] = value; // Date objects are fine
    } else if (typeof value === 'object' && value !== null) {
      // Recursively check nested objects
      const nestedCheck = validateFirestoreData(value);
      if (nestedCheck.issues.length > 0) {
        issues.push(`Nested object '${key}' has issues: ${nestedCheck.issues.join(', ')}`);
        fixedData[key] = nestedCheck.fixedData;
      } else {
        fixedData[key] = value;
      }
    } else {
      // Basic value types are fine
      fixedData[key] = value;
    }
  });
  
  console.log('❓ Issues Found:', issues.length > 0 ? issues : 'None');
  console.log('✅ Fixed Data:', fixedData);
  console.groupEnd();
  
  return {
    isValid: issues.length === 0,
    issues,
    fixedData
  };
};

/**
 * Diagnose network issues with Razorpay domains
 * @returns {Promise<Object>} Network test results
 */
export const diagnosePingRazorpay = async () => {
  console.group('🔍 Razorpay Network Diagnostics');
  
  const results = {
    cdn: { status: 'unknown' },
    api: { status: 'unknown' },
    checkout: { status: 'unknown' }
  };
  
  try {
    // Test CDN
    console.log('Testing CDN connection...');
    const cdnStart = performance.now();
    try {
      await fetch('https://cdn.razorpay.com/static/widget/health.html', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const cdnTime = performance.now() - cdnStart;
      results.cdn = { status: 'ok', time: Math.round(cdnTime) };
      console.log(`✅ CDN OK (${Math.round(cdnTime)}ms)`);
    } catch (error) {
      results.cdn = { status: 'error', error: error.message };
      console.error('❌ CDN Error:', error);
    }
    
    // Test API
    console.log('Testing API connection...');
    const apiStart = performance.now();
    try {
      await fetch('https://api.razorpay.com/v1/public', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const apiTime = performance.now() - apiStart;
      results.api = { status: 'ok', time: Math.round(apiTime) };
      console.log(`✅ API OK (${Math.round(apiTime)}ms)`);
    } catch (error) {
      results.api = { status: 'error', error: error.message };
      console.error('❌ API Error:', error);
    }
    
    // Test Checkout
    console.log('Testing Checkout connection...');
    const checkoutStart = performance.now();
    try {
      await fetch('https://checkout.razorpay.com/v1/checkout.js', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const checkoutTime = performance.now() - checkoutStart;
      results.checkout = { status: 'ok', time: Math.round(checkoutTime) };
      console.log(`✅ Checkout OK (${Math.round(checkoutTime)}ms)`);
    } catch (error) {
      results.checkout = { status: 'error', error: error.message };
      console.error('❌ Checkout Error:', error);
    }
  } catch (error) {
    console.error('❌ Network diagnostic error:', error);
    results.error = error.message;
  }
  
  console.log('Network Diagnostic Results:', results);
  console.groupEnd();
  
  return results;
};

export default {
  debugRazorpayIntegration,
  validateFirestoreData,
  diagnosePingRazorpay
};
