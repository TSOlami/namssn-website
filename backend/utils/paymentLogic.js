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
          amount: amount * 100,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
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
    const paymentAmount = paymentData.data.amount / 100;
    const paymentMethod = paymentData.data.channel || '';

    const verificationResult = {
      reference: transactionReference,
      status: transactionStatus === 'success' ? 'success' : 'failed',
      amount: paymentAmount,
      method: paymentMethod,
    };

    res.status(200).json(verificationResult);
  } catch (error) {
    res.status(500).json({
      reference: transactionReference,
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};


export { initiatePayment,verifyPayments };
