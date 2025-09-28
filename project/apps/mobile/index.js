// Essential polyfills - applied synchronously before any imports
(() => {
  'use strict';
  
  // Fix SharedArrayBuffer globally and immediately
  const ArrayBufferPolyfill = ArrayBuffer;
  if (typeof SharedArrayBuffer === 'undefined') {
    global.SharedArrayBuffer = ArrayBufferPolyfill;
  }
  if (typeof globalThis === 'undefined') {
    global.globalThis = global;
  }
  if (typeof globalThis.SharedArrayBuffer === 'undefined') {
    globalThis.SharedArrayBuffer = ArrayBufferPolyfill;
  }
  
  // Ensure all contexts have SharedArrayBuffer
  if (typeof window !== 'undefined' && typeof window.SharedArrayBuffer === 'undefined') {
    window.SharedArrayBuffer = ArrayBufferPolyfill;
  }
})();

// Import polyfills
import './src/polyfills';

// Import expo-router entry
import 'expo-router/entry';

