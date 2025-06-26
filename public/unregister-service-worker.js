/**
 * This file unregisters any service workers to prevent conflicts with Razorpay
 */

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations()
    .then(registrations => {
      for (let registration of registrations) {
        registration.unregister();
        console.log('Service worker unregistered');
      }
    });
}
