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
    // A description or additional information about the resource.
    description: {
      type: String,
    },
    // Reference to the user who created the resource.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the resource
      required: true,
    },
    uploaderName: {
      type: String,
      required: true
    },
    // The path or URL to the resource file.
    fileUrl: {
      type: String,
    },
    // The level in which the resource is relevant.
    level: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    }
  },
  {
    // Automatically generate createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

/**
 * Represents a resource in the database.
 */
const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
