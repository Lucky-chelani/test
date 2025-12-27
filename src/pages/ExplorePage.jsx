import React from 'react';
import Explore from '../components/Explore';
import Footer from '../components/Footer';
import './style/ExplorePage.css'; // Create this file

const ExplorePage = () => {
  return (
    <div className="explore-page-container">
      {/* "main" ensures accessible semantics and flex-growth */}
      <main className="explore-content">
        <Explore />
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;