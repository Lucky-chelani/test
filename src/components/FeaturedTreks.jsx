import React from "react";
import styled from "styled-components";
import trek1 from "../assets/images/trek1.png";
import mapPattern from "../assets/images/map-pattren.png";

const Section = styled.section`
  background:rgb(0, 0, 0) url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 700px;
  padding: 80px 0 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 60px 0 80px 0;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0 60px 0;
  }
`;

const Heading = styled.h2`
  color: #fff;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Underline = styled.div`
  width: 65px;
  height: 8px;
  background: #FFD2BF;
  border-radius: 4px;
  margin: 0 auto 24px auto;
`;

const Subtitle = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 48px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`;

// Replace TreksGrid with TrekListContainer
const TrekListContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  
  @media (max-width: 1200px) {
    gap: 30px;
  }
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TrekCard = styled.div`
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  width: 380px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.18);
  }
  
  @media (max-width: 1200px) {
    width: 340px;
  }
  
  @media (max-width: 1000px) {
    width: 300px;
  }
      
  @media (max-width: 900px) {
    width: 100%;
    max-width: 500px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 600px) {
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const TrekImage = styled.div`
  height: 240px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.03);
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

// Replace CardContent with TrekInfo
const TrekInfo = styled.div`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const TrekTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #181828;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const TagRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #F7FAFF;
  color: #181828;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 6px 18px;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 5px 14px;
  }
`;

const DifficultyTag = styled(Tag)`
  background: #FFD2BF;
  color: #181828;
  font-weight: 700;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 10px;
  color: #444;
  font-size: 1rem;
  flex-wrap: wrap;
`;

const Price = styled.div`
  color: #181828;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const Star = styled.span`
  color: #FFD700;
  font-size: 1.1rem;
`;

const ViewButton = styled.button`
  background: #FFD2BF;
  color: #181828;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-weight: 700;
  font-size: 1.1rem;
  width: 130px;
  margin: 0 0 24px auto;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(24,24,40,0.08);
  transition: all 0.3s ease;
  
  &:hover {
    background: #fff;
    color: #181828;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(24,24,40,0.12);
  }
      
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 1rem;
    width: 120px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    margin: 10px 0 16px 0;
  }
`;

const treks = [
  {
    image: trek1,
    country: "Nepal",
    difficulty: "Difficult",
    title: "Everest Base Camp Trek",
    rating: 4.8,
    reviews: 124,
    days: 14,
    price: "$1,899",
  },
  {
    image: trek1,
    country: "Peru",
    difficulty: "Moderate",
    title: "Inca Trail to Machu Picchu",
    rating: 5.0,
    reviews: 98,
    days: 7,
    price: "$1,299",
  },
  {
    image: trek1,
    country: "France",
    difficulty: "Moderate",
    title: "Tour du Mont Blanc",
    rating: 4.2,
    reviews: 87,
    days: 11,
    price: "$2,199",
  },
];

export default function FeaturedTreks() {
  return (
    <Section>
      <Heading>Featured Treks</Heading>
      <Underline />
      <Subtitle>Quick treks, big adventures — perfect for short escapes!</Subtitle>
      <TrekListContainer>
        {treks.map((trek, idx) => (
          <TrekCard key={idx}>
            <TrekImage style={{backgroundImage: `url(${trek.image})`}} />
            <TrekInfo>
              <TrekTitle>{trek.title}</TrekTitle>
              <TagRow>
                <Tag>{trek.country}</Tag>
                <DifficultyTag>{trek.difficulty}</DifficultyTag>
              </TagRow>
              <InfoRow>
                <span>{trek.days} Days</span>
                <Price>{trek.price}</Price>
              </InfoRow>
              <RatingRow>
                <Star>★</Star>
                <span>{trek.rating} <span style={{color:'#888', fontWeight:400}}>({trek.reviews} reviews)</span></span>
              </RatingRow>
              <ViewButton>View Trek</ViewButton>
            </TrekInfo>
          </TrekCard>
        ))}
      </TrekListContainer>
    </Section>
  );
}