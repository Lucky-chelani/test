import React from 'react';
import styled from 'styled-components';
import discover from '../assets/images/logo.png';
import book from '../assets/images/trek1.png';
import connect from '../assets/images/how1.png';
import mapPattern from '../assets/images/map-pattren.png';
import mountainBottomArt from '../assets/images/mountains-bottom-art.png';

const PEACH = '#FF4B1F';
const DARK_BG = '#000000';

const Section = styled.section`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  color: #fff;
  position: relative;
  min-height: 100vh;
  padding: 80px 0 0 0;
  overflow: hidden;
  z-index: 1;
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
  margin-bottom: 60px;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-align: center;
  position: relative;
`;

const PeachUnderline = styled.div`
  width: 65px;
  height: 4px;
  background: ${PEACH};
  border-radius: 2px;
  margin: 16px auto 24px auto;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-align: center;
  max-width: 600px;
  font-weight: 400;
  line-height: 1.6;
`;

const ServicesRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  margin: 60px 0 120px 0;
  @media (max-width: 1100px) {
    gap: 60px;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 60px;
    margin: 60px 0;
  }
`;

const ServiceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CircleWrapper = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px solid ${PEACH};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
`;

const ServiceImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ServiceTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  text-align: center;
`;

const MountainBottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
`;

const MountainImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: -2px;
`;

const HowItWorks = () => {
  return (
    <Section>
      <Container>
        <HeadingWrap>
          <Title>How Trovia Works</Title>
          <PeachUnderline />
          <Subtitle>
            Discover, book, and experience treks like never before with our innovative platform.
          </Subtitle>
        </HeadingWrap>
        <ServicesRow>
          <ServiceCard>
            <CircleWrapper>
              <ServiceImg src={discover} alt="Discover Treks" />
            </CircleWrapper>
            <ServiceTitle>Discover Treks</ServiceTitle>
          </ServiceCard>
          <ServiceCard>
            <CircleWrapper>
              <ServiceImg src={book} alt="Book Seamlessly" />
            </CircleWrapper>
            <ServiceTitle>Book Seamlessly</ServiceTitle>
          </ServiceCard>
          <ServiceCard>
            <CircleWrapper>
              <ServiceImg src={connect} alt="Earn & Connect" />
            </CircleWrapper>
            <ServiceTitle>Earn & Connect</ServiceTitle>
          </ServiceCard>
        </ServicesRow>
      </Container>
      <MountainBottom>
        <MountainImg src={mountainBottomArt} alt="mountain art" />
      </MountainBottom>
    </Section>
  );
};

export default HowItWorks; 