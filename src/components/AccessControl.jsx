import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
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
`;

const AccessDeniedIcon = styled.div`
  color: #ff6b6b;
  font-size: 4rem;
  margin-bottom: 20px;
`;

const AccessDeniedTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ff6b6b;
`;

const AccessDeniedMessage = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin-bottom: 30px;
  opacity: 0.9;
`;

const BackLink = styled.button`
  background-color: transparent;
  color: #4CC9F0;
  border: 1px solid #4CC9F0;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(76, 201, 240, 0.1);
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1c23;
`;

const SpinnerIcon = styled.div`
  color: #4CC9F0;
  font-size: 3rem;
  margin-bottom: 20px;
  animation: spin 1.5s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #fff;
`;

/**
 * AccessControl component that controls access to specific routes based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if access is granted
 * @param {string} props.requiredRole - Role required to access the route (admin, organizer)
 * @param {string} props.specificUserId - If provided, also checks if current user ID matches this ID
 */
const AccessControl = ({ children, requiredRole, specificUserId }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Always treat luckychelani950@gmail.com as admin
        if (currentUser.email === 'luckychelani950@gmail.com') {
          setUserRole('admin');
          setHasAccess(true);
          setLoading(false);
          return;
        }
        try {
          // Fetch user data from Firestore to determine role
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'user');            // Determine if user has access
            let accessGranted = false;
            
            // Admin has access to everything
            if (userData.role === 'admin') {
              accessGranted = true;
            } 
            // Organizer check
            else if (requiredRole === 'organizer') {
              // Check if user is an organizer or admin
              if (userData.role === 'organizer') {
                // If specific user ID is required, check if this organizer is the right one
                if (specificUserId) {
                  accessGranted = specificUserId === currentUser.uid;
                } else {
                  // General organizer access
                  accessGranted = true;
                }
              }
            }
            // Users can access user-specific routes
            else if (requiredRole === 'user' && userData.role) {
              accessGranted = true;
            }
            
            setHasAccess(accessGranted);
          } else {
            setUserRole('user');
            setHasAccess(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserRole('user');
          setHasAccess(false);
        }
      } else {
        setUserRole(null);
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
        <LoadingText>Checking access...</LoadingText>
      </LoadingContainer>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, show access denied
  if (!hasAccess) {
    return (
      <AccessDeniedContainer>
        <AccessDeniedIcon>
          <FaExclamationTriangle />
        </AccessDeniedIcon>
        <AccessDeniedTitle>Access Denied</AccessDeniedTitle>
        <AccessDeniedMessage>
          {requiredRole === 'admin' 
            ? "You need administrator privileges to access this page."
            : "You don't have the required permissions to access this page."}
        </AccessDeniedMessage>
        <BackLink onClick={() => window.history.back()}>Go Back</BackLink>
      </AccessDeniedContainer>
    );
  }

  // User has access, render children
  return children;
};

export default AccessControl;
