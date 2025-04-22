const { createWebpackConfigAsync } = require('expo-cli/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
    }
  }, argv);

  // Customize the config before returning it
  return config;
}; 