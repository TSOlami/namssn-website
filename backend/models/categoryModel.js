import mongoose from 'mongoose';

// Category Schema
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
	unique: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session', // Reference to sessions
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
}
);

const Category = mongoose.model('Category', categorySchema);

export default Category;