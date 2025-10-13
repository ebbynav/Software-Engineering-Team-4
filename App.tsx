import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts';
import { ThemeDemoScreen } from './src/screens';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeDemoScreen />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
