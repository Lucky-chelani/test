import React from 'react';

const PrivacyPolicyPage = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', background: '#181818', color: '#fff', borderRadius: 12 }}>
    <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Privacy Policy for Trovia</h1>
    <div style={{ color: '#FFD2BF', fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>
      Effective Date: June 14, 2025<br />Last Updated: June 14, 2025
    </div>
    <p>This Privacy Policy explains how Trovia (“we”, “our”, “us”) collects, uses, shares, and protects your personal information when you use our website, mobile app, or any related services (collectively, the “Platform”).</p>
    <ol style={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
      <li><b>Information We Collect</b><br />
        <b>A. Information you provide directly:</b><br />
        • Name, email, mobile number<br />
        • Age, gender, city<br />
        • Profile photos or other media<br />
        • Payment information (via secure gateway only)<br />
        • User-generated content (reviews, messages, stories)<br />
        <b>B. Information collected automatically:</b><br />
        • IP address, browser type<br />
        • Device identifiers<br />
        • Location (if permission is granted)<br />
        • Cookies, pixels, and usage logs
      </li>
      <li><b>Why We Collect Your Data</b><br />
        • Register and manage your Trovia account<br />
        • Facilitate trek bookings with verified organizers<br />
        • Provide personalized recommendations<br />
        • Enable community features like stories, chatrooms, badges<br />
        • Communicate updates, offers, and service-related alerts<br />
        • Ensure platform security, fraud detection, and abuse prevention<br />
        • Comply with legal obligations
      </li>
      <li><b>Sharing of Information</b><br />
        We do not sell your personal data.<br />
        We may share your data with:<br />
        • Trek organizers, only when you book their trek<br />
        • Payment processors (e.g., Razorpay) for secure transactions<br />
        • Legal authorities, when required by law<br />
        • Service providers like analytics or cloud hosting (under confidentiality agreements)
      </li>
      <li><b>Your Control & Choices</b><br />
        You can:<br />
        • Edit or delete your account info anytime<br />
        • Opt out of marketing emails/SMS<br />
        • Request deletion of your account and data by emailing support@trovia.in<br />
        • Manage cookie permissions in your browser/app settings
      </li>
      <li><b>Data Storage & Security</b><br />
        • We store data on secure Indian or internationally-compliant servers<br />
        • We use SSL encryption, firewalls, and limited access controls<br />
        • While we do our best, no method of transmission is 100% secure
      </li>
      <li><b>Retention of Data</b><br />
        We retain personal data only as long as:<br />
        • Your account remains active<br />
        • It’s needed to provide services<br />
        • Required by legal or regulatory obligations<br />
        Deleted accounts will have data erased within 30 business days, unless required by law.
      </li>
      <li><b>Children’s Privacy</b><br />
        Our platform is not intended for users under 13 years old. We do not knowingly collect data from children.
      </li>
      <li><b>Changes to Policy</b><br />
        We may update this policy at any time. Users will be notified via email or in-app alert. Continued use of the platform implies acceptance of updated policies.
      </li>
      <li><b>Contact Us</b><br />
        For privacy-related concerns, contact:<br />
        📧 support@trovia.in<br />
        🏢 Trovia, Bhopal, Madhya Pradesh, India
      </li>
    </ol>
  </div>
);

export default PrivacyPolicyPage;
