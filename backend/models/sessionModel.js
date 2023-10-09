import mongoose from 'mongoose';

// Define the session schema using Mongoose.
const sessionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duesPrice: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: false, // Default to false (inactive)
    },
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt timestamps
  }
);

// Create the Session model using the session schema.
const Session = mongoose.model('Session', sessionSchema);

export default Session;
