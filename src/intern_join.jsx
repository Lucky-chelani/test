import React, { useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { 
  FiCheckCircle, FiClock, FiUsers, FiEdit3, 
  FiBriefcase, FiArrowRight, FiGlobe, FiChevronDown, 
  FiDollarSign, FiAward, FiStar, FiZap, FiAlertCircle, FiShield
} from 'react-icons/fi';

/* ==========================================================================
   ANIMATIONS & GLOBAL STYLES
   ========================================================================== */
const GlobalStyle = createGlobalStyle`
  body { background-color: #020617; margin: 0; font-family: 'Inter', -apple-system, sans-serif; overflow-x: hidden; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(37, 211, 102, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */
const PageWrapper = styled.div`
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
  padding: 80px 20px 120px; position: relative;
  background: radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.15) 0%, rgba(2, 6, 23, 1) 50%);
`;

const BackgroundBlob = styled.div`
  position: absolute; width: 50vw; height: 50vw; filter: blur(150px); border-radius: 50%; z-index: 0; opacity: 0.2; pointer-events: none;
  top: ${props => props.$top || 'auto'}; bottom: ${props => props.$bottom || 'auto'};
  left: ${props => props.$left || 'auto'}; right: ${props => props.$right || 'auto'};
  background: ${props => props.$color};
`;

const Container = styled(motion.div)`
  max-width: 800px; width: 100%; z-index: 10; display: flex; flex-direction: column; gap: 40px;
`;

/* --- HERO SECTION --- */
const HeroSection = styled.div`
  text-align: center; margin-bottom: 20px;
`;

const HeroBadge = styled.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; margin-bottom: 24px;
  background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 50px; color: #818cf8; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem; font-weight: 900; margin: 0 0 20px;
  background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.03em;
  @media (max-width: 768px) { font-size: 2.2rem; }
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem; color: #94a3b8; line-height: 1.6; margin: 0 auto 32px; max-width: 600px;
`;

const HeroButtons = styled.div`
  display: flex; gap: 16px; justify-content: center;
  @media (max-width: 600px) { flex-direction: column; }
`;

const PrimaryBtn = styled.a`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 16px 28px; background: #4f46e5; color: white; text-decoration: none;
  border-radius: 14px; font-weight: 600; font-size: 1.05rem; transition: 0.2s;
  &:hover { background: #4338ca; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3); }
`;

const WhatsAppBtn = styled.a`
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 28px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  color: white; text-decoration: none; border-radius: 14px; font-size: 1.05rem; font-weight: 700;
  transition: 0.3s; position: relative; overflow: hidden;
  &::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${shimmer} 3s infinite linear;
  }
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3); }
`;

/* --- ALERT BANNER --- */
const AlertBanner = styled.div`
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(67, 56, 202, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 24px; padding: 32px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px; border-left: 4px solid #6366f1;
  @media (max-width: 768px) { flex-direction: column; text-align: left; align-items: flex-start; }
`;

/* --- SECTION BLOCKS --- */
const Section = styled.div`
  background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) { padding: 30px 20px; border-radius: 24px; }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem; color: #f8fafc; margin: 0 0 8px; display: flex; align-items: center; gap: 12px; font-weight: 800;
  svg { color: #6366f1; }
`;

/* --- TIMELINE --- */
const Timeline = styled.div`
  display: flex; flex-direction: column; gap: 28px; position: relative; margin-top: 32px;
  &::before { content: ''; position: absolute; top: 10px; bottom: 10px; left: 19px; width: 2px; background: rgba(255, 255, 255, 0.1); }
`;

const TimelineItem = styled.div`
  display: flex; gap: 24px; position: relative; opacity: ${props => props.$pending ? 0.4 : 1};
`;

const TimelineDot = styled.div`
  width: 40px; height: 40px; border-radius: 50%; z-index: 2; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 700;
  background: ${props => props.$done ? '#10b981' : props.$active ? '#6366f1' : '#1e293b'}; color: ${props => props.$done || props.$active ? '#fff' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 0 0 6px rgba(99, 102, 241, 0.15)' : 'none'};
`;

const TimelineContent = styled.div`
  h4 { margin: 4px 0 4px; font-size: 1rem; color: ${props => props.$active ? '#f8fafc' : '#cbd5e1'}; font-weight: 600; }
  p { margin: 0; font-size: 0.85rem; color: #64748b; }
`;

/* --- COMMUNITY SECTION EXTRAS --- */
const SuccessIcon = styled.div`
  width: 80px; height: 80px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px;
  color: #10b981;
  font-size: 2.5rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const GuidelineList = styled.ul`
  list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px;
  li { display: flex; align-items: flex-start; gap: 12px; color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; }
  svg { color: #10b981; margin-top: 3px; flex-shrink: 0; }
`;

/* --- BENEFITS GRID --- */
const BenefitsGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const BenefitCard = styled.div`
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 24px; border-radius: 20px;
  transition: 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(99, 102, 241, 0.3); transform: translateY(-3px); }
  .icon { width: 48px; height: 48px; background: rgba(99, 102, 241, 0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #818cf8; font-size: 1.5rem; margin-bottom: 16px; }
  h3 { color: #f8fafc; font-size: 1.1rem; margin: 0 0 8px; font-weight: 700; }
  p { color: #94a3b8; font-size: 0.9rem; margin: 0; line-height: 1.5; }
`;

/* --- FAQ ACCORDION --- */
const FAQItem = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  &:last-child { border-bottom: none; }
`;

const FAQHeader = styled.button`
  width: 100%; text-align: left; background: none; border: none; padding: 24px 0;
  display: flex; justify-content: space-between; align-items: center; cursor: pointer; color: #f8fafc; font-size: 1.05rem; font-weight: 600; font-family: 'Inter', sans-serif;
  svg { transition: 0.3s; transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'}; color: #818cf8; }
`;

const FAQContent = styled(motion.div)`
  color: #94a3b8; font-size: 0.95rem; line-height: 1.6; overflow: hidden;
`;

/* --- STICKY BOTTOM BAR --- */
const StickyBar = styled(motion.div)`
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000;
  background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px; border-radius: 50px; display: flex; align-items: center; gap: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  @media (max-width: 600px) { bottom: 20px; width: 90%; max-width: 400px; justify-content: space-between; padding: 12px 16px; }
`;

/* ==========================================================================
   COMPONENT LOGIC
   ========================================================================== */
const InternPortal = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "Who can apply?", a: "Students and recent graduates interested in startups, technology, travel, or community building." },
    { q: "Is this internship paid?", a: "Yes, the stipend is performance-based and rewards top contributors." },
    { q: "How will I know if I'm shortlisted?", a: "Shortlisted candidates will receive updates directly through the intern WhatsApp community and via email." }
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <PageWrapper>
      <GlobalStyle />
      <BackgroundBlob $top="0%" $left="-10%" $color="rgba(99, 102, 241, 0.15)" />
      <BackgroundBlob $bottom="20%" $right="-10%" $color="rgba(16, 185, 129, 0.1)" />

      <Container variants={containerVariants} initial="hidden" animate="show">
        
        {/* 1. HERO SECTION */}
        <HeroSection as={motion.div} variants={itemVariants}>
          <HeroBadge><FiBriefcase /> Applicant Dashboard</HeroBadge>
          <HeroTitle>Trovia Internship Portal</HeroTitle>
          <HeroSubtitle>Track your application updates, connect with other applicants, and stay informed about the selection process.</HeroSubtitle>
          <HeroButtons>
            <PrimaryBtn href="https://docs.google.com/forms/d/e/1FAIpQLSdyLQJbQUyHB6HjtkonM35tdKpN2uIF_6tvRFawdprYh6tPhw/viewform" target="_blank" rel="noopener noreferrer">
              <FiEdit3 /> Apply for Internship
            </PrimaryBtn>
            <WhatsAppBtn href="https://chat.whatsapp.com/IIxEYaEoxzEBXMrdG8HjiY" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={20} /> Join Intern Community
            </WhatsAppBtn>
          </HeroButtons>
        </HeroSection>

        {/* 2. HAVEN'T APPLIED YET */}
        <AlertBanner as={motion.div} variants={itemVariants}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e0e7ff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
              <FiAlertCircle color="#818cf8" /> Start Your Application
            </div>
            <p style={{ margin: 0, color: '#a5b4fc', fontSize: '0.95rem' }}>If you have not filled the internship application form yet, please submit your application first.</p>
          </div>
          <PrimaryBtn href="https://docs.google.com/forms/d/e/1FAIpQLSdyLQJbQUyHB6HjtkonM35tdKpN2uIF_6tvRFawdprYh6tPhw/viewform" target="_blank" rel="noopener noreferrer" style={{ whiteSpace: 'nowrap' }}>
            Apply Now <FiArrowRight />
          </PrimaryBtn>
        </AlertBanner>

        {/* 3. APPLICATION PROGRESS */}
        <Section as={motion.div} variants={itemVariants}>
          <SectionTitle><FiClock /> Application Progress</SectionTitle>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>Track the standard hiring pipeline for the internship program.</p>
          <Timeline>
            <TimelineItem>
              <TimelineDot $done><FiCheckCircle size={20} /></TimelineDot>
              <TimelineContent $active><h4>Application Submitted</h4><p>Your details are safely recorded.</p></TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot $active>2</TimelineDot>
              <TimelineContent $active><h4 style={{color: '#818cf8'}}>Application Review</h4><p>The Trovia team is evaluating profiles.</p></TimelineContent>
            </TimelineItem>
            <TimelineItem $pending>
              <TimelineDot>3</TimelineDot>
              <TimelineContent><h4>Candidate Shortlisting</h4><p>Updates posted in the WhatsApp group.</p></TimelineContent>
            </TimelineItem>
            <TimelineItem $pending>
              <TimelineDot>4</TimelineDot>
              <TimelineContent><h4>Interview Round</h4><p>One-on-one discussion with our team.</p></TimelineContent>
            </TimelineItem>
            <TimelineItem $pending>
              <TimelineDot>5</TimelineDot>
              <TimelineContent><h4>Final Selection</h4><p>Welcome to the Trovia Team!</p></TimelineContent>
            </TimelineItem>
          </Timeline>
        </Section>

        {/* 4. JOIN COMMUNITY & GUIDELINES */}
        <Section as={motion.div} variants={itemVariants} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <SuccessIcon>
              <FaWhatsapp />
            </SuccessIcon>
            <SectionTitle style={{ justifyContent: 'center', fontSize: '1.8rem' }}>Join the Applicant Community</SectionTitle>
            <p style={{ color: '#94a3b8', margin: '0 auto 30px', maxWidth: '500px', lineHeight: '1.6' }}>
              To stay updated about interview schedules, announcements, and onboarding updates, join the official Trovia Internship Applicants WhatsApp group.
            </p>
            <WhatsAppBtn href="https://chat.whatsapp.com/IIxEYaEoxzEBXMrdG8HjiY" target="_blank" rel="noopener noreferrer" style={{ maxWidth: '300px', margin: '0 auto', animation: 'none' }}>
              Join WhatsApp Group <FiArrowRight />
            </WhatsAppBtn>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
              <FiUsers /> Over 100+ applicants have already joined.
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
            <SectionTitle style={{ fontSize: '1.2rem' }}><FiShield /> Community Guidelines</SectionTitle>
            <GuidelineList>
              <li><FiCheckCircle /> Only applicants who have filled the form should join the group.</li>
              <li><FiCheckCircle /> Avoid spam or unrelated messages to maintain group quality.</li>
              <li><FiCheckCircle /> Important announcements will be shared by admins.</li>
              <li><FiCheckCircle /> Maintain a respectful and professional environment for everyone.</li>
            </GuidelineList>
          </div>
        </Section>

        {/* 5. BENEFITS */}
        <Section as={motion.div} variants={itemVariants}>
          <SectionTitle><FiAward /> Internship Benefits</SectionTitle>
          <BenefitsGrid>
            <BenefitCard>
              <div className="icon"><FiDollarSign /></div>
              <h3>Stipend</h3><p>Performance-based stipend to reward your hard work.</p>
            </BenefitCard>
            <BenefitCard>
              <div className="icon"><FiAward /></div>
              <h3>Verified Certificate</h3><p>Official Trovia internship completion certificate.</p>
            </BenefitCard>
            <BenefitCard>
              <div className="icon"><FiStar /></div>
              <h3>Letter of Recommendation</h3><p>Exclusive LOR provided for top performers.</p>
            </BenefitCard>
            <BenefitCard>
              <div className="icon"><FiZap /></div>
              <h3>Real Startup Experience</h3><p>Work on real products, features, and communities.</p>
            </BenefitCard>
          </BenefitsGrid>
        </Section>

        {/* 6. ABOUT & 7. FAQ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <Section as={motion.div} variants={itemVariants} style={{ marginBottom: 0 }}>
            <SectionTitle><FiGlobe /> About Trovia</SectionTitle>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              Trovia is a travel and trekking platform focused on building a global community for explorers and adventure enthusiasts. The Trovia Internship Program allows students to gain real-world experience while working on meaningful projects.
            </p>
            <a href="https://trovia.in" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Visit Website <FiArrowRight />
            </a>
          </Section>

          <Section as={motion.div} variants={itemVariants} style={{ marginBottom: 0 }}>
            <SectionTitle style={{ marginBottom: '0' }}>Frequently Asked</SectionTitle>
            <div>
              {faqs.map((faq, idx) => (
                <FAQItem key={idx}>
                  <FAQHeader $isOpen={openFaq === idx} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    {faq.q} <FiChevronDown />
                  </FAQHeader>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <FAQContent initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, paddingBottom: '20px' }} exit={{ height: 0, opacity: 0 }}>
                        {faq.a}
                      </FAQContent>
                    )}
                  </AnimatePresence>
                </FAQItem>
              ))}
            </div>
          </Section>
        </div>
      </Container>

      {/* STICKY BOTTOM BAR (Floating Pill) */}
      

    </PageWrapper>
  );
};

export default InternPortal;