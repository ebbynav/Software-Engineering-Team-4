/**
 * Mock Data - Featured Routes
 * Sample data for home screen featured routes carousel
 */

export interface FeaturedRoute {
  id: string;
  title: string;
  thumbnailUrl: string;
  distanceMeters: number;
  estimatedMinutes: number;
  tags: string[];
  location: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  rating: number;
  savedCount: number;
}

export const FEATURED_ROUTES: FeaturedRoute[] = [
  {
    id: 'route-1',
    title: 'Golden Gate Bridge Sunset Walk',
    thumbnailUrl: 'https://picsum.photos/400/300?random=1',
    distanceMeters: 3200,
    estimatedMinutes: 45,
    tags: ['Scenic', 'Photography', 'Urban'],
    location: 'San Francisco, CA',
    difficulty: 'easy',
    rating: 4.8,
    savedCount: 1234,
  },
  {
    id: 'route-2',
    title: 'Mission District Food Tour',
    thumbnailUrl: 'https://picsum.photos/400/300?random=2',
    distanceMeters: 2800,
    estimatedMinutes: 90,
    tags: ['Food', 'Culture', 'Local'],
    location: 'San Francisco, CA',
    difficulty: 'easy',
    rating: 4.9,
    savedCount: 2156,
  },
  {
    id: 'route-3',
    title: 'Twin Peaks Hiking Trail',
    thumbnailUrl: 'https://picsum.photos/400/300?random=3',
    distanceMeters: 5100,
    estimatedMinutes: 120,
    tags: ['Hiking', 'Nature', 'Views'],
    location: 'San Francisco, CA',
    difficulty: 'moderate',
    rating: 4.7,
    savedCount: 987,
  },
  {
    id: 'route-4',
    title: 'Fishermans Wharf to Pier 39',
    thumbnailUrl: 'https://picsum.photos/400/300?random=4',
    distanceMeters: 1800,
    estimatedMinutes: 30,
    tags: ['Tourist', 'Waterfront', 'Family'],
    location: 'San Francisco, CA',
    difficulty: 'easy',
    rating: 4.5,
    savedCount: 3421,
  },
];

/**
 * Mock Data - Explore Items
 */
export interface ExploreItem {
  id: string;
  type: 'route' | 'place';
  title: string;
  description: string;
  thumbnailUrl: string;
  location: string;
  distanceMeters: number;
  estimatedMinutes?: number;
  tags: string[];
  safetyScore: number; // 0-100
  rating: number;
  isSaved: boolean;
}

export const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: 'explore-1',
    type: 'route',
    title: 'Chinatown Cultural Walk',
    description:
      'Explore authentic markets, temples, and traditional cuisine in historic Chinatown.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=5',
    location: 'Chinatown, SF',
    distanceMeters: 2400,
    estimatedMinutes: 60,
    tags: ['Culture', 'Food', 'History'],
    safetyScore: 92,
    rating: 4.6,
    isSaved: false,
  },
  {
    id: 'explore-2',
    type: 'place',
    title: 'Painted Ladies Victorian Houses',
    description:
      'Iconic row of colorful Victorian houses with stunning architecture.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=6',
    location: 'Alamo Square, SF',
    distanceMeters: 0,
    tags: ['Photography', 'Architecture', 'Landmark'],
    safetyScore: 95,
    rating: 4.8,
    isSaved: true,
  },
  {
    id: 'explore-3',
    type: 'route',
    title: "Land's End Coastal Trail",
    description: 'Breathtaking coastal hike with ocean views and hidden ruins.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=7',
    location: 'Richmond District, SF',
    distanceMeters: 4200,
    estimatedMinutes: 90,
    tags: ['Hiking', 'Nature', 'Ocean'],
    safetyScore: 88,
    rating: 4.9,
    isSaved: false,
  },
];

/**
 * Mock Data - Safety Alerts
 */
export interface SafetyAlert {
  id: string;
  type: 'crowd' | 'accident' | 'closure' | 'weather' | 'crime';
  lat: number;
  lng: number;
  severity: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = critical
  timestamp: string;
  detailText: string;
  location: string;
}

export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'alert-1',
    type: 'crowd',
    lat: 37.7749,
    lng: -122.4194,
    severity: 2,
    timestamp: new Date().toISOString(),
    detailText: 'Heavy pedestrian traffic near Union Square. Exercise caution.',
    location: 'Union Square',
  },
  {
    id: 'alert-2',
    type: 'closure',
    lat: 37.8024,
    lng: -122.4058,
    severity: 3,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    detailText:
      'Street closure for construction on Lombard St. Find alternative route.',
    location: 'Lombard Street',
  },
  {
    id: 'alert-3',
    type: 'weather',
    lat: 37.7694,
    lng: -122.4862,
    severity: 2,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    detailText: 'Fog advisory near Golden Gate Bridge. Reduced visibility.',
    location: 'Golden Gate Bridge',
  },
];

/**
 * Mock Data - News Feed
 */
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  publishedAt: string;
  sentiment: -1 | 0 | 1; // -1 = negative, 0 = neutral, 1 = positive
  biasScore: number; // 0-100, lower is less biased
  imageUrl: string;
  category: 'top' | 'local' | 'safety';
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'San Francisco Tourism Rebounds to Pre-Pandemic Levels',
    excerpt:
      'City officials report record visitor numbers as attractions reopen and events return.',
    source: 'SF Chronicle',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    sentiment: 1,
    biasScore: 25,
    imageUrl: 'https://picsum.photos/400/250?random=8',
    category: 'top',
  },
  {
    id: 'news-2',
    title: 'New Safety Measures Implemented in Tourist Districts',
    excerpt:
      'Enhanced security and emergency response systems now active in high-traffic areas.',
    source: 'ABC7 News',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    sentiment: 1,
    biasScore: 30,
    imageUrl: 'https://picsum.photos/400/250?random=9',
    category: 'safety',
  },
  {
    id: 'news-3',
    title: 'Mission District Street Fair This Weekend',
    excerpt:
      'Annual cultural festival features local food, music, and art from diverse communities.',
    source: 'Mission Local',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    sentiment: 1,
    biasScore: 20,
    imageUrl: 'https://picsum.photos/400/250?random=10',
    category: 'local',
  },
  {
    id: 'news-4',
    title: 'Traffic Advisory: Bay Bridge Maintenance Scheduled',
    excerpt:
      'Expect delays during evening commute hours as repairs continue through next week.',
    source: 'KRON4',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    sentiment: 0,
    biasScore: 15,
    imageUrl: 'https://picsum.photos/400/250?random=11',
    category: 'local',
  },
  {
    id: 'news-5',
    title: 'Earthquake Preparedness Tips for Travelers',
    excerpt:
      'What visitors should know about staying safe during seismic activity in the Bay Area.',
    source: 'Travel Weekly',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    sentiment: 0,
    biasScore: 10,
    imageUrl: 'https://picsum.photos/400/250?random=12',
    category: 'safety',
  },
];

/**
 * Mock Data - User Profile
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  bio: string;
  stats: {
    routesCreated: number;
    followers: number;
    following: number;
    savedRoutes: number;
  };
  preferences: {
    units: 'metric' | 'imperial';
    language: string;
    notifications: {
      safetyAlerts: boolean;
      routeUpdates: boolean;
      socialActivity: boolean;
    };
  };
}

export const MOCK_USER: UserProfile = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  city: 'San Francisco, CA',
  bio: 'Travel enthusiast and local explorer. Love discovering hidden gems and sharing authentic experiences.',
  stats: {
    routesCreated: 24,
    followers: 342,
    following: 189,
    savedRoutes: 67,
  },
  preferences: {
    units: 'imperial',
    language: 'en',
    notifications: {
      safetyAlerts: true,
      routeUpdates: true,
      socialActivity: false,
    },
  },
};
