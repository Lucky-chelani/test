import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import mapPattern from '../assets/images/map-pattren.png';
import mountainBottomArt from '../assets/images/mountains-bottom-art.png';
import Footer from './Footer';

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  min-height: 100vh;
  color: #fff;
  padding-top: 80px;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 40px 24px;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 48px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #FFD2BF;
`;

const CardText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 48px;
`;

const TeamCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
`;

const TeamMemberName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 16px 0 8px 0;
`;

const TeamMemberRole = styled.p`
  color: #FFD2BF;
  font-weight: 500;
  margin-bottom: 16px;
`;

const TeamMemberQuote = styled.p`
  font-style: italic;
  opacity: 0.9;
  line-height: 1.6;
`;

const MountainBottom = styled.div`
  width: 100%;
  z-index: 2;
  height: 320px;
  position: relative;
`;

const MountainImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: -2px;
`;

const About = () => {
  const team = [
    {
      name: 'Mike Patel',
      role: 'CEO',
      quote: 'Our goal is to make trekking more than just reaching a destination - it\'s about the connections we forge along the way.'
    },
    {
      name: 'Alex Chen',
      role: 'Co-founder & CTO',
      quote: 'Technology should enhance the trekking experience, not complicate it. We bring smart solutions that bring people together.'
    },
    {
      name: 'Sarah Mitchell',
      role: 'Co-founder & COO',
      quote: 'Our goal is to make trekking more than just reaching a destination - it\'s about the experiences we forge along the way.'
    }
  ];

  return (
    <Page>
      <Navbar active="about" />
      <Container>
        <Hero>
          <Title>Transforming How The World Experiences Trekking</Title>
          <Subtitle>
            We're building a global community of adventurers who believe in the power of shared experiences, sustainable travel, and the transformative nature of connecting with nature and each other.
          </Subtitle>
        </Hero>

        <Section>
          <SectionTitle>Our Mission</SectionTitle>
          <Card>
            <CardText>
              We create enriching, life-changing trekking experiences that bring people together. Our mission is to make trekking accessible and enjoyable for everyone while fostering a deep respect for nature and local communities.
            </CardText>
          </Card>
        </Section>

        <Section>
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

        <Section>
          <SectionTitle>Meet Our Team</SectionTitle>
          <TeamGrid>
            {team.map((member, index) => (
              <TeamCard key={index}>
                <TeamMemberName>{member.name}</TeamMemberName>
                <TeamMemberRole>{member.role}</TeamMemberRole>
                <TeamMemberQuote>"{member.quote}"</TeamMemberQuote>
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