import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FaMountain, FaCheckCircle, FaGlobe, FaPhone, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import { FiCalendar, FiClock, FiFlag, FiMap, FiStar, FiMapPin } from 'react-icons/fi';

import mapPattern from '../assets/images/map-pattren.png';

// ─── Tokens (Premium Eye-Catching Theme) ──────────────────────────────────────
const tokens = {
  colors: {
    bg: "#050505",
    bgCard: "rgba(18, 18, 18, 0.6)", // Transparent for glass effect
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(249, 115, 22, 0.3)",
    primary: "#f97316",
    primaryDark: "#ea580c",
    primaryGlow: "rgba(249, 115, 22, 0.25)",
    secondaryGlow: "rgba(139, 92, 246, 0.15)", // Purple accent glow
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#64748b",
    glass: "rgba(255,255,255,0.03)",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "100px" },
  transition: { base: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" },
  shadows: { 
    card: "0 8px 32px rgba(0,0,0,0.4)",
    glow: "0 0 20px rgba(249, 115, 22, 0.2)"
  },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const orbFloat1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
`;

const orbFloat2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 40px) scale(1.2); }
  66% { transform: translate(20px, -20px) scale(0.8); }
`;

// ─── Framer Variants ──────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Page = styled.div`
  background-color: ${tokens.colors.bg};
  background-image: linear-gradient(to bottom, rgba(5,5,5,0.8), rgba(5,5,5,1)), url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: 100px;
  color: ${tokens.colors.textPrimary};
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
`;

// Ambient Background Glows
const AmbientOrb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
`;

const OrbPrimary = styled(AmbientOrb)`
  top: -10%; left: -5%;
  width: 40vw; height: 40vw;
  background: ${tokens.colors.primaryGlow};
  animation: ${orbFloat1} 15s ease-in-out infinite;
`;

const OrbSecondary = styled(AmbientOrb)`
  bottom: -10%; right: -5%;
  width: 50vw; height: 50vw;
  background: ${tokens.colors.secondaryGlow};
  animation: ${orbFloat2} 18s ease-in-out infinite;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10; /* Keeps content above ambient orbs */
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const ProfileHeader = styled(motion.div)`
  display: flex;
  background: ${tokens.colors.bgCard};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: ${tokens.radius.xl};
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: ${tokens.shadows.card}, inset 0 0 0 1px rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
  
  /* Top glow accent */
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${tokens.colors.primary}, ${tokens.colors.primaryLight}, transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2.5rem 1.5rem;
  }
`;

const OrganizerLogo = styled.div`
  width: 150px;
  height: 150px;
  background: rgba(10,10,10,0.8);
  border: 1px solid ${tokens.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 3rem;
  flex-shrink: 0;
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.2);
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, transparent, ${tokens.colors.primary}, transparent);
    z-index: -1;
    animation: ${spin} 6s linear infinite;
  }
  
  svg {
    font-size: 4rem;
    color: ${tokens.colors.primary};
    filter: drop-shadow(0 0 8px rgba(249,115,22,0.5));
  }
  
  @media (max-width: 768px) {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    svg { font-size: 3rem; }
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrganizerName = styled.h1`
  margin: 0 0 0.5rem 0;
  font-family: 'Sora', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  svg {
    color: ${tokens.colors.success};
    font-size: 1.5rem;
    -webkit-text-fill-color: initial; /* Prevents gradient on icon */
    filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.4));
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 2.2rem;
  }
`;

const OrganizerMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${tokens.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  padding: 0.5rem 1rem;
  border-radius: ${tokens.radius.pill};
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(4px);
  
  svg { color: ${tokens.colors.primary}; font-size: 1rem; }
`;

const OrganizerDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${tokens.colors.textSecondary};
  margin: 0 0 2rem 0;
  max-width: 800px;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${tokens.colors.textSecondary};
  font-size: 0.95rem;
  font-weight: 500;
  
  svg { 
    color: ${tokens.colors.primary}; 
    padding: 6px;
    background: rgba(249,115,22,0.1);
    border-radius: 50%;
    font-size: 1.6rem;
  }
  
  a {
    color: inherit;
    text-decoration: none;
    transition: ${tokens.transition.base};
    &:hover { color: ${tokens.colors.primary}; }
  }
`;

const SectionTitle = styled(motion.h2)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 2rem 0;
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  
  svg { color: ${tokens.colors.primary}; }
`;

const TreksGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
`;

const TrekCard = styled(motion.div)`
  background: rgba(15,15,15,0.7);
  backdrop-filter: blur(12px);
  border-radius: ${tokens.radius.lg};
  overflow: hidden;
  border: 1px solid ${tokens.colors.border};
  transition: ${tokens.transition.base};
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${tokens.colors.borderHover};
    box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(249, 115, 22, 0.15);
  }
`;

const TrekImageWrapper = styled.div`
  height: 240px;
  overflow: hidden;
  position: relative;
`;

const TrekImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${tokens.colors.bgElevated};
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Zoom effect on card hover */
  ${TrekCard}:hover & {
    transform: scale(1.08);
  }
  
  /* Gradient overlay for text readability */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15,15,15,1) 0%, transparent 60%);
  }
`;

const FallbackImage = styled(FaMountain)`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: ${tokens.colors.borderHover};
  opacity: 0.3;
  z-index: 1;
`;

const TrekCategory = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1.25rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: ${tokens.colors.primary};
  border: 1px solid rgba(249, 115, 22, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: ${tokens.radius.pill};
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
`;

const TrekContent = styled.div`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 2;
  margin-top: -30px; /* Pulls content up into the image gradient */
`;

const TrekTitle = styled(Link)`
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin-bottom: 1rem;
  text-decoration: none;
  transition: ${tokens.transition.base};
  line-height: 1.3;
  
  &:hover { color: ${tokens.colors.primary}; }
`;

const TrekMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: ${tokens.colors.textSecondary};
    font-weight: 500;
    
    svg { color: ${tokens.colors.primary}; }
  }
`;

const TrekDescription = styled.p`
  font-size: 0.95rem;
  margin: 0 0 1.75rem 0;
  color: ${tokens.colors.textMuted};
  line-height: 1.6;
  flex-grow: 1;
`;

const ViewTrekButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.9rem;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  color: ${tokens.colors.primary};
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${tokens.radius.sm};
  text-decoration: none;
  transition: ${tokens.transition.base};
  
  &:hover {
    background: ${tokens.colors.primary};
    color: #fff;
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
  }
`;

const StatusContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
  background: ${tokens.colors.bgCard};
  backdrop-filter: blur(12px);
  border-radius: ${tokens.radius.xl};
  border: 1px solid ${tokens.colors.border};
  box-shadow: ${tokens.shadows.card};
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border: 3px solid rgba(249, 115, 22, 0.2);
  border-top-color: ${tokens.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1.5rem;
`;

const StatusText = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${tokens.colors.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const StatusSubtext = styled.p`
  color: ${tokens.colors.textMuted};
  font-size: 1.05rem;
  margin: 0;
  max-width: 400px;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const truncateText = (text, maxLength) => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const safelyExtractString = (val, fallback = '') => {
  return typeof val === 'string' && val.trim().length > 0 ? val : fallback;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OrganizerProfile = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrganizerAndTreks = async () => {
      if (!id) {
        setError('No organizer ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // 1. Fetch Organizer Data
        let orgData = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', id));
          if (userDoc.exists()) {
            orgData = { ...userDoc.data(), _source: 'users' };
          } else {
            const orgDoc = await getDoc(doc(db, 'organizations', id));
            if (orgDoc.exists()) {
              orgData = { ...orgDoc.data(), _source: 'organizations' };
            }
          }
        } catch (dbErr) {
          console.error("Database fetch error for Organizer: ", dbErr);
          throw new Error('Failed to connect to the database to fetch profile.');
        }
        
        if (!orgData) {
          setError('Organizer profile could not be found.');
          setLoading(false);
          return;
        }

        setOrganizer({
          ...orgData,
          organizationDetails: orgData.organizationDetails || {}
        });
        
        // 2. Fetch Treks
        try {
          const treksQuery = query(
            collection(db, 'treks'),
            where('organizerId', '==', id),
            orderBy('updatedAt', 'desc')
          );
          
          const treksSnapshot = await getDocs(treksQuery);
          const treksList = treksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setTreks(treksList);
        } catch (trekErr) {
          console.error('Error fetching treks:', trekErr);
          if (trekErr.message && trekErr.message.includes('index')) {
            const fallbackQuery = query(collection(db, 'treks'), where('organizerId', '==', id));
            const fallbackSnapshot = await getDocs(fallbackQuery);
            const fallbackList = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fallbackList.sort((a, b) => {
              const dateA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
              const dateB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
              return dateB - dateA; 
            });
            setTreks(fallbackList);
          } else {
            setTreks([]);
          }
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred while loading the profile.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizerAndTreks();
  }, [id]);
  
  // ── Render Loading ──
  if (loading) {
    return (
      <Page>
        <OrbPrimary />
        <OrbSecondary />
        <Container>
          <StatusContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Spinner />
            <StatusText>Discovering Profile</StatusText>
            <StatusSubtext>Loading organizer details and adventures...</StatusSubtext>
          </StatusContainer>
        </Container>
      </Page>
    );
  }
  
  // ── Render Error ──
  if (error) {
    return (
      <Page>
        <OrbPrimary />
        <OrbSecondary />
        <Container>
          <StatusContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <FaExclamationTriangle size={56} color="#ef4444" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.3))' }} />
            <StatusText>Profile Unavailable</StatusText>
            <StatusSubtext>{error}</StatusSubtext>
          </StatusContainer>
        </Container>
      </Page>
    );
  }
  
  // ── Safe Data Extraction ──
  const safeOrg = organizer || {};
  const safeDetails = safeOrg.organizationDetails || {};
  
  const orgName = safelyExtractString(safeDetails.name) || safelyExtractString(safeOrg.name) || 'Independent Trekker';
  const orgDescription = safelyExtractString(safeDetails.description) || safelyExtractString(safeOrg.bio) || 'An experienced trek organizer passionate about the great outdoors.';
  const orgVerified = Boolean(safeDetails.verified || safeOrg.isVerified);
  const orgExperience = safelyExtractString(safeDetails.experience);
  const orgWebsite = safelyExtractString(safeDetails.website);
  const orgEmail = safelyExtractString(safeOrg.email);
  const orgPhone = safelyExtractString(safeOrg.phone) || safelyExtractString(safeDetails.phone);
  const orgLocation = safelyExtractString(safeOrg.location) || safelyExtractString(safeDetails.location);
  
  const activeTrails = treks.filter(t => t && t.status === 'active').length;
  
  return (
    <Page>
      <OrbPrimary />
      <OrbSecondary />
      
      <Container>
        {/* Profile Header */}
        <ProfileHeader
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <OrganizerLogo>
            <FaMountain />
          </OrganizerLogo>
          
          <ProfileInfo>
            <OrganizerName>
              {orgName}
              {orgVerified && <FaCheckCircle title="Verified Organizer" />}
            </OrganizerName>
            
            <OrganizerMeta>
              <MetaItem><FaMountain /> {treks.length} Treks Listed</MetaItem>
              {orgExperience && <MetaItem><FiClock /> {orgExperience} Exp.</MetaItem>}
              {activeTrails > 0 && <MetaItem><FiFlag /> {activeTrails} Active Trails</MetaItem>}
              {orgLocation && <MetaItem><FiMapPin /> {orgLocation}</MetaItem>}
            </OrganizerMeta>
            
            <OrganizerDescription>
              {orgDescription}
            </OrganizerDescription>
            
            {(orgWebsite || orgEmail || orgPhone) && (
              <ContactInfo>
                {orgWebsite && (
                  <ContactItem>
                    <FaGlobe />
                    <a href={orgWebsite.startsWith('http') ? orgWebsite : `https://${orgWebsite}`} target="_blank" rel="noopener noreferrer">
                      {orgWebsite.replace(/^https?:\/\//, '')}
                    </a>
                  </ContactItem>
                )}
                {orgEmail && (
                  <ContactItem>
                    <FaEnvelope />
                    <a href={`mailto:${orgEmail}`}>{orgEmail}</a>
                  </ContactItem>
                )}
                {orgPhone && (
                  <ContactItem>
                    <FaPhone />
                    <a href={`tel:${orgPhone}`}>{orgPhone}</a>
                  </ContactItem>
                )}
              </ContactInfo>
            )}
          </ProfileInfo>
        </ProfileHeader>
        
        <SectionTitle
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FiMap /> Treks by {orgName}
        </SectionTitle>
        
        {/* Treks Grid */}
        {treks.length > 0 ? (
          <TreksGrid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {treks.map((trek) => (
              <TrekCard key={trek.id} variants={itemVariants}>
                <TrekImageWrapper>
                  {!trek.image && <FallbackImage />}
                  <TrekImage $image={trek.image} />
                  <TrekCategory>{safelyExtractString(trek.categoryName, 'Adventure')}</TrekCategory>
                </TrekImageWrapper>
                <TrekContent>
                  <TrekTitle to={`/trek/${trek.id}`}>
                    {safelyExtractString(trek.title, 'Untitled Trek')}
                  </TrekTitle>
                  
                  <TrekMeta>
                    {trek.location && (
                      <div><FiMapPin />{truncateText(trek.location, 20)}</div>
                    )}
                    {trek.days && (
                      <div><FiCalendar />{trek.days} {trek.days == 1 ? 'day' : 'days'}</div>
                    )}
                    {trek.difficulty && (
                      <div><FiFlag />{trek.difficulty.charAt(0).toUpperCase() + trek.difficulty.slice(1)}</div>
                    )}
                    {trek.rating && (
                      <div><FiStar />{trek.rating}</div>
                    )}
                  </TrekMeta>
                  
                  <TrekDescription>
                    {truncateText(trek.description, 110) || 'No description provided for this trek.'}
                  </TrekDescription>
                  
                  <ViewTrekButton to={`/trek/${trek.id}`}>
                    View Trek Details
                  </ViewTrekButton>
                </TrekContent>
              </TrekCard>
            ))}
          </TreksGrid>
        ) : (
          <StatusContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FaMountain size={56} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
            <StatusText>No Treks Available</StatusText>
            <StatusSubtext>This organizer hasn't published any public treks yet.</StatusSubtext>
          </StatusContainer>
        )}
      </Container>
    </Page>
  );
};

export default OrganizerProfile;