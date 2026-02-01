import { useFormik } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTrashCan } from "react-icons/fa6";
import FormErrors from "./FormErrors";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const validationSchema = Yup.object({
  text: Yup.string().trim().required("Question text is required"),
  options: Yup.array()
    .of(Yup.string().trim())
    .min(MIN_OPTIONS, `At least ${MIN_OPTIONS} options required`)
    .test("non-empty", "Each option must have text", (opts) =>
      opts?.every((o) => o?.trim().length > 0)
    ),
  correctIndex: Yup.number().min(0).required(),
  explanation: Yup.string().trim(),
});

function buildPayload(values) {
  const options = (values.options || []).map((o) => String(o).trim()).filter(Boolean);
  const correctIndex = Math.min(
    Math.max(0, values.correctIndex),
    Math.max(0, options.length - 1)
  );
  return {
    text: (values.text || "").trim(),
    options,
    correctIndex,
    explanation: (values.explanation || "").trim() || undefined,
  };
}

export function QuestionForm({
  question,
  onSubmit: onSubmitProp,
  onSubmitAndAddAnother,
  onCancel,
  isSubmitting = false,
}) {
  const isEdit = Boolean(question?._id);

  const formik = useFormik({
    initialValues: {
      text: question?.text ?? "",
      options:
        question?.options?.length >= MIN_OPTIONS
          ? [...question.options]
          : ["", ""],
      correctIndex: typeof question?.correctIndex === "number" ? question.correctIndex : 0,
      explanation: question?.explanation ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = buildPayload(values);
      if (payload.options.length < MIN_OPTIONS) return;
      onSubmitProp(payload);
    },
  });

  const handleAddAndAnother = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.fromEntries(Object.keys(errors).map((k) => [k, true]))
      );
      return;
    }
    const payload = buildPayload(formik.values);
    if (payload.options.length < MIN_OPTIONS) return;
    if (onSubmitAndAddAnother) onSubmitAndAddAnother(payload);
  };

  const options = formik.values.options || [];

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    formik.setFieldValue("options", [...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= MIN_OPTIONS) return;
    const next = options.filter((_, i) => i !== index);
    formik.setFieldValue("options", next);
    if (formik.values.correctIndex >= next.length) {
      formik.setFieldValue("correctIndex", next.length - 1);
    } else if (formik.values.correctIndex === index) {
      formik.setFieldValue("correctIndex", 0);
    } else if (formik.values.correctIndex > index) {
      formik.setFieldValue("correctIndex", formik.values.correctIndex - 1);
    }
  };

  const optionLetters = "ABCDEFGH".slice(0, options.length);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <textarea
          id="question-text"
          name="text"
          value={formik.values.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter the question text..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {formik.touched.text && formik.errors.text && (
          <FormErrors error={formik.errors.text} />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Options (select correct answer)
          </label>
          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <FaPlus className="w-3.5 h-3.5" /> Add option
            </button>
          )}
        </div>
        <div className="space-y-2">
          {options.map((_, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="flex-shrink-0 w-6 text-sm font-medium text-gray-500">
                {optionLetters[index]}.
              </span>
              <input
                type="text"
                value={options[index]}
                onChange={(e) => {
                  const next = [...options];
                  next[index] = e.target.value;
                  formik.setFieldValue("options", next);
                }}
                onBlur={() => formik.setFieldTouched("options")}
                placeholder={`Option ${optionLetters[index]}`}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <label className="flex items-center gap-1.5 flex-shrink-0">
                <input
                  type="radio"
                  name="correctIndex"
                  checked={formik.values.correctIndex === index}
                  onChange={() => formik.setFieldValue("correctIndex", index)}
                />
                <span className="text-sm text-gray-600">Correct</span>
              </label>
              {options.length > MIN_OPTIONS && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label={`Remove option ${optionLetters[index]}`}
                >
                  <FaTrashCan className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {formik.touched.options && formik.errors.options && (
          <FormErrors error={formik.errors.options} />
        )}
      </div>

      <div>
        <label htmlFor="question-explanation" className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (optional)
        </label>
        <textarea
          id="question-explanation"
          name="explanation"
          value={formik.values.explanation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Why this answer is correct..."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update question" : "Add question"}
        </button>
        {!isEdit && onSubmitAndAddAnother && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleAddAndAnother}
            className="px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary/5 disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : "Add & add another"}
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
