const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Disable hierarchical lookup to prevent version conflicts
config.resolver.disableHierarchicalLookup = true;

// Add better module resolution for monorepo
config.resolver.platforms = ['native', 'android', 'ios', 'web'];
config.resolver.alias = {
  '@streamlink/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
  '@streamlink/config': path.resolve(workspaceRoot, 'packages/config/src'),
};

// Ensure proper handling of node_modules resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add Node.js polyfills for React Native compatibility
config.resolver.alias = {
  ...config.resolver.alias,
  'punycode': 'punycode/punycode.js',
};

// Add explicit dependency resolution to prevent issues
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

// Block problematic metro-runtime versions to prevent conflicts
config.resolver.blockList = [
  /node_modules\/.*\/metro-runtime@0\.83\.1\/.*$/,
  /.*\/metro-runtime\/src\/modules\/empty-module\.js$/,
];

// Ensure better dependency resolution for monorepo
config.resolver.sourceExts = ['js', 'ts', 'tsx', 'jsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'];

module.exports = config;