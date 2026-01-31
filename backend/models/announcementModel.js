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
		level: {
			type: String,
       	 	enum: ['100', '200', '300', '400', '500', 'Non-Student'],
 		    required: true,
		  },
	},
	{
		timestamps: true,
	}
);

// Add indexes for frequently queried fields
announcementSchema.index({ user: 1 });
announcementSchema.index({ level: 1 });
announcementSchema.index({ createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
