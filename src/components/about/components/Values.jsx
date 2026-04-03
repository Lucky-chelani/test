import React from "react";
import { Section , Grid , Card , IconWrapper , CardTitle , CardText ,  } from "../About.styles";
import { FaUsers, FaLeaf, FaShieldAlt } from 'react-icons/fa'; 

const Values = () => {
  return (
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
  );
};

export default Values;