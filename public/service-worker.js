/**
 * Minimal Service Worker for Trovia Treks
 * 
 * This service worker is intentionally minimal to avoid conflicts with Razorpay
 * and other third-party services. It provides basic offline functionality without
 * interfering with payment processing.
 */

// Skip waiting to become active
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Claim clients when activated
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Minimal fetch handler that only caches specific static resources
self.addEventListener('fetch', event => {
  // Only handle GET requests for static assets
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Don't handle any third-party requests, especially Razorpay
  if (url.origin !== self.location.origin || 
      url.pathname.includes('razorpay') || 
      url.pathname.includes('payment')) {
    return;
  }
  
  // Only cache static assets (images, CSS, JS, fonts)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.open('trovia-static-v1').then(cache => {
        return fetch(event.request)
          .then(response => {
            // Cache the successful response
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            // Return from cache if network fails
            return caches.match(event.request);
          });
      })
    );
  }
});

// Handle messages from the client
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
