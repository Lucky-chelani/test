import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

const Container = styled.div`
  background: rgba(25, 28, 35, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 2px 16px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* ADD THIS: Optimize space on mobile */
  @media (max-width: 480px) {
    padding: 20px; 
    border-radius: 16px;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
`;

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const AverageRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AverageRating = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 8px;
`;

const Star = styled(FaStar)`
  color: ${props => props.filled ? '#FFB800' : 'rgba(255, 255, 255, 0.2)'};
  font-size: 1.1rem;
`;

const TotalReviews = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const DistributionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StarCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 60px;
  
  svg {
    color: #FFB800;
    font-size: 1rem;
  }
  
  span {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.percent}%;
  background: ${props => {
    if (props.level === 5) return 'linear-gradient(to right, #00C853, #18FFAB)';
    if (props.level === 4) return 'linear-gradient(to right, #64DD17, #AEEA00)';
    if (props.level === 3) return 'linear-gradient(to right, #FFD600, #FFEA00)';
    if (props.level === 2) return 'linear-gradient(to right, #FF9100, #FFAB00)';
    return 'linear-gradient(to right, #FF5252, #FF8A80)';
  }};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const CountValue = styled.div`
  width: 35px;
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const NoReviewsMessage = styled.div`
  text-align: center;
  padding: 30px 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  font-style: italic;
`;

const ReviewStats = ({ stats }) => {
  const { averageRating = 0, totalReviews = 0, ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } = stats || {};
  
  // Calculate percentage for progress bars
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };
  
  // Round to nearest half for star display
  const roundedRating = Math.round(averageRating * 2) / 2;
  
  return (
    <Container>
      <Header>
        <Title>Customer Reviews</Title>
        <RatingInfo>
          <AverageRatingContainer>
            <AverageRating>
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </AverageRating>
            <RatingStars>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  filled={star <= Math.floor(roundedRating) || 
                         (star === Math.ceil(roundedRating) && 
                          roundedRating % 1 >= 0.5)}
                />
              ))}
            </RatingStars>
          </AverageRatingContainer>
          <TotalReviews>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</TotalReviews>
        </RatingInfo>
      </Header>
      
      {totalReviews > 0 ? (
        <DistributionContainer>
          {[5, 4, 3, 2, 1].map((rating) => (
            <DistributionRow key={rating}>
              <StarCount>
                <FaStar />
                <span>{rating}</span>
              </StarCount>
              <ProgressBarContainer>
                <ProgressBar 
                  percent={getPercentage(ratingDistribution[rating])} 
                  level={rating}
                />
              </ProgressBarContainer>
              <CountValue>{ratingDistribution[rating]}</CountValue>
            </DistributionRow>
          ))}
        </DistributionContainer>
      ) : (
        <NoReviewsMessage>
          No reviews yet. Be the first to review!
        </NoReviewsMessage>
      )}
    </Container>
  );
};

export default ReviewStats;
