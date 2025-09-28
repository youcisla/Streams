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
      console.warn('Warning: Could not setup Buffer polyfill');
    }
  }
  
  // Setup crypto
  if (!global.crypto) {
    try {
      global.crypto = require('expo-crypto');
    } catch (e) {
      console.warn('Warning: Could not setup crypto polyfill');
    }
  }
}

console.log('✅ Polyfills loaded successfully');

export { };

