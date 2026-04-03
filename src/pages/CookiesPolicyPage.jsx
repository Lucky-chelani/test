import React from 'react';
import styled, { keyframes } from 'styled-components';

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

const ContentCard = styled.div`
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

const Header = styled.div`
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

  span {
    -webkit-text-fill-color: initial; /* Keeps the emoji colored */
  }

  @media (max-width: 768px) {
    font-size: 2rem;
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

const IntroText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #b0b0b0;
  margin-bottom: 40px;
  text-align: center;
`;

const SectionList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: policy-counter;
`;

const SectionItem = styled.li`
  position: relative;
  margin-bottom: 40px;
  padding-left: 50px;
  counter-increment: policy-counter;

  &::before {
    content: counter(policy-counter) ".";
    position: absolute;
    left: 0;
    top: -4px;
    font-size: 1.8rem;
    font-weight: 800;
    color: rgba(66, 160, 75, 0.3);
  }

  @media (max-width: 768px) {
    padding-left: 40px;
    &::before { font-size: 1.5rem; }
  }
`;

const SectionHeading = styled.h3`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 16px;
  font-weight: 600;
`;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #a0a0a0;
  margin-bottom: 12px;

  strong {
    color: #e0e0e0;
  }
`;

const CookieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const CookieCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: rgba(66, 160, 75, 0.05);
    border-color: rgba(66, 160, 75, 0.2);
    transform: translateY(-2px);
  }

  h4 {
    color: #5FBB66;
    margin: 0 0 8px 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #909090;
  }
`;

const BulletList = styled.ul`
  padding-left: 20px;
  margin: 12px 0;

  li {
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 8px;
    position: relative;

    &::marker {
      color: #42A04B;
    }
  }
`;

const HighlightBox = styled.div`
  background: ${props => props.warning ? 'rgba(227, 54, 41, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border-left: 4px solid ${props => props.warning ? '#E33629' : '#42A04B'};
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  margin-top: 16px;

  p {
    margin: 0;
    color: ${props => props.warning ? '#ff8a80' : '#b0b0b0'};
    font-size: 0.95rem;
  }
`;

const EmailLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 24px;
  background: rgba(66, 160, 75, 0.1);
  color: #5FBB66;
  text-decoration: none;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid rgba(66, 160, 75, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(66, 160, 75, 0.2);
    transform: translateY(-2px);
  }
`;

// --- Component ---
const CookiesPolicyPage = () => {
  return (
    <PageWrapper>
      <ContentCard>
        <Header>
          <Title>
            <span role="img" aria-label="cookie icon">🍪</span> Cookies Policy
          </Title>
          <MetaBadge>Effective Date: June 14, 2025</MetaBadge>
        </Header>
        
        <IntroText>
          This Cookies Policy explains how Trovia (“we”, “us”, “our”) uses cookies and similar tracking technologies when you visit or interact with our website, app, or any of our services (“Platform”).
        </IntroText>

        <SectionList>
          <SectionItem>
            <SectionHeading>What Are Cookies?</SectionHeading>
            <Text>
              Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website or use an app. They help recognize your device, remember your preferences, and enhance your experience.
            </Text>
          </SectionItem>
          
          <SectionItem>
            <SectionHeading>Types of Cookies We Use</SectionHeading>
            <CookieGrid>
              <CookieCard>
                <h4>A. Essential Cookies</h4>
                <p>Necessary for the platform to function, such as login authentication, page navigation, and session management.</p>
              </CookieCard>
              <CookieCard>
                <h4>B. Performance & Analytics</h4>
                <p>Used to collect anonymous usage data to help us understand how users interact with the platform (e.g., Google Analytics).</p>
              </CookieCard>
              <CookieCard>
                <h4>C. Functionality Cookies</h4>
                <p>These remember user preferences (like location, language, or login state) to improve usability.</p>
              </CookieCard>
              <CookieCard>
                <h4>D. Marketing Cookies</h4>
                <p>Used to show personalized ads and retargeting via platforms like Facebook Ads and Google Ads.</p>
              </CookieCard>
            </CookieGrid>
          </SectionItem>

          <SectionItem>
            <SectionHeading>How We Use Cookies</SectionHeading>
            <BulletList>
              <li>Keep you logged in across sessions</li>
              <li>Save your language and location preferences</li>
              <li>Understand how users navigate the platform</li>
              <li>Improve features, speed, and performance</li>
              <li>Deliver relevant ads across third-party sites</li>
            </BulletList>
          </SectionItem>

          <SectionItem>
            <SectionHeading>Third-Party Cookies</SectionHeading>
            <Text>Some cookies may be set by third-party services like:</Text>
            <BulletList>
              <li>Google Analytics – to track visitor data anonymously</li>
              <li>Meta Pixel (Facebook) – for ad performance and retargeting</li>
              <li>Payment gateways like Razorpay – for secure transaction sessions</li>
            </BulletList>
            <HighlightBox>
              <Text>We do not control third-party cookies. Please refer to their respective policies.</Text>
            </HighlightBox>
          </SectionItem>

          <SectionItem>
            <SectionHeading>Your Cookie Choices</SectionHeading>
            <Text>You can:</Text>
            <BulletList>
              <li>Accept/decline non-essential cookies via our cookie banner</li>
              <li>Delete or block cookies through your browser/app settings</li>
              <li>Opt-out of personalized ads via Ad Settings on Google or Facebook</li>
            </BulletList>
            <HighlightBox warning>
              <p>Note: Disabling some cookies may affect your experience and limit certain functionalities on Trovia.</p>
            </HighlightBox>
          </SectionItem>

          <SectionItem>
            <SectionHeading>Updates to This Policy</SectionHeading>
            <Text>
              We may revise this Cookies Policy from time to time. Updates will be posted here with the revised effective date at the top of the page.
            </Text>
          </SectionItem>

          <SectionItem>
            <SectionHeading>Contact</SectionHeading>
            <Text>If you have questions about this Cookies Policy, please reach out to our team:</Text>
            <EmailLink href="mailto:support@trovia.in">
              📧 support@trovia.in
            </EmailLink>
          </SectionItem>
        </SectionList>
      </ContentCard>
    </PageWrapper>
  );
};

export default CookiesPolicyPage;