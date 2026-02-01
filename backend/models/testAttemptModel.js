import mongoose from 'mongoose';

/**
 * A user's attempt at a test (answers and score).
 */
const testAttemptSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        selectedIndex: { type: Number, required: true, min: -1 }, // -1 = skipped
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

testAttemptSchema.index({ user: 1, test: 1 });
testAttemptSchema.index({ user: 1 });

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
export default TestAttempt;
