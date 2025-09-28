import './src/polyfills';// Load polyfills firstimport { registerRootComponent } from 'expo';

import { registerRootComponent } from 'expo';

import { ExpoRoot } from 'expo-router';import './src/polyfills';import { ExpoRoot } from 'expo-router';



export default function App() {import { registerRootComponent } from 'expo';

  const ctx = require.context('./app');

  return <ExpoRoot context={ctx} />;import { ExpoRoot } from 'expo-router';// Must be exported or React Native will error

}

export default function App() {

registerRootComponent(App);
// Main App component  const ctx = require.context('./app');

export default function App() {  return <ExpoRoot context={ctx} />;

  try {}

    const ctx = require.context('./app');

    return <ExpoRoot context={ctx} />;registerRootComponent(App);
  } catch (error) {
    console.error('App initialization error:', error);
    throw error;
  }
}

registerRootComponent(App);