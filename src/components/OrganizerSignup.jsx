import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaMountain, FaUserShield, FaCheckCircle } from 'react-icons/fa';

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const progressPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(66, 160, 75, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(66, 160, 75, 0);
  }
`;

// Styled Components
const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(20, 30, 48, 0.92) 0%, rgba(36, 59, 85, 0.9) 100%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding-top: 80px;
  }
  
  @media (max-width: 480px) {
    padding-top: 70px;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 500px;
  background-color: rgba(20, 30, 48, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 20px;
  animation: ${fadeInUp} 0.6s ease-out;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    width: 90%;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 16px;
    width: 95%;
    margin: 0 10px;
    border-radius: 12px;
  }
`;

const Title = styled.h2`
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.2rem;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  
  span {
    display: block;
    font-size: 1.2rem;
    margin-top: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
  }
  
  @media (max-width: 768px) {
    font-size: 1.9rem;
    margin-bottom: 24px;
    
    span {
      font-size: 1.1rem;
      margin-top: 8px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 20px;
    
    span {
      font-size: 1rem;
      margin-top: 6px;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-left: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 14px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.95rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.9rem;
    border-radius: 6px;
  }
`;

const TextArea = styled.textarea`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 14px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(67, 97, 238, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #656565;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 107, 0.2);
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 30, 48, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ProgressCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  animation: ${progressPulse} 2s infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: rgba(20, 30, 48, 0.95);
  }
  
  svg {
    position: relative;
    z-index: 2;
    font-size: 30px;
    color: #fff;
    animation: ${float} 2s infinite ease-in-out;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #fff;
  margin-top: 10px;
  font-weight: 500;
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  &::before {
    margin-right: 10px;
  }
  
  &::after {
    margin-left: 10px;
  }
  
  span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    padding: 0 10px;
  }
`;

const InfoBox = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  border: 1px solid rgba(76, 201, 240, 0.3);
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }
  
  ul {
    margin-top: 10px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.9rem;
    }
  }
`;

const OrganizationSection = styled.div`
  background-color: rgba(67, 97, 238, 0.15);
  border-radius: 10px;
  padding: 20px;
  margin: 15px 0;
  border: 1px solid rgba(67, 97, 238, 0.3);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #4361EE;
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  margin-bottom: 20px;
  
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
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
    
    // Form validation
    if (!name || !email || !password || !confirmPassword || !dob || !organizationName) {
      setError("All required fields must be filled");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Date validation - must be 18+ years old
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      setError("You must be at least 18 years old to register");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: name,
      });
      
      // Create Firestore user document with organizer role and organization details
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        dob: dob,
        createdAt: new Date().toISOString(),
        authProvider: 'email',
        role: 'organizer', // Set role as organizer
        organizationDetails: {
          name: organizationName,
          description: organizationDescription || '',
          website: organizationWebsite || '',
          experience: experience || '',
          verified: false,
          createdAt: new Date().toISOString()
        }
      });
      
      // Create an empty organization document as well for future use
      await setDoc(doc(db, "organizations", user.uid), {
        uid: user.uid,
        name: organizationName,
        description: organizationDescription || '',
        website: organizationWebsite || '',
        experience: experience || '',
        createdAt: new Date().toISOString(),
        adminId: user.uid,
        totalTreks: 0,
        completedTreks: 0,
        upcomingTreks: 0,
        verified: false,
        members: [user.uid]
      });
      
      setLoading(false);
      // Redirect to the organizer dashboard
      navigate('/organizer/treks');
      
    } catch (error) {
      setLoading(false);
      
      if (error.code === 'auth/email-already-in-use') {
        setError("Email address is already in use");
      } else if (error.code === 'auth/invalid-email') {
        setError("Invalid email address format");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak");
      } else {
        console.error("Error during signup:", error);
        setError(`Registration failed: ${error.message}`);
      }
    }
  };

  return (
    <Page>
      {loading && (
        <LoadingOverlay>
          <ProgressCircle>
            <FaMountain />
          </ProgressCircle>
          <LoadingText>Creating your organizer account...</LoadingText>
        </LoadingOverlay>
      )}
      
      <Container>
        <BackLink onClick={() => navigate('/signup')}>
          &larr; Back to standard signup
        </BackLink>
        
        <Title>
          Trek Organizer Signup
          <span>Register to create and manage your treks</span>
        </Title>
        
        <InfoBox>
          <p>As a trek organizer, you'll be able to:</p>
          <ul>
            <li>Create and list your treks on our platform</li>
            <li>Manage booking requests</li>
            <li>Track participant statistics</li>
            <li>Build your organization's profile</li>
          </ul>
          <p>Your account will be reviewed for verification after signup.</p>
        </InfoBox>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              type="text" 
              id="name"
              placeholder="Enter your full name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              type="email" 
              id="email"
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input 
              type="date" 
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password *</Label>
            <Input 
              type="password" 
              id="password"
              placeholder="Create a strong password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input 
              type="password" 
              id="confirmPassword"
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          <OrganizationSection>
            <SectionTitle>
              <FaMountain /> Organization Details
            </SectionTitle>
            
            <InputGroup>
              <Label htmlFor="organizationName">Organization Name *</Label>
              <Input 
                type="text" 
                id="organizationName"
                placeholder="Your trek company or organization name" 
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="organizationDescription">Description</Label>
              <TextArea 
                id="organizationDescription"
                placeholder="Tell us about your organization, its history and expertise..." 
                value={organizationDescription}
                onChange={(e) => setOrganizationDescription(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="organizationWebsite">Website (Optional)</Label>
              <Input 
                type="url" 
                id="organizationWebsite"
                placeholder="https://yourwebsite.com" 
                value={organizationWebsite}
                onChange={(e) => setOrganizationWebsite(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="experience">Experience Level (Optional)</Label>
              <Input 
                type="text" 
                id="experience"
                placeholder="Years of experience, qualification, certifications" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </InputGroup>
          </OrganizationSection>
          
          <Button type="submit" disabled={loading}>
            <FaUserShield /> Register as Trek Organizer
          </Button>
        </Form>
      </Container>
    </Page>
  );
};

export default OrganizerSignup;
