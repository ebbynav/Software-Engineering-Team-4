# Mock Data Documentation

This directory contains sample JSON data files for frontend development and testing. These files represent the expected data structures from the backend API.

## Files Overview

- **routes.json** - Sample walking routes with geographical and community data
- **news.json** - News articles with sentiment analysis and bias scoring
- **users.json** - User profiles and account information
- **safety.json** - Safety statistics and real-time alerts for neighborhoods

---

## routes.json

Sample walking routes for the Explore and Home screens.

### Route Object Structure

| Field             | Type     | Description                                                      |
| ----------------- | -------- | ---------------------------------------------------------------- |
| `id`              | string   | Unique route identifier                                          |
| `title`           | string   | Route name/title                                                 |
| `description`     | string   | Detailed description of the route                                |
| `city`            | string   | City where route is located                                      |
| `category`        | string   | Route type (Scenic, Historic, Parks, Urban, Nature)              |
| `imageUrl`        | string   | Cover image URL                                                  |
| `distanceMeters`  | number   | Total distance in meters                                         |
| `durationMinutes` | number   | Estimated completion time                                        |
| `elevationGain`   | number   | Total elevation gain in meters                                   |
| `difficulty`      | enum     | "Easy", "Moderate", or "Hard"                                    |
| `safetyScore`     | number   | Safety rating (0-100, higher is safer)                           |
| `tags`            | string[] | Descriptive tags (e.g., "dog-friendly", "wheelchair-accessible") |
| `geojson`         | object   | GeoJSON object for map rendering (can be null)                   |
| `polyline`        | string   | Encoded polyline string (Google format)                          |
| `startPoint`      | object   | Starting location with lat, lng, address                         |
| `endPoint`        | object   | Ending location with lat, lng, address                           |
| `waypoints`       | array    | Array of waypoint objects (see below)                            |
| `likes`           | number   | Number of user likes                                             |
| `completions`     | number   | Number of users who completed this route                         |
| `reviews`         | number   | Number of reviews                                                |
| `averageRating`   | number   | Average user rating (0-5 stars)                                  |
| `createdBy`       | string   | User ID of route creator                                         |
| `createdAt`       | string   | ISO 8601 timestamp                                               |
| `updatedAt`       | string   | ISO 8601 timestamp                                               |
| `isPublic`        | boolean  | Whether route is publicly visible                                |
| `isFeatured`      | boolean  | Whether route is featured on home screen                         |

### Waypoint Object Structure

| Field         | Type   | Description                |
| ------------- | ------ | -------------------------- |
| `id`          | string | Unique waypoint identifier |
| `name`        | string | Waypoint name              |
| `lat`         | number | Latitude                   |
| `lng`         | number | Longitude                  |
| `description` | string | Optional description       |
| `icon`        | string | Optional emoji icon        |

### Example

```json
{
  "id": "route-1",
  "title": "Golden Gate Promenade Walk",
  "city": "San Francisco",
  "category": "Scenic",
  "distanceMeters": 5200,
  "durationMinutes": 65,
  "difficulty": "Easy",
  "safetyScore": 92,
  "tags": ["waterfront", "bridge-views", "dog-friendly"],
  "startPoint": { "lat": 37.8102, "lng": -122.478, "address": "Fort Point" },
  "likes": 1245,
  "completions": 3890
}
```

---

## news.json

News articles with AI-powered sentiment and bias analysis.

### NewsArticle Object Structure

| Field         | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `id`          | string   | Unique article identifier                            |
| `title`       | string   | Article headline                                     |
| `excerpt`     | string   | Short summary (1-2 sentences)                        |
| `content`     | string   | Full article text (multiple paragraphs)              |
| `category`    | string   | Category (Safety, Events, Community, Transportation) |
| `source`      | string   | Publication name (e.g., "SF Chronicle")              |
| `author`      | string   | Author name (optional)                               |
| `imageUrl`    | string   | Featured image URL                                   |
| `publishedAt` | string   | ISO 8601 timestamp of publication                    |
| `sentiment`   | number   | -1 (negative), 0 (neutral), or 1 (positive)          |
| `biasScore`   | number   | Bias score (0-100, lower is less biased)             |
| `tags`        | string[] | Content tags for filtering                           |
| `views`       | number   | Number of views                                      |
| `saves`       | number   | Number of times saved by users                       |
| `shares`      | number   | Number of times shared                               |
| `flags`       | number   | Number of user flags for review                      |
| `url`         | string   | Original article URL (optional)                      |
| `isVerified`  | boolean  | From trusted news source                             |
| `createdAt`   | string   | ISO 8601 timestamp when added to system              |
| `updatedAt`   | string   | ISO 8601 timestamp of last update                    |

### Bias Score Interpretation

- **0-30**: Low bias (trustworthy, fact-based reporting)
- **31-60**: Moderate bias (some opinion mixed with facts)
- **61-100**: High bias (heavily opinionated, potential misinformation)

### Sentiment Values

- **-1**: Negative tone (crime, problems, conflicts)
- **0**: Neutral tone (factual, balanced reporting)
- **1**: Positive tone (uplifting, good news)

### Example

```json
{
  "id": "news-1",
  "title": "Tourism Rebounds to Pre-Pandemic Levels",
  "category": "Community",
  "source": "SF Chronicle",
  "sentiment": 1,
  "biasScore": 25,
  "tags": ["tourism", "economy", "recovery"],
  "views": 8932,
  "isVerified": true
}
```

---

## users.json

User profiles and account information.

### User Object Structure

| Field               | Type   | Description                                    |
| ------------------- | ------ | ---------------------------------------------- |
| `id`                | string | Unique user identifier                         |
| `email`             | string | User's email address                           |
| `username`          | string | Unique username (3-20 chars)                   |
| `fullName`          | string | User's full name                               |
| `avatar`            | string | Profile picture URL (optional)                 |
| `phoneNumber`       | string | Phone number in E.164 format (optional)        |
| `bio`               | string | User bio/description (optional, max 160 chars) |
| `location`          | object | Location object (see below)                    |
| `safetyPreferences` | object | Safety settings (see below)                    |
| `createdAt`         | string | ISO 8601 timestamp of account creation         |
| `updatedAt`         | string | ISO 8601 timestamp of last profile update      |

### Location Object

| Field     | Type   | Description         |
| --------- | ------ | ------------------- |
| `city`    | string | City name           |
| `state`   | string | State/province name |
| `country` | string | Country name        |

### SafetyPreferences Object

| Field               | Type     | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `shareLocation`     | boolean  | Whether to share real-time location      |
| `emergencyContacts` | string[] | Array of emergency contact phone numbers |

### Example

```json
{
  "id": "user-1",
  "email": "demo@waytrove.com",
  "username": "demo_user",
  "fullName": "Demo User",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "bio": "Urban explorer and photography enthusiast",
  "location": {
    "city": "San Francisco",
    "state": "California",
    "country": "USA"
  },
  "safetyPreferences": {
    "shareLocation": true,
    "emergencyContacts": ["+1-415-555-0199"]
  }
}
```

---

## safety.json

Real-time safety statistics and alerts for neighborhoods.

### Safety Object Structure

| Field               | Type   | Description                                   |
| ------------------- | ------ | --------------------------------------------- |
| `id`                | string | Unique safety record identifier               |
| `location`          | object | Location details (see below)                  |
| `safetyScore`       | number | Overall safety score (0-100, higher is safer) |
| `crimeStats`        | object | Crime statistics (see below)                  |
| `period`            | string | Time period for stats (e.g., "last_30_days")  |
| `lightingQuality`   | enum   | "poor", "fair", "good", "excellent"           |
| `footTraffic`       | enum   | "low", "moderate", "high", "very_high"        |
| `securityCameras`   | number | Number of security cameras in area            |
| `policeStations`    | array  | Nearby police stations (see below)            |
| `emergencyServices` | array  | Nearby hospitals/fire stations (see below)    |
| `alerts`            | array  | Active safety alerts (see below)              |
| `lastUpdated`       | string | ISO 8601 timestamp of last data update        |

### Location Object

| Field          | Type   | Description            |
| -------------- | ------ | ---------------------- |
| `lat`          | number | Latitude               |
| `lng`          | number | Longitude              |
| `address`      | string | Human-readable address |
| `neighborhood` | string | Neighborhood name      |

### CrimeStats Object

| Field            | Type   | Description                             |
| ---------------- | ------ | --------------------------------------- |
| `totalIncidents` | number | Total reported incidents                |
| `violent`        | number | Violent crimes (assault, robbery, etc.) |
| `property`       | number | Property crimes (theft, burglary, etc.) |
| `other`          | number | Other incidents (vandalism, etc.)       |

### PoliceStation Object

| Field      | Type   | Description         |
| ---------- | ------ | ------------------- |
| `name`     | string | Police station name |
| `distance` | number | Distance in miles   |
| `address`  | string | Station address     |

### EmergencyService Object

| Field      | Type   | Description                           |
| ---------- | ------ | ------------------------------------- |
| `type`     | string | Service type (hospital, fire_station) |
| `name`     | string | Facility name                         |
| `distance` | number | Distance in miles                     |

### Alert Object

| Field      | Type   | Description                               |
| ---------- | ------ | ----------------------------------------- |
| `type`     | enum   | "advisory", "warning", "weather", "event" |
| `message`  | string | Alert message                             |
| `severity` | enum   | "low", "medium", "high"                   |
| `issuedAt` | string | ISO 8601 timestamp when alert was issued  |

### Safety Score Interpretation

- **90-100**: Very Safe (minimal crime, excellent infrastructure)
- **75-89**: Safe (low crime, good infrastructure)
- **60-74**: Moderately Safe (some concerns, adequate infrastructure)
- **40-59**: Caution Advised (higher crime, be aware)
- **0-39**: High Caution (significant safety concerns)

### Example

```json
{
  "id": "safety-1",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194,
    "address": "Downtown San Francisco",
    "neighborhood": "Financial District"
  },
  "safetyScore": 88,
  "crimeStats": {
    "totalIncidents": 42,
    "violent": 3,
    "property": 28,
    "other": 11
  },
  "period": "last_30_days",
  "lightingQuality": "excellent",
  "footTraffic": "high",
  "securityCameras": 45,
  "alerts": []
}
```

---

## Usage Notes

### For Frontend Development

1. **Import JSON files directly** in your React Native components:

   ```typescript
   import routesData from '@/assets/mocks/routes.json';
   import newsData from '@/assets/mocks/news.json';
   ```

2. **Type the data** using interfaces from service files:

   ```typescript
   import { Route } from '@/services/routesService';
   const routes: Route[] = routesData;
   ```

3. **Use for testing** without backend dependency:
   ```typescript
   const mockFetchRoutes = () => Promise.resolve(routesData);
   ```

### For Backend Integration

1. All data structures match the expected API response formats
2. Field names, types, and structures should be preserved
3. Additional fields can be added but existing ones should not be removed
4. ISO 8601 format required for all timestamps
5. Numbers should not be sent as strings (use proper JSON types)

### Data Relationships

- `routes.createdBy` → `users.id`
- `news.author` → Free text (not linked to users table)
- `safety.location.neighborhood` → Used for grouping and filtering

### Timestamps

All timestamps use ISO 8601 format in UTC timezone:

```
2025-10-13T06:00:00Z
```

### URLs

- Image URLs use placeholder services (picsum.photos, pravatar.cc)
- In production, replace with actual CDN URLs
- All URLs should be HTTPS

---

## Updating Mock Data

When adding new mock entries:

1. Follow the exact structure documented above
2. Use realistic data (real SF locations, plausible statistics)
3. Increment IDs sequentially (route-6, news-6, etc.)
4. Update timestamps to recent dates
5. Ensure all required fields are present
6. Validate JSON syntax before committing

---

## Backend Requirements

When implementing backend endpoints:

1. Return data in the exact structure shown above
2. Wrap responses in standard envelope: `{ error: false, message: "...", data: {...} }`
3. Use appropriate HTTP status codes
4. Include pagination metadata when returning arrays
5. Validate all input data before processing
6. Sanitize user-generated content (descriptions, bios, comments)

For detailed API contract documentation, see the TODO comments in:

- `src/services/authService.ts`
- `src/services/routesService.ts`
- `src/services/newsService.ts`
