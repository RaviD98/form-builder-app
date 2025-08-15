import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formAPI } from "../../services/api";

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchFormData();
  }, [id]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await formAPI.getForm(id);

      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (err) {
      setError(
        "Failed to load form preview. Please check the URL and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/form-fill/${id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 800); // Reset
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const renderQuestionPreview = (question, index) => {
    const baseContent = (
      <div
        key={question.id || index}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            {question.question}
          </h3>
        </div>

        {question.image && (
          <div className="mb-4">
            <img
              src={question.image}
              alt="Question"
              className="max-w-md max-h-48 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Question type specific preview */}
        {question.type === "categorize" && (
          <div className="space-y-4">
            <div className="text-gray-700">
              <p className="font-medium">
                Categories: {question.categories?.join(", ") || "None"}
              </p>
            </div>
            <div className="text-gray-700">
              <p className="font-medium">
                Items to categorize: {question.items?.join(", ") || "None"}
              </p>
            </div>
          </div>
        )}

        {question.type === "cloze" && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-medium text-green-800 mb-2">Sentence:</p>
              <p className="text-green-900">
                {question.sentence || "Sentence with __ blanks"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">
                Available options:
              </p>
              <div className="flex flex-wrap gap-2">
                {question.options?.map((option, idx) => (
                  <span
                    key={`${question.id || index}-option-${idx}`}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {option}
                  </span>
                )) || <span className="text-gray-500">No options</span>}
              </div>
            </div>
          </div>
        )}

        {question.type === "comprehension" && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-medium text-purple-800 mb-2">
                Reading Passage:
              </p>
              <p className="text-purple-900 text-sm">
                {question.passage
                  ? question.passage.substring(0, 200) + "..."
                  : "Reading passage will appear here"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">Questions:</p>
              {question.mcqs?.map((mcq, idx) => (
                <div
                  key={`${question.id || index}-mcq-${idx}`}
                  className="bg-gray-50 p-3 rounded-lg mb-2"
                >
                  <p className="font-medium text-gray-900">
                    <strong>Q{idx + 1}:</strong>{" "}
                    {mcq.question || `Question ${idx + 1}`}
                  </p>
                  <div className="mt-2 space-y-1">
                    {mcq.options?.map((option, optIdx) => (
                      <p
                        key={`${
                          question.id || index
                        }-mcq-${idx}-option-${optIdx}`}
                        className={`text-sm ${
                          optIdx === mcq.correct
                            ? "text-green-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {option}{" "}
                        {optIdx === mcq.correct && "✓"}
                      </p>
                    ))}
                  </div>
                </div>
              )) || <p className="text-gray-500">No questions added</p>}
            </div>
          </div>
        )}
      </div>
    );

    return baseContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Preview
            </h2>
            <p className="text-gray-600">Preparing your form preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Preview Not Available
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/builder")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Back to Builder
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Banner image (optional) */}
          {formData.headerImage && (
            <div className="relative w-full overflow-hidden">
              {/* 3 : 1 banner – change pt-[50%] for 2 : 1 */}
              <div className="relative pt-[33%]">
                <img
                  src={formData.headerImage}
                  alt="Form header"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Gradient bar with title & buttons */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center relative">
            {/* Back button */}
            <button
              onClick={() => navigate("/builder")}
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition duration-200 cursor-pointer"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Live-form button */}
            <button
              onClick={() => navigate(`/form-fill/${id}`)}
              className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-200 font-medium cursor-pointer"
            >
              View Live Form
            </button>

            {/* Icon + “Form Preview” */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-white/20 rounded-lg p-3">
                <svg
                  className="h-8 w-8 text-white"
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
              </div>
              <h1 className="text-4xl font-bold text-white">Form Preview</h1>
            </div>

            <p className="text-blue-100 text-lg">{formData.title}</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-blue-600"
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
            <p className="text-blue-800 font-medium">
              This is how your form will appear to users. This is a preview-only
              mode.
            </p>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Questions ({formData.questions.length})
          </h2>

          {formData.questions.length > 0 ? (
            formData.questions.map(renderQuestionPreview)
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No questions added yet
              </h3>
              <p className="text-gray-500">Add questions to see the preview.</p>
            </div>
          )}
        </div>

        {/* Footer with Copy Button */}
        <div className="text-center mt-8 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Share?
            </h3>
            <p className="text-gray-600 mb-4">
              Share this link with your audience:
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex-1 max-w-lg">
                <code className="text-sm text-blue-600 font-mono break-all">
                  {`${window.location.origin}/form-fill/${id}`}
                </code>
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-lg transition duration-200 font-medium text-sm cursor-pointer ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-1 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-1 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
