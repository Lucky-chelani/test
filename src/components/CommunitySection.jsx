import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import birdsImg from "../assets/images/birds.png";
import mapPattern from "../assets/images/map-pattren.png";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, limit, orderBy, startAfter, where } from "firebase/firestore";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 160, 91, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(66, 160, 91, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 160, 91, 0); }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmerEffect = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const SectionContainer = styled.section`
  position: relative;
  padding: 120px 0 140px;
  background: linear-gradient(135deg, #f7faff 0%, #f0f5fc 100%);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${mapPattern});
    background-size: 800px;
    background-repeat: repeat;
    opacity: 0.04;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 150px;
    background: linear-gradient(to top, rgba(83, 144, 217, 0.05), transparent);
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: 80px 0 100px;
  }
  
  @media (max-width: 480px) {
    padding: 60px 0 80px;
  }
`;

const BirdsImage = styled.img`
  position: absolute;
  top: 40px;
  right: 5%;
  width: 120px;
  height: auto;
  z-index: 1;
  animation: ${float} 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
  
  @media (max-width: 768px) {
    width: 90px;
    top: 30px;
    right: 3%;
  }
  
  @media (max-width: 480px) {
    width: 70px;
    top: 20px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const HeadingWrapper = styled.div`
  margin-bottom: 70px;
  animation: ${fadeIn} 0.6s ease-out;
  
  .small-above-heading {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #5390D9;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 12px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 50px;
    
    .small-above-heading {
      font-size: 0.9rem;
      letter-spacing: 1.5px;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 40px;
    
    .small-above-heading {
      font-size: 0.8rem;
      letter-spacing: 1px;
    }
  }
`;

const Heading = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  color: #181828;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 6px;
    background: linear-gradient(90deg, #FFD2BF, #ffbfa3);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SubHeading = styled.p`
  font-size: 1.25rem;
  text-align: center;
  max-width: 750px;
  margin: 30px auto 0;
  color: #555;
  line-height: 1.8;
  font-weight: 400;
  
  strong {
    color: #333;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.15rem;
    margin-top: 25px;
    line-height: 1.7;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-top: 20px;
    line-height: 1.6;
  }
`;

const SearchWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto 50px;
  animation: ${fadeIn} 0.6s ease-out 0.2s backwards;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 50px;
  padding: 6px 6px 6px 24px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:focus-within {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 210, 191, 0.5);
    transform: translateY(-2px);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  font-size: 1.05rem;
  padding: 14px 0;
  color: #333;
  background: transparent;
  margin-right: 10px;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #888;
    font-weight: 400;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-right: 5px;
    
    &::placeholder {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    
    &::placeholder {
      font-size: 0.85rem;
    }
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #5390D9, #7400B8);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: linear-gradient(135deg, #4a81c4, #6600a3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(83, 144, 217, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 8px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px;
  border-radius: 50px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out 0.3s backwards;
  
  @media (max-width: 480px) {
    gap: 4px;
    padding: 6px;
  }
`;

const Tab = styled.button`
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: ${props => props.active ? '700' : '500'};
  color: ${props => props.active ? '#181828' : '#666'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 5px 15px rgba(0, 0, 0, 0.08)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
    transform: translateY(-2px);
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: ${props => props.active ? '0' : '-2px'};
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.active ? '20px' : '0'};
    height: 3px;
    background: ${props => props.active ? 'linear-gradient(to right, #5390D9, #7400B8)' : 'transparent'};
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  
  &:hover:before {
    width: ${props => props.active ? '30px' : '0'};
  }
  
  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 0.9rem;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 30px;
  justify-content: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CommunityCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.6s ease-out ${props => 0.4 + props.index * 0.1}s backwards;
  position: relative;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    border-color: rgba(83, 144, 217, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(to right, ${props => props.btnColor || '#295a30'}, ${props => props.btnColor || '#295a30'}aa);
    z-index: 10;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0;
    background: ${props => props.btnColor || '#295a30'};
    opacity: 0.1;
    transition: height 0.3s ease;
  }
  
  &:hover::after {
    height: 100%;
  }
`;

const CardHeader = styled.div`
  padding-bottom: 18px;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
  }
`;

const GroupName = styled.span`
  font-size: 1.35rem;
  font-weight: 800;
  background: linear-gradient(135deg, #181828, #333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
  
  .group-icon {
    width: 28px;
    height: 28px;
    fill: ${props => props.btnColor || '#295a30'};
    opacity: 0.9;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  }
`;

const OnlineUsers = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(83, 144, 217, 0.08);
  border-radius: 50px;
  padding: 8px 14px;
  font-size: 0.85rem;
  color: #5390D9;
  font-weight: 600;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(83, 144, 217, 0.05);
  border: 1px solid rgba(83, 144, 217, 0.15);
  
  .online-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #5390D9;
    display: inline-block;
    animation: ${pulse} 2s infinite;
    box-shadow: 0 0 0 rgba(83, 144, 217, 0.4);
  }
`;

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  margin-top: 16px;
  gap: 16px;
  position: relative;
`;

const UserItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  &:nth-child(2) {
    margin-left: 15px;
  }
`;

const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: ${props => props.bg || '#c0cdfa'};
  color: ${props => props.color || '#295a4a'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid white;
  position: relative;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 16px;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover:after {
    opacity: 1;
    border-color: ${props => props.bg || '#c0cdfa'};
    border-radius: 18px;
  }
`;

const UserInfoWrapper = styled.div`
  flex: 1;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`;

const UserName = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: #333;
`;

const UserLevel = styled.span`
  background: ${props => props.bg || '#c8fad0'};
  color: ${props => props.color || '#2a8a34'};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  &:hover:after {
    transform: translateX(100%);
  }
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: #999;
  margin-left: auto;
`;

const MessageBubble = styled.div`
  background: ${props => props.isNew ? 'rgba(83, 144, 217, 0.05)' : 'transparent'};
  border-radius: 12px;
  padding: ${props => props.isNew ? '12px 16px' : '0'};
  color: #444;
  line-height: 1.5;
  font-size: 0.95rem;
  position: relative;
  border-left: ${props => props.isNew ? '3px solid #5390D9' : '0'};
  margin-top: 2px;
  
  &:hover {
    background: ${props => props.isNew ? 'rgba(83, 144, 217, 0.08)' : 'rgba(0, 0, 0, 0.02)'};
  }
`;

const MessageStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #888;
  
  .status-icon {
    color: ${props => props.isLiked ? '#5390D9' : '#888'};
    cursor: pointer;
    transition: all 0.2s ease;
    transform: ${props => props.isLiked ? 'scale(1.2)' : 'scale(1)'};
    position: relative;
    
    &:hover {
      transform: scale(1.2);
      color: ${props => props.isLiked ? '#5390D9' : '#666'};
    }
    
    &:after {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      background: ${props => props.isLiked ? 'rgba(83, 144, 217, 0.1)' : 'transparent'};
      z-index: -1;
      transition: all 0.2s ease;
    }
    
    &:hover:after {
      background: rgba(83, 144, 217, 0.1);
    }
  }
  
  .likes {
    color: ${props => props.isLiked ? '#5390D9' : '#888'};
    font-weight: ${props => props.isLiked ? '600' : '400'};
  }
  
  span:not(.status-icon):not(.likes) {
    transition: all 0.2s ease;
    
    &:hover {
      color: #5390D9;
      cursor: pointer;
    }
  }
  
  .action-button {
    padding: 2px 8px;
    background: transparent;
    border: 1px solid #ddd;
    border-radius: 50px;
    color: #666;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(83, 144, 217, 0.08);
      border-color: #5390D9;
      color: #5390D9;
    }
  }
`;

const TrekInfo = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.97);
  color: #111;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  height: 100%;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent);
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 24px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 12px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.05), transparent);
  }
`;

const ActionButton = styled.button`
  background: ${props => props.bg || '#295a30'};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #7400B8, #5390D9);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.35s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 0;
    text-align: center;
  }
`;

const PopularTag = styled.div`
  position: absolute;
  top: 25px;
  right: -33px;
  background: linear-gradient(135deg, #5390D9, #7400B8);
  color: white;
  transform: rotate(45deg);
  padding: 6px 40px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
  z-index: 10;
`;

const SeeMoreButton = styled.button`
  display: block;
  margin: 60px auto 0;
  background: linear-gradient(135deg, rgba(83, 144, 217, 0.1), rgba(116, 0, 184, 0.1));
  border: 2px solid rgba(83, 144, 217, 0.3);
  color: #333;
  border-radius: 50px;
  padding: 16px 38px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out 0.7s backwards;
  position: relative;
  overflow: hidden;
  opacity: ${props => props.disabled ? '0.7' : '1'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 3px;
    transition: all 0.3s ease;
    opacity: 0;
  }
  
  &:hover {
    background: ${props => props.disabled ? 'linear-gradient(135deg, rgba(83, 144, 217, 0.1), rgba(116, 0, 184, 0.1))' : 'linear-gradient(135deg, rgba(83, 144, 217, 0.2), rgba(116, 0, 184, 0.2))'};
    border-color: ${props => props.disabled ? 'rgba(83, 144, 217, 0.3)' : 'rgba(83, 144, 217, 0.6)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-5px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.08)'};
  }
  
  &:hover:after {
    opacity: ${props => props.disabled ? '0' : '1'};
    width: ${props => props.disabled ? '30px' : '50px'};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const LoadingSkeletonCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  height: 350px;
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(to right, #eee, #ddd);
    z-index: 10;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
    background-size: 300% 100%;
    animation: ${shimmer} 1.5s infinite;
    z-index: 1;
  }
  
  .skeleton-title {
    height: 28px;
    width: 70%;
    background: #eee;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .skeleton-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  
  .skeleton-stat {
    height: 20px;
    width: 100px;
    background: #eee;
    border-radius: 20px;
  }
  
  .skeleton-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 30px;
  }
  
  .skeleton-tag {
    height: 18px;
    width: 60px;
    background: #eee;
    border-radius: 20px;
  }
  
  .skeleton-message {
    height: 18px;
    background: #eee;
    border-radius: 6px;
    margin-bottom: 10px;
    width: 85%;
  }
  
  .skeleton-message-short {
    height: 18px;
    background: #eee;
    border-radius: 6px;
    margin-bottom: 30px;
    width: 50%;
  }
  
  .skeleton-button {
    height: 40px;
    background: #eee;
    border-radius: 20px;
    width: 140px;
    margin-top: auto;
    align-self: flex-end;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Tag = styled.span`
  background: rgba(83, 144, 217, 0.08);
  color: ${props => props.btnColor || '#5390D9'};
  border: 1px solid rgba(83, 144, 217, 0.2);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(83, 144, 217, 0.15);
    transform: translateY(-2px);
  }
`;

const MembersIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  
  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }
  
  strong {
    font-weight: 700;
    color: #333;
  }
`;

// Enhanced community data with more realistic details
const communityRooms = [
  {
    group: "Himalayan Explorers",
    icon: "mountain",
    online: 28,
    popular: true,
    users: [
      {
        initials: "JM",
        name: "James Mitchell",
        level: 12,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "Has anyone done the Annapurna Circuit in October? Looking for weather advice.",
        time: "2m ago",
        likes: 4,
      },
      {
        initials: "SL",
        name: "Sarah Lin",
        level: 24,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "October is perfect! Clear skies after the monsoon, but bring layers for the Thorong La pass.",
        time: "Just now",
        likes: 2,
        isNew: true,
      },
    ],
    btnColor: "#295a30",
    memberCount: 1243,
    tags: ["Hiking", "Nepal", "Mountaineering"]
  },
  {
    group: "Patagonia Trekkers",
    icon: "map",
    online: 19,
    users: [
      {
        initials: "EV",
        name: "Elena Vega",
        level: 11,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "Just booked my W Trek for January! Anyone else going to be there?",
        time: "5m ago",
        likes: 7,
      },
      {
        initials: "DT",
        name: "Daniel Thompson",
        level: 9,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "I'll be there Jan 15-22! Would love to connect. Has anyone used the refugios?",
        time: "1m ago",
        likes: 3,
        isNew: true,
      },
    ],
    btnColor: "#19647e",
    memberCount: 892,
    tags: ["Patagonia", "Chile", "Wildlife"]
  },
  {
    group: "Alpine Adventures",
    icon: "compass",
    online: 34,
    users: [
      {
        initials: "JS",
        name: "Julie Smith",
        level: 18,
        levelColor: "#c8fad0",
        levelTextColor: "#2a8a34",
        msg: "What's the best time to hike the Tour du Mont Blanc? I'm planning to go solo.",
        time: "12m ago",
        likes: 9,
      },
      {
        initials: "MA",
        name: "Mark Anderson",
        level: 31,
        levelColor: "#f9d6e7",
        levelTextColor: "#b0336e",
        msg: "July-August is ideal. I did it solo last year. Happy to share my itinerary!",
        time: "4m ago",
        likes: 5,
      },
    ],
    btnColor: "#4f518c",
    memberCount: 1562,
    tags: ["Alpine", "Europe", "Tour du Mont Blanc"]
  },
];

const PromotionSection = styled.div`
  margin-top: 80px;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(83, 144, 217, 0.08) 0%, rgba(116, 0, 184, 0.08) 100%);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out 0.8s backwards;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(83, 144, 217, 0.2);
  transform: translateZ(0);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(to right, #5390D9, #7400B8);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: radial-gradient(circle at center, rgba(83, 144, 217, 0.03) 0, transparent 25%),
                      radial-gradient(circle at center, rgba(116, 0, 184, 0.03) 0, transparent 25%);
    background-position: 0 0, 50px 50px;
    background-size: 100px 100px;
    opacity: 0.5;
    pointer-events: none;
    z-index: -1;
  }
  
  &:hover {
    transform: translateZ(0) translateY(-5px);
    box-shadow: 0 20px 60px rgba(83, 144, 217, 0.15);
    transition: all 0.4s ease;
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
    margin-top: 60px;
  }
`;

const PromotionTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(135deg, #181828, #5390D9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.9rem;
  }
`;

const PromotionText = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 700px;
  margin: 30px 0;
  color: #444;
  line-height: 1.7;
  
  strong {
    color: #5390D9;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin: 24px 0;
  }
`;

const PromotionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #5390D9, #7400B8);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 36px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #7400B8, #5390D9);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.35s ease;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 15px 30px rgba(83, 144, 217, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 28px;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #5390D9;
  border: 2px solid #5390D9;
  border-radius: 50px;
  padding: 16px 36px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(83, 144, 217, 0.1);
    z-index: -1;
    transition: all 0.4s ease;
  }
  
  &:hover {
    background: rgba(83, 144, 217, 0.08);
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 10px 25px rgba(83, 144, 217, 0.15);
    border-color: #7400B8;
    color: #7400B8;
    
    &:before {
      left: 0;
    }
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 28px;
  }
`;

const StatStrip = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-top: 60px;
  padding-top: 40px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(83, 144, 217, 0.3), transparent);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    text-align: center;
    margin-top: 40px;
    padding-top: 30px;
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 10%;
    right: 0;
    height: 80%;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(83, 144, 217, 0.2), transparent);
  }
  
  @media (max-width: 768px) {
    &:not(:last-child)::after {
      display: none;
    }
    
    &:not(:last-child)::before {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 30%;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(83, 144, 217, 0.2), transparent);
    }
  }
`;

const StatIconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(83, 144, 217, 0.1), rgba(116, 0, 184, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 10px 20px rgba(83, 144, 217, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(83, 144, 217, 0.2);
  
  svg {
    width: 30px;
    height: 30px;
    color: #5390D9;
  }
  
  ${Stat}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 15px 30px rgba(83, 144, 217, 0.2);
    background: linear-gradient(135deg, rgba(83, 144, 217, 0.15), rgba(116, 0, 184, 0.15));
  }
`;

const StatNumber = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #5390D9, #7400B8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  position: relative;
  animation: ${countUp} 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(to right, transparent, rgba(83, 144, 217, 0.5), transparent);
    transition: width 0.3s ease;
  }
  
  ${Stat}:hover &::after {
    width: 80%;
  }
  
  @media (max-width: 768px) {
    font-size: 2.3rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #555;
  font-weight: 500;
  position: relative;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(83, 144, 217, 0.3), transparent);
    transition: width 0.3s ease;
  }
  
  ${Stat}:hover &::before {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [likedMessages, setLikedMessages] = useState({});
  const [communities, setCommunities] = useState(communityRooms);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  // Load communities from Firebase when tab changes
  useEffect(() => {
    loadCommunities();
  }, [activeTab]);

  // Load communities from Firebase
  const loadCommunities = async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    }

    try {
      const communitiesRef = collection(db, "chatrooms");
      let communitiesQuery;
      
      if (activeTab === "Popular") {
        communitiesQuery = query(communitiesRef, orderBy("members", "desc"), limit(3));
      } else if (activeTab === "New") {
        communitiesQuery = query(communitiesRef, orderBy("createdAt", "desc"), limit(3));
      } else if (activeTab === "Active") {
        communitiesQuery = query(communitiesRef, orderBy("lastActivity", "desc"), limit(3));
      }
      
      // If loading more, start after the last item
      if (isLoadMore && lastVisible) {
        communitiesQuery = query(communitiesRef, 
          activeTab === "Popular" ? orderBy("members", "desc") : 
          activeTab === "New" ? orderBy("createdAt", "desc") : 
          orderBy("lastActivity", "desc"),
          startAfter(lastVisible),
          limit(3)
        );
      }
      
      const querySnapshot = await getDocs(communitiesQuery);
      
      if (querySnapshot.empty) {
        setHasMore(false);
      } else {
        // Get the last visible document
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        
        // Map the data to our expected format
        const loadedCommunities = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          // Convert Firestore timestamps to JavaScript dates
          const createdAt = data.createdAt?.toDate?.() || new Date();
          const lastActivity = data.lastActivity?.toDate?.() || new Date();
          
          return {
            group: data.name || "Community Group",
            icon: data.icon || "mountain",
            online: data.membersOnline || Math.floor(Math.random() * 30) + 5,
            popular: index === 0, // Mark the first one as popular
            users: data.recentMessages || [
              {
                initials: "JM",
                name: "James Mitchell",
                level: 12,
                levelColor: "#c8fad0",
                levelTextColor: "#2a8a34",
                msg: "Let's plan our next expedition!",
                time: "2m ago",
                likes: 4,
              },
              {
                initials: "SL",
                name: "Sarah Lin",
                level: 24,
                levelColor: "#f9d6e7",
                levelTextColor: "#b0336e",
                msg: "I'm thinking about a trek next month.",
                time: "Just now",
                likes: 2,
                isNew: true,
              }
            ],
            btnColor: data.btnColor || "#295a30",
            memberCount: data.members?.length || 0,
            tags: data.tags || ["Hiking", "Trekking", "Adventure"],
            id: doc.id,
            docId: doc.id
          };
        });
        
        // Append or replace communities based on whether we're loading more
        setCommunities(prev => isLoadMore ? [...prev, ...loadedCommunities] : loadedCommunities);
      }
    } catch (error) {
      console.error("Error loading communities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setSearchLoading(true);
    
    try {
      const communitiesRef = collection(db, "chatrooms");
      
      // Search for matches in name, description or tags
      const nameQuery = query(
        communitiesRef, 
        where("name", ">=", searchValue), 
        where("name", "<=", searchValue + '\uf8ff')
      );
      const descQuery = query(
        communitiesRef, 
        where("description", ">=", searchValue), 
        where("description", "<=", searchValue + '\uf8ff')
      );
      
      const [nameResults, descResults] = await Promise.all([
        getDocs(nameQuery),
        getDocs(descQuery)
      ]);
      
      // Combine results, removing duplicates
      const combined = new Map();
      nameResults.docs.forEach(doc => combined.set(doc.id, doc));
      descResults.docs.forEach(doc => combined.set(doc.id, doc));
      
      const searchResults = Array.from(combined.values()).map((doc, index) => {
        const data = doc.data();
        return {
          group: data.name || "Community Group",
          icon: data.icon || "mountain",
          online: data.membersOnline || Math.floor(Math.random() * 30) + 5,
          popular: index === 0,
          users: data.recentMessages || [
            {
              initials: "JM",
              name: "James Mitchell",
              level: 12,
              levelColor: "#c8fad0",
              levelTextColor: "#2a8a34",
              msg: "Let's plan our next expedition!",
              time: "2m ago",
              likes: 4,
            },
            {
              initials: "SL",
              name: "Sarah Lin",
              level: 24,
              levelColor: "#f9d6e7",
              levelTextColor: "#b0336e",
              msg: "I'm thinking about a trek next month.",
              time: "Just now",
              likes: 2,
              isNew: true,
            }
          ],
          btnColor: data.btnColor || "#295a30",
          memberCount: data.members?.length || 0,
          tags: data.tags || ["Hiking", "Trekking", "Adventure"],
          id: doc.id,
          docId: doc.id
        };
      });
      
      setCommunities(searchResults);
      setHasMore(false);
      
    } catch (error) {
      console.error("Error searching communities:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Load more communities
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadCommunities(true);
    }
  };

  // Join discussion
  const handleJoinDiscussion = (room) => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/chat/${room.id || room.docId}`, { state: { room } });
  };

  const handleLikeToggle = (roomIndex, userIndex) => {
    const key = `${roomIndex}-${userIndex}`;
    setLikedMessages({
      ...likedMessages,
      [key]: !likedMessages[key]
    });
  };

  // Render the appropriate icon based on the group type
  const renderGroupIcon = (iconType) => {
    switch(iconType) {
      case "mountain":
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <path d="M22.5,21H1.5L7.71,5.74a1,1,0,0,1,1.72,0L11.9,11.64,14.57,7.29a1,1,0,0,1,1.72,0Z" />
          </svg>
        );
      case "map":
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <path d="M20.12,11.5l-6.65-6.65a2,2,0,0,0-2.83,0L3.88,11.5A3,3,0,0,0,3,13.79V21a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V16a1,1,0,0,1,1-1h0a1,1,0,0,1,1,1v5a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V13.79A3,3,0,0,0,20.12,11.5Z" />
          </svg>
        );
      case "compass":
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      default:
        return (
          <svg className="group-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H13v3a1,1,0,0,1-2,0V13H8a1,1,0,0,1,0-2h3V8a1,1,0,0,1,2,0v3h3a1,1,0,0,1,0,2Z" />
          </svg>
        );
    }
  };

  return (
    <SectionContainer className="community-section">
      <BirdsImage src={birdsImg} alt="birds" className="birds-img" />      <ContentContainer className="community-content">
        <HeadingWrapper>
          <span className="small-above-heading">Trovia Community</span>
          <Heading className="community-heading">Connect With Fellow Trekkers</Heading>
          <SubHeading className="community-subheading">
            Join our vibrant community of over 10,000 adventurers from across the globe. 
            Share your experiences, get advice for upcoming treks, and find companions for your next expedition.
          </SubHeading>
        </HeadingWrapper>
          <SearchWrapper>
          <form onSubmit={handleSearch}>
            <SearchBar>
              <SearchInput 
                type="text" 
                placeholder="Search communities, topics, or locations..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <SearchButton type="submit" disabled={searchLoading}>
                {searchLoading ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
                <ButtonText>{searchLoading ? "Searching..." : "Search"}</ButtonText>
              </SearchButton>
            </SearchBar>
          </form>
        </SearchWrapper>
        
        <TabsContainer>
          <Tab 
            active={activeTab === "Popular"} 
            onClick={() => {
              setActiveTab("Popular");
              setLastVisible(null);
              setHasMore(true);
            }}
          >
            Popular
          </Tab>
          <Tab 
            active={activeTab === "New"} 
            onClick={() => {
              setActiveTab("New");
              setLastVisible(null);
              setHasMore(true);
            }}
          >
            New
          </Tab>
          <Tab 
            active={activeTab === "Active"} 
            onClick={() => {
              setActiveTab("Active");
              setLastVisible(null);
              setHasMore(true);
            }}
          >
            Most Active
          </Tab>
        </TabsContainer>
        
        <CardsContainer className="community-cards">
          {loading ? (
            // Show loading skeletons when searching
            Array(3).fill().map((_, i) => (
              <LoadingSkeletonCard key={i}>
                <div className="skeleton-title"></div>
                <div className="skeleton-stats">
                  <div className="skeleton-stat"></div>
                  <div className="skeleton-stat"></div>
                </div>
                <div className="skeleton-tags">
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                </div>
                <div className="skeleton-message"></div>
                <div className="skeleton-message-short"></div>
                <div className="skeleton-message"></div>
                <div className="skeleton-message-short"></div>
                <div className="skeleton-button"></div>
              </LoadingSkeletonCard>
            ))
          ) : communities.length === 0 ? (
            // Empty state when no communities are found
            <div style={{ 
              width: "100%", 
              textAlign: "center", 
              padding: "60px 20px",
              background: "rgba(255,255,255,0.7)",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              margin: "20px 0"
            }}>
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#5390D9" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ margin: "0 auto 20px" }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#333" }}>
                No communities found
              </h3>
              <p style={{ color: "#555", maxWidth: "400px", margin: "0 auto 20px" }}>
                {searchValue ? 
                  `No results found for "${searchValue}". Try a different search term or browse our popular communities.` : 
                  "We don't have any communities in this category yet. Be the first to create one!"
                }
              </p>
              <button 
                onClick={() => {
                  setSearchValue("");
                  setActiveTab("Popular");
                  loadCommunities();
                }}
                style={{
                  background: "linear-gradient(135deg, #5390D9, #7400B8)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Browse Popular Communities
              </button>
            </div>
          ) : (
            // Show community cards
            communities.map((room, idx) => (
              <CommunityCard 
                key={room.group} 
                btnColor={room.btnColor}
                index={idx}
              >
                {room.popular && <PopularTag>Popular</PopularTag>}
                <TrekInfo>                  <CardHeader>
                    <GroupName btnColor={room.btnColor}>
                      {renderGroupIcon(room.icon)}
                      {room.group}
                    </GroupName>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <OnlineUsers>
                        <span className="online-dot"></span>
                        {room.online} online
                      </OnlineUsers>
                      <MembersIndicator>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <strong>{room.memberCount.toLocaleString()}</strong> members
                      </MembersIndicator>
                    </div>
                    <TagsContainer>
                      {room.tags.map(tag => (
                        <Tag key={tag} btnColor={room.btnColor}>
                          {tag}
                        </Tag>
                      ))}
                    </TagsContainer>
                  </CardHeader>
                  <UsersContainer>
                    {room.users.map((user, i) => (
                      <UserItem key={user.name}>
                        <UserAvatar 
                          bg={i===0 ? "#c0cdfa" : "#e99ad7"} 
                          color={i===0 ? "#295a4a" : "#b0336e"}
                        >
                          {user.initials}
                        </UserAvatar>
                        <UserInfoWrapper>
                          <UserHeader>
                            <UserName>{user.name}</UserName>
                            <UserLevel bg={user.levelColor} color={user.levelTextColor}>
                              Level {user.level}
                            </UserLevel>
                            <MessageTime>{user.time}</MessageTime>
                          </UserHeader>
                          <MessageBubble isNew={user.isNew}>
                            {user.msg}
                          </MessageBubble>                          <MessageStatus isLiked={likedMessages[`${idx}-${i}`]}>
                            <span 
                              className="status-icon" 
                              onClick={() => handleLikeToggle(idx, i)}
                            >
                              {likedMessages[`${idx}-${i}`] ? "♥" : "♡"}
                            </span>
                            <span className="likes">
                              {likedMessages[`${idx}-${i}`] ? user.likes + 1 : user.likes} likes
                            </span>
                            <span>•</span>
                            <button className="action-button">Reply</button>
                            {user.isNew && <span>•</span>}
                            {user.isNew && <span style={{color: "#5390D9"}}>New</span>}
                          </MessageStatus>
                        </UserInfoWrapper>
                      </UserItem>
                    ))}                    <ButtonContainer>
                      <ActionButton bg={room.btnColor} onClick={() => handleJoinDiscussion(room)}>
                        Join Discussion
                      </ActionButton>
                    </ButtonContainer>
                  </UsersContainer>
                  <TagsContainer>
                    {room.tags.map(tag => (
                      <Tag key={tag} btnColor={room.btnColor}>
                        {tag}
                      </Tag>
                    ))}
                  </TagsContainer>
                </TrekInfo>
              </CommunityCard>
            ))
          )}
        </CardsContainer>
        
        <SeeMoreButton onClick={handleLoadMore} disabled={!hasMore || loading}>
          {loading ? "Loading..." : hasMore ? "See More Communities" : "No More Communities"}
        </SeeMoreButton>

        <PromotionSection>
          <PromotionTitle>Join the Adventure!</PromotionTitle>
          <PromotionText>
            Become a part of our growing community and unlock exclusive benefits. 
            Share your trekking stories, get personalized advice, and connect with fellow adventurers.
          </PromotionText>
          <PromotionButtons>
            <PrimaryButton onClick={() => auth.currentUser ? navigate('/community') : navigate('/login')}>
              Join the Community
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/explore')}>
              Learn More
            </SecondaryButton>
          </PromotionButtons>          <StatStrip>
            <Stat>
              <StatIconWrapper>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </StatIconWrapper>
              <StatNumber>10,000+</StatNumber>
              <StatLabel>Members Worldwide</StatLabel>
            </Stat>
            <Stat>
              <StatIconWrapper>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </StatIconWrapper>
              <StatNumber>5,000+</StatNumber>
              <StatLabel>Active Discussions</StatLabel>
            </Stat>
            <Stat>
              <StatIconWrapper>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.5,21H1.5L7.71,5.74a1,1,0,0,1,1.72,0L11.9,11.64L14.57,7.29a1,1,0,0,1,1.72,0Z"></path>
                </svg>
              </StatIconWrapper>
              <StatNumber>1,000+</StatNumber>
              <StatLabel>Treks Shared</StatLabel>
            </Stat>
          </StatStrip>
        </PromotionSection>
      </ContentContainer>
    </SectionContainer>
  );
}
