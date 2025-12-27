import React from 'react';
import './style/AccessibilityPage.css'; // Ensure you create this file

const AccessibilityPage = () => (
  <div className="a11y-container">
    <div className="a11y-wrapper">
      <h1 className="a11y-title">
        <span role="img" aria-label="accessibility icon">♿</span> Accessibility Statement for Trovia
      </h1>
      
      <div className="a11y-meta">
        Effective Date: June 14, 2025
      </div>
      
      <p className="a11y-text">
        At Trovia, we are committed to making our website and mobile platform accessible and inclusive for everyone, including users with disabilities.
      </p>

      <section className="a11y-section">
        <h2>Our Commitment</h2>
        <ul className="a11y-list">
          <li><strong>Perceivable</strong> – Easy to see, hear, or read</li>
          <li><strong>Operable</strong> – Functional by keyboard, voice, or assistive devices</li>
          <li><strong>Understandable</strong> – Simple language and predictable navigation</li>
          <li><strong>Robust</strong> – Compatible with screen readers and modern browsers</li>
        </ul>
      </section>

      <section className="a11y-section">
        <h2>Accessibility Features</h2>
        <ul className="a11y-list">
          <li>Alt text for images and meaningful visuals</li>
          <li>Keyboard-friendly navigation</li>
          <li>Sufficient contrast for readability</li>
          <li>Clear and consistent layout structure</li>
          <li>Compatibility with screen readers (like NVDA, VoiceOver)</li>
          <li>Resizable text and zoom support</li>
        </ul>
      </section>

      <section className="a11y-section">
        <h2>Ongoing Improvements</h2>
        <p className="a11y-text">
          Accessibility is a continuous process. We are constantly reviewing feedback and updating our design, code, and content to enhance usability for all users, including those with:
        </p>
        <ul className="a11y-list">
          <li>Visual impairments</li>
          <li>Hearing challenges</li>
          <li>Motor limitations</li>
          <li>Cognitive disabilities</li>
        </ul>
      </section>

      <section className="a11y-section">
        <h2>Known Limitations</h2>
        <p className="a11y-text">
          Some dynamic or third-party elements (such as embedded maps, videos, or Razorpay interfaces) may not be fully accessible yet. We are working to improve this experience and welcome feedback.
        </p>
      </section>

      <section className="a11y-section">
        <h2>Feedback & Support</h2>
        <p className="a11y-text">
          If you experience any difficulty accessing content or features on Trovia, please let us know. We take your feedback seriously.
        </p>
        <ul className="a11y-list contact-list">
          <li>Email: <a href="mailto:support@trovia.in" className="a11y-link">support@trovia.in</a></li>
          <li>WhatsApp: <span className="a11y-highlight">+91-8989986204</span></li>
        </ul>
      </section>

      <section className="a11y-section">
        <h2>Updates</h2>
        <p className="a11y-text">
          This statement will be reviewed and updated regularly to reflect improvements and changes.
        </p>
      </section>
    </div>
  </div>
);

export default AccessibilityPage;