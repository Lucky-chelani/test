import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import mountainBottomArt from '../assets/images/mountains-bottom-art.png';
import Footer from './Footer';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 210, 191, 0.05) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(255, 210, 191, 0.05) 100%);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding-top: 60px;
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
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #fff 0%, #FFD2BF 50%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  animation: ${fadeInUp} 1s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 210, 191, 0.6), transparent);
    border-radius: 1px;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  max-width: 900px;
  margin: 0 auto;
  opacity: 0.95;
  line-height: 1.8;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const Section = styled.section`
  margin-bottom: 80px;
  position: relative;
  
  ${props => props.delay && css`
    animation: ${fadeInUp} 0.8s ease-out ${props.delay}s both;
  `}

  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  margin-bottom: 48px;
  text-align: center;
  position: relative;
  color: #fff;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #FFD2BF, rgba(255, 210, 191, 0.3));
    border-radius: 2px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: #FFD2BF;
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 48px;
  margin-top: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-top: 40px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 210, 191, 0.2);
  border-radius: 32px;
  padding: 40px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(255, 210, 191, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FFD2BF, transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(255, 210, 191, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 210, 191, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  animation: ${fadeInUp} 0.6s ease-out;
`;

const MissionCard = styled(Card)`
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 210, 191, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 2px solid rgba(255, 210, 191, 0.3);
  animation: ${pulse} 3s ease-in-out infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #FFD2BF;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background: #FFD2BF;
    border-radius: 1px;
    transition: width 0.3s ease;
  }
  
  ${Card}:hover & {
    &::after {
      width: 60px;
    }
  }
`;

const CardText = styled.p`
  font-size: 1.15rem;
  line-height: 1.8;
  opacity: 0.95;
  font-weight: 300;
  letter-spacing: 0.3px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-top: 40px;
  }
`;

const TeamCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 210, 191, 0.2);
  border-radius: 32px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: ${fadeInUp} 0.6s ease-out;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 210, 191, 0.1), transparent);
    transform: rotate(45deg);
    transition: all 0.6s ease;
    opacity: 0;
  }
  
  &:hover {
    transform: translateY(-12px) rotateY(5deg);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 4px 20px rgba(255, 210, 191, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 210, 191, 0.5);
    
    &::before {
      opacity: 1;
      top: -100%;
      left: -100%;
    }
  }
`;

const TeamMemberAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD2BF 0%, rgba(255, 210, 191, 0.6) 100%);
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const TeamMemberName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 20px 0 12px 0;
  color: #fff;
`;

const TeamMemberRole = styled.p`
  color: #FFD2BF;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TeamMemberQuote = styled.p`
  font-style: italic;
  opacity: 0.9;
  line-height: 1.8;
  font-size: 1.05rem;
  position: relative;
  padding: 0 20px;
  
  &::before,
  &::after {
    content: '"';
    font-size: 2rem;
    color: #FFD2BF;
    position: absolute;
    font-family: Georgia, serif;
  }
  
  &::before {
    top: -10px;
    left: 0;
  }
  
  &::after {
    bottom: -20px;
    right: 0;
  }
`;

const MountainBottom = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
  margin-top: -60px;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
    z-index: 1;
  }

  @media (max-width: 768px) {
    margin-top: -30px;
    height: auto;
  }
`;

const MountainImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: -2px;
  transition: transform 0.3s ease;
  animation: ${float} 6s ease-in-out infinite;
  
  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    animation: none;
  }
`;

const FloatingElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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
      name: 'Mike Patel',
      role: 'CEO',
      quote: 'Our goal is to make trekking more than just reaching a destination - it\'s about the connections we forge along the way.',
      initial: 'MP'
    },
    {
      name: 'Alex Chen',
      role: 'Co-founder & CTO',
      quote: 'Technology should enhance the trekking experience, not complicate it. We bring smart solutions that bring people together.',
      initial: 'AC'
    },
    {
      name: 'Sarah Mitchell',
      role: 'Co-founder & COO',
      quote: 'Our goal is to make trekking more than just reaching a destination - it\'s about the experiences we forge along the way.',
      initial: 'SM'
    }
  ];

  return (
    <Page>
      <FloatingElements>
        <FloatingCircle 
          style={{ top: '10%', left: '10%', width: '100px', height: '100px' }}
          duration={8}
          delay={0}
        />
        <FloatingCircle 
          style={{ top: '60%', right: '15%', width: '60px', height: '60px' }}
          duration={10}
          delay={2}
        />
        <FloatingCircle 
          style={{ bottom: '20%', left: '20%', width: '80px', height: '80px' }}          duration={12}
          delay={4}
        />
      </FloatingElements>
      
      {/* Removed Navbar - using BottomNavbar from App.js */}
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
              <CardTitle>Community First</CardTitle>
              <CardText>
                We foster meaningful connections between trekkers, creating a vibrant community that shares knowledge, experiences, and friendship.
              </CardText>
            </Card>

            <Card>
              <CardTitle>Sustainable Travel</CardTitle>
              <CardText>
                We promote responsible trekking practices and partner with local communities to ensure our adventures have a positive impact on the environment and local economies.
              </CardText>
            </Card>

            <Card>
              <CardTitle>Safety & Trust</CardTitle>
              <CardText>
                We prioritize the safety and well-being of our community through comprehensive risk assessments, clear safety guidelines, and trustworthy support systems.
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

