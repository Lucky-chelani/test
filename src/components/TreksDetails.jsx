import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaMountain } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import { getValidImageUrl } from "../utils/images";
import { saveBooking } from "../utils/bookingService";

// --- Sub-Components Imports ---
import BookingModal from "./BookingModal";
import Header from "./TrekPage/Header";
import Hero from "./TrekPage/Hero";
import Stats from "./TrekPage/Stats";
import MeetOrganizer from "./TrekPage/MeetOrganizer";
import Highlights from "./TrekPage/Highlights";
import Description from "./TrekPage/Description";
import BestTimeToVisit from "./TrekPage/BestTimeToVisit";
import Itinerary from "./TrekPage/Itinerary";
import IncludedExcluded from "./TrekPage/IncludedExcluded";
import PhotoGallery from "./TrekPage/PhotoGallery";
import ReviewsSection from "./TrekPage/ReviewsSection";
import BookingCard from "./TrekPage/BookingCard";
import OrganizerSection from "./TrekPage/OrganizerSection";
import GalleryModal from "./TrekPage/GalleryModal";
import WhatsAppButton from './TrekPage/WhatsAppButton';

// --- GLOBAL STYLES & FONTS ---
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  body {
    background-color: #0a0a1a;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
`;

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

// --- LAYOUT COMPONENTS ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0a0a1a;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
`;

const ContentBackground = styled.div`
  background: linear-gradient(to bottom, #0a0a0a 0%, #111827 100%);
  position: relative;
  z-index: 2;
  padding-top: 1rem;
  box-shadow: 0 -40px 100px rgba(0,0,0,0.8);
  min-height: 60vh;
  padding-bottom: 6rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (min-width: 1400px) {
    max-width: 1360px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
  position: relative;
  top: -60px; 
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 340px;
    gap: 2rem;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    top: 0;
    gap: 3rem;
    padding-top: 3rem;
  }
`;

const MainColumn = styled.main`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  min-width: 0;
`;

const SidebarColumn = styled.aside`
  position: relative;
  
  @media (min-width: 901px) {
    height: fit-content;
    position: sticky;
    top: 100px;
    z-index: 10;
  }
  
  @media (max-width: 900px) {
    order: -1;
  }
`;

// --- LOADING & ERROR STYLES ---

const FullScreenCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a1a;
`;

const LoadingContent = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

// FIX: Define the animated icon wrapper here instead of using inline style
const AnimatedLoadingIcon = styled.div`
  font-size: 48px;
  color: #42A04B;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.h2`
  font-size: 1.5rem;
  color: white;
  margin: 0;
  font-weight: 500;
`;

const ErrorBox = styled.div`
  background: rgba(255, 87, 87, 0.1);
  border: 1px solid rgba(255, 87, 87, 0.3);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
`;

const ActionButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover { background: #1d4ed8; }
`;

// --- GALLERY MODAL GLOBAL STYLES INJECTION ---
const galleryModalStyles = `
  .gallery-modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease-out;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .gallery-modal-content { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  .gallery-close-btn { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 24px; z-index: 20; transition: all 0.3s; }
  .gallery-close-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }
  .gallery-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 32px; z-index: 20; transition: all 0.3s; }
  .gallery-nav-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }
  .gallery-prev-btn { left: 20px; }
  .gallery-next-btn { right: 20px; }
  .gallery-image-container { position: relative; width: 90%; height: 80%; display: flex; align-items: center; justify-content: center; }
  .gallery-main-image { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: none; }
  .gallery-main-image.active { display: block; animation: fadeIn 0.3s; }
  .gallery-counter { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.2); color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; backdrop-filter: blur(5px); }
  .gallery-thumbnails { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 16px; backdrop-filter: blur(10px); max-width: 90%; overflow-x: auto; }
  .gallery-thumbnail { width: 50px; height: 50px; border-radius: 6px; border: 2px solid transparent; padding: 0; overflow: hidden; cursor: pointer; opacity: 0.6; transition: all 0.2s; }
  .gallery-thumbnail.active { border-color: #4ECDC4; opacity: 1; transform: scale(1.1); }
  .gallery-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
  
  @media (max-width: 768px) {
    .gallery-nav-btn { width: 40px; height: 40px; font-size: 20px; }
    .gallery-prev-btn { left: 10px; }
    .gallery-next-btn { right: 10px; }
    .gallery-close-btn { top: 10px; right: 10px; width: 40px; height: 40px; font-size: 20px; }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = galleryModalStyles;
  document.head.appendChild(styleSheet);
}

// --- MAIN COMPONENT ---

export default function TrekDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackData, setFallbackData] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  
  // Gallery Logic States
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  // Handle scroll effects for Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload trek images logic
  useEffect(() => {
    if (trek || fallbackData) {
      const imageUrls = Array.isArray(trek?.imageUrls) 
        ? trek.imageUrls.filter(url => url && typeof url === 'string')
        : [];
      const singleImgSrc = trek?.image || fallbackData?.image;
      
      if (imageUrls.length > 0) {
        const coverImg = new Image();
        coverImg.src = getValidImageUrl(imageUrls[0]);
        coverImg.onload = () => setImageLoaded(true);
        imageUrls.slice(1).forEach(url => {
          const img = new Image();
          img.src = getValidImageUrl(url);
        });
        const timer = setTimeout(() => setImageLoaded(true), 3000);
        return () => clearTimeout(timer);
      } else if (singleImgSrc) {
        const img = new Image();
        img.src = getValidImageUrl(singleImgSrc);
        img.onload = () => setImageLoaded(true);
        const timer = setTimeout(() => setImageLoaded(true), 3000);
        return () => clearTimeout(timer);
      } else {
        setImageLoaded(true);
      }
    }
  }, [trek, fallbackData]);

  // Fallback Data Generator
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
      price: `₹${(Math.floor(Math.random() * 9000) + 3000)}`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 100) + 10,
      capacity: `${Math.floor(Math.random() * 15) + 5}`,
      altitude: `${Math.floor(Math.random() * 4000) + 1000}m`,
    };
  }, [id]);

  useEffect(() => {
    setFallbackData(createFallbackTrek());
  }, [createFallbackTrek]);

  // Sample Reviews Generator
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

  // Fetch Trek Data
  useEffect(() => {
    let isMounted = true;
    const loadingTimeout = setTimeout(() => {
      if (loading && isMounted) {
        if (fallbackData) {
          setTrek(fallbackData);
          setLoading(false);
        }
      }
    }, 8000);
    
    const fetchTrekData = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        const trekRef = doc(db, "treks", id);
        const trekSnap = await getDoc(trekRef);
        
        if (!isMounted) return;
        
        if (trekSnap.exists()) {
          const trekData = { id: trekSnap.id, ...trekSnap.data() };
          try {
            trekData.reviewsData = generateSampleReviews(trekData.title);
            const reviewsQuery = query(collection(db, "reviews"), where("trekId", "==", id));
            const reviewsSnap = await getDocs(reviewsQuery);
            if (!reviewsSnap.empty) {
              const reviewsData = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              trekData.reviewsData = reviewsData;
            }
          } catch (reviewsError) { console.error(reviewsError); }
          
          if (isMounted) {
            clearTimeout(loadingTimeout);
            setTrek(trekData);
            setLoading(false);
          }
        } else {
          // Attempt to find by ID field or slug
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
            // Manual filter fallback
            const treksSnapshot = await getDocs(treksRef);
            if (!isMounted) return;
            if (!treksSnapshot.empty) {
              let foundTrek = null;
              treksSnapshot.forEach((doc) => {
                const data = doc.data();
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
        }
      } catch (err) {
        console.error("Error fetching trek:", err);
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setTrek(fallbackData);
          setLoading(false);
          setError("Could not load trek details. Please try again later.");
        }
      }
    };
    
    fetchTrekData();
    return () => { isMounted = false; clearTimeout(loadingTimeout); };
  }, [id, fallbackData, generateSampleReviews]);

  // Generators
  const generateItinerary = useCallback((days, title) => {
    const activities = [
      "Start with an early morning hike through mountain trails",
      "Explore local landmarks and scenic viewpoints",
      "Trek through diverse mountain paths with stunning views",
      "Visit natural hot springs and mountain villages",
      "Cross suspension bridges over deep valleys",
      "Camp beside crystal clear alpine lakes",
      "Reach panoramic viewpoints at high altitudes",
      "Descend through ancient forest trails",
      "Discover hidden waterfalls and wildlife",
      "Visit traditional villages and return to base"
    ];
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? `Begin the ${title} adventure` : i === days - 1 ? "Final day and return journey" : `Day ${i + 1}: Mountain exploration`,
      description: activities[i % activities.length]
    }));
  }, []);

  const generateHighlights = useCallback((title) => [
    `Spectacular views from ${title} peaks`, "Diverse mountain flora and wildlife", "Expert guides and safety equipment", "Comfortable mountain accommodations", "Cultural immersion with local communities", "Authentic mountain cuisine", "Photography opportunities", "Adventure activities and exploration"
  ], []);

  const getIncludedItems = useCallback(() => [
    "Professional mountain guide", "All accommodation during trek", "Meals as per itinerary", "Transportation during trek", "Entry fees and permits", "Safety equipment provided", "First aid and emergency support", "Trekking insurance coverage"
  ], []);

  const getExcludedItems = useCallback(() => [
    "International flights", "Personal travel insurance", "Personal expenses and tips", "Alcoholic beverages", "Personal equipment rental", "Emergency evacuation costs"
  ], []);

  // Format Helpers
  const formatPrice = (price) => {
    if (!price) return "₹0";
    if (typeof price === "number") return `₹${price}`;
    if (typeof price === "string") {
      const formattedPrice = price.replace(/^\$/, "");
      return formattedPrice.startsWith("₹") ? formattedPrice : `₹${formattedPrice}`;
    }
    return "₹0";
  };

  const getNumericPrice = (price) => {
    if (!price) return 0;
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const numericPrice = parseFloat(price.replace(/^[$₹]/, "").replace(/,/g, ""));
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };

  // Handlers
  const handleBookingSuccess = async (bookingData) => {
    try {
      if (!authUser) return;
      const trekName = trek?.title || trek?.name || id.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      const completeBookingData = {
        ...bookingData,
        userId: authUser.uid,
        userEmail: authUser.email,
        userDisplayName: authUser.displayName,
        trekId: trek.id || id,
        trekName: trekName,
        trekTitle: trekName,
        trekImage: getValidImageUrl(trek?.image),
        trekDays: trek?.days || 1,
        trekPrice: formatPrice(trek?.price),
        trekLocation: trek?.location || "Mountain Region",
        trekDifficulty: trek.difficulty,
        trekCountry: trek.country,
        trekSeason: trek.season,
        trekCapacity: trek.capacity,
        trekAltitude: trek.altitude,
        bookingTimestamp: new Date().toISOString(),
        bookingPlatform: 'web',
      };
      
      Object.keys(completeBookingData).forEach(key => {
        if (completeBookingData[key] === undefined) delete completeBookingData[key];
      });
      
      const savedBooking = await saveBooking(completeBookingData);
      navigate(`/booking-confirmation/${savedBooking.id}`);
    } catch (error) { console.error("Error saving booking:", error); }
  };
  
  const handleBookButtonClick = () => {
    if (!authUser) {
      navigate('/login', { state: { redirectTo: `/treks/${id}` } });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  // Gallery Handlers
  const handleGalleryImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryModalOpen(true);
  };
  
  const goToPreviousImage = () => {
    const images = trek?.imageUrls?.filter(url => url && typeof url === 'string') || [];
    setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };
  
  const goToNextImage = () => {
    const images = trek?.imageUrls?.filter(url => url && typeof url === 'string') || [];
    setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGalleryModalOpen) {
        if (e.key === 'ArrowLeft') goToPreviousImage();
        else if (e.key === 'ArrowRight') goToNextImage();
        else if (e.key === 'Escape') setIsGalleryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryModalOpen, trek]);

  // Loading State
  if (loading) {
    return (
      <FullScreenCenter>
        <LoadingContent>
          {/* Use the new styled component here */}
          <AnimatedLoadingIcon>
            <FaMountain />
          </AnimatedLoadingIcon>
          <LoadingText>Loading Adventure...</LoadingText>
        </LoadingContent>
      </FullScreenCenter>
    );
  }

  // Error State
  if (error && !fallbackData) {
    return (
      <FullScreenCenter>
        <ErrorBox>
          <FiAlertTriangle size={50} color="#EF4444" />
          <h2 style={{color:'white', margin: '1rem 0'}}>Trek Not Found</h2>
          <p style={{color:'#ccc'}}>We couldn't find the trail you're looking for.</p>
          <ActionButton onClick={() => navigate('/')}>Go Home</ActionButton>
        </ErrorBox>
      </FullScreenCenter>
    );
  }

  // Derived Values for Render
  const trekTitle = trek?.title || "Mountain Trek";
  const trekDescription = trek?.description || "Experience this amazing mountain trek through beautiful landscapes.";
  const trekImage = getValidImageUrl(trek?.image);
  const trekDays = trek?.days || 1;
  const trekPrice = formatPrice(trek?.price);
  const trekDifficulty = trek?.difficulty || "Moderate";
  const trekLocation = trek?.location || "Mountain Region";
  const trekSeason = trek?.season || "Year-round";
  const trekCountry = trek?.country || "Nepal";
  const trekRating = trek?.rating || 5;
  const trekCapacity = trek?.capacity || "10";
  const trekAltitude = trek?.altitude || "3,000m";
  const itinerary = trek?.itinerary || generateItinerary(trekDays, trekTitle);
  const highlights = trek?.highlights || generateHighlights(trekTitle);
  const included = trek?.included || getIncludedItems();
  const excluded = trek?.excluded || getExcludedItems();
  const organizerId = trek?.organizerId;
  const organizerName = trek?.organizerName;

  return (
    <PageWrapper>
      
      <GlobalFonts />
      
      {/* Navigation */}
      <Header 
        navScrolled={navScrolled} 
        trekTitle={trekTitle} 
        trekLocation={trekLocation} 
        trekDays={trekDays} 
        trekAltitude={trekAltitude} 
      />

      {/* Hero Section */}
      <Hero 
        trek={trek}
        trekImage={trekImage}
        trekLocation={trekLocation}
        trekCountry={trekCountry}
        trekTitle={trekTitle}
        trekDifficulty={trekDifficulty}
        trekDays={trekDays}
        trekSeason={trekSeason}
        trekDescription={trekDescription}
        onBookClick={handleBookButtonClick}
      />

      <ContentBackground>
        <Container>
          <ContentGrid>
            {/* Left Column: Main Info */}
            <MainColumn>
              <Stats 
                trekDays={trekDays}
                trekAltitude={trekAltitude}
                trekCapacity={trekCapacity}
                trekRating={trekRating}
              />

              <MeetOrganizer 
                organizerId={organizerId}
                organizerName={organizerName}
                trekCount={trek?.organizerTrekCount}
                organizerVerified={trek?.organizerVerified}
                organizerDescription={trek?.organizerDescription}
                organizerExperience={trek?.organizerExperience}
              />

              <Highlights highlights={highlights} />
              
              <Description description={trek.detailedDescription} />
              
              <BestTimeToVisit availableMonths={trek.availableMonths} />

              <Itinerary itinerary={itinerary} />

              <IncludedExcluded included={included} excluded={excluded} />

              <PhotoGallery 
                images={trek.imageUrls} 
                onImageClick={handleGalleryImageClick} 
              />

              <ReviewsSection trekId={id} />
            </MainColumn>

            {/* Right Column: Sticky Sidebar */}
            <SidebarColumn>
              <BookingCard 
                trekPrice={trekPrice}
                trekDays={trekDays}
                trekLocation={trekLocation}
                trekDifficulty={trekDifficulty}
                trekCapacity={trekCapacity}
                trekSeason={trekSeason}
                trekAltitude={trekAltitude}
                onBookClick={handleBookButtonClick}
              />

              <OrganizerSection 
                organizerId={organizerId}
                organizerName={organizerName}
                trekCount={trek?.organizerTrekCount}
                verified={trek?.organizerVerified}
                description={trek?.organizerDescription}
                experience={trek?.organizerExperience}
              />
            </SidebarColumn>
          </ContentGrid>
        </Container>
      </ContentBackground>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        trek={{ ...trek, numericPrice: getNumericPrice(trek?.price) }}
        onBookingSuccess={handleBookingSuccess}
      />

      <GalleryModal 
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        images={trek?.imageUrls}
        initialIndex={currentImageIndex}
      />
      <WhatsAppButton trekTitle={trekTitle} />
    </PageWrapper>
  );
}