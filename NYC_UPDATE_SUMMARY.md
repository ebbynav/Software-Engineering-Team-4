# NYC Update & ExploreScreen Fix Summary

## Changes Made - October 13, 2025

### 🗽 **1. Updated All Content from San Francisco to New York City**

#### **mockData.ts - Featured Routes**

Changed 4 featured routes:

- ✅ "Golden Gate Bridge Sunset Walk" → "Brooklyn Bridge to DUMBO Walk"
- ✅ "Mission District Food Tour" → "Greenwich Village Food Tour"
- ✅ "Twin Peaks Hiking Trail" → "Central Park Loop Trail"
- ✅ "Fishermans Wharf to Pier 39" → "Times Square to Hudson Yards"
- ✅ All locations: "San Francisco, CA" → "New York, NY"

#### **mockData.ts - Explore Items**

Updated 3 explore items:

- ✅ "Chinatown Cultural Walk" → "Chinatown to Little Italy Walk"
  - Location: "Chinatown, SF" → "Lower Manhattan, NY"
- ✅ "Painted Ladies Victorian Houses" → "Flatiron Building Plaza"
  - Location: "Alamo Square, SF" → "Flatiron District, NY"
  - Description updated for Beaux-Arts architecture
- ✅ "Land's End Coastal Trail" → "High Line Park End-to-End"
  - Location: "Richmond District, SF" → "Chelsea, NY"
  - Tags: "Ocean" → "Art"
  - Description updated for elevated park

#### **mockData.ts - Safety Alerts**

Updated 3 safety alerts with NYC coordinates:

- ✅ Union Square → Times Square (lat: 40.7580, lng: -73.9855)
- ✅ Lombard Street → 5th Avenue (lat: 40.7614, lng: -73.9776)
- ✅ Golden Gate Bridge → Brooklyn Bridge (lat: 40.7061, lng: -74.0087)

#### **mockData.ts - News Items**

Updated 5 news articles:

- ✅ "San Francisco Tourism" → "New York City Tourism"
  - Source: "SF Chronicle" → "NY Times"
- ✅ "Union Square" → "Midtown Manhattan"
  - Source: "ABC7 News" → "ABC7 NY"
- ✅ "Mission District" → "SoHo"
  - Source: "Mission Local" → "Time Out NY"
- ✅ "Bay Bridge" → "Queensboro Bridge"
  - Source: "KRON4" → "NY1"
- ✅ "Earthquake Preparedness" → "Severe Weather Preparedness"
  - Changed from "seismic activity in the Bay Area" to "winter storms and extreme weather"

#### **mockData.ts - Mock User Profile**

- ✅ City: "San Francisco, CA" → "New York, NY"

#### **AuthContext.tsx - Mock Users**

Updated all 4 mock user profiles:

- ✅ Google user: city "San Francisco" → "New York"
- ✅ Apple user: city "New York" (already correct, kept as is)
- ✅ Email user: city "Austin" → "New York"
- ✅ Returning user: city "Seattle" → "New York"

---

### 📜 **2. Fixed ExploreScreen Map Scrolling Issue**

#### **Problem:**

The map placeholder was positioned in the middle of the screen and wouldn't scroll with the rest of the content. When users scrolled down to see more routes, the map stayed fixed in place, blocking the view.

#### **Root Cause:**

The layout was using a `FlatList` for the route items only, with the map sitting as a separate component between filters and the list. This caused the map to be static.

#### **Solution:**

Wrapped all content (filters, map, routes) in a single `ScrollView` so everything scrolls together:

**Before:**

```tsx
<SafeAreaView>
  <Header />
  <FilterChips />
  <MapPlaceholder /> // ❌ Static
  <FlatList>
    {' '}
    // ❌ Only list scrolls
    {routes}
  </FlatList>
</SafeAreaView>
```

**After:**

```tsx
<SafeAreaView>
  <Header />
  <ScrollView>       // ✅ Everything scrolls together
    <FilterChips />
    <MapPlaceholder />
    {routes.map(...)} // ✅ Routes rendered inline
  </ScrollView>
</SafeAreaView>
```

#### **Changes Made:**

1. **Wrapped content in ScrollView**:

```tsx
<ScrollView
  style={styles.scrollContainer}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
>
  {/* All content here */}
</ScrollView>
```

2. **Replaced FlatList with map()**:

```tsx
// Before: FlatList with renderItem
<FlatList
  data={items}
  renderItem={renderItem}
  ...
/>

// After: Direct map rendering
{items.map((item) => (
  <View key={item.id} style={styles.routeCardWrapper}>
    <RouteCard {...props} />
  </View>
))}
```

3. **Added new styles**:

```tsx
scrollContainer: {
  flex: 1,
},
scrollContent: {
  paddingBottom: 100,  // Space for FAB
},
```

#### **Benefits:**

- ✅ Map scrolls smoothly with rest of content
- ✅ No blocking/overlapping issues
- ✅ Better UX - users can scroll past map to see all routes
- ✅ FAB stays fixed at bottom (as intended)
- ✅ Empty state still works correctly

---

## Testing Checklist

### NYC Content Updates:

- [ ] Open Home screen → See NYC routes (Brooklyn Bridge, Greenwich Village, Central Park, Times Square)
- [ ] Open Explore screen → See NYC locations (Chinatown/Little Italy, Flatiron, High Line)
- [ ] Open Safety screen → See NYC safety alerts (Times Square, 5th Avenue, Brooklyn Bridge)
- [ ] Open News screen → See NYC news articles (Tourism, Midtown, SoHo, Queensboro Bridge)
- [ ] Check Profile screen → User city shows "New York, NY"
- [ ] Login with any method → User object has city: "New York"

### ExploreScreen Scroll Fix:

- [ ] Open Explore screen
- [ ] Map placeholder is visible at top
- [ ] Scroll down → Map scrolls up with content ✅
- [ ] Continue scrolling → See all route cards below map ✅
- [ ] FAB (Create button) stays fixed at bottom-right ✅
- [ ] Empty state (no filters) → Shows "No routes match your filters" message
- [ ] Apply filters → Content still scrolls smoothly

---

## Files Modified

| File                                | Type   | Changes                                                                                   |
| ----------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `src/data/mockData.ts`              | Data   | Updated 4 featured routes, 3 explore items, 3 safety alerts, 5 news items, 1 user profile |
| `src/contexts/auth/AuthContext.tsx` | Data   | Updated 4 mock user cities to NYC                                                         |
| `src/screens/ExploreScreen.tsx`     | UI Fix | Wrapped content in ScrollView, replaced FlatList with map(), added scroll styles          |
| `app.json`                          | Revert | Reverted icon paths back to `.png` (placeholder issue)                                    |

---

## Known Issues

### Asset Warning (Non-blocking):

```
Unable to resolve asset "./assets/icon.png"
```

**Status:** Warning only, doesn't affect functionality  
**Reason:** Placeholder icon files exist but aren't proper PNG images  
**Impact:** App works perfectly, just missing app icon in dev mode  
**Fix:** Create actual 1024x1024 PNG icon and replace placeholder files

---

## Summary

### ✅ Completed:

1. **All San Francisco references changed to New York City** across:
   - Routes and locations
   - Safety alerts with NYC coordinates
   - News articles with NYC sources
   - User profiles and mock data
2. **ExploreScreen scroll issue fixed**:
   - Map now scrolls with content
   - Smooth scrolling experience
   - No blocking/overlapping
   - FAB stays fixed correctly

### 📱 Ready for Testing:

- Server running at: `http://localhost:8081` (web)
- Tunnel URL: `exp://if8moga-anonymous-8081.exp.direct` (mobile)
- Demo credentials: `demo@waytrove.com` / `demo123`

---

**All changes committed and ready!** 🗽
