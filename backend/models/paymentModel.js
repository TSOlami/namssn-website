import mongoose from 'mongoose';

/**
 * Defines the schema for payments in the database.
 */
const paymentSchema = mongoose.Schema(
  {
    matricNumber: {
      type: String, // Matriculation number of the student
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
      ref: 'Category',
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    // The amount of the payment.
    amount: {
      type: Number,
      required: true,
    },
    // Reference to the user who made the payment.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who made the payment
      required: true,
    },
    // The date when the payment was created (defaults to the current date).
    date: {
      type: Date,
      default: Date.now,
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
