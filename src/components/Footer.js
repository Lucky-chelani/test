import React from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import mapPattern from '../assets/images/map-pattren.png';

const FooterContainer = styled.footer`
  width: 100%;
  background: #000;
  position: relative;
  padding: 80px 0 40px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(${mapPattern}) repeat;
    background-size: 800px auto;
    opacity: 0.15;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 60px 0 30px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0 20px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px;
    gap: 32px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 768px) {
    align-items: center;
    gap: 16px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LogoImage = styled.img`
  width: 74px;
  height: 55px;
  object-fit: contain;
`;

const FooterTitle = styled.h3`
  color: #FFD2BF;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: #FFD2BF;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #FFD2BF;
    transform: translateX(3px);
    
    &::after {
      width: 100%;
    }
        }
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
    text-align: center;
    
    &:hover {
      transform: translateY(-2px) translateX(0);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    color: #FFD2BF;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1.3rem;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <LogoContainer>
            <LogoImage src={logo} alt="Trovia Logo" />
          </LogoContainer>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Discover the world's most beautiful treks and connect with fellow adventurers.
          </p>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/explore">Explore</FooterLink>
          <FooterLink href="/community">Community</FooterLink>
          <FooterLink href="/rewards">Rewards</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Support</FooterTitle>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Connect With Us</FooterTitle>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">📱</SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">📘</SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">📸</SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">🐦</SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        © {new Date().getFullYear()} Trovia. All rights reserved.
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 