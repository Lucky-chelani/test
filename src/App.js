import React from 'react';
import './App.css';
import Banner from './components/Banner/Banner';
import FeaturedTreks from './components/FeaturedTreks';
import CommunitySection from './components/CommunitySection';
import HowItWorks from './components/HowItWorks';
import MountainHero from './components/MountainHero';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './components/Explore';
import Community from './components/Community';
import Blog from './components/Blog';
import { RewardsHero, RewardsSection } from './components/Rewards';
import About from './components/About';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatRoom from './components/ChatRoom';
import TrekDetails from './components/TreksDetails'; // Import the new component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <FeaturedTreks />
              <CommunitySection />
              <HowItWorks />
              <MountainHero />
              <Footer />
            </>
          } />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community" element={<Community />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} /> {/* Add the new route here */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/rewards" element={
            <>
              <RewardsHero />
              <RewardsSection />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
            <Route path="/trek/:id" element={<TrekDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;