import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---
const Page = styled.div`
  background: #0c0c0c;
  min-height: 100vh;
  color: #fff;
  padding-bottom: 80px;
`;

const HeroSection = styled.div`
  height: 65vh;
  position: relative;
  width: 100%;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, #0c0c0c 100%);
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${fadeIn} 1.2s ease-out;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: -120px auto 0;
  position: relative;
  z-index: 2;
  padding: 0 24px;
  animation: ${slideUp} 0.8s ease-out 0.3s backwards;
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #FF4B1F 50%, #FF8E53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) { font-size: 2.2rem; }
`;

// --- ✅ NEW: STATS GRID ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);

  .label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #FF8E53;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
  }
`;

const MetaData = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #aaa;
  font-size: 0.95rem;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const BlogBody = styled.article`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 50px;
  font-size: 1.15rem;
  line-height: 1.9;
  color: #e0e0e0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  white-space: pre-wrap;
  
  p { margin-bottom: 25px; }

  @media (max-width: 768px) {
    padding: 30px 20px;
    font-size: 1.05rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-top: 50px;
  color: #fff;
  background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%);
  text-decoration: none;
  font-weight: 600;
  padding: 12px 30px;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 75, 31, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 75, 31, 0.5);
  }
`;

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return (
    <div style={{ background: '#0c0c0c', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <h2>Unpacking the Gear...</h2>
    </div>
  );

  if (!blog) return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Adventure not found.</div>;

  const dateStr = blog.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : "Recently";

  return (
    <Page>
      <HeroSection>
        <HeroImage src={blog.imageUrl} alt={blog.title} />
      </HeroSection>
      
      <ContentContainer>
        <BlogHeader>
          <Title>{blog.title}</Title>
          <MetaData>
            <span>👤 By {blog.authorName || "Explorer"}</span>
            <span>📍 {blog.location || "Mountain Range"}</span>
            <span>📅 {dateStr}</span>
          </MetaData>
        </BlogHeader>

        {/* --- ✅ NEW: DATA STATS SECTION --- */}
        <StatsGrid>
          <StatCard>
            <span className="label">🧗 Difficulty</span>
            <span className="value">{blog.difficulty || "N/A"}</span>
          </StatCard>
          <StatCard>
            <span className="label">📏 Distance</span>
            <span className="value">{blog.distance ? `${blog.distance} KM` : "N/A"}</span>
          </StatCard>
          <StatCard>
            <span className="label">🏔️ Altitude</span>
            <span className="value">{blog.altitude || "N/A"}</span>
          </StatCard>
          <StatCard>
            <span className="label">☀️ Best Time</span>
            <span className="value">{blog.bestSeason || "N/A"}</span>
          </StatCard>
        </StatsGrid>
        
        <BlogBody>
          {blog.content}
        </BlogBody>

        <div style={{ textAlign: 'center' }}>
          <BackButton to="/blog">Explore More Adventures</BackButton>
        </div>
      </ContentContainer>
    </Page>
  );
};

export default BlogDetail;