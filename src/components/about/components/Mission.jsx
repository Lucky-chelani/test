import React from "react";
import { Section , SectionTitle , MissionCard , CardText} from "../About.styles";

const Mission = () => {
  return (
    <Section delay={0.3}>
        <SectionTitle>Our Mission</SectionTitle>
        <MissionCard>
        <CardText>
            We create enriching, life-changing trekking experiences that bring people together. Our mission is to make trekking accessible and enjoyable for everyone while fostering a deep respect for nature and local communities.
        </CardText>
        </MissionCard>
    </Section>
  );
};

export default Mission;