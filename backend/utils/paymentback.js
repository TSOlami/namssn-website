// Import necessary modules
import axios from 'axios';
import Payment from '../models/paymentModel.js';

const initiatePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const apiURL = process.env.PSTK_PUBL;

    // Make a POST request to the Paystack Initialize Transaction endpoint
    const pstkResponse = await axios.post(
      apiURL,
      {
        email,
        amount: amount * 100, // Convert amount to kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PSTK_SECRET_KEY}`, // Replace with your actual secret key
        },
      }
    );

    if (pstkResponse.data.status) {
      const { authorization_url } = pstkResponse.data.data;
      const { reference } = pstkResponse.data.data;

      const newPayment = new Payment({
        matricNumber: req.body.matricNo,
        email: req.body.email,
        amount: req.body.amount,
        transactionReference: reference,
      });

      await newPayment.save();

      res.json({
        success: true,
        message: 'Payments details saved',
        payment_url: authorization_url,
        reference: reference,
      });
    } else {
      res.status(500).json({ error: 'Payment initiation failed' });
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const allPayments = await Payment.find({});
    res.json({ allPayments });
  } catch (error) {
    console.error('Error fetching payment records:', error);
    res.status(500).json({ error: 'Failed to fetch payment records' });
  }
};

export { initiatePayment, getAllPayments };
