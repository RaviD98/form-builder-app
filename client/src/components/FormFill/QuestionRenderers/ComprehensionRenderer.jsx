import { useState, useEffect } from "react";

const ComprehensionRenderer = ({
  question,
  answer,
  onAnswerChange,
  questionNumber,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // Initialize selected answers
  useEffect(() => {
    const initialAnswers = Array(question.mcqs.length).fill(null);
    setSelectedAnswers(initialAnswers);

    if (!answer || answer.length !== question.mcqs.length) {
      onAnswerChange(initialAnswers);
    }
  }, [question.mcqs]);

  // Update answer when selections change
  useEffect(() => {
    if (selectedAnswers.length > 0) {
      onAnswerChange(selectedAnswers);
    }
  }, [selectedAnswers]);

  const handleAnswerSelect = (mcqIndex, optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[mcqIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const getAnsweredCount = () => {
    return selectedAnswers.filter(
      (answer) => answer !== null && answer !== undefined
    ).length;
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
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
              Question {questionNumber}
            </h3>
            <p className="text-purple-100 text-sm">Reading Comprehension</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Question Text */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-900 mb-4">
            {question.question}
          </p>
          {question.image && (
            <div className="flex justify-center mb-4">
              <img
                src={question.image}
                alt="Question"
                className="max-w-md max-h-64 object-cover rounded-lg shadow-md border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-purple-600"
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
            <p className="text-purple-800 font-medium">
              Instructions: Read the passage carefully and answer the questions
              that follow.
            </p>
          </div>
        </div>

        {/* Reading Passage */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Reading Passage:
          </h4>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
              <p className="text-gray-800 leading-relaxed text-justify">
                {question.passage}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-800 font-medium">Progress</span>
            <span className="text-purple-600 font-semibold">
              {getAnsweredCount()} / {question.mcqs.length} questions answered
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(getAnsweredCount() / question.mcqs.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* MCQ Questions */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Questions based on the passage:
          </h4>

          {question.mcqs.map((mcq, mcqIndex) => (
            <div
              key={mcqIndex}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5"
            >
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {mcqIndex + 1}
                  </span>
                  {mcq.question}
                </h5>
              </div>

              <div className="space-y-3 ml-11">
                {mcq.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                      selectedAnswers[mcqIndex] === optionIndex
                        ? "bg-purple-100 border-purple-300 shadow-md"
                        : "bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`mcq-${questionNumber}-${mcqIndex}`}
                      value={optionIndex}
                      checked={selectedAnswers[mcqIndex] === optionIndex}
                      onChange={() => handleAnswerSelect(mcqIndex, optionIndex)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="ml-3 flex items-center">
                      <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span
                        className={`text-gray-800 ${
                          selectedAnswers[mcqIndex] === optionIndex
                            ? "font-semibold"
                            : ""
                        }`}
                      >
                        {option}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Answer Summary */}
        <div className="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
            <svg
              className="h-5 w-5 mr-2 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Your Answers:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {question.mcqs.map((mcq, index) => (
              <div
                key={index}
                className={`text-center p-2 rounded-lg ${
                  selectedAnswers[index] !== null
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-500 border border-gray-300"
                }`}
              >
                <div className="font-semibold">Q{index + 1}</div>
                <div className="text-sm">
                  {selectedAnswers[index] !== null
                    ? `Option ${String.fromCharCode(
                        65 + selectedAnswers[index]
                      )}`
                    : "Not answered"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensionRenderer;
