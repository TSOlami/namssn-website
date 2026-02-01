import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, HeaderComponent, AnnouncementContainer } from "../components";
import { useGetCoursesQuery } from "../redux/slices/etestSlice";
import { ETestCourseListSkeleton } from "../components/skeletons";
import { motion } from "framer-motion";

const LEVELS = ["100", "200", "300", "400", "500"];

const ETestHome = () => {
  const [levelFilter, setLevelFilter] = useState("");
  const { data: courses, isLoading } = useGetCoursesQuery(
    levelFilter ? { level: levelFilter } : {}
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row"
    >
      <Sidebar />
      <div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
        <div className="sticky top-[0.01%] z-[300] bg-white w-full">
          <HeaderComponent title="E-TEST" url="Placeholder" />
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4 font-serif">
            Practice with past questions. Select a level and choose a course to start.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => setLevelFilter("")}
              className={`px-4 py-2 rounded-lg font-medium ${
                !levelFilter
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevelFilter(l)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  levelFilter === l
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {l} Level
              </button>
            ))}
          </div>
          {isLoading ? (
            <ETestCourseListSkeleton count={6} />
          ) : courses && courses.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-around">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/e-test/course/${course._id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg hover:ring-2 hover:ring-primary/50 p-5 w-full max-w-[320px] min-h-[100px] transition-all"
                >
                  <span className="text-sm font-medium text-primary">
                    {course.code}
                  </span>
                  <h3 className="font-semibold text-lg mt-1 text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.level} Level
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 font-serif">
              <p>No courses available yet.</p>
              <p className="text-sm mt-2">Check back later or try another level.</p>
            </div>
          )}
        </div>
      </div>
      <AnnouncementContainer />
    </motion.div>
  );
};

export default ETestHome;
