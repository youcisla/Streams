// Fix SharedArrayBuffer issue first - this must happen before any other imports
if (typeof globalThis !== 'undefined' && !globalThis.SharedArrayBuffer) {
  try {
    // Define SharedArrayBuffer as a proper constructor
    globalThis.SharedArrayBuffer = class SharedArrayBuffer {
      constructor(length: number) {
        return new ArrayBuffer(length);
      }
      static get [Symbol.species]() {
        return ArrayBuffer;
      }
    } as any;
  } catch (error) {
    // Fallback: try with Object.defineProperty
    try {
      Object.defineProperty(globalThis, 'SharedArrayBuffer', {
        value: ArrayBuffer,
        configurable: true,
        writable: true,
        enumerable: false,
      });
    } catch (fallbackError) {
      console.warn('Could not define SharedArrayBuffer polyfill');
    }
  }
}

// React Native polyfills
import 'react-native-get-random-values';

// Environment polyfills - only apply if needed
if (typeof global !== 'undefined') {
  // Setup process
  if (!global.process) {
    global.process = require('process');
  }
  
  // Setup Buffer
  if (!global.Buffer) {
    try {
      global.Buffer = require('buffer').Buffer;
    } catch (e) {
      // Silent fallback
    }
  }
  
  // Setup crypto
  if (!global.crypto) {
    try {
      global.crypto = require('expo-crypto');
    } catch (e) {
      // Silent fallback
    }
  }
}

export { };

