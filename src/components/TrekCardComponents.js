// TrekCardComponents.js - Additional styled components for trek cards
import styled from 'styled-components';

const MetaRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
  
  svg {
    color: #64B5F6;
    min-width: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 6px;
  }
`;

const TrekRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 15px 0 5px;
  color: #eee;
  justify-content: center;
  
  svg {
    color: #FFC107;
    font-size: 1.2rem;
  }
  
  .reviews {
    opacity: 0.7;
    font-size: 0.9rem;
    margin-left: 5px;
  }
`;

export { MetaRow, MetaItem, TrekRating };
