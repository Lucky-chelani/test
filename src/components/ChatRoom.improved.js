import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, where, Timestamp, getDocs, arrayUnion } from 'firebase/firestore';

// Move all image and component imports up here
import mapPattern from '../assets/images/map-pattren.png';
import chatBg from '../assets/images/chatBackground.png';
import SidebarNew from '../components/Sidebar';

// NOW you can define your lazy-loaded components
const EmojiPicker = lazy(() => import('emoji-picker-react'));
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;



export const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 80px; /* Floats right above the input bar */
  right: 30px; /* Aligned to the right side */
  z-index: 50;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  animation: ${fadeIn} 0.2s ease-out;

  /* Mobile adjustment */
  @media (max-width: 768px) {
    right: 10px;
    bottom: 70px;
  }
`;
// 1. Cinematic "Focus Pull" entry (blurry to sharp)
export const cinematicEntry = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(40px) scale(0.92); 
    filter: blur(12px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
    filter: blur(0); 
  }
`;

// 2. Slow, drifting ambient light orbs
export const drift = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5vw, -5vh) scale(1.1); }
  66% { transform: translate(-3vw, 4vh) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;




// 1. Optional: A very slow, subtle panning animation for the map pattern
const panBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

// 1. The Main Wrapper (Deep Navy + Topographic Map)
export const Page = styled.div`
  position: fixed;
  inset: 0;
  background-color: #0A0F1E; 
  background-image: url(${mapPattern});
  background-size: 600px;
  background-repeat: repeat;
  background-position: center;
  background-blend-mode: screen; 
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vw;
  overflow: hidden;
  z-index: 1000;

  /* MOBILE FIX: Remove padding so the app touches the screen edges */
  @media (max-width: 768px) {
    padding: 0;
  }
`;

// 2. The Starry Dust Layer (Pure CSS Stars)
export const StarryLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -3;
  opacity: 0.6;
  
  /* A brilliant CSS trick to generate a starry sky without needing an image file */
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.6), rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 90px 40px, rgba(255,255,255,1), rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 160px 120px, rgba(255,255,255,0.5), rgba(0,0,0,0)),
    radial-gradient(1px 1px at 250px 90px, rgba(255,255,255,0.8), rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 300px 300px;
`;
export const MessageImage = styled.img`
  max-width: 100%;
  max-height: 250px;
  border-radius: 12px;
  margin-bottom: 8px; /* Adds space between the image and the text below it */
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

// 3. The Cinematic Light Leaks (Cyan Glows)
export const AmbientLighting = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -2;
  background: 
    /* Top Left/Center Bright Cyan Glow */
    radial-gradient(circle at 35% -5%, rgba(56, 189, 248, 0.25) 0%, transparent 45%),
    /* Bottom Right Cyan Glow */
    radial-gradient(circle at 110% 90%, rgba(56, 189, 248, 0.2) 0%, transparent 50%);
`;

// 4. The Foreground Rocks
export const ForegroundRocks = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;

  /* Left Rock */
  &::before {
    content: '';
    position: absolute;
    bottom: -5vh;
    left: -2vw;
    width: 25vw;
    height: 40vh;
    /* You will need to drop a transparent PNG of a rock in your assets folder for this! */
    background-image: url('/assets/images/rock-left.png'); 
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom left;
    filter: brightness(0.6) drop-shadow(15px -15px 30px rgba(56, 189, 248, 0.15));
  }

  /* Right Rock */
  &::after {
    content: '';
    position: absolute;
    bottom: -8vh;
    right: -2vw;
    width: 30vw;
    height: 50vh;
    /* You will need to drop a transparent PNG of a rock in your assets folder for this! */
    background-image: url('/assets/images/rock-right.png'); 
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom right;
    filter: brightness(0.5) drop-shadow(-15px -15px 30px rgba(56, 189, 248, 0.15));
  }
`;
// 1. Subtle entry animation for the container
const floatIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(15px) scale(0.99); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

export const ChatContainer = styled.div`
  will-change: transform, opacity;
 transform: translateZ(0);
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  /* MOBILE FIX: Prevents the flex child from pushing off-screen */
  min-height: 0; 
`;

export const ChatHeader = styled.header` /* Changed from div to header for semantic HTML */
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 10; /* Ensures header stays above scrolling messages */
  
  /* --- Frosted Glass Effect --- */
  background: rgba(10, 17, 30, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  /* Soft separator */
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); /* Slight shadow to lift it off the chat body */
`;

export const BackButton = styled.button`
  /* --- Base Styles --- */
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  
  /* Fixed width/height ensures a perfect circle for hover states */
  width: 40px; 
  height: 40px;
  border-radius: 50%;
  
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  /* Smooth, snappy transition */
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  
  /* --- Interactions --- */
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
    /* Micro-interaction: nudges slightly to the left to emphasize "going back" */
    transform: translateX(-3px); 
  }
  
  &:active {
    /* Shrinks slightly when clicked for tactile feedback */
    transform: scale(0.9) translateX(-3px); 
    background: rgba(255, 255, 255, 0.15);
  }

  /* --- Accessibility --- */
  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
`;

export const RoomInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Crucial for flexbox: allows children to truncate text instead of stretching the container */
  min-width: 0; 
`;

export const RoomName = styled.h2`
  margin: 0 0 4px 0;
  font-size: clamp(1.3rem, 4vw, 1.6rem); 
  font-weight: 800;
  letter-spacing: -0.03em; 
  
  /* Glowing Text Effect */
  background: linear-gradient(135deg, #ffffff 0%, #80FFDB 50%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 8px rgba(128, 255, 219, 0.3)); /* Text glow */
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RoomDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  font-weight: 400;
  
  /* Truncate long descriptions so the header doesn't expand vertically */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-behavior: smooth;
  position: relative;
  
  /* Hardware acceleration for buttery smooth scrolling on mobile */
  -webkit-overflow-scrolling: touch;
  transform: translateZ(0);
  background-color: #0A0F1E; 
  background-image: linear-gradient(...), url(${chatBg});

  /* --- YOUR NEW CHAT BACKGROUND --- */
  background: 
    linear-gradient(rgba(7, 11, 25, 0.6), rgba(7, 11, 25, 0.8)), 
    url(${chatBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;

  /* Custom Scrollbar - Slimmer and cleaner */
  &::-webkit-scrollbar {
    width: 6px; 
  }
  &::-webkit-scrollbar-track {
    background: transparent; 
    margin: 12px 0;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    height: 0;
    flex: 1 1 auto;
    padding: 16px 12px; 
  }
`;
export const DateDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  position: relative;
  
  /* The line behind the date */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    /* Gradient line that fades out at the edges instead of a harsh solid line */
    background: linear-gradient(
      to right, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.1) 20%, 
      rgba(255, 255, 255, 0.1) 80%, 
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 0;
  }
  
  /* Assumes you wrap your date text in a <span> inside the DateDivider */
  & > span {
    background: #0B1320; /* Should roughly match your chat background color */
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 6px 16px;
    border-radius: 100px; /* Perfect pill shape */
    border: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 1;
    backdrop-filter: blur(8px);
  }
`;

// const fadeIn = keyframes`
//   from { 
//     opacity: 0; 
//     transform: translateY(12px) scale(0.98); 
//   }
//   to { 
//     opacity: 1; 
//     transform: translateY(0) scale(1); 
//   }
// `;

// const shimmerEffect = keyframes`
//   0% { transform: translateX(-100%); opacity: 0; }
//   50% { opacity: 1; }
//   100% { transform: translateX(100%); opacity: 0; }
// `;

// --- Components ---

export const DateLabel = styled.span`
  background: rgba(15, 24, 42, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  
  /* Adds depth to the label so it doesn't look flat against the background */
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  position: relative;
  z-index: 2;
`;

export const ChatForm = styled.form`
  display: flex;
  padding: 0 30px 30px 30px;
  gap: 16px;
  align-items: center;
  background: transparent;

  /* MOBILE FIX */
  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 8px;
  }
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 14px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
    transition: opacity 0.2s;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(128, 255, 219, 0.5);
    /* Soft glowing focus ring */
    box-shadow: 0 0 0 4px rgba(128, 255, 219, 0.1); 
    
    &::placeholder {
      opacity: 0.5; /* Fades placeholder slightly when typing */
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 16px; /* 16px is strictly required to stop iOS Safari from zooming in on focus */
    -webkit-appearance: none; 
    border-radius: 20px;
  }
`;

export const SendButton = styled.button`
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 100px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: 0.2s;
  
  &:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    transform: scale(1.02);
  }

  /* MOBILE FIX: Hide text, keep only the icon */
  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 50%;
    font-size: 0;
    gap: 0;
    svg { margin: 0; width: 16px; height: 16px; }
  }
`;
export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: ${props => props.$isCurrentUser ? 'row-reverse' : 'row'};
  align-items: flex-end;
  gap: 12px;
  margin: 8px 0;
  max-width: 85%;
  align-self: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
  
  /* The Magic: Cinematic Focus Pull Entry */
  animation: ${cinematicEntry} 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  
  /* Stagger the animation slightly so old messages don't pop in weirdly */
  animation-delay: ${props => props.$isLocal ? '0s' : '0.1s'};
  
  /* Hardware acceleration to prevent lag during heavy blur animations */
  will-change: transform, opacity, filter;
  transform: translateZ(0);
  
  position: relative;
  
  /* Rest of your existing MessageWrapper logic ($isLocal, etc.)... */
`;
export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1); /* Fallback color */
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  
  /* Cleaner alternative to pseudo-element borders: layered box shadows */
  box-shadow: ${props => props.$isCurrentUser 
    ? '0 0 0 2px #0B1320, 0 0 0 4px rgba(128, 255, 219, 0.4)' 
    : '0 0 0 2px #0B1320, 0 0 0 4px rgba(255, 255, 255, 0.1)'
  };
`;


export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: 6px; /* consistent spacing between bubble and metadata */
`;

export const AppWindow = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  background: rgba(13, 17, 33, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1);
  overflow: hidden;
  position: relative;

  /* MOBILE FIX: Stack elements vertically and remove rounded corners */
  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 0;
    border: none;
  }
`;
export const Sidebar = styled.aside`
  width: 80px;
  background: rgba(6, 10, 20, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 24px;
  z-index: 10;

  /* MOBILE FIX: Convert to Bottom Navigation Bar */
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    flex-direction: row;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    /* env(safe-area-inset-bottom) respects iPhone home bars! */
    padding: 12px 24px calc(12px + env(safe-area-inset-bottom));
    justify-content: space-between;
    gap: 0;
    order: 10; /* Forces it to the bottom of the column */
    background: rgba(6, 10, 20, 0.95); /* Make it solid so text doesn't show behind it */

    /* Hide the spacer div so icons distribute evenly */
    & > div {
      display: none;
    }
  }
`;
export const SidebarIcon = styled.div`
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: ${props => props.$active ? '#38BDF8' : 'rgba(255, 255, 255, 0.4)'};
  background: ${props => props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'rgba(56, 189, 248, 0.3)' : 'transparent'};
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &:hover { color: #38BDF8; background: rgba(255,255,255,0.05); }

  /* Desktop active indicator (left line) */
  ${props => props.$active && css`
    &::before {
      content: '';
      position: absolute;
      left: -18px;
      height: 24px;
      width: 4px;
      background: #38BDF8;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 12px #38BDF8;
    }
  `}
  /* MOBILE FIX: Move the active indicator to the top of the icon */
  @media (max-width: 768px) {
    width: 38px; height: 38px;
    ${props => props.$active && css`
      &::before {
        left: 50%;
        top: -12px;
        transform: translateX(-50%);
        height: 3px;
        width: 20px;
        border-radius: 0 0 4px 4px;
      }
    `}
  }
`;

export const ActionCircleButton = styled.button`
  width: 46px; height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(56, 189, 248, 0.3);
  background: rgba(255, 255, 255, 0.03);
  color: #38BDF8;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px; height: 36px;
    svg { width: 16px; height: 16px; }
  }
`;

export const MessageInputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 6px 6px 6px 20px;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);

  /* MOBILE FIX */
  @media (max-width: 768px) {
    padding: 4px 4px 4px 12px;
  }
`;
export const MessageBubble = styled.div`
  padding: 14px 20px;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  
  /* Image Style: Sharp bottom corners instead of top corners */
  border-radius: 24px;
  border-bottom-right-radius: ${props => props.$isCurrentUser ? '4px' : '24px'};
  border-bottom-left-radius: ${props => !props.$isCurrentUser ? '4px' : '24px'};
  
  /* Image Style: Vibrant Purple Gradient */
  ${props => props.$isCurrentUser ? css`
    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.4);
    border: 1px solid transparent;
  ` : css`
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  `}
  
  /* Keep all your existing $sendFailed, $sending (shimmer), etc. styles here */
`;

export const MessageText = styled.div`
  overflow-wrap: anywhere; 
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 0.95rem;
  line-height: 1.6; /* Increased slightly for better readability */
  letter-spacing: 0.01em;
  
  /* Ensures links inside the text look good */
  a {
    color: #80FFDB;
    text-decoration: underline;
    text-underline-offset: 2px;
    
    &:hover {
      color: #ffffff;
    }
  }
`;

export const MessageMeta = styled.div`
  display: flex;
  justify-content: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
  align-items: center;
  font-size: 0.75rem;
  gap: 8px;
  padding: 0 4px; /* Slight indent to align with bubble curve */
`;

export const UserName = styled.span`
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${props => props.$isCurrentUser ? '#80FFDB' : 'rgba(255, 255, 255, 0.8)'};
`;

export const MessageTimeText = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
`;

export const MessageStatus = styled.div`
  position: absolute;
  /* Adjust positioning to float nicely outside the bubble */
  bottom: -22px; 
  right: ${props => props.$isCurrentUser ? '4px' : 'auto'};
  left: ${props => !props.$isCurrentUser ? '4px' : 'auto'};
  
  font-size: 0.7rem;
  font-weight: 600;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  animation: ${fadeIn} 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  white-space: nowrap;
`;

// --- System Messages ---

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-left: 4px solid #ff6b6b;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: ${fadeIn} 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const InfoMessage = styled.div`
  text-align: center;
  padding: 8px 16px;
  margin: 16px auto;
  border-radius: 24px;
  background: rgba(83, 144, 217, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(83, 144, 217, 0.2);
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  font-weight: 500;
  max-width: 85%;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;


// --- Animations ---
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const slideUpFade = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// --- Components ---

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  margin: auto;
  
  /* Creates a subtle glowing aura behind the entire empty state */
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(128, 255, 219, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  svg {
    font-size: 3.5rem;
    margin-bottom: 24px;
    color: rgba(255, 255, 255, 0.4);
    /* Gentle floating animation to make the empty room feel alive */
    animation: ${float} 4s ease-in-out infinite;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #80FFDB 0%, #5390D9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    z-index: 1;
  }
  
  p {
    max-width: 380px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.95rem;
    position: relative;
    z-index: 1;
  }
`;

// 1. The small preview bar that appears ABOVE the input when replying
export const ReplyPreviewContainer = styled.div`
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  z-index: 4; /* Below ChatForm */
  
  /* Premium Glassmorphism matching the input area */
  background: rgba(10, 17, 30, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  
  /* A bright accent border on the left to indicate "replying" */
  border-left: 4px solid #80FFDB;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  
  animation: ${slideUpFade} 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
`;

export const ReplyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1; /* Takes up remaining space */
  min-width: 0; /* CRITICAL: Allows child elements to truncate with ellipsis */
  
  strong {
    color: #80FFDB;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  
  span {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const CancelReplyButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* Prevents button from squishing on small screens */
  
  &:hover {
    color: #ffffff;
    background: rgba(255, 107, 107, 0.8); /* Turns red on hover to indicate cancel/delete */
    border-color: rgba(255, 107, 107, 0.8);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// 2. The visual "Quote" inside a sent message bubble
export const QuotedMessage = styled.div`
  margin-bottom: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Recessed glass effect */
  background: ${props => props.$isCurrentUser ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)'};
  border-left: 3px solid ${props => props.$isCurrentUser ? 'rgba(255, 255, 255, 0.6)' : '#80FFDB'};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* Creates a subtle "sunken" look */
  
  &:hover {
    /* Slight brightness increase to indicate it's clickable */
    background: ${props => props.$isCurrentUser ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
  }
  
  strong {
    display: block;
    color: ${props => props.$isCurrentUser ? 'rgba(255, 255, 255, 0.95)' : '#80FFDB'};
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 4px;
    letter-spacing: 0.02em;
  }
  
  span {
    color: ${props => props.$isCurrentUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.65)'};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
  }
`;

// 3. The Reply Button (to be placed in MessageMeta)
export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 6px;
  margin-left: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    color: #80FFDB;
    background: rgba(128, 255, 219, 0.1); /* Subtle highlight behind the text instead of an underline */
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
// --- Add to animations at the top ---
export const highlightPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(128, 255, 219, 0.7); background: rgba(128, 255, 219, 0.2); }
  70% { box-shadow: 0 0 0 10px rgba(128, 255, 219, 0); background: transparent; }
  100% { box-shadow: 0 0 0 0 rgba(128, 255, 219, 0); background: transparent; }
`;

// --- Add to your components ---
export const MessageActions = styled.div`
  position: absolute;
  top: -24px; /* Lifted slightly higher */
  right: ${props => props.$isCurrentUser ? '10px' : 'auto'};
  left: ${props => !props.$isCurrentUser ? '10px' : 'auto'};
  display: flex;
  gap: 4px;
  background: rgba(15, 24, 42, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  
  /* Animation states */
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;
  z-index: 10;

  /* THE FIX: The Invisible Bridge 
     This creates a transparent block between the menu and the chat bubble.
     Now, your mouse won't "fall off" and accidentally close the menu! */
  &::after {
    content: '';
    position: absolute;
    bottom: -15px; 
    left: 0;
    right: 0;
    height: 15px;
    background: transparent;
  }

  /* MOBILE FIX: Since phones don't have "hover", we make the menu 
     sit securely inside the bubble or become visible when tapping */
  @media (max-width: 768px) {
    /* On mobile, we can make it always slightly visible, 
       or rely on the user tapping the message to trigger the hover state */
    top: -30px;
    
    /* Optional: Uncomment the next two lines if you want the menu ALWAYS visible on mobile */
    /* opacity: 1; */
    /* pointer-events: auto; transform: translateY(0) scale(1); */
  }
`;
export const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${props => props.$danger ? '#ff6b6b' : '#80FFDB'};
  }
  
  svg { width: 14px; height: 14px; }
`;

// Update MessageWrapper to trigger the actions on hover
export const HighlightableMessageWrapper = styled(MessageWrapper)`
  /* If this message is targeted by a reply click, pulse it */
  ${props => props.$isHighlighted && css`
    border-radius: 8px;
    animation: ${highlightPulse} 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  `}

  /* Show actions on hover */
  &:hover ${MessageActions} {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

export const DeletedText = styled.span`
  font-style: italic;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 6px;
`;

// --- Add this to your animations at the top ---
export const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
`;

// --- Add these new components ---

// 1. Typing Indicator
export const TypingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  font-style: italic;
  animation: ${fadeIn} 0.3s ease;
`;
export const InputIconButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  transition: 0.2s;
  
  &:hover { color: #38BDF8; transform: scale(1.1); }
  svg { width: 20px; height: 20px; }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;


export const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 6px;
    height: 6px;
    background-color: rgba(128, 255, 219, 0.7);
    border-radius: 50%;
    animation: ${bounce} 1.4s infinite ease-in-out both;
  }
  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }
`;



// 2. Reactions UI
export const ReactionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: -8px; /* Pulls it up slightly to overlap the bubble */
  margin-bottom: 8px;
  padding: 0 12px;
  z-index: 2;
  position: relative;
  justify-content: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
`;

export const ReactionBadge = styled.button`
  background: ${props => props.$hasReacted ? 'rgba(128, 255, 219, 0.15)' : 'rgba(15, 24, 42, 0.9)'};
  border: 1px solid ${props => props.$hasReacted ? 'rgba(128, 255, 219, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background: rgba(128, 255, 219, 0.2);
  }
`;

// 3. Quick Reaction Menu (appears on hover alongside Edit/Delete)
export const QuickReactionMenu = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 4px;
`;




// --- Helper Functions ---
const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (diff < oneDay && date.getDate() === now.getDate()) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && 
      date.getMonth() === yesterday.getMonth() && 
      date.getFullYear() === yesterday.getFullYear()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { room } = location.state || {};
  
  const messageContainerRef = useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [roomDocId, setRoomDocId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [isUserMember, setIsUserMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showNewMessageBadge, setShowNewMessageBadge] = useState(false);
  
  // NEW: Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  // --- EMOJI PICKER STATE ---
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // NEW: Tracks the picker element

  // --- NEW: CLOSE ON CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the picker is open, AND the click was NOT inside the picker container...
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false); // ...close the picker!
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // --- EMOJI CLICK HANDLER ---
  const onEmojiClick = (emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };

  // --- Keyboard & Scrolling ---
  useEffect(() => {
    const handleResize = () => {
      const isKeyboard = window.innerHeight < window.screen.height * 0.75;
      setIsKeyboardVisible(isKeyboard);
      
      if (isKeyboard) {
        setTimeout(() => scrollToBottom(true), 300);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add a ref to track if it's the first time the messages have loaded
const isInitialLoad = useRef(true);

const scrollToBottom = (force = false) => {
  if (messageContainerRef.current) {
    const { scrollHeight, clientHeight, scrollTop } = messageContainerRef.current;
    
    // Check if the user is already within 150px of the bottom
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

    if (force || isNearBottom) {
      requestAnimationFrame(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      });
    }
  }
};

useEffect(() => {
  if (!loading && messages.length > 0) {
    if (isInitialLoad.current) {
      // FORCE scroll to bottom on the very first load
      scrollToBottom(true);
      isInitialLoad.current = false;
    } else {
      // Only scroll if the user is already near the bottom
      scrollToBottom(false);
    }
  }
}, [messages, loading]);
  // --- Firebase Fetching ---
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        navigate('/community');
        return;
      }
      
      try {
        setLoading(true);
        const roomsQuery = query(collection(db, 'chatrooms'), where('id', '==', roomId));
        const roomSnapshot = await getDocs(roomsQuery);
        
        if (roomSnapshot.empty) {
          setError("Community not found");
          setLoading(false);
          return;
        }
        
        const roomDoc = roomSnapshot.docs[0];
        const roomDocData = roomDoc.data();
        setRoomDocId(roomDoc.id);
        setRoomData(roomDocData);
        
        const isMember = auth.currentUser && 
          roomDocData.members && 
          roomDocData.members.includes(auth.currentUser.uid);
        setIsUserMember(isMember);
        
        const messagesQuery = query(
          collection(db, 'chatrooms', roomDoc.id, 'messages'), 
          orderBy('timestamp', 'asc')
        );
        
        let unsubscribe;
        try {
          unsubscribe = onSnapshot(
            messagesQuery, 
            (snapshot) => {
              if (!snapshot.empty) {
                const messageData = snapshot.docs.map(doc => {
                  const data = doc.data();
                  const processedData = {
                    ...data,
                    id: doc.id,
                    timestamp: data.timestamp ? 
                      (typeof data.timestamp.toDate === 'function' ? data.timestamp.toDate() : data.timestamp) : 
                      new Date()
                  };
                  
                  if (data.clientMessageId) {
                    setTimeout(() => {
                      setLocalMessages(prev => prev.filter(msg => msg.id !== data.clientMessageId));
                    }, 100);
                  }
                  
                  return processedData;
                });
                setMessages(messageData);
              }
              setLoading(false);
            },
            (err) => {
              console.error("Error in messages listener:", err);
              if (err.code === 'permission-denied') {
                setError("You don't have permission to view messages in this community");
                setIsUserMember(false);
              } else {
                setError("Error loading messages: " + err.message);
              }
              setLoading(false);
            }
          );
        } catch (err) {
          setError("Error connecting to chat: " + err.message);
          setLoading(false);
        }
        return () => unsubscribe && unsubscribe();
      } catch (err) {
        setError("Error loading community: " + err.message);
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId, navigate]);

  // --- Handlers ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newMessage.trim() || !auth.currentUser) {
      if (!auth.currentUser) setError('Please sign in to send messages');
      return;
    }
    
    if (!isUserMember) {
      setError('You need to join this community before sending messages');
      return;
    }

    // 🔴 MOVE THIS LINE UP HERE:
    const messageText = newMessage.trim();

    // Now the edit block knows what `messageText` is!
    if (editingMessage) {
      try {
        await updateDoc(doc(db, `chatrooms/${roomDocId}/messages`, editingMessage.id), {
          text: messageText, 
          isEdited: true,
          editedAt: serverTimestamp()
        });
        setEditingMessage(null);
        setNewMessage('');
        setIsTyping(false);
      } catch (err) {
        setError("Failed to edit message.");
      }
      return;
    }
    setNewMessage('');
    
    const now = new Date();
    const contentHash = messageText.split('').reduce((acc, char) => 
      (acc * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0).toString(16).substring(0, 8);
    const localMessageId = `local-${now.getTime()}-${contentHash}`;
    
    const tempMessage = {
      id: localMessageId,
      text: messageText,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonymous',
      userPhoto: auth.currentUser.photoURL || null,
      isLocal: true,
      timestamp: now,
      sending: true,
      sentTime: now.getTime(),
      replyTo: replyingTo ? {
        id: replyingTo.id,
        userName: replyingTo.userName,
        text: replyingTo.text 
      } : null
    };
    
    setLocalMessages(prev => [...prev, tempMessage]);
    
    try {
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 8);
      
      const messagePayload = {
        text: messageText,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expirationTime),
        ttl: '8 hours',
        clientMessageId: localMessageId,
        replyTo: replyingTo ? {
          id: replyingTo.id,
          userName: replyingTo.userName,
          text: replyingTo.text
        } : null
      };

      await addDoc(collection(db, `chatrooms/${roomDocId}/messages`), messagePayload);
      setReplyingTo(null); // Clear reply state after successful send
      
      setTimeout(() => {
        setLocalMessages(prev => prev.filter(msg => msg.id !== localMessageId));
      }, 500); 
    } catch (err) {
      if (err.code === 'permission-denied') {
        setError('You do not have permission to send messages. Please join first.');
        setIsUserMember(false);
      } else if (err.code === 'unavailable') {
        setError('Network issue. Message saved locally and will be sent when connection is restored.');
        return;
      } else {
        setError(`Failed to send message: ${err.message}. Please try again.`);
      }
      
      setLocalMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? {...msg, sendFailed: true, errorMessage: err.message} : msg
      ));
    }
  };

  const handleReplyClick = (message) => {
    setReplyingTo(message);
    document.getElementById('chat-input-field')?.focus();
  };

  // --- Message Processing & Deduplication ---
  const messageMap = new Map();
  const contentTimeMap = new Map();
  
  messages.forEach(message => {
    messageMap.set(message.id, message);
    const timeWindow = Math.floor((message.timestamp?.getTime() || 0) / 10000);
    const contentKey = `${message.userId}-${message.text}-${timeWindow}`;
    contentTimeMap.set(contentKey, message.id);
  });
  
  localMessages.forEach(message => {
    if (messageMap.has(message.id)) return;
    const timeWindow = Math.floor((message.timestamp?.getTime() || 0) / 10000);
    const contentKey = `${message.userId}-${message.text}-${timeWindow}`;
    if (!contentTimeMap.has(contentKey)) {
      messageMap.set(message.id, message);
    }
  });
  
  const allMessages = Array.from(messageMap.values())
    .sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  
  const groupedMessages = allMessages.reduce((groups, message) => {
    const date = message.timestamp ? 
      (message.isLocal ? 'Today' : formatDate(message.timestamp)) : 
      'Today';
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});
  
  // Local message cleanup
  useEffect(() => {
    if (localMessages.length === 0) return;
    const staleTimeout = 30000; 
    
    const cleanupInterval = setInterval(() => {
      setLocalMessages(prev => {
        const currentTime = Date.now();
        return prev.filter(msg => !msg.sentTime || currentTime - msg.sentTime < staleTimeout);
      });
    }, 10000);
    return () => clearInterval(cleanupInterval);
  }, [localMessages]);


  // --- NEW STATES ---
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  // --- NEW FUNCTIONS ---
  // 1. Scroll to Original Message
  const scrollToOriginalMessage = (originalMessageId) => {
    const element = document.getElementById(`message-${originalMessageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger the highlight animation
      setHighlightedMessageId(originalMessageId);
      // Remove highlight after animation finishes
      setTimeout(() => setHighlightedMessageId(null), 2000); 
    }
  };

  // 2. Copy Message Text
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: You can set an `infoMessage` toast here saying "Copied to clipboard!"
  };

  // 3. Soft Delete Message
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Delete this message?")) {
      try {
        await updateDoc(doc(db, `chatrooms/${roomDocId}/messages`, messageId), {
          isDeleted: true,
          text: "This message was deleted",
          deletedAt: serverTimestamp() // Keeps a record of when it was removed
        });
      } catch (err) {
        console.error("Error deleting message:", err);
        setError("Could not delete message.");
      }
    }
  };

  // --- NEW STATES (Add near your other useState hooks) ---
  const [editingMessage, setEditingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // (Optional: Mock someone typing for testing the UI)
  const [someoneElseTyping, setSomeoneElseTyping] = useState(false);

  // --- NEW LOGIC: Handling Input & Typing ---
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Simple typing indicator logic
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      // In a full build, you'd update a Firestore doc here: updateDoc(roomRef, { typing: arrayUnion(uid) })
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
    }
  };

  // --- MODIFIED LOGIC: Unified Send/Edit Handler ---
  
  // --- NEW LOGIC: Trigger Edit Mode ---
  const handleEditClick = (message) => {
    setEditingMessage(message);
    setReplyingTo(null); // Cancel any active replies
    setNewMessage(message.text); // Populate input with old text
    document.getElementById('chat-input-field')?.focus();
  };

  // --- NEW LOGIC: Toggle Reactions ---
  const handleReaction = async (messageId, emoji, currentReactions = {}) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    
    // Copy current reactions object (e.g., { "👍": ["user1", "user2"], "❤️": ["user1"] })
    const updatedReactions = { ...currentReactions };
    
    if (!updatedReactions[emoji]) updatedReactions[emoji] = [];
    
    const hasReacted = updatedReactions[emoji].includes(uid);
    
    if (hasReacted) {
      // Remove reaction
      updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== uid);
      if (updatedReactions[emoji].length === 0) delete updatedReactions[emoji];
    } else {
      // Add reaction
      updatedReactions[emoji].push(uid);
    }

    try {
      await updateDoc(doc(db, `chatrooms/${roomDocId}/messages`, messageId), {
        reactions: updatedReactions
      });
    } catch (err) {
      console.error("Failed to update reaction", err);
    }
  };

  
  
  return (
    <Page>
      <StarryLayer />
      <AmbientLighting />
      <ForegroundRocks />
      <AppWindow>
        <SidebarNew />
      <ChatContainer>
        {/* --- Header --- */}
        <ChatHeader>
          <HeaderLeft>
            {/* Removed the hamburger button entirely */}
            <button onClick={() => navigate('/community')} style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <RoomName>{room ? room.name : 'Alpine Adventurers'}</RoomName>
          </HeaderLeft>
        </ChatHeader>
        
        {/* --- Message Area --- */}
        <MessageContainer ref={messageContainerRef}>
          {loading ? (
            <InfoMessage>Loading messages...</InfoMessage>
          ) : error && messages.length === 0 ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : infoMessage ? (
            <InfoMessage>{infoMessage}</InfoMessage>
          ) : messages.length === 0 && localMessages.length === 0 ? (
            <EmptyState>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>Quiet Room</h3>
              <p>Be the first to spark a conversation here.</p>
            </EmptyState>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <React.Fragment key={date}>
                <DateDivider>
                  <span>{date}</span>
                </DateDivider>
                
                {dateMessages.map((message) => {
                  const isCurrentUser = auth.currentUser && message.userId === auth.currentUser.uid;
                  const isDeleted = message.isDeleted; // Check soft delete status
                  
                  return (
                    <HighlightableMessageWrapper 
                      id={`message-${message.id}`} // Required for scroll targeting
                      key={message.id} 
                      $isCurrentUser={isCurrentUser}
                      $isLocal={message.isLocal}
                      $sendFailed={message.sendFailed}
                      $isSending={message.isLocal && message.sending}
                      $isHighlighted={highlightedMessageId === message.id} // Triggers CSS pulse
                    >
                      <Avatar src={message.userPhoto} $isCurrentUser={isCurrentUser} />
                      
                      <MessageContent>
                        {/* Hover Actions Menu */}
                        {/* Hover Actions Menu */}
                        {!message.isLocal && !message.isDeleted && (
                          <MessageActions $isCurrentUser={isCurrentUser}>
                            
                            {/* NEW: Quick Reactions */}
                            <QuickReactionMenu>
                              {['👍', '❤️', '😂'].map(emoji => (
                                <ActionButton 
                                  key={emoji} 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); // Forces the browser to ONLY fire the reaction function
                                    handleReaction(message.id, emoji, message.reactions);
                                  }}
                                >
                                  {emoji}
                                </ActionButton>
                              ))}
                            </QuickReactionMenu>

                            <ActionButton onClick={() => handleCopyText(message.text)} title="Copy">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </ActionButton>
                            
                            {/* NEW: Edit Button (Only for current user) */}
                            {isCurrentUser && (
                              <ActionButton onClick={() => handleEditClick(message)} title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              </ActionButton>
                            )}

                            {isCurrentUser && (
                              <ActionButton $danger onClick={() => handleDeleteMessage(message.id)} title="Delete">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </ActionButton>
                            )}
                          </MessageActions>
)}

                        <MessageBubble 
                          $isCurrentUser={isCurrentUser}
                          $isLocal={message.isLocal}
                          $sendFailed={message.sendFailed}
                          $sending={message.sending}
                        >
                          {/* Interactive Quoted Message */}
                          {message.replyTo && (
                            <QuotedMessage 
                              $isCurrentUser={isCurrentUser}
                              onClick={() => scrollToOriginalMessage(message.replyTo.id)} // Added Click handler
                            >
                              <strong>{message.replyTo.userName}</strong>
                              <span>{message.replyTo.text}</span>
                            </QuotedMessage>
                          )}

                          {/* THE FIX: Render the uploaded image if it exists */}
                          {message.imageUrl && !isDeleted && (
                            <MessageImage 
                              src={message.imageUrl} 
                              alt="Shared attachment" 
                            />
                          )}

                          {/* Render regular text OR deleted placeholder */}
                          {/* Only render MessageText if there is actual text or if it's deleted */}
                          {(message.text || isDeleted) && (
                            <MessageText>
                              {isDeleted ? (
                                <DeletedText>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity="0.5"/><path d="m15 9-6 6M9 9l6 6"/></svg>
                                  This message was deleted
                                </DeletedText>
                              ) : (
                                message.text
                              )}
                            </MessageText>
                          )}
                        </MessageBubble>

                        <MessageMeta $isCurrentUser={isCurrentUser}>
                          <UserName $isCurrentUser={isCurrentUser}>{message.userName}</UserName>
                          <MessageTimeText>
                            {message.isLocal && message.sending ? 'Sending...' : formatTime(message.timestamp)}
                          </MessageTimeText>
                          
                          {/* Only allow replying if message is NOT deleted */}
                          {!message.isLocal && isUserMember && !isDeleted && (
                            <ReplyButton onClick={() => handleReplyClick(message)}>
                              Reply
                            </ReplyButton>
                          )}
                        </MessageMeta>
                        {/* Render Reactions if they exist */}
                        {message.reactions && Object.keys(message.reactions).length > 0 && (
                          <ReactionRow $isCurrentUser={isCurrentUser}>
                            {Object.entries(message.reactions).map(([emoji, users]) => {
                              const hasReacted = auth.currentUser && users.includes(auth.currentUser.uid);
                              return (
                                <ReactionBadge 
                                  key={emoji} 
                                  $hasReacted={hasReacted}
                                  onClick={() => handleReaction(message.id, emoji, message.reactions)}
                                >
                                  {emoji} <span>{users.length}</span>
                                </ReactionBadge>
                              );
                            })}
                          </ReactionRow>
                        )}
                      </MessageContent>
                    </HighlightableMessageWrapper>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </MessageContainer>
        
        {/* --- Input Area --- */}
        <div>
          {/* Reply Preview Bar (Renders above input when replyingTo is set) */}
          {replyingTo && (
            <ReplyPreviewContainer>
              <ReplyInfo>
                <strong>Replying to {replyingTo.userName}</strong>
                <span>{replyingTo.text}</span>
              </ReplyInfo>
              <CancelReplyButton type="button" onClick={() => setReplyingTo(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </CancelReplyButton>
            </ReplyPreviewContainer>
          )}
          {/* Typing Indicator */}
          {someoneElseTyping && (
            <TypingContainer>
              <TypingDots><span></span><span></span><span></span></TypingDots>
              Someone is typing...
            </TypingContainer>
          )}

          {/* Editing Preview Bar (Similar to Reply Preview) */}
          {editingMessage && (
            <ReplyPreviewContainer>
              <ReplyInfo>
                <strong>Editing Message</strong>
                <span>{editingMessage.text}</span>
              </ReplyInfo>
              <CancelReplyButton type="button" onClick={() => {
                setEditingMessage(null);
                setNewMessage('');
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </CancelReplyButton>
            </ReplyPreviewContainer>
          )}
          {/* --- Input Area --- */}
          <div style={{ position: 'relative', width: '100%' }}>
            
            {/* THE EMOJI PICKER MENU */}
            {showEmojiPicker && (
              <EmojiPickerContainer ref={emojiPickerRef}>
                <React.Suspense fallback={<div style={{color: 'white'}}>Loading...</div>}>
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick} 
                    theme="dark" 
                  />
                </React.Suspense>
              </EmojiPickerContainer>
            )}

            {/* ... Your Reply Preview & Typing Indicators stay here ... */}

            <ChatForm onSubmit={handleSendMessage}>
              <ActionCircleButton type="button" title="Add Attachment">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </ActionCircleButton>
              
              <MessageInputContainer>
                <MessageInput
                  id="chat-input-field"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={editingMessage ? "Editing message..." : "Type a message..."}
                  disabled={!isUserMember || loading}
                />
                
                {/* THE UPDATED EMOJI BUTTON */}
                <InputIconButton 
                  type="button" 
                  title="Add Emoji" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the document click listener from firing
                    setShowEmojiPicker(prev => !prev);
                  }}
                >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </InputIconButton>

                <SendButton type="submit" disabled={!newMessage.trim() || !isUserMember || loading}>
                  {editingMessage ? 'Save' : 'Send'} 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </SendButton>
              </MessageInputContainer>
            </ChatForm>
          </div>
        </div>
      </ChatContainer>
      </AppWindow>
    </Page>
  );
};

export default ChatRoom;