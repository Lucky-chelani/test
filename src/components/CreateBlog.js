import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { db, storage, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- STYLED COMPONENTS ---
const Page = styled.div`
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  padding-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  margin: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  animation: ${fadeIn} 0.6s ease-out;
  z-index: 1;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff 0%, #FF4B1F 50%, #FF8E53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #ccc;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #FF4B1F;
    box-shadow: 0 0 10px rgba(255, 75, 31, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  &:focus { outline: none; border-color: #FF4B1F; }
  option { background: #1a1a2e; color: #fff; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #FF4B1F;
    box-shadow: 0 0 10px rgba(255, 75, 31, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: linear-gradient(135deg, #FF4B1F 0%, #FF8E53 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 75, 31, 0.3);
  }
  &:disabled { background: #555; cursor: not-allowed; }
`;

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [distance, setDistance] = useState('');
  const [altitude, setAltitude] = useState('');
  const [bestSeason, setBestSeason] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) { setImage(e.target.files[0]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      alert("Please fill in Title, Content, and select an Image.");
      return;
    }

    setLoading(true);

    try {
      const imageRef = ref(storage, `blogImages/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "blogs"), {
        title,
        summary,
        content,
        imageUrl,
        difficulty,
        distance,
        altitude,
        bestSeason,
        location,
        authorId: auth.currentUser ? auth.currentUser.uid : "anonymous",
        authorName: auth.currentUser ? auth.currentUser.displayName : "Guest Explorer",
        createdAt: serverTimestamp(),
      });

      alert("✨ Success! Your adventure has been published.");
      navigate('/blog'); 

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to publish blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <FormContainer>
        <Title>Share Your Journey</Title>
        <form onSubmit={handleSubmit}>
          
          <InputGroup>
            <Label>Blog Title</Label>
            <Input 
              type="text" 
              placeholder="e.g. My Trek to Valley of Flowers" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputGroup>

          <Row>
            <InputGroup>
              <Label>Location / Region</Label>
              <Input 
                type="text" 
                placeholder="e.g. Chamoli, Uttarakhand" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Technical">Technical</option>
              </Select>
            </InputGroup>
          </Row>

          <Row>
            <InputGroup>
              <Label>Total Distance (km)</Label>
              <Input 
                type="number" 
                placeholder="e.g. 18" 
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Max Altitude (ft/m)</Label>
              <Input 
                type="text" 
                placeholder="e.g. 12,500 ft" 
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
              />
            </InputGroup>
          </Row>

          <InputGroup>
            <Label>Best Season to Visit</Label>
            <Input 
              type="text" 
              placeholder="e.g. June to September" 
              value={bestSeason}
              onChange={(e) => setBestSeason(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Short Summary (Teaser)</Label>
            <Input 
              type="text" 
              placeholder="Brief description for the card..." 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={150}
            />
          </InputGroup>

          <InputGroup>
            <Label>Detailed Story & Experience</Label>
            <TextArea 
              placeholder="Tell us everything! The trail, the views, the challenges..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Upload Cover Image</Label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              style={{ padding: '10px', background: 'transparent', border: 'none' }}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Adventure"}
          </SubmitButton>

        </form>
      </FormContainer>
    </Page>
  );
};

export default CreateBlog;