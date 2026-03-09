// data.js — Static data for Doon Explorer
// Exported as window globals for use across modules

window.PLACES_DATA = [
  {
    id: 'robbers-cave',
    name: "Robber's Cave",
    subtitle: "Guchhupani — Natural cave & river",
    emoji: '🕳️',
    category: 'nature',
    rating: 4.4,
    entryFee: '₹30 per person',
    distance: '8 km from Clock Tower',
    openHour: 7, closeHour: 18,
    peakHour: 11, peakCrowd: 82, avgCrowd: 48,
    lat: 30.3835, lng: 78.0090,
    tags: ['Cave', 'River', 'Nature', 'Photography'],
    desc: "A natural cave formation with a seasonal stream flowing through it, locally known as Guchhupani. The cave stretches for about 600 meters and water mysteriously disappears and reappears inside. It's a favourite among hikers and nature lovers.",
    tips: "Visit early morning (7–9 AM) to enjoy cool temperatures and fewer crowds. Carry water-proof footwear as you'll wade through shallow water. The cave gets very slippery after rains — take extra care.",
    photos: [
      'https://images.unsplash.com/photo-1563299796-17ddb32e5e0e?w=900&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80'
    ],
    history: {
      established: 'Discovered in 1900s',
      significance: "Robber's Cave (Guchhupani) is a natural limestone cave formed over thousands of years. Legend says it was once a hideout for robbers, hence the name. The stream that runs through it — disappearing underground and reappearing — has fascinated scientists and tourists alike.",
      facts: [
        "The cave stream runs for about 600 meters underground",
        "Water temperature inside stays around 14°C even in summer",
        "The cave was used as a hideout by bandits in the pre-independence era",
        "A perfect microhabitat for rare fern species found inside the cave"
      ],
      bestSeason: 'October to March',
      geology: 'Limestone cave, Himalayan foothills'
    }
  },
  {
    id: 'sahastradhara',
    name: 'Sahastradhara',
    subtitle: 'Sulphur springs & waterfalls',
    emoji: '💧',
    category: 'waterfall',
    rating: 4.2,
    entryFee: '₹25 per person',
    distance: '11 km from Railway Station',
    openHour: 7, closeHour: 19,
    peakHour: 12, peakCrowd: 78, avgCrowd: 52,
    lat: 30.4033, lng: 78.1148,
    tags: ['Waterfall', 'Sulphur', 'Scenic', 'Family'],
    desc: "Meaning 'thousand-fold spring', Sahastradhara is famous for its sulphur water springs believed to have medicinal properties. The place features multiple waterfalls cascading down limestone rocks, forming natural pools.",
    tips: "The sulphur springs are best enjoyed in cooler months. Avoid weekends as it gets extremely crowded. There's a ropeway offering scenic views — try it early morning. Bring a change of clothes if you plan to dip in the pools.",
    photos: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=900&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80'
    ],
    history: {
      established: 'Ancient — mentioned in local scriptures',
      significance: 'Sahastradhara has been a pilgrimage and therapeutic site for centuries. The sulphur content of water is known for treating skin ailments. It was once accessible only via forest trails before development in the 1990s.',
      facts: [
        "Sulphur concentration in water measured at 15–20 ppm",
        "The ropeway spans 350 meters across the valley",
        "Average 5000+ visitors on peak weekend days",
        "Water temperature stays at 18°C year round"
      ],
      bestSeason: 'September to February',
      geology: 'Limestone terraces, sulphur springs'
    }
  },
  {
    id: 'tapkeshwar',
    name: 'Tapkeshwar Temple',
    subtitle: 'Ancient Shiva cave temple',
    emoji: '🛕',
    category: 'temple',
    rating: 4.6,
    entryFee: 'Free',
    distance: '5.5 km from City Centre',
    openHour: 5, closeHour: 22,
    peakHour: 8, peakCrowd: 75, avgCrowd: 45,
    lat: 30.3456, lng: 78.0134,
    tags: ['Temple', 'Cave', 'Shiva', 'Pilgrimage'],
    desc: "Tapkeshwar is an ancient cave temple dedicated to Lord Shiva, unique in that sulphurous water drips naturally onto the Shivalinga from the cave ceiling — hence the name 'tapkana' (to drip). One of Dehradun's most sacred spots.",
    tips: "Best visited during Mahashivratri when the temple is elaborately decorated. Early mornings (5–7 AM) offer a serene spiritual experience before crowds arrive. Dress modestly and remove footwear at the entrance. The river near the temple is clean for ritual bathing.",
    photos: [
      'https://images.unsplash.com/photo-1591621568166-62f85b064ecb?w=900&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80'
    ],
    history: {
      established: 'Over 300 years old',
      significance: 'Tapkeshwar Mahadev is believed to be more than 300 years old. The self-formed Shivalinga receives constant natural drips of sulphurous spring water, which devotees believe is the divine offering of Ganga. The temple gained fame during the Gurkha rule of Dehradun.',
      facts: [
        "The dripping sulphur spring has flowed uninterrupted for centuries",
        "A famous Mahashivratri fair draws over 50,000 pilgrims annually",
        "The temple is built inside a naturally formed cave on the Tons river bank",
        "Ashwatthama from Mahabharata is said to have worshipped here"
      ],
      bestSeason: 'October to March; Mahashivratri',
      geology: 'Cave temple in limestone cliffs'
    }
  },
  {
    id: 'malsi-deer-park',
    name: 'Malsi Deer Park',
    subtitle: 'Wildlife sanctuary & zoo',
    emoji: '🦌',
    category: 'wildlife',
    rating: 4.1,
    entryFee: '₹50 adults, ₹20 children',
    distance: '10 km from ISBT',
    openHour: 8, closeHour: 17,
    peakHour: 11, peakCrowd: 65, avgCrowd: 42,
    lat: 30.4098, lng: 77.9756,
    tags: ['Wildlife', 'Deer', 'Zoo', 'Family', 'Kids'],
    desc: "A small but well-maintained deer park and mini zoo at the base of the Mussoorie Hills. Home to spotted deer, two-horned deer, tigers, leopards, and various bird species. Perfect for families with children.",
    tips: "Visit at 8 AM when the park opens — animals are most active in early morning. Feeding animals is strictly prohibited. Photography of tigers and leopards is possible from safe viewing platforms. Weekdays are significantly less crowded.",
    photos: [
      'https://images.unsplash.com/photo-1548366086-7f1b76106622?w=900&q=80',
      'https://images.unsplash.com/photo-1580612846813-54fe41476c09?w=900&q=80'
    ],
    history: {
      established: 'Established 1976',
      significance: 'Malsi Deer Park was established in 1976 as a conservation and education centre. The 25-acre park serves as a breeding programme for spotted deer and provides one of the few places near Dehradun where people can observe Himalayan wildlife up close.',
      facts: [
        "Houses over 50 spotted deer and various Himalayan species",
        "The park covers 25 acres at the base of the Shivalik hills",
        "Used as a breeding and education centre since 1976",
        "Connected to the Rajaji National Park corridor"
      ],
      bestSeason: 'October to March',
      geology: 'Shivalik foothills, mixed deciduous forest'
    }
  },
  {
    id: 'paltan-bazaar',
    name: 'Paltan Bazaar',
    subtitle: 'Main market & shopping street',
    emoji: '🛍️',
    category: 'market',
    rating: 4.3,
    entryFee: 'Free',
    distance: '0.5 km from Railway Station',
    openHour: 9, closeHour: 22,
    peakHour: 17, peakCrowd: 90, avgCrowd: 65,
    lat: 30.3224, lng: 78.0336,
    tags: ['Shopping', 'Market', 'Street Food', 'Souvenirs'],
    desc: "The heart of Dehradun's commercial life. Paltan Bazaar is a bustling market near the railway station with everything from local handicrafts and Basmati rice to designer clothes, electronics, and street food stalls.",
    tips: "Best visited in the evening for street food culture (chaat, momos, local sweets). Avoid Saturday evenings — extremely crowded. Bargain for 20–30% off at non-fixed-price shops. Try 'Ellora's' for the famous local baklawa and bread.",
    photos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
      'https://images.unsplash.com/photo-1573831547498-b5df19b03e14?w=900&q=80'
    ],
    history: {
      established: 'Developed in early 1900s',
      significance: 'Paltan Bazaar developed around the British cantonment area in the early 20th century. The name "Paltan" derives from the military platoons stationed nearby. It became the commercial heart of Dehradun after independence and remains the most visited shopping district.',
      facts: [
        "Over 1,000 shops spread across 2 km of main road",
        "Famous for Dehradun's signature basmati rice, available in specialty stores",
        "Home to some of the oldest sweet shops dating to 1940s",
        "Street food lane is among the top 10 in Uttarakhand"
      ],
      bestSeason: 'Year-round; best in October-March',
      geology: 'Urban market, Doon Valley'
    }
  },
  {
    id: 'fri',
    name: 'Forest Research Institute',
    subtitle: 'UNESCO heritage campus & museum',
    emoji: '🏛️',
    category: 'heritage',
    rating: 4.7,
    entryFee: '₹40 adults, ₹10 children',
    distance: '5 km from City Centre',
    openHour: 9, closeHour: 17,
    peakHour: 11, peakCrowd: 70, avgCrowd: 48,
    lat: 30.3410, lng: 77.9962,
    tags: ['Heritage', 'Architecture', 'Museum', 'Botanical'],
    desc: "A stunning example of colonial architecture, the Forest Research Institute (FRI) is a UNESCO World Heritage-listed campus spread across 450 hectares. It houses 6 museums covering forest ecology, timber, pathology, and social forestry.",
    tips: "The campus itself is as impressive as the museum — take time to stroll through the Greco-Roman colonnades and gardens. Photography is allowed throughout. Guided tours available for ₹100 extra. Closed on government holidays.",
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
      'https://images.unsplash.com/photo-1573655349936-de5b7e9aadf0?w=900&q=80'
    ],
    history: {
      established: 'Built 1929',
      significance: 'The FRI was established in 1906 and shifted to its current imposing building in 1929. Designed in Greco-Roman colonial style, it is considered one of the finest examples of colonial architecture in India. The institute has contributed extensively to forest research globally.',
      facts: [
        "The building covers 10,000 square meters in Greco-Roman style",
        "Campus spans 450 hectares including research forests",
        "6 specialized museums including unique timber specimens",
        "Contributed to developing the Van (Forest) policy of independent India"
      ],
      bestSeason: 'October to April',
      geology: 'Doon Valley plain, landscaped colonial campus'
    }
  },
  {
    id: 'mindrolling',
    name: 'Mindrolling Monastery',
    subtitle: 'Tibetan Buddhist monastery & stupa',
    emoji: '☸️',
    category: 'heritage',
    rating: 4.5,
    entryFee: 'Free',
    distance: '5 km from ISBT',
    openHour: 8, closeHour: 19,
    peakHour: 11, peakCrowd: 60, avgCrowd: 38,
    lat: 30.2980, lng: 78.0469,
    tags: ['Buddhist', 'Monastery', 'Stupa', 'Peaceful'],
    desc: "One of the largest Buddhist centres in India, Mindrolling Monastery features the Great Stupa of Enlightenment, soaring 185 feet high. The monastery was established by Tibetan refugees and is now a peaceful complex of meditation halls, temples, and gardens.",
    tips: "Silence is expected inside the meditation halls. Photography of the stupa exterior is fine. Visit around 6 PM for the evening prayer ceremony — a serene and unmissable experience. The garden and stupa are beautifully lit at night.",
    photos: [
      'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?w=900&q=80',
      'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=900&q=80'
    ],
    history: {
      established: 'Founded 1965',
      significance: 'Mindrolling Monastery was re-established in India in 1965 after the original monastery in Tibet (founded 1676) was destroyed during the Cultural Revolution. The Great Stupa, completed in 2002, is among the tallest stupas in Asia and contains important relics.',
      facts: [
        "The Great Stupa stands 185 feet tall and took 8 years to build",
        "Houses over 200 monks and nuns at any given time",
        "Original monastery in Tibet was founded in 1676",
        "The complex includes a school for traditional Buddhist studies"
      ],
      bestSeason: 'Year-round; Tibetan New Year special',
      geology: 'Doon Valley plains, established gardens'
    }
  },
  {
    id: 'lacchiwala',
    name: 'Lacchiwala Nature Park',
    subtitle: 'Forest park & river picnic spot',
    emoji: '🌲',
    category: 'nature',
    rating: 4.0,
    entryFee: '₹30 per person',
    distance: '22 km from City Centre',
    openHour: 7, closeHour: 18,
    peakHour: 12, peakCrowd: 55, avgCrowd: 35,
    lat: 30.2087, lng: 78.0912,
    tags: ['Forest', 'Picnic', 'River', 'Family'],
    desc: "A beautiful forested picnic spot along the Song river. Lacchiwala features swimming pools fed by the river, dense sal forest, and peaceful nature trails. Popular with families and nature lovers looking for a quiet day out.",
    tips: "The natural swimming pools are open from April to September. Bring your own food and water — limited vendors nearby. The forest trail (3 km loop) is excellent for birdwatching. Go on weekdays — weekends get packed with Dehradun families.",
    photos: [
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=900&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80'
    ],
    history: {
      established: 'Developed 1980s',
      significance: 'Lacchiwala was developed as a recreational forest park in the 1980s. It sits adjacent to the Rajaji National Park buffer zone and is one of the few places near Dehradun with natural forest pools fed by the Song river.',
      facts: [
        "The Song river feeds natural swimming pools in the park",
        "Part of the Rajaji National Park buffer zone",
        "Home to over 80 species of birds, including kingfishers",
        "Sal forest here is over 70 years old"
      ],
      bestSeason: 'April to September for swimming; Oct–Feb for nature walks',
      geology: 'Doon Valley floodplain, sal forest'
    }
  }
];

// ── Crowd data model ──────────────────────────────────────────
// Returns hourly crowd % array [6AM to 11PM], 18 values
window.getCrowdData = function(placeId, weather) {
  const base = {
    'robbers-cave':   [10,15,25,40,55,62,70,75,72,65,52,40,30,22,15,10,8,6],
    'sahastradhara':  [8,12,22,38,52,68,75,78,72,62,50,38,28,20,14,10,8,6],
    'tapkeshwar':     [35,45,50,52,55,55,58,62,60,55,48,42,38,32,28,22,18,15],
    'malsi-deer-park':[5,8,15,28,42,52,60,65,60,50,38,28,18,12,8,5,4,3],
    'paltan-bazaar':  [5,8,12,18,28,38,48,62,72,80,88,90,85,78,70,62,50,35],
    'fri':            [5,8,15,28,42,55,65,70,65,55,42,30,20,12,8,5,4,3],
    'mindrolling':    [10,18,28,38,48,55,58,60,55,48,40,32,25,18,14,12,10,8],
    'lacchiwala':     [5,8,12,20,32,42,50,55,50,42,32,22,15,10,7,5,4,3]
  };
  const multipliers = { sunny: 1.0, cloudy: 0.85, rainy: 0.5, foggy: 0.65 };
  const m = multipliers[weather] || 1.0;
  return (base[placeId] || Array(18).fill(20)).map(v => Math.min(100, Math.round(v * m)));
};

// ── Hotels data ───────────────────────────────────────────────
window.HOTELS_DATA = [
  {
    id: 'manu-maharani',
    name: 'Hotel Manu Maharani',
    location: 'Rajpur Road, Dehradun',
    type: 'luxury',
    stars: 4,
    price: 4500,
    availability: 'available',
    amenities: ['🍽️ Restaurant', '🏊 Pool', '💪 Gym', '📶 WiFi', '🚗 Parking'],
    rating: 4.3,
    lat: 30.3530, lng: 78.0659,
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    bookingUrl: 'https://www.booking.com/city/in/dehradun.html',
    desc: 'A heritage property on Rajpur Road offering luxury rooms with mountain views.'
  },
  {
    id: 'pacific-hotel',
    name: 'Pacific Hotel',
    location: 'Rajpur Road, Dehradun',
    type: 'luxury',
    stars: 4,
    price: 5200,
    availability: 'limited',
    amenities: ['🍽️ Restaurant', '🏊 Pool', '🧴 Spa', '📶 WiFi', '🎭 Events'],
    rating: 4.4,
    lat: 30.3612, lng: 78.0712,
    img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
    bookingUrl: 'https://www.booking.com/city/in/dehradun.html',
    desc: 'Upscale hotel with contemporary design, near Gandhi Park.'
  },
  {
    id: 'madhuban-hotel',
    name: 'Hotel Madhuban',
    location: '97 Rajpur Road, Dehradun',
    type: 'mid',
    stars: 3,
    price: 2800,
    availability: 'available',
    amenities: ['🍽️ Restaurant', '📶 WiFi', '🚗 Parking', '☎️ 24h Service'],
    rating: 4.1,
    lat: 30.3488, lng: 78.0638,
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    bookingUrl: 'https://www.booking.com/city/in/dehradun.html',
    desc: 'A well-established mid-range hotel with great value on Rajpur Road.'
  },
  {
    id: 'kalinga-hotel',
    name: 'Kalinga Hotel',
    location: 'Clock Tower, Dehradun',
    type: 'budget',
    stars: 2,
    price: 1200,
    availability: 'available',
    amenities: ['📶 WiFi', '🍳 Breakfast', '☎️ 24h Service'],
    rating: 3.8,
    lat: 30.3205, lng: 78.0376,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    bookingUrl: 'https://www.booking.com/city/in/dehradun.html',
    desc: 'Affordable lodging right by the Clock Tower, walking distance to Paltan Bazaar.'
  },
  {
    id: 'jolly-grant-resort',
    name: 'Riverview Resort',
    location: 'Lacchiwala Road, Doiwala',
    type: 'resort',
    stars: 3,
    price: 3600,
    availability: 'available',
    amenities: ['🌿 River View', '🏊 Pool', '🍽️ Restaurant', '📶 WiFi', '🏕️ Camping'],
    rating: 4.2,
    lat: 30.2223, lng: 78.1012,
    img: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=600&q=80',
    bookingUrl: 'https://www.booking.com/city/in/dehradun.html',
    desc: 'A peaceful riverside resort near Lacchiwala — perfect for nature lovers.'
  },
  {
    id: 'osho-resort',
    name: 'Lemon Tree Hotel',
    location: 'Mussoorie Road, Dehradun',
    type: 'mid',
    stars: 3,
    price: 3200,
    availability: 'limited',
    amenities: ['🍽️ Restaurant', '💪 Gym', '📶 WiFi', '🚗 Parking', '🧴 Spa'],
    rating: 4.3,
    lat: 30.3756, lng: 78.0412,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    bookingUrl: 'https://www.booking.com/city/in/dehradun.html',
    desc: 'Modern hotel on the Mussoorie road with city and forest views.'
  }
];

// ── Shops & Markets data ──────────────────────────────────────
window.SHOPS_DATA = [
  {
    id: 'shop-1',
    name: "Standard Bakery & Sweets",
    type: 'food',
    icon: '🍰',
    openHour: 7, closeHour: 21,
    address: '22 Paltan Bazaar, Dehradun',
    lat: 30.3218, lng: 78.0341,
    crowdNote: 'Busy in evenings',
    specialty: 'Famous for local bread, rusks & baklawa'
  },
  {
    id: 'shop-2',
    name: "Paltan Bazaar Market",
    type: 'market',
    icon: '🛒',
    openHour: 9, closeHour: 21,
    address: 'Main Paltan Bazaar Road',
    lat: 30.3224, lng: 78.0336,
    crowdNote: 'Peaks on evenings & weekends',
    specialty: 'Clothes, electronics, local crafts'
  },
  {
    id: 'shop-3',
    name: "Garhwal Mandal Vikas Nigam",
    type: 'craft',
    icon: '🎨',
    openHour: 10, closeHour: 18,
    address: '74 Rajpur Road, Dehradun',
    lat: 30.3501, lng: 78.0638,
    crowdNote: 'Moderate in afternoons',
    specialty: 'Authentic Garhwali handicrafts & woolens'
  },
  {
    id: 'shop-4',
    name: "Uttarakhand Khadi Gramodyog",
    type: 'craft',
    icon: '🧶',
    openHour: 10, closeHour: 17,
    address: 'Paltan Bazaar Lane 3',
    lat: 30.3231, lng: 78.0352,
    crowdNote: 'Quiet most of the day',
    specialty: 'Khadi fabrics, handloom shawls'
  },
  {
    id: 'shop-5',
    name: "Kumar Medical Store",
    type: 'pharmacy',
    icon: '💊',
    openHour: 8, closeHour: 22,
    address: 'Near Clock Tower, Dehradun',
    lat: 30.3205, lng: 78.0376,
    crowdNote: 'Open till 10 PM',
    specialty: 'Medicines, general pharmacy'
  },
  {
    id: 'shop-6',
    name: "Momos Junction",
    type: 'food',
    icon: '🥟',
    openHour: 11, closeHour: 22,
    address: 'Rajpur Road Food Lane',
    lat: 30.3512, lng: 78.0649,
    crowdNote: 'Very busy post 6 PM',
    specialty: 'Tibetan momos, noodles, thukpa'
  },
  {
    id: 'shop-7',
    name: "Naturals Ice Cream",
    type: 'food',
    icon: '🍦',
    openHour: 12, closeHour: 22,
    address: 'Rajpur Road, Opp Gandhi Park',
    lat: 30.3289, lng: 78.0485,
    crowdNote: 'Very busy summer afternoons',
    specialty: 'Natural fruit ice cream'
  },
  {
    id: 'shop-8',
    name: "Reliance Fresh",
    type: 'general',
    icon: '🏪',
    openHour: 8, closeHour: 22,
    address: 'Karanpur, Dehradun',
    lat: 30.3298, lng: 78.0512,
    crowdNote: 'Moderate throughout the day',
    specialty: 'Groceries, daily essentials'
  },
  {
    id: 'shop-9',
    name: "Bisht's Spice Market",
    type: 'market',
    icon: '🌶️',
    openHour: 9, closeHour: 20,
    address: 'Parade Ground Market, Dehradun',
    lat: 30.3178, lng: 78.0412,
    crowdNote: 'Busy in mornings',
    specialty: 'Local spices, organic produce, pickles'
  },
  {
    id: 'shop-10',
    name: "The Book Store",
    type: 'general',
    icon: '📚',
    openHour: 9, closeHour: 20,
    address: 'Rajpur Road, Dehradun',
    lat: 30.3534, lng: 78.0668,
    crowdNote: 'Usually quiet — great browsing',
    specialty: 'Books, stationery, maps of Uttarakhand'
  }
];
