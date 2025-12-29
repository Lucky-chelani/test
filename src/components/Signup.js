import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaArrowRight } from "react-icons/fa";

// Animations (Kept Original)
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components

const Page = styled.div`
  /* Original Dark Background */
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  background-attachment: fixed; /* Keeps background steady on scroll */
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden; /* RESPONSIVE FIX: Prevents horizontal scroll */
  width: 100%;

  /* Original Green Glow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(66, 160, 75, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const FormContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  z-index: 1;
  width: 100%; /* Ensures container doesn't overflow */
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  /* Original Glassmorphism Style */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 16px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  /* Dimensions */
  width: 100%;
  max-width: 520px;
  padding: 48px 40px;
  margin: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  }

  @media (max-width: 860px) {
    padding: 40px 32px;
  }

  /* RESPONSIVE FIX: Better padding for mobile */
  @media (max-width: 480px) {
    padding: 32px 20px;
    margin: 20px 16px; 
    border-radius: 24px;
    max-width: 90%; 
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  /* Original Gradient Text */
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #42A04B 0%, #5FBB66 50%, #42A04B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${float} 3s ease-in-out infinite;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
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
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
`;

const GoogleIcon = styled.div`
  width: 20px;
  height: 20px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="%23fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="%23fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="%23fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>') center/contain no-repeat;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
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
  padding: 18px 20px 18px 56px;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #fff;
  background: transparent;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &[type="date"] {
    color-scheme: dark;
    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      opacity: 0.7;
    }
  }

  @media (max-width: 768px) {
    padding: 16px 18px 16px 52px;
    /* RESPONSIVE FIX: Prevent iOS Zoom by setting font-size to 16px on mobile */
    font-size: 16px; 
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.6;
  transition: opacity 0.3s;
  z-index: 1;

  ${InputContainer}:focus-within & {
    opacity: 1;
  }
`;

// Helper Icons (unchanged)
const UserIcon = styled(InputIcon)`
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>') center/contain no-repeat;
`;
const EmailIcon = styled(InputIcon)`
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>') center/contain no-repeat;
`;
const CalendarIcon = styled(InputIcon)`
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>') center/contain no-repeat;
`;
const LockIcon = styled(InputIcon)`
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>') center/contain no-repeat;
`;

const PasswordStrength = styled.div`
  margin-top: 12px;
  padding: 0 4px;
`;

const StrengthBarContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

const StrengthSegment = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${props => props.active ? 
    (props.strength === 'weak' ? '#E33629' : 
     props.strength === 'medium' ? '#FFD700' : '#42A04B') : 
    'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
`;

const StrengthText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  line-height: 1.4;
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 24px 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #42A04B;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
`;

const TermsText = styled.label`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  line-height: 1.5;

  a {
    color: #42A04B;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover { color: #5FBB66; }
  }
`;

const SignupButton = styled.button`
  width: 100%;
  padding: 18px;
  /* Original Green Gradient */
  background: linear-gradient(135deg, #42A04B 0%, #358A3D 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(66, 160, 75, 0.3);
  position: relative;
  overflow: hidden;
  margin: 20px 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(66, 160, 75, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 16px;
    font-size: 1rem;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 24px;

  a {
    color: #42A04B;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    
    &:hover { color: #5FBB66; }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const OrganizerLink = styled.div`
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(67, 97, 238, 0.15);
  border-radius: 10px;
  border: 1px solid rgba(67, 97, 238, 0.3);

  p {
    color: #fff;
    font-size: 0.9rem;
    margin: 0 0 8px 0;
  }

  a {
    color: #4361EE;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    
    &:hover { text-decoration: underline; }
  }
`;

// --- COMPONENT LOGIC (Identical) ---

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: 'weak', segments: 1 };
    if (password.length < 10) return { strength: 'medium', segments: 2 };
    return { strength: 'strong', segments: 3 };
  };

  const passwordStrength = getPasswordStrength(password);

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
      await updateProfile(user, { displayName: name });
      
      try {      
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          dob: dob,
          createdAt: new Date().toISOString(),
          authProvider: 'email',
          role: 'user', 
        });
      } catch (firestoreError) {
        console.error("Firestore Error:", firestoreError);
        setError(`Profile creation error: ${firestoreError.message}.`);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError('');
      navigate('/profile');
    } catch (err) {
      console.error("Signup Error:", err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else {
        setError(`Failed to create an account: ${err.message}.`);
      }
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, "users", user.uid);
      try {
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName || 'Google User',
            email: user.email,
            photoURL: user.photoURL || null,
            createdAt: new Date().toISOString(),
            authProvider: 'google',
            role: 'user',
          });
        }
        setLoading(false);
        setError('');
        navigate('/profile');
      } catch (firestoreError) {
        console.error("Firestore Error:", firestoreError);
        setError(`Profile creation error: ${firestoreError.message}.`);
        setLoading(false);
      }
    } catch (err) {
      console.error('Google signup error:', err.code, err.message);
      setError(`Failed to sign up with Google: ${err.message}.`);
      setLoading(false);
    }
  };

  return (
    <Page>
      <FormContainer>
        <Container>
          <HeaderSection>
            <Title>Join the Adventure!</Title>
            <Subtitle>Create your account and start exploring with Trovia</Subtitle>
          </HeaderSection>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <GoogleButton type="button" onClick={handleGoogleSignup} disabled={loading}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </GoogleButton>

          <Divider>
            <Line />
            <span>or sign up with email</span>
            <Line />
          </Divider>

          <Form onSubmit={handleSignup}>
            <InputGroup>
              <Label htmlFor="name-input">Full Name</Label>
              <InputContainer>
                <Input 
                  id="name-input"
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
                <UserIcon />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email-input">Email Address</Label>
              <InputContainer>
                <Input 
                  id="email-input"
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <EmailIcon />
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
                <CalendarIcon />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password-input">Password</Label>
              <InputContainer>
                <Input 
                  id="password-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <LockIcon />
              </InputContainer>
              {password && (
                <PasswordStrength>
                  <StrengthBarContainer>
                    {[1, 2, 3].map(segment => (
                      <StrengthSegment 
                        key={segment}
                        active={segment <= passwordStrength.segments}
                        strength={passwordStrength.strength}
                      />
                    ))}
                  </StrengthBarContainer>
                  <StrengthText>
                    Use 8+ characters with a mix of letters, numbers & symbols for better security.
                  </StrengthText>
                </PasswordStrength>
              )}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirm-password-input">Confirm Password</Label>
              <InputContainer>
                <Input 
                  id="confirm-password-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <LockIcon />
              </InputContainer>
            </InputGroup>

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

            <SignupButton type="submit" disabled={loading || !termsAccepted}>
              {loading && <LoadingSpinner />}
              {loading ? 'Creating Account...' : 'Start Your Journey'}
            </SignupButton>
          </Form>

          <LoginLink>
            Already a member? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log In</a>
          </LoginLink>
          
          <OrganizerLink>
            <p>Do you run a trek organization?</p>
            <a href="/organizer-signup" onClick={(e) => { e.preventDefault(); navigate('/organizer-signup'); }}>
              Register as a Trek Organizer <FaArrowRight size={12} />
            </a>
          </OrganizerLink>
        </Container>
      </FormContainer>
    </Page>
  );
};

export default Signup;