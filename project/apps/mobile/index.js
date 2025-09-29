// COMPREHENSIVE POLYFILLS - Must be first before ANY imports
(function() {
  'use strict';
  
  // Get the primary global object
  const globalObj = (function() {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof global !== 'undefined') return global;
    if (typeof window !== 'undefined') return window;
    if (typeof self !== 'undefined') return self;
    return {};
  })();

  // 1. SharedArrayBuffer polyfill
  if (!globalObj.SharedArrayBuffer) {
    function SharedArrayBuffer(length) {
      const buffer = new ArrayBuffer(length);
      Object.defineProperty(buffer, 'constructor', {
        value: SharedArrayBuffer,
        writable: false,
        enumerable: false,
        configurable: false
      });
      return buffer;
    }
    SharedArrayBuffer.prototype = ArrayBuffer.prototype;
    SharedArrayBuffer.prototype.constructor = SharedArrayBuffer;
    
    try {
      Object.defineProperty(globalObj, 'SharedArrayBuffer', {
        value: SharedArrayBuffer,
        writable: false,
        enumerable: false,
        configurable: true
      });
    } catch (e) {
      globalObj.SharedArrayBuffer = SharedArrayBuffer;
    }
  }

  // 2. FormData polyfill for React Native
  if (!globalObj.FormData) {
    function FormData() {
      this._fields = [];
    }
    FormData.prototype.append = function(name, value, filename) {
      this._fields.push({name, value, filename});
    };
    FormData.prototype.get = function(name) {
      const field = this._fields.find(f => f.name === name);
      return field ? field.value : null;
    };
    FormData.prototype.has = function(name) {
      return this._fields.some(f => f.name === name);
    };
    FormData.prototype.delete = function(name) {
      this._fields = this._fields.filter(f => f.name !== name);
    };
    FormData.prototype.set = function(name, value, filename) {
      this.delete(name);
      this.append(name, value, filename);
    };
    FormData.prototype.entries = function*() {
      for (const field of this._fields) {
        yield [field.name, field.value];
      }
    };
    FormData.prototype.keys = function*() {
      for (const field of this._fields) {
        yield field.name;
      }
    };
    FormData.prototype.values = function*() {
      for (const field of this._fields) {
        yield field.value;
      }
    };
    FormData.prototype[Symbol.iterator] = FormData.prototype.entries;
    
    globalObj.FormData = FormData;
  }

  // 3. Blob polyfill if needed
  if (!globalObj.Blob && !globalObj.File) {
    function Blob(parts, options) {
      this.size = 0;
      this.type = (options && options.type) || '';
      if (parts) {
        for (const part of parts) {
          if (typeof part === 'string') {
            this.size += part.length;
          }
        }
      }
    }
    globalObj.Blob = Blob;
  }

  // 4. Basic polyfills for other missing APIs
  if (!globalObj.crypto && typeof require !== 'undefined') {
    try {
      // Only set crypto if expo-crypto is available
      const expoCrypto = require('react-native-get-random-values');
      if (expoCrypto) {
        globalObj.crypto = {
          getRandomValues: function(array) {
            // Basic fallback
            for (let i = 0; i < array.length; i++) {
              array[i] = Math.floor(Math.random() * 256);
            }
            return array;
          }
        };
      }
    } catch (e) {
      // Silent fail
    }
  }

  // 5. Ensure process exists
  if (!globalObj.process && typeof require !== 'undefined') {
    try {
      globalObj.process = require('process');
    } catch (e) {
      globalObj.process = {
        env: {},
        platform: 'react-native',
        version: '1.0.0'
      };
    }
  }

  // 6. Buffer polyfill
  if (!globalObj.Buffer && typeof require !== 'undefined') {
    try {
      globalObj.Buffer = require('buffer').Buffer;
    } catch (e) {
      // Silent fail
    }
  }

})();

// Now safely import React Native modules  
import 'react-native-get-random-values';

// Import expo-router entry using import instead of require to avoid circular dependency
import 'expo-router/entry';
