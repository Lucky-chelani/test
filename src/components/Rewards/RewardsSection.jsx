import React from 'react';
import styles from './RewardsSection.module.css';
import mapPattern from '../../assets/images/map-pattren.png';
import birds from '../../assets/images/birds.png';
import Footer from '../Footer';

const xpCards = [
  {
    title: 'Bookings',
    desc: 'Complete a trek booking with Trovia',
    reward: '100 XP',
  },
  {
    title: 'Reviews',
    desc: 'Share your experience with a verified review',
    reward: '100 XP',
  },
  {
    title: 'Referrals',
    desc: 'Refer your friends to try the Trovia platform',
    reward: '100 XP',
  },
];

const badges = [
  { label: 'First Steps', unlocked: true },
  { label: 'Peak Climber', unlocked: true },
  { label: 'Reviewer', unlocked: true },
  { label: 'Explorer', unlocked: false },
  { label: 'Community Leader', unlocked: false },
  { label: 'Photographer', unlocked: false },
];

export default function RewardsSection() {
  return (
    <>
      <section className={styles.rewardsSection} style={{ backgroundImage: `url(${mapPattern})` }}>
        <div className={styles.xpLevelUpSection}>
          <h2>Earn XP, Level Up</h2>
          <p>Complete activities to earn more progress points and unlock exclusive rewards.</p>
          <div className={styles.xpCards}>
            {xpCards.map((card, i) => (
              <div className={styles.xpCard} key={i}>
                <div className={styles.xpCardTitle}>{card.title}</div>
                <div className={styles.xpCardDesc}>{card.desc}</div>
                <div className={styles.xpCardReward}><span>Reward</span> <b>{card.reward}</b></div>
              </div>
            ))}
          </div>
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Your Progress</span>
              <span className={styles.progressXP}>750 XP until Gold Trekker</span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '62%' }}></div>
              </div>
              <div className={styles.progressLevels}>
                <span>Bronze</span>
                <span>Silver</span>
                <span>Gold</span>
                <span>Pro</span>
              </div>
            </div>
            <div className={styles.progressDetails}>
              <span>Total XP<br /><b>1,250</b></span>
              <span>Treks Completed<br /><b>12</b></span>
              <span>Badges Earned<br /><b>3/6</b></span>
              <span>Community Rank<br /><b>#524</b></span>
            </div>
          </div>
        </div>
        <div className={styles.achievementSection}>
          <div className={styles.achievementHeader}>
            <h2>Achievement Badges</h2>
            <img src={birds} alt="Birds" className={styles.birds} />
          </div>
          <p>Collect badges as you explore new destinations and complete challenges.</p>
          <div className={styles.badgesGrid}>
            {badges.map((badge, i) => (
              <div className={badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked} key={i}>
                <div className={styles.badgeIcon}></div>
                <div className={styles.badgeLabel}>{badge.label}</div>
                <div className={styles.badgeStatus}>{badge.unlocked ? 'Unlocked' : 'Locked'}</div>
              </div>
            ))}
          </div>
          <button className={styles.unlockBtn}>Unlock Your Next Badge</button>
        </div>
      </section>
      {/* Membership Levels Section */}
      <section className={styles.membershipSection}>
        <h2 className={styles.membershipTitle}>Membership Levels</h2>
        <p className={styles.membershipSubtitle}>Earn XP to unlock higher membership tiers and exclusive benefits</p>
        <div className={styles.membershipCards}>
          <div className={styles.membershipCard}>
            <div className={styles.membershipIcon + ' ' + styles.bronze}></div>
            <div className={styles.membershipLevel}>Bronze</div>
            <ul>
              <li>Access to community forum</li>
              <li>Basic email, web, and app support</li>
              <li>Standard customer support</li>
            </ul>
          </div>
          <div className={styles.membershipCard}>
            <div className={styles.membershipIcon + ' ' + styles.silver}></div>
            <div className={styles.membershipLevel}>Silver</div>
            <ul>
              <li>All Bronze benefits</li>
              <li>5% discount on all bookings</li>
              <li>Priority customer support</li>
              <li>Monthly newsletter</li>
            </ul>
          </div>
          <div className={styles.membershipCard}>
            <div className={styles.membershipIcon + ' ' + styles.gold}></div>
            <div className={styles.membershipLevel}>Gold</div>
            <ul>
              <li>All Silver benefits</li>
              <li>10% discount on all bookings</li>
              <li>Early access to new treks</li>
              <li>Special Gold-tier events</li>
            </ul>
          </div>
          <div className={styles.membershipCard}>
            <div className={styles.membershipIcon + ' ' + styles.pro}></div>
            <div className={styles.membershipLevel}>Pro Trekker</div>
            <ul>
              <li>All Gold benefits</li>
              <li>15% discount on all bookings</li>
              <li>VIP event invites</li>
              <li>1-on-1 trek planning</li>
              <li>Exclusive Pro badge</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Leaderboard Section */}
      <section className={styles.leaderboardSection}>
        <div className={styles.leaderboardContent}>
          <div>
            <h3>See How You Rank</h3>
            <p>Compare your progress with other trekkers in the Trovia community. Climb yourself to the top of the leaderboard and earn exclusive rewards.</p>
          </div>
          <button className={styles.leaderboardBtn}>View Leaderboard</button>
        </div>
      </section>
      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about the Trovia rewards program.</p>
        </div>
        <div className={styles.faqList}>
          <FAQItem question="How do I earn XP?" answer="You can earn XP by booking treks, writing reviews, referring friends, participating in community events, and completing challenges. Different activities award different amounts of XP." />
          <FAQItem question="How long do rewards last?" answer="Your XP and membership tier status remain active as long as you complete at least one trek booking per year. If your account becomes inactive, you'll maintain your current XP but won't progress to higher tiers." />
          <FAQItem question="Can I transfer my XP to another user?" answer="XP cannot be transferred between accounts as it represents your personal journey and achievements within the Trovia community." />
          <FAQItem question="How do I redeem my rewards?" answer="Discounts are automatically applied at checkout based on your membership tier. For special rewards and event access, you'll receive notifications in your account dashboard." />
        </div>
      </section>
      <Footer />
    </>
  );
}

// FAQItem component for collapsible FAQ
function FAQItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={styles.faqItem + (open ? ' ' + styles.open : '')}>
      <button className={styles.faqQuestion} onClick={() => setOpen(o => !o)}>
        {question}
        <span className={styles.faqToggle}>{open ? '-' : '+'}</span>
      </button>
      {open && <div className={styles.faqAnswer}>{answer}</div>}
    </div>
  );
} 