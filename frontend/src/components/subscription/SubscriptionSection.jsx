import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Tag, Table, Radio, Select, Button, Space, QRCode, Alert } from 'antd';
import axios from 'axios/dist/browser/axios.cjs';

const plans = [
  { key: 'free', name: 'Free', price: 0, currency: 'USD' },
  { key: 'trial', name: 'Trial', price: 0, currency: 'USD' },
  { key: 'premium', name: 'Premium', price: 9.99, currency: 'USD', priceId: process.env.REACT_APP_STRIPE_PRICE_ID || '' }
];

const columns = [
  { title: 'Event', dataIndex: 'eventType', key: 'eventType' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v) => v ? v.toFixed(2) : '-' },
  { title: 'Currency', dataIndex: 'currency', key: 'currency' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'succeeded' ? 'green' : s === 'failed' ? 'red' : 'blue'}>{s || 'pending'}</Tag> },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (d) => new Date(d).toLocaleString() }
];

export default function SubscriptionSection() {
  const [loading, setLoading] = useState(false);
  const [subInfo, setSubInfo] = useState(null);
  const [trialInfo, setTrialInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [gateway, setGateway] = useState('stripe');
  const [currency, setCurrency] = useState('USD');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [checkout, setCheckout] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const cfg = { headers: { Authorization: `Bearer ${token}` } };
      const subRes = await axios.get('/api/subscription', cfg);
      setSubInfo(subRes.data?.data?.subscription || null);
      setTrialInfo(subRes.data?.data?.trial || null);
      const histRes = await axios.get('/api/integrations/payments/history', cfg);
      setHistory(histRes.data?.data?.history || []);
    } catch (err) {
      console.error('Failed to load subscription data:', err);
      setError('Failed to load subscription data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePlanApply = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = plans.find(p => p.key === selectedPlan);
      const token = localStorage.getItem('authToken');
      const cfg = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { tier: selectedPlan, priceId: plan?.priceId || null, currency };
      const res = await axios.post('/api/subscription', payload, cfg);
      await loadData();
    } catch (err) {
      console.error('Failed to update subscription plan:', err);
      setError('Failed to update subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitializePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = plans.find(p => p.key === 'premium');
      const token = localStorage.getItem('authToken');
      const cfg = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { amount: plan.price, currency: currency, gateway, description: 'MR.CREAMS Premium Subscription' };
      const res = await axios.post('/api/payment/initialize', payload, cfg);
      setCheckout(res.data?.data || null);
    } catch (err) {
      console.error('Failed to initialize payment:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {error && (
        <Alert type="error" message={error} />
      )}
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Current Tier" value={subInfo ? 'Premium' : (trialInfo?.tier || 'Free')} />
            <Statistic title="Remaining Trial Days" value={trialInfo?.remainingDays || 0} />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Choose Plan" extra={<Button loading={loading} type="primary" onClick={handlePlanApply}>Apply</Button>}>
            <Space wrap>
              <Radio.Group value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                {plans.map(p => <Radio.Button key={p.key} value={p.key}>{p.name}</Radio.Button>)}
              </Radio.Group>
              <Select value={currency} onChange={setCurrency} options={[{ value: 'USD', label: 'USD' }, { value: 'ETB', label: 'ETB' }]} style={{ width: 120 }} />
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Payment Method">
            <Space direction="vertical">
              <Radio.Group value={gateway} onChange={(e) => setGateway(e.target.value)}>
                <Radio.Button value="stripe">International (Stripe)</Radio.Button>
                <Radio.Button value="chapa">Ethiopian (Chapa)</Radio.Button>
                <Radio.Button value="santimpay">Ethiopian (SantimPay)</Radio.Button>
              </Radio.Group>
              <Button loading={loading} type="primary" onClick={handleInitializePayment}>Initialize Payment</Button>
              {checkout?.provider === 'stripe' && checkout?.clientSecret && (
                <Alert type="info" message="Stripe client secret obtained. Complete payment in Stripe UI." />
              )}
              {checkout?.checkoutUrl && (
                <Alert type="success" message="Checkout initialized" description={<a href={checkout.checkoutUrl} target="_blank" rel="noreferrer">Open Payment</a>} />
              )}
              {checkout?.provider !== 'stripe' && checkout?.checkoutUrl && (
                <QRCode value={checkout.checkoutUrl} />
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Payment History">
            <Table rowKey={(r, i) => i} columns={columns} dataSource={history} pagination={{ pageSize: 5 }} />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
