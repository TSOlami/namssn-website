import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sidebar, HeaderComponent, AnnouncementContainer } from "../components";
import { useGetCoursesQuery, useGetUserAttemptsQuery } from "../redux/slices/etestSlice";
import { ETestCourseListSkeleton } from "../components/skeletons";
import { motion, AnimatePresence } from "framer-motion";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

const LEVELS = ["100", "200", "300", "400", "500"];
const TAB_COURSES = "courses";
const TAB_ATTEMPTS = "attempts";

const formatAttemptDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatTimeSpent = (seconds) => {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const DEBOUNCE_MS = 300;

const ETestHome = () => {
  const [levelFilter, setLevelFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState(TAB_COURSES);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const queryParams = {};
  if (levelFilter) queryParams.level = levelFilter;
  if (debouncedSearch) queryParams.search = debouncedSearch;
  const { data: courses, isLoading } = useGetCoursesQuery(queryParams);
  const { data: attempts = [], isLoading: attemptsLoading } = useGetUserAttemptsQuery(undefined, {
    skip: !userInfo || activeTab !== TAB_ATTEMPTS,
  });

  const tabStyle = (tab) =>
    `px-4 py-2.5 rounded-t-lg font-medium text-sm transition-colors ${
      activeTab === tab
        ? "bg-white text-primary border border-b-0 border-gray-200 shadow-sm"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;

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
          <HeaderComponent title="E-TEST" url="Placeholder" />
          {userInfo && (
            <div className="flex gap-1 px-4 pb-0 pt-2">
              <button type="button" onClick={() => setActiveTab(TAB_COURSES)} className={tabStyle(TAB_COURSES)}>
                Courses
              </button>
              <button type="button" onClick={() => setActiveTab(TAB_ATTEMPTS)} className={tabStyle(TAB_ATTEMPTS)}>
                My attempts
              </button>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50/50 min-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === TAB_COURSES && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <p className="text-gray-600 font-serif">
                  Practice with past questions. Search or filter by level, then choose a course.
                </p>
                <div className="relative">
                  <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by course code or title"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-900 placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:none [&::-moz-search-cancel-button]:hidden"
                    aria-label="Search courses"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded"
                      aria-label="Clear search"
                    >
                      <FaXmark className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setLevelFilter("")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${
                      !levelFilter ? "bg-primary text-white" : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevelFilter(l)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm ${
                        levelFilter === l ? "bg-primary text-white" : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
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
                        <span className="text-sm font-medium text-primary">{course.code}</span>
                        <h3 className="font-semibold text-lg mt-1 text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{course.level} Level</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 font-serif bg-white rounded-xl border border-gray-100 p-8">
                    {debouncedSearch || levelFilter ? (
                      <>
                        <p>No courses match your search.</p>
                        <p className="text-sm mt-2">Try a different term or level.</p>
                        <button
                          type="button"
                          onClick={() => { setSearchInput(""); setLevelFilter(""); }}
                          className="mt-4 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:opacity-90"
                        >
                          Clear filters
                        </button>
                      </>
                    ) : (
                      <>
                        <p>No courses available yet.</p>
                        <p className="text-sm mt-2">Check back later or try another level.</p>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === TAB_ATTEMPTS && (
              <motion.div
                key="attempts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {attemptsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : attempts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm mb-4">
                      Click a result to view corrections and explanations.
                    </p>
                    {attempts.map((a) => {
                      const title = a.test?.title || "Test";
                      const score = a.score ?? 0;
                      const total = a.totalQuestions ?? 0;
                      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
                      const isGood = pct >= 70;
                      const isMid = pct >= 40 && pct < 70;
                      return (
                        <Link
                          key={a._id}
                          to={`/e-test/attempt/${a._id}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:ring-2 hover:ring-primary/40 hover:border-primary/30 transition-all shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {formatAttemptDate(a.completedAt)}
                              {a.timeSpentSeconds != null && (
                                <span className="ml-2">· {formatTimeSpent(a.timeSpentSeconds)}</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                isGood ? "bg-green-100 text-green-800" : isMid ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {score}/{total} ({pct}%)
                            </span>
                            <span className="text-primary font-medium text-sm">View corrections →</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-700 font-medium">No attempts yet</p>
                    <p className="text-gray-500 text-sm mt-1">Your results and corrections will appear here after you take a test.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab(TAB_COURSES)}
                      className="mt-4 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Browse courses
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnnouncementContainer />
    </motion.div>
  );
};

export default ETestHome;
