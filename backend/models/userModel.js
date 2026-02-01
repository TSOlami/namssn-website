import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the user schema using Mongoose.
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentEmail: {
      type: String,
      default: '',
    },
    matricNumber: {
      type: String,
      default: '',
    },
    level: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // Path or URL to the profile picture
    },
    bio: {
      type: String,
    },
    points: {
      type: Number,
      default: 0, // Default to 0 points
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to user's posts (if you have a Post model)
      },
    ],
    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource', // Reference to user's resources (if you have a Resource model)
      },
    ],
    payments: [
      {
        session: {
          type: String, // Session identifier (e.g., academic session)
        },
        amount: {
          type: Number,
        },
        date: {
          type: Date,
          default: Date.now, // Default to the current date
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false, // Default to false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // Default role is 'user'
    },
    otpGenerated: {
      type: Boolean,
      default: false, // Default to false
    },
    otpVerified: {
      type: Boolean,
      default: false, // Default to false
    },
    isBlocked: {
      type: Boolean,
      default: false, // Admin can block user; blocked users cannot use protected routes
    },
  },
  {
    timestamps: true, // Automatically generate createdAt and updatedAt timestamps
  }
);

// Add indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ level: 1 });
userSchema.index({ studentEmail: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Middleware to hash the password before saving it to the database.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare an entered password with the stored hashed password.
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// Create the User model using the user schema.
const User = mongoose.model('User', userSchema);

export default User;