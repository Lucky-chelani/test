import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiX, FiCalendar, FiUser, FiPhone, FiMessageSquare, FiCreditCard, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { processBookingPayment, completeBookingPayment, handleBookingPaymentFailure } from '../utils/bookingService';
import { loadRazorpayScript } from '../services/payment/razorpay';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CouponSection from './CouponSection';
import emailService from '../services/emailService';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) translateY(40px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(51, 153, 204, 0.1) 100%);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  width: 100%;
  max-width: 650px;
  max-height: 95vh;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  animation: ${scaleIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3399cc, #00b4db, #3399cc);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.05) 0%, rgba(0, 180, 219, 0.05) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid rgba(51, 153, 204, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #3399cc, #00b4db);
    border-radius: 1px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2c5aa0 0%, #3399cc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.025em;
  animation: ${slideInFromLeft} 0.6s ease-out;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(51, 153, 204, 0.2);
  cursor: pointer;
  font-size: 1.2rem;
  color: #64748b;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideInFromRight} 0.6s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border-color: #ff6b6b;
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  flex: 1;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(51, 153, 204, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3399cc, #00b4db);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2388bb, #0095b6);
  }
`;

const TrekInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.05) 0%, rgba(0, 180, 219, 0.05) 100%);
  padding: 1.5rem;
  border-radius: 16px;
  border: 2px solid rgba(51, 153, 204, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: ${shimmer} 2s infinite;
  }
`;

const TrekImage = styled.img`
  width: 100px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const TrekDetails = styled.div`
  flex: 1;
`;

const TrekName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2c5aa0 0%, #3399cc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const TrekLocation = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '📍';
    font-size: 0.9rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
  color: #2c5aa0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.01em;

  svg {
    color: #3399cc;
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid rgba(51, 153, 204, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    border-color: #3399cc;
    background: #ffffff;
    box-shadow: 
      0 0 0 4px rgba(51, 153, 204, 0.1),
      0 4px 12px rgba(51, 153, 204, 0.15);
    transform: translateY(-2px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(51, 153, 204, 0.4);
    transform: translateY(-1px);
  }
`;

const Select = styled.select`
  padding: 1rem 1.25rem;
  border: 2px solid rgba(51, 153, 204, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  cursor: pointer;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  &:focus {
    border-color: #3399cc;
    background: #ffffff;
    box-shadow: 
      0 0 0 4px rgba(51, 153, 204, 0.1),
      0 4px 12px rgba(51, 153, 204, 0.15);
    transform: translateY(-2px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(51, 153, 204, 0.4);
    transform: translateY(-1px);
  }
`;

const Textarea = styled.textarea`
  padding: 1rem 1.25rem;
  border: 2px solid rgba(51, 153, 204, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  resize: vertical;
  min-height: 100px;
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    border-color: #3399cc;
    background: #ffffff;
    box-shadow: 
      0 0 0 4px rgba(51, 153, 204, 0.1),
      0 4px 12px rgba(51, 153, 204, 0.15);
    transform: translateY(-2px);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(51, 153, 204, 0.4);
    transform: translateY(-1px);
  }
`;

const FieldHelpText = styled.div`
  font-size: 0.9rem;
  color: #2c5aa0;
  margin-top: 8px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.08) 0%, rgba(0, 180, 219, 0.08) 100%);
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 4px solid #3399cc;
  font-weight: 500;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 3s infinite;
  }
  
  svg {
    color: #3399cc;
    margin-right: 8px;
    font-size: 1rem;
  }
`;

const AvailableDatesContainer = styled.div`
  margin-top: 12px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.05) 0%, rgba(0, 180, 219, 0.05) 100%);
  border-radius: 16px;
  border: 2px solid rgba(51, 153, 204, 0.2);
  box-shadow: 
    0 4px 12px rgba(51, 153, 204, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: ${bounceIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3399cc, #00b4db, #3399cc);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const AvailableDatesTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #2c5aa0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  svg {
    color: #3399cc;
    font-size: 1.1rem;
  }
`;

const AvailableDatesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const AvailableDateChip = styled.button`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #3399cc 0%, #00b4db 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  color: ${props => props.selected ? 'white' : '#2c5aa0'};
  border: 2px solid ${props => props.selected ? '#3399cc' : 'rgba(51, 153, 204, 0.3)'};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.selected 
    ? '0 6px 20px rgba(51, 153, 204, 0.3)' 
    : '0 2px 8px rgba(51, 153, 204, 0.1)'
  };
  transform: ${props => props.selected ? 'translateY(-2px)' : 'translateY(0)'};
  position: relative;
  min-width: 90px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: ${props => props.selected 
      ? 'linear-gradient(135deg, #2388bb 0%, #0095b6 100%)' 
      : 'linear-gradient(135deg, #3399cc 0%, #00b4db 100%)'
    };
    color: white;
    border-color: #3399cc;
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 25px rgba(51, 153, 204, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 0 4px 12px rgba(51, 153, 204, 0.2);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(51, 153, 204, 0.2);
  }
`;

const PriceSummary = styled.div`
  margin-top: 1.5rem;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.05) 0%, rgba(0, 180, 219, 0.05) 100%);
  padding: 1.75rem;
  border-radius: 16px;
  border: 2px solid rgba(51, 153, 204, 0.15);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out 0.4s both;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3399cc, #00b4db, #3399cc);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c5aa0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(51, 153, 204, 0.1);
  }
`;

const PriceTotal = styled(PriceItem)`
  margin-top: 0.75rem;
  padding-top: 1.25rem;
  border-top: 2px solid rgba(51, 153, 204, 0.2);
  font-weight: 700;
  font-size: 1.4rem;
  color: #2c5aa0;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.08) 0%, rgba(0, 180, 219, 0.08) 100%);
  margin: 0.75rem -1.75rem -1.75rem;
  padding: 1.25rem 1.75rem;
  border-radius: 0 0 14px 14px;
  
  span:last-child {
    background: linear-gradient(135deg, #3399cc 0%, #00b4db 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ModalFooter = styled.div`
  padding: 1.75rem 2rem;
  background: linear-gradient(135deg, rgba(51, 153, 204, 0.02) 0%, rgba(0, 180, 219, 0.02) 100%);
  border-top: 2px solid rgba(51, 153, 204, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #3399cc, #00b4db);
    border-radius: 1px;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.01em;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 2px solid #cbd5e1;
  color: #475569;
  min-width: 120px;

  &:hover {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    border-color: #94a3b8;
    color: #334155;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(71, 85, 105, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(71, 85, 105, 0.1);
  }
`;

const ProceedButton = styled(Button)`
  background: linear-gradient(135deg, #3399cc 0%, #00b4db 100%);
  border: 2px solid #3399cc;
  color: white;
  min-width: 180px;
  box-shadow: 0 4px 15px rgba(51, 153, 204, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2388bb 0%, #0095b6 100%);
    border-color: #2388bb;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(51, 153, 204, 0.4);
  }

  &:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    border-color: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(51, 153, 204, 0.3);
  }
`;

const PaymentButton = styled(ProceedButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border-color: #059669;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }
  
  &:active:not(:disabled) {
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 2px solid rgba(239, 68, 68, 0.2);
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${bounceIn} 0.5s ease-out;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  svg {
    color: #dc2626;
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  border: 2px solid rgba(16, 185, 129, 0.2);
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: ${bounceIn} 0.5s ease-out;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmer} 2s infinite;
  }
  
  svg {
    color: #059669;
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  div {
    line-height: 1.5;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.active ? '#3399cc' : '#94a3b8'};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #3399cc 0%, #00b4db 100%)' 
    : props.completed 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : '#e2e8f0'
  };
  color: ${props => (props.active || props.completed) ? 'white' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active 
    ? '0 4px 12px rgba(51, 153, 204, 0.3)' 
    : 'none'
  };
`;

const StepConnector = styled.div`
  width: 40px;
  height: 2px;
  background: ${props => props.completed 
    ? 'linear-gradient(90deg, #10b981, #059669)' 
    : '#e2e8f0'
  };
  transition: all 0.3s ease;
`;

const LoadingIndicator = styled.div`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { 
      transform: rotate(360deg); 
    }
  }
`;

// Main Component
const BookingModal = ({ isOpen, onClose, trek, onBookingSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: '',
    participants: 1,
    name: '',
    email: '',
    contactNumber: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [bookingId, setBookingId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Coupon related states
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Get the number of days from the start of the current month to create a minimum date
  const today = new Date();
  const minBookingDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Create a function to check if a date is available for booking
  const isDateAvailable = (dateString) => {
    const date = new Date(dateString);
    
    // Check if the date is in the past
    if (date < today) {
      return false;
    }
    
    // If specific available dates are defined, check against them FIRST (highest priority)
    if (trek.availableDates && Array.isArray(trek.availableDates) && trek.availableDates.length > 0) {
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      console.log("Checking if date", formattedDate, "is in available dates:", trek.availableDates);
      return trek.availableDates.includes(formattedDate);
    }
    
    // Fallback to available months check if no specific dates are set
    if (trek.availableMonths && Array.isArray(trek.availableMonths) && trek.availableMonths.length > 0) {
      const month = date.getMonth(); // 0-indexed (January is 0)
      return trek.availableMonths.includes(month);
    }
    
    // If neither availableDates nor availableMonths are defined, allow all future dates
    return true;
  };
  
  // Function to get availability display text
  const getAvailabilityDisplay = () => {
    // If specific dates are available, show date count
    if (trek.availableDates && trek.availableDates.length > 0) {
      const futureDates = trek.availableDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date >= today;
      });
      
      if (futureDates.length === 0) {
        return 'No dates currently available';
      }
      
      if (futureDates.length <= 5) {
        // Show actual dates if there are 5 or fewer
        return futureDates.map(dateStr => {
          const date = new Date(dateStr);
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        }).join(', ');
      } else {
        return `${futureDates.length} specific dates available`;
      }
    }
    
    // Fallback to available months
    if (trek.availableMonths && trek.availableMonths.length > 0) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      return trek.availableMonths
        .sort((a, b) => a - b)
        .map(monthIndex => monthNames[monthIndex])
        .join(', ');
    }
    
    return 'All year';
  };
    useEffect(() => {
    const getCurrentUser = async () => {
      if (auth.currentUser) {
        setFormData(prevData => ({
          ...prevData, 
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
        }));
      }
    };
    
    if (isOpen) {
      getCurrentUser();
      
      // Reset coupon state when modal opens
      setActiveCoupon(null);
      setDiscountAmount(0);
      
      // Set original amount based on trek price
      const basePrice = trek?.numericPrice || parseInt(trek?.price?.replace(/[^0-9]/g, '')) || 0;
      setOriginalAmount(basePrice);
      
      // Load Razorpay script when modal opens
      loadRazorpayScript().catch(err => {
        console.error("Failed to load Razorpay script:", err);
        setPaymentError("Failed to load payment gateway. Please try again.");
      });
    }
  }, [isOpen, trek]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (!isDateAvailable(formData.startDate)) {
      if (trek.availableDates && Array.isArray(trek.availableDates) && trek.availableDates.length > 0) {
        const futureDates = trek.availableDates.filter(dateStr => {
          const date = new Date(dateStr);
          return date >= today;
        });
        
        if (futureDates.length === 0) {
          newErrors.startDate = "No dates are currently available for this trek.";
        } else {
          newErrors.startDate = "This date is not available for booking. Please select from the available dates shown below.";
        }
      } else if (trek.availableMonths && Array.isArray(trek.availableMonths) && trek.availableMonths.length > 0) {
        newErrors.startDate = `This trek is only available during: ${getAvailabilityDisplay()}`;
      } else {
        newErrors.startDate = "Selected date is not available for booking.";
      }
    }
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for date input to provide immediate feedback
    if (name === 'startDate' && value) {
      const isValidDate = isDateAvailable(value);
      if (!isValidDate) {
        // Set a temporary error to provide immediate feedback
        if (trek.availableDates && Array.isArray(trek.availableDates) && trek.availableDates.length > 0) {
          const futureDates = trek.availableDates.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= today;
          });
          
          setErrors(prevErrors => ({
            ...prevErrors,
            startDate: futureDates.length === 0 
              ? "No dates are currently available for this trek."
              : "This date is not available for booking. Please select from the available dates shown below."
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            startDate: `This trek is only available during: ${getAvailabilityDisplay()}`
          }));
        }
      } else {
        // Clear the error if the date is valid
        setErrors(prevErrors => ({
          ...prevErrors,
          startDate: undefined
        }));
      }
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited (except for the special date handling above)
    if (errors[name] && name !== 'startDate') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const handleDateChipClick = (dateString) => {
    setFormData(prevData => ({
      ...prevData,
      startDate: dateString
    }));
    
    // Clear date error if it exists
    if (errors.startDate) {
      setErrors(prevErrors => ({
        ...prevErrors,
        startDate: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep(2);
    }
  };
  const calculateTotalPrice = () => {
    const basePrice = trek?.numericPrice || parseInt(trek?.price?.replace(/[^0-9]/g, '')) || 0;
    const subtotal = basePrice * formData.participants;
    
    // If there's an active coupon, apply the discount
    if (activeCoupon) {
      return Math.max(subtotal - discountAmount, 0);
    }
    return subtotal;
  };
  
  // Handle coupon application
  const handleApplyCoupon = (coupon) => {
    if (coupon) {
      setActiveCoupon(coupon);
      setDiscountAmount(coupon.calculatedDiscount);
      setPaymentError(null);
    } else {
      setActiveCoupon(null);
      setDiscountAmount(0);
    }
  };  const handlePaymentProcess = async () => {
    try {
      setIsProcessingPayment(true);
      setPaymentError(null);
      
      // Calculate final amounts
      const total = calculateTotalPrice();
      const baseAmount = trek?.numericPrice * formData.participants || total;
      
      // Process payment through Razorpay with coupon data if available
      const paymentResult = await processBookingPayment(trek, {
        ...formData,
        amount: total,
        // Include coupon information if available
        coupon: activeCoupon ? {
          id: activeCoupon.id,
          code: activeCoupon.code,
          discount: discountAmount,
          discountType: activeCoupon.discountType,
          originalAmount: baseAmount,
          finalAmount: total
        } : null
      });
      
      if (paymentResult.success) {
        // Store bookingId in component state
        const orderId = paymentResult.orderId || `order_${Date.now()}`;
        setBookingId(orderId);
        
        // Also store it in global variable for redundancy/recovery
        window.lastRazorpayBookingId = orderId;
        
        console.log('Payment initiated with booking ID:', orderId);
        
        // Log all places where the bookingId is stored
        console.log('BookingID stored in: 1) Component state:', orderId, 
                   '2) Global variable:', window.lastRazorpayBookingId);
        
        // Razorpay will open its payment window automatically
        // We'll handle success in a callback from Razorpay
      } else {
        setPaymentError(paymentResult.error || "Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };// Define handlePaymentSuccess as a useCallback to fix the dependency warning
  const handlePaymentSuccess = useCallback(async (response) => {
    try {
      setIsProcessingPayment(true);
      
      if (!bookingId) {
        console.warn('⚠️ No bookingId set in component state before payment success');
      }
      
      // Make sure we're sending the bookingId through ALL possible paths for maximum redundancy
      const paymentResponse = {
        ...response,
        bookingId: bookingId || response.bookingId || response.razorpay_order_id,
        orderId: bookingId || response.razorpay_order_id, 
        verifiedBookingId: bookingId, // Add a dedicated field that won't be accidentally overwritten
        // Store in notes as well for triple redundancy
        notes: {
          ...(response.notes || {}),
          bookingId: bookingId || response.notes?.bookingId,
          backupId: bookingId // Another backup path
        }
      };
      
      // Also set the global backup variable for extra redundancy
      window.lastRazorpayBookingId = bookingId || 
                                     response.bookingId || 
                                     response.razorpay_order_id || 
                                     response.notes?.bookingId;
      
      console.log('Processing payment success with bookingId:', bookingId, 'and response:', paymentResponse);
      
      // Double-check that we have a valid ID to use (any of these should work)
      let effectiveBookingId = bookingId || 
                              paymentResponse.bookingId || 
                              paymentResponse.razorpay_order_id ||
                              paymentResponse.notes?.bookingId || 
                              paymentResponse.notes?.backupId ||
                              window.lastRazorpayBookingId;
                              
      // Always ensure we have SOME bookingId, even if we need to generate one
      if (!effectiveBookingId) {
        const fallbackId = `fallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        console.warn(`⚠️ No bookingId found in any path, using fallback: ${fallbackId}`);
        effectiveBookingId = fallbackId;
        
        // Update the response object with the fallback ID
        paymentResponse.bookingId = fallbackId;
        paymentResponse.fallbackIdGenerated = true;
      }
      
      console.log('✅ Final booking ID for payment verification:', effectiveBookingId);
      
      // Verify and complete the payment - pass both parameters
      const completedBooking = await completeBookingPayment(effectiveBookingId, paymentResponse);
      
      // Send confirmation email
      try {
        console.log('📧 Sending booking confirmation email...');
        console.log('🔍 Current formData:', formData);
        console.log('🔍 Completed booking data:', completedBooking);
        
        // Fetch the complete booking data directly from Firestore to ensure we have all fields
        console.log('🔄 Fetching complete booking data from Firestore...');
        const bookingRef = doc(db, 'bookings', effectiveBookingId);
        const bookingSnap = await getDoc(bookingRef);
        
        let completeBookingData = null;
        if (bookingSnap.exists()) {
          completeBookingData = { id: bookingSnap.id, ...bookingSnap.data() };
          console.log('✅ Retrieved complete booking data from Firestore:', completeBookingData);
        } else {
          console.warn('⚠️ Booking not found in Firestore, using available data');
          completeBookingData = completedBooking || formData;
        }
        
        // Prepare booking data for email with multiple fallbacks
        const emailBookingData = {
          id: effectiveBookingId,
          bookingId: effectiveBookingId,
          name: completeBookingData.name || 
                completeBookingData.userName || 
                completedBooking?.name || 
                formData.name || 
                'Customer',
          email: completeBookingData.email || 
                 completeBookingData.userEmail || 
                 completedBooking?.email || 
                 formData.email,
          contactNumber: completeBookingData.contactNumber || 
                        completeBookingData.phoneNumber || 
                        completedBooking?.contactNumber || 
                        formData.contactNumber || 
                        'Not provided',
          startDate: completeBookingData.startDate || 
                     completeBookingData.trekDate || 
                     completedBooking?.startDate || 
                     formData.startDate || 
                     'Date not specified',
          participants: completeBookingData.participants || 
                       completeBookingData.numberOfParticipants || 
                       completedBooking?.participants || 
                       formData.participants || 
                       1,
          totalAmount: completeBookingData.totalAmount || 
                      completeBookingData.amount || 
                      calculateTotalPrice(),
          paymentId: paymentResponse.razorpay_payment_id,
          status: 'confirmed',
          paymentStatus: 'completed',
          specialRequests: completeBookingData.specialRequests || 
                          completeBookingData.notes || 
                          completedBooking?.specialRequests || 
                          formData.specialRequests || 
                          'None',
          discountAmount: discountAmount,
          createdAt: completeBookingData.createdAt || new Date().toISOString()
        };
        
        console.log('📤 Email booking data prepared with fallbacks:', emailBookingData);
        
        // Validate that we have the minimum required data for email
        if (!emailBookingData.email) {
          console.error('❌ Cannot send email: No email address available');
          console.warn('⚠️ Email sending skipped due to missing email address');
          return;
        }
        
        // Send the email
        const emailSent = await emailService.sendConfirmationEmail(emailBookingData, trek);
        
        if (emailSent) {
          console.log('✅ Booking confirmation email sent successfully');
        } else {
          console.warn('⚠️ Failed to send confirmation email, but booking was successful');
        }
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
        // Don't fail the booking process if email fails
      }
      
      // Show success message
      setPaymentSuccess(true);
      
      // Notify parent component
      if (onBookingSuccess) {
        onBookingSuccess(effectiveBookingId || bookingId);
      }
      
      // Navigate to booking confirmation page
      navigate(`/booking-confirmation/${effectiveBookingId}`);
      
      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
      // Reset form state
        setStep(1);
        setFormData({
          startDate: '',
          participants: 1,
          name: '',
          email: '',
          contactNumber: '',
          specialRequests: ''
        });
        setPaymentSuccess(false);
        setBookingId(null);
        setActiveCoupon(null);
        setDiscountAmount(0);
      }, 3000);
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentError(error.message || "Failed to verify payment");
    } finally {
      setIsProcessingPayment(false);
    }
  }, [bookingId, onBookingSuccess, onClose, navigate]); // Added navigate to dependencies

  // Define handlePaymentFailure as a useCallback to fix the dependency warning
  const handlePaymentFailure = useCallback(async (error) => {
    try {
      if (bookingId) {
        await handleBookingPaymentFailure(bookingId, error);
      }
      
      // Send payment failure email if we have user email
      if (formData.email && formData.name) {
        try {
          console.log('📧 Sending payment failure email...');
          
          const emailBookingData = {
            id: bookingId || 'unknown',
            name: formData.name,
            email: formData.email,
            contactNumber: formData.contactNumber,
            startDate: formData.startDate,
            participants: formData.participants,
            totalAmount: calculateTotalPrice(),
            errorMessage: error.description || error.message || "Payment processing failed"
          };
          
          await emailService.sendPaymentFailureEmail(emailBookingData, trek, error.description || error.message || "Payment failed");
          console.log('✅ Payment failure email sent successfully');
        } catch (emailError) {
          console.error('❌ Error sending payment failure email:', emailError);
          // Don't fail the error handling if email fails
        }
      }
      
      setPaymentError(error.description || error.message || "Payment failed");
    } catch (err) {
      console.error("Error handling payment failure:", err);
      setPaymentError("Payment failed: " + (error.description || error.message || "Unknown error"));
    }
  }, [bookingId, formData, trek, calculateTotalPrice]); // Added dependencies for email functionality
  // Set up global handlers for Razorpay response
  useEffect(() => {
    // Capture the current bookingId in closure for use in handlers
    const currentBookingId = bookingId;
    
    // Store it globally as early as possible, even before payment starts
    if (currentBookingId) {
      console.log('🔑 Pre-storing bookingId in global storage:', currentBookingId);
      window.lastRazorpayBookingId = currentBookingId;
    }
    
    // Setting up global handlers for Razorpay
    window.onRazorpaySuccess = function(response) {
      console.log('👋 Razorpay success callback triggered with response:', response);
      console.log('👋 Current component bookingId:', currentBookingId);
      
      // Add the bookingId to the response through multiple reliable paths for maximum redundancy
      const enhancedResponse = {
        ...response,
        // Critical ID fields
        bookingId: currentBookingId || response.bookingId || response.razorpay_order_id,
        verifiedBookingId: currentBookingId, // Add an explicit verified field
        orderId: currentBookingId || response.razorpay_order_id,
        // Backup in notes object too
        notes: {
          ...(response.notes || {}),
          bookingId: currentBookingId || response.notes?.bookingId,
          backupId: currentBookingId, // Another backup path
          timestamp: Date.now()
        }
      };
      
      console.log('✅ Enhanced Razorpay response with bookingId:', enhancedResponse);
      
      // Always store in global variable for redundancy
      window.lastRazorpayBookingId = currentBookingId || 
                                     response.bookingId || 
                                     response.razorpay_order_id || 
                                     response.notes?.bookingId;
      
      // Use our handler with the enhanced response                               
      handlePaymentSuccess(enhancedResponse);
    };

    window.onRazorpayFailure = function(response) {
      handlePaymentFailure(response);
    };
    
    // Always store current booking ID in global context for backup access
    if (currentBookingId) {
      window.lastRazorpayBookingId = currentBookingId;
    }
    
    // Cleanup function to remove handlers when component unmounts
    return () => {
      window.onRazorpaySuccess = null;
      window.onRazorpayFailure = null;
      // Don't clear window.lastRazorpayBookingId as it might be needed for recovery
    };
  }, [bookingId, handlePaymentSuccess, handlePaymentFailure]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{step === 1 ? 'Book Your Trek' : 'Payment Details'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {/* Step Indicator */}
          <StepIndicator>
            <Step active={step === 1}>
              <StepNumber active={step === 1} completed={step > 1}>
                {step > 1 ? <FiCheck /> : '1'}
              </StepNumber>
              <span>Booking Details</span>
            </Step>
            <StepConnector completed={step > 1} />
            <Step active={step === 2}>
              <StepNumber active={step === 2}>
                2
              </StepNumber>
              <span>Payment</span>
            </Step>
          </StepIndicator>

          {/* Trek Information */}
          <TrekInfo>
            <TrekImage src={trek?.image} alt={trek?.name} />
            <TrekDetails>
              <TrekName>{trek?.name}</TrekName>
              <TrekLocation>{trek?.location}</TrekLocation>
            </TrekDetails>
          </TrekInfo>
          
          {/* Booking Form - Step 1 */}
          {step === 1 && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <FiCalendar />
                  Start Date
                </Label>
                <Input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={minBookingDate}
                />
                {errors.startDate && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.startDate}</span>}
                <FieldHelpText>
                  <FiInfo size={14} style={{ marginRight: '6px' }} />
                  <strong>Available dates:</strong> {getAvailabilityDisplay()}
                </FieldHelpText>
                
                {/* Show clickable date chips if specific dates are available and not too many */}
                {trek.availableDates && trek.availableDates.length > 0 && trek.availableDates.length <= 12 && (
                  <AvailableDatesContainer>
                    <AvailableDatesTitle>
                      <FiCalendar size={16} />
                      Click any date below to select:
                    </AvailableDatesTitle>
                    <AvailableDatesList>
                      {trek.availableDates
                        .filter(dateStr => {
                          const date = new Date(dateStr);
                          return date >= today; // Only show future dates
                        })
                        .sort((a, b) => new Date(a) - new Date(b)) // Sort chronologically
                        .map(dateStr => {
                          const date = new Date(dateStr);
                          const displayDate = date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric'
                          });
                          return (
                            <AvailableDateChip
                              key={dateStr}
                              type="button"
                              selected={formData.startDate === dateStr}
                              onClick={() => handleDateChipClick(dateStr)}
                            >
                              {displayDate}
                            </AvailableDateChip>
                          );
                        })}
                    </AvailableDatesList>
                  </AvailableDatesContainer>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiUser />
                  Number of Participants
                </Label>
                <Select 
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiUser />
                  Full Name
                </Label>
                <Input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.name}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiUser />
                  Email
                </Label>
                <Input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.email}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiPhone />
                  Contact Number
                </Label>
                <Input 
                  type="tel" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
                {errors.contactNumber && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.contactNumber}</span>}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FiMessageSquare />
                  Special Requests (Optional)
                </Label>
                <Textarea 
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requirements or requests"
                />
              </FormGroup>
            </Form>
          )}
          
          {/* Payment Section - Step 2 */}
          {step === 2 && (
            <>              {/* Coupon Section */}
              <CouponSection 
                orderTotal={trek?.numericPrice * formData.participants} 
                onApplyCoupon={handleApplyCoupon}
                theme={{ 
                  mainColor: '#3399cc', 
                  hoverColor: '#2388bb',
                  gradientLight: 'linear-gradient(135deg, rgba(51, 153, 204, 0.1), rgba(33, 122, 168, 0.1))',
                  textColor: '#2c5aa0',
                  inputBackground: '#ffffff',
                  inputBorder: 'rgba(51, 153, 204, 0.2)',
                  inputText: '#2c5aa0',
                  placeholderColor: '#94a3b8'
                }}
              />
                
              <PriceSummary>
                <PriceItem>
                  <span>Trek Fee</span>
                  <span>₹{trek?.numericPrice} x {formData.participants}</span>
                </PriceItem>
                
                {/* Discount row - only show if coupon is applied */}
                {activeCoupon && (
                  <PriceItem style={{ color: 'green' }}>
                    <span>Discount ({activeCoupon.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </PriceItem>
                )}
                
                <PriceTotal>
                  <span>Total</span>
                  <span>₹{calculateTotalPrice()}</span>
                </PriceTotal>
              </PriceSummary>
                {/* Payment Status Messages */}
              {paymentError && (
                <ErrorMessage>
                  <FiAlertCircle size={20} />
                  {paymentError}
                </ErrorMessage>
              )}
              
              {paymentSuccess && (
                <SuccessMessage>
                  <FiCheck size={20} />
                  Payment successful! Your booking is confirmed.
                  {activeCoupon && (
                    <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                      Coupon applied: {activeCoupon.code} (Saved: ₹{discountAmount.toFixed(2)})
                    </div>
                  )}
                </SuccessMessage>
              )}
            </>
          )}
        </ModalBody>
        
        <ModalFooter>
          {step === 1 ? (
            <>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <ProceedButton type="button" onClick={handleSubmit}>
                Continue to Payment
              </ProceedButton>
            </>
          ) : (
            <>
              <CancelButton type="button" onClick={() => setStep(1)}>
                Back
              </CancelButton>
              <PaymentButton 
                type="button" 
                onClick={handlePaymentProcess}
                disabled={isProcessingPayment || paymentSuccess}
              >
                {isProcessingPayment ? (
                  <LoadingIndicator />
                ) : paymentSuccess ? (
                  <>
                    <FiCheck />
                    Paid
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    Pay Now
                  </>
                )}
              </PaymentButton>
            </>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BookingModal;
