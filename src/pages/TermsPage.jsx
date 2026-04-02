import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFileSignature, FaInfoCircle } from 'react-icons/fa';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  background-color: #050505;
  min-height: 100vh;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
`;

const ContentCard = styled.main`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  max-width: 850px;
  width: 100%;
  padding: 50px;
  animation: ${fadeIn} 0.6s ease-out;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 30px 20px;
    border-radius: 16px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  /* Trovia Green Gradient */
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  svg {
    color: #42A04B;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MetaBadge = styled.div`
  display: inline-block;
  background: rgba(66, 160, 75, 0.15);
  color: #5FBB66;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

// TL;DR Summary Box
const SummaryBox = styled.div`
  background: rgba(66, 160, 75, 0.05);
  border: 1px solid rgba(66, 160, 75, 0.2);
  border-left: 4px solid #42A04B;
  padding: 24px;
  border-radius: 0 12px 12px 0;
  margin-bottom: 40px;

  h2 {
    color: #5FBB66;
    font-size: 1.2rem;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    color: #cccccc;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

// Numbered List for Legal Terms
const TermsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: terms-counter;
`;

const TermCard = styled.li`
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px 24px 24px 60px;
  margin-bottom: 20px;
  counter-increment: terms-counter;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &::before {
    content: counter(terms-counter);
    position: absolute;
    left: 20px;
    top: 24px;
    font-size: 1.2rem;
    font-weight: 800;
    color: #42A04B;
    background: rgba(66, 160, 75, 0.1);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 20px 20px 20px 50px;
    &::before {
      left: 12px;
      top: 20px;
    }
  }
`;

const TermHeading = styled.h3`
  font-size: 1.2rem;
  color: #ffffff;
  margin: 0 0 12px 0;
  font-weight: 600;
`;

const TermContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #a0a0a0;

  p {
    margin: 0 0 8px 0;
    &:last-child { margin-bottom: 0; }
  }

  ul {
    margin: 8px 0 0 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 6px;
      position: relative;
      &::marker { color: #5FBB66; }
    }
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #808080;
  font-size: 0.95rem;
`;

// --- Component ---
const TermsPage = () => {
  return (
    <PageWrapper>
      <ContentCard>
        <Header>
          <Title>
            <FaFileSignature aria-hidden="true" /> Terms & Conditions
          </Title>
          <MetaBadge>Effective Date: June 14, 2025</MetaBadge>
        </Header>

        <SummaryBox>
          <h2><FaInfoCircle /> The Short Version (TL;DR)</h2>
          <p>
            Welcome to Trovia! In short: you must be 18+ to use the platform. You own the content you post, but you give us permission to display it. <strong>We are a discovery platform</strong>—bookings are agreements between you and the Trek Organizers. Be respectful, don't break the law, and enjoy the adventure. The detailed legal terms are below.
          </p>
        </SummaryBox>
        
        <TermsList>
          <TermCard>
            <TermHeading>Acceptance of Terms</TermHeading>
            <TermContent>
              <p>By accessing or using Trovia (“the Platform”), you accept and agree to be bound by these terms. If you do not agree to these terms, you must not use the Platform.</p>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Who Can Use Trovia</TermHeading>
            <TermContent>
              <ul>
                <li>You must be at least 18 years old to use Trovia.</li>
                <li>You must register with accurate, current, and complete information.</li>
                <li>You are responsible for keeping your account information updated at all times.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Account Security</TermHeading>
            <TermContent>
              <ul>
                <li>You are solely responsible for maintaining the confidentiality of your account and password.</li>
                <li>You must notify Trovia immediately if you suspect your account has been compromised.</li>
                <li>Trovia is not liable for losses due to unauthorized account use when reported later than 24 hours after the breach.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Content You Post</TermHeading>
            <TermContent>
              <ul>
                <li>You retain ownership of the content you create (photos, videos, text). However, you grant Trovia a non-exclusive, perpetual, royalty-free license to use, display, modify, or distribute it on our platform and marketing channels.</li>
                <li>You must not post unlawful, infringing, defamatory, obscene, or harmful content.</li>
                <li>Trovia reserves the right to remove any content at its sole discretion without prior notice.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Trek Listings & Bookings</TermHeading>
            <TermContent>
              <ul>
                <li>Trek organizers list treks on their own responsibility—they control the itinerary, pricing, safety protocols, and availability.</li>
                <li><strong>Trovia is solely a platform facilitating discovery and booking;</strong> we are not a party to the actual agreement between the trek organizer and the user.</li>
                <li>All bookings, liabilities, and fulfillment obligations are between the trek organizer and the user.</li>
                <li>Refunds or cancellations are governed exclusively by the specific trek organizer’s policy unless otherwise stated.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Payments</TermHeading>
            <TermContent>
              <ul>
                <li>Payments are securely processed by trusted third-party payment gateways (e.g., Razorpay).</li>
                <li>Trovia acts only to forward collected funds to the organizer, minus applicable platform fees or commissions.</li>
                <li>Refunds are handled as per the organizer’s policy and may take 7–15 business days to process depending on your bank.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Fees & Commissions</TermHeading>
            <TermContent>
              <ul>
                <li>Trovia charges a transparent commission per booking (e.g., 10%) for facilitating the platform services.</li>
                <li>Any creator/partner rewards or dues are issued according to the specific Creator Agreement—directly from the organizer or Trovia, with no hidden fees.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Trovia Creator Community</TermHeading>
            <TermContent>
              <ul>
                <li>Creator members must follow our separate Creator Guidelines, abiding by brand, ethics, and community standards.</li>
                <li>Trovia reserves the right to remove or suspend creator status for misconduct, misrepresentation, or misuse without refund or prior notice.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Limitation of Liability</TermHeading>
            <TermContent>
              <ul>
                <li>Trovia is not liable for any trek-related accidents, injuries, property damage, or losses arising out of the use of third-party organizer services.</li>
                <li>In any event, Trovia’s total liability to you is strictly limited to the amount paid by you through the platform for the specific service in dispute.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>User Conduct</TermHeading>
            <TermContent>
              <p>While using Trovia, you strictly must not:</p>
              <ul>
                <li>Violate any local, state, or national laws, or infringe on anyone’s intellectual property rights.</li>
                <li>Use the service for any fraudulent, harmful, or unauthorized commercial activity.</li>
                <li>Upload viruses, malware, or any malicious code.</li>
                <li>Harass, abuse, or spam other users or organizers.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Suspension & Termination</TermHeading>
            <TermContent>
              <ul>
                <li>Trovia reserves the right to suspend or terminate any account at its discretion, for any reason, without prior notice and without liability.</li>
                <li>Upon termination, your access is revoked immediately. Creator and organizer provisions may survive termination as per their specific agreements.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Dispute Resolution</TermHeading>
            <TermContent>
              <ul>
                <li>In the event of disputes between Trovia and a user, both parties agree to attempt resolution through good-faith negotiation first.</li>
                <li>Should disputes remain unresolved within 30 days, claims will be subject to binding arbitration in Bhopal, Madhya Pradesh, following the Indian Arbitration & Conciliation Act.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Privacy & Cookies</TermHeading>
            <TermContent>
              <ul>
                <li>Trovia collects, stores, and processes personal information as outlined in our Privacy Policy and Cookies Policy.</li>
                <li>Your continued use of the Platform signifies your explicit consent to our data practices.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Modifications to Terms</TermHeading>
            <TermContent>
              <ul>
                <li>Trovia reserves the right to modify these Terms at any time. Changes become effective immediately upon being posted on this page.</li>
                <li>Your continued use of the Platform after revisions signifies your acceptance of the new terms.</li>
              </ul>
            </TermContent>
          </TermCard>

          <TermCard>
            <TermHeading>Governing Law</TermHeading>
            <TermContent>
              <p>These terms are governed by and construed in accordance with the laws of India. Any legal action or proceeding must be filed exclusively in the competent courts located in Bhopal, Madhya Pradesh.</p>
            </TermContent>
          </TermCard>
        </TermsList>

        <Footer>
          <p>Thank you for being part of the Trovia community.</p>
        </Footer>
      </ContentCard>
    </PageWrapper>
  );
};

export default TermsPage;