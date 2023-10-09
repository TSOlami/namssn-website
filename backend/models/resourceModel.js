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
    // The path or URL to the resource file.
    fileUrl: {
      type: String,
    },
    // An array of user references who upvoted the resource.
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to users who upvoted the resource
      },
    ],
    // An array of user references who downvoted the resource.
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to users who downvoted the resource
      },
    ],
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
