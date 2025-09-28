// Load polyfills first - CRITICAL for SharedArrayBuffer support
import './src/polyfills';

import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

console.log('📱 Initializing StreamLink mobile app...');

// Define the App component for Expo Router
export default function App() {
  console.log('🔄 Creating Expo Router context...');
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

console.log('🔄 Registering root component...');

// Register the root component with error handling
try {
  registerRootComponent(App);
  console.log('✅ Root component registered successfully');
} catch (error) {
  console.error('❌ Failed to register root component:', error);
}