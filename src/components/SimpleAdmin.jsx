import React from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { 
  FiUsers, FiMap, FiUserCheck, FiTag, FiShield, 
  FiLogOut, FiActivity, FiChevronRight, FiBriefcase 
} from 'react-icons/fi';

/* ==========================================================================
   GLOBAL STYLES - PREMIUM SLATE THEME
   ========================================================================== */
const GlobalStyle = createGlobalStyle`
  body { 
    background-color: #f8fafc; /* Very light slate */
    color: #0f172a; /* Deep slate text */
    font-family: 'Inter', -apple-system, sans-serif; 
    -webkit-font-smoothing: antialiased; 
    margin: 0;
  }
`;

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */
const AdminLayout = styled.div`
  max-width: 1200px; margin: 0 auto; padding: 80px 24px; min-height: 100vh;
  /* Subtle mesh gradient background for premium feel */
  background-image: radial-gradient(at 0% 0%, rgba(224, 231, 255, 0.3) 0, transparent 50%), 
                    radial-gradient(at 50% 0%, rgba(245, 243, 255, 0.3) 0, transparent 50%);
`;

const HeaderSection = styled.header`
  margin-bottom: 64px; display: flex; justify-content: space-between; align-items: flex-end;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 32px;
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 24px; }
`;

const TitleGroup = styled.div`
  h1 { font-size: 2.75rem; font-weight: 800; margin: 8px 0; color: #0f172a; letter-spacing: -0.04em; }
  p { color: #64748b; font-size: 1.1rem; font-weight: 400; margin: 0; }
`;

const StatusBadge = styled.div`
  display: inline-flex; align-items: center; gap: 8px; background: #ffffff; color: #10b981;
  padding: 8px 16px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; 
  text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
`;

const LogoutBtn = styled.button`
  background: #ffffff; color: #64748b; border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 12px 24px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; 
  gap: 8px; cursor: pointer; transition: all 0.2s ease;
  &:hover { color: #ef4444; border-color: #fecaca; background: #fef2f2; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08); }
`;

const DashboardGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;
`;

const IconBox = styled.div`
  width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
  background: ${props => props.$bgColor}; color: ${props => props.$themeColor}; 
  font-size: 1.4rem; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0,0,0,0.03);
`;

const MenuCard = styled(Link)`
  position: relative; padding: 32px; background: #ffffff; 
  border: 1px solid rgba(15, 23, 42, 0.06); border-radius: 24px; 
  text-decoration: none; overflow: hidden; transition: all 0.3s ease;
  display: flex; flex-direction: column; align-items: flex-start;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-6px);
    border-color: ${props => props.$themeColor}40;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    ${IconBox} {
      background: ${props => props.$themeColor}; color: white;
      transform: scale(1.1) rotate(-8deg);
      box-shadow: 0 8px 20px ${props => props.$themeColor}40;
    }
    
    .arrow { transform: translateX(4px); color: ${props => props.$themeColor}; }
    h2 { color: ${props => props.$themeColor}; }
  }

  h2 { color: #1e293b; font-size: 1.4rem; font-weight: 700; margin: 24px 0 12px 0; transition: color 0.2s; }
  p { color: #64748b; line-height: 1.6; font-size: 0.95rem; margin-bottom: 24px; flex-grow: 1; }
`;

const CardLinkText = styled.div`
  display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.85rem;
  text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; transition: all 0.2s;
`;

/* ==========================================================================
   MENU DATA
   ========================================================================== */
const MENU_ITEMS = [
  {
    path: '/admin/communities',
    title: 'Communities',
    desc: 'Moderate community deployments, toggle featured status, and oversee social hubs.',
    icon: <FiUsers />,
    color: '#10b981', // Emerald
    bg: '#ecfdf5'
  },
  {
    path: '/admin/treks',
    title: 'Trek Assets',
    desc: 'Curate experience protocols, update itinerary mapping, and manage gallery assets.',
    icon: <FiMap />,
    color: '#f59e0b', // Amber
    bg: '#fffbeb'
  },
  {
    path: '/admin/certificates',
    title: 'Internships',
    desc: 'Manage role deployments, track applicant status, and update career listings.',
    icon: <FiBriefcase />,
    color: '#ec4899', // Pink
    bg: '#fdf2f8'
  },
  {
    path: '/admin/users',
    title: 'User Management',
    desc: 'Assign administrative roles, control system permissions, and verify accounts.',
    icon: <FiUserCheck />,
    color: '#3b82f6', // Blue
    bg: '#eff6ff'
  },
  {
    path: '/admin/coupons',
    title: 'Pricing Logic',
    desc: 'Deploy discount strategies, track usage metrics, and manage promotional codes.',
    icon: <FiTag />,
    color: '#8b5cf6', // Violet
    bg: '#f5f3ff'
  }
];

/* ==========================================================================
   COMPONENT
   ========================================================================== */
const SimpleAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) { console.error("Logout failed", error); }
  };

  return (
    <AdminLayout>
      <GlobalStyle />
      
      <HeaderSection>
        <TitleGroup>
          <StatusBadge><FiActivity /> System Operational</StatusBadge>
          <h1>Command Center</h1>
          <p>Global oversight and institutional management terminal.</p>
        </TitleGroup>
        
        <LogoutBtn onClick={handleLogout}>
          <FiLogOut /> Disconnect
        </LogoutBtn>
      </HeaderSection>

      <DashboardGrid>
        {MENU_ITEMS.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <MenuCard to={item.path} $themeColor={item.color}>
              <IconBox $themeColor={item.color} $bgColor={item.bg}>
                {item.icon}
              </IconBox>
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <CardLinkText>
                Access Terminal <FiChevronRight className="arrow" size={16} />
              </CardLinkText>
            </MenuCard>
          </motion.div>
        ))}
      </DashboardGrid>

      <footer style={{ marginTop: '100px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '40px' }}>
        <FiShield size={20} style={{ color: '#94a3b8', marginBottom: '12px' }} />
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Secure Administrative Layer v4.1.0
        </p>
      </footer>
    </AdminLayout>
  );
};

export default SimpleAdmin;