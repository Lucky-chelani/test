import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import blogImg from '../assets/images/trek1.png'; // Placeholder

const Page = styled.div`
  background: #000;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
`;
const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
`;
const BlogGrid = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;
const BlogCard = styled.div`
  background: #181828;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  width: 340px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const BlogImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;
const BlogContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const BlogTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;
const BlogSummary = styled.p`
  color: #ccc;
  font-size: 1rem;
  margin-bottom: 18px;
`;
const ReadButton = styled.button`
  background: #FF4B1F;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.18s;
  &:hover { background: #d13a13; }
`;

const blogs = [
  { title: 'Everest Base Camp: The Ultimate Guide', summary: 'Everything you need to know for your EBC trek.', img: blogImg },
  { title: 'Packing for the Himalayas', summary: 'Essential gear and tips for high-altitude adventures.', img: blogImg },
  { title: 'Best Treks in Patagonia', summary: 'Explore the wild beauty of South America.', img: blogImg },
];

const Blog = () => (
  <Page>
    <Navbar active="blog" />
    <Container>
      <SectionTitle>Adventure Blog</SectionTitle>
      <BlogGrid>
        {blogs.map((blog, idx) => (
          <BlogCard key={idx}>
            <BlogImage src={blog.img} alt={blog.title} />
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