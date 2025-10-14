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
    title: 'Brooklyn Bridge to DUMBO Walk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80',
    distanceMeters: 3200,
    estimatedMinutes: 45,
    tags: ['Scenic', 'Photography', 'Urban'],
    location: 'New York, NY',
    difficulty: 'easy',
    rating: 4.8,
    savedCount: 1234,
  },
  {
    id: 'route-2',
    title: 'Statue of Liberty & Battery Park Walk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508090919348-40c04a3df5a7?w=800&q=80',
    distanceMeters: 2800,
    estimatedMinutes: 90,
    tags: ['Landmark', 'History', 'Waterfront'],
    location: 'New York, NY',
    difficulty: 'easy',
    rating: 4.9,
    savedCount: 2156,
  },
  {
    id: 'route-3',
    title: 'Central Park Loop Trail',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&q=80',
    distanceMeters: 5100,
    estimatedMinutes: 120,
    tags: ['Hiking', 'Nature', 'Views'],
    location: 'New York, NY',
    difficulty: 'moderate',
    rating: 4.7,
    savedCount: 987,
  },
  {
    id: 'route-4',
    title: 'Times Square to Hudson Yards',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
    distanceMeters: 1800,
    estimatedMinutes: 30,
    tags: ['Tourist', 'Urban', 'Architecture'],
    location: 'New York, NY',
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
    title: 'Chinatown to Little Italy Walk',
    description:
      'Explore authentic markets, temples, and traditional cuisine in historic neighborhoods.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80',
    location: 'Lower Manhattan, NY',
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
    title: 'Flatiron Building Plaza',
    description:
      'Iconic triangular building with stunning Beaux-Arts architecture and photo opportunities.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=800&q=80',
    location: 'Flatiron District, NY',
    distanceMeters: 0,
    tags: ['Photography', 'Architecture', 'Landmark'],
    safetyScore: 95,
    rating: 4.8,
    isSaved: true,
  },
  {
    id: 'explore-3',
    type: 'route',
    title: 'High Line Park End-to-End',
    description: 'Elevated park walkway with urban gardens, art installations, and Hudson River views.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548532928-bb4ba48bc091?w=800&q=80',
    location: 'Chelsea, NY',
    distanceMeters: 4200,
    estimatedMinutes: 90,
    tags: ['Hiking', 'Nature', 'Art'],
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
    lat: 40.7580,
    lng: -73.9855,
    severity: 2,
    timestamp: new Date().toISOString(),
    detailText: 'Heavy pedestrian traffic near Times Square. Exercise caution.',
    location: 'Times Square',
  },
  {
    id: 'alert-2',
    type: 'closure',
    lat: 40.7614,
    lng: -73.9776,
    severity: 3,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    detailText:
      'Street closure for construction on 5th Avenue. Find alternative route.',
    location: '5th Avenue',
  },
  {
    id: 'alert-3',
    type: 'weather',
    lat: 40.7061,
    lng: -74.0087,
    severity: 2,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    detailText: 'Strong winds near Brooklyn Bridge. Exercise caution.',
    location: 'Brooklyn Bridge',
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
    title: 'New York City Tourism Reaches Record Numbers',
    excerpt:
      'City officials report record visitor numbers as attractions reopen and events return.',
    source: 'NY Times',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    sentiment: 1,
    biasScore: 25,
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&q=80',
    category: 'top',
  },
  {
    id: 'news-2',
    title: 'Enhanced Safety Measures in Midtown Manhattan',
    excerpt:
      'Enhanced security and emergency response systems now active in high-traffic areas.',
    source: 'ABC7 NY',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    sentiment: 1,
    biasScore: 30,
    imageUrl: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&q=80',
    category: 'safety',
  },
  {
    id: 'news-3',
    title: 'SoHo Street Fair This Weekend',
    excerpt:
      'Annual cultural festival features local food, music, and art from diverse communities.',
    source: 'Time Out NY',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    sentiment: 1,
    biasScore: 20,
    imageUrl: 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800&q=80',
    category: 'local',
  },
  {
    id: 'news-4',
    title: 'Traffic Advisory: Queensboro Bridge Maintenance',
    excerpt:
      'Expect delays during evening commute hours as repairs continue through next week.',
    source: 'NY1',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    sentiment: 0,
    biasScore: 15,
    imageUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&q=80',
    category: 'local',
  },
  {
    id: 'news-5',
    title: 'Severe Weather Preparedness for NYC Visitors',
    excerpt:
      'What visitors should know about staying safe during winter storms and extreme weather.',
    source: 'Travel Weekly',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    sentiment: 0,
    biasScore: 10,
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
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
  name: 'Quincy Oldland',
  email: 'quincy.oldland@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  city: 'New York, NY',
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
