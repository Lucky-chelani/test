import React from 'react';

const CookiesPolicyPage = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', background: '#181818', color: '#fff', borderRadius: 12 }}>
    <h1 style={{ textAlign: 'center', marginBottom: 32 }}>🍪 Cookies Policy for Trovia</h1>
    <div style={{ color: '#FFD2BF', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>
      Effective Date: June 14, 2025
    </div>
    <p>This Cookies Policy explains how Trovia (“we”, “us”, “our”) uses cookies and similar tracking technologies when you visit or interact with our website, app, or any of our services (“Platform”).</p>
    <ol style={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
      <li><b>What Are Cookies?</b><br />
        Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website or use an app. They help recognize your device, remember your preferences, and enhance your experience.
      </li>
      <li><b>Types of Cookies We Use</b><br />
        <b>A. Essential Cookies</b><br />These are necessary for the platform to function, such as login authentication, page navigation, and session management.<br />
        <b>B. Performance & Analytics Cookies</b><br />Used to collect anonymous usage data to help us understand how users interact with the platform (e.g., Google Analytics).<br />
        <b>C. Functionality Cookies</b><br />These remember user preferences (like location, language, or login state) to improve usability.<br />
        <b>D. Marketing Cookies</b><br />Used to show personalized ads and retargeting via platforms like Facebook Ads and Google Ads.
      </li>
      <li><b>How We Use Cookies</b><br />
        • Keep you logged in across sessions<br />
        • Save your language and location preferences<br />
        • Understand how users navigate the platform<br />
        • Improve features, speed, and performance<br />
        • Deliver relevant ads across third-party sites
      </li>
      <li><b>Third-Party Cookies</b><br />
        Some cookies may be set by third-party services like:<br />
        • Google Analytics – to track visitor data anonymously<br />
        • Meta Pixel (Facebook) – for ad performance and retargeting<br />
        • Payment gateways like Razorpay – for secure transaction sessions<br />
        We do not control third-party cookies. Please refer to their respective policies.
      </li>
      <li><b>Your Cookie Choices</b><br />
        You can:<br />
        • Accept/decline non-essential cookies via our cookie banner<br />
        • Delete or block cookies through your browser/app settings<br />
        • Opt-out of personalized ads via Ad Settings on Google or Facebook<br />
        <span style={{ color: '#FFD2BF' }}>Note: Disabling some cookies may affect your experience on Trovia.</span>
      </li>
      <li><b>Updates to This Policy</b><br />
        We may revise this Cookies Policy from time to time. Updates will be posted here with the revised effective date.
      </li>
      <li><b>Contact</b><br />
        If you have questions about this Cookies Policy, please reach out:<br />
        📧 support@trovia.in
      </li>
    </ol>
  </div>
);

export default CookiesPolicyPage;
