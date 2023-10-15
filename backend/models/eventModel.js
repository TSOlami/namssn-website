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
		description: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
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
	}
);

const Event = mongoose.model("Event", eventSchema);

export default Event;