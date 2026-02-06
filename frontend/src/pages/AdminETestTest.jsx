import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Sidebar, HeaderComponent, ConfirmDialog } from "../components";
import { QuestionForm } from "../components/forms/QuestionForm";
import {
  useAdminGetTestsByCourseQuery,
  useGetQuestionsByTestQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useReorderQuestionMutation,
  useDeleteQuestionMutation,
  useBulkAddQuestionsMutation,
  useExtractQuestionsFromPdfMutation,
} from "../redux/slices/adminApiSlice";
import { motion } from "framer-motion";
import {
  FaChevronUp,
  FaChevronDown,
  FaPen,
  FaTrashCan,
  FaFileImport,
  FaFilePdf,
  FaCopy,
  FaPlus,
  FaMagnifyingGlass,
} from "react-icons/fa6";

const BULK_TEMPLATE = `[
  {
    "text": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctIndex": 1,
    "explanation": "Basic arithmetic."
  },
  {
    "text": "Which is a prime number?",
    "options": ["4", "6", "7", "8"],
    "correctIndex": 2
  }
]`;

export default function AdminETestTest() {
  const { courseId, testId } = useParams();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [addFormKey, setAddFormKey] = useState(0);
  const [bulkJson, setBulkJson] = useState("");
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdvancedImport, setShowAdvancedImport] = useState(false);
  const [showPdfImport, setShowPdfImport] = useState(false);
  const [extractedRawText, setExtractedRawText] = useState("");
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [extractionErrors, setExtractionErrors] = useState([]);
  const [extractionNote, setExtractionNote] = useState("");
  const [extractedTextFromApi, setExtractedTextFromApi] = useState(false);
  const [editingExtractedIndex, setEditingExtractedIndex] = useState(null);
  const [questionSearch, setQuestionSearch] = useState("");
  const [bulkAddConfirm, setBulkAddConfirm] = useState(false);
  const [pdfAddConfirm, setPdfAddConfirm] = useState(false);
  const extractedTextAreaRef = useRef(null);

  const { data: tests } = useAdminGetTestsByCourseQuery(courseId, {
    skip: !courseId,
  });
  const test = useMemo(
    () => tests?.find((t) => t._id === testId),
    [tests, testId]
  );
  const { data: questions = [], isLoading: questionsLoading } =
    useGetQuestionsByTestQuery(testId, { skip: !testId });

  useEffect(() => {
    if (!questionsLoading && questions.length === 0 && testId) {
      setShowAddForm(true);
    }
  }, [questionsLoading, questions.length, testId]);

  const [addQuestion, { isLoading: isAdding }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const [reorderQuestion, { isLoading: isReordering }] = useReorderQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [bulkAddQuestions, { isLoading: isBulkAdding }] =
    useBulkAddQuestionsMutation();
  const [extractQuestionsFromPdf, { isLoading: isExtractingPdf }] =
    useExtractQuestionsFromPdfMutation();

  const filteredQuestions = useMemo(() => {
    if (!questionSearch.trim()) return questions;
    const q = questionSearch.trim().toLowerCase();
    return questions.filter(
      (item) =>
        item.text?.toLowerCase().includes(q) ||
        item.options?.some((opt) => opt?.toLowerCase().includes(q))
    );
  }, [questions, questionSearch]);

  const handleAddQuestion = async (payload) => {
    if (!testId) return;
    try {
      await addQuestion({ testId, ...payload }).unwrap();
      toast.success("Question added");
      setAddFormKey((k) => k + 1);
      setShowAddForm(false);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to add question");
    }
  };

  const handleAddQuestionAndAnother = async (payload) => {
    if (!testId) return;
    try {
      await addQuestion({ testId, ...payload }).unwrap();
      toast.success("Question added");
      setAddFormKey((k) => k + 1);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to add question");
    }
  };

  const handleUpdateQuestion = async (payload) => {
    if (!editingQuestion?._id) return;
    try {
      await updateQuestion({ questionId: editingQuestion._id, ...payload }).unwrap();
      toast.success("Question updated");
      setEditingQuestion(null);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to update question");
    }
  };

  const handleDeleteClick = (q) => setDeleteConfirm(q);
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteQuestion(deleteConfirm._id).unwrap();
      toast.success("Question deleted");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to delete question");
    }
  };

  const moveQuestion = async (q, direction) => {
    const idx = questions.findIndex((x) => x._id === q._id);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === questions.length - 1) return;
    try {
      await reorderQuestion({ testId, questionId: q._id, direction }).unwrap();
      toast.success("Order updated");
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to reorder");
    }
  };

  const bulkPreview = useMemo(() => {
    if (!bulkJson.trim()) return null;
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) return { error: "Must be a JSON array" };
      if (parsed.length === 0) return { error: "Array cannot be empty" };
      const first = parsed[0];
      const hasText = first?.text != null;
      const hasOptions = Array.isArray(first?.options) && first.options.length >= 2;
      const hasIndex =
        typeof first?.correctIndex === "number" &&
        first.correctIndex >= 0 &&
        first.correctIndex < (first?.options?.length ?? 0);
      if (!hasText || !hasOptions || !hasIndex)
        return {
          error:
            "Each item needs text, options (array, min 2), and correctIndex (0-based).",
        };
      return { count: parsed.length, sample: first };
    } catch {
      return { error: "Invalid JSON" };
    }
  }, [bulkJson]);

  const handleBulkAdd = async () => {
    if (!testId || !bulkJson.trim()) {
      toast.warning("Select a test and paste questions JSON.");
      setBulkAddConfirm(false);
      return;
    }
    if (bulkPreview?.error) {
      toast.error(bulkPreview.error);
      setBulkAddConfirm(false);
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(bulkJson);
    } catch {
      toast.error("Invalid JSON.");
      setBulkAddConfirm(false);
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      toast.error("Questions must be a non-empty array.");
      setBulkAddConfirm(false);
      return;
    }
    try {
      const result = await bulkAddQuestions({
        testId,
        questions: parsed,
      }).unwrap();
      toast.success(`Added ${result?.count ?? parsed.length} question(s).`);
      setBulkJson("");
      setShowBulkPreview(false);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to add questions");
    }
    setBulkAddConfirm(false);
  };

  const handleBulkAddClick = () => {
    if (!testId || !bulkJson.trim()) {
      toast.warning("Select a test and paste questions JSON.");
      return;
    }
    if (bulkPreview?.error) {
      toast.error(bulkPreview.error);
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(bulkJson);
    } catch {
      toast.error("Invalid JSON.");
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      toast.error("Questions must be a non-empty array.");
      return;
    }
    setBulkAddConfirm(true);
  };

  const handlePdfFileSelect = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!file.type?.includes("pdf")) {
      toast.error("Please select a PDF file.");
      return;
    }
    try {
      const data = await extractQuestionsFromPdf(file).unwrap();
      const raw = (data.rawText ?? "").trim();
      setExtractedRawText(raw);
      setExtractedTextFromApi(raw.length > 0);
      setExtractedQuestions(data.questions ?? []);
      setExtractionErrors(data.errors ?? []);
      setExtractionNote((data.extractionNote ?? "").trim());
      if (raw) {
        toast.success("Text extracted. Copy from the box below into the question fields above.");
        setTimeout(() => extractedTextAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else if (data.extractionNote) {
        toast.info("No text in PDF. You can paste text below if you copied it from the PDF in another app.");
        setTimeout(() => extractedTextAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
      if ((data.questions ?? []).length > 0) {
        toast.info(`We also detected ${(data.questions ?? []).length} question(s) — you can add them in one go below, or copy-paste from the text.`);
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to extract from PDF");
    }
    e.target.value = "";
  };

  const handleCopyAllExtractedText = () => {
    if (!extractedRawText) return;
    navigator.clipboard.writeText(extractedRawText).then(
      () => toast.success("Copied to clipboard. Paste into the question fields above."),
      () => toast.error("Could not copy")
    );
  };

  const handleUpdateExtractedQuestion = (index, payload) => {
    setExtractedQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...payload } : q))
    );
    setEditingExtractedIndex(null);
  };

  const handleRemoveExtractedQuestion = (index) => {
    setExtractedQuestions((prev) => prev.filter((_, i) => i !== index));
    if (editingExtractedIndex === index) setEditingExtractedIndex(null);
    else if (editingExtractedIndex != null && editingExtractedIndex > index) {
      setEditingExtractedIndex((i) => i - 1);
    }
  };

  const handleConfirmPdfQuestions = async () => {
    if (!testId || extractedQuestions.length === 0) {
      toast.warning("No questions to add.");
      setPdfAddConfirm(false);
      return;
    }
    try {
      const result = await bulkAddQuestions({
        testId,
        questions: extractedQuestions,
      }).unwrap();
      toast.success(`Added ${result?.count ?? extractedQuestions.length} question(s) from PDF.`);
      setExtractedQuestions([]);
      setExtractionErrors([]);
      setExtractionNote("");
      setShowPdfImport(false);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to add questions");
    }
    setPdfAddConfirm(false);
  };

  const handlePdfAddClick = () => {
    if (!testId || extractedQuestions.length === 0) {
      toast.warning("No questions to add.");
      return;
    }
    setPdfAddConfirm(true);
  };

  if (!courseId || !testId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex flex-row w-full"
    >
      <Sidebar />
      <div className="w-full min-w-[370px]">
        <HeaderComponent title="E-Test · Questions" />
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/admin/e-test" className="text-primary hover:underline">
              E-Test
            </Link>
            <span>/</span>
            <Link
              to={`/admin/e-test/course/${courseId}`}
              className="text-primary hover:underline"
            >
              Course
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {test?.title ?? "Test"}
            </span>
          </div>

          {test && (
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
              <h2 className="font-semibold text-lg text-gray-900">
                {test.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {test.semester && `${test.semester} · `}
                {test.year && `${test.year} · `}
                {questions.length} questions · {test.timeLimitMinutes ?? 30} min
                {test.isPublished ? " · Published" : " · Draft"}
              </p>
            </div>
          )}

          <section className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="font-semibold text-lg">Questions</h3>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:opacity-90"
              >
                <FaPlus className="w-4 h-4" /> Add question
              </button>
            </div>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4"
              >
                <h4 className="font-medium text-gray-800 mb-3">New question</h4>
                <QuestionForm
                  key={addFormKey}
                  testId={testId}
                  onSubmit={handleAddQuestion}
                  onSubmitAndAddAnother={handleAddQuestionAndAnother}
                  onCancel={() => setShowAddForm(false)}
                  isSubmitting={isAdding}
                />
              </motion.div>
            )}

            {editingQuestion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-4"
              >
                <h4 className="font-medium text-gray-800 mb-3">Edit question</h4>
                <QuestionForm
                  question={editingQuestion}
                  onSubmit={handleUpdateQuestion}
                  onCancel={() => setEditingQuestion(null)}
                  isSubmitting={isUpdating}
                />
              </motion.div>
            )}

            {questionsLoading ? (
              <div className="text-gray-500 py-6">Loading questions…</div>
            ) : questions.length === 0 ? (
              <p className="text-gray-500 py-4">
                No questions yet. Use the form above to add your first question.
              </p>
            ) : filteredQuestions.length === 0 ? (
              <p className="text-gray-500 py-4">
                No questions match &quot;{questionSearch.trim()}&quot;.
              </p>
            ) : (
              <ul className="space-y-2">
                {filteredQuestions.map((q, index) => (
                  <li
                    key={q._id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-500 mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-gray-900">
                        {q.text?.slice(0, 80)}
                        {(q.text?.length ?? 0) > 80 ? "…" : ""}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Correct:{" "}
                        {(q.options?.[q.correctIndex] ?? "—").slice(0, 40)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveQuestion(q, "up")}
                        disabled={isReordering || questions.findIndex((x) => x._id === q._id) === 0}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                        aria-label="Move up"
                      >
                        <FaChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuestion(q, "down")}
                        disabled={isReordering || questions.findIndex((x) => x._id === q._id) === questions.length - 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                        aria-label="Move down"
                      >
                        <FaChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingQuestion(q)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        aria-label="Edit"
                      >
                        <FaPen className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(q)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        aria-label="Delete"
                      >
                        <FaTrashCan className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-md p-5 border border-gray-100 mb-6">
            <button
              type="button"
              onClick={() => setShowPdfImport((v) => !v)}
              className="flex items-center gap-2 w-full text-left text-sm text-gray-600 hover:text-gray-900"
            >
              <FaFilePdf className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">
                {showPdfImport ? "Hide PDF import" : "Import from PDF"}
              </span>
            </button>
            {showPdfImport && (
              <div className="mt-4 pt-4 border-t border-gray-200" ref={extractedTextAreaRef}>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a PDF — we extract all text into one box. Copy and paste into the question fields above (no retyping).
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileSelect}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isExtractingPdf}
                  />
                  <label
                    htmlFor={isExtractingPdf ? undefined : "pdf-upload"}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg cursor-pointer ${isExtractingPdf ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                  >
                    <FaFilePdf className="w-4 h-4" />
                    {isExtractingPdf ? "Extracting…" : "Choose PDF"}
                  </label>
                </div>

                <div className="mb-4">
                  {extractionNote && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      {extractionNote}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {extractedRawText
                        ? "Extracted text — copy and paste into question fields above"
                        : "Text box — paste here if your PDF had no extractable text (e.g. image-only)"}
                    </label>
                    {extractedRawText && (
                      <button
                        type="button"
                        onClick={handleCopyAllExtractedText}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                      >
                        <FaCopy className="w-4 h-4" />
                        Copy all
                      </button>
                    )}
                  </div>
                  <textarea
                    readOnly={extractedTextFromApi}
                    value={extractedRawText}
                    onChange={(e) => !extractedTextFromApi && setExtractedRawText(e.target.value)}
                    className="w-full min-h-[220px] max-h-[400px] p-3 text-sm font-mono border border-gray-300 rounded-lg bg-gray-50 resize-y focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-100"
                    placeholder={extractionNote ? "Paste text here (e.g. after copying from the PDF in Adobe Reader or another app)." : "Text will appear here after you upload a PDF, or paste here for image-only PDFs."}
                    aria-label="Extracted or pasted PDF text for copy-paste"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    {extractedRawText
                      ? "Select any part of the text above and copy (Ctrl+C / Cmd+C), then paste into the question text or option fields when adding a question."
                      : "For image-only PDFs: open the PDF in another app, select and copy the text, then paste it above. You can then copy from here into the question fields."}
                  </p>
                </div>

                {extractionErrors.length > 0 && (
                  <div className="mb-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                    <p className="font-medium mb-1">Parser notes:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {extractionErrors.slice(0, 5).map((msg, i) => (
                        <li key={i}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {extractedQuestions.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 mt-4">
                      Detected questions (optional) — add in one go or keep copy-pasting from the text above
                    </h4>
                    {editingExtractedIndex !== null && extractedQuestions[editingExtractedIndex] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-amber-50 rounded-xl p-5 border border-amber-200 mb-4"
                      >
                        <h4 className="font-medium text-gray-800 mb-3">Edit question {editingExtractedIndex + 1}</h4>
                        <QuestionForm
                          question={extractedQuestions[editingExtractedIndex]}
                          onSubmit={(payload) => handleUpdateExtractedQuestion(editingExtractedIndex, payload)}
                          onCancel={() => setEditingExtractedIndex(null)}
                          isSubmitting={false}
                        />
                      </motion.div>
                    )}
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                      {extractedQuestions.map((q, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-500 mr-2">{index + 1}.</span>
                            <span className="text-gray-900">{q.text?.slice(0, 55)}{(q.text?.length ?? 0) > 55 ? "…" : ""}</span>
                            <p className="text-xs text-gray-500 mt-1">
                              Correct: {(q.options?.[q.correctIndex] ?? "—").slice(0, 30)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingExtractedIndex(index)}
                              className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
                              aria-label="Edit"
                            >
                              <FaPen className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExtractedQuestion(index)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                              aria-label="Remove"
                            >
                              <FaTrashCan className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handlePdfAddClick}
                      disabled={isBulkAdding}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                      {isBulkAdding ? "Adding…" : "Add detected questions to test"}
                    </button>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <button
              type="button"
              onClick={() => setShowAdvancedImport((v) => !v)}
              className="flex items-center gap-2 w-full text-left text-sm text-gray-600 hover:text-gray-900"
            >
              <FaFileImport className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">
                {showAdvancedImport ? "Hide advanced import" : "Advanced: Import from JSON"}
              </span>
            </button>
            {showAdvancedImport && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  For developers: paste a JSON array. Each item:{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    {"{ \"text\": \"...\", \"options\": [\"A\",\"B\",\"C\",\"D\"], \"correctIndex\": 0 }"}
                  </code>
                </p>
                <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setBulkJson(BULK_TEMPLATE)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Insert template
              </button>
              <button
                type="button"
                onClick={() => setShowBulkPreview((v) => !v)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showBulkPreview ? "Hide preview" : "Preview"}
              </button>
            </div>
            {showBulkPreview && bulkJson.trim() && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg text-sm">
                {bulkPreview?.error ? (
                  <p className="text-red-600">{bulkPreview.error}</p>
                ) : (
                  <p className="text-gray-700">
                    <strong>{bulkPreview?.count ?? 0}</strong> question(s). First: “
                    {bulkPreview?.sample?.text?.slice(0, 50)}…”
                  </p>
                )}
              </div>
            )}
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder='[{"text":"...","options":["A","B","C","D"],"correctIndex":0}]'
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm mb-3"
            />
                <button
                  type="button"
                  onClick={handleBulkAddClick}
                  disabled={
                    isBulkAdding ||
                    !bulkJson.trim() ||
                    (bulkPreview && bulkPreview.error)
                  }
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isBulkAdding ? "Adding…" : "Add questions from JSON"}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete question?"
        message="This question will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
      />
      <ConfirmDialog
        isOpen={bulkAddConfirm}
        onClose={() => setBulkAddConfirm(false)}
        onConfirm={handleBulkAdd}
        title="Add questions from JSON?"
        message={`You are about to add ${(() => {
          try {
            const parsed = JSON.parse(bulkJson);
            return Array.isArray(parsed) ? parsed.length : 0;
          } catch {
            return 0;
          }
        })()} question(s) to this test. This cannot be undone.`}
        confirmLabel="Add questions"
        variant="danger"
      />
      <ConfirmDialog
        isOpen={pdfAddConfirm}
        onClose={() => setPdfAddConfirm(false)}
        onConfirm={handleConfirmPdfQuestions}
        title="Add questions from PDF?"
        message={`You are about to add ${extractedQuestions.length} question(s) detected from the PDF to this test. This cannot be undone.`}
        confirmLabel="Add questions"
        variant="danger"
      />
    </motion.div>
  );
}
