import mongoose from 'mongoose';

/**
 * Single multiple-choice question belonging to a test.
 * options: array of strings (e.g. ['Option A', 'Option B', ...])
 * correctIndex: 0-based index of the correct option.
 */
const questionSchema = mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2 && v.length <= 6,
        message: 'Options must be 2–6 strings',
      },
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

questionSchema.index({ test: 1, order: 1 });

const Question = mongoose.model('Question', questionSchema);
export default Question;
