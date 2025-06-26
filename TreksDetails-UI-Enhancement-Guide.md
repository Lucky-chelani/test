# TreksDetails UI Enhancement Guide

This guide provides instructions for enhancing the UI of the TreksDetails component while preserving all functionality.

## Getting Started

1. We've already created a CSS file at `src/components/TrekDetailsEnhanced.css`
2. We've imported this file in `TreksDetails.jsx`

## How to Apply the UI Enhancements

Add the following CSS classes to the corresponding components in TreksDetails.jsx.

### 1. Header Enhancement

Find the `<ModernHeader>` component in the JSX and add the `className` attribute:
```jsx
<ModernHeader isScrolled={navScrolled} className="enhanced-header">
```

### 2. Booking Card Enhancement

Find the `<BookingCard>` component and add:
```jsx
<BookingCard className="booking-card">
```

### 3. Price Enhancement

Find the `<Price>` component and add:
```jsx
<Price className="price-display">
```

### 4. Stats Cards Enhancement

For each `<StatCard>` component, add appropriate classes:
```jsx
<StatCard color="var(--primary-color)" colorRgb="90, 112, 183" className="stat-card primary">
  <StatIcon color="var(--primary-color)" colorRgb="90, 112, 183" className="stat-icon primary">
    <FiClock />
  </StatIcon>
  {/* ... */}
</StatCard>
<StatCard color="var(--secondary-color)" colorRgb="66, 160, 75" className="stat-card secondary">
  <StatIcon color="var(--secondary-color)" colorRgb="66, 160, 75" className="stat-icon secondary">
    <FaMountain />
  </StatIcon>
  {/* ... */}
</StatCard>
<StatCard color="#F8903F" colorRgb="248, 144, 63" className="stat-card orange">
  <StatIcon color="#F8903F" colorRgb="248, 144, 63" className="stat-icon orange">
    <FiUsers />
  </StatIcon>
  {/* ... */}
</StatCard>
<StatCard color="#E879F9" colorRgb="232, 121, 249" className="stat-card purple">
  <StatIcon color="#E879F9" colorRgb="232, 121, 249" className="stat-icon purple">
    <FiStar />
  </StatIcon>
  {/* ... */}
</StatCard>
```

### 5. Section Enhancements

For each `<Section>` component, add:
```jsx
<Section className="content-section">
```

### 6. Organizer Card Enhancement

For the OrganizerCard section:
```jsx
<OrganizerCard 
  name={organizerName || "Trek Organizer"}
  id={organizerId}
  trekCount={trek?.organizerTrekCount || 1}
  verified={organizerVerified}
  description={organizerDescription}
  experience={organizerExperience}
  inTrekDetails={true}
  className="organizer-card"
/>
```

### 7. Hero Enhancements

For the hero content:
```jsx
<HeroContentWrapper className="hero-content">
```

For the hero badges:
```jsx
<HeroBadge variant="primary" index={0} className="hero-badge">
```

### 8. Button Enhancements

For primary buttons:
```jsx
<HeroPrimaryBtn onClick={handleBookButtonClick} className="enhanced-button">
```

For the book now button:
```jsx
<BookNowBtn onClick={handleBookButtonClick} className="enhanced-button">
```

### 9. Gallery Enhancements

For gallery images:
```jsx
<GalleryImage key={idx} src={getValidImageUrl(img)} className="gallery-image" />
```

### 10. Review Card Enhancements

For review cards:
```jsx
<ReviewCard key={review.id} className="review-card">
```

For rating stars:
```jsx
<BsStarFill
  key={i}
  className="rating-star"
  style={{
    color: i < review.rating ? '#FFB800' : '#ddd',
    fontSize: '1rem'
  }}
/>
```

## Tips for Troubleshooting

- If you encounter styling conflicts, try using `!important` in the CSS
- If a component doesn't accept className prop, wrap it in a div with the class

## Common Issues

If your build fails with "duplicate variable" errors, check that you don't have multiple CSS imports.

## Testing Your Changes

1. Start the React app: `npm start`
2. Navigate to a Trek details page
3. Check that the UI updates appear and functionality works
