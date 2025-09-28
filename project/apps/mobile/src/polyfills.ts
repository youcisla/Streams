// CRITICAL: This must be imported first to setup global polyfills
console.log('🔧 Loading polyfills...');

// React Native get random values polyfill
import 'react-native-get-random-values';

// Improved SharedArrayBuffer polyfill for React Native
try {
  // Always apply polyfill in React Native environment for consistency
  const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
  
  if (isReactNative || typeof SharedArrayBuffer === 'undefined') {
    console.log('⚠️ Applying SharedArrayBuffer polyfill for React Native...');
    
    // Create a more compatible polyfill
    function SharedArrayBufferPolyfill(this: any, length: number) {
      if (!(this instanceof SharedArrayBufferPolyfill)) {
        return new (SharedArrayBufferPolyfill as any)(length);
      }
      
      const buffer = new ArrayBuffer(length);
      
      // Copy properties from ArrayBuffer
      Object.defineProperty(this, 'byteLength', {
        value: buffer.byteLength,
        writable: false,
        enumerable: true,
        configurable: false
      });
      
      // Copy the underlying data
      const view = new Uint8Array(buffer);
      Object.defineProperty(this, '_buffer', {
        value: view,
        writable: false,
        enumerable: false,
        configurable: false
      });
      
      return this;
    }
    
    // Set up prototype chain
    SharedArrayBufferPolyfill.prototype = Object.create(ArrayBuffer.prototype);
    SharedArrayBufferPolyfill.prototype.constructor = SharedArrayBufferPolyfill;
    
    // Add slice method
    SharedArrayBufferPolyfill.prototype.slice = function(start?: number, end?: number) {
      const length = this.byteLength;
      start = start || 0;
      end = end || length;
      
      if (start < 0) start = Math.max(0, length + start);
      if (end < 0) end = Math.max(0, length + end);
      
      start = Math.min(start, length);
      end = Math.min(end, length);
      
      const newLength = Math.max(0, end - start);
      const newBuffer = new (SharedArrayBufferPolyfill as any)(newLength);
      
      if (newLength > 0) {
        const sourceView = new Uint8Array(this._buffer.buffer, start, newLength);
        const targetView = new Uint8Array(newBuffer._buffer.buffer);
        targetView.set(sourceView);
      }
      
      return newBuffer;
    };
    
    // Add static methods
    SharedArrayBufferPolyfill.isView = ArrayBuffer.isView;
    
    // Apply the polyfill to all global contexts more safely
    const polyfill = SharedArrayBufferPolyfill as any;
    
    try {
      if (typeof global !== 'undefined') {
        Object.defineProperty(global, 'SharedArrayBuffer', {
          value: polyfill,
          writable: true,
          configurable: true
        });
      }
    } catch (e) {
      console.log('Could not define SharedArrayBuffer on global:', e);
    }
    
    try {
      if (typeof globalThis !== 'undefined') {
        Object.defineProperty(globalThis, 'SharedArrayBuffer', {
          value: polyfill,
          writable: true,
          configurable: true
        });
      }
    } catch (e) {
      console.log('Could not define SharedArrayBuffer on globalThis:', e);
    }
    
    try {
      if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'SharedArrayBuffer', {
          value: polyfill,
          writable: true,
          configurable: true
        });
      }
    } catch (e) {
      console.log('Could not define SharedArrayBuffer on window:', e);
    }
    
    console.log('✅ SharedArrayBuffer polyfill applied successfully');
  } else {
    console.log('✅ SharedArrayBuffer is available and working');
  }
} catch (error) {
  console.error('❌ Critical error setting up SharedArrayBuffer polyfill:', error);
  // Emergency fallback
  const emergencyPolyfill = function(length: number) {
    return new ArrayBuffer(length);
  };
  
  if (typeof global !== 'undefined') {
    global.SharedArrayBuffer = emergencyPolyfill as any;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.SharedArrayBuffer = emergencyPolyfill as any;
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

