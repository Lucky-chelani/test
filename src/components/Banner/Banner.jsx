import React from 'react';
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

  return (
    <div className="banner">
      <Navbar active="home" />
      {/* Background Elements */}
      <div className="banner-overlay">
        <div className="background-sky">
          <img src={backgroundSky} alt="sky" />
        </div>
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
      <div className="banner-content">
        <h1 className="banner-title">DISCOVER YOUR NEXT<br />ADVENTURE</h1>
        <p className="banner-subtitle">
          Live your dream and explore
        </p>
        <div className="banner-actions">
          <button className="banner-btn primary">Explore Treks</button>
        </div>
      </div>
    </div>
  );
};

export default Banner; 