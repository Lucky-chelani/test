import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaSpinner } from 'react-icons/fa';
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

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const FormContainer = styled.div`
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CC9F0, #FF6B6B);
    opacity: 0.8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Title = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #ffffff;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 25px;

  align-items: center;

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const StarLabel = styled.div`
  font-size: 0.9rem;
  color: #ddd;
  /* Remove fixed margin-top since we use flex align-items */
  /* margin-top: 5px; */ 
  
  /* Change fixed width to min-width or auto */
  width: auto; 
  min-width: 100px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 8px;
`;

const StarButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.active ? '#FFB800' : 'rgba(255, 255, 255, 0.3)'};
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  transform-origin: center;
  
  &:hover {
    transform: ${props => props.active ? 'none' : 'scale(1.2)'};
    color: ${props => props.active ? '#FFB800' : 'rgba(255, 255, 255, 0.6)'};
  }
  
  &:focus {
    outline: none;
  }
`;

const CommentBox = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 15px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  margin-bottom: 20px;
  resize: none;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border: 1px solid rgba(76, 201, 240, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const Button = styled.button`
  background: ${props => props.primary ? 'linear-gradient(to right, #4CC9F0, #4361EE)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    background: ${props => props.primary ? 'linear-gradient(to right, #4361EE, #3A0CA3)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.div`
  padding: 15px;
  border-radius: 12px;
  margin-top: 15px;
  background: ${props => props.$error ? 'rgba(255, 87, 87, 0.2)' : 'rgba(76, 201, 240, 0.2)'};
  color: ${props => props.$error ? '#FF5757' : '#4CC9F0'};
  border: 1px solid ${props => props.$error ? 'rgba(255, 87, 87, 0.3)' : 'rgba(76, 201, 240, 0.3)'};
  animation: ${fadeIn} 0.3s ease-out;
`;

const EditModeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const EditModeTitle = styled.div`
  font-size: 1.2rem;
  color: #4CC9F0;
`;

const CancelButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const ReviewForm = ({ trekId, existingReview = null, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const isEditMode = !!existingReview;
  
  // Handle rating selection
  const handleRating = (value) => {
    setRating(value);
  };
  
  // Handle comment input
  const handleCommentChange = (e) => {
    const value = e.target.value;
    console.log("Comment changed to:", value);
    setComment(value);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (rating === 0) {
      setMessage({
        text: 'Please select a star rating',
        error: true
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      let result;
      
      if (isEditMode) {
        // Update existing review
        result = await ReviewService.updateReview(existingReview.id, {
          rating,
          comment
        });
      } else {
        // Create new review
        console.log('Creating new review for trek:', trekId);
        console.log('Trek ID type:', typeof trekId);
        console.log('Rating:', rating);
        console.log('Comment length:', comment ? comment.length : 0);
        
        result = await ReviewService.createReview({
          trekId,
          rating,
          comment
        });
      }
      
      if (result.success) {
        setMessage({
          text: result.message,
          error: false
        });
        
        // Notify parent component
        if (onReviewSubmitted) {
          setTimeout(() => {
            onReviewSubmitted(result);
          }, 1500);
        }
        
        // Reset form if creating new review
        if (!isEditMode) {
          setRating(0);
          setComment('');
        }
      } else {
        setMessage({
          text: result.message,
          error: true
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || 'An error occurred',
        error: true
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel in edit mode
  const handleCancel = () => {
    if (onCancel) onCancel();
  };
  
  return (
    <FormContainer>
      {isEditMode ? (
        <EditModeHeader>
          <EditModeTitle>Edit your review</EditModeTitle>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        </EditModeHeader>
      ) : (
        <Title>Write a Review</Title>
      )}
      
      <StarContainer>
        <StarLabel>Your Rating:</StarLabel>
        <StarRating>
          {[1, 2, 3, 4, 5].map((value) => (
            <StarButton
              key={value}
              active={value <= rating}
              onClick={() => handleRating(value)}
              disabled={loading}
            >
              <FaStar />
            </StarButton>
          ))}
        </StarRating>
      </StarContainer>
      
      <CommentBox
        placeholder="Share your experience with this trek... (optional)"
        value={comment}
        onChange={handleCommentChange}
        disabled={loading}
      />
      
      <ButtonContainer>
        <Button 
          primary 
          onClick={handleSubmit}
          disabled={loading || rating === 0}
        >
          {loading ? <SpinnerIcon /> : null}
          {isEditMode ? 'Update Review' : 'Submit Review'}
        </Button>
      </ButtonContainer>
      
      {message && (
        <Message $error={message.error}>
          {message.text}
        </Message>
      )}
    </FormContainer>
  );
};

export default ReviewForm;
