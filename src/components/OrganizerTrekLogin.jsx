import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { FaMountain, FaGoogle } from 'react-icons/fa';
import { FiAlertTriangle, FiLogIn } from 'react-icons/fi';

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

// Styled Components
const Page = styled.div`
  background: linear-gradient(135deg, rgba(10, 20, 40, 0.9), rgba(0, 0, 0, 0.9)), url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding-top: 80px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding-top: 70px;
    padding-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    padding-top: 60px;
    padding-bottom: 20px;
  }
`;

const FormContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  margin: 0 20px;
`;

const Form = styled.form`
  background: rgba(30, 40, 60, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 16px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    padding: 32px 24px;
    gap: 20px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  background: linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
  animation: ${float} 3s ease-in-out infinite;
  
  svg {
    font-size: 32px;
    color: white;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #4CC9F0 0%, #4361EE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #b2c2d6;
  margin: 0 0 12px 0;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px 16px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: #4361EE;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled.button`
  background: ${props => props.google ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%)'};
  color: #fff;
  border: ${props => props.google ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
  border-radius: 8px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: ${props => props.google ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #3A56DD 0%, #2A0B93 100%)'};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  margin: 8px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 10px;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 86, 86, 0.15);
  border-left: 4px solid #FF5656;
  color: #ffd0d0;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #FF5656;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const BottomLinks = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
`;

const StyledLink = styled(Link)`
  color: #4CC9F0;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    color: #7DD8F8;
    text-decoration: underline;
  }
`;

const OrganizerTrekLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if the user is an organizer
      const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'organizer' || userDoc.data().role === 'admin')) {
        // User is an organizer or admin, navigate to organizer dashboard
        navigate('/organizer/dashboard');
      } else {
        // User is not an organizer, sign them out and show error
        await auth.signOut();
        setError('You do not have organizer privileges. Please contact support if you believe this is an error.');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      let errorMessage = 'Failed to login. Please check your credentials and try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if the Google user is an organizer
      const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'organizer' || userDoc.data().role === 'admin')) {
        // User is an organizer, navigate to organizer dashboard
        navigate('/organizer/dashboard');
      } else {
        // User is not an organizer, sign them out and show error
        await auth.signOut();
        setError('This Google account does not have organizer privileges. Please contact support.');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      setError('Failed to login with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Page>
      <FormContainer>
        <Form onSubmit={handleLogin}>
          <HeaderSection>
            <LogoContainer>
              <FaMountain />
            </LogoContainer>
            <Title>Organizer Login</Title>
            <Subtitle>Sign in to manage your treks and bookings</Subtitle>
          </HeaderSection>
          
          {error && (
            <ErrorMessage>
              <FiAlertTriangle />
              {error}
            </ErrorMessage>
          )}
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            <FiLogIn />
            {loading ? 'Logging in...' : 'Login as Organizer'}
          </Button>
          
          <OrDivider>OR</OrDivider>
          
          <Button type="button" google onClick={handleGoogleLogin} disabled={loading}>
            <FaGoogle />
            Login with Google
          </Button>
        </Form>
        
        <BottomLinks>
          <div>Not an organizer yet? <StyledLink to="/organizer-signup">Register as Organizer</StyledLink></div>
          <div style={{ marginTop: '10px' }}>Want to login as regular user? <StyledLink to="/login">Login Here</StyledLink></div>
        </BottomLinks>
      </FormContainer>
    </Page>
  );
};

export default OrganizerTrekLogin;
