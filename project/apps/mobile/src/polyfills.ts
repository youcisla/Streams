// Global polyfills for React Native

// Polyfill SharedArrayBuffer if it doesn't exist
if (typeof globalThis !== 'undefined' && typeof globalThis.SharedArrayBuffer === 'undefined') {
  globalThis.SharedArrayBuffer = ArrayBuffer as any;
}

// Ensure global is available for React Native
if (typeof global !== 'undefined' && typeof (global as any).SharedArrayBuffer === 'undefined') {
  (global as any).SharedArrayBuffer = ArrayBuffer;
}

// Export to make this a module
export { };
