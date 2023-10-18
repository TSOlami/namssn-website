// Import necessary modules
import axios from 'axios';
import Payment from '../models/paymentModel.js';
import Category from '../models/categoryModel.js';
import User from '../models/userModel.js';




const initiatePayment = async (req, res) => {
  try {
        const { email, amount, category } = req.body;
        const apiURL = process.env.PAYSTACK_URL;
        const categoryResult = await Category.findOne({ name: category });
        const userResult = await User.findOne({ email: email });
        const categoryId = categoryResult._id;
        const userId = userResult._id;
 
    // Make a POST requEst to the Paystack Initialize Transaction endpoint
      const paystackResponse = await axios.post( `${process.env.PAYSTACK_URL}`
        ,
        {
          email,
          amount: amount * 100, // Convert amount to kobo
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Replace with your actual secret key
          },
        }
      );

    if (paystackResponse.data.status) {
      const { authorization_url } = paystackResponse.data.data;
      const { reference } = paystackResponse.data.data;
      
      const newPayment = new Payment({
        category : categoryId,
        transactionReference: reference,
        user: userId
      });

      await newPayment.save();

      res.json({
        success: true,
        message: 'Payment Details saved. You will be redirected to Payment window',
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

const verifyPayments = async (req, res) => {
  try {
    const last10Payments = await Payment.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest
      .limit(10); // Limit to the last 10 payments
      console.log(last10Payments)
    const verificationResults = [];

    for (const payment of last10Payments) {
      const transactionReference = payment.transactionReference;
      try {
        // Make a request to Paystack's verify endpoint
        const verifyResponse = await axios.get(`${process.env.PAYSTACK_VERIFY_URL}/${transactionReference}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        });

        const paymentData = verifyResponse.data;

        // Check the transaction status within the data object
        const transactionStatus = paymentData.data.status;

        verificationResults.push({
          user: payment.user,
          category: payment.category,
          reference: payment.transactionReference,
          status: transactionStatus === 'success' ? 'success' : 'failed',
        });
      } catch (error) {
        console.error('Error verifying payment:', error);
        verificationResults.push({
          user: payment.user,
          category: payment.category,
          reference: payment.transactionReference,
          status: 'error',
        });
      }
    }

    res.status(200).json(verificationResults);
  } catch (error) {
    console.error('Error retrieving payments:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const userId = req.user._id
    const allPayments = await Payment.find({ user: userId});
    res.json({ allPayments });
  } catch (error) {
    console.error('Error fetching payment records:', error);
    res.status(500).json({ error: 'Failed to fetch payment records' });
  }
};

export { initiatePayment,verifyPayments, getAllPayments };
