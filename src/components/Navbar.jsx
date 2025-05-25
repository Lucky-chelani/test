import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const textFade = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: ${({ $scrolled, $transparent }) => 
    $transparent 
      ? $scrolled 
        ? 'rgba(12, 20, 39, 0.85)' 
        : 'transparent'
      : 'rgba(12, 20, 39, 0.98)'};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(15px)' : 'none')};
  box-shadow: ${({ $scrolled }) => ($scrolled ? '0 8px 32px rgba(0, 0, 0, 0.12)' : 'none')};
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  padding: 0 max(24px, 5%);
  height: ${({ $scrolled }) => ($scrolled ? '75px' : '90px')};
  animation: ${fadeIn} 0.6s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ $scrolled }) => 
      $scrolled 
        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)' 
        : 'transparent'};
    opacity: 0.7;
  }

  @media (max-width: 1024px) {
    padding: 0 20px;
    height: ${({ $scrolled }) => ($scrolled ? '70px' : '80px')};
  }
  
  @media (max-width: 768px) {
    padding: 0 16px;
    height: 70px;
    justify-content: space-between;
  }
  
  @media (max-width: 480px) {
    height: 65px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 2rem;
  color: #fff;
  margin-right: 48px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 5;
  cursor: pointer;

  &:hover { 
    transform: scale(1.05); 
  }

  .logo-text {
    font-weight: 900;
    letter-spacing: -0.02em;
    background: linear-gradient(90deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.5rem;
    margin-left: 8px;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.15);
  }

  img {
    height: 42px;
    margin-right: 0;
    filter: drop-shadow(0 2px 10px rgba(255, 255, 255, 0.3));
    transition: filter 0.3s ease, transform 0.3s ease;
  }
  
  &:hover img {
    filter: drop-shadow(0 4px 15px rgba(255, 255, 255, 0.5));
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    margin-right: 0;
    img { height: 36px; }
    .logo-text { font-size: 1.3rem; }
  }
`;

const shimmer = keyframes`
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
`;

const textPulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(255, 255, 255, 0); }
  50% { text-shadow: 0 0 12px rgba(255, 255, 255, 0.3); }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 36px;
  flex: 1;
  margin-left: 10px;

  a {
    position: relative;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.05rem;
    padding: 8px 12px;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    letter-spacing: 0.3px;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 3px;
      bottom: -4px;
      left: 50%;
      background: linear-gradient(90deg, #FFD2BF, #ffbfa3);
      transform: translateX(-50%);
      transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
      border-radius: 3px;
      opacity: 0;
    }

    &.active-link {
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
      animation: ${textPulse} 3s infinite ease-in-out;
      
      &::after { 
        width: 60%;
        opacity: 1;
        background: linear-gradient(90deg, #FFD2BF, #ffbfa3);
        background-size: 200% 100%;
        animation: ${shimmer} 2s infinite linear;
      }
    }

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      &::after { width: 40%; opacity: 0.7; }
    }
  }

  @media (max-width: 1100px) {
    gap: 20px;
    a { font-size: 1rem; padding: 6px 10px; }
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(12, 20, 39, 0.97);
    padding: 30px 20px;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    backdrop-filter: blur(15px);
    z-index: 99;
    
    /* Animation and visibility */
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-20px)')};
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    a {
      padding: 16px;
      width: 100%;
      text-align: center;
      border-radius: 14px;
      font-size: 1.1rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.04);

      &.active-link { 
        background: rgba(255, 210, 191, 0.1);
        border-color: rgba(255, 210, 191, 0.1);
        
        &::after { 
          width: 30px;
          bottom: initial;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      
      &:hover { 
        background: rgba(255, 255, 255, 0.08);
        transform: scale(1.02); 
      }
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(12, 20, 39, 0.98);
    padding: 20px;
    gap: 14px;
    backdrop-filter: blur(15px);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    z-index: 99;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    
    /* Animation and visibility */
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(20px)')};
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
`;

const OutlinedBtn = styled(Link)`
  padding: 10px 26px;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  display: flex;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  letter-spacing: 0.5px;
  align-items: center;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 255, 255, 0.1);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 16px;
    font-size: 1.05rem;
    border-radius: 16px;
  }
`;

const buttonFlare = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const FilledBtn = styled(Link)`
  padding: 12px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #FFD2BF, #ffbfa3);
  background-size: 200% 200%;
  animation: ${buttonFlare} 6s ease infinite;
  color: #181828;
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(255, 210, 191, 0.3);
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #ffbfa3, #ffa889);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 210, 191, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(255, 210, 191, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 16px;
    font-size: 1.05rem;
    border-radius: 16px;
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 210, 191, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 210, 191, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 210, 191, 0); }
`;

const AccountIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AccountCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD2BF, #ffbfa3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 10px rgba(255, 210, 191, 0.3);
  position: relative;
  animation: ${pulse} 2s infinite;

  &:hover {
    box-shadow: 0 5px 18px rgba(255, 210, 191, 0.4);
    transform: translateY(-3px) scale(1.05);
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  svg {
    color: #3c3c3c;
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 90;
  backdrop-filter: blur(4px);
  
  /* Show/hide based on menu state */
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: all 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const toastAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  10% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(12, 20, 39, 0.95);
  color: #fff;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 110;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  animation: ${toastAnimation} 3.5s ease-in-out forwards;
  
  span {
    font-weight: 700;
    color: #FFD2BF;
    animation: ${textFade} 2s infinite ease-in-out;
  }
  
  .toast-emoji {
    display: inline-block;
    margin-left: 4px;
    font-size: 1.1rem;
    animation: ${textFade} 1.5s infinite ease-in-out;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 101;

  &:hover { 
    background: rgba(255, 255, 255, 0.1); 
  }
  
  &:active { 
    transform: scale(0.95); 
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HamburgerIcon = styled.div`
  width: 26px;
  height: 20px;
  position: relative;

  span {
    position: absolute;
    height: 3px;
    width: 100%;
    background: #fff;
    border-radius: 3px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

    &:nth-child(1) {
      top: ${({ $isOpen }) => ($isOpen ? '9px' : '0')};
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'none')};
      width: ${({ $isOpen }) => ($isOpen ? '100%' : '80%')};
    }
    &:nth-child(2) {
      top: 9px;
      opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
      transform: ${({ $isOpen }) => ($isOpen ? 'translateX(10px)' : 'none')};
    }
    &:nth-child(3) {
      top: ${({ $isOpen }) => ($isOpen ? '9px' : '18px')};
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-45deg)' : 'none')};
      width: ${({ $isOpen }) => ($isOpen ? '100%' : '60%')};
    }
  }
`;

const UserStatus = styled.div`
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4aed88;
  border: 2px solid #fff;
`;

const UserName = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-left: 8px;
  letter-spacing: 0.3px;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 8px;
    font-size: 1rem;
  }
`;

const Navbar = ({ active, transparent = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
        document.body.style.overflow = 'visible';
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => { 
    if (isOpen) {
      setIsOpen(false);
      document.body.style.overflow = 'visible';
    }
  }, [location]);
  
  // Clear toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Prevent body scroll when menu is open
    if (newIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  };

  const handleUpcomingFeature = e => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3500);
  };

  const handleAccountClick = () => {
    navigate('/profile');
    setIsOpen(false);
    document.body.style.overflow = 'visible';
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsOpen(false);
      document.body.style.overflow = 'visible';
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  
  // Get first name for display
  const getFirstName = () => {
    if (user && user.displayName) {
      return user.displayName.split(' ')[0];
    }
    return '';
  };

  return (
    <>
      <NavbarWrapper $scrolled={scrolled} $transparent={transparent}>
        <Logo onClick={() => navigate('/')}>
          <img src={require('../assets/images/logo.png')} alt="Trek Explorer" />
        </Logo>
        
        <NavLinks $isOpen={isOpen}>
          <Link to="/" className={location.pathname==='/' || active==='home' ? 'active-link':''}>
            Discover
          </Link>
          <Link to="/explore" className={location.pathname==='/explore'|| active==='explore' ? 'active-link':''}>
            Adventures
          </Link>
          <Link to="/community"
            className={location.pathname==='/community'|| active==='community'? 'active-link':''}
{/*             onClick={handleUpcomingFeature} */}
          >
            Community
          </Link>
          <Link to="/blog"
            className={location.pathname==='/blog'|| active==='blog'? 'active-link':''}
          >
            Journal
          </Link>
          <Link to="/rewards"
            className={location.pathname==='/rewards'|| active==='rewards'? 'active-link':''}
            onClick={handleUpcomingFeature}
          >
            Rewards
          </Link>
          <Link to="/about"
            className={location.pathname==='/about'|| active==='about'? 'active-link':''}
          >
            Our Story
          </Link>
        </NavLinks>
        
        <NavActions $isOpen={isOpen}>
          {!user ? (
            <>
              <OutlinedBtn to="/login">Access</OutlinedBtn>
              <FilledBtn to="/signup">Join Now</FilledBtn>
            </>
          ) : (
            <AccountIconWrapper>
              <AccountCircle onClick={handleAccountClick} title="Profile">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4.2" stroke="#3c3c3c" strokeWidth="2"/>
                    <path d="M4.5 19c0-3.2 3.1-5.5 7.5-5.5s7.5 2.3 7.5 5.5" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
                <UserStatus />
              </AccountCircle>
              {user.displayName && <UserName>Hi, {getFirstName()}</UserName>}
              {isOpen && (
                <OutlinedBtn as="button" onClick={handleSignOut} style={{ marginTop: 12 }}>
                  Log Out
                </OutlinedBtn>
              )}
            </AccountIconWrapper>
          )}
        </NavActions>

        <MenuButton 
          onClick={toggleMenu} 
          aria-label="Toggle menu" 
          aria-expanded={isOpen}
        >
          <HamburgerIcon $isOpen={isOpen}>
            <span /><span /><span />
          </HamburgerIcon>
        </MenuButton>
      </NavbarWrapper>

      <Overlay $isOpen={isOpen} onClick={toggleMenu} />
      
      <Toast $show={showToast}>
        <span>Coming Soon!</span> We're crafting something extraordinary for you <span className="toast-emoji">✨</span>
      </Toast>
    </>
  );
};

export default Navbar;
