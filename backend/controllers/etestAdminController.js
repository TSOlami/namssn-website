import asyncHandler from 'express-async-handler';
import { createRequire } from 'module';
import mongoose from 'mongoose';
import Course from '../models/courseModel.js';
import Test from '../models/testModel.js';
import Question from '../models/questionModel.js';
import TestAttempt from '../models/testAttemptModel.js';
import { extractQuestionsFromText } from '../utils/etestUtils/extractQuestionsFromText.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

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
 * Get all questions for a test (admin).
 * GET /api/v1/admin/etest/tests/:testId/questions
 */
const getQuestionsByTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  const questions = await Question.find({ test: testId }).sort({ order: 1 }).lean();
  res.status(200).json(questions);
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
 * Extract questions from uploaded PDF.
 * POST /api/v1/admin/etest/extract-questions
 * Multipart: file field "pdf"
 */
const extractQuestionsFromPdf = asyncHandler(async (req, res) => {
  const file = req.files?.pdf;
  if (!file) {
    res.status(400);
    throw new Error('No PDF file uploaded. Use form field "pdf".');
  }
  if (!file.mimetype?.includes('pdf') && !file.name?.toLowerCase().endsWith('.pdf')) {
    res.status(400);
    throw new Error('File must be a PDF.');
  }
  const buffer = file.data ?? file;
  let rawText;
  try {
    const data = await pdfParse(buffer);
    rawText = data?.text ?? '';
  } catch (err) {
    console.error('PDF parse error:', err);
    res.status(400);
    throw new Error('Could not read PDF. Ensure the file is a valid, non-image PDF.');
  }
  if (!rawText?.trim()) {
    res.status(400);
    throw new Error('No text could be extracted from the PDF (e.g. image-only PDF).');
  }
  const { questions, errors } = extractQuestionsFromText(rawText);
  res.status(200).json({
    questions,
    errors: errors.length ? errors : undefined,
    rawTextPreview: rawText.slice(0, 500),
  });
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
 * Reorder a question (swap with neighbour). Single request, atomic swap.
 * POST /api/v1/admin/etest/questions/:questionId/reorder
 * Body: { direction: 'up' | 'down' }
 */
const reorderQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { direction } = req.body;
  if (direction !== 'up' && direction !== 'down') {
    res.status(400);
    throw new Error('direction must be "up" or "down"');
  }
  const question = await Question.findById(questionId).select('test order').lean();
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }
  const testId = question.test;
  const questions = await Question.find({ test: testId }).sort({ order: 1 }).select('_id order').lean();
  const idx = questions.findIndex((q) => q._id.toString() === questionId);
  if (idx < 0) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= questions.length) {
    res.status(400);
    throw new Error('Cannot move further in that direction');
  }
  const orderA = questions[idx].order;
  const orderB = questions[swapIdx].order;
  await Question.bulkWrite([
    { updateOne: { filter: { _id: questions[idx]._id }, update: { $set: { order: orderB } } } },
    { updateOne: { filter: { _id: questions[swapIdx]._id }, update: { $set: { order: orderA } } } },
  ]);
  const updated = await Question.find({ test: testId }).sort({ order: 1 }).lean();
  res.status(200).json({ questions: updated });
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
  const courseId = req.params.courseId;
  const [tests, questionCounts] = await Promise.all([
    Test.find({ course: courseId })
      .populate('course', 'code title level')
      .sort({ year: -1, semester: 1 })
      .lean(),
    Question.aggregate([
      { $lookup: { from: 'tests', localField: 'test', foreignField: '_id', as: 'testDoc' } },
      { $unwind: '$testDoc' },
      { $match: { 'testDoc.course': new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: '$test', count: { $sum: 1 } } },
    ]),
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
  getQuestionsByTest,
  addQuestion,
  bulkAddQuestions,
  extractQuestionsFromPdf,
  updateQuestion,
  reorderQuestion,
  deleteQuestion,
  adminGetCourses,
  adminGetTestsByCourse,
};
