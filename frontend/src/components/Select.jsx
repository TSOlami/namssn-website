/**
 * Reusable Select dropdown with consistent styling.
 * @param {Object} props
 * @param {string} [props.label] - Label above the select
 * @param {Array<{value: string, label: string}>|string[]} props.options - Options: array of {value, label} or array of strings
 * @param {string} props.value - Current value
 * @param {function(React.ChangeEvent): void} props.onChange - Change handler (receives event)
 * @param {function(React.FocusEvent): void} [props.onBlur] - Blur handler
 * @param {string} [props.name] - Name attribute
 * @param {string} [props.id] - Id attribute (defaults to name)
 * @param {string} [props.placeholder] - Placeholder option text (e.g. "Select...")
 * @param {string} [props.error] - Error message to show below
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.className] - Extra class names for the wrapper
 * @param {boolean} [props.required] - Required attribute
 */
const Select = ({
  label,
  options = [],
  value,
  onChange,
  onBlur,
  name,
  id,
  placeholder,
  error,
  disabled = false,
  className = "",
  required = false,
}) => {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
  const selectId = id || name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className="w-full border-2 border-gray-300 rounded-lg h-10 px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={selectId ? `${selectId}-error` : undefined} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
