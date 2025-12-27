import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; // Added useNavigate
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { FaShieldAlt, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: #1a1c23;
  color: #fff;
  width: 100%;
  box-sizing: border-box; /* Ensures padding doesn't cause scrollbars */
`;

const AccessDeniedIcon = styled.div`
  color: #ff6b6b;
  font-size: 4rem;
  margin-bottom: 20px;

  /* Responsive adjustment for mobile */
  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 15px;
  }
`;

const AccessDeniedTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ff6b6b;
  line-height: 1.2;

  /* Responsive adjustment for mobile */
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const AccessDeniedMessage = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  width: 100%; /* Ensures it shrinks on small screens */
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const BackLink = styled.button`
  background-color: transparent;
  color: #4CC9F0;
  border: 1px solid #4CC9F0;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(76, 201, 240, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 201, 240, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1c23;
  width: 100%;
`;

const SpinnerIcon = styled.div`
  color: #4CC9F0;
  font-size: 3rem;
  margin-bottom: 20px;
  animation: spin 1.5s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.8;
`;

const AccessControl = ({ children, requiredRole, specificUserId }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Hardcoded admin override
        if (currentUser.email === 'luckychelani950@gmail.com') {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role || 'user';
            
            let accessGranted = false;
            
            // Logic Check
            if (userData.role === 'admin') {
              accessGranted = true;
            } 
            else if (requiredRole === 'organizer') {
              if (userData.role === 'organizer') {
                if (specificUserId) {
                  accessGranted = specificUserId === currentUser.uid;
                } else {
                  accessGranted = true;
                }
              }
            }
            else if (requiredRole === 'user' && userData.role) {
              accessGranted = true;
            }
            
            setHasAccess(accessGranted);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [requiredRole, specificUserId]);

  if (loading) {
    return (
      <LoadingContainer>
        <SpinnerIcon>
          <FaSpinner />
        </SpinnerIcon>
        <LoadingText>Verifying permissions...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return (
      <AccessDeniedContainer>
        <AccessDeniedIcon>
          <FaShieldAlt /> {/* Changed to Shield for better UI context */}
        </AccessDeniedIcon>
        <AccessDeniedTitle>Access Restricted</AccessDeniedTitle>
        <AccessDeniedMessage>
          {requiredRole === 'admin' 
            ? "This area is restricted to administrators only."
            : "You do not have the necessary permissions to view this page."}
        </AccessDeniedMessage>
        {/* Updated to use React Router navigation safely */}
        <BackLink onClick={() => navigate(-1)}>Return Previous Page</BackLink>
      </AccessDeniedContainer>
    );
  }

  return children;
};

export default AccessControl;