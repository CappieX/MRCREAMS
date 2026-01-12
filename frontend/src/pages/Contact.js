import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent } from '@mui/material';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          Contact
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Reach out for support, partnerships, or media inquiries.
        </Typography>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField label="Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
              <TextField label="Email" type="email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Message" fullWidth multiline rows={4} sx={{ mb: 3 }} value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button type="submit" variant="contained" sx={{ bgcolor: '#00B4D8' }}>
                Send
              </Button>
              {submitted && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Thanks, we’ll be in touch.
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Contact;
