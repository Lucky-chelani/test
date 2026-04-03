import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaHeadset, 
  FaEnvelope, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaChevronDown,
  FaPaperPlane
} from 'react-icons/fa';

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
  *, *::before, *::after { box-sizing: border-box; }
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

  svg { color: #42A04B; animation: ${pulseGlow} 3s infinite ease-in-out; }

  @media (max-width: 768px) { font-size: 1.8rem; }
  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const IntroText = styled.p`
  text-align: center; font-size: 1.1rem; line-height: 1.7; color: #cccccc; margin-bottom: 30px;
  opacity: 0; animation: ${fadeInUp} 0.6s ease-out 0.2s forwards;
  @media (max-width: 480px) { font-size: 1rem; text-align: left; }
`;

// Contact Grid
const ContactGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 16px; margin-bottom: 40px; width: 100%;
  opacity: 0; animation: ${fadeInUp} 0.6s ease-out 0.3s forwards;
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
  
  &:hover svg { transform: scale(1.15) rotate(-5deg); }
  @media (max-width: 480px) { padding: 16px; }
`;

// Section Styles
const SectionTitle = styled.h2`
  font-size: 1.5rem; color: #ffffff; margin: 0 0 24px 0; font-weight: 700;
  border-left: 4px solid #42A04B; padding-left: 12px;
`;

const SectionContainer = styled.div`
  margin-bottom: 50px; opacity: 0; animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
`;

// FAQ Accordion
const FAQContainer = styled.div` display: flex; flex-direction: column; gap: 12px; `;

const FAQItem = styled.div`
  background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; overflow: hidden;
  transition: all 0.3s ease;
  &:hover { border-color: rgba(66, 160, 75, 0.3); }
`;

const FAQQuestion = styled.button`
  width: 100%; text-align: left; background: none; border: none; padding: 20px; color: #ffffff; font-size: 1.05rem;
  font-weight: 600; display: flex; justify-content: space-between; align-items: center; cursor: pointer;
  
  svg { 
    color: #42A04B; transition: transform 0.3s ease; 
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.isOpen ? '0 20px 20px 20px' : '0 20px'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  color: #a0a0a0; line-height: 1.6;
`;

// Support Form
const Form = styled.form` display: flex; flex-direction: column; gap: 20px; `;

const InputGroup = styled.div` display: flex; flex-direction: column; gap: 8px; `;

const Label = styled.label` font-size: 0.9rem; font-weight: 500; color: rgba(255, 255, 255, 0.9); `;

const Input = styled.input`
  width: 100%; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px;
  background: rgba(255, 255, 255, 0.05); color: #fff; font-size: 1rem; outline: none; transition: all 0.3s ease;
  font-family: inherit;

  &::placeholder { color: rgba(255, 255, 255, 0.3); }
  &:focus { border-color: #42A04B; background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 0 3px rgba(66, 160, 75, 0.15); }
`;

const TextArea = styled(Input).attrs({ as: 'textarea' })`
  resize: vertical; min-height: 120px;
`;

const SubmitButton = styled.button`
  display: flex; justify-content: center; align-items: center; gap: 10px; width: 100%; padding: 16px;
  background: linear-gradient(135deg, #42A04B 0%, #358A3D 100%); color: #fff; border: none; border-radius: 12px;
  font-size: 1.05rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 160, 75, 0.3); margin-top: 10px;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(66, 160, 75, 0.4); }
  &:active { transform: translateY(0); }
`;

// --- Data ---
const faqs = [
  {
    question: "How do I cancel my trek booking?",
    answer: "You can cancel your booking by navigating to your Profile > My Bookings. Select the trek you wish to cancel and click 'Cancel Booking'. Please note that cancellation fees may apply depending on the specific Organizer's policy."
  },
  {
    question: "When will I receive my refund?",
    answer: "Once a cancellation is approved, refunds are processed immediately on our end. However, depending on your bank and payment method (UPI, Credit Card, NetBanking), it may take 7 to 15 business days to reflect in your account."
  },
  {
    question: "Can I transfer my booking to a friend?",
    answer: "Booking transfers are subject to the Trek Organizer's discretion. Please contact the organizer directly through the messaging feature on their trek listing page to request a transfer."
  },
  {
    question: "How do I become a Trek Organizer on Trovia?",
    answer: "We love welcoming new organizers! Simply click 'Register as a Trek Organizer' on the Signup page. You will need to provide your business details and undergo a quick verification process before you can start listing treks."
  }
];

// --- Component ---
const SupportPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, integrate this with a backend service like EmailJS or Firebase
    alert("Support request sent! Our team will get back to you within 24 hours.");
  };

  return (
    <PageWrapper>
      <ContentCard>
        <Header>
          <Title>
            <FaHeadset aria-hidden="true" /> Help Center
          </Title>
          <IntroText>
            Need assistance for your next big adventure? We are here to help. <br/>
            Check our FAQs or reach out directly to the Trovia team.
          </IntroText>
        </Header>

        <ContactGrid>
          <ContactCard href="https://wa.me/918989986204" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
            <div>
              <span className="label">Live Chat</span>
              <span className="value">+91-8989986204</span>
            </div>
          </ContactCard>
          <ContactCard href="mailto:support@trovia.in">
            <FaEnvelope />
            <div>
              <span className="label">Email Us</span>
              <span className="value">support@trovia.in</span>
            </div>
          </ContactCard>
          <ContactCard as="div" style={{ cursor: 'default' }}>
            <FaMapMarkerAlt />
            <div>
              <span className="label">Headquarters</span>
              <span className="value">Bhopal, MP, India</span>
            </div>
          </ContactCard>
        </ContactGrid>

        <SectionContainer delay="0.4s">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FAQContainer>
            {faqs.map((faq, index) => (
              <FAQItem key={index}>
                <FAQQuestion onClick={() => toggleFAQ(index)} isOpen={openFAQ === index}>
                  {faq.question}
                  <FaChevronDown />
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === index}>
                  <p>{faq.answer}</p>
                </FAQAnswer>
              </FAQItem>
            ))}
          </FAQContainer>
        </SectionContainer>

        <SectionContainer delay="0.5s">
          <SectionTitle>Still need help? Send a message</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <InputGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </InputGroup>
            </div>
            
            <InputGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" type="text" placeholder="E.g., Issue with booking #12345" required />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="message">How can we help?</Label>
              <TextArea id="message" placeholder="Describe your issue in detail..." required />
            </InputGroup>

            <SubmitButton type="submit">
              <FaPaperPlane /> Send Message
            </SubmitButton>
          </Form>
        </SectionContainer>

      </ContentCard>
    </PageWrapper>
  );
};

export default SupportPage;