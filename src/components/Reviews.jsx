import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { auth } from '../firebase';
import { FaSpinner } from 'react-icons/fa';
import ReviewService from '../services/ReviewService';
import ReviewStats from './ReviewStats';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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

const Container = styled.div`
  padding: 20px 0;
  animation: ${fadeIn} 0.5s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const LoadingSpinner = styled(FaSpinner)`
  color: #4CC9F0;
  font-size: 2rem;
  animation: ${spin} 1s linear infinite;
`;

const EmptyReviewsMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  
  p {
    margin-bottom: 20px;
  }
`;

const ReviewsContainer = styled.div`
  margin-top: 30px;
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
    
`;

const ReviewsTitle = styled.h3`
  font-size: 1.3rem;
  color: #fff;
  margin: 0;
`;

const WriteReviewButton = styled.button`
  background: linear-gradient(to right, #4CC9F0, #4361EE);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    background: linear-gradient(to right, #4361EE, #3A0CA3);
  }
`;

const Reviews = ({ trekId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Debug log the trekId
  useEffect(() => {
    console.log(`Reviews component received trekId: "${trekId}"`, typeof trekId);
  }, [trekId]);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUserId(user?.uid || null);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch trek reviews and stats
  const fetchReviewData = useCallback(async () => {
    setLoading(true);
    console.log(`Fetching review data for trek: "${trekId}"`);
    
    try {
      // Get review statistics
      console.log('Getting review statistics...');
      const statsData = await ReviewService.getTrekReviewStats(trekId);
      console.log('Review statistics:', statsData);
      setStats(statsData);
      
      // Get reviews for the trek
      console.log('Getting trek reviews...');
      const reviewsData = await ReviewService.getTrekReviews(trekId);
      console.log('Trek reviews:', reviewsData);
      setReviews(reviewsData);
      
      // If user is logged in, check if they have reviewed this trek
      if (auth.currentUser) {
        console.log('Getting user review for trek...');
        const userReviewData = await ReviewService.getUserReviewForTrek(
          auth.currentUser.uid,
          trekId
        );
        console.log('User review:', userReviewData);
        setUserReview(userReviewData);
      }
    } catch (error) {
      console.error('Error fetching review data:', error);
    } finally {
      setLoading(false);
    }
  }, [trekId]);
  
  // Fetch reviews on component mount and when trekId changes
  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);
  
  // Handle review submission
  const handleReviewSubmitted = () => {
    // Completely refresh all review data from the server
    console.log('Review submitted, refreshing data for trek:', trekId);
    fetchReviewData();
    // Close the review form
    setShowReviewForm(false);
  };
  
  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    console.log('Deleting review with ID:', reviewId);
    
    // Remove the review from the list
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    
    // Clear user review if it was deleted
    if (userReview && userReview.id === reviewId) {
      setUserReview(null);
      console.log('Cleared user review after deletion');
    }
    
    // Refetch stats
    const statsData = await ReviewService.getTrekReviewStats(trekId);
    setStats(statsData);
  };
  
  // Show the review form
  const showWriteReview = () => {
    setShowReviewForm(true);
  };
  
  // Cancel review form
  const handleCancelEdit = () => {
    setShowReviewForm(false);
  };
  
  // If user is logged in and has already reviewed, filter their review from the list
  // Also ensure we're only displaying reviews for this specific trek
  const filteredReviews = reviews.filter(
    review => !(userReview && review.id === userReview.id) && review.trekId === trekId
  );
  
  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <>
          {/* Reviews Statistics */}
          <ReviewStats stats={stats} />
          
          {/* User's Review Form */}
          {auth.currentUser && !userReview && (showReviewForm ? (
            <ReviewForm 
              trekId={trekId}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <WriteReviewButton onClick={showWriteReview}>
                Write a Review
              </WriteReviewButton>
            </div>
          ))}
          
          {/* User's Existing Review */}
          {userReview && (
            <>
              <ReviewsHeader>
                <ReviewsTitle>Your Review</ReviewsTitle>
              </ReviewsHeader>
              <ReviewCard 
                review={userReview} 
                currentUserId={currentUserId}
                onDelete={handleDeleteReview}
              />
              

            </>
          )}
          
          {/* Other Reviews */}
          {filteredReviews.length > 0 ? (
            <ReviewsContainer>
              <ReviewsHeader>
                <ReviewsTitle>
                  {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
                </ReviewsTitle>
              </ReviewsHeader>
              
              {filteredReviews.map(review => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  currentUserId={currentUserId}
                />
              ))}
            </ReviewsContainer>
          ) : (
            !userReview && (
              <EmptyReviewsMessage>
                <p>No reviews yet for this trek.</p>
              </EmptyReviewsMessage>
            )
          )}
        </>
      )}
    </Container>
  );
};

export default Reviews;
