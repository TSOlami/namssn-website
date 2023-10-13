import mongoose from 'mongoose';

/**
 * Defines the schema for blog comments in the database.
 */

const blogCommentSchema = mongoose.Schema(
  {
    // The content of the blog comment.
    text: {
      type: String,
      required: true,
    },
    // An array of user references who upvoted the blog comment.
	upvotes: [
	  {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // Reference to users who upvoted the blog comment
	  },
	],
	// An array of user references who downvoted the blog comment.
	downvotes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // Reference to users who downvoted the blog comment
		}
	],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model who created the blog comment
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog', // Reference to the Blog model
      required: true,
    },
  },
  {
    // Automatically generate createdAt and updatedAt timestamps.
    timestamps: true,
  }
);
/**
 * Represents a blog comment in the database.
 */
const BlogComment = model('BlogComment', blogCommentSchema);

export default BlogComment;
