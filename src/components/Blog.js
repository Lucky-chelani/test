import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'; 
import { db, auth } from '../firebase'; 
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, getDoc } from 'firebase/firestore'; 

// --- ANIMATIONS ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- STYLED COMPONENTS ---
const Page = styled.div`
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 75, 31, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
    pointer-events: none;
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
  &:nth-child(1) { top: 10%; right: 10%; animation-delay: 0s; }
  &:nth-child(2) { bottom: 20%; left: 10%; animation-delay: 3s; }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  position: relative;
  z-index: 1;
  @media (max-width: 768px) { padding: 40px 16px 60px 16px; }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeInUp} 0.8s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #FF4B1F 50%, #FF8E53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  @media (max-width: 768px) { font-size: 2.5rem; }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CreateButton = styled(Link)`
  margin-top: 30px;
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 75, 31, 0.5);
  color: #FF8E53;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(255, 75, 31, 0.2);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 32px;
  margin-top: 40px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const BlogCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
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
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255, 75, 31, 0.3);
    border-color: rgba(255, 75, 31, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
  }
  &:hover::before { left: 100%; }
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
  ${BlogCard}:hover & { transform: scale(1.1); }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 75, 31, 0.2) 0%, rgba(255, 142, 83, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  ${BlogCard}:hover & { opacity: 1; }
  pointer-events: none;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.85);
  color: #ff4d4d;
  border: 2px solid #ff4d4d;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  z-index: 10; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: #ff4d4d;
    color: white;
    transform: scale(1.1);
  }
`;

const BlogContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BlogTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.3;
  transition: color 0.3s ease;
  ${BlogCard}:hover & { color: #FF8E53; }
`;

const BlogSummary = styled.p`
  color: #bbb;
  font-size: 1rem;
  margin-bottom: 24px;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 75, 31, 0.4);
    background: linear-gradient(135deg, #d13a13 0%, #e6683d 100%);
  }
`;

// --- MODAL COMPONENTS ---
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background: #1a1a2e;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(255, 75, 31, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  margin: 0 10px;
  &.confirm { background: #ff4d4d; color: white; }
  &.cancel { background: #333; color: white; }
`;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const navigate = useNavigate();

  const ADMIN_EMAILS = ['luckychelani950@gmail.com', 'ayushmaanpatel13@gmail.com'];

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        if (ADMIN_EMAILS.includes(user.email)) {
          setIsAdmin(true);
        } else {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') setIsAdmin(true);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribeBlogs = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubscribeAuth(); unsubscribeBlogs(); };
  }, []);

  const executeDelete = async () => {
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete));
      setBlogToDelete(null);
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <Page>
      <FloatingElement />
      <FloatingElement />

      {blogToDelete && (
        <ModalOverlay onClick={() => setBlogToDelete(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Delete Adventure?</h3>
            <p style={{ color: '#bbb', margin: '15px 0' }}>This cannot be undone.</p>
            <div style={{ marginTop: '20px' }}>
              <ModalButton className="cancel" onClick={() => setBlogToDelete(null)}>Cancel</ModalButton>
              <ModalButton className="confirm" onClick={executeDelete}>Delete</ModalButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      
      <Container>
        <Header>
          <SectionTitle>Adventure Blog</SectionTitle>
          <Subtitle>
            Discover epic adventures, expert tips, and inspiring stories from the world's most incredible destinations
          </Subtitle>
          <CreateButton to="/create-blog">+ Share Your Adventure</CreateButton>
        </Header>

        <BlogGrid>
          {blogs.map((blog, idx) => {
            const showDelete = (currentUser && blog.authorId === currentUser.uid) || isAdmin;
            return (
              <BlogCard key={blog.id} delay={`${idx * 0.1}s`}>
                <ImageContainer>
                  {showDelete && (
                    <DeleteButton onClick={() => setBlogToDelete(blog.id)}>🗑️</DeleteButton>
                  )}
                  <BlogImage src={blog.imageUrl} alt={blog.title} />
                  <ImageOverlay />
                </ImageContainer>
                
                <BlogContent>
                  <BlogTitle>{blog.title}</BlogTitle>
                  <BlogSummary>{blog.summary}</BlogSummary>
                  <ReadButton onClick={() => navigate(`/blogs/${blog.id}`)}>Read More</ReadButton>
                </BlogContent>
              </BlogCard>
            );
          })}
        </BlogGrid>
      </Container>
    </Page>
  );
};

export default Blog;