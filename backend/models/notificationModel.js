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
		comment: {
			type: Boolean,
			default: false,
		},
		triggeredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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