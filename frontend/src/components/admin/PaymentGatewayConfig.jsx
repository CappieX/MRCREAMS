import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, Alert } from 'antd';
import axios from 'axios';

export default function PaymentGatewayConfig() {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('stripe');
  const [saved, setSaved] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [provider]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const cfg = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post('/api/admin/payment/credentials', { provider, credentials: values }, cfg);
      setSaved(res.data?.data || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Payment Gateways">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Select value={provider} onChange={setProvider} options={[
          { value: 'stripe', label: 'Stripe' },
          { value: 'chapa', label: 'Chapa' },
          { value: 'santimpay', label: 'SantimPay' }
        ]} style={{ width: 240 }} />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          {provider === 'stripe' && (
            <>
              <Form.Item name="secretKey" label="Secret Key" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="webhookSecret" label="Webhook Secret" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}
          {provider === 'chapa' && (
            <>
              <Form.Item name="secretKey" label="Secret Key" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="callbackUrl" label="Callback URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="returnUrl" label="Return URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}
          {provider === 'santimpay' && (
            <>
              <Form.Item name="endpoint" label="API Endpoint" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="apiKey" label="API Key" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="merchantId" label="Merchant ID" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="webhookSecret" label="Webhook Secret" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="callbackUrl" label="Callback URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="returnUrl" label="Return URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </>
          )}
          <Button loading={loading} type="primary" htmlType="submit">Save</Button>
        </Form>

        {saved && <Alert type="success" message="Credentials saved" />}
      </Space>
    </Card>
  );
}
