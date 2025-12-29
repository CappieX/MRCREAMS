const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.BACKEND_URL || 'http://127.0.0.1:5002',
      changeOrigin: true,
      ws: true,
      logLevel: 'silent',
      proxyTimeout: 30000,
      timeout: 30000,
    })
  );
};
