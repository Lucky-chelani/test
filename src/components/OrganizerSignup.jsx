import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// Added specific icons for fields to enhance UI
import { 
  FaMountain, FaUserShield, FaUser, FaEnvelope, 
  FaLock, FaCalendarAlt, FaGlobe, FaBriefcase, 
  FaAlignLeft, FaArrowLeft 
} from 'react-icons/fa';

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Styled Components ---

const Page = styled.div`
  background: 
    linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%),
    url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  font-family: 'Inter', sans-serif;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px; /* Slightly wider for better breathing room */
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 48px;
  position: relative;
  z-index: 10;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  margin: 20px auto;

  @media (max-width: 640px) {
    padding: 32px 24px;
    width: 95%;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.3);
  animation: ${float} 6s ease-in-out infinite;

  svg {
    font-size: 32px;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #94A3B8;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  svg {
    color: #4F46E5;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #E2E8F0;
  margin-left: 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  /* Icon inside input */
  svg {
    position: absolute;
    left: 16px;
    color: #64748B;
    font-size: 1rem;
    transition: color 0.3s ease;
    z-index: 1;
  }

  /* Change icon color on focus */
  &:focus-within svg {
    color: #4F46E5;
  }
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 16px 16px 48px; /* Extra padding for icon */
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &::placeholder {
    color: #475569;
  }

  &:focus {
    background: rgba(15, 23, 42, 0.9);
    border-color: #4F46E5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  }

  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 16px 16px 48px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: #475569;
  }

  &:focus {
    background: rgba(15, 23, 42, 0.9);
    border-color: #4F46E5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #4361EE, #7C3AED, #4361EE);
  background-size: 200% 100%;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 25px -5px rgba(67, 97, 238, 0.4);
  animation: ${shine} 4s infinite linear;
  
  &:hover {
    background-position: 100% 0;
    transform: translateY(-2px);
    box-shadow: 0 15px 35px -5px rgba(67, 97, 238, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 24px;
  transition: color 0.2s;
  padding: 0;

  &:hover {
    color: #fff;
  }
`;

const ErrorBanner = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: #FCA5A5;
  padding: 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 20px;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const OrganizerSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Organizer specific fields
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');
  const [organizationWebsite, setOrganizationWebsite] = useState('');
  const [experience, setExperience] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !dob || !organizationName) {
      setError("Please fill in all required fields marked with *");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Age Check
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
      setError("You must be at least 18 years old to register as an organizer.");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Store user info
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        dob: dob,
        createdAt: new Date().toISOString(),
        authProvider: 'email',
        role: 'organizer',
        organizationDetails: {
          name: organizationName,
          description: organizationDescription || '',
          website: organizationWebsite || '',
          experience: experience || '',
          verified: false,
          createdAt: new Date().toISOString()
        }
      });
      
      // Store organization info
      await setDoc(doc(db, "organizations", user.uid), {
        uid: user.uid,
        name: organizationName,
        description: organizationDescription || '',
        website: organizationWebsite || '',
        experience: experience || '',
        createdAt: new Date().toISOString(),
        adminId: user.uid,
        verified: false,
        members: [user.uid]
      });
      
      setLoading(false);
      navigate('/organizer/treks');
      
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError(error.message.replace('Firebase: ', ''));
    }
  };

  return (
    <Page>
      {loading && (
        <LoadingOverlay>
          <IconWrapper style={{ width: 60, height: 60 }}>
            <FaMountain />
          </IconWrapper>
          <p style={{ color: 'white', marginTop: 20 }}>Setting up your organization...</p>
        </LoadingOverlay>
      )}
      
      <Container>
        <BackButton onClick={() => navigate('/signup')}>
          <FaArrowLeft /> Back to options
        </BackButton>
        
        <Header>
          <IconWrapper>
            <FaMountain />
          </IconWrapper>
          <Title>Partner With Us</Title>
          <Subtitle>Create your organizer account to start listing treks and managing adventures.</Subtitle>
        </Header>
        
        {error && <ErrorBanner>{error}</ErrorBanner>}
        
        <Form onSubmit={handleSubmit}>
          {/* PERSONAL INFO SECTION */}
          <SectionHeader>
            <FaUser /> <h3>Personal Information</h3>
          </SectionHeader>

          <InputGroup>
            <Label htmlFor="name">Full Name *</Label>
            <InputWrapper>
              <FaUser />
              <Input 
                id="name"
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="email">Email Address *</Label>
            <InputWrapper>
              <FaEnvelope />
              <Input 
                id="email"
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="dob">Date of Birth *</Label>
            <InputWrapper>
              <FaCalendarAlt />
              <Input 
                id="dob"
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </InputWrapper>
          </InputGroup>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <InputGroup>
              <Label htmlFor="password">Password *</Label>
              <InputWrapper>
                <FaLock />
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputWrapper>
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm *</Label>
              <InputWrapper>
                <FaLock />
                <Input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputWrapper>
            </InputGroup>
          </div>

          {/* ORGANIZATION INFO SECTION */}
          <SectionHeader style={{ marginTop: '20px' }}>
            <FaMountain /> <h3>Organization Details</h3>
          </SectionHeader>
            
          <InputGroup>
            <Label htmlFor="organizationName">Organization Name *</Label>
            <InputWrapper>
              <FaMountain />
              <Input 
                id="organizationName"
                placeholder="Himalayan Trekkers Co." 
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="organizationDescription">Description</Label>
            <InputWrapper>
              <FaAlignLeft style={{ top: '16px' }} />
              <TextArea 
                id="organizationDescription"
                placeholder="Briefly describe your company's mission and expertise..." 
                value={organizationDescription}
                onChange={(e) => setOrganizationDescription(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="organizationWebsite">Website (Optional)</Label>
            <InputWrapper>
              <FaGlobe />
              <Input 
                id="organizationWebsite"
                type="url" 
                placeholder="https://yourwebsite.com" 
                value={organizationWebsite}
                onChange={(e) => setOrganizationWebsite(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="experience">Experience Level (Optional)</Label>
            <InputWrapper>
              <FaBriefcase />
              <Input 
                id="experience"
                placeholder="e.g. 5+ Years, Certified Guides" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (
              <><FaUserShield /> Register Organization</>
            )}
          </Button>
        </Form>
      </Container>
    </Page>
  );
};

export default OrganizerSignup;