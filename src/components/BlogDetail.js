import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// --- ANIMATIONS ---
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

// --- STYLED COMPONENTS ---
const Page = styled.div`background: #0c0c0c; min-height: 100vh; color: #fff; padding-bottom: 80px;`;
const HeroSection = styled.div`
  height: 65vh; position: relative; width: 100%; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, #0c0c0c 100%); }
`;
const HeroImage = styled.img`width: 100%; height: 100%; object-fit: cover; animation: ${fadeIn} 1.2s ease-out;`;
const ContentContainer = styled.div`
  max-width: 900px; margin: -120px auto 0; position: relative; z-index: 2; padding: 0 24px; animation: ${slideUp} 0.8s ease-out 0.3s backwards;
`;
const BlogHeader = styled.div`text-align: center; margin-bottom: 40px;`;
const Title = styled.h1`
  font-size: 3.5rem; font-weight: 800; margin-bottom: 16px; background: linear-gradient(135deg, #fff 0%, #FF4B1F 50%, #FF8E53 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  @media (max-width: 768px) { font-size: 2.2rem; }
`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 40px;`;
const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 15px; text-align: center; backdrop-filter: blur(5px);
  .label { display: block; font-size: 0.75rem; text-transform: uppercase; color: #FF8E53; letter-spacing: 1px; margin-bottom: 5px; }
  .value { font-size: 1.1rem; font-weight: 600; color: #fff; }
`;
const MetaData = styled.div`display: flex; justify-content: center; gap: 20px; color: #aaa; font-size: 0.95rem; margin-top: 10px; margin-bottom: 30px;`;

const BlogBody = styled.article`
  background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 50px; font-size: 1.15rem; line-height: 1.9; color: #e0e0e0; box-shadow: 0 10px 40px rgba(0,0,0,0.3); white-space: pre-wrap;
  p { margin-bottom: 25px; }
  @media (max-width: 768px) { padding: 30px 20px; font-size: 1.05rem; }
`;

const BackButton = styled(Link)`
  display: inline-block; margin-top: 50px; color: #fff; background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%); text-decoration: none; font-weight: 600; padding: 12px 30px; border-radius: 30px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 75, 31, 0.3);
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(255, 75, 31, 0.5); }
`;

// --- NEW CTA BANNER (For Internal Linking & Conversions) ---
const CTABanner = styled.div`
  background: linear-gradient(135deg, rgba(255, 75, 31, 0.1) 0%, rgba(255, 142, 83, 0.05) 100%);
  border: 1px solid rgba(255, 75, 31, 0.3); border-radius: 20px; padding: 40px; text-align: center; margin-top: 50px;
  h3 { font-size: 1.8rem; margin: 0 0 10px; color: #fff; }
  p { color: #bbb; margin: 0 0 24px; font-size: 1.1rem; }
`;

const BlogDetail = () => {
  const { id } = useParams(); // This will now capture "hampta-pass-trek"
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // 1. Try fetching by exact Database ID first (backwards compatibility for old links)
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog(docSnap.data());
          return;
        }

        // 2. If not found, try searching the DB for a matching "slug" field
        const q = query(collection(db, "blogs"), where("slug", "==", id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setBlog(querySnapshot.docs[0].data());
          return;
        }

        // 3. FALLBACK: If your DB doesn't have slugs yet, format all titles into slugs and find the match!
        const allBlogsSnap = await getDocs(collection(db, "blogs"));
        let foundBlog = null;
        
        allBlogsSnap.forEach(doc => {
          const data = doc.data();
          if (data.title) {
            // Apply the exact same 6-word limit to the database titles
            const generatedSlug = data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '')
              .split('-')
              .slice(0, 6)
              .join('-');
              
            if (generatedSlug === id) {
              foundBlog = data;
            }
          }
        });
        
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setBlog(null); // Truly not found
        }

      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Set SEO Meta Tags once blog is loaded
  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | Trovia`;
    }
  }, [blog]);

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

        <StatsGrid>
          <StatCard><span className="label">🧗 Difficulty</span><span className="value">{blog.difficulty || "N/A"}</span></StatCard>
          <StatCard><span className="label">📏 Distance</span><span className="value">{blog.distance ? `${blog.distance} KM` : "N/A"}</span></StatCard>
          <StatCard><span className="label">🏔️ Altitude</span><span className="value">{blog.altitude || "N/A"}</span></StatCard>
          <StatCard><span className="label">☀️ Best Time</span><span className="value">{blog.bestSeason || "N/A"}</span></StatCard>
        </StatsGrid>
        
        <BlogBody>
          {blog.content}
        </BlogBody>

        {/* CTA FOR CONVERSIONS AND INTERNAL LINKING */}
        <CTABanner>
          <h3>Ready for the real thing?</h3>
          <p>Don't just read about it. Explore our verified trek packages and book your next adventure.</p>
          <BackButton to="/explore" style={{ marginTop: '0' }}>Explore Treks on Trovia</BackButton>
        </CTABanner>

      </ContentContainer>
    </Page>
  );
};

export default BlogDetail;