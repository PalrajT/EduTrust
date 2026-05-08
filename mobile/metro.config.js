const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Set project root explicitly
config.projectRoot = projectRoot;
config.watchFolders = [projectRoot];

// Disable node externals to avoid the node:sea path issue on Windows
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Skip node: protocol modules
  if (moduleName.startsWith('node:')) {
    return {
      type: 'empty',
    };
  }
  
  // Use the default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// Explicitly disable unstable_enablePackageExports to avoid node: protocol issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
