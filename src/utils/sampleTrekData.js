// Sample trek data for the Trek Details page
import trek1 from "../assets/images/photo1.jpeg";
import trek2 from "../assets/images/photo2.jpeg";
import trek3 from "../assets/images/photo3.jpeg";

export const sampleTrekData = {
  id: "bhrigu-lake",
  title: "Bhrigu Lake Trek",
  image: trek1,
  country: "India",
  location: "Himachal Pradesh",
  difficulty: "Moderate",
  rating: 4.8,
  reviewCount: 124,
  price: "₹12,500",
  duration: 6,
  maxAltitude: "14,100 ft",
  distance: "26 km",
  groupSize: "8-12",
  season: "May-October",
  startPoint: "Manali, Himachal Pradesh",
  endPoint: "Manali, Himachal Pradesh",
  description: `
    <p>The Bhrigu Lake Trek is one of the most picturesque and accessible high-altitude alpine lake treks in Himachal Pradesh. Named after the sage Bhrigu, this pristine lake sits at an elevation of 14,100 feet in the upper Kullu Valley.</p>
    
    <p>What makes this trek special is that it offers stunning views of snow-capped mountains, lush meadows, and dense forests in a relatively short duration, making it perfect for beginners and experienced trekkers alike. The trek starts from Gulaba, just 10 km from Manali, and takes you through beautiful oak and cedar forests before opening up to vast alpine meadows known locally as "thachi."</p>
    
    <p>The lake itself is believed to have religious significance as Maharishi Bhrigu is said to have meditated beside these waters. Depending on the season, you might find the lake in different avatars - from a frozen ice disc in early summer to a pristine blue lake surrounded by wildflowers in late summer.</p>
  `,
  highlights: [
    "Alpine lake at 14,100 feet with stunning views",
    "Beautiful meadows with seasonal wildflowers",
    "Panoramic Himalayan vistas including Hanuman Tibba",
    "Relatively short trek ideal for beginners",
    "Scenic forests and streams along the trail",
    "Camping under starlit skies"
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrive at Manali",
      description: "Arrive at Manali and check into your hotel. There will be an orientation session in the evening where you'll meet your trek leader and fellow trekkers. You'll get a briefing about the trek, be given a packing checklist, and have all your questions answered.",
      activities: [
        "Arrive in Manali (6,725 ft)",
        "Check into hotel and rest",
        "Evening orientation with trek leader",
        "Equipment and fitness check",
        "Overnight stay in Manali"
      ]
    },
    {
      day: 2,
      title: "Manali to Gulaba to Jonker Thatch",
      description: "After breakfast, we'll drive to Gulaba (around 10 km from Manali). From here, our trek begins as we hike through dense oak and pine forests. The trail gradually ascends to reach Jonker Thatch, a beautiful meadow where we'll set up camp for the night.",
      activities: [
        "Drive from Manali to Gulaba (30 minutes)",
        "Begin trek from Gulaba (10,500 ft)",
        "Trek through oak and pine forests",
        "Reach Jonker Thatch (11,200 ft) - 4 hours trek",
        "Set up camp and evening tea",
        "Dinner and overnight in tents"
      ]
    },
    {
      day: 3,
      title: "Jonker Thatch to Bhrigu Lake and back",
      description: "Today is the most challenging and rewarding day. We start early after breakfast and trek up to Bhrigu Lake. The trail passes through stunning meadows and rocky terrain. Upon reaching the lake, you'll have time to explore and soak in the breathtaking views before heading back to Jonker Thatch.",
      activities: [
        "Early breakfast and start by 7 AM",
        "Trek from Jonker Thatch to Bhrigu Lake (14,100 ft)",
        "Steep ascent through meadows and rocky patches",
        "Reach Bhrigu Lake by noon (5-6 hours trek)",
        "Spend time at the lake, photography, lunch",
        "Return to Jonker Thatch camp (3-4 hours)",
        "Evening tea, dinner and overnight in tents"
      ]
    },
    {
      day: 4,
      title: "Jonker Thatch to Gulaba and drive to Manali",
      description: "After breakfast, we'll trek back to Gulaba following the same route. The descent is easier and takes less time. From Gulaba, we'll drive back to Manali where the trek officially ends.",
      activities: [
        "Breakfast and camp wrap-up",
        "Trek down from Jonker Thatch to Gulaba",
        "Mostly downhill trek (3 hours)",
        "Drive back to Manali (30 minutes)",
        "Trek completion certificates",
        "Farewell lunch with the team"
      ]
    }
  ],
  reviews: [
    {
      name: "Priya Sharma",
      avatar: trek2,
      date: "August 15, 2023",
      rating: 5,
      content: "One of the best treks I've done in Himachal! The meadows before Bhrigu Lake were carpeted with wildflowers when we went in July. The lake itself was partially frozen and absolutely magical. Our guide Tenzing was extremely knowledgeable and made sure everyone was comfortable despite the altitude. Highly recommend!"
    },
    {
      name: "Rahul Verma",
      avatar: trek3,
      date: "June 22, 2023",
      rating: 4,
      content: "Great trek for beginners! The views are spectacular and worth every bit of effort. The lake was completely frozen when we visited in early June which was a unique experience. The camping arrangements were comfortable and the food was surprisingly good considering we were in the mountains. Only suggestion would be to provide better information about dealing with AMS beforehand."
    }
  ],
  ratingBreakdown: {
    5: 84,
    4: 26,
    3: 10,
    2: 3,
    1: 1
  }
};
