import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import mountainReach from '../assets/images/mountain-reach.png';
import mountainBottom from '../assets/images/mountain-bottom.png';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const HeroContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #FFE4E1, #ffcdc7);
  background-size: 200% 200%;
  animation: ${gradientMove} 15s ease infinite;
  overflow: hidden;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
  
  @media (max-width: 480px) {
    padding-top: 40px;
  }
`;

const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.7);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: ${props => props.opacity};
`;

const ContentWrapper = styled.div`
  max-width: 550px;
  z-index: 3;
  margin-left: 8%;
  padding-bottom: 5%;
  animation: ${fadeIn} 1s ease-out forwards;
  
  @media (max-width: 768px) {
    margin-left: 5%;
    max-width: 90%;
  }
`;

const Highlight = styled.span`
  position: relative;
  display: inline-block;
  color: #FF6347;
  font-weight: 800;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #ffcdc7, #FF6347);
    z-index: -1;
    border-radius: 4px;
    opacity: 0.4;
  }
`;

const SubHeading = styled.p`
  font-size: 1.2rem;
  color: #FF6347;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards 0.2s;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.5px;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards 0.4s;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  color: #555;
  line-height: 1.7;
  max-width: 500px;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards 0.6s;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const ButtonWrapper = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards 0.8s;
  display: flex;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const CreateAccountButton = styled(Link)`
  padding: 15px 35px;
  font-size: 1.15rem;
  font-weight: 700;
  background: linear-gradient(90deg, #FF6347, #FF8C75);
  background-size: 200% 100%;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 5px 20px rgba(255, 99, 71, 0.4);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(255, 99, 71, 0.5);
    background-position: right center;
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover::after {
    left: 100%;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 25px;
  }
`;

const LearnMore = styled.a`
  font-size: 1.1rem;
  color: #555;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  position: relative;
  padding: 5px 0;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #FF6347;
    transition: width 0.3s ease;
  }
  
  svg {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #FF6347;
    
    &::after {
      width: 100%;
    }
    
    svg {
      transform: translateX(5px);
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const XPBadge = styled.div`
  position: absolute;
  top: 15%;
  right: 20%;
  background: white;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  transform: rotate(10deg);
  animation: ${breathe} 5s infinite ease-in-out;
  z-index: 3;
  
  @media (max-width: 1024px) {
    width: 100px;
    height: 100px;
    right: 15%;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const XPValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #FF6347;
`;

const XPText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
`;

const ImagesWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const MountainReach = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: auto;
  z-index: 2;
  object-fit: contain;
  object-position: right bottom;
  transform: translateY(-5%);
  user-select: none;
  animation: ${fadeIn} 1s ease-out forwards 0.3s, ${float} 8s ease-in-out infinite;
  opacity: 0;
  
  @media (max-width: 768px) {
    width: 65%;
    opacity: 0.9;
  }
  
  @media (max-width: 480px) {
    width: 85%;
    opacity: 0.8;
  }
`;

const MountainBottom = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 45%;
  z-index: 1;
  object-fit: cover;
  user-select: none;
  animation: ${fadeIn} 1s ease-out forwards;
  opacity: 0;
`;

const MountainGlow = styled.div`
  position: absolute;
  right: 25%;
  bottom: 40%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 99, 71, 0.2) 0%, rgba(255, 99, 71, 0) 70%);
  z-index: 1;
  filter: blur(30px);
  animation: ${breathe} 7s infinite ease-in-out;
  
  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    right: 15%;
  }
`;

const MountainHero = () => {
  const [particles, setParticles] = useState([]);
  
  // Generate random particles on component mount
  useEffect(() => {
    const generateParticles = () => {
      const particlesArray = [];
      for (let i = 0; i < 15; i++) {
        particlesArray.push({
          id: i,
          size: Math.random() * 8 + 3,
          top: Math.random() * 100,
          left: Math.random() * 100,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      setParticles(particlesArray);
    };
    
    generateParticles();
  }, []);

  return (
    <HeroContainer>
      <Particles>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            size={particle.size}
            top={particle.top}
            left={particle.left}
            duration={particle.duration}
            delay={particle.delay}
            opacity={particle.opacity}
          />
        ))}
      </Particles>
      
      <ContentWrapper>
        <SubHeading>Explore The World</SubHeading>
        <Title>Ready for Your <Highlight>Next Adventure?</Highlight></Title>
        <Description>
          Join thousands of trekkers discovering the world's most breathtaking trails. 
          Get insider tips, connect with fellow adventurers, and find your perfect trek.
        </Description>
        <ButtonWrapper>
          <CreateAccountButton to="/signup">
            Begin Your Journey
          </CreateAccountButton>
          <LearnMore href="#how-it-works">
            Learn how it works
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5303 6.53033C17.8232 6.23744 17.8232 5.76256 17.5303 5.46967L12.7574 0.696699C12.4645 0.403806 11.9896 0.403806 11.6967 0.696699C11.4038 0.989593 11.4038 1.46447 11.6967 1.75736L15.9393 6L11.6967 10.2426C11.4038 10.5355 11.4038 11.0104 11.6967 11.3033C11.9896 11.5962 12.4645 11.5962 12.7574 11.3033L17.5303 6.53033ZM0 6.75H17V5.25H0V6.75Z" fill="currentColor"/>
            </svg>
          </LearnMore>
        </ButtonWrapper>
      </ContentWrapper>
      
      <XPBadge>
        <XPValue>500</XPValue>
        <XPText>XP Bonus</XPText>
      </XPBadge>
      
      <ImagesWrapper>
        <MountainGlow />
        <MountainReach src={mountainReach} alt="Mountain climber reaching the peak" />
        <MountainBottom src={mountainBottom} alt="Mountain landscape" />
      </ImagesWrapper>
    </HeroContainer>
  );
};

export default MountainHero;
