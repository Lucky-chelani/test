import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiChevronLeft, FiChevronRight, FiImage, FiX, FiMaximize2 } from 'react-icons/fi';
import { getValidImageUrl } from '../utils/images';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${props => props.currentIndex * 100}%);
`;

const CarouselImage = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  transition: opacity 0.5s ease;
  animation: ${fadeIn} 0.5s ease;
  position: relative;
`;

const ImagePlaceholder = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 3rem;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease, transform 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  ${CarouselContainer}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-50%) scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
    opacity: 0.7;
    
    ${CarouselContainer}:hover & {
      opacity: 0.9;
    }
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    opacity: 0.6;
    
    ${CarouselContainer}:hover & {
      opacity: 0.8;
    }
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 20px;
  
  @media (max-width: 768px) {
    left: 12px;
  }
  
  @media (max-width: 480px) {
    left: 8px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: 20px;
  
  @media (max-width: 768px) {
    right: 12px;
  }
  
  @media (max-width: 480px) {
    right: 8px;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
  
  @media (max-width: 768px) {
    bottom: 15px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    bottom: 12px;
    gap: 5px;
  }
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
  
  @media (max-width: 768px) {
    width: 7px;
    height: 7px;
  }
  
  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

/**
 * Image Carousel Component
 * @param {Object} props - Component props
 * @param {Array<string>} props.images - Array of image URLs
 * @param {number} props.initialIndex - Initial image index to display
 * @param {boolean} props.autoplay - Whether to autoplay the carousel
 * @param {number} props.interval - Autoplay interval in milliseconds
 */
const ImageCarousel = ({
  images = [],
  initialIndex = 0,
  autoplay = true,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const autoplayTimerRef = useRef(null);
  
  // Ensure we have a valid array of images and filter out any invalid ones
  const validImages = Array.isArray(images) 
    ? images.filter(img => img && typeof img === 'string')
    : [];
  
  // Set up autoplay
  useEffect(() => {
    if (autoplay && validImages.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % validImages.length);
      }, interval);
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, validImages.length, interval, validImages]);
  
  // Go to previous image
  const goToPrev = () => {
    setCurrentIndex(prevIndex => {
      return prevIndex === 0 ? validImages.length - 1 : prevIndex - 1;
    });
    resetAutoplay();
  };
  
  // Go to next image
  const goToNext = () => {
    setCurrentIndex(prevIndex => {
      return (prevIndex + 1) % validImages.length;
    });
    resetAutoplay();
  };
  
  // Go to specific image
  const goToIndex = (index) => {
    setCurrentIndex(index);
    resetAutoplay();
  };
  
  // Reset autoplay timer
  const resetAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      if (autoplay && validImages.length > 1) {
        autoplayTimerRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % validImages.length);
        }, interval);
      }
    }
  };
    
  // If no valid images, show placeholder
  if (validImages.length === 0) {
    console.log("ImageCarousel: No valid images to display");
    return (
      <CarouselContainer>
        <ImagePlaceholder>
          <FiImage />
        </ImagePlaceholder>
      </CarouselContainer>
    );
  }
  
  return (
    <CarouselContainer>
      <ImageContainer currentIndex={currentIndex}>
        {validImages.map((image, index) => (
          <CarouselImage 
            key={index} 
            src={getValidImageUrl(image)}
          />
        ))}
      </ImageContainer>
      
      {validImages.length > 1 && (
        <>
          <PrevButton onClick={goToPrev}>
            <FiChevronLeft />
          </PrevButton>
          
          <NextButton onClick={goToNext}>
            <FiChevronRight />
          </NextButton>
          
          <DotsContainer>
            {validImages.map((_, index) => (
              <Dot 
                key={index} 
                active={index === currentIndex} 
                onClick={() => goToIndex(index)}
              />
            ))}
          </DotsContainer>
        </>
      )}
    </CarouselContainer>
  );
};

export default ImageCarousel;
