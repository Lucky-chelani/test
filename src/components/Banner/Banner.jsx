import React, { useEffect, useRef, useState } from 'react';
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
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Image preloading
  useEffect(() => {
    const imageUrls = [backgroundSky, mountainBack, mountainRight, mountainLeft, birds];
    let loadedCount = 0;
    
    const imageLoaded = () => {
      loadedCount++;
      if (loadedCount === imageUrls.length) {
        setImagesLoaded(true);
      }
    };
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = imageLoaded;
      img.onerror = imageLoaded; // Count errors as loaded to prevent hanging
    });
  }, []);

  // Add animation on mount
  useEffect(() => {
    // Staggered entrance animations
    setTimeout(() => {
      if (titleRef.current) titleRef.current.classList.add('animate-in');
    }, 300);
    setTimeout(() => {
      if (subtitleRef.current) subtitleRef.current.classList.add('animate-in');
    }, 600);
    setTimeout(() => {
      if (buttonsRef.current) buttonsRef.current.classList.add('animate-in');
    }, 900);
  }, []);

  // Enhanced scroll effect with optimization
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
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
          
          ticking = false;
        });
        ticking = true;
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
    <div className={`banner ${imagesLoaded ? 'loaded' : 'loading'}`} ref={bannerRef}>
      {!imagesLoaded && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Preparing your adventure...</p>
        </div>
      )}
      
      {/* Modern color overlay with multiple gradients */}
      <div className="color-overlay"></div>
      
      {/* Enhanced backdrop with multiple gradient overlay */}
      <div className="backdrop-gradient"></div>
      
      {/* Pass initialScrolled=true to make navbar visible initially with background */}
      <Navbar active="home" transparent={true} initialScrolled={true} />
      
      {/* Background Elements */}
      <div className="banner-overlay">
        <div className="background-sky">
          <img src={backgroundSky} alt="sky" />
        </div>
        
        {/* Enhanced sun with improved glow effect */}
        <div className="sun">
          <div className="sun-inner-glow"></div>
          <div className="sun-glow"></div>
          <div className="sun-rays"></div>
        </div>
        
        {/* Improved clouds with different sizes and opacity */}
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="cloud cloud4"></div>
        <div className="cloud cloud5"></div>
        
        {/* Add subtle fog/mist effect */}
        <div className="mist mist-1"></div>
        <div className="mist mist-2"></div>
        
        {/* Animated particles */}
        <div className="particles"></div>
        
        {/* Mountains with no animation but proper layering */}
        <div className="mountains">
          <div className="mountain-overlay"></div>
          <img src={mountainBack} alt="mountain back" className="mountain-back" />
          <img src={mountainRight} alt="mountain right" className="mountain-right" />
          <img src={mountainLeft} alt="mountain left" className="mountain-left" />
        </div>
        
        {/* Birds with enhanced animation */}
        <div className="birds">
          <img src={birds} alt="birds" />
        </div>
      </div>

      {/* Modern Content Layout with Card-like Container */}
      <div className="content-container">
        <div className="banner-content" ref={contentRef}>
          <div className="content-card">
            <h1 className="banner-title" ref={titleRef}>
              <span className="highlight">DISCOVER</span><br />
              YOUR NEXT<br />
              <span className="adventure-text">ADVENTURE</span>
            </h1>
            <p className="banner-subtitle" ref={subtitleRef}>
              Explore breathtaking trails and unforgettable journeys
            </p>
            <div className="banner-actions" ref={buttonsRef}>
              <button 
                className="banner-btn primary"
                onClick={() => navigate('/explore')}
                aria-label="Explore Treks"
              >
                <span className="btn-text">Explore Treks</span>
                <span className="btn-icon">→</span>
              </button>
              <button 
                className="banner-btn secondary"
                onClick={() => navigate('/popular')}
                aria-label="View Popular Destinations"
              >
                <span className="btn-text">Popular Destinations</span>
                <span className="btn-icon">★</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Scroll Indicator */}
      <div className="scroll-indicator-container">
        <div className="scroll-indicator" onClick={handleScrollDown} aria-label="Scroll down for more content">
          <span className="scroll-text">Discover More</span>
          <div className="scroll-circle">
            <div className="scroll-arrow-container">
              <div className="scroll-arrow"></div>
              <div className="scroll-arrow delayed"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;