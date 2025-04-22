// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add additional modules to handle Firebase dependencies
defaultConfig.resolver.sourceExts.push('cjs');

// Add extra configurations for React Native web compatibility
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');

// Increase watchman timeout for Firebase operations
defaultConfig.watchFolders = [__dirname];
defaultConfig.server = {
  ...defaultConfig.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Extend timeouts for long-running operations
      req.setTimeout(30000);
      middleware(req, res, next);
    };
  },
};

module.exports = defaultConfig; 