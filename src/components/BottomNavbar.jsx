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
  -webkit-backdrop-filter: blur(12px); /* Safari support */
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.7), 0 -3px 12px rgba(255, 107, 107, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  padding: 0 max(20px, 5%);
  height: 65px;
  animation: ${fadeIn} 0.6s ease-out;
  
  /* Enhanced safe area support for iOS */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  
  /* Safari-specific fixes */
  ${({ $isSafari }) => $isSafari && css`
    transform: translateZ(0); /* Helps with rendering on Safari */
    will-change: transform; /* Performance optimization */
    -webkit-touch-callout: none; /* Disable callout on iOS */
    -webkit-user-select: none; /* Disable text selection */
    user-select: none;
  `}
  
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
    pointer-events: none; /* Prevent interference with touch events */
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
    pointer-events: none; /* Prevent interference with touch events */
  } 
  
  @media (max-width: 768px) {
    padding: 0 8px;
    height: calc(60px + env(safe-area-inset-bottom, 0px));
    min-height: 60px;
  }
  
  @media (max-width: 480px) {
    height: calc(58px + env(safe-area-inset-bottom, 0px));
    min-height: 58px;
    padding: 0 4px;
  }
  
  /* Ensure proper size on smaller screens */
  @media (max-height: 600px) {
    height: calc(55px + env(safe-area-inset-bottom, 0px));
    min-height: 55px;
  }
  
  /* Enhanced iOS support */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Prevent zoom on double tap for iOS */
  touch-action: manipulation;
`;

const NavLinks = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  gap: 2px;
  
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
    justify-content: center;
    padding: 8px 4px;
    flex: 1;
    z-index: 2;
    min-height: 44px; /* Minimum touch target size */
    min-width: 44px;
    
    /* Enhanced touch handling */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    cursor: pointer;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
    }
    
    svg {
      font-size: 1.35rem;
      margin-bottom: 3px;
      transition: all 0.4s ease;
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
      color: rgba(232, 232, 232, 0.8);
      pointer-events: none; /* Prevent icon from blocking touch events */
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
      pointer-events: none; /* Prevent text from blocking touch events */
    }
      
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 50%;
      background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
      transform: translateX(-50%);
      transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
      border-radius: 4px;
      opacity: 0;
      pointer-events: none;
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
      
      /* Enhanced mobile active state */
      @media (max-width: 480px) {
        &::after {
          width: 70%;
          height: 3.5px;
        }
        
        svg {
          filter: drop-shadow(0 0 12px rgba(255, 131, 131, 0.9)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
        }
      }
        
      span {
        font-weight: 600;
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.8);
        letter-spacing: 0.7px;
        color: #fff;
        transform: translateY(-2px) scale(1.05);
      }
    }
    
    /* Hover states - only for non-touch devices */
    @media (hover: hover) and (pointer: fine) {
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
    }
    
    /* Touch feedback */
    &:active,
    &.touch-active {
      transform: scale(0.95);
      transition: transform 0.1s ease;
      
      svg {
        transform: translateY(-1px) scale(1.05);
      }
    }
    
    &.touch-end {
      transform: scale(1);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    /* Mobile optimizations */
    @media (max-width: 420px) {
      padding: 10px 2px;
      min-height: 48px;
      
      span {
        font-size: 0.6rem;
      }
      
      svg {
        font-size: 1.4rem;
        margin-bottom: 4px;
      }
    }

    /* Extra small screens */
    @media (max-width: 360px) {
      padding: 8px 1px;
      min-height: 44px;
      
      span {
        font-size: 0.55rem;
      }
      
      svg {
        font-size: 1.3rem;
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
  justify-content: center;
  padding: 8px 4px;
  flex: 1;
  cursor: pointer;
  z-index: 2;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 44px; /* Minimum touch target size */
  min-width: 44px;
  
  /* Enhanced touch handling */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ $isLoggedIn }) => ($isLoggedIn ? '1' : '0')});
    width: ${({ $isLoggedIn }) => ($isLoggedIn ? '25%' : '5px')};
    height: ${({ $isLoggedIn }) => ($isLoggedIn ? '2px' : '5px')};
    background: ${({ $isLoggedIn }) => ($isLoggedIn ? 'rgba(255, 107, 107, 0.8)' : 'rgba(255, 255, 255, 0.7)')};
    border-radius: ${({ $isLoggedIn }) => ($isLoggedIn ? '4px' : '50%')};
    transition: all 0.3s ease;
    opacity: ${({ $isLoggedIn }) => ($isLoggedIn ? '0.8' : '0')};
    ${({ $isLoggedIn }) => $isLoggedIn && css`animation: ${floatEffect} 2s infinite ease-in-out;`}
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background: linear-gradient(90deg, #f59e0b, #ef4444);
    transform: translateX(-50%);
    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
  }
  
  svg {
    font-size: 1.35rem;
    margin-bottom: 3px;
    transition: all 0.4s ease;
    color: ${({ $isLoggedIn }) => ($isLoggedIn ? '#FF6B6B' : 'rgba(232, 232, 232, 0.8)')};
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
    pointer-events: none; /* Prevent icon from blocking touch events */
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
    pointer-events: none; /* Prevent text from blocking touch events */
  }
  
  /* Hover states - only for non-touch devices */
  @media (hover: hover) and (pointer: fine) {
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
  }
  
  /* Touch feedback */
  &:active,
  &.touch-active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
    
    svg {
      transform: translateY(-1px) scale(1.05);
    }
  }
  
  &.touch-end {
    transform: scale(1);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  /* Mobile optimizations */
  @media (max-width: 420px) {
    padding: 10px 2px;
    min-height: 48px;
    
    span {
      font-size: 0.6rem;
    }
    
    svg {
      font-size: 1.4rem;
      margin-bottom: 4px;
    }
  }
  
  /* Extra small screens */
  @media (max-width: 360px) {
    padding: 8px 1px;
    min-height: 44px;
    
    span {
      font-size: 0.55rem;
    }
    
    svg {
      font-size: 1.3rem;
    }
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: ${({ $safeAreaBottom }) => `calc(80px + ${$safeAreaBottom}px)`};
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
  pointer-events: ${({ $show }) => ($show ? 'auto' : 'none')};
  
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
    pointer-events: none;
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
    bottom: ${({ $safeAreaBottom }) => `calc(75px + ${$safeAreaBottom}px)`};
  }
`;

// Enhanced touch feedback hook
const useTouchFeedback = (navbarRef) => {
  useEffect(() => {
    if (!navbarRef.current) return;
    
    const navbar = navbarRef.current;
    const touchableElements = navbar.querySelectorAll('a, div[role="button"]');
    
    const addTouchClass = (e) => {
      // Only prevent default if needed for iOS double-tap zoom
      // e.preventDefault(); // Commented out to avoid blocking navigation
      e.currentTarget.classList.add('touch-active');
    };
    
    const removeTouchClass = (e) => {
      e.currentTarget.classList.add('touch-end');
      e.currentTarget.classList.remove('touch-active');
      
      setTimeout(() => {
        e.currentTarget.classList.remove('touch-end');
      }, 300);
    };
    
    const handleTouchCancel = (e) => {
      e.currentTarget.classList.remove('touch-active', 'touch-end');
    };
    
    touchableElements.forEach(element => {
      if (element instanceof Element) {
        // Enhanced touch event handling
        element.addEventListener('touchstart', addTouchClass, { passive: true });
        element.addEventListener('touchend', removeTouchClass, { passive: true });
        element.addEventListener('touchcancel', handleTouchCancel, { passive: true });
        
        // Accessibility improvements
        if (element.tagName.toLowerCase() !== 'a') {
          element.setAttribute('role', 'button');
          element.setAttribute('tabindex', '0');
          element.setAttribute('aria-label', element.textContent || 'Navigation button');
        }
        
        // Add keyboard support
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
          }
        });
      }
    });
    
    return () => {
      touchableElements.forEach(element => {
        if (element instanceof Element) {
          element.removeEventListener('touchstart', addTouchClass);
          element.removeEventListener('touchend', removeTouchClass);
          element.removeEventListener('touchcancel', handleTouchCancel);
        }
      });
    };
  }, [navbarRef]);
};

// Hook to get safe area inset bottom
const useSafeAreaInset = () => {
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  
  useEffect(() => {
    const updateSafeArea = () => {
      // Try to get the safe area inset bottom value
      const safeAreaValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-bottom') || '0px';
      const numericValue = parseInt(safeAreaValue.replace('px', '')) || 0;
      setSafeAreaBottom(numericValue);
    };
    
    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);
  
  return safeAreaBottom;
};

const BottomNavbar = ({ active, transparent = false }) => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimeoutRef = useRef(null);
  const navbarRef = useRef(null);
  const safeAreaBottom = useSafeAreaInset();
  
  // Detect Safari browser and iOS for specific fixes
  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    setIsSafari(isSafariBrowser || isIOS);
    
    // Add utility classes
    if (isIOS) {
      document.body.classList.add('ios-device');
    }
    
    // Set CSS custom property for safe area inset
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 
      getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0px'
    );
  }, []);

  // Track scroll position with improved performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setScrolled(scrollTop > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply touch feedback for mobile devices
  useTouchFeedback(navbarRef);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUpcomingFeature = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3500);
  };

  const handleProfileAction = (e) => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // Enhanced scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle navigation with proper event handling
  const handleNavigation = (path, e) => {
    if (location.pathname === path && path === '/') {
      scrollToTop();
    } else {
      navigate(path);
    }
  };
  
  return (
    <>
      <NavbarWrapper 
        ref={navbarRef} 
        $scrolled={scrolled} 
        $transparent={transparent}
        $isSafari={isSafari}
      >
        <NavLinks>
          <Link 
            to="/" 
            className={location.pathname === '/' || active === 'home' ? 'active-link' : ''}
            onClick={(e) => handleNavigation('/', e)}
          >
            <FaHome />
            <span>Discover</span>
          </Link>
          
          <Link 
            to="/explore" 
            className={location.pathname === '/explore' || active === 'explore' ? 'active-link' : ''}
            onClick={(e) => handleNavigation('/explore', e)}
          >
            <FaCompass />
            <span>Adventures</span>
          </Link>
          
          <Link 
            to="/community"
            className={location.pathname === '/community' || active === 'community' ? 'active-link' : ''}
            onClick={(e) => handleNavigation('/community', e)}
          >
            <FaUsers />
            <span>Community</span>
          </Link>
          
          <Link 
            to="/about"
            className={location.pathname === '/about' || active === 'about' ? 'active-link' : ''}
            onClick={(e) => handleNavigation('/about', e)}
          >
            <FaInfoCircle />
            <span>About</span>
          </Link>
          
          <UserButton 
            onClick={handleProfileAction} 
            $isLoggedIn={!!user}
            role="button"
            tabIndex="0"
            aria-label={user ? 'Go to profile' : 'Login'}
          >
            <FaUserCircle />
            <span>{user ? 'Profile' : 'Login'}</span>
          </UserButton>
        </NavLinks>
      </NavbarWrapper>
      
      <Toast $show={showToast} $safeAreaBottom={safeAreaBottom}>
        <span>Coming Soon!</span> We're crafting something extraordinary for you <span className="toast-emoji">✨</span>
      </Toast>
    </>
  );
};

// Enhanced BottomNavbar component with beautiful UI and animations
export default React.memo(BottomNavbar);