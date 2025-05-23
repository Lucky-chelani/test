import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';
import Navbar from '../Navbar';

// Import images
import backgroundSky from '../../assets/images/background-sky.png';
import mountainBack from '../../assets/images/mountain-back.png';
import mountainRight from '../../assets/images/mountain-right.png';
import mountainLeft from '../../assets/images/mountain-left.png';
import birds from '../../assets/images/birds.png';

const Banner = () => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  const contentRef = useRef(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      const scrollPosition = window.scrollY;
      const bannerHeight = bannerRef.current.offsetHeight;
      
      if (scrollPosition < bannerHeight) {
        // Move mountains at different speeds
        const mountainBack = document.querySelector('.mountain-back');
        const mountainRight = document.querySelector('.mountain-right');
        const mountainLeft = document.querySelector('.mountain-left');
        const birds = document.querySelector('.birds');
        const content = contentRef.current;
        const sun = document.querySelector('.sun');
        
        if (mountainBack) mountainBack.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        if (mountainRight) mountainRight.style.transform = `translateY(${scrollPosition * 0.08}px) translateX(${scrollPosition * 0.02}px)`;
        if (mountainLeft) mountainLeft.style.transform = `translateY(${scrollPosition * 0.08}px) translateX(-${scrollPosition * 0.02}px)`;
        if (birds) birds.style.transform = `translateY(${scrollPosition * 0.1}px) translateX(${scrollPosition * 0.05}px)`;
        if (sun) sun.style.transform = `translateY(${scrollPosition * 0.06}px)`;
        if (content) content.style.transform = `translateY(${scrollPosition * 0.15}px)`;
        if (content) content.style.opacity = 1 - scrollPosition / (bannerHeight * 0.5);
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
      <Navbar active="home" />
      
      {/* Background Elements */}
      <div className="banner-overlay">
        <div className="background-sky">
          <img src={backgroundSky} alt="sky" />
        </div>
        
        {/* Sun - new element */}
        <div className="sun"></div>
        
        {/* Clouds - new elements */}
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        
        <div className="mountains">
          <img src={mountainBack} alt="mountain back" className="mountain-back" />
          <img src={mountainRight} alt="mountain right" className="mountain-right" />
          <img src={mountainLeft} alt="mountain left" className="mountain-left" />
        </div>
        <div className="birds">
          <img src={birds} alt="birds" />
        </div>
      </div>

      {/* Content */}
      <div className="banner-content" ref={contentRef}>
        <h1 className="banner-title">
          DISCOVER YOUR NEXT<br />ADVENTURE
        </h1>
        <p className="banner-subtitle">
          Explore breathtaking trails and unforgettable journeys
        </p>
        <div className="banner-actions">
          <button 
            className="banner-btn primary"
            onClick={() => navigate('/explore')}
          >
            Explore Treks
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator" onClick={handleScrollDown}>
        <span className="scroll-text">Scroll Down</span>
        <div className="scroll-arrow"></div>
      </div>
    </div>
  );
};

export default Banner;