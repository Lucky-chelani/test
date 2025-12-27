import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';
import styled from 'styled-components';
import AnimatedSearchTapBar from '../AnimatedSearchTapBar';
// Removed Navbar import since we're using BottomNavbar in App.js now

// Import images
import backgroundSky from '../../assets/images/background-sky.png';
import mountainBack from '../../assets/images/mountain-back.png';
import mountainRight from '../../assets/images/mountain-right.png';
import mountainLeft from '../../assets/images/mountain-left.png';
import birds from '../../assets/images/birds.png';

// Styled component for the search bar position
const SearchBarWrapper = styled.div`
  position: relative;
  z-index: 100;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  width: 90%; /* Changed from 100% to 90% to prevent edge touching */
  max-width: 380px;
  margin: 10px auto; /* Reduced margin */
  transform: translateY(0);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    max-width: 100%; /* Let parent padding control width */
  }
  
`;

const Banner = () => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  const contentRef = useRef(null);

  // Enhanced scroll effect without mountain animations
  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      const scrollPosition = window.scrollY;
      const bannerHeight = bannerRef.current.offsetHeight;
      
      if (scrollPosition < bannerHeight) {
        // Only animate non-mountain elements
        const birds = document.querySelector('.birds');
        const content = contentRef.current;
        const sun = document.querySelector('.sun');
        const clouds = document.querySelectorAll('.cloud');
        
        if (birds) birds.style.transform = `translateY(${scrollPosition * 0.1}px) translateX(${scrollPosition * 0.05}px)`;
        if (sun) sun.style.transform = `translateY(${scrollPosition * 0.03}px) scale(${1 + scrollPosition * 0.0005})`;
        if (content) {
          content.style.transform = `translateY(${scrollPosition * 0.12}px)`;
          content.style.opacity = 1 - scrollPosition / (bannerHeight * 0.5);
        }
        
        // Animate clouds in different directions
        clouds.forEach((cloud, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          cloud.style.transform = `translateX(${scrollPosition * 0.03 * direction}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll indicator click
  const handleScrollDown = () => {
    const bannerHeight = bannerRef.current.offsetHeight;
    window.scrollTo({
      top: bannerHeight,
      behavior: 'smooth'
    });
  };
  return (
    <div className="banner" ref={bannerRef}>
      {/* Navbar removed - using BottomNavbar from App.js */}
      
      {/* Background Elements */}
      <div className="banner-overlay">
        <div className="background-sky">
          <img src={backgroundSky} alt="sky" />
        </div>
        
        {/* Enhanced sun with glow effect */}
        <div className="sun">
          <div className="sun-glow"></div>
        </div>
        
        {/* Improved clouds with different sizes and opacity */}
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="cloud cloud4"></div>
        <div className="cloud cloud5"></div>
        
        {/* Mountains with no animation but proper layering */}
        <div className="mountains">
          <img src={mountainBack} alt="mountain back" className="mountain-back" />
          <img src={mountainRight} alt="mountain right" className="mountain-right" />
          <img src={mountainLeft} alt="mountain left" className="mountain-left" />
        </div>
        
        {/* Birds with enhanced animation */}
        <div className="birds">
          <img src={birds} alt="birds" />
        </div>      </div>
      
      {/* Enhanced Content with better transitions */}      <div className="banner-content" ref={contentRef}>
        <h1 className="banner-title">
          DISCOVER YOUR NEXT<br />ADVENTURE
        </h1>
        <p className="banner-subtitle">
          Explore breathtaking trails and unforgettable journeys
        </p>

        {/* Animated Search Tap Bar - Centered position */}
        <SearchBarWrapper className="search-tap-container">
          <AnimatedSearchTapBar />
        </SearchBarWrapper>
        <div className="banner-actions">
          <button 
            className="banner-btn primary"
            onClick={() => navigate('/explore')}
          >
            Explore Treks
          </button>
          <button 
            className="banner-btn secondary"
            onClick={() => navigate('/explore')}
          >
            Popular Destinations
          </button>
        </div>
      </div>
      

    </div>
  );
};

export default Banner;