import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import Test from '../models/testModel.js';
import Question from '../models/questionModel.js';
import TestAttempt from '../models/testAttemptModel.js';

/**
 * Create a course.
 * POST /api/v1/admin/etest/courses
 * Body: { code, title, level }
 */
const createCourse = asyncHandler(async (req, res) => {
  const { code, title, level } = req.body;
  if (!code || !title || !level) {
    res.status(400);
    throw new Error('code, title, and level are required');
  }
  const existing = await Course.findOne({ code: code.trim().toUpperCase(), level });
  if (existing) {
    res.status(400);
    throw new Error('Course with this code and level already exists');
  }
  const course = await Course.create({
    code: code.trim().toUpperCase(),
    title: title.trim(),
    level,
  });
  res.status(201).json(course);
});

/**
 * Update a course.
 * PUT /api/v1/admin/etest/courses/:courseId
 */
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.courseId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.status(200).json(course);
});

/**
 * Delete a course (and its tests/questions - cascade handled by deleting tests).
 * DELETE /api/v1/admin/etest/courses/:courseId
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  const tests = await Test.find({ course: course._id }).select('_id');
  const testIds = tests.map((t) => t._id);
  await Question.deleteMany({ test: { $in: testIds } });
  await TestAttempt.deleteMany({ test: { $in: testIds } });
  await Test.deleteMany({ course: course._id });
  await course.deleteOne();
  res.status(200).json({ message: 'Course deleted' });
});

/**
 * Create a test.
 * POST /api/v1/admin/etest/courses/:courseId/tests
 * Body: { title, description?, semester?, year?, timeLimitMinutes?, isPublished? }
 */
const createTest = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  const { title, description, semester, year, timeLimitMinutes, isPublished } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('title is required');
  }
  const test = await Test.create({
    course: courseId,
    title: title.trim(),
    description: description?.trim() || '',
    semester: semester?.trim() || '',
    year: year?.trim() || '',
    timeLimitMinutes: timeLimitMinutes ?? 30,
    isPublished: Boolean(isPublished),
  });
  const populated = await Test.findById(test._id).populate('course', 'code title level').lean();
  res.status(201).json(populated);
});

/**
 * Update a test.
 * PUT /api/v1/admin/etest/tests/:testId
 */
const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findByIdAndUpdate(
    req.params.testId,
    req.body,
    { new: true, runValidators: true }
  ).populate('course', 'code title level');
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  res.status(200).json(test);
});

/**
 * Delete a test and its questions and attempts.
 * DELETE /api/v1/admin/etest/tests/:testId
 */
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  await Question.deleteMany({ test: test._id });
  await TestAttempt.deleteMany({ test: test._id });
  await test.deleteOne();
  res.status(200).json({ message: 'Test deleted' });
});

/**
 * Add a single question.
 * POST /api/v1/admin/etest/tests/:testId/questions
 * Body: { order?, text, options: string[], correctIndex, explanation? }
 */
const addQuestion = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  const { order, text, options, correctIndex, explanation } = req.body;
  if (!text || !Array.isArray(options) || typeof correctIndex !== 'number') {
    res.status(400);
    throw new Error('text, options (array), and correctIndex are required');
  }
  if (correctIndex < 0 || correctIndex >= options.length) {
    res.status(400);
    throw new Error('correctIndex must be a valid option index');
  }
  const maxOrder = await Question.findOne({ test: testId }).sort({ order: -1 }).select('order').lean();
  const nextOrder = order != null ? Number(order) : ((maxOrder?.order ?? -1) + 1);
  const question = await Question.create({
    test: testId,
    order: nextOrder,
    text: text.trim(),
    options: options.map((o) => String(o).trim()),
    correctIndex,
    explanation: explanation?.trim() || '',
  });
  res.status(201).json(question);
});

/**
 * Bulk add questions.
 * POST /api/v1/admin/etest/tests/:testId/questions/bulk
 * Body: { questions: [{ text, options, correctIndex, explanation? }, ...] }
 */
const bulkAddQuestions = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  const { questions: inputQuestions } = req.body;
  if (!Array.isArray(inputQuestions) || inputQuestions.length === 0) {
    res.status(400);
    throw new Error('questions array is required and must not be empty');
  }
  const maxOrder = await Question.findOne({ test: testId }).sort({ order: -1 }).select('order').lean();
  let nextOrder = (maxOrder?.order ?? -1) + 1;
  const toInsert = inputQuestions.map((q) => {
    const text = q.text?.trim();
    const options = Array.isArray(q.options) ? q.options.map((o) => String(o).trim()) : [];
    const correctIndex = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
    if (!text || options.length < 2) return null;
    return {
      test: testId,
      order: nextOrder++,
      text,
      options,
      correctIndex: Math.min(Math.max(0, correctIndex), options.length - 1),
      explanation: q.explanation?.trim() || '',
    };
  }).filter(Boolean);
  if (toInsert.length === 0) {
    res.status(400);
    throw new Error('No valid questions to add');
  }
  const inserted = await Question.insertMany(toInsert);
  res.status(201).json({ count: inserted.length, questions: inserted });
});

/**
 * Update a question.
 * PUT /api/v1/admin/etest/questions/:questionId
 */
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  res.status(200).json(question);
});

/**
 * Delete a question.
 * DELETE /api/v1/admin/etest/questions/:questionId
 */
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.questionId);
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  await question.deleteOne();
  res.status(200).json({ message: 'Question deleted' });
});

/**
 * Get all courses (admin) - includes unpublished test counts.
 * GET /api/v1/admin/etest/courses
 */
const adminGetCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ level: 1, code: 1 }).lean();
  const testsCount = await Test.aggregate([
    { $group: { _id: '$course', count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(testsCount.map((t) => [t._id.toString(), t.count]));
  const withCounts = courses.map((c) => ({
    ...c,
    testsCount: countMap[c._id.toString()] ?? 0,
  }));
  res.status(200).json(withCounts);
});

/**
 * Get all tests for a course (admin - includes unpublished).
 * GET /api/v1/admin/etest/courses/:courseId/tests
 */
const adminGetTestsByCourse = asyncHandler(async (req, res) => {
  const tests = await Test.find({ course: req.params.courseId })
    .populate('course', 'code title level')
    .sort({ year: -1, semester: 1 })
    .lean();
  const questionCounts = await Question.aggregate([
    { $match: { test: { $in: tests.map((t) => t._id) } } },
    { $group: { _id: '$test', count: { $sum: 1 } } },
  ]);
  const qMap = Object.fromEntries(questionCounts.map((q) => [q._id.toString(), q.count]));
  const withCounts = tests.map((t) => ({
    ...t,
    questionCount: qMap[t._id.toString()] ?? 0,
  }));
  res.status(200).json(withCounts);
});

export {
  createCourse,
  updateCourse,
  deleteCourse,
  createTest,
  updateTest,
  deleteTest,
  addQuestion,
  bulkAddQuestions,
  updateQuestion,
  deleteQuestion,
  adminGetCourses,
  adminGetTestsByCourse,
};
