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
import OrganizerSignup from './components/OrganizerSignup'; // Import OrganizerSignup component
import ChatRoom from './components/ChatRoom.improved';
import TrekDetails from './components/TreksDetails';
import TrekAdmin from './components/TrekAdmin'; // Import the Trek Admin component
import SimpleAdmin from './components/SimpleAdmin'; // Import the Simple Admin component
import CommunityAdmin from './components/CommunityAdmin'; // Import the Community Admin component
import TrekCategoryAdmin from './components/TrekCategoryAdmin'; // Import the Trek Category Admin component
import BottomNavbar from './components/BottomNavbar'; // Import the new bottom navbar component
import { checkMessageCleanupDue } from './utils/messageCleanup'; // Import message cleanup utility
import TermsPage from './pages/TermsPage'; // Import TermsPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Import PrivacyPolicyPage
import CookiesPolicyPage from './pages/CookiesPolicyPage'; // Import CookiesPolicyPage
import AccessibilityPage from './pages/AccessibilityPage'; // Import AccessibilityPage
import { SearchProvider } from './context/SearchContext'; // Import SearchProvider
import SearchResultsPage from './pages/SearchResultsPage'; // Import SearchResultsPage
import PaymentTester from './components/PaymentTester'; // Import PaymentTester component
import MockPaymentTester from './components/MockPaymentTester'; // Import MockPaymentTester component
import RazorpayDebugger from './components/RazorpayDebugger'; // Import RazorpayDebugger component
import UserAdmin from './components/UserAdmin'; // Import UserAdmin component
import CouponAdmin from './components/CouponAdmin'; // Import CouponAdmin component
import OrganizerTreks from './components/OrganizerTreks'; // Import OrganizerTreks component
import AccessControl from './components/AccessControl'; // Import AccessControl component
import OrganizerDashboard from './components/OrganizerDashboard'; // Import OrganizerDashboard
import OrganizerTrekLogin from './components/OrganizerTrekLogin'; // Import OrganizerTrekLogin component
import OrganizerAddTrek from './components/OrganizerAddTrek'; // Import OrganizerAddTrek component
import OrganizerEditTrek from './components/OrganizerEditTrek'; // Import OrganizerEditTrek component
import OrganizerProfile from './components/OrganizerProfile'; // Import OrganizerProfile component
import EditProfile from './components/EditProfile'; // Import EditProfile component
import BookingConfirmation from './components/BookingConfirmation'; // Import BookingConfirmation component

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
      <SearchProvider>
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
          
          <Route path="/edit-profile" element={
            <PageTransition>
              <EditProfile />
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
          
          <Route path="/organizer-signup" element={
            <PageTransition>
              <OrganizerSignup />
            </PageTransition>
          } />
          
          <Route path="/trek/:id" element={
            <PageTransition>
              <TrekDetails />
            </PageTransition>
          } />          <Route path="/admin/treks" element={
            <PageTransition>
              <AccessControl requiredRole="admin">
                <TrekAdmin />
              </AccessControl>
            </PageTransition>
          } />
          
          <Route path="/admin/simple" element={
            <PageTransition>
              <AccessControl requiredRole="admin">
                <SimpleAdmin />
              </AccessControl>
            </PageTransition>
          } />
            <Route path="/admin/communities" element={
            <PageTransition>
              <AccessControl requiredRole="admin">
                <CommunityAdmin />
              </AccessControl>
            </PageTransition>
          } />
            <Route path="/admin/trek-categories" element={
            <PageTransition>
              <AccessControl requiredRole="admin">
                <TrekCategoryAdmin />
              </AccessControl>
            </PageTransition>
          } />
          
          <Route path="/admin/coupons" element={
            <PageTransition>
              <AccessControl requiredRole="admin">
                <CouponAdmin />
              </AccessControl>
            </PageTransition>
          } />
          
          <Route path="/terms" element={
            <PageTransition>
              <TermsPage />
            </PageTransition>
          } />          <Route path="/privacy" element={
            <PageTransition>
              <PrivacyPolicyPage />
            </PageTransition>
          } />
          <Route path="/search-results" element={
            <PageTransition>
              <SearchResultsPage />
            </PageTransition>
          } />
          <Route path="/cookies" element={
            <PageTransition>
              <CookiesPolicyPage />
            </PageTransition>
          } />          <Route path="/accessibility" element={
            <PageTransition>
              <AccessibilityPage />
            </PageTransition>
          } />          <Route path="/payment-test" element={
            <PageTransition>
              <PaymentTester />
            </PageTransition>
          } />
          <Route path="/mock-payment" element={
            <PageTransition>
              <MockPaymentTester />
            </PageTransition>
          } />
          <Route path="/razorpay-debugger" element={
            <PageTransition>
              <RazorpayDebugger />
            </PageTransition>
          } />          <Route path="/admin/users" element={
            <PageTransition>
              <AccessControl requiredRole="admin">
                <UserAdmin />
              </AccessControl>
            </PageTransition>
          } />
          <Route path="/organizer/treks" element={
            <PageTransition>
              <AccessControl requiredRole="organizer">
                <OrganizerTreks />
              </AccessControl>
            </PageTransition>
          } />
          <Route path="/organizer/dashboard" element={
            <PageTransition>
              <AccessControl requiredRole="organizer">
                <OrganizerDashboard />
              </AccessControl>
            </PageTransition>
          } />
          <Route path="/access-control" element={
            <PageTransition>
              <AccessControl />
            </PageTransition>
          } />          {/* Consolidated organizer login route */}
          <Route path="/organizer-trek-login" element={
            <PageTransition>
              <OrganizerTrekLogin />
            </PageTransition>
          } />
          <Route path="/organizer-dashboard" element={
            <PageTransition>
              <AccessControl requiredRole="organizer">
                <OrganizerDashboard />
              </AccessControl>
            </PageTransition>
          } />
          <Route path="/organizer/add-trek" element={
            <PageTransition>
              <AccessControl requiredRole="organizer">
                <OrganizerAddTrek />
              </AccessControl>
            </PageTransition>
          } />
          <Route path="/organizer/edit-trek/:id" element={
            <PageTransition>
              <AccessControl requiredRole="organizer">
                <OrganizerEditTrek />
              </AccessControl>
            </PageTransition>
          } />
          <Route path="/organizer/:id" element={
            <PageTransition>
              <OrganizerProfile />
            </PageTransition>
          } />
          <Route path="/booking-confirmation/:bookingId" element={
            <PageTransition>
              <BookingConfirmation />
            </PageTransition>
          } />
        </Routes>
      </div>
      </SearchProvider>
    </Router>
  );
}


export default App;