const express = require('express');
const router = express.Router();
const monitoringService = require('../services/monitoringService');

/**
 * @route GET /metrics
 * @desc Expose Prometheus metrics
 * @access Public (Protected by network policy usually, or add auth if needed)
 */
router.get('/', async (req, res) => {
  try {
    res.set('Content-Type', monitoringService.getContentType());
    res.end(await monitoringService.getMetrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

module.exports = router;
