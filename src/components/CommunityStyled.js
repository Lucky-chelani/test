import styled, { keyframes } from 'styled-components';
import mapPattern from '../assets/images/map-pattren.png';

// Animation keyframes
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

// Page and container styles
export const Page = styled.div`
  background: #060F1B url(${mapPattern});
  background-size: cover;
  background-repeat: repeat;
  min-height: 100vh;
  color: #fff;
  padding: 80px 0 120px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(10, 26, 47, 0.4) 0%, rgba(10, 26, 47, 0.9) 100%);
    pointer-events: none;
  }
`;

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

// Header styles
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

export const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  h1 {
    font-size: 2.8rem;
    margin: 0 0 10px 0;
    font-weight: 700;
    background: linear-gradient(90deg, #fff, #a9c2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
  }
`;

export const HeaderSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
`;

export const HeadingIconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3a466b, #1e2537);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7facff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  
  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

// Cards and grid layout
export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: rgba(31, 41, 65, 0.7);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-out;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15);
    
    img {
      transform: scale(1.1);
    }
  }
`;

export const CardImageContainer = styled.div`
  height: 180px;
  overflow: hidden;
  position: relative;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease-out;
`;

export const CardContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const CardTitle = styled.h3`
  font-size: 1.3rem;
  margin: 0;
  color: white;
  flex: 1;
`;

export const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: auto;
`;

export const CardStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  
  svg {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const CardRating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  
  small {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .star {
    color: #FFC107;
  }
`;

// Special labels
export const NewLabel = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ee5253);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 20px;
  z-index: 5;
  box-shadow: 0 4px 10px rgba(238, 82, 83, 0.5);
  animation: ${pulse} 2s infinite;
`;

export const FeaturedLabel = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #5758BB, #1E2A78);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 20px;
  z-index: 5;
  box-shadow: 0 4px 10px rgba(30, 42, 120, 0.5);
  letter-spacing: 0.5px;
`;

// Buttons
export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #3a66db, #2752bb);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 6px 15px rgba(39, 82, 187, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(39, 82, 187, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const JoinButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background: linear-gradient(135deg, #3a66db, #2752bb);
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(39, 82, 187, 0.3);
    
    svg {
      transform: translateX(5px);
    }
  }
  
  svg {
    transition: transform 0.2s;
  }
`;

export const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin: 40px auto 0;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Loading skeleton
export const CardSkeleton = styled.div`
  background: rgba(31, 41, 65, 0.7);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 350px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.06) 50%, 
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 180px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

// Messages
export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 107, 107, 0.1);
  border-left: 4px solid #ff6b6b;
  color: #ff9c9c;
  padding: 12px 20px;
  margin: 0 0 30px;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease-out;
  
  svg {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(46, 213, 115, 0.1);
  border-left: 4px solid #2ed573;
  color: #7bed9f;
  padding: 12px 20px;
  margin: 0 0 30px;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease-out;
  
  svg {
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
`;

// Empty state
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  grid-column: 1 / -1;
  color: rgba(255, 255, 255, 0.7);
  
  svg {
    margin-bottom: 20px;
    color: rgba(255, 255, 255, 0.4);
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 0 0 12px;
    color: white;
  }
  
  p {
    font-size: 1rem;
    margin: 0 0 20px;
    max-width: 400px;
  }
`;

export const StarIcon = styled.div`
  &.star:before {
    content: "★";
    font-size: 14px;
  }
`;
