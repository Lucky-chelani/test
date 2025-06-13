import React from 'react';
import styles from './RewardsHero.module.css';
import mountainBg from '../../assets/images/mountain-bg.png';

export default function RewardsHero() {  return (
    <section className={styles.heroSection} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mountainBg})` }}>
      {/* Removed Navbar - using BottomNavbar from App.js */}
      <div className={styles.content}>
        <h1 className={styles.title}>Your Journey, Your Rewards</h1>
        <p className={styles.subtitle}>
          Earn rewards as you explore the world with Trovia's community-first trekking platform.
        </p>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>XP Earned by Trekkers</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>5,000+</div>
            <div className={styles.statLabel}>Badges unlocked</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>30+</div>
            <div className={styles.statLabel}>cities with Gold Members</div>
          </div>
        </div>
      </div>
    </section>
  );
}