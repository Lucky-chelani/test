import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FaMountain, FaCheckCircle, FaMapMarkerAlt, FaGlobe, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FiCalendar, FiClock, FiFlag, FiMap, FiStar, FiMapPin as FiMapMarkerAlt } from 'react-icons/fi';
import mapPattern from '../assets/images/map-pattren.png';

// Styled components for the organizer profile page
const Page = styled.div`
  background: linear-gradient(135deg, rgba(10, 20, 40, 0.92), rgba(0, 0, 0, 0.95)), url(${mapPattern});
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 100px;
  color: #fff;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: rgba(30, 40, 60, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column; /* Stacked */
    text-align: center;
    gap: 20px;
    padding: 20px;
  }
`;

const OrganizerLogo = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
  
  svg {
    font-size: 50px;
    color: white;
  }
  
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const OrganizerName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 2.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #4CC9F0;
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 1.8rem;
  }
`;

const OrganizerMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  
  svg {
    color: #FF6B6B;
  }
`;

const OrganizerDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 800px;
`;

const ContactInfo = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  
  svg {
    color: #4CC9F0;
  }
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: #4CC9F0;
    }
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px 0;
  font-size: 1.6rem;
  color: #fff;
  
  svg {
    color: #FF6B6B;
  }
`;

const TreksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TrekCard = styled.div`
  background: rgba(30, 40, 60, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const TrekImage = styled.div`
  height: 180px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const TrekCategory = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 12px;
  background: rgba(255, 107, 107, 0.85);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 20px;
`;

const TrekContent = styled.div`
  padding: 20px;
`;

const TrekTitle = styled(Link)`
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-decoration: none;
  
  &:hover {
    color: #4CC9F0;
  }
`;

const TrekMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  
  div {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    
    svg {
      color: #4CC9F0;
    }
  }
`;

const TrekDescription = styled.p`
  font-size: 0.9rem;
  margin: 0 0 15px 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ViewTrekButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(76, 201, 240, 0.2);
  color: #4CC9F0;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(76, 201, 240, 0.3);
  }
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  background: rgba(30, 40, 60, 0.7);
  border-radius: 12px;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.7);
  
  p {
    margin-top: 10px;
  }
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 15px;
    opacity: 0.7;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #fff;
  
  svg {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0.7;
  }
`;

const ErrorContainer = styled.div`
  background: rgba(255, 87, 87, 0.2);
  border-left: 4px solid #FF5757;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
`;

// Function to truncate text with ellipsis
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

const OrganizerProfile = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrganizerAndTreks = async () => {
      try {
        setLoading(true);
        
        // Fetch organizer data
        const organizerDoc = await getDoc(doc(db, 'users', id));
        if (!organizerDoc.exists()) {
          // Try to fetch from organizations collection
          const orgDoc = await getDoc(doc(db, 'organizations', id));
          if (!orgDoc.exists()) {
            setError('Organizer not found.');
            setLoading(false);
            return;
          }
          setOrganizer(orgDoc.data());
        } else {
          setOrganizer({
            ...organizerDoc.data(),
            organizationDetails: organizerDoc.data().organizationDetails || {}
          });        }
        
        // Fetch treks by this organizer
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching organizer data:', err);
        
        // Check if this is an index error
        if (err.message && err.message.includes('index')) {
          // Extract the index creation URL if present
          const indexUrlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
          const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
          
          if (indexUrl) {
            console.log('Index creation URL for administrators:', indexUrl);
          }
          
          setError('Failed to load organizer treks. The system requires a database index update. Please contact an administrator.');
        } else {
          setError('Error loading organizer data. Please try again later.');
        }
        
        setLoading(false);
      }
    };
    
    fetchOrganizerAndTreks();
  }, [id]);
  
  if (loading) {
    return (
      <Page>
        <Container>
          <LoadingContainer>
            <FaMountain />
            <p>Loading organizer profile...</p>
          </LoadingContainer>
        </Container>
      </Page>
    );
  }
  
  if (error) {
    return (
      <Page>
        <Container>
          <ErrorContainer>
            <h2>Error</h2>
            <p>{error}</p>
          </ErrorContainer>
        </Container>
      </Page>
    );
  }
  
  // Extract organizer details
  const orgName = organizer?.organizationDetails?.name || organizer?.name || 'Trek Organizer';
  const orgDescription = organizer?.organizationDetails?.description || organizer?.bio || 'Experienced trek organizer providing amazing trekking experiences.';
  const orgVerified = organizer?.organizationDetails?.verified || false;
  const orgExperience = organizer?.organizationDetails?.experience || '';
  const orgWebsite = organizer?.organizationDetails?.website || '';
  const orgEmail = organizer?.email || '';
  const orgPhone = organizer?.phone || organizer?.organizationDetails?.phone || '';
  const orgLocation = organizer?.location || organizer?.organizationDetails?.location || '';
  const activeTrails = treks.filter(trek => trek.status === 'active').length;
  
  return (
    <Page>
      <Container>
        <ProfileHeader>
          <OrganizerLogo>
            <FaMountain />
          </OrganizerLogo>
          
          <ProfileInfo>
            <OrganizerName>
              {orgName}
              {orgVerified && <FaCheckCircle />}
            </OrganizerName>
            
            <OrganizerMeta>
              <MetaItem>
                <FaMountain /> {treks.length} Treks Organized
              </MetaItem>
              
              {orgExperience && (
                <MetaItem>
                  <FiClock /> {orgExperience} Experience
                </MetaItem>
              )}
              
              {activeTrails > 0 && (
                <MetaItem>
                  <FiFlag /> {activeTrails} Active Trails
                </MetaItem>
              )}
              
              {orgLocation && (
                <MetaItem>
                  <FaMapMarkerAlt /> {orgLocation}
                </MetaItem>
              )}
            </OrganizerMeta>
            
            <OrganizerDescription>
              {orgDescription}
            </OrganizerDescription>
            
            <ContactInfo>
              {orgWebsite && (
                <ContactItem>
                  <FaGlobe />
                  <a href={orgWebsite.startsWith('http') ? orgWebsite : `https://${orgWebsite}`} 
                    target="_blank" rel="noopener noreferrer">
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
          </ProfileInfo>
        </ProfileHeader>
        
        <SectionTitle>
          <FiMap /> Treks by {orgName}
        </SectionTitle>
        
        {treks.length > 0 ? (
          <TreksGrid>
            {treks.map(trek => (
              <TrekCard key={trek.id}>
                <TrekImage image={trek.image}>
                  <TrekCategory>{trek.categoryName || 'Adventure'}</TrekCategory>
                </TrekImage>
                <TrekContent>
                  <TrekTitle to={`/trek/${trek.id}`}>
                    {trek.title}
                  </TrekTitle>
                  
                  <TrekMeta>
                    <div>
                      <FiMapMarkerAlt />
                      {trek.location}
                    </div>
                    
                    <div>
                      <FiCalendar />
                      {trek.days} {trek.days === 1 ? 'day' : 'days'}
                    </div>
                    
                    {trek.difficulty && (
                      <div>
                        <FiFlag />
                        {trek.difficulty.charAt(0).toUpperCase() + trek.difficulty.slice(1)}
                      </div>
                    )}
                    
                    {trek.rating && (
                      <div>
                        <FiStar />
                        {trek.rating}
                      </div>
                    )}
                  </TrekMeta>
                  
                  <TrekDescription>
                    {truncateText(trek.description, 120)}
                  </TrekDescription>
                  
                  <ViewTrekButton to={`/trek/${trek.id}`}>
                    View Trek
                  </ViewTrekButton>
                </TrekContent>
              </TrekCard>
            ))}
          </TreksGrid>
        ) : (
          <EmptyMessage>
            <FaMountain />
            <h3>No Treks Available</h3>
            <p>This organizer hasn't published any treks yet.</p>
          </EmptyMessage>
        )}
      </Container>
    </Page>
  );
};

export default OrganizerProfile;
