import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import logo from '../assets/images/logo.png';
import mapPattern from '../assets/images/map-pattren.png';
import { 
  saveEmailSubscription, 
  processPendingSubscriptions,
  checkFirestoreAvailability 
} from '../utils/newsletterService';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const FooterContainer = styled.footer`
  width: 100%;
  background: linear-gradient(0deg, #000000 0%, #121212 100%);
  position: relative;
  padding: 80px 0 80px; /* Increased bottom padding to account for bottom navbar */
  overflow: hidden;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(${mapPattern}) repeat;
    background-size: 800px auto;
    opacity: 0.15;
    z-index: 0;
  }
  
  /* Enhanced gradient overlay with multiple color points */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 0%, 
      rgba(255, 210, 191, 0.1) 0%, 
      rgba(76, 201, 240, 0.05) 45%, 
      rgba(0, 0, 0, 0) 85%
    );
    z-index: 0;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 60px 0 80px; /* Increased bottom padding to account for bottom navbar */
  }
  
  @media (max-width: 480px) {
    padding: 40px 0 80px; /* Increased bottom padding to account for bottom navbar */
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
    gap: 40px 20px;
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
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  animation-delay: ${props => props.delay || '0s'};
  
  @media (max-width: 768px) {
    align-items: center;
    gap: 16px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LogoImage = styled.img`
  width: 74px;
  height: 55px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(255, 210, 191, 0.3));
  transition: all 0.3s ease;
  
  &:hover {
    filter: drop-shadow(0 4px 12px rgba(255, 210, 191, 0.5));
    transform: translateY(-2px);
  }
`;

const LogoText = styled.div`
  color: white;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #FFD2BF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 210, 191, 0.3);
`;

const TagLine = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: 5px;
  max-width: 300px;
  
  @media (max-width: 768px) {
    text-align: center;
    max-width: 100%;
  }
`;

const FooterTitle = styled.h3`
  position: relative;
  color: #FFD2BF;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    height: 3px;
    width: 40px;
    background: linear-gradient(90deg, #FFD2BF, #ffbfa3);
    border-radius: 3px;
    
    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s;
  position: relative;
  display: inline-block;
  padding: 3px 0;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #FFD2BF, #ffbfa3);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
  
  &:hover {
    color: #FFD2BF;
    transform: translateX(5px);
    
    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    text-align: center;
    
    &:hover {
      transform: translateY(-2px) translateX(0);
    }
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 5px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #FFD2BF, #ffbfa3);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    color: #222;
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 1;
    }
    
    svg {
      transform: scale(1.2);
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 60px auto 0;
  padding: 28px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  
  /* Enhanced gradient line with improved colors */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 210, 191, 0.35), 
      rgba(76, 201, 240, 0.35),
      transparent
    );
    opacity: 0.8;
  }
  
  /* Add subtle shadow for depth */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 5%;
    right: 5%;
    height: 6px;
    background: linear-gradient(180deg, 
      rgba(0, 0, 0, 0.1),
      transparent
    );
    opacity: 0.3;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
    text-align: center;
    margin-top: 40px;
    padding-top: 24px;
    padding-bottom: 24px;
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
`;

const BottomLink = styled(Link)`
  color: rgb(255, 255, 255);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
  
  &:hover {
    color: #FFD2BF;
  }
`;

const NewsletterSection = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
  position: relative;
  overflow: hidden;
  
  /* Enhanced gradient overlay with improved color blending */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(255, 210, 191, 0.1) 0%, 
      rgba(0, 0, 0, 0) 50%,
      rgba(76, 201, 240, 0.1) 100%);
    z-index: -1;
  }
  
  /* Add subtle shimmer effect to borders */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg,
      transparent 20%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 60%,
      transparent 80%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 8s infinite linear;
    z-index: -1;
    border-radius: 16px;
    opacity: 0.4;
  }
  
  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const NewsletterTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const NewsletterDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin-bottom: 25px;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 500px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #FFD2BF;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 210, 191, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubscribeButton = styled.button`
  background: linear-gradient(135deg, #FFD2BF, #ffbfa3);
  color: #222;
  font-weight: 700;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 210, 191, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const BackToTopButton = styled.button`
  position: absolute;
  right: 30px;
  bottom: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD2BF 0%, #ffbfa3 100%);
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 5;
  overflow: hidden;
  
  /* Enhanced top highlight */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    opacity: 0.6;
    transition: opacity 0.3s ease;
    border-radius: 50%;
  }
  
  /* Add subtle inner border */
  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    opacity: 0.3;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 210, 191, 0.3);
    background: linear-gradient(135deg, #FFD2BF 0%, #ffbfa3 70%, #ffe0d3 100%);
    
    &::before {
      opacity: 0.8;
    }
    
    &::after {
      opacity: 0.6;
    }
    
    svg {
      transform: translateY(-3px);
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(255, 210, 191, 0.4);
  }
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 2;
  }
  
  @media (max-width: 768px) {
    right: 20px;
    bottom: 20px;
    width: 45px;
    height: 45px;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.4);
  color: #4ade80;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  animation: ${pulse} 1.5s ease infinite;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(252, 165, 165, 0.2);
  border: 1px solid rgba(252, 165, 165, 0.4);
  color: #f87171;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-left: 10px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const BlogRedirectSection = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(255, 210, 191, 0.08) 0%, rgba(76, 201, 240, 0.05) 100%);
  border-radius: 16px;
  padding: 24px 40px;
  margin-bottom: 50px;
  border: 1px dashed rgba(255, 210, 191, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-style: solid;
    background: rgba(255, 210, 191, 0.12);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 30px 20px;
  }
`;

const BlogTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BlogMiniTitle = styled.h4`
  color: #FFD2BF;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

const BlogTagline = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
`;

const ExploreBlogButton = styled(Link)`
  background: transparent;
  color: #FFD2BF;
  border: 1.5px solid #FFD2BF;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: #FFD2BF;
    color: #000;
    box-shadow: 0 5px 15px rgba(255, 210, 191, 0.2);
    
    svg {
      transform: translateX(4px);
    }
  }
`;


const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check Firestore availability and process any pending subscriptions 
  useEffect(() => {
    const checkAvailability = async () => {
      // Check if Firebase is available
      const isAvailable = await checkFirestoreAvailability();
      
      // If available, try to process any pending subscriptions
      if (isAvailable) {
        const result = await processPendingSubscriptions();
        
        if (result.processed > 0) {
          console.log(`Processed ${result.processed} pending subscriptions`);
        }
      }
    };
    
    // Run the check after a short delay to allow the component to render
    const timer = setTimeout(checkAvailability, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const result = await saveEmailSubscription(email);
        if (result.success) {
        setSubscribed(true);
        setEmail('');
        
        // Reset the success message after 5 seconds
        setTimeout(() => {
          setSubscribed(false);
        }, 5000);
        
        // If it was saved locally, let the user know
        if (result.localOnly) {
          setErrorMessage('Your subscription is saved locally and will be processed when our service is available again.');
          setTimeout(() => {
            setErrorMessage('');
          }, 6000);
        }
      } else {
        // Handle different error cases
        if (result.status === 'duplicate') {
          setErrorMessage('This email is already subscribed to our newsletter.');
        } else if (result.code === 'permission-denied') {
          // Special handling for permission errors
          setErrorMessage('Our subscription service is temporarily unavailable. Please try again later.');
          
          // Save locally as a fallback
          try {
            const savedEmails = JSON.parse(localStorage.getItem('pending_subscriptions') || '[]');
            savedEmails.push({
              email,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('pending_subscriptions', JSON.stringify(savedEmails));
            
            // Let user know we saved locally
            setErrorMessage('Your subscription will be processed when our service is back online.');
          } catch (localError) {
            console.error("Failed to save locally:", localError);
            setErrorMessage('Subscription service unavailable. Please try again later.');
          }
        } else {
          setErrorMessage(result.error || 'An error occurred. Please try again.');
        }
        
        // Clear error message after 4 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      console.error('Newsletter subscription error:', error);
      
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <FooterContainer>
      <FooterContent>
        <NewsletterSection>
          <NewsletterTitle>Join Our Adventure Newsletter</NewsletterTitle>
          <NewsletterDescription>
            Get exclusive trek recommendations, travel tips, and special offers delivered to your inbox.
          </NewsletterDescription>
          
          {subscribed ? (
            <SuccessMessage>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Thanks for subscribing! Get ready for adventure updates.
            </SuccessMessage>
          ) : (
            <NewsletterForm onSubmit={handleSubscribe}>              <NewsletterInput 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <SubscribeButton type="submit" disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'}
                {isLoading && <LoadingSpinner />}
              </SubscribeButton>
            </NewsletterForm>
          )}
          
          {errorMessage && (
            <ErrorMessage>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v6m0 3h.01M12 3v3m0 12v3m9-15h-3m-12 0H3m18 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {errorMessage}
            </ErrorMessage>
          )}
        </NewsletterSection>

        <BlogRedirectSection>
          <BlogTextWrapper>
            <BlogMiniTitle>Explore Our Adventure Blogs</BlogMiniTitle>
            <BlogTagline>Deep dives into the world's most hidden trails and expert gear guides.</BlogTagline>
          </BlogTextWrapper>
          <ExploreBlogButton to="/blog">
            Read Stories
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </ExploreBlogButton>
        </BlogRedirectSection>

        <FooterSection delay="0.1s">
          <LogoContainer>
            <LogoImage src={logo} alt="Trovia Logo" />
            <LogoText>Trovia</LogoText>
          </LogoContainer>
          <TagLine>
            Discover the world's most beautiful treks and connect with fellow adventurers on a journey of a lifetime.
          </TagLine>
          <SocialLinks>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection delay="0.2s">
          <FooterTitle>Explore</FooterTitle>
          <LinksWrapper>
            <FooterLink to="/explore">All Treks</FooterLink>
            {/* <FooterLink to="/categories/beginner">Beginner Friendly</FooterLink>
            <FooterLink to="/categories/advanced">Advanced Trails</FooterLink>
            <FooterLink to="/map">Interactive Map</FooterLink>
            <FooterLink to="/seasonal">Seasonal Highlights</FooterLink> */}
          </LinksWrapper>
        </FooterSection>

        <FooterSection delay="0.3s">
          <FooterTitle>Community</FooterTitle>
          <LinksWrapper>
            <FooterLink to="/community">Adventure Groups</FooterLink>
            {/* <FooterLink to="/events">Upcoming Events</FooterLink>
            <FooterLink to="/forum">Trekkers Forum</FooterLink>
            <FooterLink to="/stories">Trail Stories</FooterLink>
            <FooterLink to="/gallery">Photo Gallery</FooterLink> */}
          </LinksWrapper>
        </FooterSection>

        <FooterSection delay="0.4s">
          <FooterTitle>Business Communication Address</FooterTitle>
          <LinksWrapper>
            <div style={{ color: '#FFD2BF', fontWeight: 600, lineHeight: 1.7 }}>
              TROVIA<br />
              204, Nai Sadak, Shubey Ki Goth,<br />
              Gwalior, Madhya Pradesh – 474001<br />
              📧 Email: <a href="mailto:trovia.in@gmail.com" style={{ color: '#FFD2BF', textDecoration: 'underline' , wordBreak: 'break-all'}}>trovia.in@gmail.com</a>
            </div>
          </LinksWrapper>
        </FooterSection>
      </FooterContent>      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} Trovia. All rights reserved.
        </Copyright>
        <BottomLinks>          <BottomLink to="/terms">Terms of Service</BottomLink>
          <BottomLink to="/privacy">Privacy Policy</BottomLink>
          <BottomLink to="/cookies">Cookie Policy</BottomLink>
          <BottomLink to="/accessibility">Accessibility</BottomLink>
          <BottomLink to="/admin/simple" style={{ opacity: 0.4 }}>Admin</BottomLink>
        </BottomLinks>
      </FooterBottom>
      
      <BackToTopButton onClick={scrollToTop} aria-label="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </BackToTopButton>
    </FooterContainer>
  );
};

export default Footer;
