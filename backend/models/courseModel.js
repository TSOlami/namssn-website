import mongoose from 'mongoose';

/**
 * Course schema for E-Test (e.g. CPT 111, MTH 101).
 */
const courseSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
      enum: ['100', '200', '300', '400', '500'],
    },
  },
  { timestamps: true }
);

courseSchema.index({ code: 1, level: 1 }, { unique: true });
courseSchema.index({ level: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
