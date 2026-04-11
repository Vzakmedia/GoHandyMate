// Shim for the 'ws' package — uses React Native's native WebSocket
const W = global.WebSocket;
module.exports = W;
module.exports.default = W;
module.exports.WebSocket = W;
