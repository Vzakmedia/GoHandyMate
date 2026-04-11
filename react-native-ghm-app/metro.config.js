const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const WS_SHIM = path.resolve(__dirname, 'src/shims/ws.js');
const EMPTY_SHIM = path.resolve(__dirname, 'src/shims/empty.js');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  events: require.resolve('events'),
  buffer: require.resolve('buffer'),
  ws: WS_SHIM,
  url: EMPTY_SHIM,
  net: EMPTY_SHIM,
  tls: EMPTY_SHIM,
  fs: EMPTY_SHIM,
  http: EMPTY_SHIM,
  https: EMPTY_SHIM,
  zlib: EMPTY_SHIM,
  crypto: EMPTY_SHIM,
  'bufferutil': EMPTY_SHIM,
  'utf-8-validate': EMPTY_SHIM,
};

// Intercept ALL ws/* sub-path imports and redirect to our shim
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ws' || moduleName.startsWith('ws/')) {
    return { filePath: WS_SHIM, type: 'sourceFile' };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
