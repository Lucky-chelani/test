import React from 'react';

const AccessibilityPage = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', background: '#181818', color: '#fff', borderRadius: 12 }}>
    <h1 style={{ textAlign: 'center', marginBottom: 32 }}>♿ Accessibility Statement for Trovia</h1>
    <div style={{ color: '#FFD2BF', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>
      Effective Date: June 14, 2025
    </div>
    <p>At Trovia, we are committed to making our website and mobile platform accessible and inclusive for everyone, including users with disabilities.</p>
    <h2>Our Commitment</h2>
    <ul>
      <li>Perceivable – Easy to see, hear, or read</li>
      <li>Operable – Functional by keyboard, voice, or assistive devices</li>
      <li>Understandable – Simple language and predictable navigation</li>
      <li>Robust – Compatible with screen readers and modern browsers</li>
    </ul>
    <h2>Accessibility Features</h2>
    <ul>
      <li>Alt text for images and meaningful visuals</li>
      <li>Keyboard-friendly navigation</li>
      <li>Sufficient contrast for readability</li>
      <li>Clear and consistent layout structure</li>
      <li>Compatibility with screen readers (like NVDA, VoiceOver)</li>
      <li>Resizable text and zoom support</li>
    </ul>
    <h2>Ongoing Improvements</h2>
    <p>Accessibility is a continuous process. We are constantly reviewing feedback and updating our design, code, and content to enhance usability for all users, including those with:</p>
    <ul>
      <li>Visual impairments</li>
      <li>Hearing challenges</li>
      <li>Motor limitations</li>
      <li>Cognitive disabilities</li>
    </ul>
    <h2>Known Limitations</h2>
    <p>Some dynamic or third-party elements (such as embedded maps, videos, or Razorpay interfaces) may not be fully accessible yet. We are working to improve this experience and welcome feedback.</p>
    <h2>Feedback & Support</h2>
    <p>If you experience any difficulty accessing content or features on Trovia, please let us know. We take your feedback seriously.</p>
    <ul>
      <li>Email: <a href="mailto:support@trovia.in" style={{ color: '#FFD2BF' }}>support@trovia.in</a></li>
      <li>WhatsApp: <span style={{ color: '#FFD2BF' }}>+91-8989986204</span></li>
    </ul>
    <h2>Updates</h2>
    <p>This statement will be reviewed and updated regularly to reflect improvements and changes.</p>
  </div>
);

export default AccessibilityPage;
