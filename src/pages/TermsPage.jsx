import React from 'react';
import './style/TermsPage.css';

const TermsPage = () => (
  <main className="terms-container">
    <article className="terms-card">
      <h1 className="terms-title">Trovia Terms & Conditions</h1>
      
      <ol className="terms-list">
        <li className="terms-item">
          <strong className="terms-heading">Acceptance</strong>
          <span className="terms-content">
            By accessing or using Trovia (“the Platform”), you accept and agree to be bound by these terms. If you don’t agree, you must not use the Platform.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Who Can Use</strong>
          <span className="terms-content">
            • You must be at least 18 years old to use Trovia.<br />
            • You must register with accurate, current, and complete information.<br />
            • You’re responsible for keeping your account information updated.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Account Security</strong>
          <span className="terms-content">
            • You are solely responsible for your account and password’s confidentiality and activity.<br />
            • You must notify Trovia immediately if your account is compromised.<br />
            • Trovia is not liable for losses due to unauthorized account use when reported later than 24 hours.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Content You Post</strong>
          <span className="terms-content">
            • You retain ownership of content you create (photos, video, text), but grant Trovia a non-exclusive, perpetual, royalty-free license to use, display, modify, or distribute it.<br />
            • You must not post unlawful, infringing, defamatory, obscene, or harmful content.<br />
            • Trovia reserves the right to remove any content at its sole discretion.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Trek Listings & Bookings</strong>
          <span className="terms-content">
            • Trek organizers list treks on their own responsibility—they control itinerary, pricing, and availability.<br />
            • Trovia is a platform facilitating discovery and booking; it is not a party to the trek organizer-user agreement.<br />
            • All bookings are between the trek organizer and the user.<br />
            • Refunds or cancellations are governed by the trek organizer’s policy unless otherwise stated.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Payments</strong>
          <span className="terms-content">
            • Payments are processed by trusted payment gateways (e.g., Razorpay).<br />
            • Trovia only forwards collected funds minus platform fees or commission.<br />
            • Refunds are handled as per organizer’s policy and may take 7–15 business days to process.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Fees & Commissions</strong>
          <span className="terms-content">
            • Trovia charges a transparent commission per booking (for example, 10%).<br />
            • Any creator/partner rewards or dues are issued according to the Creator Agreement—directly from the organizer or Trovia, with no hidden fee.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Trovia Creator Community</strong>
          <span className="terms-content">
            • Creator members must follow separate Creator Guidelines, abiding by brand, ethics, and community standards.<br />
            • Trovia reserves the right to remove or suspend creator status for misconduct or misuse without refund or notice.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Liability Limit</strong>
          <span className="terms-content">
            • Trovia is not liable for trek-related accidents, injuries, or damage arising out of use of organizer services.<br />
            • Trovia’s total liability is limited to the amount paid through the platform by the affected user.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">User Conduct</strong>
          <span className="terms-content">
            You must not:<br />
            • Violate any laws or infringe anyone’s rights.<br />
            • Use the service for any fraudulent, harmful, or unauthorized activity.<br />
            • Upload viruses or malicious code.<br />
            • Harass or abuse other users.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Suspension & Termination</strong>
          <span className="terms-content">
            • Trovia reserves the right to suspend or terminate any account at its discretion, for any reason, without prior notice and without liability.<br />
            • Upon termination, your access is revoked. Creator and organizer provisions may survive as per the Creator Agreement.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Dispute Resolution</strong>
          <span className="terms-content">
            • In the event of disputes, both parties will attempt resolution through negotiation first.<br />
            • Shall disputes remain unresolved within 30 days, claims will be subject to binding arbitration in Bhopal, Madhya Pradesh, following Indian Arbitration & Conciliation Act.<br />
            • Courts in Bhopal will have exclusive jurisdiction for all other legal matters.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Privacy & Cookies</strong>
          <span className="terms-content">
            • Trovia collects personal information as per the Privacy Policy.<br />
            • Use of the Platform signifies consent to data collection, use, and storage in accordance with applicable laws and our Privacy Policy.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Modifications</strong>
          <span className="terms-content">
            • Trovia can modify these Terms at any time. Changes are effective immediately when posted.<br />
            • Continued use after revisions signifies acceptance of the new terms.
          </span>
        </li>

        <li className="terms-item">
          <strong className="terms-heading">Governing Law</strong>
          <span className="terms-content">
            These terms are governed by the laws of India. Any legal action must be filed in the courts of Bhopal, MP.
          </span>
        </li>
      </ol>

      <div className="terms-footer">
        🗓 Effective Date: June 14, 2025
      </div>
    </article>
  </main>
);

export default TermsPage;