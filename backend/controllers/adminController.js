import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Payment from '../models/paymentModel.js';
import Blog from '../models/blogModel.js';

// @desc Get all payments for all users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getAllPayments = asyncHandler(async (req, res) => {
  // Fetch all payment records from the payment model
  const allPayments = await Payment.find().populate('user');

  res.status(200).json(allPayments);
});

// @desc Create a new blog
// Route POST /api/v1/users/blogs
// Access Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // You can access the currently logged-in user's information from req.user
  const userId = req.user._id;

  // Create a new blog
  const newBlog = new Blog({
    title,
    content,
    user: userId, // Associate the blog with the user who created it
  });

  // Save the new blog to the database
  const createdBlog = await newBlog.save();

  res.status(201).json(createdBlog);
});

// @desc Get user's blogs (My Blogs)
// Route GET /api/v1/users/blogs
// Access Private
const getUserBlogs = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's blogs from the database
  const userBlogs = await Blog.find({ user: userId })
  .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest blogs first)

  res.status(200).json(userBlogs);
});

// @desc Update user blog
// Route PUT /api/v1/users/blogs/:blogId
// Access Private
const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const blogId = req.params.blogId;

  // Find the blog by ID
  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if the user has permission to update this blog (e.g., they are the owner)
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Unauthorized to update this blog');
  }

  // Update the blog
  blog.title = title;
  blog.content = content;
  const updatedBlog = await blog.save();

  res.status(200).json(updatedBlog);
});

// @desc Delete user blog
// Route DELETE /api/v1/users/blogs/:blogId
// Access Private
const deleteBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  // Find the blog by ID
  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if the user has permission to delete this blog (e.g., they are the owner)
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Unauthorized to delete this blog');
  }

  // Delete the blog
  await blog.remove();

  res.status(200).json({ message: 'Blog deleted' });
});


// Create Announcement
const createAnnouncement = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  // Create a new announcement
  const newAnnouncement = new Announcement({
    text,
    user: userId, // Associate the announcement with the user who created it
  });

  // Save the new announcement to the database
  const createdAnnouncement = await newAnnouncement.save();

  res.status(201).json(createdAnnouncement);
});

// Update Announcement
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const announcementId = req.params.announcementId;

  // Find the announcement by ID
  const announcement = await Announcement.findById(announcementId);

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  // Check if the user has permission to update this announcement (e.g., they are the owner)
  if (announcement.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Unauthorized to update this announcement');
  }

  // Update the announcement
  announcement.text = text;
  const updatedAnnouncement = await announcement.save();

  res.status(200).json(updatedAnnouncement);
});

// Delete Announcement
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcementId = req.params.announcementId;

  // Find the announcement by ID
  const announcement = await Announcement.findById(announcementId);

  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }

  // Check if the user has permission to delete this announcement (e.g., they are the owner)
  if (announcement.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Unauthorized to delete this announcement');
  }

  // Delete the announcement
  await announcement.remove();

  res.status(200).json({ message: 'Announcement deleted' });
});


// Create Event
const createEvent = asyncHandler(async (req, res) => {
  const { image } = req.body; // You can add more event properties as needed
  const userId = req.user._id;

  // Create a new event
  const newEvent = new Event({
    image,
    user: userId, // Associate the event with the user who created it
  });

  // Save the new event to the database
  const createdEvent = await newEvent.save();

  res.status(201).json(createdEvent);
});

// Get User's Events (My Events)
const getUserEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's events from the database
  const userEvents = await Event.find({ user: userId }).sort({ createdAt: -1 }); // Sort by creation date in descending order (latest first)

  res.status(200).json(userEvents);
});

// Update Event
const updateEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId; // Get the event ID from the request parameters
  const { image } = req.body;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      // Event not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user making the request is the owner of the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this event' });
    }

    // Update the event's image
    event.image = image;

    // Save the updated event
    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete Event
const deleteEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  // Find the event by ID
  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if the user has permission to delete this event (e.g., they are the owner)
  if (event.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Unauthorized to delete this event');
  }

  // Delete the event
  await event.remove();

  res.status(200).json({ message: 'Event deleted' });
});

export {
  getAllPayments,
  createBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createEvent,
  getUserEvents,
  updateEvent,
  deleteEvent,
};
