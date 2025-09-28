// React Native polyfills
import 'react-native-get-random-values';

// Simple SharedArrayBuffer polyfill for React Native
if (typeof SharedArrayBuffer === 'undefined') {
  global.SharedArrayBuffer = ArrayBuffer as any;
}

// Additional React Native environment setup
if (typeof global !== 'undefined') {
  // Ensure crypto is available
  if (!global.crypto && typeof require !== 'undefined') {
    try {
      global.crypto = require('expo-crypto');
    } catch (e) {
      console.log('Warning: Could not setup crypto polyfill');
    }
  }
  
  // Additional global fixes for React Native environment
  if (!global.process) {
    global.process = require('process');
  }
  
  // Ensure global.Buffer exists
  if (!global.Buffer) {
    try {
      global.Buffer = require('buffer').Buffer;
    } catch (e) {
      console.log('Warning: Could not setup Buffer polyfill');
    }
  }
}

// Ensure globalThis is available
if (typeof globalThis === 'undefined') {
  (global as any).globalThis = global;
}

console.log('✅ Polyfills setup completed successfully');

export { };

