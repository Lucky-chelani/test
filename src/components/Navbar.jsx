import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: ${({ $scrolled }) => ($scrolled ? 'rgba(15, 23, 42, 0.9)' : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(12px)' : 'none')};
  box-shadow: ${({ $scrolled }) => ($scrolled ? '0 8px 32px rgba(0, 0, 0, 0.12)' : 'none')};
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  padding: 0 max(24px, 5%);
  height: 80px;

  @media (max-width: 1024px) {
    padding: 0 20px;
    height: 75px;
  }
  @media (max-width: 768px) {
    padding: 0 16px;
    height: 70px;
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
  transition: transform 0.3s ease;

  &:hover { transform: scale(1.05); }

  img {
    height: 42px;
    margin-right: 14px;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }

  @media (max-width: 768px) {
    margin-right: 0;
    img { height: 36px; }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  flex: 1;

  a {
    position: relative;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 3px;
      bottom: -2px;
      left: 50%;
      background: linear-gradient(90deg, #5A70B7, #8A92D8);
      transform: translateX(-50%);
      transition: width 0.3s ease, opacity 0.3s ease;
      border-radius: 3px;
      opacity: 0;
    }

    &.active-link {
      color: #fff;
      &::after { width: 70%; opacity: 1; }
    }

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      &::after { width: 50%; opacity: 1; }
    }
  }

  @media (max-width: 1024px) {
    gap: 16px;
    a { font-size: 1rem; padding: 6px 10px; }
  }

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(15, 23, 42, 0.97);
    padding: 24px 20px;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-10px)')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transition: transform 0.4s ease, opacity 0.4s ease;
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(12px);

    a {
      padding: 14px;
      width: 100%;
      text-align: center;
      border-radius: 12px;

      &.active-link::after { width: 40px; }
      &:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.02); }
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(15, 23, 42, 0.97);
    padding: 20px;
    gap: 12px;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(10px)')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    transition: transform 0.4s ease, opacity 0.4s ease;
    backdrop-filter: blur(12px);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  }
`;

const OutlinedBtn = styled(Link)`
  padding: 10px 24px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(90, 112, 183, 0.3);
  }
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 14px;
  }
`;

const FilledBtn = styled(Link)`
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #5A70B7, #8A92D8);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(90, 112, 183, 0.4);

  &:hover {
    background: linear-gradient(135deg, #6A80C7, #9AA2E8);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(90, 112, 183, 0.5);
  }
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 14px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  padding: 10px;
  margin-left: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover { background: rgba(255, 255, 255, 0.1); }
  &:active { transform: scale(0.95); }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HamburgerIcon = styled.div`
  width: 24px;
  height: 20px;
  position: relative;

  span {
    position: absolute;
    height: 3px;
    width: 100%;
    background: #fff;
    border-radius: 3px;
    transition: all 0.25s ease-in-out;

    &:nth-child(1) {
      top: ${({ $isOpen }) => ($isOpen ? '9px' : '0')};
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'none')};
      width: ${({ $isOpen }) => ($isOpen ? '100%' : '80%')};
    }
    &:nth-child(2) {
      top: 9px;
      opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
    }
    &:nth-child(3) {
      top: ${({ $isOpen }) => ($isOpen ? '9px' : '18px')};
      transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-45deg)' : 'none')};
      width: ${({ $isOpen }) => ($isOpen ? '100%' : '60%')};
    }
  }
`;

const Overlay = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 90;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: opacity 0.4s ease;
  backdrop-filter: blur(3px);
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #333;
  padding: 16px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  font-weight: 600;
  font-size: 1.1rem;
  z-index: 1000;
  opacity: ${({ $show }) => ($show ? '1' : '0')};
  transform: ${({ $show }) =>
    $show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-20px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before { content: '🚀'; font-size: 1.4rem; }
  @media (max-width: 480px) {
    width: 90%;
    padding: 14px 20px;
    font-size: 1rem;
  }
`;

const Navbar = ({ active }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => { setIsOpen(false); }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'visible';
  };

  const handleUpcomingFeature = e => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <>
      <NavbarWrapper $scrolled={scrolled}>
        <Logo>
          <img src={require('../assets/images/logo.png')} alt="Logo" />
        </Logo>
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          <HamburgerIcon $isOpen={isOpen}>
            <span /><span /><span />
          </HamburgerIcon>
        </MenuButton>
        <NavLinks $isOpen={isOpen}>
          <Link to="/"       className={location.pathname==='/'      || active==='home'     ? 'active-link':''}>Home</Link>
          <Link to="/explore" className={location.pathname==='/explore'|| active==='explore'  ? 'active-link':''}>Explore</Link>
          <Link to="/community"
            className={location.pathname==='/community'|| active==='community'? 'active-link':''}
            onClick={handleUpcomingFeature}
          >Community</Link>
          <Link to="/blog"
            className={location.pathname==='/blog'|| active==='blog'? 'active-link':''}
          >Blog</Link>
          <Link to="/rewards"
            className={location.pathname==='/rewards'|| active==='rewards'? 'active-link':''}
          >Rewards</Link>
          <Link to="/about"
            className={location.pathname==='/about'|| active==='about'? 'active-link':''}
          >About</Link>
          <Link to="/profile"
            className={location.pathname==='/profile'|| active==='profile'? 'active-link':''}
          >Profile</Link>
        </NavLinks>
        <NavActions $isOpen={isOpen}>
          <OutlinedBtn to="/login">Sign In</OutlinedBtn>
          <FilledBtn   to="/signup">Get Started</FilledBtn>
        </NavActions>
      </NavbarWrapper>

      <Overlay $isOpen={isOpen} onClick={toggleMenu} />
      <Toast $show={showToast}>
        Exciting new features coming soon! Stay tuned for updates 🎉
      </Toast>
    </>
  );
};

export default Navbar;