import { Link, useParams, useNavigate } from "react-router-dom";
import { Sidebar, HeaderComponent, AnnouncementContainer } from "../components";
import { useGetTestsByCourseQuery } from "../redux/slices/etestSlice";
import { ETestCourseListSkeleton } from "../components/skeletons";
import { motion } from "framer-motion";

const ETestCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: tests, isLoading, error } = useGetTestsByCourseQuery(courseId, {
    skip: !courseId,
  });

  if (!courseId) {
    navigate("/e-test", { replace: true });
    return null;
  }

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
          <Link
            to="/e-test"
            className="text-primary hover:underline text-sm font-medium mb-4 inline-block"
          >
            ← Back to courses
          </Link>
          {error && (
            <div className="text-red-600 py-4">
              Failed to load tests. The course may not exist.
            </div>
          )}
          {isLoading ? (
            <ETestCourseListSkeleton count={4} />
          ) : tests && tests.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-around mt-4">
              {tests.map((test) => (
                <Link
                  key={test._id}
                  to={`/e-test/take/${test._id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg hover:ring-2 hover:ring-primary/50 p-5 w-full max-w-[320px] min-h-[100px] transition-all"
                >
                  <h3 className="font-semibold text-lg text-gray-900">
                    {test.title}
                  </h3>
                  {test.timeLimitMinutes && (
                    <p className="text-sm text-gray-500 mt-1">
                      {test.timeLimitMinutes} min
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 font-serif">
              <p>No tests available for this course yet.</p>
              <p className="text-sm mt-2">Check back later.</p>
            </div>
          )}
        </div>
      </div>
      <AnnouncementContainer />
    </motion.div>
  );
};

export default ETestCourse;
