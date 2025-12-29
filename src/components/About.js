import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaUsers, FaLeaf, FaShieldAlt } from 'react-icons/fa'; // Import icons
import mapPattern from '../assets/images/map-pattren.png';
import mountainBottomArt from '../assets/images/mountains-bottom-art.png';
import Footer from './Footer';

// --- ANIMATIONS ---

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const textShine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// --- STYLED COMPONENTS ---

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
  padding-top: 80px;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(45deg, rgba(255, 210, 191, 0.05) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(255, 210, 191, 0.05) 100%);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding-top: 60px;
    background-attachment: scroll; // Fixes mobile jitter
    background-position: center top;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const Title = styled.h1`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  margin-bottom: 32px;
  /* Premium Animated Gradient */
  background: linear-gradient(
    300deg,
    #ffffff 0%,
    #FFD2BF 25%,
    #ffb89e 50%,
    #FFD2BF 75%,
    #ffffff 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  letter-spacing: -1px;
  animation: ${fadeInUp} 1s ease-out, ${textShine} 5s ease-in-out infinite;
  position: relative;
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.8;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: #e0e0e0;
`;

const Section = styled.section`
  margin-bottom: 100px;
  position: relative;
  
  ${props => props.delay && css`
    animation: ${fadeInUp} 0.8s ease-out ${props.delay}s both;
  `}

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 56px;
  text-align: center;
  position: relative;
  color: #fff;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #FFD2BF, rgba(255, 210, 191, 0.3));
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  margin-top: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }
`;

// Premium Glassmorphism Card
const Card = styled.div`
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px 32px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  
  // Inner Glow Effect
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 210, 191, 0.1), transparent 70%);
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(255, 210, 191, 0.5);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(255, 210, 191, 0.1);
    
    &::after {
      opacity: 1;
    }
  }
  
  animation: ${fadeInUp} 0.6s ease-out;
`;

// Icon Wrapper for Grid
const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: #FFD2BF;
  margin-bottom: 24px;
  background: rgba(255, 210, 191, 0.1);
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${Card}:hover & {
    background: #FFD2BF;
    color: #000;
    transform: scale(1.1) rotate(5deg);
  }
`;

const MissionCard = styled(Card)`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 210, 191, 0.05) 100%);
  border: 1px solid rgba(255, 210, 191, 0.3);
  animation: ${pulse} 4s ease-in-out infinite;
  padding: 60px 40px;
  
  &:hover {
    animation-play-state: paused;
  }

  &::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 20px;
    font-size: 8rem;
    color: rgba(255, 210, 191, 0.1);
    font-family: serif;
    line-height: 1;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
`;

const CardText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }
`;

const TeamCard = styled(Card)`
  text-align: center;
  padding: 50px 30px;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
`;

const TeamMemberAvatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  // Modern gradient mesh look
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent),
              linear-gradient(135deg, #FFD2BF 0%, #ff9a76 50%, #ff6b6b 100%);
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(255, 210, 191, 0.2);
  transition: transform 0.3s ease;

  ${TeamCard}:hover & {
    transform: scale(1.1) rotate(-5deg);
    border-color: #FFD2BF;
  }
`;

const TeamMemberName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 20px 0 8px 0;
  color: #fff;
`;

const TeamMemberRole = styled.p`
  color: #FFD2BF;
  font-weight: 600;
  margin-bottom: 24px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const TeamMemberQuote = styled.p`
  font-style: italic;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  font-size: 1rem;
`;

const MountainBottom = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  margin-top: -60px;
  z-index: 2;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 150px;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
    z-index: 1;
  }
`;

const MountainImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: -2px;
  animation: ${float} 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    animation: none;
  }
`;

const FloatingElements = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const FloatingCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 210, 191, 0.1) 0%, transparent 70%);
  animation: ${float} ${props => props.duration || 6}s ease-in-out infinite;
  animation-delay: ${props => props.delay || 0}s;
`;

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const team = [
    {
      name: 'Harsh Gupta',
      role: 'CEO',
      quote: 'Our goal is to make trekking more than just reaching a destination - it\'s about the connections we forge along the way.',
      initial: 'HG'
    },
    { 
      name: 'Lucky Chelani',
      role: 'Co-founder & CTO',
      quote: 'Technology should enhance the trekking experience, not complicate it. We bring smart solutions that bring people together.',
      initial: 'LC'
    }
  ];

  return (
    <Page>
      <FloatingElements>
        <FloatingCircle style={{ top: '10%', left: '10%', width: '100px', height: '100px' }} duration={8} delay={0} />
        <FloatingCircle style={{ top: '60%', right: '15%', width: '60px', height: '60px' }} duration={10} delay={2} />
        <FloatingCircle style={{ bottom: '20%', left: '20%', width: '80px', height: '80px' }} duration={12} delay={4} />
      </FloatingElements>
      
      <Container>
        <Hero>
          <Title>Transforming How The World Experiences Trekking</Title>
          <Subtitle>
            We're building a global community of adventurers who believe in the power of shared experiences, sustainable travel, and the transformative nature of connecting with nature and each other.
          </Subtitle>
        </Hero>

        <Section delay={0.3}>
          <SectionTitle>Our Mission</SectionTitle>
          <MissionCard>
            <CardText>
              We create enriching, life-changing trekking experiences that bring people together. Our mission is to make trekking accessible and enjoyable for everyone while fostering a deep respect for nature and local communities.
            </CardText>
          </MissionCard>
        </Section>

        <Section delay={0.5}>
          <Grid>
            <Card>
              <IconWrapper>
                <FaUsers />
              </IconWrapper>
              <CardTitle>Community First</CardTitle>
              <CardText>
                We foster meaningful connections between trekkers, creating a vibrant community that shares knowledge, experiences, and friendship.
              </CardText>
            </Card>

            <Card>
              <IconWrapper>
                <FaLeaf />
              </IconWrapper>
              <CardTitle>Sustainable Travel</CardTitle>
              <CardText>
                We promote responsible trekking practices and partner with local communities to ensure our adventures have a positive impact.
              </CardText>
            </Card>

            <Card>
              <IconWrapper>
                <FaShieldAlt />
              </IconWrapper>
              <CardTitle>Safety & Trust</CardTitle>
              <CardText>
                We prioritize the safety and well-being of our community through comprehensive risk assessments and trustworthy support systems.
              </CardText>
            </Card>
          </Grid>
        </Section>

        <Section delay={0.7}>
          <SectionTitle>Meet Our Team</SectionTitle>
          <TeamGrid>
            {team.map((member, index) => (
              <TeamCard key={index}>
                <TeamMemberAvatar>
                  {member.initial}
                </TeamMemberAvatar>
                <TeamMemberName>{member.name}</TeamMemberName>
                <TeamMemberRole>{member.role}</TeamMemberRole>
                <TeamMemberQuote>{member.quote}</TeamMemberQuote>
              </TeamCard>
            ))}
          </TeamGrid>
        </Section>
      </Container>
      <MountainBottom>
        <MountainImg src={mountainBottomArt} alt="mountain art" />
      </MountainBottom>
      <Footer />
    </Page>
  );
};

export default About;