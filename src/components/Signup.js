import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import mapPattern from '../assets/images/map-pattren.png';

const Page = styled.div`
  background: #000 url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #000;
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 60px;
  width: 804px;
  padding: 73px 42px;
  position: relative;
  margin-top: 147px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.79);
  margin-bottom: 40px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0;
  position: relative;
`;

const ProgressStep = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${props => props.active ? '#42A04B' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.56)'};
  font-weight: 600;
  position: relative;
  z-index: 2;
`;

const ProgressLine = styled.div`
  position: absolute;
  height: 1px;
  background: ${props => props.active ? '#42A04B' : 'rgba(255, 255, 255, 0.5)'};
  width: 192px;
  top: 50%;
  left: ${props => props.position}px;
  transform: translateY(-50%);
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 33px;
  margin-bottom: 40px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18.5px 37.5px;
  border: 1px solid rgba(255, 255, 255, 0.44);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 1rem;
  color: #fff;
`;

const InputContainer = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.23);
  border-radius: 15px;
  height: 79px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.1);
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
  margin-top: 10px;
  padding: 0 20px;
`;

const StrengthBar = styled.div`
  height: 9px;
  background: #E33629;
  border-radius: 35px;
  margin-bottom: 8px;
`;

const StrengthText = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
`;

const TwoFactorContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TwoFactorText = styled.div`
  h3 {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.66);
    margin-bottom: 7px;
  }
  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.64);
  }
`;

const Toggle = styled.div`
  width: 61px;
  height: 30px;
  background: #E8E8EA;
  border-radius: 24px;
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 24px;
    background: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
    transform: translateX(${props => props.active ? '32px' : '0'});
  }
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 20px 0;
`;

const Checkbox = styled.div`
  width: 22px;
  height: 20px;
  border: 1px solid rgba(0, 0, 0, 0.21);
  border-radius: 4px;
  cursor: pointer;
`;

const TermsText = styled.p`
  font-size: 0.9rem;
  color: #fff;
`;

const SignupButton = styled.button`
  width: 100%;
  height: 79px;
  background: #42A04B;
  border: none;
  border-radius: 15px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0;
`;

const LoginLink = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #fff;
  margin-top: 30px;
  
  a {
    color: #42A04B;
    text-decoration: none;
    font-weight: 600;
  }
`;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <Page>
      <Navbar active="signup" />
      <Container>
        <Title>Join the Tribe, Start Your Adventure!</Title>
        <Subtitle>Create your account in just a few steps</Subtitle>
        
        <ProgressContainer>
          <ProgressStep active>1</ProgressStep>
          <ProgressLine position="100" active />
          <ProgressStep>2</ProgressStep>
          <ProgressLine position="344" />
          <ProgressStep>3</ProgressStep>
        </ProgressContainer>

        <SocialButtons>
          <SocialButton>
            Google
          </SocialButton>
          <SocialButton>
            Apple
          </SocialButton>
          <SocialButton>
            Facebook
          </SocialButton>
        </SocialButtons>

        <InputGroup>
          <Label>Name</Label>
          <InputContainer>
            <Input type="text" placeholder="John Doe" />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <InputContainer>
            <Input type="email" placeholder="your.email@example.com" />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          <InputContainer>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
            />
          </InputContainer>
          <PasswordStrength>
            <StrengthBar />
            <StrengthText>Use 8+ characters with a mix of letters, numbers & symbols</StrengthText>
          </PasswordStrength>
        </InputGroup>

        <InputGroup>
          <Label>Confirm Password</Label>
          <InputContainer>
            <Input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••"
            />
          </InputContainer>
        </InputGroup>

        <TwoFactorContainer>
          <TwoFactorText>
            <h3>Enable 2-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </TwoFactorText>
          <Toggle 
            active={twoFactorEnabled}
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          />
        </TwoFactorContainer>

        <TermsContainer>
          <Checkbox onClick={() => setTermsAccepted(!termsAccepted)} />
          <TermsText>I agree to Trovia's Terms of Service and Privacy Policy</TermsText>
        </TermsContainer>

        <SignupButton>Start your journey</SignupButton>

        <LoginLink>
          Already a member? <a href="/login">Log In</a>
        </LoginLink>
      </Container>
    </Page>
  );
};

export default Signup; 