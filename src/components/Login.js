import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDownFade = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// --- Styled Components ---
const Page = styled.div`
  *, *::before, *::after { box-sizing: border-box; }
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  background-attachment: fixed;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(66, 160, 75, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) { padding-top: 80px; }
`;

const FormContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 16px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  padding: 48px 40px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  margin: 40px 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  }
  
  @media (max-width: 480px) {
    padding: 32px 20px;
    margin: 20px 16px;
    border-radius: 24px;
    max-width: 90%;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 50%, #42A04B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 768px) { font-size: 2rem; }
  @media (max-width: 480px) { font-size: 1.7rem; }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) { font-size: 1rem; }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const GoogleIcon = styled.div`
  width: 20px; height: 20px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="%23fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="%23fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="%23fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>') center/contain no-repeat;
`;

const Divider = styled.div`
  display: flex; align-items: center; gap: 16px; margin: 24px 0;
  color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;
`;

const Line = styled.div`
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:focus-within {
    border-color: #42A04B;
    box-shadow: 0 0 0 3px rgba(66, 160, 75, 0.15);
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 56px 18px 56px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1rem;
  outline: none;

  &::placeholder { color: rgba(255, 255, 255, 0.5); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  
  @media (max-width: 768px) {
    padding: 16px 52px; font-size: 16px;
  }
`;

const InputIcon = styled.div`
  position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
  width: 20px; height: 20px; opacity: 0.6; transition: opacity 0.3s; z-index: 1;

  ${InputContainer}:focus-within & { opacity: 1; }
`;

const TogglePasswordBtn = styled.button`
  position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: rgba(255, 255, 255, 0.6);
  cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;
  transition: color 0.3s; z-index: 2;

  &:hover:not(:disabled) { color: #fff; }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

const EmailIcon = styled(InputIcon)`
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>') center/contain no-repeat;
`;

const LockIcon = styled(InputIcon)`
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>') center/contain no-repeat;
`;

const RememberMeContainer = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px; width: 100%;
`;

const RememberMe = styled.label`
  display: flex; align-items: center; gap: 8px; font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8); cursor: pointer;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px; height: 18px; accent-color: #42A04B; cursor: pointer; border-radius: 4px;
`;

const ForgotPasswordLink = styled.a`
  color: #42A04B; font-size: 0.95rem; text-decoration: none; transition: color 0.3s;
  &:hover { color: #5FBB66; text-decoration: underline; }
`;

const LoginButton = styled.button`
  width: 100%; padding: 18px;
  background: linear-gradient(135deg, #42A04B 0%, #358A3D 100%);
  color: #fff; border: none; border-radius: 16px; font-size: 1.1rem;
  font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(66, 160, 75, 0.3); display: flex; justify-content: center; align-items: center; gap: 10px;

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(66, 160, 75, 0.4); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; background: #333; box-shadow: none; color: #888; }
`;

const SignupLink = styled.p`
  text-align: center; margin-top: 24px; color: rgba(255, 255, 255, 0.8); font-size: 1rem;
  a { color: #42A04B; text-decoration: none; font-weight: 600; transition: all 0.3s;
      &:hover { color: #5FBB66; } }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 77, 77, 0.1); border: 1px solid rgba(255, 77, 77, 0.3);
  border-radius: 12px; padding: 12px 16px; color: #ff6b6b; text-align: center;
  margin-bottom: 20px; font-size: 0.9rem; animation: ${slideDownFade} 0.3s ease-out;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff; border-radius: 50%; animation: spin 1s linear infinite;
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

const OrganizerLinkBox = styled.div`
  text-align: center; margin-top: 16px; padding: 16px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px; width: 100%; max-width: 480px;

  span { color: rgba(255, 255, 255, 0.7); }
  a { color: #42A04B; font-weight: 600; text-decoration: none; margin-left: 8px; transition: color 0.3s;
      &:hover { color: #5FBB66; text-decoration: underline; } }
`;

// --- Component Logic ---
const Login = ({ organizerMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Fault Tolerance: Clean the email input
    const sanitizedEmail = email.trim();
    
    try {
      await signInWithEmailAndPassword(auth, sanitizedEmail, password);
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to log in. Please try again later.');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      // Fault Tolerance: Ignore intentional popup closures
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to log in with Google. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <Page>
      <FormContainer>
        <Form onSubmit={handleSubmit} noValidate>
          <HeaderSection>
            <Title>{organizerMode ? 'Organizer Login' : 'Welcome Back'}</Title>
            <Subtitle>{organizerMode ? 'Sign in to manage your treks.' : 'Log in to continue your adventure.'}</Subtitle>
          </HeaderSection>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <GoogleButton type="button" onClick={handleGoogleLogin} disabled={loading}>
            <GoogleIcon />
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </GoogleButton>

          <Divider>
            <Line />
            <span>or log in with email</span>
            <Line />
          </Divider>

          <InputGroup>
            <InputContainer>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com" 
                disabled={loading}
                required
              />
              <EmailIcon />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <InputContainer>
              <Input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                disabled={loading}
                required
              />
              <LockIcon />
              <TogglePasswordBtn 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </TogglePasswordBtn>
            </InputContainer>
          </InputGroup>

          <RememberMeContainer>
            <RememberMe>
              <Checkbox 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </RememberMe>
            <ForgotPasswordLink href="/forgot-password" onClick={(e) => { e.preventDefault(); !loading && navigate('/forgot-password'); }}>
              Forgot Password?
            </ForgotPasswordLink>
          </RememberMeContainer>

          <LoginButton type="submit" disabled={loading || !email || !password}>
            {loading && <LoadingSpinner />}
            {loading ? 'Logging In...' : 'Log In'}
          </LoginButton>

          <SignupLink>
            New here? <a href="/signup" onClick={(e) => { e.preventDefault(); !loading && navigate('/signup'); }}>Join Now</a>
          </SignupLink>
        </Form>

        {!organizerMode && (
          <OrganizerLinkBox>
            <span>Run a trekking business?</span>
            <Link to="/organizer-trek-login">Organizer Login</Link>
          </OrganizerLinkBox>
        )}
      </FormContainer>
    </Page>
  );
};

export default Login;