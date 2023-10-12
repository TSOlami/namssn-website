import mongoose from 'mongoose';

/**
 * Defines the schema for posts in the database.
 */
const postSchema = mongoose.Schema(
  {
    // The content of the post.
    text: {
      type: String,
      required: true,
    },
    // The path or URL to an image associated with the post.
    image: {
      type: String,
    },
    // Reference to the user who created the post.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who created the post
      required: true,
    },
    // An array of user references who upvoted the post.
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to users who upvoted the post
        default: 0
      },
    ],
    // An array of user references who downvoted the post.
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to users who downvoted the post
        default: 0
      },
    ],
  },
  {
    // Automatically generate createdAt and updatedAt timestamps.
    timestamps: true,
  }
);

/**
 * Represents a post in the database.
 */
const Post = mongoose.model('Post', postSchema);

export default Post;
