import mongoose from 'mongoose';

/**
 * Defines the schema for post comments in the database.
 */

const postCommentSchema = mongoose.Schema(
  {
    // The content of the post comment.
    text: {
      type: String,
      required: true,
    },
    // An array of user references who upvoted the post comment.
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to users who upvoted the post comment
      },
    ],
    // An array of user references who downvoted the post comment.
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to users who downvoted the post comment
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model who created the post comment
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to the Post model
      required: true,
    },
  },
  {
    // Automatically generate createdAt and updatedAt timestamps.
    timestamps: true,
  }
);
/**
 * Represents a post in the database.
 */
const PostComment = mongoose.model('PostComment', postCommentSchema);

export default PostComment;
