import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaHome, FaCompass, FaUsers, FaInfoCircle, FaUserCircle, FaMountain, FaShieldAlt } from 'react-icons/fa';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const iconPulse = keyframes`
  0% { transform: translateY(-4px) scale(1.15); filter: drop-shadow(0 0 8px rgba(255, 131, 131, 0.7)); }
  50% { transform: translateY(-4px) scale(1.25); filter: drop-shadow(0 0 12px rgba(255, 131, 131, 0.9)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.6)); }
  100% { transform: translateY(-4px) scale(1.15); filter: drop-shadow(0 0 8px rgba(255, 131, 131, 0.7)); }
`;

const floatEffect = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

// --- Styled Components ---

/* WRAPPER: The Full Width Glass Bar */
const NavbarWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%; /* Forces full width */
  height: calc(65px + env(safe-area-inset-bottom));
  z-index: 100;
  
  /* Glassmorphism Styling */
  background: linear-gradient(to top, rgba(10, 12, 20, 0.98), rgba(17, 21, 38, 0.95));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
  
  display: flex;
  justify-content: center; /* Centers the inner container */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;

  /* Hide when in chatroom */
  ${props => props.$hiddenInChat && css`
    transform: translateY(100%);
  `}

  /* Safari Fixes */
  ${({ $isSafari }) => $isSafari && css`
    transform: translateZ(0);
  `}
`;

/* INNER CONTAINER: Keeps icons grouped */
const NavLinks = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px; /* Constrains icons on Desktop so they aren't too far apart */
  height: 100%;
  justify-content: space-around; /* Evenly spaces icons */
  align-items: center;
  padding: 0 10px;

  /* Link & Button Styling */
  a, div[role="button"] {
    position: relative;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    /* The Dot Indicator */
    &::before {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%) scale(0);
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      opacity: 0;
    }
    
    /* Icons */
    svg {
      font-size: 1.4rem;
      margin-bottom: 4px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
    }
    
    /* Text Labels */
    span {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
      transition: all 0.3s ease;
      opacity: 0.8;
    }
      
    /* The Bottom Line Gradient */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 40%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(76, 201, 240, 0.5), transparent);
      transform: translateX(-50%) scaleX(0);
      transition: transform 0.3s ease;
      opacity: 0;
    }
    
    /* ACTIVE STATE */
    &.active-link, &[data-active="true"] {
      color: #fff;
      
      /* Dot appears */
      &::before {
        transform: translateX(-50%) scale(1);
        opacity: 1;
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
      }
      
      /* Top Line appears */
      &::after { 
        transform: translateX(-50%) scaleX(1);
        opacity: 1;
      }
      
      svg {
        transform: translateY(-4px);
        color: #FF8383;
        filter: drop-shadow(0 0 8px rgba(255, 131, 131, 0.6));
      }
        
      span {
        color: #fff;
        font-weight: 700;
        transform: translateY(-2px);
      }
    }
    
    /* Hover Effect (Desktop) */
    @media (hover: hover) {
      &:hover:not(.active-link):not([data-active="true"]) {
        color: #fff;
        svg { transform: translateY(-2px); }
        span { opacity: 1; }
      }
    }
    
    /* Small Screens */
    @media (max-width: 360px) {
      span { font-size: 0.55rem; }
      svg { font-size: 1.2rem; }
    }
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: ${({ $safeAreaBottom }) => `calc(80px + ${$safeAreaBottom}px)`};
  left: 50%;
  transform: translateX(-50%) ${({ $show }) => ($show ? 'translateY(0)' : 'translateY(20px)')} scale(${({ $show }) => ($show ? '1' : '0.9')});
  background: rgba(15, 20, 30, 0.95);
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 500;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  opacity: ${({ $show }) => ($show ? '1' : '0')};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 0.9rem;
  white-space: nowrap;
`;

// --- Hooks ---
const useTouchFeedback = (navbarRef) => {
  useEffect(() => {
    if (!navbarRef.current) return;
    const elements = navbarRef.current.querySelectorAll('a, div[role="button"]');
    
    const start = (e) => e.currentTarget.style.transform = 'scale(0.95)';
    const end = (e) => e.currentTarget.style.transform = 'scale(1)';
    
    elements.forEach(el => {
      el.addEventListener('touchstart', start, { passive: true });
      el.addEventListener('touchend', end, { passive: true });
    });
    
    return () => {
      elements.forEach(el => {
        el.removeEventListener('touchstart', start);
        el.removeEventListener('touchend', end);
      });
    };
  }, [navbarRef]);
};

const useSafeAreaInset = () => {
  const [bottom, setBottom] = useState(0);
  useEffect(() => {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom');
    setBottom(parseInt(val.replace('px', '')) || 0);
  }, []);
  return bottom;
};

// --- Main Component ---
const BottomNavbar = ({ active, transparent = false }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [showToast, setShowToast] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const safeAreaBottom = useSafeAreaInset();

  // 1. Browser Detection
  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || isIOS);
    
    // Auto-Padding: Prevents navbar from covering content
    document.body.style.paddingBottom = `calc(70px + env(safe-area-inset-bottom))`;
    return () => { document.body.style.paddingBottom = '0'; };
  }, []);

  useTouchFeedback(navbarRef);

  // 2. Auth & Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) setUserRole(userDoc.data().role || 'user');
        } catch (e) { console.error(e); }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavigation = (path, e) => {
    if (e) e.preventDefault();
    if (location.pathname === path && path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  // 3. Render Links Logic
  const renderNavLinks = () => {
    const isActive = (path) => location.pathname === path || active === path.replace('/', '');

    const commonLinks = (
      <>
        <Link to="/" className={isActive('/') ? 'active-link' : ''} onClick={(e) => handleNavigation('/', e)}>
          <FaHome />
          <span>Discover</span>
        </Link>
        <Link to="/explore" className={isActive('/explore') ? 'active-link' : ''} onClick={(e) => handleNavigation('/explore', e)}>
          <FaCompass />
          <span>Explore</span>
        </Link>
        <Link to="/community" className={isActive('/community') ? 'active-link' : ''} onClick={(e) => handleNavigation('/community', e)}>
          <FaUsers />
          <span>Community</span>
        </Link>
      </>
    );

    let roleLink = null;
    if (!user) {
      roleLink = (
        <Link to="/organizer-trek-login" className={isActive('/organizer-trek-login') ? 'active-link' : ''} onClick={(e) => handleNavigation('/organizer-trek-login', e)}>
          <FaMountain />
          <span>Organizer</span>
        </Link>
      );
    } else if (userRole === 'organizer') {
      roleLink = (
        <Link to="/organizer/dashboard" className={isActive('/organizer/dashboard') ? 'active-link' : ''} onClick={(e) => handleNavigation('/organizer/dashboard', e)}>
          <FaShieldAlt />
          <span>Dashboard</span>
        </Link>
      );
    } else if (userRole === 'admin') {
      roleLink = (
        <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active-link' : ''} onClick={(e) => handleNavigation('/admin', e)}>
          <FaShieldAlt />
          <span>Admin</span>
        </Link>
      );
    } else {
      roleLink = (
        <Link to="/about" className={isActive('/about') ? 'active-link' : ''} onClick={(e) => handleNavigation('/about', e)}>
          <FaInfoCircle />
          <span>About</span>
        </Link>
      );
    }

    return (
      <>
        {commonLinks}
        {roleLink}
      </>
    );
  };

  const isInChatRoom = location.pathname.includes('/community/chat');

  return (
    <>
      <NavbarWrapper 
        ref={navbarRef} 
        $hiddenInChat={isInChatRoom}
        $isSafari={isSafari}
      >
        <NavLinks>
          {renderNavLinks()}
          <div 
            role="button"
            className="user-btn"
            data-active={location.pathname === '/profile'}
            onClick={() => navigate(user ? '/profile' : '/login')}
            tabIndex="0"
          >
            <FaUserCircle />
            <span>{user ? 'Profile' : 'Login'}</span>
          </div>
        </NavLinks>
      </NavbarWrapper>
      
      <Toast $show={showToast} $safeAreaBottom={safeAreaBottom}>
        Coming Soon! ✨
      </Toast>
    </>
  );
};

export default React.memo(BottomNavbar);