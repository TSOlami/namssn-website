import mongoose from "mongoose";

/**
 * Defines the schema for events in the database.
 */

const eventSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: false,
		},
		location: {
			type: String,
			required: false,
		},
		image: {
			type: String, // You can use a string to store the image URL or path
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		// Automatically generate createdAt and updatedAt timestamps
		timestamps: true,
	}
);

// Add indexes for frequently queried fields
eventSchema.index({ user: 1 });
eventSchema.index({ createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;