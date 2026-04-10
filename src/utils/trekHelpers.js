export function generateItinerary(days, title) {
  const activityPool = [
    { act: "Scenic hike through alpine meadows", duration: "5–6 hrs", elevation: "+600m" },
    { act: "Trek across suspension bridges", duration: "4–5 hrs", elevation: "+400m" },
    { act: "Reach panoramic viewpoints", duration: "6–7 hrs", elevation: "+800m" },
    { act: "Explore ancient mountain villages", duration: "3–4 hrs", elevation: "+200m" },
    { act: "Cross glacial streams and ridgelines", duration: "5–6 hrs", elevation: "+500m" },
    { act: "Camp beside crystal alpine lakes", duration: "4 hrs", elevation: "+300m" },
    { act: "Traverse dense rhododendron forests", duration: "4–5 hrs", elevation: "+350m" },
    { act: "Final descent through valley floors", duration: "4–5 hrs", elevation: "-800m" },
  ];
  const dayTitles = [
    `Arrival & acclimatisation`,
    `Into the high country`,
    `Ridge traverse`,
    `Valley crossing`,
    `High camp push`,
    `Summit approach`,
    `Rest & exploration day`,
    `Descent begins`,
    `Return to civilization`,
    `Departure day`,
  ];
  return Array.from({ length: days }, (_, i) => {
    const a = activityPool[i % activityPool.length];
    return {
      day: i + 1,
      title: dayTitles[i] || `Day ${i + 1} — ${title}`,
      description: a.act + `. Today's journey takes you through breathtaking scenery with opportunities for wildlife spotting and photography.`,
      duration: a.duration,
      elevation: a.elevation,
    };
  });
}

export function generateHighlights(title) {
  return [
    `Stunning panoramic views of ${title} peaks`,
    "Diverse alpine flora and rare wildlife",
    "Expert certified mountain guides",
    "Comfortable mountain lodges & camps",
    "Cultural immersion in local villages",
    "Authentic Himalayan cuisine",
    "Unlimited photography opportunities",
    "Small group, personalised experience",
  ];
}

export function getIncluded() {
  return [
    "Professional mountain guide",
    "All accommodation during trek",
    "Meals as per itinerary (B+L+D)",
    "All transportation during trek",
    "Entry fees & permits",
    "Safety & first-aid equipment",
    "Emergency support & comms",
    "Trekking poles & rain gear",
  ];
}

export function getExcluded() {
  return ["International / domestic flights", "Personal travel insurance", "Personal expenses & tips", "Alcoholic beverages", "Personal trekking gear", "Emergency evacuation costs"];
}

export function generateReviews(title) {
  const pool = [
    {
      name: "Aryan S.",
      text: `${title} was the most breathtaking experience of my life. Every day brought new landscapes that left me speechless.`,
    },
    {
      name: "Priya M.",
      text: `The guides were incredibly knowledgeable and kept us safe throughout. Organisation was flawless.`,
    },
    {
      name: "James T.",
      text: `Challenging at moments but the views more than make up for it. Would highly recommend to any adventure lover.`,
    },
    {
      name: "Simran K.",
      text: `The food was surprisingly amazing at altitude! Loved the camping under the stars.`,
    },
    {
      name: "David L.",
      text: `Small group made it feel personal. The team genuinely cared about our experience. Unforgettable.`,
    },
  ];
  const dates = ["2 weeks ago", "1 month ago", "3 months ago", "5 months ago", "2 months ago"];
  const ratings = [5, 5, 4, 5, 4];
  return pool.map((r, i) => ({
    id: `r-${i}`,
    author: r.name,
    date: dates[i],
    rating: ratings[i],
    text: r.text,
  }));
}

export function formatPrice(price) {
  if (!price) return "₹0";
  if (typeof price === "number") return `₹${price.toLocaleString()}`;
  if (typeof price === "string") {
    const clean = price.replace(/^[$₹]/, "");
    return `₹${clean}`;
  }
  return "₹0";
}

export function getNumericPrice(price) {
  if (!price) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const n = parseFloat(price.replace(/^[$₹]/, "").replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}