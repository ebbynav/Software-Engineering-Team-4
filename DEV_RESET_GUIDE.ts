/**
 * Development Utility: Reset App State
 * 
 * This file helps you reset the app to its initial state for testing.
 * Useful when you want to test the onboarding flow again.
 * 
 * HOW TO USE:
 * 
 * 1. On Web:
 *    - Open browser console (F12)
 *    - Copy and paste the code from the "WEB RESET" section below
 *    - Refresh the page
 * 
 * 2. On Mobile (React Native Debugger):
 *    - Shake device to open Dev Menu
 *    - Tap "Debug" to open Chrome debugger
 *    - Run the code from "MOBILE RESET" section in console
 *    - Reload the app
 * 
 * 3. On Mobile (Manual):
 *    - Shake device
 *    - Tap "Delete all data"
 *    - Reload app
 */

// ============================================
// WEB RESET (Copy to browser console)
// ============================================

/*
// Clear all app storage
localStorage.clear();
console.log('✅ Web storage cleared! Refresh the page to start fresh.');
console.log('You will now see the onboarding screen.');
*/

// ============================================
// MOBILE RESET (Use React Native Debugger)
// ============================================

/*
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.clear()
  .then(() => {
    console.log('✅ AsyncStorage cleared! Reload the app to start fresh.');
    console.log('You will now see the onboarding screen.');
  })
  .catch((error) => {
    console.error('❌ Failed to clear storage:', error);
  });
*/

// ============================================
// RESET SPECIFIC KEYS (For targeted testing)
// ============================================

/*
// Reset only onboarding state (on web)
localStorage.removeItem('@waytrove_has_seen_onboarding');
console.log('✅ Onboarding state cleared!');

// Reset only auth state (on web)
localStorage.removeItem('@waytrove_auth');
console.log('✅ Auth state cleared!');
*/

// ============================================
// CHECK CURRENT STATE
// ============================================

/*
// On Web - Check what's stored
console.log('Current storage state:');
console.log('Has seen onboarding:', localStorage.getItem('@waytrove_has_seen_onboarding'));
console.log('Is authenticated:', localStorage.getItem('@waytrove_auth'));
console.log('All keys:', Object.keys(localStorage));
*/

export {};
