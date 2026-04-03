import React from "react";
import { Section , SectionTitle , TeamGrid , TeamCard , TeamMemberAvatar , TeamMemberName , TeamMemberRole , TeamMemberQuote} from "../About.styles";
import { team } from "../About.data";
const Team = () => {
  return (
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
  );
};

export default Team;