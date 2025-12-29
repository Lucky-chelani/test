import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaThumbsUp, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import ReviewService from '../services/ReviewService';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ReviewCardContainer = styled.div`
  background: rgba(25, 28, 35, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 15px;

  @media (max-width: 400px) {
    flex-direction: column;
    gap: 10px;
  }
    
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image}) center/cover` : 'linear-gradient(135deg, #4CC9F0, #FF6B6B)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const ReviewDate = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 2px;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 4px;
`;

const Star = styled(FaStar)`
  color: ${props => props.filled ? '#FFB800' : 'rgba(255, 255, 255, 0.2)'};
  font-size: 1rem;
`;

const ReviewContent = styled.div`
  padding: 0 20px 20px;
`;

const ReviewText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: ${props => props.noActions ? '0' : '15px'};
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  background-color: rgba(30, 41, 59, 0.4);
  border-radius: 8px;
  
  &:empty {
    display: none;
  }
`;

const NoCommentMessage = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  font-size: 0.9rem;
  margin-bottom: ${props => props.noActions ? '0' : '15px'};
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const HelpfulButton = styled.button`
  background: ${props => props.active ? 'rgba(76, 201, 240, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(76, 201, 240, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#4CC9F0' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'rgba(76, 201, 240, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
    border: 1px solid ${props => props.active ? 'rgba(76, 201, 240, 0.4)' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const OwnerActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.edit:hover {
    color: #4CC9F0;
  }
  
  &.delete:hover {
    color: #FF5757;
  }
`;

const VerifiedTag = styled.div`
  display: inline-block;
  background-color: rgba(22, 160, 133, 0.2);
  color: #16a085;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  margin-left: 8px;
  font-weight: 600;
`;

const DeleteConfirmation = styled.div`
  padding: 15px;
  background: rgba(255, 87, 87, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 87, 87, 0.3);
  margin-top: 15px;
  animation: ${fadeIn} 0.3s ease;
`;

const ConfirmText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #FF5757;
  }
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button`
  background: ${props => props.danger ? '#FF5757' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.danger ? '#FF3636' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ReviewCard = ({ review, currentUserId, onDelete, noActions }) => {
  const [isHelpful, setIsHelpful] = useState(
    review.helpfulBy?.includes(currentUserId) || false
  );
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isOwner = currentUserId && review.userId === currentUserId;
  
  // Get first letter of author name for avatar fallback
  const getInitial = () => {
    return review.userName?.charAt(0) || '?';
  };
  
  // Handle marking review as helpful
  const handleHelpful = async () => {
    if (loading || !currentUserId) return;
    
    setLoading(true);
    
    const newHelpfulState = !isHelpful;
    const result = await ReviewService.markReviewHelpful(review.id, newHelpfulState);
    
    if (result.success) {
      setIsHelpful(newHelpfulState);
      setHelpfulCount(prevCount => newHelpfulState ? prevCount + 1 : Math.max(0, prevCount - 1));
    }
    
    setLoading(false);
  };
  
  // Request delete confirmation
  const requestDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  // Confirm delete
  const confirmDelete = async () => {
    if (onDelete) {
      setLoading(true);
      const result = await ReviewService.deleteReview(review.id);
      
      if (result.success) {
        onDelete(review.id);
      }
      
      setLoading(false);
    }
  };
  
  // Debug the full review object
  console.log('Full review object in ReviewCard:', review);
  
  return (
    <ReviewCardContainer>
      <ReviewHeader>
        <UserInfo>
          <Avatar image={review.userPhoto}>
            {!review.userPhoto && getInitial()}
          </Avatar>
          <UserDetails>
            <UserName>
              {review.userName}
              {review.verified && <VerifiedTag>Verified Trek</VerifiedTag>}
            </UserName>
            <ReviewDate>{review.createdAt}</ReviewDate>
          </UserDetails>
        </UserInfo>
        <RatingStars>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} filled={star <= review.rating} />
          ))}
        </RatingStars>
      </ReviewHeader>
      <ReviewContent>
        {console.log('Review comment:', review.comment, typeof review.comment)}
        
        {/* Force review comment to display regardless of content */}
        <ReviewText noActions={noActions}>
          {review.comment || "No comment provided"}
        </ReviewText>
        
        {!noActions && (
          <ReviewActions>
            <HelpfulButton 
              active={isHelpful} 
              onClick={handleHelpful}
              disabled={loading || !currentUserId}
            >
              <FaThumbsUp />
              {helpfulCount > 0 && helpfulCount} Helpful
            </HelpfulButton>
            
            {isOwner && (
              <OwnerActions>
                <ActionButton className="delete" onClick={requestDelete}>
                  <FaTrash />
                </ActionButton>
              </OwnerActions>
            )}
          </ReviewActions>
        )}
        
        {showDeleteConfirm && (
          <DeleteConfirmation>
            <ConfirmText>
              <FaExclamationCircle />
              Are you sure you want to delete this review?
            </ConfirmText>
            <ConfirmButtons>
              <ConfirmButton onClick={cancelDelete}>Cancel</ConfirmButton>
              <ConfirmButton danger onClick={confirmDelete} disabled={loading}>
                Delete
              </ConfirmButton>
            </ConfirmButtons>
          </DeleteConfirmation>
        )}
      </ReviewContent>
    </ReviewCardContainer>
  );
};

export default ReviewCard;
