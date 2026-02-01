import { Link, useParams, useNavigate } from "react-router-dom";
import { Sidebar, HeaderComponent, AnnouncementContainer } from "../components";
import { useGetAttemptByIdQuery } from "../redux/slices/etestSlice";
import { motion } from "framer-motion";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

const AnswerReview = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { data: attempt, isLoading, error } = useGetAttemptByIdQuery(
    attemptId,
    { skip: !attemptId }
  );

  if (!attemptId) {
    navigate("/e-test", { replace: true });
    return null;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-row"
      >
        <Sidebar />
        <div className="w-full p-8">
          <div className="text-red-600">
            Failed to load attempt. You may not have access to it.
          </div>
          <Link
            to="/e-test"
            className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to E-Test
          </Link>
        </div>
        <AnnouncementContainer />
      </motion.div>
    );
  }

  if (isLoading || !attempt) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-row"
      >
        <Sidebar />
        <div className="w-full p-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <AnnouncementContainer />
      </motion.div>
    );
  }

  const answersWithDetails = attempt.answersWithDetails || [];
  const score = attempt.score ?? 0;
  const total = attempt.totalQuestions ?? 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const testTitle = attempt.test?.title || "Test";

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
          <HeaderComponent title="Result" url="Placeholder" />
        </div>
        <div className="p-4">
          <Link
            to="/e-test"
            className="text-primary hover:underline text-sm font-medium mb-4 inline-block"
          >
            ← Back to E-Test
          </Link>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {testTitle}
            </h2>
            <div className="flex flex-wrap gap-6 text-sm">
              <span className="text-gray-600">
                Score: <strong className="text-gray-900">{score}</strong> /{" "}
                {total}
              </span>
              <span className="text-gray-600">
                Percentage: <strong className="text-gray-900">{percentage}%</strong>
              </span>
              {attempt.timeSpentSeconds != null && (
                <span className="text-gray-600">
                  Time:{" "}
                  <strong className="text-gray-900">
                    {Math.floor(attempt.timeSpentSeconds / 60)}m{" "}
                    {attempt.timeSpentSeconds % 60}s
                  </strong>
                </span>
              )}
            </div>
          </div>
          <div className="space-y-6">
            {answersWithDetails.map((item, index) => {
              const correct = item.selectedIndex === item.correctIndex;
              return (
                <div
                  key={item.questionId || index}
                  className={`rounded-xl shadow-md p-5 border ${
                    correct ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <p className="font-medium text-gray-800 mb-3">
                    {index + 1}. {item.text}
                  </p>
                  <div className="space-y-1 mb-3">
                    {(item.options || []).map((opt, optIndex) => {
                      const isSelected = item.selectedIndex === optIndex;
                      const isCorrect = item.correctIndex === optIndex;
                      return (
                        <p
                          key={optIndex}
                          className={`text-sm pl-2 ${
                            isCorrect
                              ? "text-green-700 font-medium"
                              : isSelected
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {OPTION_LABELS[optIndex] ?? optIndex + 1}. {opt}
                          {isCorrect && " ✓"}
                          {isSelected && !isCorrect && " (your answer)"}
                        </p>
                      );
                    })}
                  </div>
                  {item.explanation && (
                    <p className="text-sm text-gray-600 border-t pt-3 mt-3">
                      <strong>Explanation:</strong> {item.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <AnnouncementContainer />
    </motion.div>
  );
};

export default AnswerReview;
