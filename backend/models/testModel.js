import mongoose from 'mongoose';

/**
 * Test (Past Question set) belonging to a course.
 */
const testSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    semester: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: '',
    },
    timeLimitMinutes: {
      type: Number,
      default: 30,
      min: 1,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

testSchema.index({ course: 1 });
testSchema.index({ isPublished: 1 });

const Test = mongoose.model('Test', testSchema);
export default Test;
