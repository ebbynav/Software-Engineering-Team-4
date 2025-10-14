# WayTrove Testing Guide

## Quick Start - Testing the Complete Flow

### 1. **Reset Onboarding (If Needed)**

If you've already completed onboarding and want to test it again:

- Open the browser console (F12) or terminal
- Clear the app storage by running in console:
  ```javascript
  localStorage.clear();
  ```
- Or on mobile, uninstall and reinstall the app
- Or clear AsyncStorage via the React Native Debugger

### 2. **Onboarding Flow (First Time Users)**

1. **Launch the app** - You'll see the onboarding screen
2. **Swipe through 3 slides**:
   - Slide 1: Discover Routes
   - Slide 2: Community Insights
   - Slide 3: Safety First
3. **Click "Get Started"** on the last slide
4. ✅ You'll be taken to the **Login Screen**

### 3. **Login with Demo Credentials**

On the Login Screen, you'll see a highlighted box with demo credentials:

**Demo Credentials:**

- **Email**: `demo@waytrove.com`
- **Password**: `demo123`

Enter these credentials and click **"Sign In"**

✅ You'll be logged in and see the **Main App** with all features!

### 4. **Main App Features**

Once logged in, you can explore:

- 🏠 **Home Tab**: Browse featured routes and explore categories
- 🗺️ **Explore Tab**: Interactive map with route discovery
- 📰 **News Tab**: Travel news and articles
- 👤 **Profile Tab**: User settings and preferences

### 5. **Social Sign-In Options**

You can also test:

- **Google Sign-In**: Click "Continue with Google" (Mock authentication)
- **Apple Sign-In**: Click "Continue with Apple" (Mock authentication)

_Note: These use mock authentication and will instantly log you in_

## Testing on Different Platforms

### **Web Browser** (Recommended for Development)

```bash
# Server should already be running
# Just open: http://localhost:8081
```

- Hot reload works automatically
- Easy to debug with browser DevTools
- Note: NativeWind (Tailwind) is disabled on web, so styling may differ

### **iPhone** (Physical Device)

1. Open **Camera app** on your iPhone
2. Scan the QR code shown in the terminal
3. Tap the notification to open in **Expo Go**
4. If you don't have Expo Go, download it from the App Store first

### **Android** (Physical Device)

1. Open **Expo Go** app
2. Tap "Scan QR Code"
3. Scan the QR code from the terminal

## Troubleshooting

### Issue: "Already saw onboarding, can't test it again"

**Solution**:

- **Web**: Open browser console (F12), run: `localStorage.clear()`, then refresh
- **Mobile**: Shake device → Dev Menu → "Delete all data"

### Issue: "Login fails with my email"

**Solution**: The app currently only accepts demo credentials:

- Email: `demo@waytrove.com`
- Password: `demo123`

### Issue: "App shows blank screen"

**Solution**:

1. Check the terminal for errors
2. Reload the app: Press `r` in terminal or shake device → Reload
3. Clear cache: Stop server, run `npm start -- --clear --tunnel`

### Issue: "QR code won't scan on iPhone"

**Solution**:

- Make sure you're using the native Camera app (not Expo Go's scanner)
- Ensure your phone is on the same network or has internet (tunnel mode allows cross-network)
- Try getting closer/further from the screen

## Development Workflow

### Making Changes

1. Edit any file in `src/`
2. Save the file
3. App will automatically reload (hot reload)
4. Check terminal/browser console for any errors

### Viewing Logs

- **Web**: Open browser DevTools → Console tab
- **Mobile**: Terminal will show logs, or use React Native Debugger

### Restarting Fresh

```bash
# In terminal, press Ctrl+C to stop server
npm start -- --clear --tunnel
```

## What's Mocked vs Real

### ✅ Currently Working (Mock Data)

- Onboarding flow
- Authentication (demo credentials)
- All UI components and navigation
- Theme switching (light/dark mode)
- Tab navigation

### 🚧 TODO (Future Implementation)

- Real API integration with Django backend
- OAuth flows (Google/Apple Sign-In)
- Real user data persistence
- Route data from backend
- News articles from backend
- Real-time location tracking

## Next Steps for Full Implementation

1. **Backend Integration**: Connect to Django REST API
2. **Real Authentication**: Implement JWT token management
3. **Data Fetching**: Replace mock data with API calls
4. **User Profiles**: Real user data storage
5. **Push Notifications**: Route updates and alerts
6. **Offline Support**: Cache data for offline access

---

**Happy Testing! 🎉**

For issues or questions, check the terminal logs or browser console for detailed error messages.
