import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (window.confirm("Ready to head back to basecamp?")) {
      await signOut(auth);
      navigate('/login');
    }
  };

  return (
    <SidebarContainer>
      <SidebarIcon 
        $active={location.pathname === '/dashboard'} 
        onClick={() => navigate('/')}
        title="Dashboard"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </SidebarIcon>

      <SidebarIcon 
        $active={location.pathname.includes('/community')} 
        onClick={() => navigate('/community')}
        title="Communities"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
      </SidebarIcon>
      <SidebarIcon 
  $active={location.pathname === '/treks'} 
  onClick={() => navigate('/search-results')}
  title="Explore Treks"
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
</SidebarIcon>

      <div style={{ flex: 1 }}></div>

      <SidebarIcon onClick={handleLogout} title="Logout" style={{ color: '#ff6b6b' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </SidebarIcon>
      <SidebarIcon 
        $active={location.pathname === '/profile'} 
        onClick={() => navigate('/profile')}
        title="My Profile"
        style={{ padding: 0, overflow: 'hidden' }}
        >
        {auth.currentUser?.photoURL ? (
            <img 
            src={auth.currentUser.photoURL} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
            />
        ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        )}
      </SidebarIcon>
    </SidebarContainer>
  );
};

// --- STYLES (Move your existing Sidebar styles here) ---
const SidebarContainer = styled.aside`
  width: 80px;
  background: rgba(6, 10, 20, 0.85);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 24px;
  z-index: 2000;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 70%; /* Covers most of the screen like Discord */
    max-width: 300px;
    background: #0A0F1E; /* Solid color to prevent text overlapping */
    
    /* THE TRICK: Move it off-screen by default (-100%) */
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? '20px 0 60px rgba(0,0,0,1)' : 'none'};
  }
`;

const SidebarIcon = styled.div`
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: ${props => props.$active ? '#38BDF8' : 'rgba(255, 255, 255, 0.4)'};
  background: ${props => props.$active ? 'rgba(56, 189, 248, 0.1)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  ${props => props.$active && css`
    border: 1px solid rgba(56, 189, 248, 0.3);
  `}

  position: relative;

  ${props => props.$active && css`
    &::before {
      content: '';
      position: absolute;
      left: -18px; /* On desktop, shows on the far left edge */
      width: 4px;
      height: 20px;
      background: #38BDF8;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px #38BDF8;
    }
  `}

  @media (max-width: 768px) {
    &::before {
      left: 50%;
      top: -8px; /* On mobile, shows at the top of the icon */
      width: 20px;
      height: 3px;
      transform: translateX(-50%);
      border-radius: 0 0 4px 4px;
    }
  }
    
`;

export default Sidebar;