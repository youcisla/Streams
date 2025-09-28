// Load polyfills first
import './src/polyfills';

// Import React and necessary components
import React from 'react';
import { AppRegistry, Text, View } from 'react-native';

// Try to use expo-router, with fallback
try {
  // Import expo-router entry
  require('expo-router/entry');
} catch (error) {
  console.error('Failed to load expo-router/entry:', error);

  // Fallback: register a simple app so "main" is always registered
  function FallbackApp() {
    return React.createElement(
      View,
      { 
        style: { 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 16,
          paddingTop: 50  // Simple top padding instead of SafeAreaView
        } 
      },
      React.createElement(Text, null, 'Expo Router failed to load. Check console logs.')
    );
  }

  // Register the main component
  AppRegistry.registerComponent('main', () => FallbackApp);
}
