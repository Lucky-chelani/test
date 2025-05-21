import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import mapPattern from '../assets/images/map-pattren.png';

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

const Checkbox = styled.input`
  width: 29px;
  height: 25px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 7px;
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
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to your backend
      console.log('Login attempt with:', formData);
      // For now, we'll just navigate to the profile page
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSocialLogin = (provider) => {
    // Here you would implement social login logic
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Page>
      <Navbar active="login" />
      <Form onSubmit={handleSubmit}>
        <Title>Log In</Title>
        <WelcomeText>Welcome back, Explorer!</WelcomeText>
        <SubText>Continue your adventure with Trovia</SubText>

        <SocialButtons>
          <SocialButton type="button" onClick={() => handleSocialLogin('Google')}>
            <SocialIcon src="/google-icon.png" alt="Google" />
            <span>Google</span>
          </SocialButton>
          <SocialButton type="button" onClick={() => handleSocialLogin('Apple')}>
            <SocialIcon src="/apple-icon.png" alt="Apple" />
            <span>Apple</span>
          </SocialButton>
          <SocialButton type="button" onClick={() => handleSocialLogin('Facebook')}>
            <SocialIcon src="/facebook-icon.png" alt="Facebook" />
            <span>Facebook</span>
          </SocialButton>
        </SocialButtons>

        <Divider>
          <Line />
          <span>or continue with email</span>
          <Line />
        </Divider>

        <InputGroup>
          <InputIcon src="/mail-icon.png" alt="Email" />
          <Input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com" 
            required
          />
        </InputGroup>

        <InputGroup>
          <InputIcon src="/lock-icon.png" alt="Password" />
          <Input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••••••" 
            required
          />
          <PasswordDots>
            {[...Array(8)].map((_, i) => (
              <Dot key={i} />
            ))}
          </PasswordDots>
        </InputGroup>

        <RememberMe>
          <Checkbox 
            type="checkbox" 
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
          />
          <span>Remember me</span>
        </RememberMe>

        <LoginButton type="submit">Log In</LoginButton>

        <SignupLink>
          New here? <a href="/signup">Join Now</a>
        </SignupLink>
      </Form>
    </Page>
  );
};

export default Login; 