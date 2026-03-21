import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');

// The Magic SEO Fix:
// If react-snap has already built the HTML, "hydrate" it instead of drawing a blank page.
if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Fallback for normal browser rendering
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Service worker registration is disabled to avoid conflicts with Razorpay
// Will be re-enabled after resolving integration issues
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.log('Optional Service Worker registration failed:', error);
        });
    }, 1000);
  });
}
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();