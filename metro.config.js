const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'import'];

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If it's a relative import with a .js extension, try resolving it without the extension
  // This helps with some ESM packages that use explicit extensions which Metro sometimes struggles with
  if (moduleName.startsWith('.') && moduleName.endsWith('.js')) {
    try {
      return (originalResolveRequest || context.resolveRequest)(
        context,
        moduleName.slice(0, -3),
        platform
      );
    } catch (e) {
      // Fallback to original behavior
    }
  }
  
  return (originalResolveRequest || context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
