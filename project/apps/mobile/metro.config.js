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
  // Add explicit path for inline-style-prefixer
  'inline-style-prefixer/lib/createPrefixer': path.resolve(workspaceRoot, 'node_modules/inline-style-prefixer/lib/createPrefixer.js'),
  'inline-style-prefixer': path.resolve(workspaceRoot, 'node_modules/inline-style-prefixer'),
};

// Add polyfills for missing APIs and ensure proper initialization
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false, // Changed to false to ensure proper order
    },
  }),
};

// Add runtime initialization to ensure polyfills are loaded first
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: () => {
    return (path) => {
      // Prioritize index.js to ensure polyfills load first
      if (path.endsWith('index.js')) {
        return 0;
      }
      return path;
    };
  },
};

// Add explicit dependency resolution to prevent issues
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

// Ensure proper resolver configuration
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Let Metro handle the resolution normally
  return context.resolveRequest(context, moduleName, platform);
};

// Ensure better dependency resolution for monorepo
config.resolver.sourceExts = ['js', 'ts', 'tsx', 'jsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'];

module.exports = config;