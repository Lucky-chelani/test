import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  @media (max-width: 480px) {
    margin: 20px auto;
  }
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const AdminCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #666;
  text-align: center;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SimpleAdmin = () => {
  return (
    <AdminContainer>
      <Header>Admin Dashboard</Header>
      
      <AdminGrid>
        <AdminCard to="/admin/communities">
          <Title>Community Admin</Title>
          <Description>
            Manage communities, toggle featured status, and delete communities.
          </Description>
        </AdminCard>
        
        <AdminCard to="/admin/treks">
          <Title>Trek Admin</Title>
          <Description>
            Manage treks, set featured status, and update trek information.
          </Description>
        </AdminCard>        <AdminCard to="/admin/users">
          <Title>User Management</Title>
          <Description>
            Manage user accounts, assign organizer roles, and control user permissions.
          </Description>
        </AdminCard>
        
        <AdminCard to="/admin/coupons">
          <Title>Coupon Management</Title>
          <Description>
            Create and manage discount coupons, track usage, and set validity periods.
          </Description>
        </AdminCard>
      </AdminGrid>
    </AdminContainer>
  );
};

export default SimpleAdmin;
