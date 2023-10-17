import mongoose from "mongoose";

/**
 * Defines the schema for announcements in the database.
 */

const announcementSchema = mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
