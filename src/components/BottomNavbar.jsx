import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaHome, FaCompass, FaUsers, FaBook, FaMedal, FaInfoCircle, FaUserCircle } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const iconPop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const iconPulse = keyframes`
  0% { transform: translateY(-4px) scale(1.15); filter: drop-shadow(0 0 8px rgba(255, 131, 131, 0.7)); }
  50% { transform: translateY(-4px) scale(1.25); filter: drop-shadow(0 0 12px rgba(255, 131, 131, 0.9)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.6)); }
  100% { transform: translateY(-4px) scale(1.15); filter: drop-shadow(0 0 8px rgba(255, 131, 131, 0.7)); }
`;

// Subtle floating animation
const floatEffect = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

// New subtle glow animation
const subtleGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5), 0 0 10px rgba(255, 107, 107, 0.2); }
  50% { box-shadow: 0 0 8px rgba(255, 107, 107, 0.7), 0 0 15px rgba(255, 107, 107, 0.3); }
  100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5), 0 0 10px rgba(255, 107, 107, 0.2); }
`;

const NavbarWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;  
  background: linear-gradient(to top, rgba(10, 12, 20, 0.95), rgba(17, 21, 38, 0.92));
  backdrop-filter: blur(12px);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.7), 0 -3px 12px rgba(255, 107, 107, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  padding: 0 max(20px, 5%);
  height: 65px;
  animation: ${fadeIn} 0.6s ease-out;
  
  /* Modern glass morphism effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 35%, rgba(255, 119, 119, 0.15) 0%, transparent 70%),
      radial-gradient(circle at 80% 65%, rgba(100, 149, 237, 0.15) 0%, transparent 70%);
    opacity: 0.85;
    z-index: -1;
  }
  
  /* Top border */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ $scrolled }) => 
      $scrolled 
        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)' 
        : 'transparent'};
    opacity: 0.8;
  }
  @media (max-width: 768px) {
    padding: 0;
    height: 60px;
  }
  
  @media (max-width: 480px) {
    height: 58px;
  }
  
  @media (max-height: 600px) {
    height: 55px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;  
  
  a {
    position: relative;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 0;
    flex: 1;
    z-index: 2;
    
    &::before {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      transition: all 0.3s ease;
      opacity: 0;
    }
    
    svg {
      font-size: 1.35rem;
      margin-bottom: 3px;
      transition: all 0.4s ease;
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
      color: rgba(232, 232, 232, 0.8);
    }
    
    span {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      font-weight: 500;
      color: rgba(255, 255, 255, 0.75);
      transition: all 0.3s ease;
      transform: translateY(0);
    }
      
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 50%;
      background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
      transform: translateX(-50%);
      transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
      border-radius: 4px;
      opacity: 0;
    }
    
    &.active-link {
      color: #fff;
      font-weight: 600;
      
      &::before {
        transform: translateX(-50%) scaleX(1);
        opacity: 0.8;
        width: 25%;
        height: 2px;
        border-radius: 4px;
        animation: ${floatEffect} 2s infinite ease-in-out;
      }
      
      svg {
        transform: translateY(-4px) scale(1.25);
        color: #FF8383;
        animation: ${iconPulse} 2.5s ease-in-out infinite;
        filter: drop-shadow(0 0 10px rgba(255, 131, 131, 0.8)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
      }
        
      &::after { 
        width: 50%;
        opacity: 1;
        background: linear-gradient(90deg, #4CC9F0, #FF6B6B, #FFD166, #4CC9F0);
        background-size: 300% 100%;
        animation: ${buttonFlare} 3s infinite ease-in-out;
        height: 3px;
      }
        
      span {
        font-weight: 600;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.8);
        letter-spacing: 0.7px;
        color: #fff;
        transform: translateY(-2px) scale(1.05);
      }
    }
    
    &:hover {
      color: #fff;
      
      svg {
        transform: translateY(-2px) scale(1.1);
        filter: drop-shadow(0 2px 6px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 3px rgba(255, 131, 131, 0.4));
        color: #fff;
      }
      
      &::after { 
        width: 30%; 
        opacity: 0.7; 
      }
      
      span {
        opacity: 1;
        transform: translateY(-1px);
        color: rgba(255, 255, 255, 0.95);
      }
      
      &::before {
        opacity: 0.5;
        transform: translateX(-50%) scaleX(0.7);
      }
    }
    
    &:active {
      transform: scale(0.92);
      transition: transform 0.1s ease;
    }
  }

  @media (max-width: 420px) {
    a {
      span {
        font-size: 0.6rem;
      }
      
      svg {
        font-size: 1.25rem;
      }
    }
  }
`;

const UserButton = styled.div`
  position: relative;
  color: ${({ $isLoggedIn }) => ($isLoggedIn ? '#fff' : 'rgba(255, 255, 255, 0.75)')};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  flex: 1;
  cursor: pointer;
  z-index: 2;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  
  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ $isLoggedIn }) => ($isLoggedIn ? '1' : '0')});
    width: ${({ $isLoggedIn }) => ($isLoggedIn ? '25%' : '5px')};
    height: ${({ $isLoggedIn }) => ($isLoggedIn ? '2px' : '5px')};
    background: ${({ $isLoggedIn }) => ($isLoggedIn ? 'rgba(255, 107, 107, 0.8)' : 'rgba(255, 255, 255, 0.7)')};
    border-radius: ${({ $isLoggedIn }) => ($isLoggedIn ? '4px' : '50%')};
    transition: all 0.3s ease;
    opacity: ${({ $isLoggedIn }) => ($isLoggedIn ? '0.8' : '0')};
    ${({ $isLoggedIn }) => $isLoggedIn && css`animation: ${floatEffect} 2s infinite ease-in-out;`}
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 50%;
    background: linear-gradient(90deg, #f59e0b, #ef4444);
    transform: translateX(-50%);
    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
    border-radius: 4px;
    opacity: 0;
  }
  
  svg {
    font-size: 1.35rem;
    margin-bottom: 3px;
    transition: all 0.4s ease;
    color: ${({ $isLoggedIn }) => ($isLoggedIn ? '#FF6B6B' : 'rgba(232, 232, 232, 0.8)')};
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
    ${({ $isLoggedIn }) => $isLoggedIn && css`
      transform: translateY(-4px) scale(1.25);
      filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.8));
    `}
  }
    
  span {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    font-weight: ${({ $isLoggedIn }) => ($isLoggedIn ? '600' : '500')};
    color: ${({ $isLoggedIn }) => ($isLoggedIn ? '#fff' : 'rgba(255, 255, 255, 0.75)')};
    transition: all 0.3s ease;
    transform: ${({ $isLoggedIn }) => ($isLoggedIn ? 'translateY(-2px)' : 'translateY(0)')};
  }
    
  &:hover {
    color: #fff;
    
    svg {
      transform: translateY(-2px) scale(1.1);
      filter: drop-shadow(0 2px 6px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 3px rgba(255, 131, 131, 0.4));
    }
    
    &::after { 
      width: 30%; 
      opacity: 0.7; 
    }
    
    span {
      opacity: 1;
      transform: translateY(-1px);
      color: rgba(255, 255, 255, 0.95);
    }
    
    &::before {
      opacity: 0.5;
      transform: translateX(-50%) scaleX(0.7);
    }
  }
  
  &:active {
    transform: scale(0.92);
    transition: transform 0.1s ease;
  }
  
  @media (max-width: 420px) {
    span {
      font-size: 0.6rem;
    }
    
    svg {
      font-size: 1.25rem;
    }
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) ${({ $show }) => ($show ? 'translateY(0)' : 'translateY(100px)')};
  background: rgba(15, 20, 30, 0.92);
  color: white;
  padding: 14px 28px;
  border-radius: 24px;
  font-weight: 500;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 10px 35px rgba(0, 0, 0, 0.5), 
    0 0 20px rgba(255, 82, 82, 0.25), 
    inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  z-index: 1000;
  opacity: ${({ $show }) => ($show ? '1' : '0')};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;
  min-width: 240px;
  text-align: center;
  letter-spacing: 0.3px;
  
  /* Gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.5), rgba(255, 255, 255, 0.2), rgba(76, 201, 240, 0.3));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    z-index: -1;
  }
  
  span {
    font-weight: 700;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    background: linear-gradient(135deg, #fff 30%, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .toast-emoji {
    margin-left: 8px;
    display: inline-block;
    animation: ${keyframes`
      0% { transform: scale(1) rotate(0deg); opacity: 0.9; }
      25% { transform: scale(1.2) rotate(5deg); opacity: 1; }
      50% { transform: scale(1.15) rotate(-5deg); opacity: 1; }
      75% { transform: scale(1.2) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
    `} 2.5s infinite;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
  }
  
  @media (max-width: 480px) {
    min-width: 220px;
    padding: 12px 24px;
    font-size: 0.9rem;
    border-radius: 20px;
  }
`;

const BottomNavbar = ({ active, transparent = false }) => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimeoutRef = useRef(null);
  const navbarRef = useRef(null);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  // Track scroll position (removed progress calculation)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpcomingFeature = e => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3500);
  };

  const handleProfileAction = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <>
      <NavbarWrapper 
        ref={navbarRef} 
        $scrolled={scrolled} 
        $transparent={transparent}
      >
        <NavLinks>
          <Link 
            to="/" 
            className={location.pathname === '/' || active === 'home' ? 'active-link' : ''}
            onClick={() => {
              if (location.pathname === '/') {
                scrollToTop();
              }
            }}
          >
            <FaHome />
            <span>Discover</span>
          </Link>
          
          <Link 
            to="/explore" 
            className={location.pathname === '/explore' || active === 'explore' ? 'active-link' : ''}
          >
            <FaCompass />
            <span>Adventures</span>
          </Link>
          
          <Link 
            to="/community"
            className={location.pathname === '/community' || active === 'community' ? 'active-link' : ''}
          >
            <FaUsers />
            <span>Community</span>
          </Link>
          
          {/* <Link 
            to="/blog"
            className={location.pathname === '/blog' || active === 'blog' ? 'active-link' : ''}
          >
            <FaBook />
            <span>Journal</span>
          </Link> */}
          
          {/* <Link 
            to="/rewards"
            className={location.pathname === '/rewards' || active === 'rewards' ? 'active-link' : ''}
            onClick={handleUpcomingFeature}
          >
            <FaMedal />
            <span>Rewards</span>
          </Link> */}
          
          <Link 
            to="/about"
            className={location.pathname === '/about' || active === 'about' ? 'active-link' : ''}
          >
            <FaInfoCircle />
            <span>About</span>
          </Link>
          
          <UserButton 
            onClick={handleProfileAction} 
            $isLoggedIn={!!user}
          >
            <FaUserCircle />
            <span>{user ? 'Profile' : 'Login'}</span>
          </UserButton>
        </NavLinks>
      </NavbarWrapper>
      
      <Toast $show={showToast}>
        <span>Coming Soon!</span> We're crafting something extraordinary for you <span className="toast-emoji">✨</span>
      </Toast>
    </>
  );
};

// Enhanced BottomNavbar component with beautiful UI and animations
export default React.memo(BottomNavbar);
