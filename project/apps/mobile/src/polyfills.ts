// CRITICAL: This must be imported first to setup global polyfills
console.log('🔧 Loading polyfills...');

// React Native get random values polyfill
import 'react-native-get-random-values';

// Comprehensive SharedArrayBuffer polyfill
try {
  // Check multiple contexts where SharedArrayBuffer might be missing
  if (typeof SharedArrayBuffer === 'undefined') {
    console.log('⚠️ SharedArrayBuffer not found, polyfilling...');
    
    // Set on global object
    if (typeof global !== 'undefined') {
      (global as any).SharedArrayBuffer = ArrayBuffer;
    }
    
    // Set on globalThis
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).SharedArrayBuffer = ArrayBuffer;
    }
    
    // Set on window (web environments)
    if (typeof window !== 'undefined') {
      (window as any).SharedArrayBuffer = ArrayBuffer;
    }
    
    console.log('✅ SharedArrayBuffer polyfill applied');
  } else {
    console.log('✅ SharedArrayBuffer already available');
  }
} catch (error) {
  console.log('❌ Error setting up SharedArrayBuffer polyfill:', error);
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
}

console.log('✅ Polyfills setup completed');

export { };

