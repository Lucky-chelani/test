import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaShieldAlt, FaInfoCircle, FaEnvelope, FaMapMarkerAlt, FaUserCheck, FaRobot } from 'react-icons/fa';

// --- Keyframe Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulseGlow = keyframes`
  0% { filter: drop-shadow(0 0 5px rgba(66, 160, 75, 0.4)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 15px rgba(66, 160, 75, 0.8)); transform: scale(1.05); }
  100% { filter: drop-shadow(0 0 5px rgba(66, 160, 75, 0.4)); transform: scale(1); }
`;

// --- Styled Components ---
const PageWrapper = styled.div`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  background-color: #050505;
  min-height: 100vh;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;

  @media (max-width: 480px) { padding: 60px 12px; }
`;

const ContentCard = styled.main`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  max-width: 850px;
  width: 100%;
  padding: 50px;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) { padding: 30px 20px; border-radius: 16px; }
  @media (max-width: 480px) { padding: 24px 16px; }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 30px;
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out 0.1s forwards;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  svg { 
    color: #42A04B; 
    animation: ${pulseGlow} 3s infinite ease-in-out;
  }

  @media (max-width: 768px) { font-size: 1.8rem; }
  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const MetaContainer = styled.div`
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
`;

const MetaBadge = styled.div`
  background: rgba(66, 160, 75, 0.15);
  color: #5FBB66;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(66, 160, 75, 0.25);
    transform: translateY(-2px);
  }
`;

const IntroText = styled.p`
  text-align: center; font-size: 1.1rem; line-height: 1.7; color: #cccccc; margin-bottom: 30px;
  opacity: 0; animation: ${fadeInUp} 0.6s ease-out 0.2s forwards;
  @media (max-width: 480px) { font-size: 1rem; text-align: left; }
`;

const SummaryBox = styled.div`
  background: rgba(66, 160, 75, 0.05); border: 1px solid rgba(66, 160, 75, 0.2);
  border-left: 4px solid #42A04B; padding: 24px; border-radius: 0 12px 12px 0; margin-bottom: 40px;
  opacity: 0; animation: ${fadeInUp} 0.6s ease-out 0.3s forwards;

  h2 { color: #5FBB66; font-size: 1.2rem; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; }
  p { margin: 0; color: #cccccc; font-size: 1rem; line-height: 1.6; }
  @media (max-width: 480px) { padding: 16px; }
`;

const PolicyList = styled.ol`
  list-style: none; padding: 0; margin: 0; counter-reset: policy-counter;
`;

// Added a delay prop to stagger the animations dynamically
const PolicyCard = styled.li`
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px 24px 24px 60px;
  margin-bottom: 20px;
  counter-increment: policy-counter;
  width: 100%;
  
  /* Staggered Animation */
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(66, 160, 75, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &::before {
    content: counter(policy-counter);
    position: absolute; left: 20px; top: 24px;
    font-size: 1.2rem; font-weight: 800; color: #42A04B;
    background: rgba(66, 160, 75, 0.1);
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%;
    transition: all 0.3s ease;
  }

  &:hover::before {
    background: #42A04B;
    color: #fff;
    transform: scale(1.1) rotate(5deg);
  }

  @media (max-width: 768px) {
    padding: 20px 20px 20px 50px;
    &::before { left: 12px; top: 20px; }
  }

  @media (max-width: 480px) {
    padding: 45px 16px 16px 16px;
    &::before { left: 16px; top: 12px; width: 24px; height: 24px; font-size: 1rem; }
  }
`;

const PolicyHeading = styled.h3`
  font-size: 1.2rem; color: #ffffff; margin: 0 0 16px 0; font-weight: 600;
  @media (max-width: 480px) { margin-left: 32px; margin-top: -30px; margin-bottom: 20px; }
`;

const PolicyContent = styled.div`
  font-size: 1rem; line-height: 1.6; color: #a0a0a0; word-break: break-word;
  p { margin: 0 0 12px 0; &:last-child { margin-bottom: 0; } }
  ul { margin: 8px 0 16px 0; padding-left: 20px; li { margin-bottom: 8px; &::marker { color: #5FBB66; } } &:last-child { margin-bottom: 0; } }
`;

const DataGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: 16px; margin-top: 12px; width: 100%;
`;

const DataCard = styled.div`
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(66, 160, 75, 0.05);
    border-color: rgba(66, 160, 75, 0.3);
    transform: translateY(-3px);
  }

  h4 { display: flex; align-items: center; gap: 8px; color: #ffffff; font-size: 1.05rem; margin: 0 0 12px 0; svg { color: #42A04B; flex-shrink: 0; } }
  ul { margin: 0 !important; }
`;

const HighlightBox = styled.div`
  background: rgba(66, 160, 75, 0.08); border: 1px solid rgba(66, 160, 75, 0.2); padding: 12px 16px; border-radius: 8px;
  color: #e0e0e0; font-size: 0.95rem; margin-top: 12px; display: inline-block; width: 100%;
`;

const ContactGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; margin-top: 16px; width: 100%;
`;

const ContactCard = styled.a`
  display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px; text-decoration: none; color: #ffffff; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); word-break: break-word;

  svg { font-size: 1.8rem; color: #5FBB66; flex-shrink: 0; transition: transform 0.3s ease; }
  div { display: flex; flex-direction: column; width: 100%; overflow: hidden;}
  span.label { font-size: 0.85rem; color: #a0a0a0; text-transform: uppercase; margin-bottom: 4px; }
  span.value { font-size: 1rem; font-weight: 600; line-height: 1.4; }

  &:hover {
    background: rgba(66, 160, 75, 0.1); border-color: rgba(66, 160, 75, 0.4); transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(66, 160, 75, 0.15);
  }
  
  &:hover svg {
    transform: scale(1.15) rotate(-5deg);
  }
  
  @media (max-width: 480px) { padding: 16px; }
`;

// --- Component ---
const PrivacyPolicyPage = () => {
  return (
    <PageWrapper>
      <ContentCard>
        <Header>
          <Title>
            <FaShieldAlt aria-hidden="true" /> Privacy Policy
          </Title>
          <MetaContainer>
            <MetaBadge>Effective Date: June 14, 2025</MetaBadge>
            <MetaBadge>Last Updated: June 14, 2025</MetaBadge>
          </MetaContainer>
        </Header>

        <IntroText>
          This Privacy Policy explains how Trovia (“we”, “our”, “us”) collects, uses, shares, and protects your personal information when you use our website, mobile app, or any related services (collectively, the “Platform”).
        </IntroText>

        <SummaryBox>
          <h2><FaInfoCircle /> The Short Version (TL;DR)</h2>
          <p>
            <strong>We do not sell your data.</strong> We collect basic information (like your name, contact details, and app usage) to help you book treks, interact with the community, and keep the platform secure. We only share your data with the specific Organizers you book with and our secure payment partners. You can request to delete your account and data at any time.
          </p>
        </SummaryBox>

        <PolicyList>
          {/* Notice the delay="0.4s", "0.5s", etc. to create the waterfall load effect */}
          <PolicyCard delay="0.4s">
            <PolicyHeading>Information We Collect</PolicyHeading>
            <PolicyContent>
              <DataGrid>
                <DataCard>
                  <h4><FaUserCheck /> Provided by You</h4>
                  <ul>
                    <li>Name, email, mobile number</li>
                    <li>Age, gender, city</li>
                    <li>Profile photos or other media</li>
                    <li>Payment information (via secure gateway only)</li>
                    <li>User-generated content (reviews, messages)</li>
                  </ul>
                </DataCard>
                <DataCard>
                  <h4><FaRobot /> Collected Automatically</h4>
                  <ul>
                    <li>IP address, browser type</li>
                    <li>Device identifiers</li>
                    <li>Location (only if permission is granted)</li>
                    <li>Cookies, pixels, and usage logs</li>
                  </ul>
                </DataCard>
              </DataGrid>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="0.5s">
            <PolicyHeading>Why We Collect Your Data</PolicyHeading>
            <PolicyContent>
              <ul>
                <li>To register and manage your Trovia account.</li>
                <li>To facilitate trek bookings with verified organizers.</li>
                <li>To provide personalized trek recommendations.</li>
                <li>To enable community features like stories, chatrooms, and badges.</li>
                <li>To communicate updates, offers, and service-related alerts.</li>
                <li>To ensure platform security, fraud detection, and abuse prevention.</li>
                <li>To comply with binding legal obligations.</li>
              </ul>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="0.6s">
            <PolicyHeading>Sharing of Information</PolicyHeading>
            <PolicyContent>
              <HighlightBox>
                <strong>We do not sell your personal data to advertisers.</strong>
              </HighlightBox>
              <p style={{ marginTop: '12px' }}>We may share your data strictly with:</p>
              <ul>
                <li><strong>Trek Organizers:</strong> Only when you actively book their trek, to facilitate your trip.</li>
                <li><strong>Payment Processors:</strong> Like Razorpay, for secure financial transactions.</li>
                <li><strong>Service Providers:</strong> Like analytics or cloud hosting platforms, strictly under confidentiality agreements.</li>
                <li><strong>Legal Authorities:</strong> Only when formally required by law or a court order.</li>
              </ul>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="0.7s">
            <PolicyHeading>Your Control & Choices</PolicyHeading>
            <PolicyContent>
              <p>You have the right to control your digital footprint on Trovia. You can:</p>
              <ul>
                <li>Edit or delete your profile information at any time via your account settings.</li>
                <li>Opt out of marketing emails and SMS notifications.</li>
                <li>Manage cookie permissions directly in your browser or app settings.</li>
                <li>Request permanent deletion of your account and associated data by emailing our support team.</li>
              </ul>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="0.8s">
            <PolicyHeading>Data Storage & Security</PolicyHeading>
            <PolicyContent>
              <ul>
                <li>We store data on secure Indian or internationally-compliant cloud servers.</li>
                <li>We utilize SSL encryption, active firewalls, and strict internal access controls.</li>
                <li>While we implement industry-standard practices, please note that no method of digital transmission or storage is 100% secure.</li>
              </ul>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="0.9s">
            <PolicyHeading>Retention of Data</PolicyHeading>
            <PolicyContent>
              <p>We retain personal data only as long as:</p>
              <ul>
                <li>Your account remains active.</li>
                <li>It is functionally needed to provide our services to you.</li>
                <li>Required by legal, tax, or regulatory obligations.</li>
              </ul>
              <HighlightBox>
                Note: When you request account deletion, your data will be permanently erased within <strong>30 business days</strong>, unless retention is required by law.
              </HighlightBox>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="1.0s">
            <PolicyHeading>Children’s Privacy</PolicyHeading>
            <PolicyContent>
              <p>Trovia is not intended for users under 13 years old. We do not knowingly collect personal data from children. If we discover that a child under 13 has provided us with personal information, we will immediately delete it from our servers.</p>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="1.1s">
            <PolicyHeading>Changes to This Policy</PolicyHeading>
            <PolicyContent>
              <p>We may update this policy periodically to reflect changes in our practices or legal requirements. Users will be notified of significant changes via email or an in-app alert. Your continued use of the platform implies acceptance of the updated policies.</p>
            </PolicyContent>
          </PolicyCard>

          <PolicyCard delay="1.2s">
            <PolicyHeading>Contact Us</PolicyHeading>
            <PolicyContent>
              <p>If you have any questions, concerns, or requests regarding your privacy, please reach out to our team:</p>
              <ContactGrid>
                <ContactCard href="mailto:support@trovia.in">
                  <FaEnvelope />
                  <div>
                    <span className="label">Email Support</span>
                    <span className="value">support@trovia.in</span>
                  </div>
                </ContactCard>
                <ContactCard as="div" style={{ cursor: 'default' }}>
                  <FaMapMarkerAlt />
                  <div>
                    <span className="label">Headquarters</span>
                    <span className="value">Trovia<br/>Bhopal, MP, India</span>
                  </div>
                </ContactCard>
              </ContactGrid>
            </PolicyContent>
          </PolicyCard>
        </PolicyList>
      </ContentCard>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;