const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken, requireRole } = require('../middleware/auth');
const paymentIntegrationService = require('../services/paymentIntegrationService');

router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const sub = await paymentIntegrationService.getSubscriptionDetails(userId);
    const trial = await paymentIntegrationService.getUserTrialInfo(userId);
    res.json({ success: true, data: { subscription: sub, trial } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get subscription' });
  }
});

router.post('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tier, priceId, currency = 'usd' } = req.body;
    const result = await paymentIntegrationService.setUserSubscriptionTier(userId, { tier, priceId, currency });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set subscription' });
  }
});

router.post('/payment/initialize', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, currency, gateway, description } = req.body;
    const init = await paymentIntegrationService.initializePayment({ userId, amount, currency, gateway, description });
    res.json({ success: true, data: init });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment initialization failed' });
  }
});

router.post('/webhook/:gateway', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const gateway = req.params.gateway;
    const headers = req.headers;
    const rawBody = req.body;
    const result = await paymentIntegrationService.handleWebhook(gateway, rawBody, headers);
    res.json({ received: true, success: result.success });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Webhook processing failed' });
  }
});

router.post('/admin/payment/credentials', authenticateToken, requireRole(['admin', 'super_admin', 'platform_admin', 'it_admin']), async (req, res) => {
  try {
    const { provider, credentials } = req.body;
    const saved = await paymentIntegrationService.storeGatewayCredentials(provider, credentials);
    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to store credentials' });
  }
});

module.exports = router;
