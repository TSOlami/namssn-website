import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

/**
 * Defines the schema for user OTP verification in the database.
 */

const userOTPVerificationSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},

	otp: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},

	expiresAt: {
		type: Date,
		default: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
	},
});

// Middleware to hash the otp before saving it to the database.
userOTPVerificationSchema.pre('save', async function(next) {
	if (!this.isModified('otp')) {
	  next();
	}
  
	const salt = await bcrypt.genSalt(10);
	this.otp = await bcrypt.hash(this.otp, salt);
  });
  
  // Method to compare an entered otp with the stored hashed password.
  userOTPVerificationSchema.methods.matchOtp = async function(enteredOtp) {
	return await bcrypt.compare(enteredOtp, this.otp);
  }

const UserOTPVerification = mongoose.model("UserOTPVerification", userOTPVerificationSchema);

export default UserOTPVerification;