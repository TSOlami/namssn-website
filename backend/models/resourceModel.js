import mongoose from 'mongoose';

/**
 * Defines the schema for resources in the database.
 */
const resourceSchema = mongoose.Schema(
  {
    // The title or name of the resource.
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    // Reference to the user who created the resource.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the resource
      required: false,
    },
    uploaderName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
    },
    // The level in which the resource is relevant.
    level: {
      type: String,
      required: true,
    },
    isLarge: {
      type: Boolean,
      default: false,
    },
    course: {
      type: String,
      required: true,
    },
    botToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { transform: (doc, ret) => { delete ret.botToken; return ret; } },
  }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
