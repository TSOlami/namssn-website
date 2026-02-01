import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, HeaderComponent } from "../components";
import {
  useAdminGetCoursesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
} from "../redux/slices/adminApiSlice";
import { ETestCourseListSkeleton } from "../components/skeletons";
import { motion } from "framer-motion";

const LEVELS = ["100", "200", "300", "400", "500"];

const AdminETest = () => {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("100");
  const { data: courses, isLoading } = useAdminGetCoursesQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;
    try {
      await createCourse({ code: code.trim(), title: title.trim(), level }).unwrap();
      setCode("");
      setTitle("");
      setLevel("100");
    } catch (err) {
      alert(err?.data?.message || "Failed to create course");
    }
  };

  const handleDelete = async (courseId, courseCode) => {
    if (!window.confirm(`Delete course ${courseCode}? This will delete all tests and questions.`)) return;
    try {
      await deleteCourse(courseId).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row w-full"
    >
      <Sidebar />
      <div className="w-full min-w-[370px]">
        <HeaderComponent title="E-Test (Admin)" />
        <div className="p-4">
          <Link to="/admin" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Dashboard
          </Link>

          <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
            <h3 className="font-semibold text-lg mb-3">Add course</h3>
            <form onSubmit={handleCreateCourse} className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Code (e.g. CPT 111)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="CPT 111"
                  className="border rounded-lg px-3 py-2 w-28"
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Course title"
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l} Level</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isCreating || !code.trim() || !title.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isCreating ? "Adding…" : "Add course"}
              </button>
            </form>
          </div>

          <h3 className="font-semibold text-lg mb-3">Courses</h3>
          {isLoading ? (
            <ETestCourseListSkeleton count={4} />
          ) : courses && courses.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md p-4 w-full max-w-[280px] border border-gray-100 flex flex-col gap-2"
                >
                  <span className="text-sm font-medium text-primary">{course.code}</span>
                  <h4 className="font-semibold text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-500">{course.level} Level · {course.testsCount ?? 0} tests</p>
                  <div className="flex gap-2 mt-2">
                    <Link
                      to={`/admin/e-test/course/${course._id}`}
                      className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:opacity-90"
                    >
                      Manage tests
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(course._id, course.code)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No courses yet. Add one above.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminETest;
