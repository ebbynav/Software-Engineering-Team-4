# Testing Guide

This document outlines the recommended testing strategy for the WayTrove mobile app using Jest and React Native Testing Library.

## Testing Philosophy

We recommend a testing approach focused on:

- **User behavior** over implementation details
- **Integration tests** for screens and user flows
- **Unit tests** for utilities, hooks, and services
- **Snapshot tests** sparingly for critical UI components

## Testing Stack

### Core Libraries

- **Jest**: Test runner and assertion library (built into React Native)
- **React Native Testing Library**: Component testing with user-centric queries
- **@testing-library/react-hooks**: For testing custom hooks in isolation

### Installation

```bash
npm install --save-dev @testing-library/react-native @testing-library/react-hooks
```

### Configuration

Ensure `jest.config.js` includes:

```js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/react-native/cleanup-after-each'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
};
```

---

## Testing Patterns by Type

### 1. Testing Utilities (formatters.ts)

**Example: Testing formatDistance**

Test that the `formatDistance` utility correctly converts meters to human-readable strings.

**Arrange**: Set up test inputs (distances in meters)
**Act**: Call `formatDistance()` with each input
**Assert**: Verify the output matches expected format

```typescript
// src/utils/__tests__/formatters.test.ts
import { formatDistance, formatDuration, formatTimeAgo } from '../formatters';

describe('formatDistance', () => {
  it('should format distances under 1km as meters', () => {
    expect(formatDistance(850)).toBe('850 m');
    expect(formatDistance(500)).toBe('500 m');
  });

  it('should format distances over 1km as kilometers with 1 decimal', () => {
    expect(formatDistance(5200)).toBe('5.2 km');
    expect(formatDistance(1000)).toBe('1.0 km');
    expect(formatDistance(42195)).toBe('42.2 km'); // Marathon distance
  });
});

describe('formatDuration', () => {
  it('should show "< 1 min" for durations under 60 seconds', () => {
    expect(formatDuration(45)).toBe('< 1 min');
  });

  it('should format minutes only for durations under 1 hour', () => {
    expect(formatDuration(2700)).toBe('45 min');
    expect(formatDuration(1800)).toBe('30 min');
  });

  it('should format hours and minutes for longer durations', () => {
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(5400)).toBe('1h 30m');
    expect(formatDuration(7200)).toBe('2h');
  });
});

describe('formatTimeAgo', () => {
  it('should return "just now" for timestamps within last minute', () => {
    const now = new Date();
    const recent = new Date(now.getTime() - 30000); // 30 seconds ago
    expect(formatTimeAgo(recent.toISOString())).toBe('just now');
  });

  it('should format minutes, hours, days, weeks, months, years', () => {
    const now = new Date('2024-01-15T12:00:00Z');

    // Mock Date.now() to return fixed time
    jest.spyOn(global, 'Date').mockImplementation(() => now);

    expect(formatTimeAgo('2024-01-15T11:58:00Z')).toBe('2m ago');
    expect(formatTimeAgo('2024-01-15T10:00:00Z')).toBe('2h ago');
    expect(formatTimeAgo('2024-01-12T12:00:00Z')).toBe('3d ago');
    expect(formatTimeAgo('2024-01-08T12:00:00Z')).toBe('1w ago');
    expect(formatTimeAgo('2023-12-15T12:00:00Z')).toBe('1mo ago');
    expect(formatTimeAgo('2023-01-15T12:00:00Z')).toBe('1y ago');
  });
});
```

---

### 2. Testing Custom Hooks (useDebouncedValue, useAsyncStorage)

**Example: Testing useDebouncedValue**

Test that the debounce hook delays value updates by the specified delay period.

**Arrange**: Render hook with initial value and delay
**Act**: Update the value multiple times rapidly
**Assert**: Verify value only updates after delay period

```typescript
// src/hooks/__tests__/useDebouncedValue.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useDebouncedValue } from '../useDebouncedValue';

jest.useFakeTimers();

describe('useDebouncedValue', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes by 300ms (default)', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // Change value
    rerender({ value: 'updated' });

    // Should still show old value before delay
    expect(result.current).toBe('initial');

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should now show updated value
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'first' } }
    );

    // Rapid changes
    rerender({ value: 'second' });
    jest.advanceTimersByTime(100); // Only 100ms passed

    rerender({ value: 'third' });
    jest.advanceTimersByTime(100); // Another 100ms

    rerender({ value: 'final' });

    // Should still show initial value
    expect(result.current).toBe('first');

    // Fast-forward full delay from last change
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should jump directly to final value (skipping intermediate values)
    expect(result.current).toBe('final');
  });
});
```

**Example: Testing useAsyncStorage**

Test that the AsyncStorage hook correctly reads/writes values.

**Arrange**: Mock AsyncStorage methods
**Act**: Call `getValue()` and `setValue()`
**Assert**: Verify AsyncStorage was called with correct parameters

```typescript
// src/hooks/__tests__/useAsyncStorage.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAsyncStorage } from '../useAsyncStorage';

jest.mock('@react-native-async-storage/async-storage');

describe('useAsyncStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read value from AsyncStorage', async () => {
    const mockValue = 'dark';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockValue);

    const { result } = renderHook(() => useAsyncStorage());

    let value;
    await act(async () => {
      value = await result.current.getValue('theme');
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('theme');
    expect(value).toBe('dark');
    expect(result.current.loading).toBe(false);
  });

  it('should write value to AsyncStorage', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.setValue('theme', 'light');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(result.current.loading).toBe(false);
  });

  it('should handle JSON values (objects, arrays)', async () => {
    const mockUser = { id: '1', name: 'John' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockUser)
    );

    const { result } = renderHook(() => useAsyncStorage());

    let value;
    await act(async () => {
      value = await result.current.getValue('userProfile');
    });

    expect(value).toEqual(mockUser);
  });

  it('should set error state on failure', async () => {
    const mockError = new Error('Storage error');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.getValue('theme');
    });

    expect(result.current.error).toEqual(mockError);
  });
});
```

---

### 3. Testing Screens (HomeScreen, ExploreScreen)

**Example: Testing HomeScreen**

Test that the home screen renders greeting text and responds to user interactions.

**Arrange**: Render the HomeScreen component
**Act**: Simulate user tapping buttons or entering text
**Assert**: Verify correct elements are displayed and state updates

```typescript
// src/screens/__tests__/HomeScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../HomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('HomeScreen', () => {
  it('should render greeting text', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText(/Welcome to WayTrove/i)).toBeTruthy();
  });

  it('should navigate to Explore when pressing Explore button', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    const exploreButton = getByText(/Explore Routes/i);
    fireEvent.press(exploreButton);

    expect(mockNavigate).toHaveBeenCalledWith('Explore');
  });

  it('should display featured routes after loading', async () => {
    const { getByTestId, queryByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Should show loading indicator initially
    expect(getByTestId('loading-spinner')).toBeTruthy();

    // Wait for data to load
    await waitFor(() => {
      expect(queryByTestId('loading-spinner')).toBeNull();
    });

    // Should display route cards
    expect(getByTestId('featured-routes-list')).toBeTruthy();
  });
});
```

**Example: Testing Theme Toggle**

Test that toggling theme updates AsyncStorage and applies correct colors.

**Arrange**: Render component with theme toggle button
**Act**: Press theme toggle button
**Assert**: Verify AsyncStorage.setItem called and background color changed

```typescript
// src/components/__tests__/ThemeToggle.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeToggle } from '../ThemeToggle';

jest.mock('@react-native-async-storage/async-storage');

describe('ThemeToggle', () => {
  it('should toggle theme and save to AsyncStorage', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { getByTestId } = render(<ThemeToggle />);

    const toggleButton = getByTestId('theme-toggle-button');

    // Tap to switch from light to dark
    fireEvent.press(toggleButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  it('should apply dark mode colors when theme is dark', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(<ThemeToggle />);

    await waitFor(() => {
      const container = getByTestId('theme-container');
      expect(container.props.style).toMatchObject({
        backgroundColor: '#1a1a1a', // Dark mode background
      });
    });
  });
});
```

---

### 4. Testing API Services (authService, routesService)

**Example: Testing routesService.fetchRoutes**

Test that the routes service correctly calls the API endpoint with filters.

**Arrange**: Mock axios/apiService methods
**Act**: Call `fetchRoutes({ city: 'San Francisco' })`
**Assert**: Verify API called with correct URL and query params

```typescript
// src/services/__tests__/routesService.test.ts
import { fetchRoutes, fetchRouteDetails } from '../routesService';
import * as api from '../apiService';

jest.mock('../apiService');

describe('routesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRoutes', () => {
    it('should call API with filter parameters', async () => {
      const mockRoutes = [
        { id: 'route-1', title: 'Golden Gate Promenade' },
        { id: 'route-2', title: 'Lands End Coastal' },
      ];

      (api.get as jest.Mock).mockResolvedValue({ data: mockRoutes });

      const filters = {
        city: 'San Francisco',
        category: 'scenic',
        safetyScoreMin: 80,
      };

      const result = await fetchRoutes(filters);

      expect(api.get).toHaveBeenCalledWith('/routes', { params: filters });
      expect(result).toEqual(mockRoutes);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Network error');
      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(fetchRoutes({})).rejects.toThrow('Network error');
    });
  });

  describe('fetchRouteDetails', () => {
    it('should fetch single route by ID', async () => {
      const mockRoute = {
        id: 'route-1',
        title: 'Golden Gate Promenade',
        distanceMeters: 5200,
      };

      (api.get as jest.Mock).mockResolvedValue({ data: mockRoute });

      const result = await fetchRouteDetails('route-1');

      expect(api.get).toHaveBeenCalledWith('/routes/route-1');
      expect(result).toEqual(mockRoute);
    });
  });
});
```

---

### 5. Testing useMockData Hook

**Example: Testing useMockData loading behavior**

Test that the mock data hook simulates network delay and returns data.

**Arrange**: Render hook with mock file name
**Act**: Wait for simulated delay
**Assert**: Verify loading state transitions and data is loaded

```typescript
// src/hooks/__tests__/useMockData.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useMockData } from '../useMockData';

jest.mock('../../../assets/mocks/routes.json', () => [
  { id: 'route-1', title: 'Test Route' },
]);

jest.useFakeTimers();

describe('useMockData', () => {
  it('should start in loading state', () => {
    const { result } = renderHook(() => useMockData('routes'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should load data after simulated delay', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMockData('routes', { minDelay: 200, maxDelay: 200 })
    );

    expect(result.current.loading).toBe(true);

    // Fast-forward past delay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([
      { id: 'route-1', title: 'Test Route' },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('should support manual refetch', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMockData('routes', { autoFetch: false })
    );

    // Should not auto-load
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();

    // Manually trigger fetch
    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitForNextUpdate();

    expect(result.current.data).toBeTruthy();
  });
});
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test formatters.test.ts
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Generate Coverage Report

```bash
npm test -- --coverage
```

---

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern

Structure every test in three phases:

- **Arrange**: Set up test data and dependencies
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcome

### 2. Test User Behavior, Not Implementation

✅ Good: `expect(getByText('Welcome to WayTrove')).toBeTruthy()`
❌ Bad: `expect(component.state.greeting).toBe('Welcome')`

### 3. Descriptive Test Names

✅ Good: `'should format distances over 1km as kilometers with 1 decimal'`
❌ Bad: `'test formatDistance'`

### 4. Avoid Testing External Libraries

Don't test React Native components or third-party libraries—trust they work.

### 5. Mock External Dependencies

Mock API calls, AsyncStorage, navigation, and other external dependencies.

### 6. Test Edge Cases

Include tests for:

- Empty states (no data)
- Error states (network failures)
- Boundary values (0, negative numbers, very large numbers)
- Invalid inputs

### 7. Keep Tests Isolated

Each test should be independent—don't rely on test execution order.

---

## Testing Checklist

Before committing code, ensure:

- [ ] All tests pass (`npm test`)
- [ ] New features have corresponding tests
- [ ] Edge cases are covered
- [ ] Mocks are properly cleaned up (use `jest.clearAllMocks()`)
- [ ] Tests are readable and well-documented
- [ ] Coverage is reasonable (aim for 70%+ for critical paths)

---

## Next Steps

1. Set up testing scripts in `package.json`
2. Configure code coverage thresholds
3. Integrate testing into CI/CD pipeline
4. Add snapshot testing for critical components
5. Write E2E tests with Detox for critical user flows

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
