import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    category: {
      type: String,
      required: true, // Required for both admin and user
    },
    session: {
      type: String,
      required: true, // Required for both admin and user
    },
    amount: {
      type: Number,
      required: true, // Required for admin-added payments
    },
    name: {
      type: String,
      required: false, // Not required for admin-added payments
    },
    email: {
      type: String,
      required: false, // Not required for admin-added payments
    },
    transactionReference: {
      type: String,
      required: false, // Not required for admin-added payments
    },
    // Other fields and references specific to your application
    // ...
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt timestamps
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
