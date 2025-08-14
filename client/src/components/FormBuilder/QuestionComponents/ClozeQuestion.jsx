import React from "react";
import ImageUpload from "../../common/ImageUpload";
import { formAPI } from "../../../services/api";

const ClozeQuestion = ({ question, onUpdate, onRemove }) => {
  // Add safety checks and default values
  const options = question.options || [""];

  const handleImageUpload = async (file) => {
    try {
      const response = await formAPI.uploadImage(file);
      if (response.data.success) {
        onUpdate({ image: response.data.data.url });
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  const updateOptions = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    onUpdate({ options: [...options, ""] });
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      onUpdate({ options: newOptions });
    }
  };

  // Helper function to count blanks in sentence
  const getBlankCount = () => {
    const sentence = question.sentence || "";
    return sentence.split("__").length - 1;
  };

  // Helper function to validate the question
  const getValidationStatus = () => {
    const sentence = question.sentence || "";
    const blankCount = getBlankCount();
    const filledOptions = options.filter((opt) => opt.trim() !== "").length;

    if (!sentence.trim())
      return { type: "warning", message: "Add a sentence with blanks" };
    if (blankCount === 0)
      return {
        type: "error",
        message: "No blanks found. Use __ to create blanks",
      };
    if (filledOptions < blankCount)
      return {
        type: "warning",
        message: `Add ${blankCount - filledOptions} more option(s)`,
      };
    if (filledOptions > blankCount)
      return {
        type: "info",
        message: `Extra options will be available for selection`,
      };
    return { type: "success", message: "Question is ready!" };
  };

  const validation = getValidationStatus();

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-2">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cloze Question</h3>
              <p className="text-green-100 text-sm">Fill in the blanks</p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-200 transform hover:scale-105"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Question Title
          </label>
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter your cloze question..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
          />
        </div>

        {/* Question Image */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Question Image (Optional)
          </label>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
            <ImageUpload
              onUpload={handleImageUpload}
              currentImage={question.image || ""}
            />
          </div>
        </div>

        {/* Sentence with blanks - IMPROVED */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Sentence with Blanks
            </label>
            {getBlankCount() > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                {getBlankCount()} blank{getBlankCount() !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
          <textarea
            value={question.sentence || ""}
            onChange={(e) => onUpdate({ sentence: e.target.value })}
            placeholder="Enter sentence with __ for blanks (e.g., The __ is very __)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 resize-none"
          />
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Use double underscores (__) to create blanks that users will drag
              options into
            </span>
          </div>
        </div>

        {/* Validation Status - NEW */}
        {(question.sentence || options.some((opt) => opt.trim())) && (
          <div
            className={`p-3 rounded-lg border flex items-center space-x-2 ${
              validation.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : validation.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : validation.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <svg
              className={`h-4 w-4 ${
                validation.type === "success"
                  ? "text-green-500"
                  : validation.type === "error"
                  ? "text-red-500"
                  : validation.type === "warning"
                  ? "text-yellow-500"
                  : "text-blue-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {validation.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : validation.type === "error" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <span className="text-sm font-medium">{validation.message}</span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Answer Options
            </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {options.length} option{options.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOptions(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  />
                </div>
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-all duration-200"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOption}
            className="w-full py-2 px-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-400 transition duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="font-medium">Add Option</span>
          </button>
        </div>

        {/* Enhanced Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            How it will appear to users:
          </h4>
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
            <p className="font-medium text-gray-900">
              <strong>Question:</strong>{" "}
              {question.question || "Your question here"}
            </p>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900 mb-2">
                <strong>Sentence to complete:</strong>
              </p>
              <div className="text-gray-700 bg-white p-3 rounded border">
                {question.sentence ? (
                  // Show sentence with visual placeholders for blanks
                  question.sentence.split("__").map((part, index, parts) => (
                    <span key={index}>
                      {part}
                      {index < parts.length - 1 && (
                        <span className="inline-flex items-center mx-1 px-3 py-1 bg-green-200 text-green-800 rounded text-sm font-medium">
                          [Drop Zone]
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">
                    Your sentence with __ blanks here
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">
                <strong>Available options to drag:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {options.filter((opt) => opt.trim()).length > 0 ? (
                  options
                    .filter((opt) => opt.trim())
                    .map((option, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-300"
                      >
                        {option}
                      </span>
                    ))
                ) : (
                  <span className="text-gray-400 italic text-sm">
                    No options added yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClozeQuestion;
