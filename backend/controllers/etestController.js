import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import Test from '../models/testModel.js';
import Question from '../models/questionModel.js';
import TestAttempt from '../models/testAttemptModel.js';

const getCourses = asyncHandler(async (req, res) => {
  const { level, search: searchParam } = req.query;
  const filter = level && ['100', '200', '300', '400', '500'].includes(level) ? { level } : {};
  const search = (searchParam || req.query.q || '').trim().slice(0, 100);
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'i');
    filter.$or = [{ code: re }, { title: re }];
  }
  const courses = await Course.find(filter).sort({ code: 1 });
  res.status(200).json(courses);
});

/**
 * Get all published tests for a course.
 * GET /api/v1/users/etest/courses/:courseId/tests
 */
const getTestsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  const tests = await Test.find({ course: courseId, isPublished: true })
    .sort({ year: -1, semester: 1 })
    .lean();
  res.status(200).json(tests);
});

/**
 * Get a single test with its questions (for taking the test).
 * Only returns questions with id, order, text, options (no correctIndex/explanation).
 * GET /api/v1/users/etest/tests/:testId
 */
const getTestById = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const test = await Test.findById(testId).populate('course', 'code title level').lean();
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  if (!test.isPublished) {
    res.status(403);
    throw new Error('Test is not published');
  }
  const questions = await Question.find({ test: testId })
    .sort({ order: 1 })
    .select('_id order text options')
    .lean();
  res.status(200).json({ ...test, questions });
});

/**
 * Submit an attempt: save answers and compute score.
 * POST /api/v1/users/etest/tests/:testId/attempt
 * Body: { answers: [{ questionId, selectedIndex }], timeSpentSeconds }
 */
const submitAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { answers: rawAnswers = [], timeSpentSeconds = 0 } = req.body;
  const answers = Array.isArray(rawAnswers)
    ? rawAnswers
    : rawAnswers && typeof rawAnswers === 'object'
      ? Object.keys(rawAnswers)
          .filter((k) => /^\d+$/.test(k))
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => rawAnswers[k])
      : [];
  const userId = req.user?._id;

  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  if (!test.isPublished) {
    res.status(403);
    throw new Error('Test is not published');
  }
  const questions = await Question.find({ test: testId }).select('_id correctIndex').lean();
  const correctMap = Object.fromEntries(
    questions.map((q) => [q._id.toString(), q.correctIndex])
  );

  let score = 0;
  const normalizedAnswers = answers.map((a) => {
    const questionId = a.questionId?.toString?.() || (a.questionId && String(a.questionId)) || '';
    let selectedIndex = Number(a.selectedIndex);
    if (Number.isNaN(selectedIndex) || selectedIndex < 0) selectedIndex = -1;
    const rawExpected = correctMap[questionId];
    const expected = typeof rawExpected === 'number' ? rawExpected : Number(rawExpected);
    const expectedNorm = Number.isNaN(expected) || expected < 0 ? -1 : expected;
    const inMap = Object.prototype.hasOwnProperty.call(correctMap, questionId);
    if (inMap && expectedNorm === selectedIndex) score += 1;
    return { questionId: a.questionId, selectedIndex };
  });

  const attempt = await TestAttempt.create({
    user: userId,
    test: testId,
    answers: normalizedAnswers,
    score,
    totalQuestions: questions.length,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
  });
  const populated = await TestAttempt.findById(attempt._id)
    .populate('test', 'title course timeLimitMinutes')
    .populate('test.course', 'code title')
    .lean();
  res.status(201).json({
    ...populated,
    score,
    totalQuestions: questions.length,
  });
});

/**
 * Get a single attempt (for review) including correct answers and explanations.
 * GET /api/v1/users/etest/attempts/:attemptId
 */
const getAttemptById = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const userId = req.user?._id;
  const attempt = await TestAttempt.findById(attemptId)
    .populate({ path: 'test', select: 'title course timeLimitMinutes', populate: { path: 'course', select: 'code title level' } })
    .lean();
  if (!attempt) {
    res.status(404);
    throw new Error('Attempt not found');
  }
  if (attempt.user.toString() !== userId?.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this attempt');
  }
  const questionIds = attempt.answers?.map((a) => a.questionId) || [];
  const questions = await Question.find({ _id: { $in: questionIds } })
    .sort({ order: 1 })
    .lean();
  const questionMap = Object.fromEntries(questions.map((q) => [q._id.toString(), q]));
  const answersWithDetails = (attempt.answers || []).map((a) => {
    const q = questionMap[a.questionId?.toString?.() || a.questionId];
    return {
      questionId: a.questionId,
      selectedIndex: a.selectedIndex,
      text: q?.text,
      options: q?.options,
      correctIndex: q?.correctIndex,
      explanation: q?.explanation,
    };
  });
  res.status(200).json({
    ...attempt,
    answersWithDetails,
  });
});

/**
 * Get current user's attempts (optionally filter by testId).
 * GET /api/v1/users/etest/attempts?testId=...
 */
const getUserAttempts = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const { testId } = req.query;
  const filter = { user: userId };
  if (testId) filter.test = testId;
  const attempts = await TestAttempt.find(filter)
    .populate('test', 'title course timeLimitMinutes')
    .populate('test.course', 'code title')
    .sort({ completedAt: -1 })
    .lean();
  res.status(200).json(attempts);
});

export {
  getCourses,
  getTestsByCourse,
  getTestById,
  submitAttempt,
  getAttemptById,
  getUserAttempts,
};
