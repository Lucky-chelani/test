import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';

/* ==========================================================================
   ANIMATIONS
   ========================================================================== */
const breatheGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4), inset 0 0 8px rgba(37, 211, 102, 0.1); }
  50% { box-shadow: 0 0 20px 4px rgba(37, 211, 102, 0.2), inset 0 0 15px rgba(37, 211, 102, 0.2); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4), inset 0 0 8px rgba(37, 211, 102, 0.1); }
`;

const pulseDot = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const slideUpFade = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */
const FloatingContainer = styled.button`
  position: fixed;
  bottom: 90px; 
  right: 20px;
  z-index: 999;
  
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  border: 1px solid rgba(37, 211, 102, 0.4);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  border-radius: 50px;
  width: 56px; 
  height: 56px;
  overflow: hidden;
  cursor: pointer;
  
  animation: ${slideUpFade} 0.6s cubic-bezier(0.16, 1, 0.3, 1), ${breatheGlow} 4s infinite;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  .icon-wrapper {
    min-width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    svg {
      font-size: 2rem;
      color: #25D366; 
      transition: all 0.4s ease;
    }
  }

  .text-wrapper {
    white-space: nowrap;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: white;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.4s ease;
    padding-right: 0;
  }

  &:hover {
    width: 175px; 
    background: #25D366; 
    border-color: #25D366;
    box-shadow: 0 15px 30px rgba(37, 211, 102, 0.4);
    transform: translateY(-4px);
    
    .icon-wrapper svg { color: white; transform: scale(1.1) rotate(10deg); }
    .text-wrapper { opacity: 1; transform: translateX(0); padding-right: 20px; }
    .notification-dot { opacity: 0; }
  }

  &:active { transform: translateY(0) scale(0.95); }

  @media (max-width: 768px) {
    bottom: 80px; 
    right: 16px;
  }
`;

const NotificationDot = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 10px;
  height: 10px;
  background-color: #ef4444; 
  border-radius: 50%;
  border: 2px solid rgba(15, 23, 42, 1);
  animation: ${pulseDot} 2s infinite;
  transition: opacity 0.3s ease;
  z-index: 2;
`;

/* ==========================================================================
   MAIN COMPONENT LOGIC
   ========================================================================== */
// Notice we added organizerName to the props here
const WhatsAppSupport = ({ trekTitle, organizerName }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);

    const handleScroll = () => {
      if (window.scrollY > 100 && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSupportClick = () => {
    const phoneNumber = "919479747915"; 
    const greeting = getGreeting();
    const currentUrl = window.location.href;
    
    let message = `${greeting} Trovia! `;
    
    if (trekTitle) {
      // Base message with Trek Title
      message += `I'm looking at the *${trekTitle}* trek`;
      
      // If the organizer name is provided, append it!
      if (organizerName) {
        message += ` organized by *${organizerName}*`;
      }
      
      message += ` and need some help.\n\nHere is the link I am on: ${currentUrl}`;
    } else {
      message += `I need some assistance with a booking.\n\nI am currently looking at this page: ${currentUrl}`;
    }
      
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <FloatingContainer onClick={handleSupportClick} aria-label="Contact WhatsApp Support">
      <div className="icon-wrapper">
        <NotificationDot className="notification-dot" />
        <FaWhatsapp />
      </div>
      <div className="text-wrapper">
        Chat with us
      </div>
    </FloatingContainer>
  );
};

export default WhatsAppSupport;