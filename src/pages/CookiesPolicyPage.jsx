import React from 'react';
import './style/CookiesPolicy.css'; // Make sure to create this file

const CookiesPolicyPage = () => (
  <div className="cookies-container">
    <div className="cookies-wrapper">
      <h1 className="cookies-title">
        <span role="img" aria-label="cookie icon">🍪</span> Cookies Policy for Trovia
      </h1>
      
      <div className="cookies-meta">
        Effective Date: June 14, 2025
      </div>
      
      <p className="cookies-intro">
        This Cookies Policy explains how Trovia (“we”, “us”, “our”) uses cookies and similar tracking technologies when you visit or interact with our website, app, or any of our services (“Platform”).
      </p>

      <ol className="cookies-list">
        <li>
          <h3 className="cookies-heading">What Are Cookies?</h3>
          <p>Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website or use an app. They help recognize your device, remember your preferences, and enhance your experience.</p>
        </li>
        
        <li>
          <h3 className="cookies-heading">Types of Cookies We Use</h3>
          <div className="cookies-sub-section">
            <p><strong>A. Essential Cookies</strong><br />These are necessary for the platform to function, such as login authentication, page navigation, and session management.</p>
            <p><strong>B. Performance & Analytics Cookies</strong><br />Used to collect anonymous usage data to help us understand how users interact with the platform (e.g., Google Analytics).</p>
            <p><strong>C. Functionality Cookies</strong><br />These remember user preferences (like location, language, or login state) to improve usability.</p>
            <p><strong>D. Marketing Cookies</strong><br />Used to show personalized ads and retargeting via platforms like Facebook Ads and Google Ads.</p>
          </div>
        </li>

        <li>
          <h3 className="cookies-heading">How We Use Cookies</h3>
          <ul className="cookies-bullet-list">
            <li>Keep you logged in across sessions</li>
            <li>Save your language and location preferences</li>
            <li>Understand how users navigate the platform</li>
            <li>Improve features, speed, and performance</li>
            <li>Deliver relevant ads across third-party sites</li>
          </ul>
        </li>

        <li>
          <h3 className="cookies-heading">Third-Party Cookies</h3>
          <p>Some cookies may be set by third-party services like:</p>
          <ul className="cookies-bullet-list">
            <li>Google Analytics – to track visitor data anonymously</li>
            <li>Meta Pixel (Facebook) – for ad performance and retargeting</li>
            <li>Payment gateways like Razorpay – for secure transaction sessions</li>
          </ul>
          <p className="cookies-note-text">We do not control third-party cookies. Please refer to their respective policies.</p>
        </li>

        <li>
          <h3 className="cookies-heading">Your Cookie Choices</h3>
          <p>You can:</p>
          <ul className="cookies-bullet-list">
            <li>Accept/decline non-essential cookies via our cookie banner</li>
            <li>Delete or block cookies through your browser/app settings</li>
            <li>Opt-out of personalized ads via Ad Settings on Google or Facebook</li>
          </ul>
          <p className="cookies-warning">Note: Disabling some cookies may affect your experience on Trovia.</p>
        </li>

        <li>
          <h3 className="cookies-heading">Updates to This Policy</h3>
          <p>We may revise this Cookies Policy from time to time. Updates will be posted here with the revised effective date.</p>
        </li>

        <li>
          <h3 className="cookies-heading">Contact</h3>
          <p>If you have questions about this Cookies Policy, please reach out:</p>
          <a href="mailto:support@trovia.in" className="cookies-email">📧 support@trovia.in</a>
        </li>
      </ol>
    </div>
  </div>
);

export default CookiesPolicyPage;