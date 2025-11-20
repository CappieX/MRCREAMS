const { query } = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentIntegrationService {
  /**
   * Create Stripe customer
   */
  async createCustomer(userId, customerData) {
    try {
      const { email, firstName, lastName, phone } = customerData;

      const customer = await stripe.customers.create({
        email: email,
        name: `${firstName} ${lastName}`,
        phone: phone,
        metadata: {
          userId: userId,
          platform: 'mrcreams'
        }
      });

      // Store Stripe customer ID
      await query(
        `INSERT INTO payment_customers (user_id, provider, customer_id, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, provider) 
         DO UPDATE SET customer_id = $3, updated_at = NOW()`,
        [userId, 'stripe', customer.id]
      );

      return {
        success: true,
        data: {
          customerId: customer.id,
          email: customer.email
        }
      };
    } catch (error) {
      console.error('Create Stripe customer error:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Create payment intent for therapy session
   */
  async createSessionPaymentIntent(userId, sessionId, amount, currency = 'usd') {
    try {
      // Get session details
      const sessionResult = await query(
        `SELECT s.id, s.title, s.scheduled_at, s.duration_minutes,
                t.first_name as therapist_first_name, t.last_name as therapist_last_name
         FROM therapy_sessions s
         JOIN users t ON s.therapist_id = t.id
         WHERE s.id = $1`,
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult.rows[0];

      // Get or create Stripe customer
      const customer = await this.getOrCreateStripeCustomer(userId);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        customer: customer.customerId,
        metadata: {
          userId: userId,
          sessionId: sessionId,
          type: 'therapy_session'
        },
        description: `Therapy session: ${session.title} with ${session.therapist_first_name} ${session.therapist_last_name}`,
        automatic_payment_methods: {
          enabled: true
        }
      });

      // Store payment intent
      await query(
        `INSERT INTO payment_intents (user_id, provider, intent_id, amount, currency, status, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [userId, 'stripe', paymentIntent.id, amount, currency, paymentIntent.status, JSON.stringify({
          sessionId: sessionId,
          type: 'therapy_session'
        })]
      );

      return {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          currency: currency
        }
      };
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create subscription for recurring therapy sessions
   */
  async createSubscription(userId, subscriptionData) {
    try {
      const { priceId, sessionFrequency, therapistId } = subscriptionData;

      // Get or create Stripe customer
      const customer = await this.getOrCreateStripeCustomer(userId);

      const subscription = await stripe.subscriptions.create({
        customer: customer.customerId,
        items: [{ price: priceId }],
        metadata: {
          userId: userId,
          therapistId: therapistId,
          sessionFrequency: sessionFrequency,
          platform: 'mrcreams'
        },
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });

      // Store subscription
      await query(
        `INSERT INTO subscriptions (user_id, provider, subscription_id, status, price_id, metadata, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [userId, 'stripe', subscription.id, subscription.status, priceId, JSON.stringify({
          therapistId: therapistId,
          sessionFrequency: sessionFrequency
        })]
      );

      return {
        success: true,
        data: {
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice.payment_intent.client_secret,
          status: subscription.status
        }
      };
    } catch (error) {
      console.error('Create subscription error:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  async handleStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPayment(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleSubscriptionPaymentFailure(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object);
          break;
      }

      return { success: true };
    } catch (error) {
      console.error('Stripe webhook handling error:', error);
      throw new Error('Failed to handle webhook event');
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntent) {
    try {
      const { userId, sessionId, type } = paymentIntent.metadata;

      // Update payment intent status
      await query(
        'UPDATE payment_intents SET status = $1, updated_at = NOW() WHERE intent_id = $2',
        ['succeeded', paymentIntent.id]
      );

      if (type === 'therapy_session' && sessionId) {
        // Update session payment status
        await query(
          'UPDATE therapy_sessions SET payment_status = $1, updated_at = NOW() WHERE id = $2',
          ['paid', sessionId]
        );

        // Send confirmation email
        const emailService = require('./emailService');
        await emailService.sendPaymentConfirmation(userId, sessionId);
      }

      // Log payment success
      await query(
        `INSERT INTO payment_logs (user_id, provider, event_type, amount, currency, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, 'stripe', 'payment_succeeded', paymentIntent.amount / 100, paymentIntent.currency, JSON.stringify({
          paymentIntentId: paymentIntent.id,
          sessionId: sessionId
        })]
      );
    } catch (error) {
      console.error('Handle payment success error:', error);
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailure(paymentIntent) {
    try {
      const { userId, sessionId } = paymentIntent.metadata;

      // Update payment intent status
      await query(
        'UPDATE payment_intents SET status = $1, updated_at = NOW() WHERE intent_id = $2',
        ['failed', paymentIntent.id]
      );

      if (sessionId) {
        // Update session payment status
        await query(
          'UPDATE therapy_sessions SET payment_status = $1, updated_at = NOW() WHERE id = $2',
          ['failed', sessionId]
        );
      }

      // Log payment failure
      await query(
        `INSERT INTO payment_logs (user_id, provider, event_type, amount, currency, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, 'stripe', 'payment_failed', paymentIntent.amount / 100, paymentIntent.currency, JSON.stringify({
          paymentIntentId: paymentIntent.id,
          sessionId: sessionId,
          failureReason: paymentIntent.last_payment_error?.message
        })]
      );
    } catch (error) {
      console.error('Handle payment failure error:', error);
    }
  }

  /**
   * Handle subscription payment
   */
  async handleSubscriptionPayment(invoice) {
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const { userId, therapistId, sessionFrequency } = subscription.metadata;

      // Update subscription status
      await query(
        'UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE subscription_id = $2',
        [subscription.status, subscription.id]
      );

      // Create recurring therapy sessions
      if (subscription.status === 'active') {
        await this.createRecurringSessions(userId, therapistId, sessionFrequency);
      }

      // Log subscription payment
      await query(
        `INSERT INTO payment_logs (user_id, provider, event_type, amount, currency, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, 'stripe', 'subscription_payment', invoice.amount_paid / 100, invoice.currency, JSON.stringify({
          subscriptionId: subscription.id,
          invoiceId: invoice.id
        })]
      );
    } catch (error) {
      console.error('Handle subscription payment error:', error);
    }
  }

  /**
   * Get or create Stripe customer
   */
  async getOrCreateStripeCustomer(userId) {
    try {
      // Check if customer already exists
      const existingCustomer = await query(
        'SELECT customer_id FROM payment_customers WHERE user_id = $1 AND provider = $2',
        [userId, 'stripe']
      );

      if (existingCustomer.rows.length > 0) {
        return { customerId: existingCustomer.rows[0].customer_id };
      }

      // Get user details
      const userResult = await query(
        'SELECT email, first_name, last_name FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        metadata: {
          userId: userId,
          platform: 'mrcreams'
        }
      });

      // Store customer ID
      await query(
        `INSERT INTO payment_customers (user_id, provider, customer_id, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [userId, 'stripe', customer.id]
      );

      return { customerId: customer.id };
    } catch (error) {
      console.error('Get or create Stripe customer error:', error);
      throw new Error('Failed to get or create customer');
    }
  }

  /**
   * Create recurring therapy sessions
   */
  async createRecurringSessions(userId, therapistId, frequency) {
    try {
      const sessionInterval = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;
      const nextSessionDate = new Date();
      nextSessionDate.setDate(nextSessionDate.getDate() + sessionInterval);

      // Create next session
      await query(
        `INSERT INTO therapy_sessions (therapist_id, client_id, title, description, scheduled_at, duration_minutes, status, payment_status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [therapistId, userId, 'Recurring Therapy Session', 'Regular therapy session', nextSessionDate, 60, 'scheduled', 'pending']
      );
    } catch (error) {
      console.error('Create recurring sessions error:', error);
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId, limit = 50) {
    try {
      const result = await query(
        `SELECT pl.event_type, pl.amount, pl.currency, pl.metadata, pl.created_at,
                pi.intent_id, pi.status as payment_status
         FROM payment_logs pl
         LEFT JOIN payment_intents pi ON pl.metadata->>'paymentIntentId' = pi.intent_id
         WHERE pl.user_id = $1
         ORDER BY pl.created_at DESC
         LIMIT $2`,
        [userId, limit]
      );

      return result.rows.map(row => ({
        eventType: row.event_type,
        amount: row.amount,
        currency: row.currency,
        status: row.payment_status,
        metadata: JSON.parse(row.metadata || '{}'),
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Get payment history error:', error);
      return [];
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId, subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      // Update subscription status
      await query(
        'UPDATE subscriptions SET status = $1, updated_at = NOW() WHERE subscription_id = $2',
        ['canceled', subscriptionId]
      );

      return {
        success: true,
        message: 'Subscription will be canceled at the end of the current period',
        data: {
          subscriptionId: subscriptionId,
          cancelAt: new Date(subscription.current_period_end * 1000)
        }
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get subscription details
   */
  async getSubscriptionDetails(userId) {
    try {
      const result = await query(
        'SELECT subscription_id, status, price_id, metadata, created_at FROM subscriptions WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const subscription = result.rows[0];
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscription_id);

      return {
        subscriptionId: subscription.subscription_id,
        status: subscription.status,
        priceId: subscription.price_id,
        metadata: JSON.parse(subscription.metadata || '{}'),
        createdAt: subscription.created_at,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
      };
    } catch (error) {
      console.error('Get subscription details error:', error);
      return null;
    }
  }

  // Additional webhook handlers
  async handleSubscriptionUpdate(subscription) {
    // Implementation for subscription updates
  }

  async handleSubscriptionCancellation(subscription) {
    // Implementation for subscription cancellations
  }

  async handleSubscriptionPaymentFailure(invoice) {
    // Implementation for subscription payment failures
  }
}

module.exports = new PaymentIntegrationService();
