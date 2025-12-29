import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { FaMountain, FaGoogle } from 'react-icons/fa';
import { FiAlertTriangle, FiLogIn, FiMail, FiLock } from 'react-icons/fi';

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
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
    linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(10, 10, 10, 0.96) 100%),
    url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 10;
`;

const Form = styled.form`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 480px) {
    padding: 32px 24px;
    border-radius: 20px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 8px;
`;

const LogoContainer = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
  animation: ${float} 4s ease-in-out infinite;
  
  svg {
    font-size: 32px;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  }
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #94A3B8;
  margin: 0;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
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

  svg {
    position: absolute;
    left: 16px;
    color: #94A3B8;
    font-size: 1.1rem;
    transition: color 0.2s;
  }

  &:focus-within svg {
    color: #4CC9F0;
  }
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px 14px 48px; /* Left padding for icon */
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: #64748B;
  }

  &:focus {
    background: rgba(15, 23, 42, 0.8);
    border-color: #4CC9F0;
    box-shadow: 0 0 0 4px rgba(76, 201, 240, 0.1);
  }

  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const Button = styled.button`
  position: relative;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;

  /* Primary Button Style */
  ${props => !props.google && css`
    background: linear-gradient(90deg, #4361EE, #3A0CA3, #4361EE);
    background-size: 200% 100%;
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
    animation: ${shine} 4s infinite linear;

    &:hover {
      background-position: 100% 0;
      box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
      transform: translateY(-2px);
    }
  `}

  /* Google Button Style */
  ${props => props.google && css`
    background: rgba(255, 255, 255, 0.95);
    color: #1e293b;
    border: none;
    
    &:hover {
      background: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #64748B;
  font-size: 0.875rem;
  margin: 8px 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ErrorBanner = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: #FCA5A5;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeInUp} 0.3s ease-out;

  svg {
    color: #EF4444;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 8px;
  color: #94A3B8;
  font-size: 0.95rem;

  a {
    color: #4CC9F0;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    margin-left: 5px;

    &:hover {
      color: #38bdf8;
      text-decoration: underline;
    }
  }
`;

const HelperLink = styled(Link)`
  display: block;
  margin-top: 12px;
  font-size: 0.85rem;
  color: #64748B !important;
  
  &:hover {
    color: #94A3B8 !important;
  }
`;

// --- Component ---

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'organizer' || userDoc.data().role === 'admin')) {
        navigate('/organizer/dashboard');
      } else {
        await auth.signOut();
        setError('Access denied. This account is not registered as an organizer.');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError('Invalid credentials. Please check your email and password.');
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
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === 'organizer' || userDoc.data().role === 'admin')) {
        navigate('/organizer/dashboard');
      } else {
        await auth.signOut();
        setError('This Google account does not have organizer privileges.');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      setError('Google sign-in failed. Please try again.');
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
            <Subtitle>Manage your treks & bookings</Subtitle>
          </HeaderSection>
          
          {error && (
            <ErrorBanner>
              <FiAlertTriangle />
              {error}
            </ErrorBanner>
          )}
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <FiMail />
              <Input 
                id="email"
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <FiLock />
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              'Logging in...' 
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </Button>
          
          <Divider>or continue with</Divider>
          
          <Button type="button" google onClick={handleGoogleLogin} disabled={loading}>
            <FaGoogle />
            Google
          </Button>

          <Footer>
            Don't have an account? 
            <Link to="/organizer-signup">Join as Organizer</Link>
            <HelperLink to="/login">Looking for User Login?</HelperLink>
          </Footer>
        </Form>
      </FormContainer>
    </Page>
  );
};

export default OrganizerTrekLogin;