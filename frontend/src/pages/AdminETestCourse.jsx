import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Sidebar, HeaderComponent } from "../components";
import {
  useAdminGetTestsByCourseQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useBulkAddQuestionsMutation,
} from "../redux/slices/adminApiSlice";
import { ETestCourseListSkeleton } from "../components/skeletons";
import { motion } from "framer-motion";

const AdminETestCourse = () => {
  const { courseId } = useParams();
  const [testTitle, setTestTitle] = useState("");
  const [testSemester, setTestSemester] = useState("");
  const [testYear, setTestYear] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [isPublished, setIsPublished] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");

  const { data: tests, isLoading } = useAdminGetTestsByCourseQuery(courseId, { skip: !courseId });
  const [createTest, { isLoading: isCreating }] = useCreateTestMutation();
  const [updateTest] = useUpdateTestMutation();
  const [bulkAddQuestions, { isLoading: isAddingQuestions }] = useBulkAddQuestionsMutation();

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!testTitle.trim() || !courseId) return;
    try {
      await createTest({
        courseId,
        title: testTitle.trim(),
        semester: testSemester.trim(),
        year: testYear.trim(),
        timeLimitMinutes: Number(timeLimitMinutes) || 30,
        isPublished,
      }).unwrap();
      setTestTitle("");
      setTestSemester("");
      setTestYear("");
      setTimeLimitMinutes(30);
      setIsPublished(false);
    } catch (err) {
      alert(err?.data?.message || "Failed to create test");
    }
  };

  const handlePublishToggle = async (test) => {
    try {
      await updateTest({ testId: test._id, isPublished: !test.isPublished }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to update");
    }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!selectedTestId || !bulkJson.trim()) {
      alert("Select a test and paste questions JSON.");
      return;
    }
    let questions;
    try {
      questions = JSON.parse(bulkJson);
    } catch {
      alert("Invalid JSON. Use format: [{ \"text\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctIndex\": 0 }]");
      return;
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      alert("Questions must be a non-empty array.");
      return;
    }
    try {
      await bulkAddQuestions({ testId: selectedTestId, questions }).unwrap();
      setBulkJson("");
      setSelectedTestId("");
      alert(`Added ${questions.length} question(s).`);
    } catch (err) {
      alert(err?.data?.message || "Failed to add questions");
    }
  };

  if (!courseId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row w-full"
    >
      <Sidebar />
      <div className="w-full min-w-[370px]">
        <HeaderComponent title="E-Test (Manage tests)" />
        <div className="p-4">
          <Link to="/admin/e-test" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to courses
          </Link>

          <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
            <h3 className="font-semibold text-lg mb-3">Add test (Past Question set)</h3>
            <form onSubmit={handleCreateTest} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. 2023/2024 First Semester"
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Semester</label>
                <input
                  type="text"
                  value={testSemester}
                  onChange={(e) => setTestSemester(e.target.value)}
                  placeholder="e.g. First"
                  className="border rounded-lg px-3 py-2 w-28"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Year</label>
                <input
                  type="text"
                  value={testYear}
                  onChange={(e) => setTestYear(e.target.value)}
                  placeholder="e.g. 2023"
                  className="border rounded-lg px-3 py-2 w-24"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Time (min)</label>
                <input
                  type="number"
                  min={1}
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2 w-20"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span className="text-sm">Published</span>
              </label>
              <button
                type="submit"
                disabled={isCreating || !testTitle.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isCreating ? "Adding…" : "Add test"}
              </button>
            </form>
          </div>

          <h3 className="font-semibold text-lg mb-3">Tests</h3>
          {isLoading ? (
            <ETestCourseListSkeleton count={3} />
          ) : tests && tests.length > 0 ? (
            <div className="space-y-3 mb-8">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{test.title}</h4>
                    <p className="text-sm text-gray-500">
                      {test.semester && `${test.semester} · `}{test.year && `${test.year} · `}
                      {test.questionCount ?? 0} questions · {test.timeLimitMinutes ?? 30} min
                      {test.isPublished ? " · Published" : " · Draft"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handlePublishToggle(test)}
                      className={`px-3 py-1.5 text-sm rounded-lg ${test.isPublished ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"}`}
                    >
                      {test.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No tests yet. Add one above.</p>
          )}

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <h3 className="font-semibold text-lg mb-3">Bulk add questions</h3>
            <p className="text-sm text-gray-500 mb-2">
              Paste a JSON array. Each item: <code className="bg-gray-100 px-1 rounded">{"{ \"text\": \"Question?\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctIndex\": 0, \"explanation\": \"optional\" }"}</code>
            </p>
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="border rounded-lg px-3 py-2 mb-3 w-full max-w-xs"
            >
              <option value="">Select test</option>
              {(tests || []).map((t) => (
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder='[{"text":"What is 2+2?","options":["3","4","5"],"correctIndex":1}]'
              rows={8}
              className="border rounded-lg px-3 py-2 w-full font-mono text-sm"
            />
            <button
              type="button"
              onClick={handleBulkAdd}
              disabled={isAddingQuestions || !selectedTestId || !bulkJson.trim()}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isAddingQuestions ? "Adding…" : "Add questions"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminETestCourse;
