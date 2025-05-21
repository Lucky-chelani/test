import React from 'react';
import styled from 'styled-components';
import mountainReach from '../assets/images/mountain-reach.png';
import mountainBottom from '../assets/images/mountain-bottom.png';

const HeroContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  background: #FFE4E1;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 500px;
  z-index: 3;
  margin-left: 8%;
  padding-bottom: 5%;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #000;
  font-weight: bold;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #333;
  line-height: 1.6;
  max-width: 450px;
`;

const CreateAccountButton = styled.button`
  padding: 12px 28px;
  font-size: 1.1rem;
  background-color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  &:hover {
    transform: translateY(-2px);
  }
`;

const ImagesWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const MountainReach = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 45%;
  height: auto;
  z-index: 2;
  object-fit: contain;
  object-position: right bottom;
  transform: translateY(-5%);
  user-select: none;
`;

const MountainBottom = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 43%;
  z-index: 1;
  object-fit: cover;
  user-select: none;
`;

const MountainHero = () => {
  return (
    <HeroContainer>
      <ContentWrapper>
        <Title>Ready for Your Next Adventure?</Title>
        <Description>
          Join thousands of trekkers discovering the world's most breathtaking trails. 
          Sign up today and get 500 XP to start your journey!
        </Description>
        <CreateAccountButton>Create Account</CreateAccountButton>
      </ContentWrapper>
      <ImagesWrapper>
        <MountainReach src={mountainReach} alt="Mountain with climber" />
        <MountainBottom src={mountainBottom} alt="Mountain foreground" />
      </ImagesWrapper>
    </HeroContainer>
  );
};

export default MountainHero; 