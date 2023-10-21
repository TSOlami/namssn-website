// Import necessary modules
import axios from 'axios';
import Payment from '../models/paymentModel.js';
import Category from '../models/categoryModel.js';
import User from '../models/userModel.js';




const initiatePayment = async (req, res) => {
  try {
        const { email, amount, category } = req.body;
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
  const { transactionReference } = req.body; // Assuming the reference number is sent in the request body

  try {
    // Make a request to Paystack's verify endpoint
    const verifyResponse = await axios.get(
      `${process.env.PAYSTACK_VERIFY_URL}/${transactionReference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = verifyResponse.data;

    // Extract the required information from the response
    const transactionStatus = paymentData.data.status;
    const paymentAmount = paymentData.data.amount;
    const paymentMethod = paymentData.data.channel || '';

    const verificationResult = {
      reference: transactionReference,
      status: transactionStatus === 'success' ? 'success' : 'failed',
      amount: paymentAmount,
      method: paymentMethod,
    };
    // console.log(verificationResult)

    res.status(200).json(verificationResult);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      reference: transactionReference,
      status: 'error',
      message: 'Internal Server Error',
    });
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
