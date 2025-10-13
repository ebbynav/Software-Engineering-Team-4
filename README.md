# WayTrove - Travel Discovery App

A React Native (Expo) + TypeScript mobile application for discovering and managing travel experiences, built with iOS 17/26 design language.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Yarn or npm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS) or Android Studio (for Android)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd waytrove
```

2. Install dependencies

```bash
yarn install
# or
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your actual API keys
```

4. Start the development server

```bash
yarn start
# or
npm start
```

### Available Scripts

- `yarn start` - Start Expo development server
- `yarn android` - Run on Android device/emulator
- `yarn ios` - Run on iOS device/simulator
- `yarn web` - Run in web browser
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues automatically
- `yarn format` - Format code with Prettier
- `yarn typecheck` - Run TypeScript type checking

## 🏗️ Architecture Overview

```
App.tsx
├── ThemeProvider (Dark/Light mode with AsyncStorage persistence)
├── AuthProvider (Mock authentication state)
└── RootNavigator
    ├── AuthStack (Onboarding, Login, Register)
    └── MainStack
        ├── TabNavigator (Home, Search, Bookmarks, Profile)
        └── ModalStacks (Details, Settings, etc.)
```

### Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── constants/       # App constants (colors, spacing, etc.)
└── services/        # API service layer (TODO: Django integration)
```

## 🎨 Design System

### Color Tokens

- **Primary**: #6C63FF (indigo-violet)
- **Secondary**: #00C2CB (teal)
- **Accent**: #A78BFA (soft purple)
- **Background Light**: #F8F8FC
- **Background Dark**: #0B1020

### Typography

- Uses SF Pro font family for iOS 17/26 design language
- Consistent spacing scale: 4, 8, 12, 16, 20, 24, 32, 40px
- Border radius: small (8px), medium (12px), large (20px)

## 🔧 State Management

### Theme Persistence

- AsyncStorage key: `@waytrove_theme` ("light" | "dark")
- System respects device theme on first launch

### Authentication (Mock)

- AsyncStorage key: `@waytrove_auth` (token/user data)
- AsyncStorage key: `@waytrove_has_seen_onboarding` (boolean)

## 🌐 Backend Integration

The app is designed to integrate with a Django REST API backend:

### API Endpoints (TODO)

```typescript
// Base URL from environment
const API_BASE = process.env.DJANGO_API_URL

// Example endpoints:
- GET /auth/profile - User profile
- POST /auth/login - User authentication
- GET /destinations - Travel destinations
- POST /bookmarks - Save destination
- GET /search?q=query - Search destinations
```

### Environment Variables

```bash
DJANGO_API_URL=http://localhost:8000/api
MAPBOX_API_KEY=your_mapbox_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 🧪 Testing & Quality

- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for code quality
- **TypeScript**: Full type safety
- **Accessibility**: WCAG compliant components with proper labels

## 📱 Features (Planned)

- [ ] User authentication & profiles
- [ ] Travel destination discovery
- [ ] Interactive maps integration
- [ ] Bookmark & favorites system
- [ ] Dark/Light theme switching
- [ ] Offline-first data caching
- [ ] Push notifications
- [ ] Social sharing

## 🚀 Deployment

The app is configured for deployment to:

- **iOS**: App Store via Expo Application Services (EAS)
- **Android**: Google Play Store via EAS
- **Web**: Static hosting (Netlify, Vercel)

## 📄 License

MIT License - see LICENSE file for details

# This repository is maintained by **Group 4 (SE I2)** and will contain all documentation, source code, and supporting files for the project.

## 👥 Team Members

- Quincy Oldland
- Aniket Singh
- Rishik Gannavarapu
- Rishik Kolli
- Abhinav Sivakumar
