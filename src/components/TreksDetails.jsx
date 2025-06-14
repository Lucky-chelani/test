import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FiClock, FiMapPin, FiCalendar, FiUsers, FiArrowLeft, FiStar, FiCheck, FiX } from 'react-icons/fi';
import { FaMountain, FaLeaf, FaWater, FaSnowflake } from 'react-icons/fa';
import mapPattern from "../assets/images/map-pattren.png";
import { getValidImageUrl } from "../utils/images";

// Animations
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

const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Main Container
const PageContainer = styled.div`
  position: relative;
  background-color: #f7f9fc;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const MapBackground = styled.div`
  position: absolute;
  inset: 0;
  background: url(${mapPattern});
  background-size: 500px;
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
`;

// Hero Section
const HeroSection = styled.div`
  position: relative;
  height: 60vh;
  min-height: 400px;
  max-height: 600px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 40vh;
    min-height: 300px;
  }
`;

const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${props => `url(${props.image})`};
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
  }
`;

const GoBackButton = styled.button`
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
  }
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 60px;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const HeroTitle = styled.h1`
  color: #fff;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 15px;
  animation: ${fadeIn} 0.6s ease-out;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroTagsContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease-out 0.1s forwards;
  opacity: 0;
`;

// Content Section
const ContentContainer = styled.div`
  max-width: 1200px;
  margin: -50px auto 0;
  padding: 0 30px;
  position: relative;
  z-index: 3;
  
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 300px;
    gap: 30px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
    margin-top: -30px;
  }
`;

const MainContent = styled.div`
  animation: ${fadeIn} 0.6s ease-out 0.2s forwards;
  opacity: 0;
`;

const Section = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 25px 20px;
    border-radius: 15px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #222;
  position: relative;
  padding-bottom: 12px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #5390D9, #7400B8);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.div`
  color: #444;
  line-height: 1.7;
  font-size: 1.1rem;
  
  p {
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Sidebar
const Sidebar = styled.div`
  animation: ${fadeIn} 0.6s ease-out 0.3s forwards;
  opacity: 0;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 30px;
  border: 1px solid rgba(83, 144, 217, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 15%;
    right: 15%;
    height: 2px;
    background: linear-gradient(to right, transparent, #5390D9, transparent);
    border-radius: 100%;
  }
`;

const BookingCardHeader = styled.div`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  padding: 25px 30px;
  color: white;
`;

const PriceTag = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  span {
    font-size: 1rem;
    font-weight: 400;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const BookingCardContent = styled.div`
  padding: 25px 30px;
`;

const BookingInfo = styled.div`
  margin-bottom: 25px;
`;

const BookingInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  svg {
    color: #5390D9;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const BookingItemLabel = styled.span`
  color: #777;
  font-size: 0.95rem;
`;

const BookingItemValue = styled.span`
  color: #222;
  font-weight: 600;
  margin-left: auto;
  text-align: right;
`;

const BookNowButton = styled.button`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  width: 100%;
  padding: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 25px rgba(83, 144, 217, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(83, 144, 217, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

// Tag Components
const Tag = styled.span`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 50px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 16px;
  }
`;

const DifficultyTag = styled(Tag)`
  background: linear-gradient(to right, rgba(83, 144, 217, 0.8), rgba(116, 0, 184, 0.8));
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// Gallery
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryImage = styled.div`
  height: 180px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    
    &::after {
      opacity: 0.3;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  
  @media (max-width: 768px) {
    height: 150px;
  }
`;

// Itinerary
const ItineraryList = styled.div`
  margin-top: 20px;
`;

const ItineraryDay = styled.div`
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItineraryDayHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const DayNumber = styled.div`
  background: linear-gradient(135deg, #5390D9 0%, #7400B8 100%);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
`;

const DayTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
`;

const DayDescription = styled.p`
  color: #555;
  padding-left: 55px;
  line-height: 1.6;
`;

// Highlights
const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
`;

const HighlightIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(83, 144, 217, 0.1);
  color: #5390D9;
  font-size: 1rem;
  flex-shrink: 0;
`;

const HighlightText = styled.div`
  color: #333;
  font-weight: 500;
`;

// Included/Excluded Items
const IncludedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IncludedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: ${props => props.excluded ? '#999' : '#333'};
  
  svg {
    color: ${props => props.excluded ? '#999' : '#5390D9'};
  }
`;

// Reviews
const ReviewsList = styled.div`
  margin-top: 20px;
`;

const Review = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const ReviewAuthor = styled.div`
  font-weight: 600;
  color: #333;
`;

const ReviewDate = styled.div`
  font-size: 0.9rem;
  color: #777;
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
  
  svg {
    color: #FFD700;
    font-size: 1.1rem;
  }
`;

const ReviewText = styled.div`
  color: #555;
  line-height: 1.6;
`;

// Loading and Error States
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #333;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #5390D9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 100px 0;
  color: #333;
`;

const ErrorButton = styled.button`
  margin-top: 20px;
  background: #5390D9;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: #4a81c4;
  }
`;

// Main Component
export default function TrekDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackData, setFallbackData] = useState(null);
  
  // Create fallback data based on ID
  const createFallbackTrek = useCallback(() => {
    const fallbackName = id.replace(/-/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      id: id,
      title: fallbackName,
      image: `https://source.unsplash.com/1600x900/?mountains,trek,${id.replace(/-/g, '+')}`,
      description: `Experience the beautiful ${fallbackName} trek with stunning views and challenging paths. This adventure will take you through diverse landscapes and provide unforgettable memories.`,
      days: Math.floor(Math.random() * 8) + 3,
      difficulty: ["Easy", "Moderate", "Difficult"][Math.floor(Math.random() * 3)],
      location: "Mountain Region",
      country: "Nepal",
      season: "Year-round",
      price: `$${(Math.floor(Math.random() * 900) + 300)}`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 10,
      capacity: `${Math.floor(Math.random() * 15) + 5}`,
      altitude: `${Math.floor(Math.random() * 4000) + 1000}m`,
    };
  }, [id]);
  
  // Initialize fallback data
  useEffect(() => {
    setFallbackData(createFallbackTrek());
  }, [createFallbackTrek]);
  
  // Create sample reviews
  const generateSampleReviews = useCallback((trekTitle) => {
    const reviewTexts = [
      `Amazing experience! ${trekTitle} exceeded all my expectations. The guides were knowledgeable and the views were breathtaking.`,
      `${trekTitle} was the highlight of our vacation. Challenging at times but absolutely worth every step. Would highly recommend!`,
      `Beautiful trek through diverse landscapes. The organization was perfect and everything went smoothly.`,
      `Good trek overall. Some parts were more difficult than advertised, but the scenery made up for it.`,
      `Unforgettable journey through ${trekTitle}. The local food and camping spots were fantastic. Can't wait to come back!`
    ];
    
    const names = ["John D.", "Sarah M.", "Michael T.", "Emily R.", "David L."];
    const dates = ["2 months ago", "3 weeks ago", "5 months ago", "1 month ago", "2 weeks ago"];
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `rev-${i}`,
      author: names[i],
      date: dates[i],
      rating: 4 + (i % 2),
      text: reviewTexts[i]
    }));
  }, []);
  
  // Fetch trek data from Firebase with fallback options
  useEffect(() => {
    console.log("TrekDetails: Fetching trek with ID:", id);
    let isMounted = true;
    
    // Use a timeout to avoid infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading && isMounted) {
        console.log("Trek loading timeout - using fallback data");
        if (fallbackData) {
          setTrek(fallbackData);
          setLoading(false);
        }
      }
    }, 8000); // 8 second timeout
    
    const fetchTrekData = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // First try: Get the trek document by exact ID
        console.log("TrekDetails: Attempting to fetch trek document from 'treks' collection");
        const trekRef = doc(db, "treks", id);
        const trekSnap = await getDoc(trekRef);
        
        if (!isMounted) return;
        
        console.log("TrekDetails: Document exists?", trekSnap.exists());
        
        if (trekSnap.exists()) {
          // Get the trek data
          const trekData = { id: trekSnap.id, ...trekSnap.data() };
          
          // Add reviews
          try {
            trekData.reviewsData = generateSampleReviews(trekData.title);
            
            // If we have real reviews, try to get them
            const reviewsQuery = query(collection(db, "reviews"), where("trekId", "==", id));
            const reviewsSnap = await getDocs(reviewsQuery);
            
            if (!reviewsSnap.empty) {
              const reviewsData = reviewsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              trekData.reviewsData = reviewsData;
            }
          } catch (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
          }
          
          if (isMounted) {
            clearTimeout(loadingTimeout);
            setTrek(trekData);
            setLoading(false);
          }
        } else {
          // Second try: Search by ID field in documents
          try {
            const treksRef = collection(db, "treks");
            const q = query(treksRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);
            
            if (!isMounted) return;
            
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              const trekData = { id: doc.id, ...doc.data() };
              trekData.reviewsData = generateSampleReviews(trekData.title);
              
              clearTimeout(loadingTimeout);
              setTrek(trekData);
              setLoading(false);
            } else {
              // Third try: Get all treks and search manually
              const treksSnapshot = await getDocs(treksRef);
              
              if (!isMounted) return;
              
              if (!treksSnapshot.empty) {
                let foundTrek = null;
                
                // Look for matches in the data
                treksSnapshot.forEach((doc) => {
                  const data = doc.data();
                  
                  // Check various potential matches
                  if (doc.id === id || data.id === id || 
                      (data.title && data.title.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase())) {
                    foundTrek = { id: doc.id, ...data };
                  }
                });
                
                if (foundTrek) {
                  foundTrek.reviewsData = generateSampleReviews(foundTrek.title);
                  clearTimeout(loadingTimeout);
                  setTrek(foundTrek);
                  setLoading(false);
                } else {
                  // Last resort - use fallback data
                  console.log("No matching trek found, using fallback data");
                  clearTimeout(loadingTimeout);
                  setTrek(fallbackData);
                  setLoading(false);
                }
              } else {
                clearTimeout(loadingTimeout);
                setTrek(fallbackData);
                setLoading(false);
              }
            }
          } catch (error) {
            console.error("Error in trek search:", error);
            if (isMounted) {
              clearTimeout(loadingTimeout);
              setTrek(fallbackData);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching trek:", err);
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setTrek(fallbackData);
          setLoading(false);
        }
      }
    };
    
    fetchTrekData();
    
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [id, fallbackData, generateSampleReviews]);
    // Create sample itinerary based on days
  const generateItinerary = useCallback((days, title) => {
    const activities = [
      "Start with an early morning hike",
      "Explore the local landmarks",
      "Trek through scenic mountain paths",
      "Visit natural hot springs",
      "Cross hanging bridges over valleys",
      "Camp near crystal clear lakes",
      "Reach panoramic viewpoints",
      "Descend through forest trails",
      "Discover hidden waterfalls",
      "Visit local villages"
    ];
    
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? `Begin the adventure at ${title}` : 
             i === days - 1 ? "Final day and departure" :
             `Day ${i + 1} of the trek`,
      description: activities[i % activities.length]
    }));
  }, []);
  
  // Generate highlights
  const generateHighlights = useCallback((title) => [
    `Panoramic views of ${title}`,
    "Diverse flora and fauna",
    "Professional local guides",
    "Comfortable accommodation",
    "Cultural immersion",
    "Delicious local cuisine"
  ], []);

  // Generate included items
  const getIncludedItems = useCallback(() => [
    "Professional guide",
    "Accommodation",
    "Meals as per itinerary",
    "Transport during the trek",
    "Entry fees",
    "Safety equipment"
  ], []);

  // Generate excluded items
  const getExcludedItems = useCallback(() => [
    "International flights",
    "Travel insurance",
    "Personal expenses",
    "Tips for guides"
  ], []);
  
  // Determine appropriate icon for season
  const getSeasonIcon = (season) => {
    if (!season) return <FaLeaf />;
    
    const s = season.toLowerCase();
    if (s.includes("winter") || s.includes("snow")) return <FaSnowflake />;
    if (s.includes("summer")) return <FaMountain />;
    if (s.includes("spring")) return <FaLeaf />;
    if (s.includes("monsoon") || s.includes("rain")) return <FaWater />;
    return <FaLeaf />;
  };

  // Format price if needed
  const formatPrice = (price) => {
    if (!price) return "0";
    if (typeof price === "number") return `${price}`;
    if (typeof price === "string") {
      // Remove leading $ if present
      return price.replace(/^\$/, "");
    }
    return "0";
  };
  if (loading) {
    return (
      <PageContainer>
        <MapBackground />
        <LoadingContainer>
          <Spinner />
          <div>Loading trek details...</div>
        </LoadingContainer>
      </PageContainer>
    );
  }
  if (error && !fallbackData) {
    return (
      <PageContainer>
        <MapBackground />
        <ErrorContainer>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <ErrorButton onClick={() => navigate(-1)}>Go Back</ErrorButton>
          <ErrorButton 
            onClick={() => window.location.reload()} 
            style={{ marginLeft: '10px', background: '#4a81c4' }}
          >
            Refresh Page
          </ErrorButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  // Create fallback values for missing data
  const trekTitle = trek?.title || "Trek Details";
  const trekDescription = trek?.description || "Experience this amazing trek through beautiful landscapes. This adventure will take you through diverse terrains and offer unforgettable views.";
  const trekImage = getValidImageUrl(trek?.image);
  const trekDays = trek?.days || 1;
  const trekPrice = formatPrice(trek?.price);
  const trekDifficulty = trek?.difficulty || "Moderate";
  const trekLocation = trek?.location || "Mountain Region";
  const trekSeason = trek?.season || "Year-round";
  const trekCountry = trek?.country || "Nepal";
  const trekRating = trek?.rating || 5;
  const trekReviews = trek?.reviews || 0;
  const trekCapacity = trek?.capacity || "10";
  const trekAltitude = trek?.altitude || "3,000m";
  
  // Generate itinerary if not available
  const itinerary = trek?.itinerary || generateItinerary(trekDays, trekTitle);
  
  // Generate highlights if not available
  const highlights = trek?.highlights || generateHighlights(trekTitle);
  
  // Included/excluded items
  const included = trek?.included || getIncludedItems();
  const excluded = trek?.excluded || getExcludedItems();
  
  // Reviews data
  const reviewsData = trek?.reviewsData || generateSampleReviews(trekTitle);

  return (
    <PageContainer>
      <MapBackground />
      
      {/* Hero Section */}
      <HeroSection>
        <HeroImage image={trekImage} />
        <GoBackButton onClick={() => navigate(-1)} aria-label="Go back">
          <FiArrowLeft />
        </GoBackButton>
        
        <HeroContent>
          <HeroTitle>{trekTitle}</HeroTitle>
          <HeroTagsContainer>
            <Tag>
              <FiMapPin />
              {trekLocation}, {trekCountry}
            </Tag>
            <DifficultyTag>
              <FaMountain />
              {trekDifficulty}
            </DifficultyTag>
            <Tag>
              <FiCalendar />
              {trekSeason}
            </Tag>
            <Tag>
              <FiClock />
              {trekDays} {trekDays === 1 ? 'Day' : 'Days'}
            </Tag>
          </HeroTagsContainer>
        </HeroContent>
      </HeroSection>
      
      {/* Content Section */}
      <ContentContainer>
        <MainContent>
          {/* Overview */}
          <Section>
            <SectionTitle>Overview</SectionTitle>
            <Description>
              <p>{trekDescription}</p>
              <p>This {trekDays}-day adventure will take you through the beautiful landscapes of {trekLocation}. You'll experience {trekDifficulty} trails suitable for {trekDifficulty === 'Easy' ? 'beginners' : trekDifficulty === 'Hard' ? 'experienced trekkers' : 'intermediate hikers'} with stunning views throughout the journey.</p>
            </Description>
            
            {/* Highlights */}
            <SectionTitle>Highlights</SectionTitle>
            <HighlightsGrid>
              {highlights.map((highlight, index) => (
                <HighlightItem key={index}>
                  <HighlightIcon>
                    <FiCheck />
                  </HighlightIcon>
                  <HighlightText>{highlight}</HighlightText>
                </HighlightItem>
              ))}
            </HighlightsGrid>
          </Section>
          
          {/* Itinerary */}
          <Section>
            <SectionTitle>Itinerary</SectionTitle>
            <ItineraryList>
              {itinerary.map((day, index) => (
                <ItineraryDay key={index}>
                  <ItineraryDayHeader>
                    <DayNumber>{day.day}</DayNumber>
                    <DayTitle>{day.title}</DayTitle>
                  </ItineraryDayHeader>
                  <DayDescription>{day.description}</DayDescription>
                </ItineraryDay>
              ))}
            </ItineraryList>
          </Section>
          
          {/* Gallery */}
          <Section>
            <SectionTitle>Gallery</SectionTitle>
            <GalleryGrid>
              {/* Use the main image for all gallery items if no gallery images provided */}
              {Array.from({ length: 6 }).map((_, index) => (
                <GalleryImage 
                  key={index} 
                  style={{ backgroundImage: `url(${getValidImageUrl(trek?.gallery?.[index] || trek?.image)})` }}
                />
              ))}
            </GalleryGrid>
          </Section>
          
          {/* Included/Excluded */}
          <Section>
            <SectionTitle>What's Included</SectionTitle>
            <IncludedGrid>
              {included.map((item, index) => (
                <IncludedItem key={index}>
                  <FiCheck />
                  {item}
                </IncludedItem>
              ))}
            </IncludedGrid>
            
            <SectionTitle style={{ marginTop: '30px' }}>Not Included</SectionTitle>
            <IncludedGrid>
              {excluded.map((item, index) => (
                <IncludedItem key={index} excluded>
                  <FiX />
                  {item}
                </IncludedItem>
              ))}
            </IncludedGrid>
          </Section>
          
          {/* Reviews */}
          <Section>
            <SectionTitle>Reviews</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                color: '#333'
              }}>{trekRating}</div>
              
              <div>
                <RatingStars>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} 
                      style={{ 
                        fill: i < Math.floor(trekRating) ? '#FFD700' : 'none',
                        stroke: i < Math.floor(trekRating) ? '#FFD700' : '#ccc'
                      }} 
                    />
                  ))}
                </RatingStars>
                <div style={{ fontSize: '0.9rem', color: '#777' }}>
                  Based on {trekReviews} reviews
                </div>
              </div>
            </div>
            
            <ReviewsList>
              {reviewsData.map((review, index) => (
                <Review key={review.id || index}>
                  <ReviewHeader>
                    <ReviewAuthor>{review.author}</ReviewAuthor>
                    <ReviewDate>{review.date}</ReviewDate>
                  </ReviewHeader>
                  <RatingStars>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} 
                        style={{ 
                          fill: i < review.rating ? '#FFD700' : 'none',
                          stroke: i < review.rating ? '#FFD700' : '#ccc'
                        }} 
                      />
                    ))}
                  </RatingStars>
                  <ReviewText>{review.text}</ReviewText>
                </Review>
              ))}
            </ReviewsList>
          </Section>
        </MainContent>
        
        {/* Sidebar */}
        <Sidebar>
          <BookingCard>
            <BookingCardHeader>
              <PriceTag>
                {trekPrice} <span>per person</span>
              </PriceTag>
              <div style={{ display: 'flex', gap: '5px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} 
                    style={{ 
                      fill: i < Math.floor(trekRating) ? 'white' : 'none',
                      stroke: 'white',
                      opacity: i < Math.floor(trekRating) ? 1 : 0.7
                    }} 
                  />
                ))}
                <span style={{ marginLeft: '5px', fontSize: '0.9rem' }}>
                  ({trekReviews} reviews)
                </span>
              </div>
            </BookingCardHeader>
            
            <BookingCardContent>
              <BookingInfo>
                <BookingInfoItem>
                  <FiCalendar />
                  <BookingItemLabel>Duration</BookingItemLabel>
                  <BookingItemValue>{trekDays} {trekDays === 1 ? 'Day' : 'Days'}</BookingItemValue>
                </BookingInfoItem>
                
                <BookingInfoItem>
                  <FiMapPin />
                  <BookingItemLabel>Location</BookingItemLabel>
                  <BookingItemValue>{trekLocation}</BookingItemValue>
                </BookingInfoItem>
                
                <BookingInfoItem>
                  <FaMountain />
                  <BookingItemLabel>Difficulty</BookingItemLabel>
                  <BookingItemValue>{trekDifficulty}</BookingItemValue>
                </BookingInfoItem>
                
                <BookingInfoItem>
                  <FiUsers />
                  <BookingItemLabel>Group Size</BookingItemLabel>
                  <BookingItemValue>Max {trekCapacity}</BookingItemValue>
                </BookingInfoItem>
                
                <BookingInfoItem>
                  {getSeasonIcon(trekSeason)}
                  <BookingItemLabel>Season</BookingItemLabel>
                  <BookingItemValue>{trekSeason}</BookingItemValue>
                </BookingInfoItem>
                
                <BookingInfoItem>
                  <FaMountain />
                  <BookingItemLabel>Max Altitude</BookingItemLabel>
                  <BookingItemValue>{trekAltitude}</BookingItemValue>
                </BookingInfoItem>
              </BookingInfo>
              
              <BookNowButton>
                Book This Trek
                <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
              </BookNowButton>
            </BookingCardContent>
          </BookingCard>
        </Sidebar>
      </ContentContainer>
    </PageContainer>
  );
}