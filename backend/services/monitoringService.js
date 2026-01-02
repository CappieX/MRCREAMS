const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'mr-creams-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const activeUsersGauge = new client.Gauge({
  name: 'active_users_total',
  help: 'Total number of active users (socket connections)',
  labelNames: ['type']
});

const databaseQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(activeUsersGauge);
register.registerMetric(databaseQueryDuration);

class MonitoringService {
  constructor() {
    this.register = register;
    this.metrics = {
      httpRequestDurationMicroseconds,
      activeUsersGauge,
      databaseQueryDuration
    };
  }

  /**
   * Middleware to track HTTP request duration
   */
  requestDurationMiddleware(req, res, next) {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      // Clean up route path (remove query params, replace IDs)
      const route = req.route ? req.route.path : req.path;
      end({ method: req.method, route, code: res.statusCode });
    });
    next();
  }

  /**
   * Get all metrics in Prometheus format
   */
  async getMetrics() {
    return await register.metrics();
  }

  /**
   * Get Content-Type for metrics
   */
  getContentType() {
    return register.contentType;
  }
}

module.exports = new MonitoringService();
