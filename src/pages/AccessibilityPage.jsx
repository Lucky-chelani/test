import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaExclamationTriangle, FaEnvelope, FaWhatsapp, FaUniversalAccess } from 'react-icons/fa';

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
  color: #e0e0e0; /* High contrast for accessibility */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
`;

const ContentCard = styled.main`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  max-width: 800px;
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

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionHeading = styled.h2`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Text = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  color: #cccccc;
  margin-bottom: 16px;
`;

// Grid for "Our Commitment" (POUR Principles)
const PrinciplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const PrincipleCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  border-top: 3px solid #42A04B;

  h3 {
    color: #ffffff;
    margin: 0 0 8px 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #b0b0b0;
  }
`;

// List for Accessibility Features
const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 1.05rem;
  color: #cccccc;
  line-height: 1.5;

  svg {
    color: #5FBB66;
    margin-top: 4px;
    flex-shrink: 0;
  }
`;

// Pills for "Ongoing Improvements" user groups
const PillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

const Pill = styled.span`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  color: #e0e0e0;
`;

// Warning Box for "Known Limitations"
const HighlightBox = styled.div`
  background: rgba(227, 54, 41, 0.1);
  border-left: 4px solid #E33629;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  margin-top: 16px;
  display: flex;
  gap: 16px;
  align-items: flex-start;

  svg {
    color: #E33629;
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  p {
    margin: 0;
    color: #e0e0e0;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

// Contact Cards Grid
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const ContactCard = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(66, 160, 75, 0.05);
  border: 1px solid rgba(66, 160, 75, 0.2);
  border-radius: 12px;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.3s ease;

  svg {
    font-size: 1.8rem;
    color: #5FBB66;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  span.label {
    font-size: 0.85rem;
    color: #a0a0a0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  span.value {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &:hover {
    background: rgba(66, 160, 75, 0.15);
    transform: translateY(-2px);
    border-color: rgba(66, 160, 75, 0.4);
  }
  
  &:focus-visible {
    outline: 2px solid #5FBB66;
    outline-offset: 2px;
  }
`;

// --- Component ---
const AccessibilityPage = () => {
  return (
    <PageWrapper>
      <ContentCard>
        <Header>
          <Title>
            <FaUniversalAccess aria-hidden="true" /> Accessibility Statement
          </Title>
          <MetaBadge>Effective Date: June 14, 2025</MetaBadge>
        </Header>
        
        <Text style={{ textAlign: 'center', fontSize: '1.15rem', marginBottom: '40px' }}>
          At Trovia, we are committed to making our website and mobile platform accessible and inclusive for everyone, including users with disabilities.
        </Text>

        <Section>
          <SectionHeading>Our Commitment</SectionHeading>
          <Text>We strive to adhere to the Web Content Accessibility Guidelines (WCAG) by ensuring our platform follows the POUR principles:</Text>
          <PrinciplesGrid>
            <PrincipleCard>
              <h3>Perceivable</h3>
              <p>Information and user interface components must be presentable to users in ways they can easily see or hear.</p>
            </PrincipleCard>
            <PrincipleCard>
              <h3>Operable</h3>
              <p>User interface components and navigation must be operable by keyboard, voice, or assistive devices.</p>
            </PrincipleCard>
            <PrincipleCard>
              <h3>Understandable</h3>
              <p>Information and the operation of the user interface must be written in simple language with predictable navigation.</p>
            </PrincipleCard>
            <PrincipleCard>
              <h3>Robust</h3>
              <p>Content must be robust enough to be interpreted reliably by a wide variety of user agents, including screen readers.</p>
            </PrincipleCard>
          </PrinciplesGrid>
        </Section>

        <Section>
          <SectionHeading>Accessibility Features</SectionHeading>
          <FeatureList>
            <FeatureItem><FaCheckCircle /> Alt text for images and meaningful visuals</FeatureItem>
            <FeatureItem><FaCheckCircle /> Keyboard-friendly navigation and focus states</FeatureItem>
            <FeatureItem><FaCheckCircle /> Sufficient color contrast for high readability</FeatureItem>
            <FeatureItem><FaCheckCircle /> Clear and consistent layout structure</FeatureItem>
            <FeatureItem><FaCheckCircle /> Compatibility with screen readers (like NVDA, VoiceOver)</FeatureItem>
            <FeatureItem><FaCheckCircle /> Resizable text and browser zoom support</FeatureItem>
          </FeatureList>
        </Section>

        <Section>
          <SectionHeading>Ongoing Improvements</SectionHeading>
          <Text>
            Accessibility is a continuous process. We are constantly reviewing feedback and updating our design, code, and content to enhance usability for all users, particularly those with:
          </Text>
          <PillContainer>
            <Pill>Visual impairments</Pill>
            <Pill>Hearing challenges</Pill>
            <Pill>Motor limitations</Pill>
            <Pill>Cognitive disabilities</Pill>
          </PillContainer>
        </Section>

        <Section>
          <SectionHeading>Known Limitations</SectionHeading>
          <HighlightBox>
            <FaExclamationTriangle aria-hidden="true" />
            <p>
              Some dynamic or third-party elements (such as embedded maps, specific video players, or Razorpay payment interfaces) may not be fully accessible yet. We are actively working with these providers to improve this experience.
            </p>
          </HighlightBox>
        </Section>

        <Section>
          <SectionHeading>Feedback & Support</SectionHeading>
          <Text>
            If you experience any difficulty accessing content or features on Trovia, or if you require assistance, please let us know. We take your feedback seriously.
          </Text>
          <ContactGrid>
            <ContactCard href="mailto:support@trovia.in" aria-label="Email support at support@trovia.in">
              <FaEnvelope />
              <div>
                <span className="label">Email Us</span>
                <span className="value">support@trovia.in</span>
              </div>
            </ContactCard>
            <ContactCard href="https://wa.me/918989986204" target="_blank" rel="noopener noreferrer" aria-label="Message support on WhatsApp">
              <FaWhatsapp />
              <div>
                <span className="label">WhatsApp</span>
                <span className="value">+91-8989986204</span>
              </div>
            </ContactCard>
          </ContactGrid>
        </Section>

      </ContentCard>
    </PageWrapper>
  );
};

export default AccessibilityPage;