const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add platform-specific module resolution
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

module.exports = config;