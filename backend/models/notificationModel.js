import mongoose from "mongoose";

/**
 * Defines the schema for notifications in the database.
 */

const notificationSchema = mongoose.Schema({
		text: {
				type: String,
				required: true,
		},
		user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
		},
		upvote: {
				type: Boolean,
				default: false,
		},
		downvote: {
				type: Boolean,
				default: false,
		},
		post:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post", // Reference to the Post model
		},
		comment:{
			type: Boolean,
			default: false,
		},
		triggeredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", //Reference to the user who triggered the notification
		},
		seen: {
				type: Boolean,
				default: false,
		},
  },
	{
		timestamps: true,
	}
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;