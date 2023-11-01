import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    category: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true, // Required for both admin and user
    },
    // Reference to the user who made the payment.
    transactionReference: {
      type: String,
      required: false, // Not required for admin-added payments
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who made the payment
      required: true,
    },
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt timestamps
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
