const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Define a POST route for initiating a payment
app.post('/api/initiatePayment', async (req, res) => {
  try {
    const { email, amount, callbackUrl } = req.body;

    const paystackResponse = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert amount to kobo
        callback_url: callbackUrl, // Include the callback URL
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.status) {
      const { authorization_url, reference } = paystackResponse.data.data;
      res.json({ payment_url: authorization_url, reference });
    } else {
      res.status(500).json({ error: 'Payment initiation failed' });
    }
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// Define a GET route for verifying payment status
app.get('/api/verifyPayment/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    const verificationResponse = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (verificationResponse.data.status) {
      const transactionData = verificationResponse.data.data;
      res.json({
        reference: transactionData.reference,
        status: transactionData.status,
      });
    } else {
      res.status(500).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ... Other routes and server setup ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
