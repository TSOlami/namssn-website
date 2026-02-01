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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-row">
        <Sidebar />
        <div className="w-full p-8">
          <div className="text-red-600">Failed to load attempt. You may not have access to it.</div>
          <Link to="/e-test" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg">
            Back to E-Test
          </Link>
        </div>
        <AnnouncementContainer />
      </motion.div>
    );
  }

  if (isLoading || !attempt) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-row">
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
  const timeStr =
    attempt.timeSpentSeconds != null
      ? `${Math.floor(attempt.timeSpentSeconds / 60)}m ${attempt.timeSpentSeconds % 60}s`
      : null;
  const isGood = percentage >= 70;
  const isMid = percentage >= 40 && percentage < 70;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row"
    >
      <Sidebar />
      <div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
        <div className="sticky top-[0.01%] z-[300] bg-white w-full border-b border-gray-100">
          <HeaderComponent title="Result" url="Placeholder" />
        </div>
        <div className="p-4 bg-gray-50/50 min-h-[60vh]">
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              to="/e-test"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-sm"
            >
              ← Back to E-Test
            </Link>
            <Link
              to="/e-test"
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Take another test
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-4">{testTitle}</h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{score}</span>
                <span className="text-gray-500">/ {total}</span>
              </div>
              <span
                className={`inline-flex px-3 py-1 rounded-full font-semibold text-sm ${
                  isGood ? "bg-green-100 text-green-800" : isMid ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                }`}
              >
                {percentage}%
              </span>
              {timeStr && (
                <span className="text-gray-600 text-sm">Time: <strong>{timeStr}</strong></span>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-3">Corrections</h2>
          <p className="text-gray-600 text-sm mb-4">Review each question: green = correct, red = incorrect with the right answer and explanation.</p>

          <div className="space-y-4">
            {answersWithDetails.map((item, index) => {
              const correct = item.selectedIndex === item.correctIndex;
              const selectedOpt = item.selectedIndex >= 0 && item.options?.[item.selectedIndex];
              const correctOpt = item.options?.[item.correctIndex];

              return (
                <div
                  key={item.questionId || index}
                  className={`rounded-xl border shadow-sm p-4 sm:p-5 ${
                    correct ? "bg-green-50/60 border-green-200" : "bg-red-50/60 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                          correct ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <p className="font-medium text-gray-900">{item.text}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded ${
                      correct ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}>
                      {correct ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <div className="space-y-1.5 ml-10">
                    {(item.options || []).map((opt, optIndex) => {
                      const isSelected = item.selectedIndex === optIndex;
                      const isCorrectOpt = item.correctIndex === optIndex;
                      return (
                        <p
                          key={optIndex}
                          className={`text-sm pl-2 py-1 rounded ${
                            isCorrectOpt ? "text-green-800 font-medium bg-green-100/50" : isSelected && !correct ? "text-red-700 bg-red-100/50" : "text-gray-600"
                          }`}
                        >
                          {OPTION_LABELS[optIndex] ?? optIndex + 1}. {opt}
                          {isCorrectOpt && " ✓"}
                          {isSelected && !correct && " (your answer)"}
                        </p>
                      );
                    })}
                  </div>
                  {!correct && selectedOpt != null && correctOpt != null && (
                    <div className="mt-3 ml-10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <p className="text-red-700"><strong>Your answer:</strong> {selectedOpt}</p>
                      <p className="text-green-700"><strong>Correct:</strong> {correctOpt}</p>
                    </div>
                  )}
                  {item.explanation && (
                    <div className="mt-3 ml-10 bg-gray-100/80 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                      <strong className="text-gray-800">Explanation:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/e-test" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90">
              Back to E-Test
            </Link>
            <Link to="/e-test" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
              My attempts
            </Link>
          </div>
        </div>
      </div>
      <AnnouncementContainer />
    </motion.div>
  );
};

export default AnswerReview;
