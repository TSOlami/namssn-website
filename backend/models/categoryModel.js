import mongoose from 'mongoose';

// Category Schema
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
	unique: true,
  },
  status: {
    type: Boolean,
    required: true,
	default: false,
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;