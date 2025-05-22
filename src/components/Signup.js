import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import mapPattern from '../assets/images/map-pattren.png'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Import Firebase auth and db
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth"; // Added social providers
import { doc, setDoc, getDoc } from "firebase/firestore"; // Added getDoc

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff; /* Changed for better visibility on dark background */
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 60px;
  width: 100%;
  max-width: 804px;
  padding: 73px 42px;
  position: relative;
  margin-top: 100px; /* Adjusted margin */
  margin-bottom: 60px;
  border: 1px solid rgba(255, 255, 255, 0.2);
   @media (max-width: 860px) {
    max-width: 90%;
    padding: 50px 30px;
    margin-top: 80px;
  }
   @media (max-width: 480px) {
    padding: 30px 20px;
    margin-top: 60px;
    border-radius: 40px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #fff;
  text-align: center;
   @media (max-width: 768px) {
    font-size: 2rem;
  }
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.79);
  margin-bottom: 40px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px auto; /* Center progress */
  position: relative;
  max-width: 500px; /* Limit width */
`;

const ProgressStep = styled.div`
  width: 40px; /* Adjusted size */
  height: 40px; /* Adjusted size */
  border-radius: 50%;
  background: ${props => props.active ? '#42A04B' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.56)'};
  font-weight: 600;
  position: relative;
  z-index: 2;
  font-size: 0.9rem; /* Adjusted font size */
`;

const ProgressLine = styled.div`
  position: absolute;
  height: 2px; /* Made line thicker */
  background: ${props => props.active ? '#42A04B' : 'rgba(255, 255, 255, 0.5)'};
  flex-grow: 1;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 5px; 
  &:first-of-type {
    left: 20px; 
    right: calc(50% + 20px);
  }
   &:last-of-type {
    right: 20px; 
    left: calc(50% + 20px);
  }
`;


const SocialButtons = styled.div`
  display: flex;
  gap: 20px; /* Adjusted gap */
  margin-bottom: 40px;
  justify-content: center;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center; /* Center content */
  gap: 10px;
  padding: 15px 25px; /* Adjusted padding */
  border: 1px solid rgba(255, 255, 255, 0.44);
  border-radius: 15px; /* Adjusted border-radius */
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.9rem; /* Adjusted font size */
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 150px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px; /* Increased margin */
  font-size: 0.9rem; /* Adjusted font size */
  color: #fff;
`;

const InputContainer = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.23);
  border-radius: 12px; /* Adjusted border-radius */
  height: 55px; /* Adjusted height */
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.05); /* Slightly less opaque */
  &:focus-within {
    border-color: #42A04B;
    box-shadow: 0 0 0 2px rgba(66, 160, 75, 0.2);
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 1rem;
  color: #fff;
  width: 100%;
  padding-left: 0;
  background: transparent;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.44);
  }
`;

const PasswordStrength = styled.div`
  margin-top: 8px; /* Adjusted margin */
  padding: 0 5px; /* Adjusted padding */
`;

const StrengthBar = styled.div`
  height: 6px; /* Adjusted height */
  background: #E33629; /* Default to weak */
  border-radius: 35px;
  margin-bottom: 6px; /* Adjusted margin */
`;

const StrengthText = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.8rem; /* Adjusted font size */
`;

const TwoFactorContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px 20px;
  margin: 25px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TwoFactorText = styled.div`
  h3 {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8); /* Brighter text */
    margin-bottom: 5px;
  }
  p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.64);
  }
`;

const Toggle = styled.div`
  width: 50px; /* Adjusted size */
  height: 26px; /* Adjusted size */
  background: ${props => props.active ? '#42A04B' : 'rgba(255,255,255,0.3)'};
  border-radius: 24px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px; /* Adjusted size */
    height: 20px; /* Adjusted size */
    background: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
    transform: translateX(${props => props.active ? '24px' : '0'}); /* Adjusted transform */
  }
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Adjusted gap */
  margin: 25px 0;
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  accent-color: #42A04B; /* Style checkbox color */
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255,255,255,0.1);
  &:checked {
    background-color: #42A04B;
  }
`;

const TermsText = styled.label` /* Changed to label for better accessibility */
  font-size: 0.9rem;
  color: #fff;
  cursor: pointer;
  a {
    color: #42A04B;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupButton = styled.button`
  width: 100%;
  height: 55px; /* Adjusted height */
  background: #42A04B;
  border: none;
  border-radius: 12px; /* Adjusted border-radius */
  color: #fff;
  font-size: 1.1rem; /* Adjusted font size */
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0;
  transition: background-color 0.2s, opacity 0.2s;
  &:hover {
    background: #358a3d;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  font-size: 1rem; /* Adjusted font size */
  color: #fff;
  margin-top: 30px;
  
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

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // For multi-step form, if needed

  const handleSocialLogin = async (providerName) => {
    setError('');
    setLoading(true);
    let provider;
    if (providerName === 'Google') {
      provider = new GoogleAuthProvider();
    } else if (providerName === 'Facebook') {
      provider = new FacebookAuthProvider();
    } else {
      setError('Social provider not supported yet.');
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user data already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // New user via social login, save their details
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || 'Social User', // Use display name from provider
          email: user.email,
          // DOB might not be available from all social providers
          // dob: '', 
          createdAt: new Date().toISOString(),
          authProvider: providerName.toLowerCase(),
        });
      }
      setLoading(false);
      navigate('/'); // Navigate to home screen
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error(`${providerName} signup/login failed:`, err);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        dob: dob,
        createdAt: new Date().toISOString(),
        twoFactorEnabled: twoFactorEnabled, 
      });

      setLoading(false);
      navigate('/'); // Navigate to home screen after successful signup
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please try a different email or log in.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger password.');
      } else {
        setError(err.message || 'Failed to create an account. Please try again.');
      }
      setLoading(false);
      console.error("Signup failed:", err);
    }
  };

  return (
    <Page>
      <Navbar active="signup" />
      <Container>
        <Title>Join the Tribe, Start Your Adventure!</Title>
        <Subtitle>Create your account in just a few steps</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ProgressContainer>
          <ProgressStep active={currentStep >= 1}>1</ProgressStep>
          <ProgressLine active={currentStep > 1} />
          <ProgressStep active={currentStep >= 2}>2</ProgressStep>
          <ProgressLine active={currentStep > 2} />
          <ProgressStep active={currentStep >= 3}>3</ProgressStep>
        </ProgressContainer>

        <SocialButtons>
          <SocialButton type="button" onClick={() => handleSocialLogin('Google')}>
            {/* Add Google Icon here if you have one */}
            Google
          </SocialButton>
          <SocialButton type="button" onClick={() => handleSocialLogin('Facebook')}>
            {/* Add Facebook Icon here */}
            Facebook
          </SocialButton>
          {/* Apple login requires more setup and is often handled differently */}
          {/* <SocialButton type="button" onClick={() => handleSocialLogin('Apple')}>
            Apple
          </SocialButton> */}
        </SocialButtons>
        
        <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)', margin: '20px 0'}}>or sign up with email</p>

        <form onSubmit={handleSignup}>
          <InputGroup>
            <Label htmlFor="name-input">Name</Label>
            <InputContainer>
              <Input 
                id="name-input"
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email-input">Email</Label>
            <InputContainer>
              <Input 
                id="email-input"
                type="email" 
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="dob-input">Date of Birth</Label>
            <InputContainer>
              <Input 
                id="dob-input"
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password-input">Password</Label>
            <InputContainer>
              <Input 
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputContainer>
            <PasswordStrength>
              <StrengthBar style={{ width: `${Math.min(password.length * 10, 100)}%`, background: password.length < 6 ? '#E33629' : password.length < 10 ? '#FFD700' : '#42A04B' }} />
              <StrengthText>Use 8+ characters with a mix of letters, numbers & symbols.</StrengthText>
            </PasswordStrength>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirm-password-input">Confirm Password</Label>
            <InputContainer>
              <Input 
                id="confirm-password-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </InputContainer>
          </InputGroup>

          <TwoFactorContainer>
            <TwoFactorText>
              <h3>Enable 2-Factor Authentication</h3>
              <p>Add an extra layer of security to your account (optional)</p>
            </TwoFactorText>
            <Toggle 
              active={twoFactorEnabled}
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />
          </TwoFactorContainer>

          <TermsContainer>
            <CheckboxInput 
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <TermsText htmlFor="terms-checkbox">
              I agree to Trovia's <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </TermsText>
          </TermsContainer>

          <SignupButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Start your journey'}
          </SignupButton>
        </form>

        <LoginLink>
          Already a member? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log In</a>
        </LoginLink>
      </Container>
    </Page>
  );
};

export default Signup;