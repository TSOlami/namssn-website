import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar, HeaderComponent, AnnouncementContainer } from "../components";
import {
  useGetTestByIdQuery,
  useSubmitAttemptMutation,
} from "../redux/slices/etestSlice";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: test, isLoading, error } = useGetTestByIdQuery(testId, {
    skip: !testId,
  });
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  const [answers, setAnswers] = useState({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!test?.timeLimitMinutes) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [test?.timeLimitMinutes, startedAt]);

  const handleSelect = (questionId, selectedIndex) => {
    const key = questionId != null ? String(questionId) : '';
    setAnswers((prev) => ({ ...prev, [key]: selectedIndex }));
  };

  const handleSubmit = async () => {
    if (!userInfo) {
      navigate("/signin", { state: { from: `/e-test/take/${testId}` } });
      return;
    }
    const questions = test?.questions || [];
    const attemptAnswers = questions.map((q) => {
      const key = q._id != null ? String(q._id) : '';
      const raw = answers[key];
      const selectedIndex = typeof raw === 'number' && raw >= 0 ? raw : -1;
      return { questionId: key || q._id, selectedIndex };
    });
    try {
      const result = await submitAttempt({
        testId,
        answers: attemptAnswers,
        timeSpentSeconds,
      }).unwrap();
      navigate(`/e-test/attempt/${result._id}`, { replace: true });
    } catch (err) {
      console.error('E-Test submit error:', err);
      alert(err?.data?.message || "Failed to submit. Please try again.");
    }
  };

  if (!testId) {
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
            Failed to load test. It may not exist or is not published.
          </div>
          <button
            type="button"
            onClick={() => navigate("/e-test")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to E-Test
          </button>
        </div>
        <AnnouncementContainer />
      </motion.div>
    );
  }

  if (isLoading || !test) {
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

  const questions = test.questions || [];
  const timeLimitMinutes = test.timeLimitMinutes || 30;
  const timeRemaining = timeLimitMinutes * 60 - timeSpentSeconds;
  const canSubmit = questions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row"
    >
      <Sidebar />
      <div className="w-full min-w-[370px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px]">
        <div className="sticky top-[0.01%] z-[300] bg-white w-full border-b flex flex-wrap items-center justify-between gap-2 p-4">
          <HeaderComponent title={test.title || "E-Test"} url="Placeholder" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {timeRemaining > 0
                ? `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}`
                : "0:00"}
            </span>
            <span className="text-sm text-gray-600">
              {Object.keys(answers).length} / {questions.length} answered
            </span>
          </div>
        </div>
        <div className="p-4 space-y-8">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
            >
              <p className="font-medium text-gray-700 mb-3">
                {index + 1}. {q.text}
              </p>
              <div className="space-y-2">
                {(q.options || []).map((opt, optIndex) => (
                  <label
                    key={optIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      answers[q._id != null ? String(q._id) : ''] === optIndex
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q._id}`}
                      checked={answers[q._id != null ? String(q._id) : ''] === optIndex}
                      onChange={() => handleSelect(q._id, optIndex)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="font-medium text-gray-600">
                      {OPTION_LABELS[optIndex] ?? optIndex + 1}.
                    </span>
                    <span className="text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {canSubmit && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : "Submit test"}
              </button>
            </div>
          )}
        </div>
      </div>
      <AnnouncementContainer />
    </motion.div>
  );
};

export default TakeTest;
