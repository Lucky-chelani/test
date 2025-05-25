import React from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';
import blogImg from '../assets/images/trek1.png';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const Page = styled.div`
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 75, 31, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #FF4B1F 50%, #FF8E53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #FF4B1F, #FF8E53);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
  margin-top: 40px;
`;

const BlogCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255, 75, 31, 0.3);
    border-color: rgba(255, 75, 31, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${BlogCard}:hover & {
    transform: scale(1.1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 75, 31, 0.2) 0%,
    rgba(255, 142, 83, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${BlogCard}:hover & {
    opacity: 1;
  }
`;

const BlogContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const BlogTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
  transition: color 0.3s ease;
  
  ${BlogCard}:hover & {
    color: #FF8E53;
  }
`;

const BlogSummary = styled.p`
  color: #bbb;
  font-size: 1rem;
  margin-bottom: 24px;
  line-height: 1.6;
  flex: 1;
`;

const ReadButton = styled.button`
  background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 75, 31, 0.4);
    background: linear-gradient(135deg, #d13a13 0%, #e6683d 100%);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 75, 31, 0.1), rgba(255, 142, 83, 0.05));
  filter: blur(40px);
  animation: ${float} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 10%;
    right: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    bottom: 20%;
    left: 10%;
    animation-delay: 3s;
  }
`;

const blogs = [
  { 
    title: 'Everest Base Camp: The Ultimate Guide', 
    summary: 'Everything you need to know for your EBC trek. From preparation to summit day, discover the secrets of conquering the world\'s highest peak.', 
    img: blogImg 
  },
  { 
    title: 'Packing for the Himalayas', 
    summary: 'Essential gear and tips for high-altitude adventures. Learn what to pack, what to leave behind, and how to prepare for extreme conditions.', 
    img: blogImg 
  },
  { 
    title: 'Best Treks in Patagonia', 
    summary: 'Explore the wild beauty of South America. Discover breathtaking landscapes, challenging trails, and unforgettable experiences in Patagonia.', 
    img: blogImg 
  },
];

const Blog = () => (
  <Page>
    <FloatingElement />
    <FloatingElement />
    <Navbar active="blog" />
    <Container>
      <Header>
        <SectionTitle>Adventure Blog</SectionTitle>
        <Subtitle>
          Discover epic adventures, expert tips, and inspiring stories from the world's most incredible destinations
        </Subtitle>
      </Header>
      <BlogGrid>
        {blogs.map((blog, idx) => (
          <BlogCard key={idx} delay={`${idx * 0.2}s`}>
            <ImageContainer>
              <BlogImage src={blog.img} alt={blog.title} />
              <ImageOverlay />
            </ImageContainer>
            <BlogContent>
              <BlogTitle>{blog.title}</BlogTitle>
              <BlogSummary>{blog.summary}</BlogSummary>
              <ReadButton>Read More</ReadButton>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>
    </Container>
  </Page>
);

export default Blog;
