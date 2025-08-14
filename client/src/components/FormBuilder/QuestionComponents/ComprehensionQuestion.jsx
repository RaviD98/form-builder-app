import ImageUpload from "../../common/ImageUpload";
import { formAPI } from "../../../services/api";

const ComprehensionQuestion = ({ question, onUpdate, onRemove }) => {
  // Add safety checks and default values
  const mcqs = question.mcqs || [
    { question: "", options: ["", "", "", ""], correct: 0 },
  ];

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

  const updateMCQ = (mcqIndex, field, value) => {
    const newMCQs = [...mcqs];
    newMCQs[mcqIndex] = {
      ...newMCQs[mcqIndex],
      [field]: value,
    };
    onUpdate({ mcqs: newMCQs });
  };

  const updateMCQOption = (mcqIndex, optionIndex, value) => {
    const newMCQs = [...mcqs];
    if (newMCQs[mcqIndex] && newMCQs[mcqIndex].options) {
      newMCQs[mcqIndex].options[optionIndex] = value;
      onUpdate({ mcqs: newMCQs });
    }
  };

  const addMCQ = () => {
    const newMCQ = {
      question: "",
      options: ["", "", "", ""],
      correct: 0,
    };
    onUpdate({ mcqs: [...mcqs, newMCQ] });
  };

  const removeMCQ = (index) => {
    if (mcqs.length > 1) {
      const newMCQs = mcqs.filter((_, i) => i !== index);
      onUpdate({ mcqs: newMCQs });
    }
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Comprehension Question
              </h3>
              <p className="text-purple-100 text-sm">
                Reading passage with MCQs
              </p>
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
            placeholder="Enter your comprehension question..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
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

        {/* Passage */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Reading Passage
          </label>
          <textarea
            value={question.passage || ""}
            onChange={(e) => onUpdate({ passage: e.target.value })}
            placeholder="Enter the reading passage here..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none"
          />
        </div>

        {/* MCQs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Multiple Choice Questions
            </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {mcqs.length} question{mcqs.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-6">
            {mcqs.map((mcq, mcqIndex) => (
              <div
                key={mcqIndex}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {mcqIndex + 1}
                    </span>
                    Question {mcqIndex + 1}
                  </h4>
                  {mcqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMCQ(mcqIndex)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition duration-200"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={mcq.question || ""}
                    onChange={(e) =>
                      updateMCQ(mcqIndex, "question", e.target.value)
                    }
                    placeholder="Enter the question"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  />

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options:
                    </label>
                    {(mcq.options || ["", "", "", ""]).map(
                      (option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${mcqIndex}`}
                              checked={mcq.correct === optionIndex}
                              onChange={() =>
                                updateMCQ(mcqIndex, "correct", optionIndex)
                              }
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700 w-6">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateMCQOption(
                                  mcqIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${String.fromCharCode(
                                65 + optionIndex
                              )}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                            />
                          </div>
                          {mcq.correct === optionIndex && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Correct
                            </span>
                          )}
                        </div>
                      )
                    )}
                    <div className="text-xs text-gray-600 bg-purple-50 p-2 rounded flex items-center space-x-2">
                      <svg
                        className="h-4 w-4 text-purple-500"
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
                        Select the radio button next to the correct answer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMCQ}
            className="w-full py-3 px-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition duration-200 flex items-center justify-center space-x-2"
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
            <span className="font-medium">Add Question</span>
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-purple-500"
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
            Preview
          </h4>
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
            <p className="font-medium text-gray-900">
              <strong>Question:</strong>{" "}
              {question.question || "Your question here"}
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <strong className="text-gray-900">Passage:</strong>
              <p className="text-gray-700 mt-2 leading-relaxed">
                {question.passage
                  ? question.passage.length > 200
                    ? question.passage.substring(0, 200) + "..."
                    : question.passage
                  : "Reading passage will appear here"}
              </p>
            </div>
            <div className="space-y-3">
              <strong className="text-gray-900">Questions:</strong>
              {mcqs.map((mcq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-3"
                >
                  <p className="font-medium text-gray-900 mb-2">
                    <strong>{index + 1}.</strong>{" "}
                    {mcq.question || `Question ${index + 1}`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(mcq.options || ["", "", "", ""]).map(
                      (option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded text-sm ${
                            optIndex === mcq.correct
                              ? "bg-green-100 text-green-800 font-medium"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}.{" "}
                          {option || `Option ${optIndex + 1}`}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensionQuestion;
