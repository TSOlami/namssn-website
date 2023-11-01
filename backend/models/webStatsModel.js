import mongoose from 'mongoose';

/**
 * Defines the schema for web statistics in the database.
 * 
 * Note: This schema is not currently used in the application.
 * It is provided as an example of how to create a schema for
 * web statistics.
 */

const webStatsSchema = mongoose.Schema(
	  {
      // An array of user references who have signed up on the website.
      totalUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to users
        },
      ],
      // The total number of posts on the website.
      totalPosts: {
        type: Number,
        default: 0,
      },
      // The total number of blogs on the website.
      totalBlogs: {
        type: Number,
        default: 0,
      },
      // The total number of resources on the website.
      totalResources: {
        type: Number,
        default: 0,
      },
      // The total number of comments on the website.
      totalComments: {
        type: Number,
        default: 0,
      },
      // The total number of upvotes on the website.
      totalUpvotes: {
        type: Number,
        default: 0,
      },
      // The total number of downvotes on the website.
      totalDownvotes: {
        type: Number,
        default: 0,
      },
      // The total number of points of all users on the website.
      totalPoints: {
        type: Number,
        default: 0,
      },
      // An array of the all payments on the website.
      totalPayments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Payment', // Reference to payments
        },
      ],
      // The total number of payment categories on the website.
      totalPaymentCategories: {
        type: Number,
        default: 0,
      },
      // An array of the all sessions on the website.
      totalSessions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Session', // Reference to sessions
        },
      ],
      // The total number of events on the website.
      totalEvents: {
        type: Number,
        default: 0,
      },
      // The total number of announcements on the website.
      totalAnnouncements: {
        type: Number,
        default: 0,
      },
	  },
    {
      // Automatically generate createdAt and updatedAt timestamps.
      timestamps: true,
    }
);

/**
 * Represents web statistics in the database.
 */
const WebStats = mongoose.model('WebStats', webStatsSchema);

export default WebStats;
