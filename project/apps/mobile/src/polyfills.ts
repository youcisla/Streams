// CRITICAL: This must be imported first to setup global polyfills
console.log('🔧 Loading polyfills...');

// React Native get random values polyfill
import 'react-native-get-random-values';

// Comprehensive SharedArrayBuffer polyfill for React Native
try {
  // Define a more robust SharedArrayBuffer polyfill
  const createSharedArrayBufferPolyfill = () => {
    function SharedArrayBufferPolyfill(length: number) {
      const buffer = new ArrayBuffer(length);
      // Add shared property to make it distinguishable
      (buffer as any).shared = true;
      return buffer;
    }
    
    // Copy static methods from ArrayBuffer
    Object.setPrototypeOf(SharedArrayBufferPolyfill.prototype, ArrayBuffer.prototype);
    SharedArrayBufferPolyfill.isView = ArrayBuffer.isView;
    
    return SharedArrayBufferPolyfill as any;
  };

  // Check multiple contexts where SharedArrayBuffer might be missing
  if (typeof SharedArrayBuffer === 'undefined') {
    console.log('⚠️ SharedArrayBuffer not found, polyfilling...');
    
    const polyfill = createSharedArrayBufferPolyfill();
    
    // Set on global object (React Native)
    if (typeof global !== 'undefined') {
      global.SharedArrayBuffer = polyfill;
    }
    
    // Set on globalThis
    if (typeof globalThis !== 'undefined') {
      globalThis.SharedArrayBuffer = polyfill;
    }
    
    // Set on window (web environments)
    if (typeof window !== 'undefined') {
      (window as any).SharedArrayBuffer = polyfill;
    }
    
    console.log('✅ SharedArrayBuffer polyfill applied');
  } else {
    console.log('✅ SharedArrayBuffer already available');
  }
} catch (error) {
  console.log('❌ Error setting up SharedArrayBuffer polyfill:', error);
  // Fallback: create a minimal polyfill
  if (typeof global !== 'undefined' && typeof global.SharedArrayBuffer === 'undefined') {
    global.SharedArrayBuffer = ArrayBuffer as any;
  }
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

