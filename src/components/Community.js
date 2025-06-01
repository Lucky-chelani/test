import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';
import chatroomImg from '../assets/images/trek1.png';
import user1 from '../assets/images/trek1.png';
import Navbar from './Navbar';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, deleteDoc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { initializeChatrooms } from '../utils/initializeChatrooms';
import { FiUsers, FiMessageCircle, FiX, FiPlus } from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

// Enhanced Page with better map pattern visibility
const Page = styled.div`
  background-color: #0a1a2f;
  position: relative;
  min-height: 100vh;
  color: #fff;
  padding-top: 100px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${mapPattern});
    background-size: 500px;
    background-repeat: repeat;
    opacity: 0.3;
    mix-blend-mode: luminosity;
    filter: brightness(1.5) contrast(1.2);
    z-index: 0;
    animation: breathe 15s infinite ease-in-out;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, 
      rgba(10, 26, 47, 0.6) 0%, 
      rgba(8, 22, 48, 0.85) 100%);
    z-index: 1;
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  position: relative;
  z-index: 2;
`;

const Section = styled.section`
  margin-bottom: 60px;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

// Enhanced section title with new gradient
const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #5390D9, #7400B8);
    border-radius: 2px;
  }
`;

// Modernized empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: rgba(24, 24, 40, 0.3);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(128, 255, 219, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: radial-gradient(circle at center, 
      rgba(128, 255, 219, 0.05) 0%, 
      rgba(83, 144, 217, 0.05) 50%, 
      rgba(116, 0, 184, 0.05) 100%);
    z-index: -1;
    animation: ${float} 15s infinite ease-in-out;
  }
  
  h3 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 32px;
    font-size: 1.1rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

// Updated button with new gradient
const CreateFirstButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(83, 144, 217, 0.4);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(83, 144, 217, 0.5);
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const ChatroomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

// Enhanced card with new design
const ChatroomCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(128, 255, 219, 0.1);
  position: relative;
  transform-style: preserve-3d;
  
  &:hover {
    transform: translateY(-8px) rotateX(2deg);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    border-color: rgba(128, 255, 219, 0.2);
  }
  
  ${props => props.isNew && css`
    &:after {
      content: 'NEW';
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(90deg, #5390D9, #7400B8);
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(83, 144, 217, 0.4);
      animation: ${pulse} 2s infinite ease-in-out;
      z-index: 10;
    }
  `}
`;

const CreatorBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: #80FFDB;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(128, 255, 219, 0.3);
  z-index: 5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 75, 75, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 75, 75, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 75, 75, 0.4);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ChatroomImage = styled.div`
  width: 100%;
  height: 180px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
  
  ${ChatroomCard}:hover & {
    transform: scale(1.05);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(10, 26, 47, 1) 0%, rgba(10, 26, 47, 0) 100%);
  }
`;

const ChatroomContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
`;

const ChatroomName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
`;

const ChatroomDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
  font-size: 0.95rem;
`;

const ChatroomMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  
  svg {
    margin-right: 8px;
    color: #5390D9;
  }
`;

// Enhanced join button with new gradient
const JoinButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 100%;
  box-shadow: 0 4px 15px rgba(83, 144, 217, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(83, 144, 217, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #3a4a63 0%, #2a294d 100%);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.7;
  }
`;

// Enhanced error message
const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin: 12px 0;
  text-align: center;
  border-left: 4px solid #ff6b6b;
  animation: ${fadeIn} 0.3s ease-out forwards;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
`;

// Enhanced success message
const SuccessMessage = styled.div`
  color: #4ad991;
  background: rgba(74, 217, 145, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin: 12px 0;
  text-align: center;
  border-left: 4px solid #4ad991;
  animation: ${fadeIn} 0.3s ease-out forwards;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(74, 217, 145, 0.2);
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Enhanced skeleton with subtle animation
const SkeletonCard = styled.div`
  background: rgba(24, 24, 40, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  overflow: hidden;
  height: 380px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.03), 
      rgba(255, 255, 255, 0.08), 
      rgba(255, 255, 255, 0.03)
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite linear;
  }
  
  &:before {
    content: '';
    position: absolute;
    height: 180px;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(83, 144, 217, 0.1);
    z-index: 1;
  }
`;

// Enhanced floating action button
const CreateRoomButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 6px 25px rgba(83, 144, 217, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
  
  &:hover {
    transform: scale(1.1) rotate(180deg);
    box-shadow: 0 8px 30px rgba(83, 144, 217, 0.6);
  }
  
  &:active {
    transform: scale(1.05) rotate(180deg);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

// Enhanced modal
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 26, 47, 0.9);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

// Enhanced modal content
const ModalContent = styled.div`
  background: linear-gradient(145deg, rgba(24, 24, 40, 0.9), rgba(10, 26, 47, 0.9));
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(128, 255, 219, 0.1);
  animation: ${fadeIn} 0.4s ease-out forwards;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, 
      rgba(128, 255, 219, 0.03) 0%, 
      rgba(83, 144, 217, 0.03) 50%, 
      rgba(116, 0, 184, 0.03) 100%);
    z-index: 0;
    animation: ${float} 20s infinite ease-in-out;
    pointer-events: none;
  }
`;

const ModalTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 30px;
  color: white;
  position: relative;
  background: linear-gradient(to right, #80FFDB 0%, #5390D9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

// Enhanced form inputs
const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(128, 255, 219, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(83, 144, 217, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(128, 255, 219, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5390D9;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(83, 144, 217, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
`;

// Enhanced cancel button
const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

// Enhanced create button
const CreateButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(83, 144, 217, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4 0%, #6600a3 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(83, 144, 217, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: linear-gradient(135deg, #3a4a63 0%, #2a294d 100%);
    box-shadow: none;
    transform: none;
  }
`;

// Confirmation modal for deletion
const ConfirmModal = styled(Modal)``;

const ConfirmModalContent = styled(ModalContent)`
  max-width: 450px;
`;

const ConfirmTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: white;
  position: relative;
  font-weight: 700;
  
  &::before {
    content: '⚠️';
    margin-right: 10px;
    font-size: 1.5rem;
  }
`;

const ConfirmText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  line-height: 1.6;
  font-size: 1.05rem;
  
  span {
    color: #ff6b6b;
    font-weight: 600;
  }
`;

const ConfirmButtonGroup = styled(ButtonGroup)`
  justify-content: space-between;
`;

const CancelDeleteButton = styled(CancelButton)`
  flex: 1;
`;

// Enhanced delete button
const ConfirmDeleteButton = styled.button`
  background: linear-gradient(90deg, #ff5e5e, #ff3a3a);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(255, 58, 58, 0.3);
  flex: 1;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(90deg, #ff3a3a, #ff2020);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 58, 58, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// Floating decoration elements
const FloatingElement = styled.div`
  position: absolute;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  background: ${props => props.color || 'rgba(128, 255, 219, 0.1)'};
  border-radius: 50%;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  z-index: 0;
  filter: blur(5px);
  animation: float-${props => props.index} 15s infinite ease-in-out;
  pointer-events: none;
  
  @keyframes float-${props => props.index} {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(${props => props.xMove || '10px'}, ${props => props.yMove || '10px'}) rotate(5deg); }
    50% { transform: translate(${props => props.xMove2 || '0'}, ${props => props.yMove2 || '20px'}) rotate(10deg); }
    75% { transform: translate(${props => props.xMove3 || '-10px'}, ${props => props.yMove3 || '10px'}) rotate(5deg); }
  }
`;

const Community = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    desc: '',
    img: chatroomImg // default image
  });
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch chatrooms from Firestore
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        setLoading(true);
        
        // Initialize default chatrooms if needed
        await initializeChatrooms();
        
        // Set up real-time listener for chatrooms
        const chatroomsCollection = collection(db, 'chatrooms');
        const q = query(chatroomsCollection, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const roomsData = snapshot.docs.map(doc => {
            const data = doc.data();
            // Calculate if room is new (created in last 24 hours)
            const isNew = data.createdAt && 
                        typeof data.createdAt.toDate === 'function' ? 
                        (new Date().getTime() - data.createdAt.toDate().getTime()) < 24 * 60 * 60 * 1000 :
                        false;
            return {
              ...data,
              isNew,
              docId: doc.id // Store the Firestore document ID for deletion
            };
          });
          
          setChatrooms(roomsData);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching chatrooms:', err);
        setError('Failed to load communities. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchChatrooms();
  }, []);

  // Update the handleJoinRoom function
  const handleJoinRoom = async (room) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Attempting to join room:', room);
      
      // Use the docId for Firestore operations, not the custom id
      const roomRef = doc(db, 'chatrooms', room.docId);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        console.log('Room does not exist, reinitializing...');
        await initializeChatrooms();
        const recheckDoc = await getDoc(roomRef);
        if (!recheckDoc.exists()) {
          throw new Error('Failed to create community');
        }
      }

      // Get current members
      const currentMembers = roomDoc.data()?.members || [];
      
      // Only add member if not already in the room
      if (!currentMembers.includes(auth.currentUser.uid)) {
        await updateDoc(roomRef, {
          members: arrayUnion(auth.currentUser.uid)
        });
        console.log('Successfully joined community');
      } else {
        console.log('User already in community');
      }

      // Navigate to chat screen with room ID
      navigate(`/chat/${room.id}`, { state: { room } });
      
    } catch (err) {
      console.error('Error joining room:', err);
      setError(`Failed to join community: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!newRoomData.name.trim() || !newRoomData.desc.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create room ID from name
      const roomId = newRoomData.name.toLowerCase().replace(/\s+/g, '-');
      
      // Add room to Firestore
      const docRef = await addDoc(collection(db, 'chatrooms'), {
        id: roomId,
        name: newRoomData.name,
        desc: newRoomData.desc,
        img: newRoomData.img,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        members: [auth.currentUser.uid]
      });
      
      setShowCreateModal(false);
      setNewRoomData({ name: '', desc: '', img: chatroomImg });
      setSuccess('Community created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      // Navigate to the new chat room
      navigate(`/chat/${roomId}`, { 
        state: { 
          room: { 
            id: roomId, 
            name: newRoomData.name, 
            desc: newRoomData.desc, 
            img: newRoomData.img,
            docId: docRef.id
          } 
        } 
      });
      
    } catch (err) {
      console.error('Error creating room:', err);
      setError(`Failed to create community: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRoom = (room, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteRoom = async () => {
    if (!roomToDelete || !auth.currentUser) return;
    
    try {
      setLoading(true);
      
      // Delete the room document
      await deleteDoc(doc(db, 'chatrooms', roomToDelete.docId));
      
      setShowDeleteModal(false);
      setRoomToDelete(null);
      setSuccess('Community deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting room:', err);
      setError(`Failed to delete community: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Navbar active="community" />
      <Container>
        {/* Floating decorative elements */}
        <FloatingElement size="100px" top="10%" left="5%" color="rgba(128, 255, 219, 0.05)" index="1" xMove="20px" yMove="30px" />
        <FloatingElement size="80px" top="30%" right="10%" color="rgba(83, 144, 217, 0.05)" index="2" xMove="-30px" yMove="20px" />
        <FloatingElement size="60px" bottom="20%" left="15%" color="rgba(116, 0, 184, 0.05)" index="3" xMove="15px" yMove="-25px" />
        <FloatingElement size="120px" bottom="10%" right="5%" color="rgba(128, 255, 219, 0.03)" index="4" xMove="-20px" yMove="-15px" />
        
        <Section>
          <SectionTitle>Explore Trek Communities</SectionTitle>
          
          {loading ? (
            <LoadingGrid>
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </LoadingGrid>
          ) : chatrooms.length === 0 ? (
            <EmptyState>
              <h3>No Communities Yet</h3>
              <p>Be the first to create a trekking community where explorers can share tips, routes, and stories!</p>
              <CreateFirstButton onClick={() => setShowCreateModal(true)}>
                Create Your Community
              </CreateFirstButton>
            </EmptyState>
          ) : (
            <ChatroomGrid>
              {chatrooms.map((room) => (
                <ChatroomCard key={room.id} isNew={room.isNew} onClick={() => handleJoinRoom(room)}>
                  {room.createdBy === auth.currentUser?.uid && (
                    <>
                      <CreatorBadge>Creator</CreatorBadge>
                      <DeleteButton onClick={(e) => handleDeleteRoom(room, e)}>
                        <FiX />
                      </DeleteButton>
                    </>
                  )}
                  <ChatroomImage src={room.img} />
                  <ChatroomContent>
                    <ChatroomName>{room.name}</ChatroomName>
                    <ChatroomMeta>
                      <MetaItem>
                        <FiUsers />
                        {room.members?.length || 0} members
                      </MetaItem>
                      <MetaItem>
                        <FiMessageCircle />
                        {room.messageCount || 0} messages
                      </MetaItem>
                    </ChatroomMeta>
                    <ChatroomDescription>{room.desc}</ChatroomDescription>
                    <JoinButton 
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Join Community'}
                    </JoinButton>
                  </ChatroomContent>
                </ChatroomCard>
              ))}
            </ChatroomGrid>
          )}
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <CreateRoomButton onClick={() => setShowCreateModal(true)}>
          <FiPlus />
        </CreateRoomButton>
        
        <Modal show={showCreateModal}>
          <ModalContent>
            <ModalTitle>Create New Community</ModalTitle>
            
            <FormGroup>
              <Label>Community Name</Label>
              <Input 
                type="text" 
                value={newRoomData.name}
                onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})}
                placeholder="e.g., Andes Explorers"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea 
                value={newRoomData.desc}
                onChange={(e) => setNewRoomData({...newRoomData, desc: e.target.value})}
                placeholder="Describe what this community is about..."
              />
            </FormGroup>
            
            <ButtonGroup>
              <CancelButton onClick={() => setShowCreateModal(false)}>Cancel</CancelButton>
              <CreateButton 
                onClick={handleCreateRoom}
                disabled={loading || !newRoomData.name.trim() || !newRoomData.desc.trim()}
              >
                {loading ? 'Creating...' : 'Create Community'}
              </CreateButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
        
        <ConfirmModal show={showDeleteModal}>
          <ConfirmModalContent>
            <ConfirmTitle>Delete Community?</ConfirmTitle>
            <ConfirmText>
              Are you sure you want to delete the community "<span>{roomToDelete?.name}</span>"? 
              This action cannot be undone and all messages will be permanently deleted.
            </ConfirmText>
            
            <ConfirmButtonGroup>
              <CancelDeleteButton onClick={() => setShowDeleteModal(false)}>
                Cancel
              </CancelDeleteButton>
              <ConfirmDeleteButton 
                onClick={confirmDeleteRoom}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Community'}
              </ConfirmDeleteButton>
            </ConfirmButtonGroup>
          </ConfirmModalContent>
        </ConfirmModal>
      </Container>
    </Page>
  );
};

export default Community;