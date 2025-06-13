import React from 'react';
import styled, { keyframes } from 'styled-components';
import discover from '../assets/images/logo.png';
import book from '../assets/images/trek1.png';
import connect from '../assets/images/how1.png';
import mapPattern from '../assets/images/map-pattren.png';
import mountainBottomArt from '../assets/images/mountains-bottom-art.png';

// Color constants
const PEACH = '#FF4B1F';
const PEACH_GRADIENT = 'linear-gradient(135deg, #FF4B1F 0%, #FF9068 100%)';
const DARK_BG = '#000000';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 75, 31, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255, 75, 31, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 75, 31, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Section = styled.section`
  background: ${DARK_BG} url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  color: #fff;
  position: relative;
  min-height: 110vh; // Increased from 100vh to 110vh to accommodate mountain
  padding: 120px 0 100px 0; // Added bottom padding of 100px
  overflow: hidden;
  z-index: 1;
  
   &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%);
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0 60px 0;
    min-height: 100vh; // Return to 100vh on mobile
  }
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
`;

const HeadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  animation: ${fadeIn} 0.8s ease-out forwards;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const Title = styled.h2`
  font-size: 56px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  text-align: center;
  position: relative;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  
  &::after {
    content: 'TROVIA';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    letter-spacing: 5px;
    color: ${PEACH};
    opacity: 0.7;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 40px;
    
    &::after {
      top: -20px;
      font-size: 12px;
    }
  }
`;

const PeachUnderline = styled.div`
  width: 100px;
  height: 5px;
  background: ${PEACH_GRADIENT};
  border-radius: 10px;
  margin: 20px auto 30px auto;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.6) 50%, 
      rgba(255,255,255,0) 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
  max-width: 700px;
  font-weight: 400;
  line-height: 1.7;
  
  @media (max-width: 768px) {
    font-size: 18px;
    max-width: 90%;
  }
`;

const ServicesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  margin: 80px 0 450px 0; // Increased bottom margin from 160px to 220px
  
  @media (max-width: 1100px) {
    gap: 60px;
  }
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 80px;
    margin: 60px 0 180px 0; // Increased from 120px to 180px for mobile
  }

  @media (max-width: 480px) {
    margin: 60px 0 160px 0; // Added specific spacing for smaller screens
  }
`;

const ServiceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: ${props => props.index * 0.2}s;
  opacity: 0;
  
  &:hover .circle-wrapper {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(255, 75, 31, 0.3);
  }
  
  &:hover .service-number {
    animation: ${pulse} 1.5s infinite;
  }
  
  &:hover .service-description {
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (max-width: 900px) {
    max-width: 450px;
    width: 100%;
  }
`;

const CircleWrapper = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              box-shadow 0.5s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    border-radius: 50%;
    background: linear-gradient(90deg, ${PEACH}, #FF9068) border-box;
    -webkit-mask: 
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
  
  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

const ServiceNumber = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${PEACH_GRADIENT};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 5px 15px rgba(255, 75, 31, 0.4);
  z-index: 1;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const ServiceImg = styled.img`
  width: 65%;
  height: 65%;
  object-fit: cover;
  transition: transform 0.5s ease;
  animation: ${float} 6s ease-in-out infinite;
  
  ${ServiceCard}:hover & {
    transform: scale(1.1);
  }
`;

const ServiceContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ServiceTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 16px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background: ${PEACH};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  ${ServiceCard}:hover &::after {
    width: 50px;
  }
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ServiceDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-top: 5px;
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: 0.8;
  transform: translateY(5px);
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const MountainBottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
  transform: translateY(1px); // Ensure no gap between mountain and bottom edge
`;

const MountainImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 -15px 30px rgba(0,0,0,0.5)) brightness(0.9);
  transform-origin: bottom;
  transition: transform 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 -20px 40px rgba(0,0,0,0.6)) brightness(1);
  }
  
  // Add a subtle parallax effect on larger screens
  @media (min-width: 1024px) {
    animation: ${float} 15s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  @media (max-width: 768px) {
    filter: drop-shadow(0 -10px 20px rgba(0,0,0,0.4)) brightness(0.9);
  }
`;
const MountainGlow = styled.div`
  position: absolute;
  bottom: 40%;
  left: 0;
  right: 0;
  height: 200px;
  background: radial-gradient(ellipse at center, rgba(255,75,31,0.15) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
  z-index: 1;
  
  @media (max-width: 768px) {
    height: 120px;
    bottom: 30%;
  }
`;

const Decorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const Dot = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  background: ${PEACH};
  
  &.dot1 {
    width: 150px;
    height: 150px;
    top: 10%;
    left: 10%;
    animation: ${float} 10s ease-in-out infinite;
  }
  
  &.dot2 {
    width: 200px;
    height: 200px;
    bottom: 30%;
    right: 5%;
    animation: ${float} 13s ease-in-out infinite;
  }
  
  &.dot3 {
    width: 100px;
    height: 100px;
    bottom: 10%;
    left: 20%;
    animation: ${float} 8s ease-in-out infinite;
  }
`;

const Circle = styled.div`
  position: absolute;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  
  &.circle1 {
    width: 300px;
    height: 300px;
    top: 10%;
    right: 10%;
    animation: ${rotate} 80s linear infinite;
  }
  
  &.circle2 {
    width: 200px;
    height: 200px;
    bottom: 20%;
    left: 5%;
    animation: ${rotate} 60s linear infinite reverse;
  }
`;

const ExploreButton = styled.button`
  background: ${PEACH_GRADIENT};
  color: white;
  border: none;
  padding: 16px 36px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  margin: 0 auto 80px; // Added bottom margin of 80px
  display: block;
  position: relative;
  z-index: 3;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(255, 75, 31, 0.3);
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(255, 75, 31, 0.4);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 14px 32px;
    margin: 0 auto 60px; // Reduced bottom margin for mobile
  }
`;

const HowItWorks = () => {
  const services = [
    {
      image: discover,
      title: "Discover Treks",
      description: "Browse through our curated collection of treks from around the world, with detailed information and authentic reviews."
    },
    {
      image: book,
      title: "Book Seamlessly",
      description: "Reserve your adventure with our simple booking process. Secure payments, instant confirmations, and all the details you need."
    },
    {
      image: connect,
      title: "Earn & Connect",
      description: "Share your experiences, earn rewards, and connect with fellow trekkers to build lasting relationships in our community."
    }
  ];

  return (
    <Section>
      <Decorations>
        <Dot className="dot1" />
        <Dot className="dot2" />
        <Dot className="dot3" />
        <Circle className="circle1" />
        <Circle className="circle2" />
      </Decorations>
      
      <Container>
        <HeadingWrap>
          <Title>How Trovia Works</Title>
          <PeachUnderline />
          <Subtitle>
            Your journey begins with three simple steps. Discover the perfect trek, 
            book with confidence, and connect with a global community of adventure seekers.
          </Subtitle>
        </HeadingWrap>
        
        <ServicesRow>
          {services.map((service, index) => (
            <ServiceCard key={index} index={index + 1}>
              <CircleWrapper className="circle-wrapper">
                <ServiceNumber className="service-number">{index + 1}</ServiceNumber>
                <ServiceImg src={service.image} alt={service.title} />
              </CircleWrapper>
              <ServiceContentWrapper>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription className="service-description">
                  {service.description}
                </ServiceDescription>
              </ServiceContentWrapper>
            </ServiceCard>
          ))}
        </ServicesRow>
        
        <ExploreButton>Start Your Journey</ExploreButton>
      </Container>
      
      <MountainBottom>
          <MountainGlow />
        <MountainImg src={mountainBottomArt} alt="mountain art" />
      </MountainBottom>
    </Section>
  );
};

export default HowItWorks;
