import mongoose from 'mongoose';

/**
 * Defines the schema for payments in the database.
 */
const paymentSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
      ref: 'Category',
      required: true,
    },
    // Reference to the user who made the payment.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who made the payment
      required: true,
    },
  },
  {
    // Automatically generate createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

/**
 * Represents a payment record in the database.
 */
const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
