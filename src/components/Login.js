import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png'; // Ensure this path is correct
import { auth } from '../firebase'; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";

// Styled components (assuming they are defined above as in your provided code)
// Page, Form, Title, WelcomeText, SubText, SocialButtons, SocialButton, SocialIcon,
// Divider, Line, InputGroup, Input, InputIcon, PasswordDots, Dot, RememberMe,
// Checkbox, LoginButton, SignupLink

// ... (Your existing styled-components code from Login.js should be here)
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

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;
const Form = styled.form`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 60px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 40px 32px;
  width: 100%;
  max-width: 804px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 60px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 860px) {
    max-width: 90%;
    padding: 32px 24px;
    border-radius: 40px;
    margin: 40px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 16px;
    border-radius: 30px;
    margin: 30px 16px;
    gap: 18px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    text-align: center;
  }
`;
const WelcomeText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const SubText = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    text-align: center;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 33px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 14px;
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 37px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  min-width: 160px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
      padding: 16px 20px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const SocialIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
  color: rgba(255, 255, 255, 0.6);
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 20px 20px 20px 73px;
  border: 1px solid rgba(255, 255, 255, 0.23);
  border-radius: 15px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #42A04B;
    box-shadow: 0 0 0 2px rgba(66, 160, 75, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 18px 18px 18px 60px;
    font-size: 0.95rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
      padding: 16px 16px 16px 50px;
  }
`;

const InputIcon = styled.img`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  opacity: 0.4;
`;

const PasswordDots = styled.div`
  display: flex;
  gap: 5px;
  margin-left: 20px;
  position: absolute; // Added for better positioning if needed
  right: 20px;      // Added for better positioning
  top: 50%;
  transform: translateY(-50%);
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #D9D9D9;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 24px 0;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px; // Adjusted for better visual consistency
  height: 20px;
  accent-color: #42A04B;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255,255,255,0.1);
  &:checked {
    background-color: #42A04B;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 20px;
  background: #42A04B;
  color: #fff;
  border: none;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(66, 160, 75, 0.2);

  &:hover {
    background: #358A3D;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(66, 160, 75, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(66, 160, 75, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 18px;
    font-size: 1.1rem;
    border-radius: 12px;
      }
  
  @media (max-width: 480px) {
    padding: 16px;
    font-size: 1rem;
  }
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #fff;
  font-size: 1.1rem;

  a {
    color: #42A04B;
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d; /* Red color for errors */
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Firebase handles session persistence
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate('/profile'); // Navigate to profile page after successful login
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to log in. Please try again later.');
      }
      console.error('Login failed:', err.message, err.code);
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError('');
    // Implement Firebase social login (e.g., GoogleAuthProvider, FacebookAuthProvider)
    console.log(`Logging in with ${provider}`);
    // Example for Google (you'd need to import GoogleAuthProvider from 'firebase/auth'):
    // const socialProvider = new GoogleAuthProvider();
    // signInWithPopup(auth, socialProvider)
    //   .then((result) => navigate('/profile'))
    //   .catch((err) => {
    //      setError(err.message);
    //      console.error(`${provider} login failed:`, err);
    //   });
  };

  return (
    <Page>
      <Navbar active="login" />
      <Form onSubmit={handleSubmit}>
        <Title>Log In</Title>
        <WelcomeText>Welcome back, Explorer!</WelcomeText>
        <SubText>Continue your adventure with Trovia</SubText>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SocialButtons>
          <SocialButton type="button" onClick={() => handleSocialLogin('Google')}>
            <SocialIcon src="/google-icon.png" alt="Google" /> {/* Ensure you have these icons */}
            <span>Google</span>
          </SocialButton>
          <SocialButton type="button" onClick={() => handleSocialLogin('Apple')}>
            <SocialIcon src="/apple-icon.png" alt="Apple" /> {/* Ensure you have these icons */}
            <span>Apple</span>
          </SocialButton>
          <SocialButton type="button" onClick={() => handleSocialLogin('Facebook')}>
            <SocialIcon src="/facebook-icon.png" alt="Facebook" /> {/* Ensure you have these icons */}
            <span>Facebook</span>
          </SocialButton>
        </SocialButtons>

        <Divider>
          <Line />
          <span>or continue with email</span>
          <Line />
        </Divider>

        <InputGroup>
          <InputIcon src="/mail-icon.png" alt="Email" /> {/* Ensure you have these icons */}
          <Input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com" 
            required
          />
        </InputGroup>

        <InputGroup>
          <InputIcon src="/lock-icon.png" alt="Password" /> {/* Ensure you have these icons */}
          <Input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••" 
            required
          />
          {/* PasswordDots can be removed or kept for styling, Firebase handles password visibility */}
          {/* 
          <PasswordDots>
            {[...Array(8)].map((_, i) => (
              <Dot key={i} />
            ))}
          </PasswordDots> 
          */}
        </InputGroup>

        <RememberMe>
          <Checkbox 
            type="checkbox" 
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </RememberMe>

        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </LoginButton>

        <SignupLink>
          New here? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Join Now</a>
        </SignupLink>
      </Form>
    </Page>
  );
};

export default Login;