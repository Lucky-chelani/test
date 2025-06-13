import React, { useEffect } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import for animations
// import route components eagerly to eliminate Suspense fallback
import Banner from './components/Banner/Banner';
import FeaturedTreks from './components/FeaturedTreks';
import CommunitySection from './components/CommunitySection';
import HowItWorks from './components/HowItWorks';
import MountainHero from './components/MountainHero';
import Footer from './components/Footer';
import Explore from './components/Explore';
import Community from './components/Community';
import Blog from './components/Blog';
import { RewardsHero, RewardsSection } from './components/Rewards';
import About from './components/About';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatRoom from './components/ChatRoom';
import TrekDetails from './components/TreksDetails';
import TrekAdmin from './components/TrekAdmin'; // Import the Trek Admin component
import SimpleAdmin from './components/SimpleAdmin'; // Import the Simple Admin component
import CommunityAdmin from './components/CommunityAdmin'; // Import the Community Admin component
import TrekCategoryAdmin from './components/TrekCategoryAdmin'; // Import the Trek Category Admin component
import BottomNavbar from './components/BottomNavbar'; // Import the new bottom navbar component
import { checkMessageCleanupDue } from './utils/messageCleanup'; // Import message cleanup utility

// Page transition wrapper component
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  useEffect(() => {
    // Check and perform message cleanup when the component mounts
    const performCleanup = async () => {
      try {
        console.log("Performing scheduled message cleanup...");
        const results = await checkMessageCleanupDue();
        console.log("Message cleanup results:", results);
      } catch (error) {
        console.error("Error during message cleanup:", error);
      }
    };
    
    performCleanup();
    
    // Set up periodic cleanup every hour
    const cleanupInterval = setInterval(performCleanup, 60 * 60 * 1000);
    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <Router>
      <div className="App">
        <BottomNavbar />
        <Routes>
          <Route path="/" element={
            <PageTransition>
              <>
                <Banner />
                <FeaturedTreks />
                <CommunitySection />
                <HowItWorks />
                <MountainHero />
                <Footer />
              </>
            </PageTransition>
          } />          <Route path="/explore" element={
            <PageTransition>
              <Explore />
            </PageTransition>
          } />
          
          <Route path="/community" element={
            <PageTransition>
              <Community />
            </PageTransition>
          } />
          
          <Route path="/chat/:roomId" element={
            <PageTransition>
              <ChatRoom />
            </PageTransition>
          } />
          
          <Route path="/blog" element={
            <PageTransition>
              <Blog />
            </PageTransition>
          } />
          
          <Route path="/rewards" element={
            <PageTransition>
              <>
                <RewardsHero />
                <RewardsSection />
              </>
            </PageTransition>
          } />          <Route path="/about" element={
            <PageTransition>
              <About />
            </PageTransition>
          } />
          
          <Route path="/profile" element={
            <PageTransition>
              <Profile />
            </PageTransition>
          } />
          
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />
          
          <Route path="/signup" element={
            <PageTransition>
              <Signup />
            </PageTransition>
          } />
          
          <Route path="/trek/:id" element={
            <PageTransition>
              <TrekDetails />
            </PageTransition>
          } />
            <Route path="/admin/treks" element={
            <PageTransition>
              <TrekAdmin />
            </PageTransition>
          } />
          
          <Route path="/admin/simple" element={
            <PageTransition>
              <SimpleAdmin />
            </PageTransition>
          } />
            <Route path="/admin/communities" element={
            <PageTransition>
              <CommunityAdmin />
            </PageTransition>
          } />
          
          <Route path="/admin/trek-categories" element={
            <PageTransition>
              <TrekCategoryAdmin />
            </PageTransition>
          } />
        </Routes>
      </div>
    </Router>
  );
}


export default App;