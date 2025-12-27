import React from 'react';
import './style/PrivacyPolicyPage.css'; // Ensure this file is created

const PrivacyPolicyPage = () => (
  <div className="privacy-container">
    <div className="privacy-wrapper">
      <h1 className="privacy-title">
        <span role="img" aria-label="shield icon">🛡️</span> Privacy Policy for Trovia
      </h1>
      
      <div className="privacy-meta">
        Effective Date: June 14, 2025 <br className="mobile-break" />
        Last Updated: June 14, 2025
      </div>
      
      <p className="privacy-intro">
        This Privacy Policy explains how Trovia (“we”, “our”, “us”) collects, uses, shares, and protects your personal information when you use our website, mobile app, or any related services (collectively, the “Platform”).
      </p>

      <ol className="privacy-list">
        <li>
          <h3 className="privacy-heading">Information We Collect</h3>
          <div className="privacy-sub-section">
            <p><strong>A. Information you provide directly:</strong></p>
            <ul className="privacy-bullet-list">
              <li>Name, email, mobile number</li>
              <li>Age, gender, city</li>
              <li>Profile photos or other media</li>
              <li>Payment information (via secure gateway only)</li>
              <li>User-generated content (reviews, messages, stories)</li>
            </ul>
            <p><strong>B. Information collected automatically:</strong></p>
            <ul className="privacy-bullet-list">
              <li>IP address, browser type</li>
              <li>Device identifiers</li>
              <li>Location (if permission is granted)</li>
              <li>Cookies, pixels, and usage logs</li>
            </ul>
          </div>
        </li>

        <li>
          <h3 className="privacy-heading">Why We Collect Your Data</h3>
          <ul className="privacy-bullet-list">
            <li>Register and manage your Trovia account</li>
            <li>Facilitate trek bookings with verified organizers</li>
            <li>Provide personalized recommendations</li>
            <li>Enable community features like stories, chatrooms, badges</li>
            <li>Communicate updates, offers, and service-related alerts</li>
            <li>Ensure platform security, fraud detection, and abuse prevention</li>
            <li>Comply with legal obligations</li>
          </ul>
        </li>

        <li>
          <h3 className="privacy-heading">Sharing of Information</h3>
          <p>We do not sell your personal data. We may share your data with:</p>
          <ul className="privacy-bullet-list">
            <li>Trek organizers, only when you book their trek</li>
            <li>Payment processors (e.g., Razorpay) for secure transactions</li>
            <li>Legal authorities, when required by law</li>
            <li>Service providers like analytics or cloud hosting (under confidentiality agreements)</li>
          </ul>
        </li>

        <li>
          <h3 className="privacy-heading">Your Control & Choices</h3>
          <p>You can:</p>
          <ul className="privacy-bullet-list">
            <li>Edit or delete your account info anytime</li>
            <li>Opt out of marketing emails/SMS</li>
            <li>Request deletion of your account and data by emailing <a href="mailto:support@trovia.in" className="privacy-link">support@trovia.in</a></li>
            <li>Manage cookie permissions in your browser/app settings</li>
          </ul>
        </li>

        <li>
          <h3 className="privacy-heading">Data Storage & Security</h3>
          <ul className="privacy-bullet-list">
            <li>We store data on secure Indian or internationally-compliant servers</li>
            <li>We use SSL encryption, firewalls, and limited access controls</li>
            <li>While we do our best, no method of transmission is 100% secure</li>
          </ul>
        </li>

        <li>
          <h3 className="privacy-heading">Retention of Data</h3>
          <p>We retain personal data only as long as:</p>
          <ul className="privacy-bullet-list">
            <li>Your account remains active</li>
            <li>It’s needed to provide services</li>
            <li>Required by legal or regulatory obligations</li>
          </ul>
          <p className="privacy-note">Deleted accounts will have data erased within 30 business days, unless required by law.</p>
        </li>

        <li>
          <h3 className="privacy-heading">Children’s Privacy</h3>
          <p>Our platform is not intended for users under 13 years old. We do not knowingly collect data from children.</p>
        </li>

        <li>
          <h3 className="privacy-heading">Changes to Policy</h3>
          <p>We may update this policy at any time. Users will be notified via email or in-app alert. Continued use of the platform implies acceptance of updated policies.</p>
        </li>

        <li>
          <h3 className="privacy-heading">Contact Us</h3>
          <p>For privacy-related concerns, contact:</p>
          <div className="privacy-contact-box">
            <a href="mailto:support@trovia.in" className="privacy-email">📧 support@trovia.in</a>
            <div className="privacy-address">🏢 Trovia, Bhopal, Madhya Pradesh, India</div>
          </div>
        </li>
      </ol>
    </div>
  </div>
);

export default PrivacyPolicyPage;