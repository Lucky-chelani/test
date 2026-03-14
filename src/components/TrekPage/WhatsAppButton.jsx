import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';

/* --- ANIMATION --- */
// A very subtle, breathing neon glow (not a harsh flashing pulse)
const breatheGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4), inset 0 0 8px rgba(37, 211, 102, 0.1); }
  50% { box-shadow: 0 0 15px 4px rgba(37, 211, 102, 0.2), inset 0 0 15px rgba(37, 211, 102, 0.2); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4), inset 0 0 8px rgba(37, 211, 102, 0.1); }
`;


/* --- STYLED COMPONENTS --- */
const FloatingBtn = styled.button`
  position: fixed;
  /* IMPORTANT: Set to 90px so it sits ABOVE your bottom navigation bar */
  bottom: 90px; 
  right: 20px;
  z-index: 999;
  
  /* Matches your app's Dark Glassmorphism */
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  /* Neon WhatsApp Green Border */
  border: 1px solid rgba(37, 211, 102, 0.4);
  
  width: 56px;
  height: 56px;
  border-radius: 50%;
  
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  animation: ${breatheGlow} 3s infinite;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* The Icon styling */
  svg {
    font-size: 2rem;
    color: #25D366; /* WhatsApp Green */
    transition: all 0.3s ease;
  }

  /* When the user hovers, it fills with green and the icon turns white */
  &:hover {
    transform: translateY(-4px);
    background: #25D366; 
    border-color: #25D366;
    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
    
    svg {
      color: white;
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 80px; /* Adjust based on mobile nav height */
    right: 15px;
    width: 50px;
    height: 50px;
    svg { font-size: 1.8rem; }
  }
`;

const WhatsAppSupport = ({ trekTitle }) => {
  const handleSupportClick = () => {
    // Replace with your actual WhatsApp business number (Country Code + Number)
    const phoneNumber = "919876543210"; 
    
    // Auto-fills a message so you know what the user is looking at!
    const message = `Hi Trovia! I have a question about the ${trekTitle || 'trek'}.`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <FloatingBtn onClick={handleSupportClick} aria-label="Contact Support">
      <FaWhatsapp />
    </FloatingBtn>
  );
};

export default WhatsAppSupport;