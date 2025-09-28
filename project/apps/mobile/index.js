// Load polyfills first
import './src/polyfills';

import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Main App component
export default function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

// Register the root component
registerRootComponent(App);