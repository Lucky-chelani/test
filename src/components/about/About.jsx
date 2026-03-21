import Hero from './components/Hero';
import Mission from './components/Mission';
import Values from './components/Values';
import Team from './components/Team';
import Footer from '../Footer';

import {
  Page,
  Container,
  FloatingElements,
  FloatingCircle,
  MountainImg,
  MountainBottom
} from './About.styles';

import mountainBottomArt from '../../assets/images/mountains-bottom-art.png';

const About = () => {
  return (
    <Page>
      <FloatingElements>
        <FloatingCircle top="10%" left="10%" size="100px" duration={8} delay={0} />
        <FloatingCircle top="60%" right="15%" size="60px" duration={10} delay={2} />
        <FloatingCircle bottom="20%" left="20%" size="80px" duration={12} delay={4} />
      </FloatingElements>

      <Container>
        <main>
          <Hero />
          <Mission />
          <Values />
          <Team />
        </main>
      </Container>

      <MountainBottom>
        <MountainImg src={mountainBottomArt} alt="Decorative mountain illustration" />
      </MountainBottom>

      <Footer />
    </Page>
  );
};

export default About;