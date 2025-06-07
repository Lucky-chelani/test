import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const textFade = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const buttonPulse = keyframes`
  0% { box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 8px 30px rgba(239, 68, 68, 0.5); }
  100% { box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3); }
`;

const waveAnimation = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
`;

const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  /* Enhanced gradient background */  background: ${({ $scrolled, $transparent }) => 
    $transparent 
      ? $scrolled 
        ? 'linear-gradient(to bottom, rgba(9, 14, 29, 0.96), rgba(12, 20, 39, 0.88))' 
        : 'linear-gradient(to bottom, rgba(9, 14, 29, 0.75), rgba(12, 20, 39, 0.6))' 
      : 'linear-gradient(to right, rgba(12, 20, 39, 0.98), rgba(17, 24, 39, 0.98))'};
  backdrop-filter: blur(18px); /* Increased blur for better readability */
  box-shadow: ${({ $scrolled }) => $scrolled ? '0 4px 25px rgba(0, 0, 0, 0.25)' : 'none'}; 
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  padding: 0 max(28px, 5%);
  height: ${({ $scrolled }) => ($scrolled ? '70px' : '85px')};
  animation: ${fadeIn} 0.6s ease-out;
  /* Scroll progress indicator */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: ${({ $scrollProgress }) => `${$scrollProgress || 0}%`};
    background: linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b);
    background-size: 200% 100%;
    animation: ${buttonFlare} 8s ease infinite;
    z-index: 102;
    transition: width 0.3s ease-out;
    opacity: ${({ $scrolled }) => ($scrolled ? '1' : '0')};
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
  }
  
  /* Bottom border */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ $scrolled }) => 
      $scrolled 
        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)' 
        : 'transparent'};
    opacity: 0.7;
  }

  @media (max-width: 1024px) {
    padding: 0 20px;
    height: ${({ $scrolled }) => ($scrolled ? '70px' : '80px')};
  }
  
  @media (max-width: 768px) {
    padding: 0 16px;
    height: 70px;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    height: 65px;
  }
`;

const logoGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.7)); }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 2rem;
  color: #fff;
  margin-right: 55px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 5;
  cursor: pointer;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);

  &:hover { 
    transform: scale(1.05) translateY(-2px); 
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #f59e0b, rgba(239, 68, 68, 0.7), rgba(255, 255, 255, 0));
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
  }

  &:hover:after {
    width: 100%;
  }

  .logo-text {
    font-weight: 900;
    letter-spacing: -0.02em;
    background: linear-gradient(90deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    font-size: 1.5rem;
    margin-left: 10px;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.15);
  }
  img {
    height: 44px;
    margin-right: 0;
    filter: drop-shadow(0 2px 15px rgba(255, 255, 255, 0.4));
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    animation: ${logoGlow} 3s infinite ease-in-out;
    border-radius: 10px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent);
      mix-blend-mode: overlay;
      pointer-events: none;
    }
  }
  
  &:hover img {
    filter: drop-shadow(0 4px 20px rgba(255, 255, 255, 0.7));
    transform: translateY(-3px) scale(1.05);
  }

  @media (max-width: 768px) {
    margin-right: 0;
    img { height: 36px; }
    .logo-text { font-size: 1.3rem; }
  }
`;

const shimmer = keyframes`
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
`;

const textPulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(255, 255, 255, 0); }
  50% { text-shadow: 0 0 12px rgba(255, 255, 255, 0.3); }
`;

const linkHoverEffect = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 38px;
  flex: 1;
  margin-left: 15px;

  a {
    position: relative;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 8px 16px;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    letter-spacing: 0.4px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
      z-index: -1;
    }    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 50%;
      background: linear-gradient(90deg, #f59e0b, #ef4444);
      transform: translateX(-50%);
      transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
      border-radius: 2px;
      opacity: 0;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    }
      &.active-link {
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
      animation: ${textPulse} 3s infinite ease-in-out;
      background: rgba(255, 255, 255, 0.07);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      
      &::after { 
        width: 70%;
        opacity: 1;
        background: linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b);
        background-size: 200% 100%;
        animation: ${linkHoverEffect} 3s infinite ease-in-out;
        height: 3px;
      }
    }
    
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.07);
      transform: translateY(-3px);
      &::after { width: 45%; opacity: 0.7; }
      &::before { transform: translateX(100%); }
    }
  }

  @media (max-width: 1100px) {
    gap: 24px;
    a { font-size: 0.9rem; padding: 6px 12px; letter-spacing: 0.3px; }
  }  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: linear-gradient(170deg, rgba(12, 20, 39, 0.98), rgba(17, 24, 39, 0.95));
    padding: 30px 20px 120px;
    gap: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    backdrop-filter: blur(20px);
    z-index: 99;
    
    /* Enhanced animation and visibility */
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-15px)')};
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    }    a {
      padding: 18px 16px;
      width: 100%;
      text-align: center;
      border-radius: 16px;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.03);
      margin-bottom: 4px;
      letter-spacing: 1.2px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;      &.active-link { 
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1));
        border-color: rgba(239, 68, 68, 0.15);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: ${waveAnimation} 3s infinite;
          z-index: -1;
        }
        
        &::after { 
          content: '';
          position: absolute;
          width: 30px;
          height: 3px;
          bottom: initial;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b);
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
          background-size: 200% 100%;
          animation: ${buttonFlare} 3s infinite;
        }
      }
      
      &:hover { 
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-3px); 
        border-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column;
    background: linear-gradient(to top, rgba(9, 14, 29, 0.98), rgba(12, 20, 39, 0.95));
    padding: 25px 20px;
    gap: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.25);
    z-index: 99;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    
    /* Enhanced animation and visibility */
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(20px)')};
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    
    &::before {
      content: '';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
  }
`;

const borderPulse = keyframes`
  0% { border-color: rgba(255, 255, 255, 0.4); }
  50% { border-color: rgba(255, 255, 255, 0.8); }
  100% { border-color: rgba(255, 255, 255, 0.4); }
`;

const OutlinedBtn = styled(Link)`
  padding: 11px 28px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.8px;
  align-items: center;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  backdrop-filter: blur(5px);
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -100%;
    width: 100%;
    height: 300%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transform: rotate(30deg);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fff;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
    animation: ${borderPulse} 2s infinite;
    
    &::before {
      left: 200%;
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  }
    @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 16px;
    font-size: 1.05rem;
    border-radius: 16px;
  }
`;

const FilledBtn = styled(Link)`
  padding: 12px 30px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b);
  background-size: 300% 300%;
  animation: ${buttonFlare} 8s ease infinite;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -100%;
    width: 100%;
    height: 200%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transform: rotate(25deg);
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
    animation: ${buttonPulse} 2s infinite;
    
    &::before {
      left: 200%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
    box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 16px;
    font-size: 1.05rem;
    border-radius: 16px;
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const AccountIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const AccountCircle = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b);
  background-size: 300% 300%;
  animation: ${buttonFlare} 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.15);
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.2);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    transform: translateY(-4px) scale(1.08);
    border-color: rgba(255, 255, 255, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.03);
  }

  svg {
    color: #fff;
    width: 24px;
    height: 24px;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
  
  &:hover svg {
    transform: scale(1.15);
  }

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
    border-width: 3px;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
  }
`;

const overlayAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(9, 14, 29, 0.8));
  background-size: 400% 400%;
  z-index: 90;
  backdrop-filter: blur(8px);
  
  /* Enhanced animation */
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${({ $isOpen }) => ($isOpen ? css`${overlayAnimation} 15s ease infinite` : 'none')};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const toastAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-25px);
    filter: blur(4px);
  }
  10% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    filter: blur(0);
  }
  90% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-25px);
    filter: blur(4px);
  }
`;

const toastGlow = keyframes`
  0%, 100% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15); }
`;

const Toast = styled.div`
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to right, rgba(9, 14, 29, 0.95), rgba(17, 24, 39, 0.95));
  color: #fff;
  padding: 16px 28px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 110;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(15px);
  animation: ${toastAnimation} 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, 
             ${toastGlow} 2s infinite ease-in-out;
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  gap: 8px;
  max-width: 90%;
  min-width: 300px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1.5px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  span {
    font-weight: 700;
    color: #f59e0b;
    animation: ${textFade} 2s infinite ease-in-out;
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
  }
  
  .toast-emoji {
    display: inline-block;
    margin-left: 6px;
    font-size: 1.2rem;
    animation: ${textFade} 1.5s infinite ease-in-out;
  }
  
  @media (max-width: 480px) {
    padding: 14px 24px;
    font-size: 0.9rem;
  }
`;

const menuButtonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
`;

const MenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 101;
  
  &:hover { 
    background: rgba(255, 255, 255, 0.1); 
    animation: ${menuButtonGlow} 2s infinite;
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active { 
    transform: scale(0.95); 
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HamburgerIcon = styled.div`
  width: 24px;
  height: 18px;
  position: relative;

  span {
    position: absolute;
    height: 2px;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);

    &:nth-child(1) {
      top: ${({ $isOpen }) => ($isOpen ? '8px' : '0')};
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'none')};
      width: ${({ $isOpen }) => ($isOpen ? '100%' : '70%')};
      left: ${({ $isOpen }) => ($isOpen ? '0' : 'auto')};
      right: ${({ $isOpen }) => ($isOpen ? 'auto' : '0')};
    }
    &:nth-child(2) {
      top: 8px;
      opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
      transform: ${({ $isOpen }) => ($isOpen ? 'translateX(10px)' : 'none')};
      width: 100%;
    }
    &:nth-child(3) {
      top: ${({ $isOpen }) => ($isOpen ? '8px' : '16px')};
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-45deg)' : 'none')};
      width: ${({ $isOpen }) => ($isOpen ? '100%' : '85%')};
    }
  }
`;

const statusPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 237, 136, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(74, 237, 136, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 237, 136, 0); }
`;

const UserStatus = styled.div`
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(to right, #4aed88, #38c476);
  border: 2px solid #fff;
  animation: ${statusPulse} 2s infinite;
  z-index: 1;
  box-shadow: 0 0 8px rgba(74, 237, 136, 0.6);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const UserName = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-left: 10px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
    font-size: 1rem;
    font-weight: 700;
  }
`;

const Navbar = ({ active, transparent = true, initialScrolled = false }) => {
  const [scrolled, setScrolled] = useState(initialScrolled);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimeoutRef = useRef(null);
  const navbarRef = useRef(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    // Enhanced scroll handler with progress calculation
    const handleScroll = () => {
      setScrolled(window.scrollY > 20 || initialScrolled);
      
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100));
      setScrollProgress(currentProgress);
    };
    
    window.addEventListener('scroll', handleScroll);

    // Force initial state based on prop
    setScrolled(initialScrolled);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initialScrolled]);

  useEffect(() => { 
    if (isOpen) {
      setIsOpen(false);
      document.body.style.overflow = 'visible';
    }
  }, [location]);
  
  // Clear toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Prevent body scroll when menu is open
    if (newIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  };

  const handleUpcomingFeature = e => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3500);
  };

  const handleAccountClick = () => {
    navigate('/profile');
    setIsOpen(false);
    document.body.style.overflow = 'visible';
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsOpen(false);
      document.body.style.overflow = 'visible';
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  
  // Get first name for display
  const getFirstName = () => {
    if (user && user.displayName) {
      return user.displayName.split(' ')[0];
    }
    return '';
  };
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };  return (
    <>
      <NavbarWrapper 
        ref={navbarRef} 
        $scrolled={scrolled} 
        $transparent={transparent}
        $scrollProgress={scrollProgress}
      >
        <Logo onClick={() => {
          if (location.pathname === '/') {
            scrollToTop();
          } else {
            navigate('/');
          }
        }}>
          <img src={require('../assets/images/logo.png')} alt="Trek Explorer" />
        </Logo>
        <NavLinks $isOpen={isOpen}>
          <Link to="/" className={location.pathname==='/' || active==='home' ? 'active-link':''}>
            Discover
          </Link>
          <Link to="/explore" className={location.pathname==='/explore'|| active==='explore' ? 'active-link':''}>
            Adventures
          </Link>
          <Link to="/community"
            className={location.pathname==='/community'|| active==='community'? 'active-link':''}

          >
            Community
          </Link>
          <Link to="/blog"
            className={location.pathname==='/blog'|| active==='blog'? 'active-link':''}
          >
            Journal
          </Link>
          <Link to="/rewards"
            className={location.pathname==='/rewards'|| active==='rewards'? 'active-link':''}
            onClick={handleUpcomingFeature}
          >
            Rewards
          </Link>
          <Link to="/about"
            className={location.pathname==='/about'|| active==='about'? 'active-link':''}
          >
            Our Story
          </Link>
        </NavLinks>
        
        <NavActions $isOpen={isOpen}>
          {!user ? (
            <>
              <OutlinedBtn to="/login">Access</OutlinedBtn>
              <FilledBtn to="/signup">Join Now</FilledBtn>
            </>
          ) : (
            <AccountIconWrapper>
              <AccountCircle onClick={handleAccountClick} title="Profile">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4.2" stroke="#3c3c3c" strokeWidth="2"/>
                    <path d="M4.5 19c0-3.2 3.1-5.5 7.5-5.5s7.5 2.3 7.5 5.5" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
                <UserStatus />
              </AccountCircle>
              {user.displayName && <UserName>Hi, {getFirstName()}</UserName>}
              {isOpen && (
                <OutlinedBtn as="button" onClick={handleSignOut} style={{ marginTop: 12 }}>
                  Log Out
                </OutlinedBtn>
              )}
            </AccountIconWrapper>
          )}
        </NavActions>

        <MenuButton 
          onClick={toggleMenu} 
          aria-label="Toggle menu" 
          aria-expanded={isOpen}
        >
          <HamburgerIcon $isOpen={isOpen}>
            <span /><span /><span />
          </HamburgerIcon>
        </MenuButton>
      </NavbarWrapper>

      <Overlay $isOpen={isOpen} onClick={toggleMenu} />
      
      <Toast $show={showToast}>
        <span>Coming Soon!</span> We're crafting something extraordinary for you <span className="toast-emoji">✨</span>
      </Toast>
    </>
  );
};

export default Navbar;
